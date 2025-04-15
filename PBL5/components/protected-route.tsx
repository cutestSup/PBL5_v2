"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Lưu URL hiện tại để sau khi đăng nhập có thể quay lại
        const currentPath = window.location.pathname
        router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`)
      } else if (adminOnly && !isAdmin) {
        // Nếu route yêu cầu quyền admin nhưng người dùng không phải admin
        router.push("/")
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router, adminOnly])

  // Hiển thị loading khi đang kiểm tra xác thực
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Nếu đã xác thực và có quyền phù hợp, hiển thị nội dung
  if (isAuthenticated && (!adminOnly || isAdmin)) {
    return <>{children}</>
  }

  // Trường hợp khác, không hiển thị gì (đã chuyển hướng trong useEffect)
  return null
}
