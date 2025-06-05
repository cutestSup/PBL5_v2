"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useBookingDetail } from "@/hooks/use-booking-detail"

interface LocalBooking {
  id: number
  booking_code: string
  trip_id: number
  user_id: number
  status: string
  total_price: number
  payment_status: string
  payment_method: string
  created_at: string
  seats: Array<{
    id: number
    seat_number: string
    status: string
    price: number
  }>
  trip: {
    from: string
    to: string
    departure_time: string
    arrival_time: string
    company_name: string
  }
  payment_url?: string
  user: {
    name: string
    email: string
    phone: string
  }
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("bookingId")
  const [timeLeft, setTimeLeft] = useState(1124) // 18:44 in seconds

  // Fetch booking details
  const { data: bookingDetail, isLoading } = useBookingDetail(bookingId || undefined)

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + "đ"
  }

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white flex items-center justify-center">
        <div className="text-gray-600">Đang tải thông tin thanh toán...</div>
      </div>
    )
  }

  if (!bookingDetail?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white flex items-center justify-center">
        <div className="text-red-600">Không tìm thấy thông tin đặt vé</div>
      </div>
    )
  }

  const booking = bookingDetail.data as LocalBooking

  if (timeLeft <= 0) {
    // Redirect to booking page when time runs out
    router.push("/search")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="text-orange-600 font-semibold px-0" 
            onClick={() => router.back()}
          >
            &larr; Quay lại
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-3xl font-bold text-orange-600">
                  {formatCurrency(booking.total_price)}
                </div>
                <div className="text-sm text-gray-500">
                  Thời gian còn lại: <span className="font-semibold">{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="border-t border-b py-6 mb-6">
                <div className="flex flex-col items-center">
                  {booking.payment_url ? (
                    <>
                      <div className="text-center mb-4 text-gray-600">
                        Quét mã QR để thanh toán
                      </div>
                      <Image
                        src={booking.payment_url}
                        alt="QR Code thanh toán"
                        width={200}
                        height={200}
                        className="border p-2"
                        onError={() => {
                          console.error("Failed to load QR code image")
                        }}
                      />
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="text-red-500 font-medium mb-2">Không thể tải mã QR</div>
                      <p className="text-sm text-gray-600">
                        Vui lòng thử lại sau hoặc chuyển khoản trực tiếp bằng thông tin bên dưới
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Banking Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-center text-sm">
                  <div className="font-semibold mb-2">Thông tin chuyển khoản</div>
                  <div><span className="text-gray-600">Ngân hàng:</span> <span className="font-medium">MB Bank</span></div>
                  <div><span className="text-gray-600">Số tài khoản:</span> <span className="font-medium">0123456789</span></div>
                  <div><span className="text-gray-600">Tên TK:</span> <span className="font-medium">CONG TY FUTA</span></div>
                  <div><span className="text-gray-600">Nội dung CK:</span> <span className="font-medium">THANHTOAN {booking.booking_code}</span></div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="font-medium text-gray-900 mb-1">Thông tin hành khách</div>
                  <div className="text-sm text-gray-600">{booking.user.name}</div>
                  <div className="text-sm text-gray-600">{booking.user.email}</div>
                  <div className="text-sm text-gray-600">{booking.user.phone}</div>
                </div>

                <div>
                  <div className="font-medium text-gray-900 mb-1">Thông tin lượt đi</div>
                  <div className="text-sm text-gray-900">
                    {booking.trip.from} → {booking.trip.to}
                  </div>
                  <div className="text-sm text-gray-600">
                    Khởi hành: {new Date(booking.trip.departure_time).toLocaleString("vi-VN")}
                  </div>
                  <div className="text-sm text-gray-600">
                    Số ghế: {booking.seats.map(seat => seat.seat_number).join(", ")}
                  </div>
                </div>

                <div>
                  <div className="font-medium text-gray-900 mb-1">Chi tiết giá</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giá vé ({booking.seats.length} ghế)</span>
                    <span>{formatCurrency(booking.seats.reduce((sum, seat) => sum + seat.price, 0))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí thanh toán</span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-900 border-t pt-2 mt-2">
                    <span>Tổng tiền</span>
                    <span>{formatCurrency(booking.total_price)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-xs text-gray-500 text-center">
                * Vui lòng hoàn tất thanh toán trước khi hết hạn giữ chỗ
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
