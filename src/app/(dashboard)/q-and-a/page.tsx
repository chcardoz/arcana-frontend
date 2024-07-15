import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { getQuestionsAndAnswers } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export default async function QAPage() {
  const supabase = createClient();
  const [questionAnswers] = await Promise.all([
    getQuestionsAndAnswers(supabase),
  ]);

  return (
    <Table>
      <TableCaption>Questions and Answers</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/2">Question</TableHead>
          <TableHead>Answer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questionAnswers?.map((qAndA, idx) => (
          <TableRow key={idx}>
            <TableCell>{qAndA.question}</TableCell>
            <TableCell>{qAndA.answer}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
