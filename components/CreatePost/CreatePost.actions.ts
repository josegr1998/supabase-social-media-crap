"use server";

import { createClient } from "@/clients/supabase-server";
import { redirect } from "next/navigation";

export const createPost = async (formData: FormData) => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) throw new Error("User not found");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const image = formData.get("image") as File;
  const avatar_url = user.user_metadata.avatar_url;
  const community_id = formData.get("community") as string;

  const imagePath = `${title}-${Date.now()}-${image?.name}`;

  if (!image) return;

  const { error: imageError } = await supabase.storage
    .from("post-images")
    .upload(imagePath, image);

  if (imageError) throw new Error(imageError.message);

  const { data: imageUrlData } = supabase.storage
    .from("post-images")
    .getPublicUrl(imagePath);

  await supabase.from("posts").insert({
    title,
    content,
    image_url: imageUrlData.publicUrl,
    avatar_url,
    community_id: community_id ? Number(community_id) : null,
  });

  redirect("/");
};
