import { getUser } from "@/lib/supabase/queries";
import { Button } from "../ui/Button";
import { createClient } from "@/lib/supabase/server";

export default async function LandingNavbar() {
  const supabase = createClient();
  const user = await getUser(supabase);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 m-5 h-[4rem]">
      <div className="flex h-full items-center justify-between rounded-xl border-2 bg-white/80 p-6 backdrop-blur-md md:p-8">
        <h1 className="font-display text-xl font-bold md:text-4xl">
          keepalive
        </h1>
        {user !== null ? (
          <Button>Dashboard</Button>
        ) : (
          <Button>Get Started</Button>
        )}
      </div>
    </header>
  );
}
