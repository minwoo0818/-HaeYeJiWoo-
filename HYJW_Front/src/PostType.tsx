export interface FileAttachment {
  fileOriginalName: string | undefined;   //PostDetail에서 첨부파일 부분 타입 새로 선언함 
  url: string;
  fileName: string;
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

