import apiClient from "@/lib/api-client"
import { AxiosError } from "axios"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  fullName: string
  email: string
  password: string
  phoneNumber: string
}

// Cập nhật interface AuthResponse để phù hợp với response thực tế
export interface AuthResponse {
  success: boolean
  mes: string // Thay đổi từ message sang mes
  data: {
    token: string
    user: {
      id: number
      name: string
      email: string
      password: string
      avatar: string | null
      phone: string
      address: string | null
      role_code: string // Thay đổi từ role sang role_code
      status: string
    }
  }
}

// Thêm interface RegisterResponse để phù hợp với response thực tế
export interface RegisterResponse {
  success: boolean
  mes: string
  data: {
    user: {
      id: number
      name: string
      email: string
      password: string
      phone: string
    }
  }
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      console.log("Attempting login with:", credentials)
      const response = await apiClient.post<AuthResponse>("/auth/login", credentials)
      console.log("Login successful:", response.data)
      return response.data
    } catch (error) {
      console.error("Login error:", error)

      if (error instanceof AxiosError) {
        console.error("Response error data:", error.response?.data)

        // Tạo thông báo lỗi dựa trên phản hồi từ server
        const errorMessage =
          error.response?.data?.mes ||
          error.response?.data?.error ||
          `Lỗi ${error.response?.status}: Đăng nhập không thành công`

        throw new Error(errorMessage)
      } else if (error instanceof Error) {
        throw new Error(`Lỗi khi thiết lập yêu cầu: ${error.message}`)
      } else {
        throw new Error("Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.")
      }
    }
  },

  // Cập nhật phương thức register để sử dụng RegisterResponse
  register: async (userData: RegisterData) => {
    const response = await apiClient.post<RegisterResponse>("/auth/register", userData)
    return response.data
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout")
    return response.data
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<AuthResponse>("/auth/me")
    return response.data
  },

  updateProfile: async (userData: Partial<RegisterData>) => {
    const response = await apiClient.put<AuthResponse>("/auth/me", userData)
    return response.data
  },
}
