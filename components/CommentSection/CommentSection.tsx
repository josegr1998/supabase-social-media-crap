import { Comment } from "../../types/shared";
import { CommentItem } from "../CommentItem/CommentItem";
import { createComment, getComments } from "./CommentSection.actions";
import { createClient } from "@/clients/supabase-server";

type Props = {
  postId: string;
  communityId?: string;
};

export const CommentSection = async ({ postId }: Props) => {
  const comments = await getComments(postId);
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const buildCommentTree = (
    flatComments: Comment[]
  ): (Comment & { children: Comment[] })[] => {
    const commentMap = new Map<string, Comment & { children: Comment[] }>();

    const roots: (Comment & { children: Comment[] })[] = [];

    flatComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          parent.children.push(commentMap.get(comment.id)!);
        }
      } else {
        roots.push(commentMap.get(comment.id)!);
      }
    });

    return roots;
  };

  const commentTree = buildCommentTree(comments || []);

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold mb-4">Comments</h3>

      {comments && comments.length === 0 && (
        <p className="text-gray-500">No comments yet.</p>
      )}

      {user ? (
        <form action={createComment} className="mb-4">
          <textarea
            name="newCommentText"
            rows={3}
            placeholder="Add a comment"
            className="w-full border border-white/10 bg-transparent p-2 rounded"
            required
          />
          <input type="hidden" name="postId" value={postId || ""} />
          <input
            type="hidden"
            name="author"
            value={user?.user_metadata?.user_name || ""}
          />
          <input type="hidden" name="parent_comment_id" value={""} />

          <button
            type="submit"
            className="mt-2 bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Post
          </button>
        </form>
      ) : (
        <p>You must be logged in to write a comment</p>
      )}

      <div>
        {commentTree.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};
