"use client"

import { supabase } from "@/services/supabase"
import type { User } from "@/types"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  user: User | null
  session: any
  loading: boolean
  signup: (email: string, password: string, username: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check existing session
    const checkSession = async () => {
      try {
        const savedSession = await AsyncStorage.getItem("supabase_session")
        if (savedSession) {
          const { data } = await supabase.auth.getSession()
          if (data.session) {
            setSession(data.session)
            await fetchUserProfile(data.session.user.id)
          }
        }
      } catch (error) {
        console.error("[v0] Session check error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state changed:", event, session?.user?.id)
      if (session) {
        setSession(session)
        await fetchUserProfile(session.user.id)
        await AsyncStorage.setItem("supabase_session", JSON.stringify(session))
      } else {
        setUser(null)
        setSession(null)
        await AsyncStorage.removeItem("supabase_session")
      }
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      console.log("[v0] Fetching user profile for:", userId, data)
      if (error) throw error
      setUser(data)
    } catch (error) {
      console.error("[v0] Profile fetch error:", error)
    }
  }

  const signup = async (email: string, password: string, username: string) => {
    try {
      console.log("[v0] Starting signup for:", email)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      console.log("[v0] Auth signup response:", authData, authError)
      if (authError) throw authError

      if (authData.user) {
        console.log("[v0] User created in auth, now inserting profile:", authData.user.id)

        // Wait a moment for auth to fully sync
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .upsert([
            {
              id: authData.user.id,
              email,
              username,
            },
          ])
          .select()

        console.log("[v0] Profile upsert response:", { data: profileData, error: profileError })

        if (profileError) {
          console.error("[v0] Profile upsert failed:", profileError)
          throw profileError
        } else {
          await fetchUserProfile(authData.user.id)
        }
      }
    } catch (error) {
      console.error("[v0] Signup error:", error)
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log("[v0] Starting login for:", email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("[v0] Login response:", data, error)
      if (error) throw error
      if (data.user) {
        await fetchUserProfile(data.user.id)
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      await AsyncStorage.removeItem("supabase_session")
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signup, login, logout }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
