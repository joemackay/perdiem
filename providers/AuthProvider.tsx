// src/auth/googleAuth.ts
import { _useAuth } from '@/store/auth-store';
import { useUserStore } from '@/store/user-store';
import { User } from '@/types/user';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  user: User | null;
  hasSession: boolean;
  signInWithGoogle: () => void;
  signInWithEmail: (user: User) => void;
  signOut: () => void;
};

// Create context for the entire app
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This provider will be used across the app pages
export const AuthProvider = ({ children }: { children: any }) => {
  const { user, getUser, setUser, logout } = useUserStore();
  const { clearToken, getToken } = _useAuth();
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    // Refresh Google Auth setup
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    });

    // Check if user has already logged in using Email
    const checkToken = async () => {
      const hasToken = await getToken()
      if (hasToken) {
        const user = getUser()
        setUser({
          user_uuid: user?.user_uuid || '',
          fname: user?.fname || '',
          lname: user?.lname || '',
          picture: '',
          email: user?.email || '',
        })
        setHasSession(true)
      }
    }
    checkToken();

    // Create a listener to check if user has already logged in using Google
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser({
          user_uuid: authUser.uid,
          fname: authUser.displayName?.split(' ')[0] || '',
          lname: authUser.displayName?.split(' ')[1] || '',
          picture: authUser.photoURL || '',
          email: authUser.email || '',
        });
        setHasSession(true)
      }
    });

    // unsusbscribe from listener
    return unsubscribe;

  }, [getUser, setUser]);

  // Sign in user with Google Auth
  const signInWithGoogle = async () => {
    let idToken;
    try {
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();
      idToken = signInResult.data?.idToken;
      if (idToken) {
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        await auth().signInWithCredential(googleCredential);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Sign in user with email
  // Token is handled elsewhere
  const signInWithEmail = (user: User) => {
    setUser({
        user_uuid: user.user_uuid,
        fname: user.fname,
        lname: user.lname,
        picture: '',
        email: user.email || '',
      });
    setHasSession(true)
  };

  // Sign out user
  const signOut = async () => {
    try {

      // Clear user info from local storage
      logout();
      
      // Clear token from local storage
      clearToken()

      // Revoke Google access
      // await GoogleSignin.revokeAccess();
      
      // Clear Google Account
      await auth().signOut();

      // Clear context session
      setHasSession(false)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, hasSession, signInWithEmail, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthProvider = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};