"use server";

import { createClient } from "@/clients/supabase-server";

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
};
