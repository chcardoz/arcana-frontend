import {
  PanelLeftIcon,
  Package2Icon,
  HomeIcon,
  ShoppingCartIcon,
  PackageIcon,
  LineChartIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
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
          <Link
            href="#"
            className="bg-primary text-primary-foreground group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:text-base"
            prefetch={false}
          >
            <Package2Icon className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
            prefetch={false}
          >
            <HomeIcon className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-foreground flex items-center gap-4 px-2.5"
            prefetch={false}
          >
            <ShoppingCartIcon className="h-5 w-5" />
            Orders
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
            prefetch={false}
          >
            <PackageIcon className="h-5 w-5" />
            Products
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
            prefetch={false}
          >
            <UsersIcon className="h-5 w-5" />
            Customers
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
            prefetch={false}
          >
            <LineChartIcon className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
