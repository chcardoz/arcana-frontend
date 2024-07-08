import { type SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getMessages = cache(async (supabase: SupabaseClient) => {
  const { data: messages } = await supabase.from("messages").select("*");

  return messages;
});

export const insertMessage = async (
  supabase: SupabaseClient,
  raw: string,
  domain: string,
  embedding: number[],
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data, error } = await supabase.from("messages").upsert({
      raw,
      domain,
      embedding,
      user_id: user.id,
    });
    if (error) {
      throw error;
    } else {
      return data;
    }
  } else {
    throw new Error("User not found");
  }
};
