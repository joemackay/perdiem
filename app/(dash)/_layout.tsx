import { Stack } from "expo-router";

const AppLayout = () => {
  return (
    <>
      <Stack screenOptions={{ headerShown: true, headerBackTitle: 'Back' }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="home" />
        <Stack.Screen name="details" />
      </Stack>
    </>
  )
}

export default AppLayout;