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
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            prefetch={false}
          >
            <Package2Icon className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">KeepAlive</span>
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
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <SheetDescription className="hidden">Mobile Menu</SheetDescription>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
