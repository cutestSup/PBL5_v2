import { api } from '@/lib/api'
import { AxiosError } from "axios"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}

export interface LoginData {
  email: string
  password: string
}

// Cập nhật interface AuthResponse để phù hợp với response thực tế
export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    token: string
    user: {
      id: number
      name: string
      email: string
      phone?: string
      role_code: string
      avatar?: string | null
    }
  }
}

// Thêm interface RegisterResponse để phù hợp với response thực tế
export interface RegisterResponse {
  success: boolean
  message: string
  data?: {
    id: number
    name: string
    email: string
    phone?: string
    role_code: string
    avatar?: string | null
    }
  }

class AuthService {
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data)
      return response.data
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data)
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token)
    }
    return response.data
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token')
  }

  async getCurrentUser(): Promise<AuthResponse> {
    const response = await api.get<AuthResponse>('/auth/me')
    return response.data
  }

  async updateProfile(data: Partial<RegisterData>): Promise<AuthResponse> {
    const response = await api.put<AuthResponse>('/auth/profile', data)
    return response.data
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<AuthResponse> {
    const response = await api.put<AuthResponse>('/auth/change-password', {
      oldPassword,
      newPassword,
    })
    return response.data
  }

  async forgotPassword(email: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/forgot-password', { email })
    return response.data
  }

  async resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/reset-password', {
      token,
      newPassword,
    })
    return response.data
  }
}

export const authService = new AuthService()
