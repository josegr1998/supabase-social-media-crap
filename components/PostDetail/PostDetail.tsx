import React from "react";
import Image from "next/image";
import { LikeButton } from "../LikeButton/LikeButton";
import { CommentSection } from "../CommentSection/CommentSection";
import { getPostById } from "@/actions/getPostsById";

type Props = {
  id: string;
};

export const PostDetail = async ({ id }: Props) => {
  const post = await getPostById(id);

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
