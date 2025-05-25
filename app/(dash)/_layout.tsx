import { Stack } from "expo-router";

const AppLayout = () => {
  return (
    <>
      <Stack screenOptions={{ headerShown: true, headerBackTitle: 'Back' }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="home" options={{headerBackVisible: false, headerLeft: ()=> null}} />
        <Stack.Screen name="details" />
      </Stack>
    </>
  )
}

export default AppLayout;