import { supabase } from "@/clients/supabase-client";
import { Community } from "@/types/shared";

export const getCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};
