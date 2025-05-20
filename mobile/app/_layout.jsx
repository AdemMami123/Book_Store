import { Stack, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafeScreen from "../components/SafeScreen";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, checkAuth, token } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  
  // Check authentication status when the app loads
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        console.log("Checking authentication...");
        await checkAuth();
        console.log("Auth check complete. User:", user ? "Logged in" : "Not logged in");
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsReady(true);
      }
    };
    
    loadAuthState();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (!isReady) {
      console.log("App not ready yet for navigation");
      return;
    }
    
    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = !!user && !!token;
    
    
    if (isSignedIn && inAuthScreen) {
      console.log("Redirecting to home (tabs)");
      router.replace("/(tabs)");
    } else if (!isSignedIn && !inAuthScreen && segments[0] !== undefined) {
      console.log("Redirecting to login (auth)");
      router.replace("/(auth)");
    }
  }, [user, token, segments, isReady, router]);

  // Show a loading indicator while checking authentication
  if (!isReady) {
    return (
      <SafeAreaProvider>
        <SafeScreen>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading...</Text>
          </View>
        </SafeScreen>
      </SafeAreaProvider>
    );
  }

  // Only render the app once we've checked authentication
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ title: "Home" }} />
          <Stack.Screen name="(auth)" options={{ title: "Login" }} />
          <Stack.Screen name="(auth)/signup" options={{ title: "Sign Up" }} />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
