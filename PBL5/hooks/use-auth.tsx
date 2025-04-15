"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authService, type LoginCredentials, type RegisterData, type AuthResponse, type RegisterResponse } from "@/services/auth-service"
import { toast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: any | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  register: (userData: RegisterData) => Promise<RegisterResponse>
  logout: () => Promise<void>
  updateProfile: (userData: Partial<RegisterData>) => Promise<AuthResponse>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Check if user is authenticated
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authService.getCurrentUser().then((res) => res.data.user),
    enabled: typeof window !== "undefined" && !!localStorage.getItem("userToken"),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Update authentication state when user data changes
  useEffect(() => {
    setIsAuthenticated(!!user)
  }, [user])

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Save token and user data to localStorage
      localStorage.setItem("userToken", data.data.token)
      localStorage.setItem("userRole", data.data.user.role_code)
      localStorage.setItem("userName", data.data.user.name)
      localStorage.setItem("userEmail", data.data.user.email)
      if (data.data.user.avatar) {
        localStorage.setItem("userAvatar", data.data.user.avatar)
      }

      // Invalidate and refetch current user
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.data.user.name}!`,
      })

      // Redirect based on role
      if (data.data.user.role_code === "R1") {
        router.push("/admin/dashboard")
      } else {
        router.push("/")
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      })
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: (data) => {
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please log in.",
      })
      router.push("/auth/login")
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Could not create account",
        variant: "destructive",
      })
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear localStorage
      localStorage.removeItem("userToken")
      localStorage.removeItem("userRole")
      localStorage.removeItem("userName")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userAvatar")

      // Clear user from cache
      queryClient.setQueryData(["currentUser"], null)
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })

      router.push("/")
    },
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (userData: Partial<RegisterData>) => authService.updateProfile(userData),
    onSuccess: (data) => {
      // Update localStorage
      localStorage.setItem("userName", data.data.user.name)
      localStorage.setItem("userEmail", data.data.user.email)
      if (data.data.user.avatar) {
        localStorage.setItem("userAvatar", data.data.user.avatar)
      }

      // Invalidate and refetch current user
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Could not update profile",
        variant: "destructive",
      })
    },
  })

  // Auth context value
  const value = {
    user,
    isLoading,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
