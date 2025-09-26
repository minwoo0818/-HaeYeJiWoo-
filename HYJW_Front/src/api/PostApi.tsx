// PostApi.ts

import axios from "axios";
import type { Post, BackendPostResponse } from "../types/PostType";

const BASE_URL = import.meta.env.VITE_API_URL;

// 기존 게시물 조회 함수 (변경 없음)
export const GetPosts = async (type: string | undefined): Promise<Post[]> => {
  const response = await axios.get(`${BASE_URL}/posts/${type}`);
  const backendPosts: BackendPostResponse[] = response.data;
  return backendPosts.map(backendPost => ({
    id: backendPost.postId,
    title: backendPost.title,
    nickname: backendPost.user?.userNickname || 'Unknown',
    image: backendPost.url || '',
    category: backendPost.categoryId,
    date: backendPost.createdAt,
    views: backendPost.views,
    hashtags: backendPost.hashtags,
    likes: backendPost.likesCount,
    content: backendPost.content,
    files: backendPost.files,
  }));
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

    // 예시 URL: http://localhost:8080/posts/all/search?searchType=title&searchText=리액트
    const response = await axios.get(
      `${BASE_URL}/posts/${type}/search?${queryParams.toString()}`
    );
    const backendPosts: BackendPostResponse[] = response.data;
    return backendPosts.map(backendPost => ({
      id: backendPost.postId,
      title: backendPost.title,
      nickname: backendPost.user?.userNickname || 'Unknown',
      image: backendPost.url || '',
      category: backendPost.categoryId,
      date: backendPost.createdAt,
      views: backendPost.views,
      hashtags: backendPost.hashtags,
      likes: backendPost.likesCount,
      content: backendPost.content,
      files: backendPost.files,
    }));
  } catch (error) {
    console.error("게시물 검색 API 요청 실패:", error);
    throw error;
  }
};