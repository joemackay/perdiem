// stores/authStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '../types/user';

// Store the state of the user auth state
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
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage), // Explicitly use AsyncStorage
    }
  )
);
