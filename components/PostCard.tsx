"use client"
import { useAuth } from "@/context/AuthContext"
import { usePosts } from "@/context/PostsContext"
import type { Post } from "@/types"
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const { deletePost } = usePosts()
  const { user } = useAuth()
  const isOwnPost = user?.id === post.user_id

  const handleDelete = () => {
    Alert.alert("Delete Post", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(post.id)
          } catch (error) {
            Alert.alert("Error", "Failed to delete post")
          }
        },
      },
    ])
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{post.user?.username[0].toUpperCase()}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.username}>{post.user?.username}</Text>
            <Text style={styles.timestamp}>{formattedDate}</Text>
          </View>
        </View>
        {isOwnPost && (
          <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.deleteButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {post.image_url && <Image source={{ uri: post.image_url }} style={styles.image} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    flex: 1,
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
  userDetails: {
    justifyContent: "center",
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  deleteButton: {
    fontSize: 20,
    color: "#999",
  },
  content: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
})
