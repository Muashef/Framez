import { useAuth } from "@/context/AuthContext"
import { usePosts } from "@/context/PostsContext"
import { supabase } from "@/services/supabase"
import * as ImagePicker from "expo-image-picker"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"

export default function CreatePostScreen() {
  const [content, setContent] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const { createPost } = usePosts()
  const { user } = useAuth()

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Please allow access to your gallery.")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image.")
      console.error("Image picker error:", error)
    }
  }

  const uploadImage = async (uri: string) => {
    try {
      const filename = `${Date.now()}.jpg`

      const response = await fetch(uri)
      const arrayBuffer = await response.arrayBuffer()
      const fileData = new Uint8Array(arrayBuffer)

      console.log("Uploading image:", filename)

      const { data, error } = await supabase.storage
        .from("posts")
        .upload(filename, fileData, {
          contentType: "image/jpeg",
          upsert: false,
        })

      if (error) throw error

      console.log("Upload successful:", data)

      const { data: publicData } = supabase.storage
        .from("posts")
        .getPublicUrl(filename)

      return publicData.publicUrl
    } catch (error: any) {
      console.error("Image upload failed:", error)
      throw new Error(`Failed to upload image: ${error.message}`)
    }
  }

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please write something before posting.")
      return
    }

    try {
      setUploading(true)
      let imageUrl: string | null = null

      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage)
      }

      await createPost(content, imageUrl)
      Alert.alert("Success", "Post created!")
      setContent("")
      setSelectedImage(null)
      router.push("/(tabs)")
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create post.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username ? user.username[0].toUpperCase() : "U"}
            </Text>
          </View>
          <Text style={styles.username}>{user?.username || "User"}</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
          editable={!uploading}
          maxLength={500}
        />

        {selectedImage && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: selectedImage }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.imageButton}
          onPress={pickImage}
          disabled={uploading}
        >
          <Text style={styles.imageButtonText}>📸 Add Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.postButton, uploading && styles.postButtonDisabled]}
          onPress={handleCreatePost}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  imagePreview: {
    marginBottom: 16,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "#fff",
    fontSize: 20,
  },
  imageButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  imageButtonText: {
    fontSize: 16,
    color: "#000",
  },
  postButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  postButtonDisabled: {
    opacity: 0.6,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})
