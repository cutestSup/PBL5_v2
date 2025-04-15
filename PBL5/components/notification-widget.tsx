"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface Notification {
  id: string
  title: string
  content: string
  time: string
  read: boolean
  type: "info" | "success" | "warning"
}

export function NotificationWidget() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Mock notifications
  const mockNotifications = [
    {
      id: "1",
      title: "Xác nhận đặt vé",
      content: "Vé của bạn cho chuyến Hồ Chí Minh - Đà Lạt đã được xác nhận.",
      time: "15 phút trước",
      read: false,
      type: "success" as const,
    },
    {
      id: "2",
      title: "Nhắc nhở chuyến đi",
      content: "Chuyến đi của bạn đến Đà Lạt sẽ khởi hành trong 2 ngày nữa.",
      time: "2 giờ trước",
      read: false,
      type: "info" as const,
    },
    {
      id: "3",
      title: "Mã giảm giá mới",
      content: "Bạn đã nhận được mã giảm giá 10% cho chuyến đi tiếp theo.",
      time: "1 ngày trước",
      read: false,
      type: "info" as const,
    },
    {
      id: "4",
      title: "Thay đổi lịch trình",
      content: "Có sự thay đổi nhỏ về thời gian khởi hành chuyến Hồ Chí Minh - Vũng Tàu.",
      time: "3 ngày trước",
      read: true,
      type: "warning" as const,
    },
  ]

  useEffect(() => {
    // Load notifications
    setNotifications(mockNotifications)
    // Count unread notifications
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
  }, [])

  // Mark notification as read
  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    )

    setNotifications(updatedNotifications)
    setUnreadCount(updatedNotifications.filter((n) => !n.read).length)
  }

  // Mark all as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }))

    setNotifications(updatedNotifications)
    setUnreadCount(0)
  }

  // Get background color based on notification type
  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-100 border-l-4 border-green-500"
      case "warning":
        return "bg-amber-100 border-l-4 border-amber-500"
      default:
        return "bg-blue-100 border-l-4 border-blue-500"
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold">Thông báo</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-sm h-8" onClick={markAllAsRead}>
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>
        <Separator />
        <div className="max-h-[400px] overflow-auto">
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 relative ${notification.read ? "bg-white" : getNotificationColor(notification.type)}`}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium">{notification.title}</h4>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => markAsRead(notification.id, e)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">Không có thông báo nào</div>
          )}
        </div>
        <Separator />
        <div className="p-2 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm w-full"
            onClick={() => {
              /* Navigate to all notifications */
            }}
          >
            Xem tất cả thông báo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
