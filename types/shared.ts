export type Post = {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  avatar_url: string;
  community_id: string;
};

export type Vote = {
  id: string;
  post_id: string;
  user_id: string;
  vote: number;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
  author: string;
  created_at: string;
} & { children: Comment[] };

export type Community = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};
