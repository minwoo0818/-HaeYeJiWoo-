import { create } from "zustand";

type AuthStore = {
  isAuthenticated: boolean;
  nickname: string | null;
  login: (nickname: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!sessionStorage.getItem("jwt"),
  nickname: null,
  login: (nickname) => set({ isAuthenticated: true, nickname }),
  logout: () => set({ isAuthenticated: false, nickname: null }),
}));
