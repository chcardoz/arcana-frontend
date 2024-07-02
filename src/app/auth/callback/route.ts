import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      // Pass Supabase URL and anonymous key from the environment to the client
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

      // Define a cookies object with methods for interacting with the cookie store and pass it to the client
      {
        cookies: {
          // retrieve a cookie by its name
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          // set a cookie with a given name, value, and options
          set(name: string, value: string, options: CookieOptions) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set({ name, value, ...options });
          },
          // delete a cookie by its name
          remove(name: string, options: CookieOptions) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set({ name, value: "", ...options });
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If the code is invalid, redirect to the error page
  return NextResponse.redirect(
    `${origin}/login?message=Could not login with provider`,
  );
}
