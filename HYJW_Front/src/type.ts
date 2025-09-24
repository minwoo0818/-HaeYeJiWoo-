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