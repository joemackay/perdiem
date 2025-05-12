import React from "react";
import { useAuthStore } from '../../store/auth-store';
import HomeScreen from "./home";
import LoginScreen from "./login";

// The entry point in the app
export default function App() {
  const { getUser } = useAuthStore();
  const user = getUser()
  return (
    <>
      {user ? <HomeScreen /> : <LoginScreen />}
    </>
  )
}