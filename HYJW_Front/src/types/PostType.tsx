export interface FileAttachment {
  url: string;
  // fileName: string;
  fileOriginalName: string; 
}

export interface BackendUser {
  userId: number;
  userNickname: string;
  email: string;
}

export interface BackendPostResponse {
  postId: number;
  title: string;
  user: BackendUser;
  url: string;
  categoryId: string;
  createdAt: string;
  views: number;
  hashtags: string[];
  likesCount: number;
  content: string;
  files: FileAttachment[];
}

export interface Post {
  id: number;
  title: string;
  nickname: string;
  image: string;
  category: string;
  date: string;
  views: number;
  hashtags: string[];
  likes: number;
  content: string;
  files: FileAttachment[];
}

