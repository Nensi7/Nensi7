"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  subscription: "free" | "basic" | "professional" | "enterprise"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("nlp_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - in production, this would validate against a backend
    if (password.length < 6) {
      throw new Error("Invalid credentials")
    }

    const mockUser: User = {
      id: Math.random().toString(36).substring(7),
      email,
      name: email.split("@")[0],
      subscription: "free",
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("nlp_user", JSON.stringify(mockUser))
  }

  const signup = async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock signup validation
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }

    if (!email.includes("@")) {
      throw new Error("Invalid email address")
    }

    const mockUser: User = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
      subscription: "free",
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("nlp_user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("nlp_user")
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error("No user logged in")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem("nlp_user", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
