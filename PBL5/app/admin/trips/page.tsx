"use client"

import { useState, useEffect } from "react"
import { Bus, Download, Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AdminTrips() {
  const [isLoading, setIsLoading] = useState(true)
  const [trips, setTrips] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Simulate API call
    const fetchTrips = async () => {
      setIsLoading(true)
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockTrips = [
        {
          id: "T1001",
          company: "Phương Trang",
          route: "Hồ Chí Minh - Đà Lạt",
          departureTime: "07:00",
          arrivalTime: "13:00",
          departureDate: "15/06/2024",
          price: 280000,
          availableSeats: 12,
          totalSeats: 45,
          status: "active",
        },
        {
          id: "T1002",
          company: "Thành Bưởi",
          route: "Hồ Chí Minh - Vũng Tàu",
          departureTime: "09:00",
          arrivalTime: "11:30",
          departureDate: "15/06/2024",
          price: 160000,
          availableSeats: 8,
          totalSeats: 45,
          status: "active",
        },
        {
          id: "T1003",
          company: "Kumho Samco",
          route: "Hồ Chí Minh - Nha Trang",
          departureTime: "20:00",
          arrivalTime: "05:00",
          departureDate: "15/06/2024",
          price: 300000,
          availableSeats: 5,
          totalSeats: 45,
          status: "active",
        },
        {
          id: "T1004",
          company: "Mai Linh",
          route: "Hồ Chí Minh - Đà Nẵng",
          departureTime: "19:00",
          arrivalTime: "08:00",
          departureDate: "16/06/2024",
          price: 500000,
          availableSeats: 15,
          totalSeats: 45,
          status: "active",
        },
        {
          id: "T1005",
          company: "Hoàng Long",
          route: "Hồ Chí Minh - Huế",
          departureTime: "18:00",
          arrivalTime: "08:00",
          departureDate: "16/06/2024",
          price: 550000,
          availableSeats: 0,
          totalSeats: 45,
          status: "cancelled",
        },
      ]

      setTrips(mockTrips)
      setIsLoading(false)
    }

    fetchTrips()
  }, [])

  // Filter trips based on search query
  const filteredTrips = trips.filter(
    (trip) =>
      trip.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý chuyến xe</h1>
        <p className="text-muted-foreground">Quản lý thông tin các chuyến xe trong hệ thống</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm chuyến xe..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          <Button
            size="sm"
            onClick={() => {
              // Open add trip dialog
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm chuyến xe
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Danh sách chuyến xe</CardTitle>
          <CardDescription>Tổng cộng {filteredTrips.length} chuyến xe trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-4 border-b last:border-0">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã chuyến</TableHead>
                    <TableHead>Nhà xe</TableHead>
                    <TableHead>Tuyến đường</TableHead>
                    <TableHead>Ngày đi</TableHead>
                    <TableHead>Giờ đi</TableHead>
                    <TableHead>Giá vé</TableHead>
                    <TableHead>Chỗ trống</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrips.length > 0 ? (
                    filteredTrips.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell className="font-medium">{trip.id}</TableCell>
                        <TableCell>{trip.company}</TableCell>
                        <TableCell>{trip.route}</TableCell>
                        <TableCell>{trip.departureDate}</TableCell>
                        <TableCell>{trip.departureTime}</TableCell>
                        <TableCell>{formatPrice(trip.price)}</TableCell>
                        <TableCell>
                          {trip.availableSeats}/{trip.totalSeats}
                        </TableCell>
                        <TableCell>
                          <Badge variant={trip.status === "active" ? "default" : "destructive"}>
                            {trip.status === "active" ? "Hoạt động" : "Đã hủy"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mở menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Bus className="mr-2 h-4 w-4" />
                                Quản lý ghế
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-6">
                        <div className="flex flex-col items-center justify-center">
                          <Search className="h-10 w-10 text-muted-foreground/50 mb-2" />
                          <p className="text-lg font-medium">Không tìm thấy chuyến xe</p>
                          <p className="text-sm text-muted-foreground">
                            Không có chuyến xe nào phù hợp với tìm kiếm của bạn
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
