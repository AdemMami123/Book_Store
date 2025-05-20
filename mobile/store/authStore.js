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
      const response = await fetch(
        //i need to change this to localhost when using the emulator
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      await AsyncStorage.setItem("user", JSON.stringify(data));
      await AsyncStorage.setItem("token", data.token);

      set({ user: data, token: data.token, isLoading: false });

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      set({ isLoading: false });
      return {
        success: false,
        message: error.message || "Network request failed",
      };
    }
  },
  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;
      
      // Only set as authenticated if both token and user exist
      if (token && user) {
        console.log("Auth check: User is authenticated");
        set({ user, token });
      } else {
        console.log("Auth check: User is NOT authenticated");
        set({ user: null, token: null });
      }
    } catch (error) {
      console.log("Error checking auth:", error);
      set({ user: null, token: null });
    }
  },
  //logout
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
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");
      
      // Fix: The API returns user data directly in response, not nested in a user property
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
