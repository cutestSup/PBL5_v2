"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  ChevronRight,
  Edit,
  LogOut,
  Ticket,
  Lock,
  Upload,
  Camera,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CTAButton } from "@/components/cta-button"
import { ZoomImage } from "@/components/zoom-image"

// Mock user data
const userData = {
  name: "Tạ Quang Hữu",
  phone: "0935629524",
  email: "huutaquang23@gmail.com",
  gender: "Nam",
  birthDate: "23/03/2004",
  address: "",
  occupation: "",
  avatar: "/placeholder.svg?height=200&width=200&text=Avatar",
}

// Mock booking history
const bookingHistory = [
  {
    id: "BK123456",
    route: "Hồ Chí Minh - Đà Lạt",
    company: "Phương Trang",
    date: "15/06/2024",
    time: "07:00",
    status: "upcoming",
    price: 280000,
  },
  {
    id: "BK123457",
    route: "Hồ Chí Minh - Vũng Tàu",
    company: "Thành Bưởi",
    date: "10/05/2024",
    time: "09:00",
    status: "completed",
    price: 160000,
  },
  {
    id: "BK123458",
    route: "Hồ Chí Minh - Nha Trang",
    company: "Kumho Samco",
    date: "01/04/2024",
    time: "20:00",
    status: "completed",
    price: 300000,
  },
]

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("account")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(userData)
  const [isUploading, setIsUploading] = useState(false)

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    // Here you would update the user data in the backend
  }

  // Handle logout
  const handleLogout = () => {
    // Here you would handle logout logic
    router.push("/")
  }

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
            Sắp tới
          </span>
        )
      case "completed":
        return (
          <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
            Hoàn thành
          </span>
        )
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
            Đã hủy
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">Thông tin tài khoản</h1>
      <p className="text-muted-foreground mb-8">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card className="sticky top-20 dark:border-gray-700">
            <CardContent className="p-0">
              <nav className="flex flex-col">
                <button
                  className={`flex items-center gap-3 p-4 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${activeTab === "account" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : ""}`}
                  onClick={() => setActiveTab("account")}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Thông tin tài khoản</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                <Separator className="dark:bg-gray-700" />

                <button
                  className={`flex items-center gap-3 p-4 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${activeTab === "history" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : ""}`}
                  onClick={() => setActiveTab("history")}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                    <Ticket className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Lịch sử mua vé</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                <Separator className="dark:bg-gray-700" />

                <button
                  className={`flex items-center gap-3 p-4 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${activeTab === "password" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : ""}`}
                  onClick={() => setActiveTab("password")}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Đặt lại mật khẩu</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                <Separator className="dark:bg-gray-700" />

                <button
                  className="flex items-center gap-3 p-4 text-left text-red-600 dark:text-red-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleLogout}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Đăng xuất</p>
                  </div>
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {activeTab === "account" && (
            <Card className="dark:border-gray-700">
              <CardHeader>
                <CardTitle>Thông tin tài khoản</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Avatar Section */}
                    <div className="md:col-span-1 flex flex-col items-center">
                      <div className="relative group">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-900/30">
                          <ZoomImage src={formData.avatar} alt="Avatar" fill className="w-full h-full" />
                        </div>
                        <button
                          type="button"
                          className="absolute bottom-0 right-0 bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 hover:scale-110"
                          onClick={() => setIsUploading(true)}
                        >
                          <Camera className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Dung lượng file tối đa 1 MB</p>
                      <p className="text-sm text-muted-foreground">Định dạng: .JPEG, .PNG</p>
                    </div>

                    {/* Form Fields */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            Họ và tên
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            Số điện thoại
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="gender" className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            Giới tính
                          </Label>
                          {isEditing ? (
                            <Select
                              value={formData.gender}
                              onValueChange={(value) => handleSelectChange("gender", value)}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Chọn giới tính" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Nam" className="whitespace-nowrap">
                                  Nam
                                </SelectItem>
                                <SelectItem value="Nữ" className="whitespace-nowrap">
                                  Nữ
                                </SelectItem>
                                <SelectItem value="Khác" className="whitespace-nowrap">
                                  Khác
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input value={formData.gender} disabled className="mt-1 whitespace-nowrap" />
                          )}
                        </div>
                        <div>
                          <Label htmlFor="birthDate" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            Ngày sinh
                          </Label>
                          <Input
                            id="birthDate"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          Địa chỉ
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder={!isEditing && !formData.address ? "Chưa cập nhật" : ""}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="occupation" className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          Nghề nghiệp
                        </Label>
                        <Input
                          id="occupation"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder={!isEditing && !formData.occupation ? "Chưa cập nhật" : ""}
                          className="mt-1"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        {isEditing ? (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsEditing(false)
                                setFormData(userData)
                              }}
                            >
                              Hủy
                            </Button>
                            <CTAButton type="submit" showArrow={false}>
                              <Upload className="mr-2 h-4 w-4" />
                              Cập nhật
                            </CTAButton>
                          </>
                        ) : (
                          <Button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 hover:scale-105"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "history" && (
            <Card className="dark:border-gray-700">
              <CardHeader>
                <CardTitle>Lịch sử mua vé</CardTitle>
              </CardHeader>
              <CardContent>
                {bookingHistory.length > 0 ? (
                  <div className="space-y-4">
                    {bookingHistory.map((booking) => (
                      <div
                        key={booking.id}
                        className="border dark:border-gray-700 rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700"
                      >
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{booking.route}</h3>
                              {renderStatusBadge(booking.status)}
                            </div>
                            <p className="text-muted-foreground">{booking.company}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                                <span className="text-sm">{booking.date}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                                <span className="text-sm">{booking.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex flex-col items-end justify-between">
                            <p className="font-bold text-green-600 dark:text-green-400">{formatPrice(booking.price)}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Mã đặt vé: {booking.id}</p>
                            <CTAButton size="sm" onClick={() => router.push(`/tickets/${booking.id}`)} className="mt-2">
                              Chi tiết
                            </CTAButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Ticket className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Chưa có lịch sử đặt vé</h3>
                    <p className="text-muted-foreground mb-4">Bạn chưa đặt vé nào trên hệ thống của chúng tôi.</p>
                    <CTAButton onClick={() => router.push("/")}>Tìm chuyến xe ngay</CTAButton>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "password" && (
            <Card className="dark:border-gray-700">
              <CardHeader>
                <CardTitle>Đặt lại mật khẩu</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                    <Input id="currentPassword" type="password" placeholder="Nhập mật khẩu hiện tại" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <Input id="newPassword" type="password" placeholder="Nhập mật khẩu mới" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                    <Input id="confirmPassword" type="password" placeholder="Xác nhận mật khẩu mới" className="mt-1" />
                  </div>
                  <div className="pt-4">
                    <CTAButton type="submit" showArrow={false}>
                      <Lock className="mr-2 h-4 w-4" />
                      Cập nhật mật khẩu
                    </CTAButton>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
