import { create } from 'zustand';

type StoreProps = {
  userId: string | null;
  setUser: (userId: string | null) => void;
  clearUser: () => void;
};

export const useAuthStore = create<StoreProps>((set) => ({
  userId: null,
  setUser: (userId: string | null) => set((state) => ({ userId: userId })),
  clearUser: () => set((state) => ({ userId: null })),
}));