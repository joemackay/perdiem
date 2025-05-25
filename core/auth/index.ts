import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createSelectors } from '../utils';
// import type { TokenType } from './utils';
import { removeToken, setToken } from './utils';
// import * as SecureStore from 'expo-secure-store';

interface AuthState {

  // unique token retrieved from the server
  token: string | null;

  // check if user has gone idle - a nice to have
  status: 'idle' | 'signOut' | 'signIn';
  saveToken: (token: string) => void;
  signOut: () => void;
}

const _useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      status: 'idle',
      token: null,
      saveToken: (token) => {
        setToken(token);
        set({ status: 'signIn', token });
      },
      signOut: () => {
        removeToken();
        set({ status: 'signOut', token: null });
      }
    }),
  { name: 'auth-storage'
  }
));

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const saveToken = (token: string) => _useAuth.getState().saveToken(token);
