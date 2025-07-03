"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/clients/supabase-server";

export async function loginWithGithub() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/error");
  }

  redirect(data.url);
}
