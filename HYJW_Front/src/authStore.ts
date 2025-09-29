import { create } from "zustand";

type AuthStore = {
  isAuthenticated: boolean;
  nickname: string | null;
  isAdmin: boolean; // ✅ 관리자 여부 추가
  token: string | null; // ✅ 토큰 추가
  login: (nickname: string, isAdmin: boolean, token: string) => void; // ✅ 토큰 매개변수 추가
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!sessionStorage.getItem("jwt"),
  nickname: sessionStorage.getItem("nickname"), // 닉네임도 세션 스토리지에서 로드
  isAdmin: sessionStorage.getItem("isAdmin") === "true", // isAdmin도 세션 스토리지에서 로드
  token: sessionStorage.getItem("jwt"), // 토큰도 세션 스토리지에서 로드

  login: (nickname, isAdmin, token) => {
    sessionStorage.setItem("jwt", token);
    sessionStorage.setItem("nickname", nickname);
    sessionStorage.setItem("isAdmin", String(isAdmin));
    set({ isAuthenticated: true, nickname, isAdmin, token });
  },

  logout: () => {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("nickname");
    sessionStorage.removeItem("isAdmin");
    set({ isAuthenticated: false, nickname: null, isAdmin: false, token: null });
  },
}));