import Link from "next/link";
import { Post } from "../../types/shared";
import Image from "next/image";
import { supabase } from "../../clients/supabase-client";

type Props = Post;

const getVotesCount = async (postId: string) => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);

  return data?.length || 0;
};

const getCommentsCount = async (postId: string) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);

  return data?.length || 0;
};

export const PostItem = async ({ id, title, image_url, avatar_url }: Props) => {
  const votesCount = await getVotesCount(id);
  const commentsCount = await getCommentsCount(id);

  return (
    <div className="relative group">
      <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-0 group-hover:opacity-50 transition duration-300 pointer-events-none"></div>
      <Link href={`/post/${id}`} className="block relative z-10">
        <div className="w-80 h-76 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-colors duration-300 group-hover:bg-gray-800">
          {/* Header: Avatar and Title */}
          <div className="flex items-center space-x-2">
            {avatar_url ? (
              <Image
                src={avatar_url}
                alt="User Avatar"
                className="w-[35px] h-[35px] rounded-full object-cover"
                width={35}
                height={35}
              />
            ) : (
              <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]" />
            )}
            <div className="flex flex-col flex-1">
              <div className="text-[20px] leading-[22px] font-semibold mt-2">
                {title}
              </div>
            </div>
          </div>

          {/* Image Banner */}
          <div className="mt-2 flex-1">
            <img
              src={image_url}
              alt={title}
              className="w-full rounded-[20px] object-cover max-h-[150px] mx-auto"
            />
          </div>
          <div className="flex justify-around items-center">
            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              ❤️ <span className="ml-2">{votesCount}</span>
            </span>
            <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
              💬 <span className="ml-2">{commentsCount}</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
