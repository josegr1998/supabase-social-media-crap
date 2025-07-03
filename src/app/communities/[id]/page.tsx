import { supabase } from "@/clients/supabase-client";
import { PostItem } from "@/components/PostItem/PostItem";
import { Post } from "@/types/shared";

type CommunityPost = Post & {
  communities: {
    name: string;
  };
};

const getCommunityPosts = async (
  communityId: string
): Promise<CommunityPost[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const posts = await getCommunityPosts(id);

  if (!posts?.length) {
    return <div>No posts in this community yet.</div>;
  }

  return (
    <div>
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {posts[0].communities.name} Community Posts
      </h2>

      {posts && posts.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {posts.map((post) => (
            <PostItem key={post.id} {...post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No posts in this community yet.
        </p>
      )}
    </div>
  );
}
