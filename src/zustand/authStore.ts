import { create } from 'zustand';

type AuthState = {
  isLogin: boolean;
  login: () => void;
  logout: () => void;
};

export default function useAuthStore() {
  create<AuthState>((set) => ({
    isLogin: false,
    login: () => set({ isLogin: true }),
    logout: () => set({ isLogin: false })
  }));
}
