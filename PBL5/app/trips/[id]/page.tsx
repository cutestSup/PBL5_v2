"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, CreditCard, Info, MapPin, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SimplifiedSeatSelector } from "@/components/simplified-seat-selector"
import { CTAButton } from "@/components/cta-button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useScheduleDetails, useScheduleSeats } from "@/hooks/use-schedules"
import { useCreateBooking } from "@/hooks/use-bookings"
import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  })

  // Fetch trip details from API
  const { data: tripData, isLoading: isLoadingTrip, error: tripError } = useScheduleDetails(params.id)

  // Fetch seat information from API
  const { data: seatsData, isLoading: isLoadingSeats } = useScheduleSeats(params.id)

  // Create booking mutation
  const { mutate: createBooking, isPending: isBooking } = useCreateBooking()

  // Pre-fill form data if user is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }))
    }
  }, [user])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle seat selection
  const handleSeatSelection = (seats: string[]) => {
    setSelectedSeats(seats)
  }

  // Handle proceed to payment
  const handleProceedToPayment = () => {
    // Validate form
    if (!formData.name || !formData.phone || !formData.email) {
      alert("Vui lòng nhập đầy đủ thông tin liên hệ")
      return
    }

    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ghế")
      return
    }

    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      // Save booking data to localStorage for after login
      localStorage.setItem(
        "pendingBooking",
        JSON.stringify({
          scheduleId: params.id,
          seats: selectedSeats,
          contactInfo: formData,
        }),
      )

      router.push(`/auth/login?redirect=/trips/${params.id}`)
      return
    }

    // Create booking
    createBooking({
      scheduleId: params.id,
      seats: selectedSeats,
      contactInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        note: formData.note,
      },
    })
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  // Render star rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : i < rating
                ? "text-yellow-400 fill-yellow-400 opacity-50"
                : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))
  }

  // Loading state
  if (isLoadingTrip) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (tripError || !tripData) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>

        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {tripError ? "Failed to load trip details. Please try again later." : "Trip not found."}
          </AlertDescription>
        </Alert>

        <Button onClick={() => router.push("/search")}>Return to Search</Button>
      </div>
    )
  }

  const trip = tripData
  const availableSeats = seatsData?.filter((seat) => seat.status === "available") || []
  const totalPrice = trip.price * selectedSeats.length

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      {/* Back button */}
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
      </Button>

      {/* Trip Details */}
      <Card className="mb-6 dark:border-gray-700">
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{trip.company.name}</h1>
              <p className="text-gray-600 dark:text-gray-300">{trip.type}</p>
            </div>
            <div className="flex items-center">
              <div className="flex mr-2">{renderStars(trip.rating || 4.5)}</div>
              <span className="text-sm text-gray-600 dark:text-gray-300">({trip.reviewCount || 0} đánh giá)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="font-medium">{new Date(trip.departureDate).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="text-center flex flex-col">
                <span className="text-lg font-semibold">
                  {new Date(trip.departureTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <div className="relative">
                  <Separator className="my-2 dark:bg-gray-700" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-50 dark:bg-blue-900/20 px-2 text-xs text-gray-500 dark:text-gray-400">
                    {trip.duration || "6h"}
                  </span>
                </div>
                <span className="text-lg font-semibold">
                  {new Date(trip.arrivalTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-green-600 dark:text-green-400">{formatPrice(trip.price)}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">/ người</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 shrink-0" />
                  <div>
                    <p className="font-medium">Điểm đón:</p>
                    <p className="text-gray-600 dark:text-gray-300">{trip.departurePoint}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 shrink-0" />
                  <div>
                    <p className="font-medium">Điểm trả:</p>
                    <p className="text-gray-600 dark:text-gray-300">{trip.arrivalPoint}</p>
                  </div>
                </div>
              </div>
            </div>

            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>Thông tin chuyến xe</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {trip.description ||
                      "Xe chất lượng cao, giường nằm thoải mái, đầy đủ tiện nghi. Hành trình di chuyển êm ái, an toàn với đội ngũ tài xế nhiều kinh nghiệm và xe đời mới."}
                  </p>

                  <h3 className="font-semibold mb-2">Tiện ích</h3>
                  <div className="flex flex-wrap gap-2">
                    {(trip.amenities || ["WiFi", "Điều hòa", "Nước uống", "Đồ ăn nhẹ", "Chăn gối"]).map((amenity) => (
                      <span
                        key={amenity}
                        className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Đánh giá ({trip.reviewCount || 0})</AccordionTrigger>
                <AccordionContent>
                  {trip.reviews && trip.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {trip.reviews.map((review: any) => (
                        <div key={review.id} className="border-b dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                                <AvatarFallback>{review.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{review.user.name}</p>
                                <div className="flex items-center">
                                  <div className="flex mr-2">{renderStars(review.rating)}</div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">Chưa có đánh giá nào cho chuyến xe này.</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
      </Card>

      {/* Seat Selection */}
      <SimplifiedSeatSelector
        busType={trip.type}
        availableSeats={trip.availableSeats}
        onSelectSeats={handleSeatSelection}
        selectedSeats={selectedSeats}
        maxSeats={5}
        price={trip.price}
      />

      {/* Passenger Information */}
      <Card className="mb-6 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Thông tin hành khách</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="0912345678"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@gmail.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Input
                id="note"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Thông tin thêm về chuyến đi của bạn"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card className="mb-6 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Điều khoản & Lưu ý</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Lưu ý quan trọng</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Quý khách vui lòng có mặt tại bến xuất phát trước ít nhất 30 phút giờ xe khởi hành.</li>
                <li>Đảm bảo mang theo giấy tờ tùy thân và thông tin đặt vé để thuận tiện cho việc lên xe.</li>
                <li>Hành lý xách tay không quá 10kg, hành lý ký gửi không quá 20kg.</li>
                <li>Không mang vật dụng dễ cháy nổ, thực phẩm có mùi lên xe.</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Chính sách hủy vé</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Hủy vé trước 24 giờ: hoàn tiền 70% giá vé</li>
                <li>Hủy vé trong vòng 12-24 giờ: hoàn tiền 50% giá vé</li>
                <li>Hủy vé trong vòng 12 giờ: không được hoàn tiền</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Summary and Payment Button */}
      <Card className="mb-6 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Tóm tắt đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Chuyến xe:</span>
                <span>
                  {trip.company.name} - {trip.route}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Ngày đi:</span>
                <span>
                  {new Date(trip.departureDate).toLocaleDateString("vi-VN")} (
                  {new Date(trip.departureTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })})
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Ghế đã chọn:</span>
                <span>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "Chưa chọn ghế"}</span>
              </div>
              <Separator className="my-2 dark:bg-gray-700" />
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Tổng tiền:</span>
                <span className="font-bold text-green-600 dark:text-green-400">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <CTAButton
              className="w-full"
              onClick={handleProceedToPayment}
              disabled={isBooking || selectedSeats.length === 0}
            >
              {isBooking ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
                <span className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" /> Tiến hành thanh toán
                </span>
              )}
            </CTAButton>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Bằng cách nhấn "Tiến hành thanh toán", bạn đồng ý với các điều khoản và điều kiện của chúng tôi.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
