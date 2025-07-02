"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { supabase } from "../../clients/supabase-client";
import { useAuth } from "../../context/AuthContext";
import { Vote } from "../../types/shared";
import { revalidateCommunityPage } from "@/actions/revalidateCommunityPage";

type Props = {
  postId: string;
  communityId: string;
};

const voteMutation = async ({
  voteValue,
  postId,
  userId,
}: {
  voteValue: number;
  postId: string;
  userId?: string;
}) => {
  if (!userId) throw new Error("You must be logged in to vote");

  const { data: existingVote, error: voteError } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (voteError) throw new Error(voteError.message);

  if (existingVote?.vote === voteValue) {
    const { error } = await supabase
      .from("votes")
      .delete()
      .eq("id", existingVote.id);

    if (error) throw new Error(error.message);

    return;
  } else if (existingVote) {
    const { error } = await supabase
      .from("votes")
      .update({ vote: voteValue })
      .eq("id", existingVote.id);

    if (error) throw new Error(error.message);

    return;
  }

  const { error } = await supabase
    .from("votes")
    .insert({ post_id: postId, user_id: userId, vote: voteValue });

  if (error) throw new Error(error.message);
};

const getVotesQuery = async ({
  postId,
}: {
  postId: string;
}): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);

  return data;
};

export const LikeButton = ({ postId, communityId }: Props) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { mutate: vote, error } = useMutation({
    mutationFn: voteMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", postId] });
      revalidateCommunityPage(communityId);
    },
  });

  const { data: votes, error: getVotesError } = useQuery<Vote[], Error>({
    queryKey: ["votes", postId],
    queryFn: () => getVotesQuery({ postId }),
  });

  if (error) return <div>Error: {error.message}</div>;
  if (getVotesError) return <div>Error: {getVotesError.message}</div>;

  const likes = votes?.filter((vote) => vote.vote === 1).length;
  const dislikes = votes?.filter((vote) => vote.vote === -1).length;
  const userVote = votes?.find((vote) => vote.user_id === user?.id)?.vote;

  return (
    <div className="flex items-center space-x-4 my-4">
      <button
        onClick={() => vote({ postId, voteValue: 1, userId: user?.id })}
        className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
          userVote === 1 ? "bg-green-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👍 {likes}
      </button>
      <button
        onClick={() =>
          vote({
            postId,
            voteValue: -1,
            userId: user?.id,
          })
        }
        className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
          userVote === -1 ? "bg-red-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👎 {dislikes}
      </button>
    </div>
  );
};
