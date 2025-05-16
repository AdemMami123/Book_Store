import React from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform
  
} from "react-native";
import styles from "../../assets/styles/signup.styles";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import COLORS from "../../constants/Colors";


export default function Signup() {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  
  const {user,isLoading,register} = useAuthStore();

  const handleSignup =async () => {
    const result = await register(username, email, password);
  if (!result.success) {
    alert(result.message);
  }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Travel Destinations</Text>
            <Text style={styles.subtitle}>Share your knowledge</Text>
            <Ionicons
              name="locate-outline"
              size={60}
              color="#000"
              style={styles.icon}
            />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Username */}
            <View style={styles.label}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={24}
                  color="black"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter your username"
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.label}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={24}
                  color="black"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter your email"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.label}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color="black"
                  style={styles.inputIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  
                />
                <TextInput
                  placeholder="Enter your password"
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}

                  
                />
                <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              </View>
            </View>

           
          </View>
        </View>
        {/* Create account button */}
        <TouchableOpacity style={styles.button} onPress={handleSignup}
        disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>
        {/* Footer */}
        <View>
          <Text style={styles.footerText}>Already have an account ?</Text>
          <Link href="/" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
