import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your machine's IP address instead of localhost
const API_URL = "http://10.0.2.2:3000"; // For Android emulator
// const API_URL = "http://localhost:3000"; // Original - doesn't work on mobile devices

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (username, email, password) => {
    set({ isLoading: true });

    try {
      
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      await AsyncStorage.setItem('user', JSON.stringify(data));
      await AsyncStorage.setItem('token', data.token);

      set({ user: data, token: data.token, isLoading: false });

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      set({ isLoading: false });
      return { success: false, message: error.message || "Network request failed" };
    }
  },
}));
