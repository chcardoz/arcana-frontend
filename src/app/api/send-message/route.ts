import { type NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import OpenAI from "openai";
import { cookies } from "next/headers";
import { insertMessage } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { isWithinTokenLimit } from "gpt-tokenizer";
import { z } from "zod";
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the Zod schema
const requestSchema = z.object({
  text: z.string().min(1, "Text cannot be empty"),
  domain: z.string().url("Invalid URL format"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip ?? "127.0.0.1";
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }

    const reqCookies = req.cookies.getAll();
    const cookieStore = cookies();

    let cookiesMatch = true;
    for (const cookie of reqCookies) {
      const storedCookieValue = cookieStore.get(cookie.name)?.value;
      if (cookie.value !== storedCookieValue) {
        cookiesMatch = false;
        break;
      }
    }

    if (!cookiesMatch) {
      return new Response("Could not validate user", { status: 400 });
    }

    const content = await req.json();
    const parsedContent = requestSchema.safeParse(content);

    if (!parsedContent.success) {
      console.log("Invalid request format: ", parsedContent.error);
      return new Response("Invalid request format", { status: 400 });
    }

    const { text, domain } = parsedContent.data;
    const supabase = createClient();

    const withinTokenLimit = isWithinTokenLimit(text, 200);

    if (!withinTokenLimit) {
      return new Response("Message too long", { status: 400 });
    }

    const { data } = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: "The quick brown fox jumped over the lazy dog",
      encoding_format: "float",
    });

    if (!data[0]?.embedding) {
      return new Response("Failed to get embedding", { status: 500 });
    }

    await insertMessage(supabase, text, domain, data[0].embedding);

    return NextResponse.json(
      {
        output: "Message received on the server",
      },
      { status: 200 },
    );
  } catch (e: unknown) {
    console.log("Error: ", e);
    return NextResponse.json(
      { error: "Could not process request" },
      { status: 500 },
    );
  }
}
