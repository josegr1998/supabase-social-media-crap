"use server";

import { createClient } from "@/clients/supabase-server";
import { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export const createReply = async ({
  user,
  replyText,
  parent_comment_id,
  author,
  postId,
}: {
  user: User | null;
  replyText: string;
  parent_comment_id: string;
  author: string;
  postId: string;
}) => {
  if (!user) throw new Error("User not found");

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .insert({
      user_id: user.id,
      content: replyText,
      parent_comment_id,
      author,
      post_id: postId,
    })
    .select();

  if (error) throw new Error(error.message);

  revalidatePath(`/post/${postId}`);

  return data;
};
