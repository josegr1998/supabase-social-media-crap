"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../clients/supabase-client";
import { User } from "@supabase/supabase-js";
import { Comment } from "../../types/shared";
import { CommentItem } from "../CommentItem/CommentItem";
import { revalidateCommunityPage } from "@/actions/revalidateCommunityPage";

type Props = {
  postId: string;
  communityId: string;
};

type NewComment = {
  parent_comment_id: string | null;
  postId: string;
  user: User;
  newCommentText: string;
  author: string;
};

const createCommentMutation = async ({
  parent_comment_id,
  postId,
  user,
  newCommentText,
  author,
}: NewComment) => {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: user.id,
      content: newCommentText,
      parent_comment_id: parent_comment_id || null,
      author,
    })
    .select();

  if (error) throw new Error(error.message);

  return data;
};

const getCommentsQuery = async ({ postId }: { postId: string }) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

export const CommentSection = ({ postId, communityId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newCommentText, setNewCommentText] = useState("");

  const {
    mutate: addComment,
    isPending,
    isError,
  } = useMutation({
    mutationFn: createCommentMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      revalidateCommunityPage(communityId);
    },
  });

  const { data: comments, isLoading } = useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsQuery({ postId }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    addComment({
      parent_comment_id: null,
      postId,
      user,
      newCommentText,
      author: user.user_metadata.user_name,
    });

    setNewCommentText("");
  };

  const buildCommentTree = (
    flatComments: Comment[]
  ): (Comment & { children: Comment[] })[] => {
    console.log("flatComments ->", flatComments);

    const commentMap = new Map<string, Comment & { children: Comment[] }>();

    const roots: (Comment & { children: Comment[] })[] = [];

    flatComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          parent.children.push(commentMap.get(comment.id)!);
        }
      } else {
        roots.push(commentMap.get(comment.id)!);
      }
    });

    return roots;
  };

  const commentTree = buildCommentTree(comments || []);

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold mb-4">Comments</h3>

      {isLoading && <div>Loading comments...</div>}

      {comments && comments.length === 0 && (
        <p className="text-gray-500">No comments yet.</p>
      )}

      {user ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            rows={3}
            placeholder="Add a comment"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full border border-white/10 bg-transparent p-2 rounded"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim() || isPending}
            className="mt-2 bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            {isPending ? "Posting..." : "Post"}
          </button>
          {isError && (
            <p className="mb-4 text-gray-600">Error posting comment.</p>
          )}
        </form>
      ) : (
        <p>You must be logged in to write a comment</p>
      )}

      <div>
        {commentTree.map((comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};
