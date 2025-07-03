"use client";

import React from "react";
import { vote } from "./LikeButton.actions";

type VoteType = "like" | "dislike";

type Props = {
  postId: string;
  communityId: string;
  userId?: string;
  userVote: number;
  likes?: number;
  dislikes?: number;
  type: VoteType;
};

const LikeButton = ({
  postId,
  communityId,
  userId,
  userVote,
  likes,
}: Props) => {
  return (
    <button
      onClick={() => vote({ postId, voteValue: 1, userId, communityId })}
      className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
        userVote === 1 ? "bg-green-500 text-white" : "bg-gray-200 text-black"
      }`}
    >
      👍 {likes}
    </button>
  );
};

const DislikeButton = ({
  postId,
  communityId,
  userId,
  userVote,
  dislikes,
}: Props) => {
  return (
    <button
      onClick={() =>
        vote({
          postId,
          voteValue: -1,
          userId,
          communityId,
        })
      }
      className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
        userVote === -1 ? "bg-red-500 text-white" : "bg-gray-200 text-black"
      }`}
    >
      👎 {dislikes}
    </button>
  );
};

const BUTTONS = {
  like: LikeButton,
  dislike: DislikeButton,
} as const satisfies Record<VoteType, React.ComponentType<Props>>;

export const VoteButtonClient = (props: Props) => {
  const VoteButton = BUTTONS[props.type];

  return <VoteButton {...props} />;
};
