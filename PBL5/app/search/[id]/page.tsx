"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useParams } from "next/navigation"
import { useQuery, useMutation } from "@tanstack/react-query"
import { scheduleService, ScheduleDetailResponse } from "@/services/schedule-service"
import { seatService } from "@/services/seat-service"
import { bookingService } from "@/services/booking-service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLocation } from "@/hooks/use-location"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SeatMap, SeatMapTemplate, SeatStatus } from "@/components/SeatMap"

export default function ScheduleDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  const { locations } = useLocation()
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [bookingMessage, setBookingMessage] = useState("")
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" })
  const [agree, setAgree] = useState(false)
  // Fetch schedule detail
  const { data: detail, isLoading: loadingDetail } = useQuery<ScheduleDetailResponse>({
    queryKey: ["schedule-detail", id],
    queryFn: () => scheduleService.detail(id),
    enabled: !!id,
  })

  // Fetch seat data using seat service
  const { data: seatData, isLoading: loadingSeats } = useQuery({
    queryKey: ["seat-status", id],
    queryFn: () => seatService.getSeatStatus(id),
    enabled: !!id,
  })

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async () => {
      const response = await bookingService.createBooking({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        scheduleId: id,
        seats: selectedSeats,
      })
      return response
    },
    onSuccess: (data) => {
      // Redirect to payment page with booking ID
      router.push(`/payment?bookingId=${data.data.id}`)
    },
    onError: (error: Error) => {
      setBookingMessage(error.message || "Đặt vé thất bại!")
    }
  })
  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("http://localhost:5000/api/booking/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          scheduleId: id,
          seats: selectedSeats
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Đặt vé thất bại!")
      }
      return res.json()
    },
    onSuccess: (res) => {
      setBookingMessage("Đặt vé thành công!")
      setSelectedSeats([])
      console.log("Kết quả đặt vé:", res)
      // Redirect to payment page with booking ID
      router.push(`/payment?bookingId=${res.data.id}`)
    },
    onError: (err: any) => {
      setBookingMessage(err.message || "Đặt vé thất bại!")
      console.log("Lỗi đặt vé:", err)
    },
  })

  // Seat labels for display
  const seatLabels = [
    "A01", "A02", "A03", "A04", "A05",
    "A06", "A07", "A08", "A09", "A10",
    "A11", "A12", "A13", "A14", "A15",
    "A16", "A17", "B01", "B02", "B03",
    "B04", "B05", "B06", "B07", "B08",
    "B09", "B10", "B11", "B12", "B13",
    "B14", "B15", "B16", "B17"
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  const totalPrice = (detail?.data?.price ?? 0) * selectedSeats.length

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value })
  }

  const canBook = selectedSeats.length > 0 && customer.name && customer.phone && customer.email && agree && !bookingMutation.isPending
  // Helper để tạo template sơ đồ ghế
  function getSeatMapTemplate(seatData: any): SeatMapTemplate {
    // 3 cột, mỗi cột 7 ghế, cột giữa không có ghế đầu
    const rows = [
      { rowLabel: "A", count: 7 }, // Cột 1
      { rowLabel: "B", count: 7, skip: 1 }, // Cột 2 (bỏ ghế đầu)
      { rowLabel: "C", count: 7 }, // Cột 3
    ]
    const floors = ["Tầng dưới", "Tầng trên"]
    let seatIdx = 0
    const seatsPerFloor = 18 // 3 hàng x 6 ghế
    return {
      floors: floors.map((floor, floorIdx) => ({
        name: floor,
        rows: rows.map(row => {
            const seats: {
            id: string
            label: string
            status: SeatStatus
            floor: string
            row: string
            col: number
            isEmpty?: boolean
            }[] = []
          for (let i = 0; i < row.count; i++) {
            if (row.rowLabel === "B" && i === 0 && row.skip) {
              seats.push({
                id: `${row.rowLabel}${i + 1 + floorIdx * seatsPerFloor}`,
                label: "",
                status: "empty" as SeatStatus,
                floor,
                row: row.rowLabel,
                col: i + 1,
                isEmpty: true,
              })
              continue
            }
            // Lấy trạng thái ghế từ seatData nếu có
            let status: SeatStatus = "available"
            if (seatData?.data?.seatStatusCode) {
              const code = seatData.data.seatStatusCode[seatIdx]
              if (code === "0") status = "booked"
              else if (code === "1") status = "available"
              // Có thể mở rộng thêm trạng thái khác nếu backend trả về
            }
            seats.push({
              id: `${row.rowLabel}${i + 1 + floorIdx * seatsPerFloor}`,
              label: `${row.rowLabel}${i + 1 + floorIdx * seatsPerFloor}`,
              status,
              floor,
              row: row.rowLabel,
              col: i + 1,
            })
            seatIdx++
          }
          return { rowLabel: row.rowLabel, seats }
        })
      }))
    }
  }

  if (loadingDetail) return <div className="container mx-auto px-4 py-8">Đang tải chi tiết chuyến đi...</div>
  if (!detail?.data) return <div className="container mx-auto px-4 py-8 text-red-500">Không tìm thấy chi tiết chuyến đi.</div>
  if (!detail || !detail.data) return <div className="container mx-auto px-4 py-8">Không có dữ liệu chi tiết.</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT: Sơ đồ ghế + Form khách hàng + Điều khoản */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 text-lg">Chọn ghế</h3>
              {/* Sơ đồ ghế */}
              {loadingSeats ? (
                <div>Đang tải sơ đồ ghế...</div>
              ) : (
                <div>
                  <SeatMap
                    template={getSeatMapTemplate(seatData)}
                    selectedSeats={selectedSeats}
                    onSelect={(seatId) => {
                      setSelectedSeats(seats =>
                        seats.includes(seatId)
                          ? seats.filter(s => s !== seatId)
                          : [...seats, seatId]
                      )
                    }}
                  />
                  {/* Legend */}
                  <div className="flex items-center gap-4 mb-6 mt-4">
                    <div className="flex items-center gap-1"><span className="w-6 h-6 rounded bg-gray-300 inline-block border" /> <span className="text-sm">Đã bán</span></div>
                    <div className="flex items-center gap-1"><span className="w-6 h-6 rounded bg-blue-100 border inline-block" /> <span className="text-sm">Còn trống</span></div>
                    <div className="flex items-center gap-1"><span className="w-6 h-6 rounded bg-blue-400 border inline-block" /> <span className="text-sm">Đang chọn</span></div>
                  </div>
                </div>
              )}

              {/* Form khách hàng */}
              <div className="mt-8">
                <h4 className="font-semibold mb-2">Thông tin khách hàng</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="name">Họ và tên *</Label>
                    <input id="name" name="name" className="w-full border rounded px-3 py-2" value={customer.name} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <input id="phone" name="phone" className="w-full border rounded px-3 py-2" value={customer.phone} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <input id="email" name="email" className="w-full border rounded px-3 py-2" value={customer.email} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <Checkbox id="agree" checked={agree} onCheckedChange={checked => setAgree(Boolean(checked))} />
                  <Label htmlFor="agree" className="ml-2 text-sm">
                    Chấp nhận <a href="#" className="text-blue-600 underline">điều khoản</a> đặt vé & chính sách bảo mật thông tin
                  </Label>
                </div>
              </div>

              {/* Điều khoản & lưu ý */}
              <div className="mt-4 p-4 bg-gray-50 rounded text-sm text-gray-700">
                <div className="font-semibold text-orange-600 mb-2">ĐIỀU KHOẢN & LƯU Ý</div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Quý khách vui lòng có mặt tại bến xuất phát của xe trước ít nhất 30 phút giờ xe khởi hành, mang theo thông báo đã thanh toán vé thành công có chứa mã vé được gửi từ hệ thống.</li>
                  <li>Nếu có nhu cầu trung chuyển, vui lòng liên hệ tổng đài trước khi đặt vé.</li>
                  <li>Chúng tôi không đón/trung chuyển tại những điểm xe trung chuyển không thể tới được.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Thông tin chuyến đi + Chi tiết giá */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="font-semibold text-lg mb-2">Thông tin lượt đi</div>
                <div>Tuyến xe: <span className="font-medium">{detail.data.routeData.fromLocation?.name} - {detail.data.routeData.toLocation?.name}</span></div>
                <div>Thời gian xuất bến: <span className="font-medium">{detail.data.departureTime} {detail.data.date}</span></div>
                <div>Số lượng ghế: <span className="font-medium">{selectedSeats.length} Ghế</span></div>
                <div>Số ghế: <span className="font-medium">{selectedSeats.map(seatId => seatLabels[Number(seatId) - 1]).join(", ")}</span></div>
                <div>Điểm trả khách: <span className="font-medium">{detail.data.routeData.toLocation?.name}</span></div>
                <div className="text-green-600 font-bold text-xl mt-2">{formatPrice(totalPrice)}</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-lg mb-2">Chi tiết giá</div>
                <div className="flex justify-between"><span>Giá vé lượt đi</span><span>{formatPrice(detail.data.price)}</span></div>
                <div className="flex justify-between"><span>Phí thanh toán</span><span>0đ</span></div>
                <div className="flex justify-between font-bold border-t pt-2 mt-2"><span>Tổng tiền</span><span>{formatPrice(totalPrice)}</span></div>
              </div>
              <Button
                className="w-full mt-2"
                onClick={() => bookingMutation.mutate()}
                disabled={!canBook}
              >
                {bookingMutation.isPending ? "Đang đặt vé..." : "Đặt vé"}
              </Button>
              {bookingMessage && (
                <div className={bookingMessage.includes("thành công") ? "text-green-600 mt-2" : "text-red-600 mt-2"}>
                  {bookingMessage}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 