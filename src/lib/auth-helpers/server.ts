"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { type NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function SignOut(formData: FormData) {
  const pathName = String(formData.get("pathName")).trim();

  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return `/${pathName}?message=${error.message}`;
  }

  return "/login";
}

export async function AnonymousSignIn(formData: FormData) {
  const f = String(formData.get("firstTime")).trim();

  console.log("Anonymous SignIn form firsttime: ", f);
  if (f === "true") {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInAnonymously();
    console.log("AnonymousSignIn data: ", data);
    console.log("AnonymousSignIn error: ", error);

    if (error) {
      return "/snippets?message=" + error.message;
    }
  }

  return "/snippets";
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
});

export async function checkRateLimit(ip: string) {
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);
  if (!success) {
    return {
      status: 429,
      error: "You have reached your request limit for the day.",
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    };
  }
  return null;
}

export async function checkCookies(req: NextRequest) {
  const reqCookies = req.cookies.getAll();
  const cookieStore = cookies();

  if (!reqCookies.length) {
    return {
      status: 308,
      error: "Looks like you are not logged in. Please login to continue",
      next: "https://localhost:3000/login",
    };
  }

  for (const cookie of reqCookies) {
    const storedCookieValue = cookieStore.get(cookie.name)?.value;
    if (cookie.value !== storedCookieValue) {
      return {
        status: 308,
        error:
          "Looks like you are not logged in. Please log in to continue. Redirecting you to login page.",
        next: "https://localhost:3000/login",
      };
    }
  }

  return null;
}
