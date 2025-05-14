// src/auth/googleAuth.ts
import { useAuthStore } from '@/store/auth-store';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useEffect } from 'react';

// TODO: Apply in the layout or index file
GoogleSignin.configure({
  // webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  webClientId: '911292730287-mptlnalmlo3s716849lgfccvf1rbit3i.apps.googleusercontent.com',
});

const AuthProvider = ({ children }: { children: any }) => {
  const { user, setUser, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser({
          user_uuid: authUser.uid,
          fname: authUser.displayName?.split(' ')[0] || '',
          lname: authUser.displayName?.split(' ')[1] || '',
          picture: authUser.photoURL || '',
          email: authUser.email || '',
        });
      }
    });
    return unsubscribe;
  }, [setUser]);

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

  const signOut = async () => {
    try {
      await auth().signOut();
      logout();
    } catch (error) {
      console.error(error);
    }
  };

  return children({
    user,
    signInWithGoogle,
    signOut,
  });
};

export default AuthProvider;
