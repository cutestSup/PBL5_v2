"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Calendar, Check, Clock, CreditCard, Info, MapPin, Shield, Ticket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CTAButton } from "@/components/cta-button"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(true)
  const [tripDetails, setTripDetails] = useState<any>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
  })
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [bookingId, setBookingId] = useState("")

  useEffect(() => {
    // Get trip ID and selected seats from URL params
    const tripId = searchParams.get("tripId")
    const seats = searchParams.get("seats")

    if (seats) {
      setSelectedSeats(seats.split(","))
    }

    // Fetch trip details
    const fetchTripDetails = async () => {
      setIsLoading(true)

      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock trip data
      const mockTrip = {
        id: tripId || "T1001",
        company: "Phương Trang",
        route: "Hồ Chí Minh - Đà Lạt",
        departureTime: "07:00",
        arrivalTime: "13:00",
        duration: "6h",
        departureDate: "15/06/2024",
        departurePoint: "Bến xe miền Đông, TP. Hồ Chí Minh",
        arrivalPoint: "Bến xe Đà Lạt, TP. Đà Lạt",
        price: 280000,
        type: "Giường nằm",
        rating: 4.5,
        reviewCount: 120,
      }

      setTripDetails(mockTrip)
      setIsLoading(false)
    }

    fetchTripDetails()

    // Pre-fill contact info if user is logged in
    const userName = localStorage.getItem("userName")
    const userEmail = localStorage.getItem("userEmail")

    if (userName && userEmail) {
      setContactInfo({
        name: userName,
        email: userEmail,
        phone: "",
        note: "",
      })
    }
  }, [searchParams])

  // Handle input change for contact info
  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactInfo((prev) => ({ ...prev, [name]: value }))
  }

  // Handle input change for card info
  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19)

      setCardInfo((prev) => ({ ...prev, [name]: formattedValue }))
      return
    }

    // Format expiry date
    if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5)

      setCardInfo((prev) => ({ ...prev, [name]: formattedValue }))
      return
    }

    // Format CVV (numbers only, max 3 digits)
    if (name === "cvv") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 3)
      setCardInfo((prev) => ({ ...prev, [name]: formattedValue }))
      return
    }

    setCardInfo((prev) => ({ ...prev, [name]: value }))
  }

  // Calculate total price
  const calculateTotal = () => {
    if (!tripDetails) return 0
    return tripDetails.price * selectedSeats.length
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  // Handle payment submission
  const handlePayment = async () => {
    // Validate contact info
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      alert("Vui lòng nhập đầy đủ thông tin liên hệ")
      return
    }

    // Validate card info if credit card payment is selected
    if (paymentMethod === "credit_card") {
      if (!cardInfo.cardNumber || !cardInfo.cardHolder || !cardInfo.expiryDate || !cardInfo.cvv) {
        alert("Vui lòng nhập đầy đủ thông tin thẻ")
        return
      }
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate random booking ID
      const randomId = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")
      setBookingId(`BK${randomId}`)

      // Show success dialog
      setShowSuccessDialog(true)
    } catch (error) {
      alert("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading || !tripDetails) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>

        <h1 className="text-2xl font-bold mb-2">Thanh toán</h1>
        <p className="text-muted-foreground mb-6">Hoàn tất thông tin và thanh toán để đặt vé</p>

        <div className="grid gap-6">
          {/* Trip Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Thông tin chuyến đi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">{tripDetails.company}</h3>
                    <span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full">
                      {tripDetails.type}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <MapPin className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                    <span>{tripDetails.route}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                      <span>{tripDetails.departureDate}</span>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                      <span>
                        {tripDetails.departureTime} - {tripDetails.arrivalTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <p className="font-medium">Điểm đón:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{tripDetails.departurePoint}</p>
                  </div>

                  <div>
                    <p className="font-medium">Điểm trả:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{tripDetails.arrivalPoint}</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium">Ghế đã chọn:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedSeats.map((seat) => (
                      <span
                        key={seat}
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-md text-sm"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Tổng tiền:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedSeats.length} vé x {formatPrice(tripDetails.price)}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatPrice(calculateTotal())}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Thông tin liên hệ</CardTitle>
              <CardDescription>Thông tin người đặt vé</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={contactInfo.name}
                      onChange={handleContactInfoChange}
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
                      value={contactInfo.phone}
                      onChange={handleContactInfoChange}
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
                    value={contactInfo.email}
                    onChange={handleContactInfoChange}
                    placeholder="example@gmail.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Input
                    id="note"
                    name="note"
                    value={contactInfo.note}
                    onChange={handleContactInfoChange}
                    placeholder="Thông tin thêm về chuyến đi của bạn"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Phương thức thanh toán</CardTitle>
              <CardDescription>Chọn phương thức thanh toán phù hợp</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="credit_card" onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="credit_card">Thẻ tín dụng</TabsTrigger>
                  <TabsTrigger value="bank_transfer">Chuyển khoản</TabsTrigger>
                  <TabsTrigger value="momo">Ví MoMo</TabsTrigger>
                </TabsList>

                <TabsContent value="credit_card" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Số thẻ</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={cardInfo.cardNumber}
                      onChange={handleCardInfoChange}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardHolder">Tên chủ thẻ</Label>
                    <Input
                      id="cardHolder"
                      name="cardHolder"
                      value={cardInfo.cardHolder}
                      onChange={handleCardInfoChange}
                      placeholder="NGUYEN VAN A"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        value={cardInfo.expiryDate}
                        onChange={handleCardInfoChange}
                        placeholder="MM/YY"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        value={cardInfo.cvv}
                        onChange={handleCardInfoChange}
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                    <p>Thông tin thanh toán của bạn được bảo mật và mã hóa.</p>
                  </div>
                </TabsContent>

                <TabsContent value="bank_transfer" className="space-y-4 pt-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Thông tin chuyển khoản</AlertTitle>
                    <AlertDescription>
                      <div className="mt-2 space-y-2">
                        <p>Vui lòng chuyển khoản đến tài khoản sau:</p>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md space-y-1">
                          <p>
                            <span className="font-medium">Ngân hàng:</span> Vietcombank
                          </p>
                          <p>
                            <span className="font-medium">Số tài khoản:</span> 1234567890
                          </p>
                          <p>
                            <span className="font-medium">Chủ tài khoản:</span> CÔNG TY TNHH BE COOL
                          </p>
                          <p>
                            <span className="font-medium">Nội dung:</span> {tripDetails.id} {contactInfo.name}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Sau khi chuyển khoản, vui lòng nhấn "Xác nhận thanh toán" để hoàn tất đặt vé.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="momo" className="space-y-4 pt-4">
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="w-48 h-48 bg-pink-100 dark:bg-pink-900/20 rounded-md flex items-center justify-center mb-4">
                      <p className="text-pink-600 dark:text-pink-400 font-bold">QR Code MoMo</p>
                    </div>
                    <p className="text-center">Quét mã QR bằng ứng dụng MoMo để thanh toán</p>
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Số tiền: {formatPrice(calculateTotal())}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col">
              <CTAButton className="w-full" onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? (
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
                    <CreditCard className="mr-2 h-4 w-4" /> Xác nhận thanh toán
                  </span>
                )}
              </CTAButton>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Bằng cách nhấn "Xác nhận thanh toán", bạn đồng ý với các điều khoản và điều kiện của chúng tôi.
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Payment Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-green-600 dark:text-green-400">Đặt vé thành công!</DialogTitle>
              <DialogDescription className="text-center">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</DialogDescription>
            </DialogHeader>

            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>

              <p className="mb-4">Thông tin vé đã được gửi đến email của bạn.</p>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
                <p className="font-medium">
                  Mã đặt vé: <span className="text-blue-600 dark:text-blue-400">{bookingId}</span>
                </p>
                <p className="text-sm text-muted-foreground">Vui lòng lưu lại mã đặt vé để tra cứu thông tin.</p>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="sm:flex-1"
                onClick={() => {
                  setShowSuccessDialog(false)
                  router.push("/")
                }}
              >
                Về trang chủ
              </Button>

              <Button
                className="sm:flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                onClick={() => {
                  setShowSuccessDialog(false)
                  router.push("/tickets")
                }}
              >
                <Ticket className="mr-2 h-4 w-4" /> Xem vé của tôi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
