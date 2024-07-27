import {
  PanelLeftIcon,
  Package2Icon,
  Scissors,
  BookMarked,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import Link from "next/link";

export default function MobileSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeftIcon className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <SheetTitle className="hidden">Menu</SheetTitle>
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            prefetch={false}
          >
            <span className="font-display text-sm font-bold">ka</span>
          </Link>
          <Link
            href="/snippets"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <Scissors className="h-5 w-5" />
            Snippets
          </Link>
          <Link
            href="/q-and-a"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <BookMarked className="h-5 w-5" />
            Question Answers
          </Link>
          <SheetDescription className="hidden">Mobile Menu</SheetDescription>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
