import { create } from 'zustand';

import { createSelectors } from '../utils';
// import type { TokenType } from './utils';
import { getToken, removeToken, setToken } from './utils';
// import * as SecureStore from 'expo-secure-store';

interface AuthState {

  // unique token retrieved from the server
  token: string | null;

  // check if user has gone idle - a nice to have
  status: 'idle' | 'signOut' | 'signIn';
  saveToken: (token: string) => void;
  signOut: () => void;
  hydrate: () => void;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  saveToken: (token) => {
    setToken(token);
    set({ status: 'signIn', token });
  },
  signOut: () => {
    removeToken();
    set({ status: 'signOut', token: null });
  },
  hydrate: async () => {
    try {
      const userToken = await getToken();
      if (userToken !== null) {
        get().saveToken(userToken);
      } else {
        get().signOut();
      }
    } catch (e) {
      // catch error here
      // Maybe sign_out user!
    }
  },
}));

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const saveToken = (token: string) => _useAuth.getState().saveToken(token);
export const hydrateAuth = () => _useAuth.getState().hydrate();
