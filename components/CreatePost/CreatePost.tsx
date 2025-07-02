"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../../clients/supabase-client";
import { useAuth } from "../../context/AuthContext";
import { getCommunities } from "@/actions/getCommunities";

type PostInput = {
  title: string;
  content: string;
  image: File | null;
  avatar_url: string;
  community_id: string | null;
};

const createPostMutation = async ({
  title,
  content,
  image,
  avatar_url,
  community_id,
}: PostInput) => {
  const imagePath = `${title}-${Date.now()}-${image?.name}`;

  if (!image) return;

  const { error: imageError } = await supabase.storage
    .from("post-images")
    .upload(imagePath, image);

  if (imageError) throw new Error(imageError.message);

  const { data: imageUrlData } = supabase.storage
    .from("post-images")
    .getPublicUrl(imagePath);

  const { data, error } = await supabase.from("posts").insert({
    title,
    content,
    image_url: imageUrlData.publicUrl,
    avatar_url,
    community_id: community_id ? Number(community_id) : null,
  });

  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [communityId, setCommunityId] = useState<string | null>(null);
  const { user } = useAuth();

  const { data: communities } = useQuery({
    queryKey: ["communities"],
    queryFn: getCommunities,
  });

  const {
    mutate: createPost,
    isPending,
    isError,
  } = useMutation({
    mutationFn: createPostMutation,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPost({
      title,
      content,
      image,
      avatar_url: user?.user_metadata.avatar_url,
      community_id: communityId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>{" "}
        <input
          type="text"
          id="title"
          name="title"
          required
          value={title}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>{" "}
        <textarea
          id="content"
          name="content"
          required
          rows={5}
          value={content}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="image" className="block mb-2 font-medium">
          Upload Image
        </label>{" "}
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          required
          className="w-full text-gray-200"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
        />
      </div>
      <div>
        <label htmlFor="community" className="block mb-2 font-medium">
          Select Community
        </label>
        <select
          id="community"
          name="community"
          required
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          onChange={(e) => setCommunityId(e.target.value)}
        >
          <option value="">-- Choose a community --</option>
          {communities?.map((community) => (
            <option key={community.id} value={community.id}>
              {community.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>
      {isError && <p className="text-red-500"> Error creating post.</p>}
    </form>
  );
};
