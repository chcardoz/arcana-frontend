import { getMessages } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createClient();
  const [messages] = await Promise.all([getMessages(supabase)]);

  return <>{messages?.map((message, idx) => <p key={idx}>{message.raw}</p>)}</>;
}
