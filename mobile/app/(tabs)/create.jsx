import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.styles";
import COLORS from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function Create() {
  //use states logic
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null);
  const [ImageBase64, setImageBase64] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
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
        console.log("result is here",result);
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      
    }
  };
  const handleSubmit = async () => {}; 
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
