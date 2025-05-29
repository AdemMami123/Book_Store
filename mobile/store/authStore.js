import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {API_URL}from "../constants/api";
// Use your machine's IP address instead of localhost
//const API_URL = "http://10.0.2.2:3000"; // For Android emulator
// const API_URL = "http://localhost:3000"; // Original - doesn't work on mobile devices

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (username, email, password) => {
    set({ isLoading: true });

    try {
      console.log("Registering user:", email);
      console.log("API URL:", `${API_URL}/api/auth/register`);

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      // First get the raw text response for debugging
      const responseText = await response.text();
      console.log("Register response:", responseText);
      
      // Try to parse it as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing register response as JSON:", parseError);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (!data.token) {
        console.error("No token returned from registration");
        throw new Error("Authentication failed: No token received");
      }

      await AsyncStorage.setItem("user", JSON.stringify(data));
      await AsyncStorage.setItem("token", data.token);

      set({ user: data, token: data.token, isLoading: false });
      console.log("Registration successful:", data);

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      set({ isLoading: false });
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    }
  },
  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;
      
      console.log("Auth check - Token:", token ? token.substring(0, 20) + "..." : "No token");
      console.log("Auth check - User:", user ? `ID: ${user._id}` : "No user");
      
      // Only set as authenticated if both token and user exist
      if (token && user) {
        console.log("Auth check: User is authenticated");
        set({ user, token });
        return { isAuthenticated: true, user, token };
      } else {
        console.log("Auth check: User is NOT authenticated");
        set({ user: null, token: null });
        return { isAuthenticated: false };
      }
    } catch (error) {
      console.log("Error checking auth:", error);
      set({ user: null, token: null });
      return { isAuthenticated: false, error };
    }
  },  //logout
  logout: async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      set({ user: null, token: null });
    } catch (error) {
      console.log("Error logging out:", error);
    }
  },

  //login logic
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      console.log("Logging in user:", email);
      console.log("API URL:", `${API_URL}/api/auth/login`);
      
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      
      // First get the raw text response for debugging
      const responseText = await response.text();
      console.log("Login response:", responseText);
      
      // Try to parse it as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing login response as JSON:", parseError);
        throw new Error("Invalid response from server");
      }
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      if (!data.token) {
        console.error("No token returned from login");
        throw new Error("Authentication failed: No token received");
      }
      
      console.log("Token received:", data.token.substring(0, 20) + "...");
      
      // Store data in AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(data));
      await AsyncStorage.setItem("token", data.token);
      
      set({ token: data.token, user: data, isLoading: false });
      console.log("Login successful:", data);
      return { success: true };
    } catch (error) {
      console.log("Login error:", error);
      set({ isLoading: false });
      return {
        success: false,
        message: error.message || "Login failed"
      };
    } 
  },
}));
