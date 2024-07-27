import { type SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

/**
 * Get the current authenticated user.
 * @param supabase - Supabase client instance.
 * @returns The authenticated user.
 */
export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * Fetch all messages from the database.
 * @param supabase - Supabase client instance.
 * @returns List of messages.
 */
export const getMessages = cache(async (supabase: SupabaseClient) => {
  const { data: messages } = await supabase.from("messages").select("*");
  return messages;
});

/**
 * Fetch all questions and answers from the database.
 * @param supabase - Supabase client instance.
 * @returns List of questions and answers.
 */
export const getQAndA = cache(async (supabase: SupabaseClient) => {
  const { data: questionsAndAnswers } = await supabase
    .from("q-and-a")
    .select("*");
  return questionsAndAnswers;
});

/**
 * Insert a new message into the database.
 * @param supabase - Supabase client instance.
 * @param raw - Raw message content.
 * @param domain - Domain of the message.
 * @param embedding - Embedding of the message.
 * @returns Inserted message data.
 * @throws Error if user is not found or insert fails.
 */
export const insertMessage = async (
  supabase: SupabaseClient,
  raw: string,
  origin: string,
  host: string,
  embedding: number[],
) => {
  const user = await getUser(supabase);
  if (!user) throw new Error("User not found");
  const { data, error } = await supabase.from("messages").upsert({
    raw,
    origin,
    embedding,
    host,
    user_id: user.id,
  });
  if (error) {
    throw error;
  } else {
    return data;
  }
};

/**
 * Insert a new question and answer into the database.
 * @param supabase - Supabase client instance.
 * @param question - The question content.
 * @param answer - The answer content.
 * @returns Inserted question and answer data.
 * @throws Error if user is not found or insert fails.
 */
export const insertQuestionAnswer = async (
  supabase: SupabaseClient,
  question: string,
  answer: string,
) => {
  const user = await getUser(supabase);
  if (!user) throw new Error("User not found");
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
};

/**
 * Fetch the most recently revised message with a link.
 * @param supabase - Supabase client instance.
 * @returns The most recently revised message.
 * @throws Error if query fails.
 */
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

export const getAllMessagesByLink = cache(
  async (supabase: SupabaseClient, origin: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("origin", origin);
    if (error) {
      throw error;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data;
  },
);

/**
 * Update the revised_at timestamp of a message by its ID.
 * @param supabase - Supabase client instance.
 * @param id - ID of the message to update.
 * @returns Updated message data.
 * @throws Error if user is not found or update fails.
 */
export const updateMsgRevisedAt = async (
  supabase: SupabaseClient,
  id: string,
) => {
  const user = await getUser(supabase);
  if (!user) throw new Error("User not found");
  const { data, error } = await supabase
    .from("messages")
    .update({ revised_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
  return data;
};

export const getLinks = cache(async (supabase: SupabaseClient) => {
  const { data, error } = await supabase.from("messages").select("origin");
  if (error) {
    throw error;
  } else {
    return data;
  }
});
