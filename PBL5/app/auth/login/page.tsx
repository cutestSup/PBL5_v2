"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authService } from "@/services/auth-service"

export default function LoginPage() {
  const router = useRouter()
  // Thêm xử lý thông báo đăng ký thành công
  // Thêm đoạn code này vào đầu component LoginPage
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (registered === "true") {
      setSuccessMessage("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.")
    }
  }, [registered])
  const redirect = searchParams.get("redirect") || "/"

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("") // Xóa thông báo lỗi khi người dùng nhập
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Kiểm tra cơ bản
    if (!formData.email || !formData.password) {
      setError("Vui lòng nhập đầy đủ thông tin")
      setIsLoading(false)
      return
    }

    try {
      // Gọi API đăng nhập
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      })

      // Kiểm tra xem response có thành công không
      if (response.success) {
        // Lưu token (loại bỏ "Bearer " nếu cần)
        const token = response.data.token.startsWith("Bearer ") ? response.data.token.substring(7) : response.data.token

        localStorage.setItem("userToken", token)

        // Lưu thông tin người dùng
        localStorage.setItem("userRole", response.data.user.role_code)
        localStorage.setItem("userName", response.data.user.name)
        localStorage.setItem("userEmail", response.data.user.email)
        if (response.data.user.avatar) {
          localStorage.setItem("userAvatar", response.data.user.avatar)
        }

        // Chuyển hướng dựa trên vai trò
        if (response.data.user.role_code === "R1") {
          router.push("/admin/dashboard")
        } else {
          router.push(redirect)
        }

        console.log(
          "Đăng nhập thành công, chuyển hướng đến:",
          response.data.user.role_code === "R1" ? "/admin/dashboard" : redirect,
        )
      } else {
        setError("Đăng nhập không thành công: " + response.mes)
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="absolute inset-0 bg-pattern opacity-10"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <div className="bg-white text-blue-600 h-16 w-16 rounded-full flex items-center justify-center text-3xl font-bold">
              BC
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Chào mừng trở lại!</h1>
          <p className="text-blue-100">Đăng nhập để tiếp tục hành trình của bạn</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardContent className="p-6 pt-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="text-sm py-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {successMessage && (
                <Alert variant="default" className="text-sm py-2 bg-green-50 border-green-200 text-green-700">
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Email hoặc số điện thoại
                </Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="example@gmail.com"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 px-4 bg-gray-50 dark:bg-gray-900/50 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-base">
                    Mật khẩu
                  </Label>
                  <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-12 px-4 bg-gray-50 dark:bg-gray-900/50 focus-visible:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogIn className="mr-2 h-5 w-5" /> Đăng nhập
                  </span>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">hoặc</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="h-12">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" type="button" className="h-12">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"></path>
                  </svg>
                  Facebook
                </Button>
              </div>
            </form>
          </CardContent>
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg border-t dark:border-gray-700 text-center">
            <p className="text-sm">
              Chưa có tài khoản?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </Card>
      </div>

      <style jsx>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  )
}
