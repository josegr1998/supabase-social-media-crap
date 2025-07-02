import React from "react";
import { supabase } from "../../clients/supabase-client";
import { PostItem } from "../PostItem/PostItem";

const getPosts = async () => {
  const { data, error } = await supabase.from("posts").select("*");

  if (error) throw new Error(error.message);

  return data;
};

export const PostList = async () => {
  const posts = await getPosts();

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {posts?.map((post) => (
        <PostItem key={post.id} {...post} />
      ))}
    </div>
  );
};
