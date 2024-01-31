import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

const uploadPhotoStyles = StyleSheet.create({
  container: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 16,
    borderRadius: 50,
  },
});

export default function App() {
  const [selectedImages, setSelectedImages] = useState(null);
  const UploadImage = () => {
    const pickImageAsync = async () => {
      try {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        // console.log("his")
        if (status !== "granted") {
          alert("Sorry We Need Permission");
          return;
        } else {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 0,
          });
          if (!result.canceled) {
            setSelectedImages(result.assets[0].uri);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    return (
      <TouchableOpacity
        style={uploadPhotoStyles.container}
        onPress={() => {
          pickImageAsync();
        }}
      >
        {selectedImages && (
          <Image
            source={{ uri: selectedImages }}
            style={uploadPhotoStyles.image}
          />
        )}
        {!selectedImages && <Text>+</Text>}
        {/* <Text>+</Text> */}
      </TouchableOpacity>
    );
  };

  const [desc, setdesc] = useState("");
  const uploadImage = async (imageUri) => {
    try {
      const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
      const formData = new FormData();
      console.log(timestamp);
      const result = await fetch(imageUri);
      const blob = await result.blob();
      formData.append("image", {
        uri: imageUri,
        type: blob.type, // Adjust the type based on your image format
        name: `upload_${timestamp}.${blob.type.split("/")[1]}`,
      });
      formData.append('text',desc)
      console.log(formData)

      fetch("http://192.168.0.108:3000/images", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          return;
        });
    } catch (error) {
      console.log("Error Fronted:", error);
    }
  };

  return (
    <View style={styles.container}>
      <UploadImage />
      <Text style={{ marginTop: 10, fontSize: 20 }}>Upload photo</Text>
      <Text style={{ marginTop: 10, fontSize: 20 }}>Enter Description</Text>
      <TextInput
        placeholder="Description"
        style={{
          marginTop: 10,
          fontSize: 20,
          borderWidth: 1,
          borderColor: "black",
          padding: 10,
        }}
        onChangeText={(text) => setdesc(text)}
      />
      <Pressable
        style={{
          marginTop: 20,
          padding: 20,
          backgroundColor: "green",
          borderRadius: 10,
        }}
        onPress={() => {
          uploadImage(selectedImages);
        }}
      >
        <Text style={{ fontSize: 20 }}>Upload</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
