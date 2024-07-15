"use server";
import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/utils";
import { type Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function oAuthSignIn(formData: FormData) {
  const provider = formData.get("provider") as Provider;

  if (!provider) {
    return redirect("/login?message=No provider selected");
  }

  const supabase = createClient();
  const redirectUrl = getURL("/auth/callback");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    redirect("/login?message=Could not authenticate user");
  }

  return redirect(data.url);
}

export async function signOut(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return redirect(`/login/message=Could not sign out`);
  }
  console.log("Signed out");
  return redirect("/login");
}
