"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authService } from "@/services/auth-service"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
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
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.password) {
      setError("Vui lòng nhập đầy đủ thông tin")
      setIsLoading(false)
      return
    }

    // Kiểm tra mật khẩu xác nhận
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      setIsLoading(false)
      return
    }

    try {
      // Gọi API đăng ký
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      })

      // Kiểm tra xem response có thành công không
      if (response.success) {
        // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
        router.push("/auth/login?registered=true")
      } else {
        setError("Đăng ký không thành công: " + response.mes)
      }
    } catch (err: any) {
      console.error("Register error:", err)
      setError(err.message || "Đăng ký không thành công. Vui lòng thử lại sau.")
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
          <h1 className="text-3xl font-bold text-white mb-2">Tạo tài khoản mới</h1>
          <p className="text-blue-100">Đăng ký để bắt đầu hành trình của bạn</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardContent className="p-6 pt-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="text-sm py-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-base">
                  Họ và tên
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Nguyễn Văn A"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="h-12 px-4 bg-gray-50 dark:bg-gray-900/50 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="example@gmail.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 px-4 bg-gray-50 dark:bg-gray-900/50 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-base">
                  Số điện thoại
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="0912345678"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="h-12 px-4 bg-gray-50 dark:bg-gray-900/50 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">
                  Mật khẩu
                </Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base">
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
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
                className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 mt-6"
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
                    <UserPlus className="mr-2 h-5 w-5" /> Đăng ký
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg border-t dark:border-gray-700 text-center">
            <p className="text-sm">
              Đã có tài khoản?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Đăng nhập ngay
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
