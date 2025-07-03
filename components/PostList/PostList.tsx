import React from "react";
import { PostItem } from "../PostItem/PostItem";
import { getAllPosts } from "@/actions/getAllPosts";

export const PostList = async () => {
  const posts = await getAllPosts();

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {posts?.map((post) => (
        <PostItem key={post.id} {...post} />
      ))}
    </div>
  );
};
