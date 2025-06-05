"use client"

import { useState, useEffect, createContext, useContext, type ReactNode, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authService } from "@/services/auth-service"

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  role_code: string
  avatar?: string
}

interface AuthResponse {
  success: boolean
  message: string
  data?: {
    token: string
    user: User
  }
}

interface RegisterResponse {
  success: boolean
  message: string
  data?: User
}

interface AuthContextType {
  user: User | null
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = localStorage.getItem("token")
      if (!token) return null
      const response = await authService.getCurrentUser() as AuthResponse
      if (response.success && response.data?.user) {
        return response.data.user
      }
      localStorage.removeItem("token")
      return null
    },
    retry: false,
  })

  useEffect(() => {
    if (!isLoadingUser) {
      setUser(currentUser ?? null)
      setIsLoading(false)
    }
  }, [currentUser, isLoadingUser])

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await authService.login(data) as AuthResponse
      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token)
        return response.data.user
      }
      throw new Error(response.message || "Đăng nhập thất bại")
    },
    onSuccess: (userData) => {
      setUser(userData)
      queryClient.setQueryData(["currentUser"], userData)
      router.push("/")
    },
      })

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await authService.register(data) as RegisterResponse
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || "Đăng ký thất bại")
    },
    onSuccess: () => {
      router.push("/auth/login?registered=true")
    },
  })

  const login = async (data: LoginData) => {
    await loginMutation.mutateAsync(data)
  }

  const register = async (data: RegisterData) => {
    await registerMutation.mutateAsync(data)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    queryClient.setQueryData(["currentUser"], null)
    router.push("/auth/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
