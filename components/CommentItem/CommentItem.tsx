"use client";

import React, { useState } from "react";
import { Comment } from "../../types/shared";
import { User } from "@supabase/supabase-js";
import { createReply } from "./CommentItem.actions";

type Props = {
  comment: Comment;
  postId: string;
  user: User | null;
};

export const CommentItem = ({ comment, postId, user }: Props) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const replyText = formData.get("replyText") as string;

    await createReply({
      user,
      replyText,
      parent_comment_id: comment.id,
      author: user?.user_metadata?.user_name || "",
      postId,
    });

    form.reset();
    setIsReplying(false);
  };

  return (
    <div className="pl-4 border-l border-white/10">
      <div className="mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-blue-400">
            {comment.author}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>

        <p className="text-gray-300">{comment.content}</p>

        <button
          onClick={() => setIsReplying(!isReplying)}
          className="text-blue-500 text-sm mt-1"
        >
          {isReplying ? "Cancel" : "Reply"}
        </button>
      </div>

      {isReplying && user && (
        <form onSubmit={handleReplySubmit} className="mb-2">
          <textarea
            rows={2}
            placeholder="Add a comment"
            name="replyText"
            className="w-full border border-white/10 bg-transparent p-2 rounded"
          />
          <button
            type="submit"
            className="mt-1 bg-blue-500 text-white px-3 py-1 rounded"
          >
            Post Reply
          </button>
        </form>
      )}

      {comment.children?.length > 0 && (
        <div className="ml-4">
          <button
            onClick={() => setShowReplies((prev) => !prev)}
            title={showReplies ? "Hide Replies" : "Show Replies"}
          >
            {showReplies ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            )}
          </button>
          {!showReplies && (
            <div className="space-y-2">
              {comment.children.map((child) => (
                <CommentItem
                  key={child.id}
                  comment={child}
                  postId={postId}
                  user={user}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
