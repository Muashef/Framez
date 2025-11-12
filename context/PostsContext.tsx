"use client"

import { supabase } from "@/services/supabase"
import type { Post } from "@/types"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface PostsContextType {
  posts: Post[]
  loading: boolean
  fetchPosts: () => Promise<void>
  createPost: (content: string, imageUrl?: string) => Promise<void>
  deletePost: (postId: string) => Promise<void>
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPosts()

    const channel = supabase
      .channel("posts-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          console.log("[v0] Real-time event:", payload.eventType)
          if (payload.eventType === "INSERT") {
            fetchPosts()
          } else if (payload.eventType === "DELETE") {
            setPosts((prev) => prev.filter((p) => p.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("posts")
        .select("*, user:users(*)")
        .order("created_at", { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error("Fetch posts error:", error)
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (content: string, imageUrl?: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      console.log("[v0] Creating post for user:", user.id)

      // Check if user profile exists
      const { data: userProfile, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single()

      console.log("[v0] User profile check:", userProfile, userError)

      if (!userProfile) {
        console.log("[v0] User profile not found, creating one now...")
        // Create profile if it doesn't exist
        const { error: createProfileError } = await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          username: user.email?.split("@")[0] || "user",
        })
        if (createProfileError) {
          console.error("[v0] Failed to create user profile:", createProfileError)
          throw new Error("User profile not found and could not be created")
        }
      }

      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content,
        image_url: imageUrl,
      })

      if (error) throw error
      await fetchPosts()
    } catch (error) {
      console.error("[v0] Create post error:", error)
      throw error
    }
  }

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId)
      if (error) throw error
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    } catch (error) {
      throw error
    }
  }

  return (
    <PostsContext.Provider value={{ posts, loading, fetchPosts, createPost, deletePost }}>
      {children}
    </PostsContext.Provider>
  )
}

export const usePosts = () => {
  const context = useContext(PostsContext)
  if (!context) {
    throw new Error("usePosts must be used within PostsProvider")
  }
  return context
}
