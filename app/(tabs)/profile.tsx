import { useAuth } from "@/context/AuthContext"
import { usePosts } from "@/context/PostsContext"
import type { Post } from "@/types"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function ProfileScreen() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { posts } = usePosts()
  const [userPosts, setUserPosts] = useState<Post[]>([])

  useEffect(() => {
    const filteredPosts = posts.filter((post) => post.user_id === user?.id)
    setUserPosts(filteredPosts)
  }, [posts, user])

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout()
            router.replace("/screens/auth/login")
          } catch (error) {
            Alert.alert("Error", "Failed to logout")
          }
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarTextLarge}>{user?.username[0].toUpperCase()}</Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.username}>{user?.username}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                {user?.bio && <Text style={styles.bio}>{user.bio}</Text>}
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userPosts.length}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

            <Text style={styles.postsTitle}>Your Posts</Text>
          </View>
        }
        data={userPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postPreview}>
            {item.image_url && <Image source={{ uri: item.image_url }} style={styles.postImage} />}
            <Text style={styles.postContent} numberOfLines={2}>
              {item.content}
            </Text>
            <Text style={styles.postDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileSection: {
    flexDirection: "row",
    marginBottom: 16,
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarTextLarge: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
    justifyContent: "center",
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    marginRight: 30,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  postsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  postPreview: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: "hidden",
    padding: 8,
  },
  postImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    marginBottom: 8,
  },
  postDate: {
    fontSize: 12,
    color: "#999",
  },
  columnWrapper: {
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
})
