import { create } from "zustand";

type AuthStore = {
  isAuthenticated: boolean;
  nickname: string | null;
  isAdmin: boolean;
  token: string | null;
  userId: number | null; // userId 추가
  login: (nickname: string, isAdmin: boolean, token: string, userId: number) => void; // userId 매개변수 추가
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!sessionStorage.getItem("jwt"),
  nickname: sessionStorage.getItem("nickname"),
  isAdmin: sessionStorage.getItem("isAdmin") === "true",
  token: sessionStorage.getItem("jwt"),
  userId: sessionStorage.getItem("userId") ? Number(sessionStorage.getItem("userId")) : null, // userId 초기화

  login: (nickname, isAdmin, token, userId) => { // userId 매개변수 추가
    sessionStorage.setItem("jwt", token);
    sessionStorage.setItem("nickname", nickname);
    sessionStorage.setItem("isAdmin", String(isAdmin));
    sessionStorage.setItem("userId", String(userId)); // userId 저장
    set({ isAuthenticated: true, nickname, isAdmin, token, userId });
  },

  logout: () => {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("nickname");
    sessionStorage.removeItem("isAdmin");
    sessionStorage.removeItem("userId"); // userId 제거
    set({ isAuthenticated: false, nickname: null, isAdmin: false, token: null, userId: null });
  },
}));