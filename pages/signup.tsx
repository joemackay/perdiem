import { signupWithEmail } from "@/api/auth";
import { useAuthStore } from "@/store/auth-store";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const SignUpService =()=> {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [names, setNames] = useState('');
  const { setUser } = useAuthStore()
  // const { promptAsync } = useGoogleAuth();

  // const handleGoogleSignup = async () => {
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
  return (
    <>
      <View className='flex-1 justify-center p-4 bg-slate-300'>
        <Text className='text-2xl font-bold text-center mb-8'>Welcome to PerDiem</Text>
        <Text className='text-2xl font-bold text-center mb-8'>Register</Text>
        
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
        
        <View className="justify-center items-center mt-5"><Link href={"/login"} className="text-blue-700 font-bold">Login</Link></View>
      
      </View>
    </>
  )
}
export default SignUpService;