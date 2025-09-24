export type Comment = {
  id: number;
  nickname: string;
  postId: number;
  userId: number;
  content: string;
  parentCommentId?: number;
  createAt: string;
  updateAt: string;
};

export type PostType = {
  id: number;
  views: number;
  likesCount: number;
  title: string;
  userId: number;
  nickname: string;
  createdAt: string;
  content: string;
  hashtags: string;
  files: string;
}