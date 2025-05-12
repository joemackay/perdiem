import { signupWithEmail } from "@/api/auth";
import { GOOGLE_CLIENT_ID } from "@/constants/ApiKeys";
import { useAuth } from '@/core/auth';
import { useAuthStore } from "@/store/auth-store";
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";


// The business logic of the sign up page
const SignUpService =()=> {
  const saveToken = useAuth.use.saveToken();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [names, setNames] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSigninUpProgress, setIsSignUpInProgress] = useState(false);
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

  const handleEmailSignup = async () => {
    console.log('handleEmailSignup')
    try {
      const response = await signupWithEmail(names, phone, email, password);
      if (response) {
        setUser(response)
        router.navigate('/home');
      }
    } catch (error) {
      // Alert.alert('Login Failed', error.message || 'Invalid credentials');
    }
  };

  const handleGoogleSignUp = async () => {
    let idToken;
    try {
      // Being signin process
      setIsSignUpInProgress(true);

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
  return (
    <>
      <View className='flex-1 justify-center p-4 bg-slate-300'>
        <Text className='text-2xl font-bold text-center mb-8'>Welcome to PerDiem</Text>
        <Text className='text-2xl font-bold text-center mb-8'>Register</Text>
        
        {error && (
          <View className="absolute top-10 left-0 right-0 items-center z-50">
            <Text className="text-white bg-red-500 px-4 py-2 rounded-md">
              {error}
            </Text>
          </View>
        )}
        
        <TextInput
          className='border p-3 rounded mb-4'
          placeholder="Full name"
          value={names}
          onChangeText={setNames}
          autoCapitalize="none"
          keyboardType="default"
        />
        
        <TextInput
          className='border p-3 rounded mb-4'
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          autoCapitalize="none"
          keyboardType="default"
        />
        
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
          onPress={()=>handleEmailSignup()}
        >
          <Text className='text-white text-center'>Sign up with Email</Text>
        </TouchableOpacity>
        
        <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleGoogleSignUp}
            disabled={isSigninUpProgress}
          />
        <View className="justify-center items-center mt-5"><Link href={"/login"} className="text-blue-700 font-bold">Login</Link></View>
      
      </View>
    </>
  )
}
export default SignUpService;