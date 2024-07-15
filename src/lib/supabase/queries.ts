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

export const getQuestionsAndAnswers = cache(
  async (supabase: SupabaseClient) => {
    const { data: questionsAndAnswers } = await supabase
      .from("q-and-a")
      .select("*");

    return questionsAndAnswers;
  },
);

export const insertMessage = async (
  supabase: SupabaseClient,
  raw: string,
  domain: string,
  embedding: number[],
) => {
  const user = await getUser(supabase);

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

export const insertQuestionAnswer = async (
  supabase: SupabaseClient,
  question: string,
  answer: string,
) => {
  const user = await getUser(supabase);

  if (user) {
    const { data, error } = await supabase.from("q-and-a").upsert({
      question,
      answer,
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

export const getLastRevisedMessageWithLink = cache(
  async (supabase: SupabaseClient) => {
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .order("revised_at", { ascending: false })
      .limit(1);

    if (error) {
      throw error;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return messages;
    }
  },
);

export const updateMessageRevisedAtById = async (
  supabase: SupabaseClient,
  id: string,
) => {
  const user = await getUser(supabase);

  if (user) {
    const { data, error } = await supabase
      .from("messages")
      .update({
        revised_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      throw error;
    } else {
      return data;
    }
  } else {
    throw new Error("User not found");
  }
};
