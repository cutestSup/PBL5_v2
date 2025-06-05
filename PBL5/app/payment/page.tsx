"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useBookingDetail } from "@/hooks/use-booking-detail"
import { paymentService } from "@/services/payment-service"

interface BookingDetailResponse {
  success: boolean
  data: {
    booking: {
      id: number
      name: string
      email: string
      phone: string
      scheduleId: number
      reference: string
      booking_status: string
      totalAmount: number
      payment_method: string
      payment_url: string
      expires_at: string
      scheduleData: {
        id: number
        routeId: number
        departureTime: string
        arrivalTime: string
        date: string
        price: number
        availableSeats: number
        totalSeats: number
        busType: string | null
        status_code: string | null
        routeData: {
          id: number
          fromLocationId: number
          toLocationId: number
          fromLocation: {
            name: string
          }
          toLocation: {
            name: string
          }
        }
      }
    }
    seats: {
      count: number
      rows: Array<{
        id: number
        bookingId: number
        seatId: number
      }>
    }
  }
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("bookingId")
  
  // Initialize timeLeft from expires_at
  const [timeLeft, setTimeLeft] = useState(1124)

  // Fetch booking details
  const { data: bookingDetail, isLoading } = useBookingDetail(bookingId || undefined)

  // Update timeLeft based on expires_at when booking data is available
  useEffect(() => {
    if (bookingDetail?.data?.booking?.expires_at) {
      const expiresAt = new Date(bookingDetail.data.booking.expires_at).getTime()
      const now = new Date().getTime()
      const diff = Math.max(0, Math.floor((expiresAt - now) / 1000))
      setTimeLeft(diff)
    }
  }, [bookingDetail?.data?.booking?.expires_at])

  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "0đ"
    return amount.toLocaleString() + "đ"
  }

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Format date safely
  const formatDateTime = (date: string, time: string) => {
    try {
      return new Date(`${date} ${time}`).toLocaleString("vi-VN")
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
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

  const [isProcessing, setIsProcessing] = useState(false)

  const handlePaymentConfirmation = async () => {
    if (!bookingId) return
    
    try {
      setIsProcessing(true)
      const response = await paymentService.processPayment(bookingId)
      
      if (response.success) {
        // Refresh the booking details to get updated status
        router.push("/")
      }
    } catch (error) {
      console.error('Payment processing error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white flex items-center justify-center">
        <div className="text-gray-600">Đang tải thông tin thanh toán...</div>
      </div>
    )
  }

  if (!bookingDetail?.data?.booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white flex items-center justify-center">
        <div className="text-red-600">Không tìm thấy thông tin đặt vé</div>
      </div>
    )
  }

  const { booking, seats } = bookingDetail.data
  const {
    totalAmount,
    name,
    email,
    phone,
    reference,
    payment_url,
    booking_status,
    payment_method,
    scheduleData
  } = booking

  const {
    price,
    date,
    departureTime,
    arrivalTime,
    routeData
  } = scheduleData

  const {
    fromLocation,
    toLocation
  } = routeData

  const seatCount = seats?.count ?? 0

  // Add status translations
  const getBookingStatus = (status: string) => {
    switch (status) {
      case 'BKS4': return 'Chờ thanh toán'
      // Add other status mappings as needed
      default: return status
    }
  }

  const getPaymentMethod = (method: string) => {
    switch (method) {
      case 'PMM2': return 'Chuyển khoản ngân hàng'
      // Add other method mappings as needed
      default: return method
    }
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
              {/* Header with Status */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-3xl font-bold text-orange-600">
                    {formatCurrency(totalAmount)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Trạng thái: <span className="font-medium">{getBookingStatus(booking_status)}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Thời gian còn lại: <span className="font-semibold">{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="border-t border-b py-6 mb-6">
                <div className="flex flex-col items-center">
                  {payment_url ? (
                    <>
                      <div className="text-center mb-4 text-gray-600">
                        Quét mã QR để thanh toán
                      </div>
                      <Image
                        src={payment_url}
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
                  <div className="font-semibold mb-2">
                    Thông tin chuyển khoản - {getPaymentMethod(payment_method)}
                  </div>
                  <div><span className="text-gray-600">Ngân hàng:</span> <span className="font-medium">TP Bank</span></div>
                  <div><span className="text-gray-600">Số tài khoản:</span> <span className="font-medium">22213092004</span></div>
                  <div><span className="text-gray-600">Tên TK:</span> <span className="font-medium">CONG TY BECOOL</span></div>
                  <div><span className="text-gray-600">Nội dung CK:</span> <span className="font-medium">THANHTOAN {reference}</span></div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="font-medium text-gray-900 mb-1">Thông tin hành khách</div>
                  <div className="text-sm text-gray-600">{name}</div>
                  <div className="text-sm text-gray-600">{email}</div>
                  <div className="text-sm text-gray-600">{phone}</div>
                </div>

                <div>
                  <div className="font-medium text-gray-900 mb-1">Thông tin lượt đi</div>
                  <div className="text-sm text-gray-900">
                    {fromLocation.name} → {toLocation.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Khởi hành: {formatDateTime(date, departureTime)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Số ghế: {seatCount} ghế
                  </div>
                </div>

                <div>
                  <div className="font-medium text-gray-900 mb-1">Chi tiết giá</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giá vé ({seatCount} ghế)</span>
                    <span>{formatCurrency(price * seatCount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí thanh toán</span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-900 border-t pt-2 mt-2">
                    <span>Tổng tiền</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Reference Code */}
              <div className="text-center text-sm text-gray-600 mb-4">
                Mã đơn hàng: <span className="font-medium">{reference}</span>
              </div>

              {/* Confirmation Button */}
              <div className="mt-6">
                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  size="lg"
                  onClick={handlePaymentConfirmation}
                  disabled={isProcessing || timeLeft <= 0}
                >
                  {isProcessing ? 'Đang xử lý...' : 'Xác nhận đã thanh toán'}
                </Button>
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
