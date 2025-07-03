import { supabase } from "@/clients/supabase-client";

export const getPostById = async (id: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
};
