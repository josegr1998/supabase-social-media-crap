import { supabase } from "@/clients/supabase-client";

export const getAllPosts = async () => {
  const { data, error } = await supabase.from("posts").select("*");

  if (error) throw new Error(error.message);

  return data;
};
