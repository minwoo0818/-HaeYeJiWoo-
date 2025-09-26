// PostApi.ts

import axios from "axios";
import type { Post, BackendPostResponse } from "../types/PostType";

const BASE_URL = import.meta.env.VITE_API_URL;

// 기존 게시물 조회 함수 (데이터 매핑 추가)
export const GetPosts = async (type: string = 'all'): Promise<Post[]> => {
  const response = await axios.get<BackendPostResponse[]>(`${BASE_URL}/posts/${type}`);
  
  // 백엔드 응답을 프론트엔드 Post 타입으로 매핑
  const mappedPosts: Post[] = response.data.map((backendPost) => ({
    id: backendPost.postId,
    title: backendPost.title,
    nickname: backendPost.user?.userNickname || '알 수 없는 사용자', // Handle missing user
    image: backendPost.url,
    category: backendPost.categoryId,
    date: backendPost.createdAt,
    views: backendPost.views,
    hashtags: backendPost.hashtags,
    likes: backendPost.likesCount,
    content: backendPost.content,
    files: backendPost.files,
  }));

  return mappedPosts;
};

// 게시물 검색을 위한 새로운 함수
export const SearchPosts = async (
  type: string,
  searchType: string,
  searchText: string
): Promise<Post[]> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("searchType", searchType);
    queryParams.append("searchText", searchText);

    const response = await axios.get<BackendPostResponse[]>(
      `${BASE_URL}/posts/${type}/search?${queryParams.toString()}`
    );
    
    // 검색 결과도 매핑
    const mappedPosts: Post[] = response.data.map((backendPost) => ({
      id: backendPost.postId,
      title: backendPost.title,
      nickname: backendPost.user?.userNickname || '알 수 없는 사용자', // Handle missing user
      image: backendPost.url,
      category: backendPost.categoryId,
      date: backendPost.createdAt,
      views: backendPost.views,
      hashtags: backendPost.hashtags,
      likes: backendPost.likesCount,
      content: backendPost.content,
      files: backendPost.files,
    }));

    return mappedPosts;

  } catch (error) {
    console.error("게시물 검색 API 요청 실패:", error);
    throw error;
  }
};