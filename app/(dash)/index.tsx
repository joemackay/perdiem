import React from "react";
// import { useUserStore } from '../../store/auth-store';
import { useAuthProvider } from "@/providers/AuthProvider";
import HomeScreen from "./home";
import LoginScreen from "./login";

// The entry point in the app
export default function App() {
  // const { getUser } = useUserStore();
  // const user = getUser()
  const { hasSession } = useAuthProvider();
  return (
    <>
      {hasSession ? <HomeScreen /> : <LoginScreen />}
    </>
  )
}