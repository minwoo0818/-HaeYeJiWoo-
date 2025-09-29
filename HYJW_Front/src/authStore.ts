import { create } from "zustand";

type AuthStore = {
  isAuthenticated: boolean;
  nickname: string | null;
  isAdmin: boolean; // ✅ 관리자 여부 추가
  login: (nickname: string, isAdmin: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!sessionStorage.getItem("jwt"),
  nickname: null,
  isAdmin: false, // ✅ 초기값 false

  login: (nickname, isAdmin) =>
    set({ isAuthenticated: true, nickname, isAdmin }), // ✅ 로그인 시 설정

  logout: () =>
    set({ isAuthenticated: false, nickname: null, isAdmin: false }), // ✅ 로그아웃 시 초기화
}));