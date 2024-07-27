"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { useRouter } from "next/navigation";
import { handleRequest } from "@/lib/auth-helpers/client";
import { SignOut } from "@/lib/auth-helpers/server";
import { getRedirectMethod } from "@/lib/utils";
import { Button } from "./ui/Button";
import { type User } from "@supabase/supabase-js";

interface Props {
  user: User | null;
}

export default function UserDropdown(props: Props) {
  const userName = (props.user?.user_metadata?.full_name ||
    props.user?.email ||
    "User") as string;
  const userInitials = userName
    .split(" ")
    .map((name) => name[0])
    .join("");

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = getRedirectMethod() === "client" ? useRouter() : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage
              src={props.user?.user_metadata.avatar_url}
              alt="@shadcn"
            />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {props.user !== null ? (
          <DropdownMenuItem>
            <p>{props.user.email}</p>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {props.user !== null ? (
            <form onClick={(e) => handleRequest(e, SignOut, router)}>
              <button type="button">Sign out</button>
            </form>
          ) : null}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
