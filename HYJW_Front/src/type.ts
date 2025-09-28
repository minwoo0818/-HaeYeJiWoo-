export type Comment = {
  id: number;
  postId: number;
  nickname: string;
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
};

export type AddCommentPayload = Omit<
  Comment,
  "id" | "nickname" | "userId" | "createAt" | "updateAt"
>;

export type AdminComment = {
  id?: number;
  title?: string;
  nickname?: string;
  userId?: number;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
};
