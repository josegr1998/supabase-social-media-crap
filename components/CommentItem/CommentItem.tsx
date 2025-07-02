import React, { useState } from "react";
import { Comment } from "../../types/shared";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import { supabase } from "../../clients/supabase-client";

type Props = {
  comment: Comment;
  postId: string;
};

type NewComment = {
  parent_comment_id: string;
  postId: string;
  user: User;
  replyText: string;
  author: string;
};

const createReplyMutation = async ({
  parent_comment_id,
  postId,
  user,
  replyText,
  author,
}: NewComment) => {
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

  return data;
};

export const CommentItem = ({ comment, postId }: Props) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    mutate: addReply,
    isPending,
    isError,
  } = useMutation({
    mutationFn: createReplyMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setIsReplying(false);
      setReplyText("");
    },
  });

  const handleReplySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    addReply({
      parent_comment_id: comment.id,
      postId,
      user,
      replyText,
      author: user.user_metadata.user_name,
    });
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
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full border border-white/10 bg-transparent p-2 rounded"
          />
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="mt-1 bg-blue-500 text-white px-3 py-1 rounded"
          >
            {isPending ? "Posting..." : "Post Reply"}
          </button>
          {isError && <p className="text-red-500">Error posting reply.</p>}
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
                <CommentItem key={child.id} comment={child} postId={postId} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
