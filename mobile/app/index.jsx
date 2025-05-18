import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";



export default function Index() {
  
  const {user,token,checkAuth,logout}=useAuthStore();
//  console.log(user,token);

useEffect(() => {checkAuth()},[]);

  return (
    <View style={styles.container }>
      
    
      <Text style={styles.title}>Welcome back {user?.username}</Text>
      <Link href="/(auth)">Login</Link>
      <Link href="/(auth)/signup">SignUp</Link>
      <TouchableOpacity onPress={logout}>
        <Text style={styles.text}>Logout</Text>

      </TouchableOpacity>
    </View>
  );
}
const styles=StyleSheet.create  ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    color: "#333",
  },
})
  


