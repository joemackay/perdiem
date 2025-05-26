// stores/authStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '../types/user';

// Store the state of the user auth state
type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  getUser: () => User | null;
  logout: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({

      // User record
      user: null,

      // Store user record
      setUser: (user) => set({ user }),

      // Get  user record
      getUser: () => {
        const state = get();
        return state.user;
      },

      // Clear user record
      logout: () => {
        console.log('2. useUserStore logout')
        set({ user: null })
      },
    }),
    { 
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage), // Explicitly use AsyncStorage
    }
  )
);
