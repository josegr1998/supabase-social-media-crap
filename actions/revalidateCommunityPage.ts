"use server";

import { revalidatePath } from "next/cache";

export const revalidateCommunityPage = async (communityId: string) => {
  revalidatePath(`/communities/${communityId}`);
};
