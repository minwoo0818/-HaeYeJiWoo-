// PostApi.ts

import axios from "axios";
import type { Post } from "../types/PostType";

const BASE_URL = import.meta.env.VITE_API_URL;

// 기존 게시물 조회 함수 (변경 없음)
export const GetPosts = async (type: string | undefined): Promise<Post[]> => {
  const response = await axios.get(`${BASE_URL}/posts/${type}`);
  return response.data;
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
    return response.data;
  } catch (error) {
    console.error("게시물 검색 API 요청 실패:", error);
    throw error;
  }
};