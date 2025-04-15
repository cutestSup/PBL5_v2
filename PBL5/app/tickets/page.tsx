"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Bell, Bus, Calendar, Clock, Download, MapPin, TicketIcon, X } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function TicketsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [tickets, setTickets] = useState<any[]>([])
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  // Mock tickets data
  const mockTickets = [
    {
      id: "T123456",
      company: "Phương Trang",
      route: "Hồ Chí Minh - Đà Lạt",
      departureDate: "15/06/2024",
      departureTime: "07:00",
      arrivalTime: "13:00",
      departurePoint: "Bến xe miền Đông, TP. Hồ Chí Minh",
      arrivalPoint: "Bến xe Đà Lạt, TP. Đà Lạt",
      passengers: 2,
      price: 560000,
      status: "upcoming", // upcoming, completed, cancelled
      tripId: "1",
    },
    {
      id: "T789012",
      company: "Thành Bưởi",
      route: "Hồ Chí Minh - Vũng Tàu",
      departureDate: "20/06/2024",
      departureTime: "09:00",
      arrivalTime: "11:30",
      departurePoint: "Bến xe miền Đông, TP. Hồ Chí Minh",
      arrivalPoint: "Bến xe Vũng Tàu, TP. Vũng Tàu",
      passengers: 1,
      price: 150000,
      status: "upcoming",
      tripId: "2",
    },
    {
      id: "T345678",
      company: "Kumho Samco",
      route: "Hồ Chí Minh - Nha Trang",
      departureDate: "05/05/2024",
      departureTime: "20:00",
      arrivalTime: "05:00",
      departurePoint: "Bến xe miền Đông, TP. Hồ Chí Minh",
      arrivalPoint: "Bến xe Nha Trang, TP. Nha Trang",
      passengers: 2,
      price: 700000,
      status: "completed",
      tripId: "3",
    },
    {
      id: "T901234",
      company: "Mai Linh",
      route: "Hồ Chí Minh - Cần Thơ",
      departureDate: "01/05/2024",
      departureTime: "14:00",
      arrivalTime: "17:30",
      departurePoint: "Bến xe miền Tây, TP. Hồ Chí Minh",
      arrivalPoint: "Bến xe Cần Thơ, TP. Cần Thơ",
      passengers: 1,
      price: 180000,
      status: "cancelled",
      tripId: "4",
    },
  ]

  // Load tickets
  useEffect(() => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setTickets(mockTickets)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Handle cancel ticket
  const handleCancelTicket = async () => {
    if (!selectedTicket) return

    setIsCancelling(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update ticket status
      setTickets(
        tickets.map((ticket) => (ticket.id === selectedTicket.id ? { ...ticket, status: "cancelled" } : ticket)),
      )

      setShowCancelDialog(false)
      setSelectedTicket(null)
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsCancelling(false)
    }
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  // Filter tickets by status
  const upcomingTickets = tickets.filter((ticket) => ticket.status === "upcoming")
  const completedTickets = tickets.filter((ticket) => ticket.status === "completed")
  const cancelledTickets = tickets.filter((ticket) => ticket.status === "cancelled")

  // Render empty state
  const renderEmptyState = (message: string) => (
    <div className="text-center py-12">
      <TicketIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">Không có vé nào</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      <Button onClick={() => router.push("/")}>Tìm chuyến xe</Button>
    </div>
  )

  // Render ticket status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Sắp đi</span>
      case "completed":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Đã hoàn thành</span>
        )
      case "cancelled":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Đã hủy</span>
      default:
        return null
    }
  }

  // Render ticket card
  const renderTicketCard = (ticket: any) => (
    <Card key={ticket.id} className="mb-4 overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="bg-blue-50 dark:bg-blue-900/20 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <span className="font-bold text-lg">{ticket.company}</span>
              <div className="ml-2">{renderStatusBadge(ticket.status)}</div>
            </div>
            <p className="text-gray-600 text-sm">Mã vé: {ticket.id}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg">{formatPrice(ticket.price)}</p>
            <p className="text-sm text-gray-600">{ticket.passengers} hành khách</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">{ticket.departureDate}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center mb-2">
            <div className="flex items-start md:items-center mr-4">
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2 mt-0.5 md:mt-0" />
              <div className="flex md:items-center">
                <span className="font-medium text-gray-800 dark:text-gray-200">{ticket.departureTime}</span>
                <ArrowRight className="mx-2 h-3 w-3 text-gray-400 dark:text-gray-500" />
                <span className="font-medium text-gray-800 dark:text-gray-200">{ticket.arrivalTime}</span>
              </div>
            </div>

            <div className="flex items-center mt-2 md:mt-0">
              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">{ticket.route}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="mb-3 sm:mb-0">
            {ticket.status === "upcoming" && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 mr-2"
                onClick={() => {
                  setSelectedTicket(ticket)
                  setShowCancelDialog(true)
                }}
              >
                <X className="mr-2 h-4 w-4" /> Hủy vé
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => router.push(`/tickets/${ticket.id}`)}>
              Chi tiết
            </Button>
          </div>
          {ticket.status !== "cancelled" && (
            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700">
              <Download className="mr-2 h-4 w-4" /> Tải vé
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-6">Vé của tôi</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 h-48 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Vé của tôi</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex items-center" onClick={() => router.push("/")}>
            <Bus className="mr-2 h-4 w-4" /> Tìm chuyến xe
          </Button>
          <Button className="relative bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/notifications")}>
            <Bell className="mr-2 h-4 w-4" /> Thông báo
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="p-6">{renderEmptyState("Bạn chưa đặt vé nào.")}</CardContent>
        </Card>
      ) : (
        <>
          <Alert className="mb-6">
            <Bell className="h-4 w-4" />
            <AlertTitle>Chuyến xe sắp tới</AlertTitle>
            <AlertDescription>
              Bạn có {upcomingTickets.length} chuyến xe sắp tới. Đừng quên chuẩn bị trước chuyến đi của bạn!
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="upcoming">Sắp tới ({upcomingTickets.length})</TabsTrigger>
              <TabsTrigger value="completed">Đã hoàn thành ({completedTickets.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Đã hủy ({cancelledTickets.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingTickets.length > 0 ? (
                upcomingTickets.map((ticket) => renderTicketCard(ticket))
              ) : (
                <Card>
                  <CardContent className="p-6">{renderEmptyState("Bạn không có chuyến xe nào sắp tới.")}</CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedTickets.length > 0 ? (
                completedTickets.map((ticket) => renderTicketCard(ticket))
              ) : (
                <Card>
                  <CardContent className="p-6">
                    {renderEmptyState("Bạn chưa có chuyến xe nào đã hoàn thành.")}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="cancelled">
              {cancelledTickets.length > 0 ? (
                cancelledTickets.map((ticket) => renderTicketCard(ticket))
              ) : (
                <Card>
                  <CardContent className="p-6">{renderEmptyState("Bạn không có chuyến xe nào đã hủy.")}</CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Cancel Ticket Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy vé</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy vé này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="py-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="font-medium">Mã vé:</span>
                  <span>{selectedTicket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Chuyến xe:</span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedTicket.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tuyến đường:</span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedTicket.route}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ngày đi:</span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedTicket.departureDate}</span>
                </div>
              </div>

              <Alert variant="destructive">
                <AlertTitle>Lưu ý về chính sách hoàn tiền</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li>Hủy vé trước 24 giờ: hoàn tiền 70% giá vé</li>
                    <li>Hủy vé trong vòng 12-24 giờ: hoàn tiền 50% giá vé</li>
                    <li>Hủy vé trong vòng 12 giờ: không được hoàn tiền</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)} disabled={isCancelling}>
              Không, giữ vé
            </Button>
            <Button variant="destructive" onClick={handleCancelTicket} disabled={isCancelling}>
              {isCancelling ? (
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
                "Xác nhận hủy vé"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
