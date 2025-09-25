export interface FileAttachment {
  url: string;
  fileName: string;
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
// export interface Post {
//   id: number;
//   title: string;
//   author: string;
//   image: string;
//   category: string;
//   date: string;
//   views: number;
//   hashtags: string[];
//   likes: number;
// }
