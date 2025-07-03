"use server";

import { createClient } from "@/clients/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createCommunity = async (formData: FormData) => {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const { error } = await supabase.from("communities").insert({
    name,
    description,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/communities");
  redirect("/communities");
};
