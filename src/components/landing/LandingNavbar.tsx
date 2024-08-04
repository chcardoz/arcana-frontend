import { Button } from "../ui/Button";
import Link from "next/link";

export default async function LandingNavbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-[4rem] md:mx-8">
      <div className="flex h-full items-center justify-between bg-white/60 p-10 backdrop-blur-md dark:bg-black">
        <h1 className="font-display text-xl font-bold md:text-4xl dark:text-white">
          keepalive
        </h1>
        <Link href="https://tally.so/r/w4LQld">
          <Button variant="secondary">Join Waitlist</Button>
        </Link>
      </div>
    </header>
  );
}
