export type Comment = {
  id: number;
  userNickname: string;
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
  userNickname: string;
  createdAt: string;
  content: string;
  hashtags: string;
  files: string;
}