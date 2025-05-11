import React from "react";
import { useAuthStore } from '../../store/auth-store';
import HomeScreen from "./home";
import LoginScreen from "./login";
export default function App() {
  const { getUser } = useAuthStore();
  const user = getUser()
  console.log('--->user', user)
  return (
    <>
      {user ? <HomeScreen /> : <LoginScreen />}
    </>
  )
}