import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import {
  getLastRevisedMessageWithLink,
  updateMsgRevisedAt,
} from "@/lib/supabase/queries";
import { checkCookies, checkRateLimit } from "@/lib/auth-helpers/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
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

    const supabase = createClient();
    const messages = await getLastRevisedMessageWithLink(supabase);

    if (!messages[0]?.raw) {
      return NextResponse.json(
        {
          question:
            "You have not provided any text yet. Please provide save a snippet of text and try again.",
        },
        { status: 200 },
      );
    }
    const { choices } = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            'You are a helpful program, when given a excerpt of text ("snippet") provided by the user, you respond with a question that will use the contents of that text, not using any other information, to test the knowledge of the user',
        },
        { role: "user", content: messages[0].raw as string },
      ],
      model: "gpt-3.5-turbo-0125",
      temperature: 0.9,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (!choices[0]?.message?.content) {
      return NextResponse.json(
        {
          error: "Could not generate question",
        },
        { status: 500 },
      );
    }

    await updateMsgRevisedAt(supabase, messages[0].id as string);
    return NextResponse.json(
      {
        question: choices[0].message.content,
        link: messages[0].domain,
      },
      { status: 200 },
    );
  } catch (e: unknown) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
