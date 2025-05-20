import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.styles";
import COLORS from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../constants/api";

export default function Create() {
  //use states logic
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null);
  const [ImageBase64, setImageBase64] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const{token}=useAuthStore();
  const pickImage = async () => {
    try {
      //request permission to access the image library
      if(Platform.OS !=="web"){
        const {status}=await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status!=="granted"){
          alert("Sorry, we need camera roll permissions to make this work!");
          return;
        }
      }
      //lunch the image library
      const result=await ImagePicker.launchImageLibraryAsync({
        mediaTypes:"Images",
        allowsEditing:true,
        aspect:[4,3],
        quality:0.5, //lower the quality for faster upload
        base64:true,
      });
      if(!result.canceled){
        setImage(result.assets[0].uri);
        if(result.assets[0].base64){
          setImageBase64(result.assets[0].base64);
        }else{
          const base64=await FileSystem.readAsStringAsync(result.assets[0].uri,{
            encoding:FileSystem.EncodingType.Base64,
          });
          setImageBase64(base64);
        }
      }
    } catch (error) {
      console.log("Error picking image: ", error);
      alert("Error picking image");
      
    }
  };
  const handleSubmit = async () => {
    if(!title || !caption || !ImageBase64 || !rating){
      alert("Please fill all the fields");
      return;

    }
    try {
      setLoading(true);
      const uriParts=image.split(".");
      const fileType=uriParts[uriParts.length-1];
      const imageType=fileType? `image/${fileType.toLowerCase()}`: "image/jpeg";
      const imageDataUrl=`data:${imageType};base64,${ImageBase64}`;
      const response=await fetch(`${API_URL}/destinations`,{
        method:"POST",
        headers:{
          authorization:`Bearer ${token}`,
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          title,
          caption,
          rating:rating.toString(),
          image:imageDataUrl,
        }),
    })
    const data =await response.json();
    if(!response.ok) throw new Error(data.message || "Something went wrong");
    Alert.alert("Success", "Destination added successfully");

    setTitle("");
    setCaption("");
    setRating(3);
    setImage(null);
    setImageBase64(null);
    
    router.push("/");

    } catch (error) {
      console.log("Error submitting form: ", error);
      Alert.alert("Error", error.message || "Something went wrong");
      
    }finally{
      setLoading(false);
    }
  };
  
  
  const renderRatingPicker=()=>{
    const stars=[];
    for(let i=1;i<=5;i++){
      stars.push(
        <TouchableOpacity key={i} onPress={()=>setRating(i)}style={styles.starButton}>
          <Ionicons name={i<=rating? "star":"star-outline"}
          size={32}
          color={i<=rating ? "#f4b400":COLORS.textSecondary}
          
          />
          
        </TouchableOpacity>
      )
    }
    return <View style={styles.ratingContainer}>{stars}</View>

  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
      >
        <View style={styles.card}>
          {/*Header*/}
          <View style={styles.header}>
            <Text style={styles.title}>Add Destination recommendation</Text>
            <Text style={styles.subTitle}>
              Share your experience with the world
            </Text>
          </View>
          {/*Form*/}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Destination</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="location-outline"
                size={20}
                color={COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Enter destination name"
                placeholderTextColor={COLORS.textSecondary}
                style={styles.input}
                value={title}
                onChange={setTitle}
              />
            </View>
          </View>
          {/*rating*/}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Your Rating</Text>
            {renderRatingPicker()}

          </View>
          {/*image*/}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Destination Image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{uri:image}} style={styles.previewImage}/>
            ) :(<View style={styles.placeholderContainer}>
              <Ionicons
                name="image-outline"
                size={50}
                color={COLORS.textSecondary}
              />
              <Text style={styles.placeholderText}>Pick an image</Text>
            </View>)
            }

            </TouchableOpacity>
          </View>
          {/*caption*/}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Caption</Text>
            <TextInput
              placeholder="Write a caption about your experience"
              placeholderTextColor={COLORS.textSecondary}
              style={styles.textArea}
              value={caption}
              onChange={setCaption}
              multiline
            />
          </View>
          {/*submit button*/}
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLORS.white}/>
            ) : (
              <>
              <Ionicons
                name="cloud-upload-outline"
                size={20}
                color={COLORS.white}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Share</Text>
              </>
            )
            }


          </TouchableOpacity>
          

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
