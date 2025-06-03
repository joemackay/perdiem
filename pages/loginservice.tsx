import { zodResolver } from '@hookform/resolvers/zod';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from "react-native";
// eslint-disable-next-line import/no-named-as-default
import z from 'zod';
import { loginWithEmail } from "../api/auth";
import { _useAuth } from '../store/auth-store';
import { useUserStore } from "../store/user-store";

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Min 6 char')
})

type FormData = z.infer<typeof loginSchema>;

// The business logic of the login page
const LoginService =()=> {
  const { saveToken } = _useAuth();
  // const [email, setEmail] = useState('user@tryperdiem.com');
  // const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  const { setUser } = useUserStore()
  // const { promptAsync } = useGoogleAuth();

  const { watch, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'user@tryperdiem.com',
      password: 'password'
    }
  })

  const isTestEnv = process.env.JEST_WORKER_ID !== undefined;

  useEffect(() => {
    // Configure Google Sign-In on component mount
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
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
  }, [setUser])

  const handleEmailLogin = async (data: FormData) => {
    setIsSigninInProgress(true);
    try {
      const response = await loginWithEmail(data.email, data.password);
      if (response) {
        setUser(response)
        saveToken(response.token );
        router.navigate('/home');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Login Failed', error.message || 'Invalid credentials');
      } else {
        console.log('Login Failed', 'Invalid credentials');
      }
      setError(error instanceof Error ? error.message : 'Login failed. Invalid credentials.');
      setIsSigninInProgress(false);
    } finally {
      setIsSigninInProgress(false);
    }
  };

  const handleGoogleSignIn = async () => {
    let idToken;
    try {
      // Being signin process
      setIsSigninInProgress(true);

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
        setError(`Could not retrieve Google ID token ---. ${signInResult.type}`);
        setIsSigninInProgress(false);
      }
    } catch (e: any) {
      if (e.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the sign-in flow
        console.error('Google Sign-in Cancelled:', e);
        setError('Sign in cancelled.');
      } else if (e.code === statusCodes.IN_PROGRESS) {
        // Operation (e.g. sign in) is in progress already
        setError('Sign in in progress...');
      } else if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Play services not available or outdated
        setError('Google Play Services not available. Please update.');
        console.error('Google Sign-in Play Service not available:', e);
      } else {
        // Some other error happened
        setError(`Google Sign-in error: ${e.message}`);
        console.error('Google Sign-in error:', e);
      }
      setIsSigninInProgress(false);
    }
  };

  return (
    <>
      <View className='flex-1 justify-center p-4 bg-white'>
        <Text className='text-2xl font-bold text-center mb-8'>Welcome to PerDiem</Text>
        <Text className='text-2xl font-bold text-center mb-8'>Login</Text>
        
        {/* Error message */}
        {error && (
          <View className="absolute top-10 left-0 right-0 items-center z-50">
            <Text className="text-white bg-red-500 px-4 py-2 rounded-md">
              {error}
            </Text>
          </View>
        )}
        
        {/* Input form */}
        <View className='mb-4'>
          <TextInput
            className='p-3 rounded border border-slate-400'
            placeholder="Email"
            value={watch('email')}
            // onChangeText={setEmail}
            onChangeText={(text) => setValue('email', text)}
            autoCapitalize="none"
            keyboardType="email-address"
            testID="test-email"
          />
          {errors.email && <Text className="text-red-500">{errors.email.message}</Text>}
        </View>
        
        <View className='mb-4'>
          <TextInput
            className='p-3 rounded border border-slate-400'
            placeholder="Password"
            // value={password}
            value={watch('password')}
            // onChangeText={setPassword}
            onChangeText={(text) => setValue('password', text)}
            secureTextEntry
            testID="test-password"
          />
          {errors.password && <Text className="text-red-500">{errors.password.message}</Text>}
        </View>
        
        <TouchableOpacity
          className='bg-slate-600 rounded-xl py-4 mb-4'
          // onPress={()=>handleEmailLogin()}
          onPress={handleSubmit(handleEmailLogin)}
          testID="test-login-touch-opacity"
        >
          <Text className='text-white text-center'>{isSigninInProgress ? 'Logging in...' : 'Login with Email'}</Text>
        </TouchableOpacity>

        <View className='justify-center items-center mt-2'>
          <Text> - OR - </Text>
        </View>

        {/* Google Sign-In Button */}
        <View className='justify-center items-center mt-4'>
          {!isTestEnv && <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleGoogleSignIn}
            disabled={isSigninInProgress}
            testID="test-google-login-button"
          />}
        </View>

        {/* Link to Sign Up page */}
        <View className="justify-center items-center mt-16">
          <Link 
            href={"/signup"} 
            className="text-blue-700 font-bold"
            testID="test-link-to-signup"
          >Don&lsquo;t have an account? Sign up</Link>
        </View>
      </View>
    </>
  )
}
export default LoginService;