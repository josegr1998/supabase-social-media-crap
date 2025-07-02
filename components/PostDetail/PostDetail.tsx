"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Post } from "../../types/shared";
import { supabase } from "../../clients/supabase-client";
import Image from "next/image";
import { LikeButton } from "../LikeButton/LikeButton";
import { CommentSection } from "../CommentSection/CommentSection";

type Props = {
  id: string;
};

export const PostDetail = ({ id }: Props) => {
  //TODO Move this crap to the server side
  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post, Error>({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  if (!post) return <div>Post not found</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {post.title}
      </h2>
      <Image
        src={post.image_url}
        alt={post.title}
        width={0}
        height={0}
        sizes="100vw"
        className="mt-4 rounded object-cover w-full h-64"
      />

      <p className="text-gray-400">{post.content}</p>

      <p className="text-gray-500 text-sm">
        Posted on: {new Date(post.created_at).toLocaleDateString()}
      </p>

      <LikeButton postId={post.id} communityId={post.community_id} />

      <CommentSection postId={post.id} communityId={post.community_id} />
    </div>
  );
};
