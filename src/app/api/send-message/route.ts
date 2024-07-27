import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { insertMessage } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { isWithinTokenLimit } from "gpt-tokenizer";
import { z } from "zod";
import { checkCookies, checkRateLimit } from "@/lib/auth-helpers/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the Zod schema
const requestSchema = z.object({
  text: z.string().min(1, "Text cannot be empty"),
  host: z.string().min(1, "Host cannot be empty"),
  path: z.string().min(1, "Path cannot be empty"),
  origin: z.string().url("Invalid URL format"),
  href: z.string().url("Invalid URL format"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip ?? "127.0.0.1";
    const rateLimitError = await checkRateLimit(ip);
    if (rateLimitError) {
      return NextResponse.json(rateLimitError, {
        status: rateLimitError.status,
      });
    }

    const cookieError = await checkCookies(req);
    if (cookieError) {
      return NextResponse.json(cookieError, { status: cookieError.status });
    }

    const content = await req.json();
    const parsedContent = requestSchema.safeParse(content);

    if (!parsedContent.success) {
      console.log("Invalid request format: ", parsedContent.error);
      return NextResponse.json({
        error: "Invalid request format",
        next: "https://localhost:3000/login",
        status: 400,
      });
    }

    const { text, origin, href } = parsedContent.data;
    const supabase = createClient();

    const withinTokenLimit = isWithinTokenLimit(text, 200);

    if (!withinTokenLimit) {
      return NextResponse.json({
        error:
          "Message is not within token limit of 200. Please select a shorter message.",
        status: 400,
      });
    }

    const { data } = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });

    if (!data[0]?.embedding) {
      return NextResponse.json({
        error: "Internal server error. Please try again later.",
        next: "https://localhost:3000/login",
        status: 500,
      });
    }

    await insertMessage(supabase, text, href, origin, data[0].embedding);

    return NextResponse.json(
      {
        data: "Message received on the server",
        next: origin,
      },
      { status: 200 },
    );
  } catch (e: unknown) {
    console.warn(e);
    return NextResponse.json(
      {
        error: "Internal server error. Please try again later.",
        next: "https://localhost:3000/login",
      },
      { status: 500 },
    );
  }
}
