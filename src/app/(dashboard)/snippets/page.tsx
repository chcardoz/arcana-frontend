import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { getMessages } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { z } from "zod";

const snippetSchema = z.object({
  id: z.string(),
  raw: z.string(),
  origin: z.string(),
  host: z.string(),
});

export default async function SnippetsPage() {
  const supabase = createClient();
  const [snippets] = await Promise.all([getMessages(supabase)]);

  return (
    <Table>
      <TableCaption>Snippets captured from extension</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/2">Message</TableHead>
          <TableHead>Link</TableHead>
          <TableHead>Last Revised</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {snippets?.map((snippet, idx) => (
          <TableRow key={idx}>
            <TableCell>{snippet.raw}</TableCell>
            <TableCell>
              <Link href={snippet.origin} target="_blank" rel="noreferrer">
                {snippet.origin}
              </Link>
            </TableCell>
            <TableCell>{snippet.revised_at}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
