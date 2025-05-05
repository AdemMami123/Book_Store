import { Link } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container }>
      
    
      
      <Link href="/(auth)">Login</Link>
      <Link href="/(auth)/signup">SignUp</Link>
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
  


