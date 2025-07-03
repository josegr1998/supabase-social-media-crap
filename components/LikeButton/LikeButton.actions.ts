"use server";

import { supabase } from "@/clients/supabase-client";
import { revalidateCommunityPage } from "@/actions/revalidateCommunityPage";

export const getVotes = async (postId: string) => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);

  return data;
};

const deleteVote = async (voteId: string) => {
  const { error } = await supabase.from("votes").delete().eq("id", voteId);
  if (error) throw new Error(error.message);
};

const updateVote = async ({
  voteId,
  voteValue,
}: {
  voteId: string;
  voteValue: number;
}) => {
  const { error } = await supabase
    .from("votes")
    .update({ vote: voteValue })
    .eq("id", voteId);

  if (error) throw new Error(error.message);
};

const addVote = async ({
  postId,
  userId,
  voteValue,
}: {
  postId: string;
  userId: string;
  voteValue: number;
}) => {
  const { error } = await supabase
    .from("votes")
    .insert({ post_id: postId, user_id: userId, vote: voteValue });
  if (error) throw new Error(error.message);
};

export const vote = async ({
  postId,
  userId,
  voteValue,
  communityId,
}: {
  postId: string;
  userId?: string;
  voteValue: number;
  communityId: string;
}) => {
  if (!userId) throw new Error("You must be logged in to vote");

  const { data: existingVote, error: existingVoteError } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVoteError) throw new Error(existingVoteError.message);

  if (!existingVote) {
    addVote({ postId, userId, voteValue });
    revalidateCommunityPage(communityId);
    return;
  }

  if (existingVote?.vote === voteValue) {
    deleteVote(existingVote.id);
    revalidateCommunityPage(communityId);
    return;
  }

  updateVote({ voteId: existingVote.id, voteValue });
  revalidateCommunityPage(communityId);
  return;
};
