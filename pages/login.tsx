import { loginWithEmail } from "@/api/auth";
import { useAuth } from '@/core/auth';
import { useAuthStore } from "@/store/auth-store";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const LoginService =()=> {
  const saveToken = useAuth.use.saveToken();
  const [email, setEmail] = useState('user@tryperdiem.com');
  const [password, setPassword] = useState('password');
  const { setUser } = useAuthStore()
  // const { promptAsync } = useGoogleAuth();

  // const handleGoogleLogin = async () => {
  //   try {
  //     const result = await promptAsync();
  //     if (result?.type === 'success') {
  //       // Use the result to sign in with Firebase
  //       // Firebase will automatically handle sign-in and save the user state
  //       const user = result.params;
  //       const payload = {
  //         fname: user.fname,
  //         lname: user.lname,
  //         picture: user.picture,
  //         email: user.email,
  //         user_uuid: user.user_uuid || 'default-uuid', // Replace with actual logic
  //         status: user.status || 'active', // Replace with actual logic
  //         last_seen: user.last_seen || new Date().toISOString(), // Replace with actual logic
  //       }
  //       setUser(payload);
  //     }
  //   } catch (error) {
  //     console.error('Google login failed:', error);
  //   }
  // };

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
        
        {/* <TouchableOpacity
          className='bg-red-500 p-3 rounded'
          onPress={signInWithGoogle}
        >
          <Text className='text-white text-center'>Login with Google</Text>
        </TouchableOpacity> */}
      </View>
    </>
  )
}
export default LoginService;