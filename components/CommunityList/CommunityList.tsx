import React from "react";
import Link from "next/link";
import { getCommunities } from "@/actions/getCommunities";

export const CommunityList = async () => {
  const communities = await getCommunities();
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {communities.map((community) => (
        <div
          key={community.id}
          className="border border-white/10 p-4 rounded hover:-translate-y-1 transition transform"
        >
          <Link
            href={`/communities/${community.id}`}
            className="text-2xl font-bold text-purple-500 hover:underline"
          >
            {community.name}{" "}
          </Link>
          <p className="text-gray-400 mt-2">{community.description}</p>
        </div>
      ))}
    </div>
  );
};
