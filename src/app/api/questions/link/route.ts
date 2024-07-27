import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import {
  getAllMessagesByLink,
  updateMsgRevisedAt,
} from "@/lib/supabase/queries";
import { z } from "zod";
import { checkCookies, checkRateLimit } from "@/lib/auth-helpers/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const requestSchema = z.object({
  url: z.string().url("Invalid URL format"),
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
      return NextResponse.json({
        error: "Invalid request format",
        next: "https://localhost:3000/login",
        status: 400,
      });
    }

    const { url } = parsedContent.data;
    const supabase = createClient();
    const messages = await getAllMessagesByLink(supabase, url);

    if (!messages[0]?.raw) {
      return NextResponse.json(
        {
          question:
            "You have not provided any text yet. Please provide save a snippet of text and try again.",
        },
        { status: 200 },
      );
    }

    //Select a random message from the list
    const randomIndex = Math.floor(Math.random() * messages.length);
    const randomMessage = messages[randomIndex];

    const { choices } = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            'You are a helpful program, when given a excerpt of text ("snippet") provided by the user, you respond with a question that will use the contents of that text, not using any other information, to test the knowledge of the user',
        },
        { role: "user", content: randomMessage.raw as string },
      ],
      model: "gpt-3.5-turbo-0125",
      temperature: 0.8,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (!choices[0]?.message?.content) {
      return NextResponse.json(
        {
          error: "Could not generate question. Please try again later.",
        },
        { status: 500 },
      );
    }

    await updateMsgRevisedAt(supabase, messages[randomIndex].id as string);
    return NextResponse.json(
      {
        question: choices[0].message.content,
        link: messages[randomIndex].origin,
        correctAnswer: messages[randomIndex].raw,
      },
      { status: 200 },
    );
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
