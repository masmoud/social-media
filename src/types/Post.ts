export interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  avatar_url?: string;
  created_at: string;
  like_count?: number;
  comment_count?: number;
}

export interface PostWithCommunity extends Post {
  communities: {
    name: string;
  };
}
