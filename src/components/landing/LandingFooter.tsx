import { Twitter, Youtube } from "lucide-react";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto w-full px-8 py-6 lg:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024{" "}
            <Link href="/" className="hover:underline">
              Keepalive™
            </Link>
            . All Rights Reserved.
          </span>
          <div className="mt-4 flex sm:mt-0 sm:justify-center">
            <Link
              href="https://twitter.com/"
              className="ms-5 text-gray-500 hover:text-gray-900 dark:hover:text-white"
              prefetch={false}
            >
              <Twitter />
              <span className="sr-only">Twitter page</span>
            </Link>
            <Link
              href="https://www.youtube.com/"
              className="ms-5 text-gray-500 hover:text-gray-900 dark:hover:text-white"
              prefetch={false}
            >
              <Youtube />
              <span className="sr-only">Youtube</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
