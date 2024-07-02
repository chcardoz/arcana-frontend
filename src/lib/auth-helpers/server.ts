"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function SignOut(formData: FormData) {
  const pathName = String(formData.get("pathName")).trim();

  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return `/${pathName}?message=${error.message}`;
  }

  return "/login";
}
