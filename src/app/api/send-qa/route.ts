import { type NextRequest, NextResponse } from "next/server";
import { insertQuestionAnswer } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { checkCookies, checkRateLimit } from "@/lib/auth-helpers/server";

// Define the Zod schema
const requestSchema = z.object({
  question: z.string().min(1, "Text cannot be empty"),
  answer: z.string().min(1, "Text cannot be empty"),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip ?? "127.0.0.1";
    const rateLimitError = await checkRateLimit(ip);
    if (rateLimitError) {
      return NextResponse.json(rateLimitError, {
        status: rateLimitError.status,
      });
    }

    const cookieError = await checkCookies(request);
    if (cookieError) {
      return NextResponse.json(cookieError, { status: cookieError.status });
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
