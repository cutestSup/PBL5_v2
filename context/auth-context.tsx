"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AuthResponse, authService, RegisterResponse } from "@/services/auth-service"

interface User {
  id: number
  name: string
  email: string
  role_code: string
  avatar?: string | null
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean
  login: (credentials: { email: string; password: string }) => Promise<AuthResponse>
  logout: () => Promise<void>
  register: (userData: {
    name: string
    email: string
    password: string
    phone: string
  }) => Promise<RegisterResponse>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Kiểm tra xem người dùng đã đăng nhập chưa khi tải trang
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("userToken")
        if (!token) {
          setUser(null)
          setIsLoading(false)
          return
        }

        // Tạo user từ dữ liệu đã lưu trong localStorage
        const userData = {
          id: Number(localStorage.getItem("userId") || "0"),
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
          role_code: localStorage.getItem("userRole") || "",
          avatar: localStorage.getItem("userAvatar") || null,
        }

        setUser(userData)
      } catch (error) {
        console.error("Auth check error:", error)
        // Xóa dữ liệu nếu có lỗi
        localStorage.removeItem("userToken")
        localStorage.removeItem("userRole")
        localStorage.removeItem("userName")
        localStorage.removeItem("userEmail")
        localStorage.removeItem("userAvatar")
        localStorage.removeItem("userId")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      const response = await authService.login(credentials)

      if (response.success && response.data) {
        // Lưu token (giữ nguyên format "Bearer " nếu có)
        const token = response.data.token
        localStorage.setItem("userToken", token)

        // Lưu thông tin người dùng
        localStorage.setItem("userId", response.data.user.id.toString())
        localStorage.setItem("userRole", response.data.user.role_code)
        localStorage.setItem("userName", response.data.user.name)
        localStorage.setItem("userEmail", response.data.user.email)
        if (response.data.user.avatar) {
          localStorage.setItem("userAvatar", response.data.user.avatar)
        }

        // Cập nhật state
        setUser({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role_code: response.data.user.role_code,
          avatar: response.data.user.avatar,
        })

        // Chuyển hướng dựa trên vai trò
        if (response.data.user.role_code === "R1") {
          router.push("/admin/dashboard")
        } else {
          router.push("/")
        }

        return response
      } else {
        throw new Error(response.message || "Đăng nhập không thành công")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      // Gọi API logout nếu cần
      await authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Xóa dữ liệu người dùng khỏi localStorage
      localStorage.removeItem("userToken")
      localStorage.removeItem("userRole")
      localStorage.removeItem("userName")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userAvatar")
      localStorage.removeItem("userId")

      // Cập nhật state
      setUser(null)
      setIsLoading(false)

      // Chuyển hướng đến trang đăng nhập
      router.push("/auth/login")
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    phone: string
  }) => {
    setIsLoading(true)
    try {
      const response = await authService.register(userData)

      if (response.success) {
        return response
      } else {
        throw new Error(response.message || "Đăng ký không thành công")
      }
    } catch (error) {
      console.error("Register error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: user?.role_code === "R1", // R1 là Admin
    login,
    logout,
    register,
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
