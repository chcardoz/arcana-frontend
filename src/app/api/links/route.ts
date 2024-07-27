import { type NextRequest, NextResponse } from "next/server";
import { getLinks } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { checkCookies, checkRateLimit } from "@/lib/auth-helpers/server";

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
    const data = await getLinks(supabase);
    const linkString = data.map((link) => String(link.origin)).join("<>");

    return NextResponse.json(
      {
        linkString: linkString,
      },
      { status: 200 },
    );
  } catch (e: unknown) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
