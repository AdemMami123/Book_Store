import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafeScreen from "../components/SafeScreen";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeScreen>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="(auth)" options={{ title: "Login" }} />
      <Stack.Screen name="(auth)/signup" options={{ title: "Sign Up" }} />
    </Stack>
    </SafeScreen>
    <StatusBar style="dark"/>
    </SafeAreaProvider>
  );
  
};