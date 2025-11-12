import { AuthProvider } from "@/context/AuthContext"
import { PostsProvider } from "@/context/PostsContext"
import { Stack } from "expo-router"

export default function RootLayout() {
  return (
    <AuthProvider>
      <PostsProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Auth screens */}
          <Stack.Screen name="screens/auth/login" />
          <Stack.Screen name="screens/auth/signup" />

          {/* App screens */}
          <Stack.Screen name="(tabs)" />
        </Stack>
      </PostsProvider>
    </AuthProvider>
  )
}
