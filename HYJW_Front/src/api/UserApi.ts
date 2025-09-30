import axios from "axios";
import type { BackendUser } from "../types/PostType";

const BASE_URL = import.meta.env.VITE_API_URL;

// UserDto 인터페이스 정의 (백엔드 응답에 맞춰 수정 필요)
interface UserDto {
  userId: number;
  userNickname: string;
  userEmail: string;
}

export const getUser = async (token: string): Promise<BackendUser[]> => {

  const response = await axios.get(`${BASE_URL}/users/getuserinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  return response.data;
};

// 현재 로그인한 사용자 정보를 가져오는 함수 추가
export const getCurrentUser = async (token: string): Promise<UserDto> => {
  try {
    console.log("getCurrentUser: 토큰", token);
    const response = await axios.get(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("getCurrentUser: /users/me 응답 데이터", response.data);
    return response.data;
  } catch (error) {
    console.error("getCurrentUser: /users/me 호출 에러", error);
    throw error; // 에러를 다시 던져서 호출하는 쪽에서 처리할 수 있도록 함
  }
};
