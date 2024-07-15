import { type NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";
import { insertQuestionAnswer } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
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

// Define the Zod schema
const requestSchema = z.object({
  question: z.string().min(1, "Text cannot be empty"),
  answer: z.string().min(1, "Text cannot be empty"),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip ?? "127.0.0.1";
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
    const reqCookies = request.cookies.getAll();
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

    const content = await request.json();
    const parsedContent = requestSchema.safeParse(content);

    if (!parsedContent.success) {
      console.log("Invalid request format: ", parsedContent.error);
      return new Response("Invalid request format", { status: 400 });
    }

    const { question, answer } = parsedContent.data;
    const supabase = createClient();
    await insertQuestionAnswer(supabase, question, answer);

    return NextResponse.json(
      {
        output: "Question and answer received on the server",
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
