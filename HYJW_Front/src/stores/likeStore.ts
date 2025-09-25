import { create } from 'zustand';

interface LikeState {
  status: 'loading' | 'liked' | 'unliked';
  likes: number;
  setStatus: (status: LikeState['status']) => void;
  setLikes: (count: number) => void;
  incrementLikes: () => void;
  decrementLikes: () => void;
}

const useLikeStore = create<LikeState>((set) => ({
  status: 'loading',
  likes: 0,
  setStatus: (status) => set({ status }),
  setLikes: (count) => set({ likes: count }),
  incrementLikes: () => set((state) => ({ likes: state.likes + 1 })),
  decrementLikes: () => set((state) => ({ likes: state.likes - 1 })),
}));

export default useLikeStore;
