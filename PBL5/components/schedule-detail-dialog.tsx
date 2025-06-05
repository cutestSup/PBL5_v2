"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { seatService } from "@/services/seat-service"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "@/components/ui/use-toast"
import { ScheduleDetailResponse } from "@/services/schedule-service"

interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phone: string;
    scheduleId: string;
    seats: string[];
    totalPrice: number;
    status: string;
    createdAt: string;
  };
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  scheduleId: string;
  seats: string[];
  totalPrice: number;
}

interface SeatButtonProps {
  seatId: string
  selected: boolean
  booked: boolean
  onClick: () => void
  onHover: (seatId: string | null) => void
}

function SeatButton({ seatId, selected, booked, onClick, onHover }: SeatButtonProps) {
  return (
    <button
      className={cn(
        "w-10 h-14 relative transition-colors",
        "border rounded",
        selected 
          ? "bg-green-100 text-green-500 border-green-500" 
          : booked
          ? "bg-gray-200 text-gray-400 border-gray-400 cursor-not-allowed"
          : "bg-white hover:border-blue-500 border-gray-300",
        "flex items-center justify-center"
      )}
      disabled={booked}
      onClick={onClick}
      onMouseEnter={() => onHover(seatId)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="text-sm font-medium">{seatId}</div>
    </button>
  )
}

interface ScheduleDetailDialogProps {
  schedule: any
  isOpen: boolean
  onClose: () => void
}

// Hàm chuyển đổi tên ghế sang ID
const getSeatId = (seatName: string, scheduleId: string) => {
  // Xác định điểm bắt đầu dựa vào scheduleId
  const startId = scheduleId === "1" ? 1 : 35;
  
  // Xử lý tầng dưới (A)
  if (seatName.startsWith('A')) {
    const number = parseInt(seatName.slice(1));
    if (number <= 6) return startId + number - 1;
    if (number <= 11) return startId + number - 1;
    if (number <= 17) return startId + number - 1;
  }
  // Xử lý tầng trên (B)
  else if (seatName.startsWith('B')) {
    const number = parseInt(seatName.slice(1));
    if (number <= 6) return startId + 17 + number - 1;
    if (number <= 11) return startId + 17 + number - 1;
    if (number <= 17) return startId + 17 + number - 1;
  }
  return 0; // Trường hợp lỗi
}

export function ScheduleDetailDialog({
  schedule,
  isOpen,
  onClose
}: ScheduleDetailDialogProps) {
  const router = useRouter()
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null)  
  const [totalPrice, setTotalPrice] = useState(0)
  const [error, setError] = useState("")
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: ""
  })

  // Log schedule data when it changes
  useEffect(() => {
    console.log('Current schedule:', schedule);
    if (schedule?.id) {
      console.log('Schedule ID:', schedule.id);
    }
  }, [schedule])

  const lowerDeckSeats = {
    col1: Array.from({ length: 6 }, (_, i) => `A${i + 1}`),
    col2: Array.from({ length: 5 }, (_, i) => `A${i + 7}`), // Bỏ ghế đầu
    col3: Array.from({ length: 6 }, (_, i) => `A${i + 12}`)
  }
  
  const upperDeckSeats = {
    col1: Array.from({ length: 6 }, (_, i) => `B${i + 1}`),
    col2: Array.from({ length: 5 }, (_, i) => `B${i + 7}`), // Bỏ ghế đầu 
    col3: Array.from({ length: 6 }, (_, i) => `B${i + 12}`)
  }

  useEffect(() => {
    if (schedule && selectedSeats.length > 0) {
      setTotalPrice(selectedSeats.length * schedule.price)
    } else {
      setTotalPrice(0)
    }
  }, [selectedSeats, schedule])

  // Fetch seat status
  const { data: seatStatus, isLoading: loadingSeats } = useQuery({
    queryKey: ["seats", schedule?.id],
    queryFn: () => seatService.getSeatStatus(schedule.id),
    enabled: !!schedule?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  // Reserve seats mutation
  const { mutate: reserveSeats } = useMutation({
    mutationFn: (seats: string[]) => seatService.reserveSeats(schedule.id, seats),
    onError: (error: Error) => {
      setError(error.message || "Không thể đặt ghế")
    }
  })

  // Release seats mutation
  const { mutate: releaseSeats } = useMutation({
    mutationFn: (seats: string[]) => seatService.releaseSeats(schedule.id, seats)
  })

  const handleSeatClick = (seatId: string) => {
    setError("")
    setSelectedSeats(prev => {
      const newSeats = prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
      
      // Release old seats if removing
      if (prev.includes(seatId)) {
        releaseSeats([seatId])
      } else {
        // Try to reserve new seat
        reserveSeats([seatId])
      }
      
      return newSeats
    })
  }

  // Create booking mutation
  const createBookingMutation = useMutation<BookingResponse, Error, void, unknown>({    mutationFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vui lòng đăng nhập để đặt vé");
      }

      // Convert seat names to seat IDs
      const seatIds = selectedSeats.map(seatName => getSeatId(seatName, String(schedule.id)));      // Prepare booking data with converted seat IDs
      const bookingData = {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        scheduleId: String(schedule.id),
        seats: seatIds.map(id => String(id))
      };

      console.log('Sending formatted data:', bookingData);

      const response = await fetch("http://localhost:5000/api/booking/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bookingData),
      });
        if (!response.ok) {
        const errorData = await response.json();
        console.error('Booking error:', errorData);
        throw new Error(errorData.message || "Đặt vé thất bại");
      }
      
      const data = await response.json();
      console.log('Booking response:', data);
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Đặt vé thành công!",
        description: "Bạn sẽ được chuyển đến trang thanh toán.",
      });
      // Chuyển đến trang thanh toán với ID đặt vé
      router.push(`/payment?bookingId=${data.data.id}`);
    },
    onError: (error: Error) => {
      setError(error.message || "Đặt vé thất bại!");
      toast({
        title: "Đặt vé thất bại!",
        description: error.message || "Vui lòng thử lại sau.", 
        variant: "destructive",
      });
    }
  })

  const handleContinue = () => {
    // Validate
    if (selectedSeats.length === 0) {
      setError("Vui lòng chọn ít nhất 1 ghế")
      return
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      setError("Vui lòng điền đầy đủ thông tin")
      return  
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerInfo.email)) {
      setError("Email không hợp lệ")
      return
    }

    // Validate phone number (Vietnam format)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/
    if (!phoneRegex.test(customerInfo.phone)) {
      setError("Số điện thoại không hợp lệ")
      return
    }

    // Debug information
    console.log('Booking attempt with:', {
      schedule: schedule,
      selectedSeats,
      customerInfo,
      totalPrice
    });

    // Create booking
    createBookingMutation.mutate()
  }

  // Release seats when unmounting or closing dialog
  useEffect(() => {
    return () => {
      if (selectedSeats.length > 0) {
        releaseSeats(selectedSeats)
      }
    }
  }, [])

  if (!schedule) return null

  // Get booked seats from seat status
  const bookedSeats = seatStatus?.data?.seats?.rows
    ?.filter(seat => seat.status === "booked")
    ?.map(seat => seat.seatId) || []

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl p-0">
        <div className="flex h-[80vh]">
          {/* Left panel - Seat map */}
          <div className="w-2/3 p-6 border-r overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Sơ đồ chỗ ngồi</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span className="text-sm">Còn trống</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Đang chọn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span className="text-sm">Đã đặt</span>
                </div>
              </div>
            </div>            
            <div className="grid grid-cols-2 gap-8">              
              {/* Tầng dưới */}
              <div className="relative bg-gray-50 rounded-lg p-6">
                <h4 className="text-sm font-medium mb-4">Tầng dưới</h4>
                {/* Vô lăng */}
                <div className="absolute top-4 left-4">
                  <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-400">⌂</span>
                  </div>
                </div>
                <div className="relative mt-8">
                  <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                    {/* Cột 1 */}
                    <div className="space-y-4">
                      {lowerDeckSeats.col1.map(seatId => (
                        <SeatButton
                          key={seatId}
                          seatId={seatId}
                          selected={selectedSeats.includes(seatId)}
                          booked={schedule.bookedSeats?.includes(seatId)}
                          onClick={() => handleSeatClick(seatId)}
                          onHover={setHoveredSeat}
                        />
                      ))}
                    </div>

                    {/* Cột 2 - không có ghế đầu */}
                    <div className="space-y-4">
                      <div className="h-14" /> {/* Chỗ trống cho ghế đầu bị bỏ */}
                      {lowerDeckSeats.col2.map(seatId => (
                        <SeatButton
                          key={seatId}
                          seatId={seatId}
                          selected={selectedSeats.includes(seatId)}
                          booked={schedule.bookedSeats?.includes(seatId)}
                          onClick={() => handleSeatClick(seatId)}
                          onHover={setHoveredSeat}
                        />
                      ))}
                    </div>

                    {/* Cột 3 */}
                    <div className="space-y-4">
                      {lowerDeckSeats.col3.map(seatId => (
                        <SeatButton
                          key={seatId}
                          seatId={seatId}
                          selected={selectedSeats.includes(seatId)}
                          booked={schedule.bookedSeats?.includes(seatId)}
                          onClick={() => handleSeatClick(seatId)}
                          onHover={setHoveredSeat}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tầng trên */}
              <div className="relative bg-gray-50 rounded-lg p-6">
                <h4 className="text-sm font-medium mb-4">Tầng trên</h4>
                <div className="relative mt-8">
                  <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                    {/* Cột 1 */}
                    <div className="space-y-4">
                      {upperDeckSeats.col1.map(seatId => (
                        <SeatButton
                          key={seatId}
                          seatId={seatId}
                          selected={selectedSeats.includes(seatId)}
                          booked={schedule.bookedSeats?.includes(seatId)}
                          onClick={() => handleSeatClick(seatId)}
                          onHover={setHoveredSeat}
                        />
                      ))}
                    </div>

                    {/* Cột 2 - không có ghế đầu */}
                    <div className="space-y-4">
                      <div className="h-14" /> {/* Chỗ trống cho ghế đầu bị bỏ */}
                      {upperDeckSeats.col2.map(seatId => (
                        <SeatButton
                          key={seatId}
                          seatId={seatId}
                          selected={selectedSeats.includes(seatId)}
                          booked={schedule.bookedSeats?.includes(seatId)}
                          onClick={() => handleSeatClick(seatId)}
                          onHover={setHoveredSeat}
                        />
                      ))}
                    </div>

                    {/* Cột 3 */}
                    <div className="space-y-4">
                      {upperDeckSeats.col3.map(seatId => (
                        <SeatButton
                          key={seatId}
                          seatId={seatId}
                          selected={selectedSeats.includes(seatId)}
                          booked={schedule.bookedSeats?.includes(seatId)}
                          onClick={() => handleSeatClick(seatId)}
                          onHover={setHoveredSeat}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin ghế khi hover */}
            {hoveredSeat && (
              <div className="absolute bg-white border shadow-lg rounded p-2 text-sm">
                <div>Ghế: {hoveredSeat}</div>
                <div>Giá: {schedule.price.toLocaleString()}đ</div>
              </div>
            )}
          </div>

          {/* Right panel - Schedule details */}
          <div className="w-1/3 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{schedule.busType}</h3>
              <div className="flex items-center text-yellow-500">
                <span className="mr-1">⭐</span>
                <span className="font-semibold">4.5</span>
                <span className="ml-1 text-gray-500 text-sm">(100 đánh giá)</span>
              </div>
            </div>
            <form className="space-y-4">
              <div>
                <div className="text-gray-600">Thông tin hành khách</div>
                <div className="mt-2 space-y-4">
                  <div>                    <label className="text-sm text-gray-500">Họ và tên</label>
                    <Input 
                      type="text" 
                      placeholder="Nhập họ và tên"
                      value={customerInfo.name}
                      onChange={(e) => {
                        setError("");
                        setCustomerInfo(prev => ({ ...prev, name: e.target.value }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <Input 
                      type="email" 
                      placeholder="Nhập email"
                      value={customerInfo.email}
                      onChange={(e) => {
                        setError("");
                        setCustomerInfo(prev => ({ ...prev, email: e.target.value }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Số điện thoại</label>
                    <Input 
                      type="tel" 
                      placeholder="Nhập số điện thoại"
                      value={customerInfo.phone}
                      onChange={(e) => {
                        setError("");
                        setCustomerInfo(prev => ({ ...prev, phone: e.target.value }));
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="text-gray-600">Chi tiết chuyến</div>
                <div className="mt-2 space-y-2">
                  <div>
                    <div className="text-gray-600">Thời gian</div>
                    <div className="font-semibold">
                      {schedule.departureTime.slice(0,5)} → {schedule.arrivalTime.slice(0,5)}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-600">Điểm đón</div>
                    <div className="font-semibold">{schedule.pickupPoint || "Bến xe"}</div>
                  </div>

                  <div>
                    <div className="text-gray-600">Điểm trả</div>
                    <div className="font-semibold">{schedule.dropoffPoint || "Bến xe"}</div>
                  </div>

                  <div>
                    <div className="text-gray-600">Số ghế trống</div>
                    <div className="font-semibold">{schedule.availableSeats} ghế</div>
                  </div>

                  <div>
                    <div className="text-gray-600">Giá vé</div>
                    <div className="text-xl font-bold text-green-600">
                      {schedule.price.toLocaleString()}đ
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>          
        {/* Bottom panel - Selected seats summary */}
        <div className="border-t p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-sm text-gray-600">Ghế đã chọn ({selectedSeats.length})</div>
              <div className="font-semibold">{selectedSeats.length > 0 ? selectedSeats.join(", ") : "Chưa chọn ghế"}</div>
              <div className="text-sm text-gray-600 mt-1">
                Tổng tiền: <span className="font-semibold text-green-600">{totalPrice.toLocaleString()}đ</span>
              </div>
            </div>            
            <div className="text-right">              
              {/* Debug info */}
              
              <Button
                onClick={handleContinue}
                disabled={selectedSeats.length === 0 || !!error || !customerInfo.name || !customerInfo.email || !customerInfo.phone}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createBookingMutation.status === "pending" ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  "Tiếp tục đặt vé"
                )}
              </Button>
              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
              {/* Thêm thông báo về lý do không thể tiếp tục */}
              {!error && (
                <div className="text-red-500 text-sm mt-2">
                  {selectedSeats.length === 0 && "Vui lòng chọn ít nhất 1 ghế"}
                  {selectedSeats.length > 0 && !customerInfo.name && "Vui lòng nhập họ và tên"}
                  {selectedSeats.length > 0 && customerInfo.name && !customerInfo.email && "Vui lòng nhập email"}
                  {selectedSeats.length > 0 && customerInfo.name && customerInfo.email && !customerInfo.phone && "Vui lòng nhập số điện thoại"}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            * Thời gian giữ ghế tối đa 20 phút. Vui lòng hoàn tất thanh toán trong thời gian này.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
