import React from "react";
import { createClient } from "@/clients/supabase-server";
import { getVotes } from "./LikeButton.actions";
import { VoteButtonClient } from "./VoteButtonClient";

type Props = {
  postId: string;
  communityId: string;
};

export const LikeButton = async ({ postId, communityId }: Props) => {
  const supabase = await createClient();

  const data = await supabase.auth.getUser();

  const votes = await getVotes(postId);

  const likes = votes?.filter((vote) => vote.vote === 1).length;
  const dislikes = votes?.filter((vote) => vote.vote === -1).length;
  const userVote = votes?.find(
    (vote) => vote.user_id === data.data.user?.id
  )?.vote;

  return (
    <div className="flex items-center space-x-4 my-4">
      <VoteButtonClient
        postId={postId}
        communityId={communityId}
        userVote={userVote}
        likes={likes}
        type="like"
      />

      <VoteButtonClient
        postId={postId}
        communityId={communityId}
        userVote={userVote}
        dislikes={dislikes}
        type="dislike"
      />
    </div>
  );
};
