// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user';

type AuthState = {
  user: User | null;
  token: User | null;
  setUser: (user: User) => void;
  getUser: () => User | null;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      getUser: () => {
        const state = get();
        return state.user;
      },
      logout: () => set({ user: null }),
    }),
    { 
      name: 'auth-storage'
    }
  )
);
