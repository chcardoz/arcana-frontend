import Link from "next/link";
import { headers } from "next/headers";

export default async function NotFound() {
  const headersList = headers();
  const domain = headersList.get("host");
  return (
    <div>
      <h2>Not Found: {domain?.toString()}</h2>
      <p>Could not find requested resource</p>
      <p>
        <Link href="/">Return Home</Link>
      </p>
    </div>
  );
}
