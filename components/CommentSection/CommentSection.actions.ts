"use server";

import { createClient } from "@/clients/supabase-server";
import { revalidatePath } from "next/cache";

export const getComments = async (postId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

export const createComment = async (formData: FormData) => {
  const postId = formData.get("postId") as string;
  const newCommentText = formData.get("newCommentText") as string;
  const author = formData.get("author") as string;
  const parent_comment_id = formData.get("parent_comment_id") || null;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    throw new Error("User not authenticated");
  }

  await supabase.from("comments").insert({
    post_id: postId,
    content: newCommentText,
    author,
    parent_comment_id,
    user_id: user.id,
  });

  revalidatePath(`/post/${postId}`);
};
