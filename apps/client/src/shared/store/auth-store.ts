import { create } from 'zustand';

type StoreProps = {
  user: {"email": string, role: string, "id": number} | null;
  setUser: (user: {"email": string, role: string, "id": number} | null) => void;
  clearUser: () => void;
};

export const useAuthStore = create<StoreProps>((set) => ({
  user: null,
  setUser: (user: {"email": string, role: string, "id": number} | null) => set((state) => ({ user: user })),
  clearUser: () => set((state) => ({ user: null })),
}));