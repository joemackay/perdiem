import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const TOKEN = 'token';

interface AuthState {

  // unique token retrieved from the server
  token: string | null;

  // check if user has gone idle - a nice to have
  status: 'idle' | 'signOut' | 'signIn';
  getToken: () => Promise<string | null>;
  saveToken: (token: string) => void;
  clearToken: () => void;
}

export const _useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      status: 'idle',
      token: null,

      // fetch token for the provider
      getToken: async () => {
         const token = await SecureStore.getItemAsync(TOKEN)
         return token;
      },

      // save token in Secure store
      saveToken: async (token) => {
        // setToken(token);
        await SecureStore.setItemAsync(TOKEN, token)
        set({ status: 'signIn', token });
      },
      
      // Clear token from Secure store - User has logged out
      clearToken: async () => {
        // removeToken();
        console.log('3. AuthState clearToken')
        await SecureStore.deleteItemAsync(TOKEN)
        set({ status: 'signOut', token: null });
      }
    }),
    { 
      name: 'auth-storage' 
    }
));