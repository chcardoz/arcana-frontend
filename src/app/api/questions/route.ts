import { type NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import {
  getLastRevisedMessageWithLink,
  updateMessageRevisedAtById,
} from "@/lib/supabase/queries";
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

export async function GET(request: NextRequest) {
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
      console.log("Cookies do not match");
      return new Response("Could not validate user", { status: 400 });
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

    await updateMessageRevisedAtById(supabase, messages[0].id as string);
    return NextResponse.json(
      {
        question: choices[0].message.content,
        url: messages[0].domain,
      },
      { status: 200 },
    );
  } catch (e: unknown) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
