import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

export default function HomePage() {
  return (
    <main className="">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      Hello world
    </main>
  );
}
