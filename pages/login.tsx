import { loginWithEmail } from "@/api/auth";
import { GOOGLE_CLIENT_ID } from "@/constants/ApiKeys";
import { useAuth } from '@/core/auth';
import { useAuthStore } from "@/store/auth-store";
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const LoginService =()=> {
  const saveToken = useAuth.use.saveToken();
  const [email, setEmail] = useState('user@tryperdiem.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore()
  // const { promptAsync } = useGoogleAuth();

  useEffect(() => {
    // Configure Google Sign-In on component mount
    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
    });

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

    return unsubscribe; // Unsubscribe from the listener when the component unmounts
  }, [])

  const handleEmailLogin = async () => {
    console.log('handleEmailLogin')
    try {
      const response = await loginWithEmail(email, password);
      if (response) {
        setUser(response)
        saveToken({ access: response.token, refresh: response.token });
        router.navigate('/home');
      }
    } catch (error) {
      // Alert.alert('Login Failed', error.message || 'Invalid credentials');
    }
  };

  const handleGoogleSignIn = async () => {
    let idToken;
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices();

      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();

      // Try the new style of google-sign in result, from v13+ of that module

      idToken = signInResult.data?.idToken;
      if (idToken) {
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        await auth().signInWithCredential(googleCredential);
        setError(null);
      } else {
        setError('Could not retrieve Google ID token.');
      }
    } catch (e: any) {
      if (e.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the sign-in flow
        setError('Sign in cancelled.');
      } else if (e.code === statusCodes.IN_PROGRESS) {
        // Operation (e.g. sign in) is in progress already
        setError('Sign in in progress...');
      } else if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Play services not available or outdated
        setError('Google Play Services not available. Please update.');
      } else {
        // Some other error happened
        setError(`Google Sign-in error: ${e.message}`);
        console.error('Google Sign-in error:', e);
      }
    }
  };

  // const handleSignOut = async () => {
  //   try {
  //     await GoogleSignin.revokeAccess();
  //     await auth().signOut();
  //     setUser(null);
  //     setError(null);
  //   } catch (error: any) {
  //     console.error('Sign-out error:', error);
  //     setError('Error signing out.');
  //   }
  // };
  return (
    <>
      <View className='flex-1 justify-center p-4 bg-slate-300'>
        <Text className='text-2xl font-bold text-center mb-8'>Welcome to PerDiem</Text>
        <Text className='text-2xl font-bold text-center mb-8'>Logins</Text>
        
        <TextInput
          className='border p-3 rounded mb-4'
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          className='border p-3 rounded mb-6'
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity
          className='bg-slate-600 rounded-xl py-4 mb-4'
          onPress={()=>handleEmailLogin()}
        >
          <Text className='text-white text-center'>Login with Email</Text>
        </TouchableOpacity>

        <View className="justify-center items-center mt-5"><Link href={"/signup"} className="text-blue-700 font-bold">Sign up</Link></View>
        
        <TouchableOpacity
          className='bg-red-500 p-3 rounded'
          onPress={handleGoogleSignIn}
        >
          <Text className='text-white text-center'>Login with Google</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}
export default LoginService;