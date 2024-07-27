import { getUser } from "@/lib/supabase/queries";
import { Button } from "../ui/Button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function LandingNavbar() {
  const supabase = createClient();
  const user = await getUser(supabase);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 m-5 h-[4rem] ">
      <div className="light:border-2 flex h-full items-center justify-between rounded-xl bg-white/60 p-6 shadow-md backdrop-blur-md md:p-8 dark:bg-gray-700/80">
        <h1 className="font-display text-xl font-bold md:text-4xl dark:text-white">
          keepalive
        </h1>
        {user !== null ? (
          <Link href="/snippets">
            <Button>Dashboard</Button>
          </Link>
        ) : (
          <Link href="/instructions">
            <Button>Download</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
