"use client"

import { useState, useEffect } from "react"
import { BarChart3, Bus, Calendar, CreditCard, DollarSign, TrendingUp, Users, Ticket } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Booking {
  id: string
  user: string
  route: string
  date: string
  amount: number
}

interface PopularRoute {
  route: string
  bookings: number
  revenue: number
}

interface DashboardStats {
  totalUsers: number
  totalTrips: number
  totalBookings: number
  totalRevenue: number
  recentBookings: Booking[]
  popularRoutes: PopularRoute[]
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTrips: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    popularRoutes: [],
  })

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true)
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStats({
        totalUsers: 1245,
        totalTrips: 87,
        totalBookings: 3567,
        totalRevenue: 1250000000,
        recentBookings: [
          { id: "BK123456", user: "Nguyễn Văn A", route: "Hồ Chí Minh - Đà Lạt", date: "15/06/2024", amount: 560000 },
          { id: "BK123457", user: "Trần Thị B", route: "Hồ Chí Minh - Vũng Tàu", date: "14/06/2024", amount: 150000 },
          { id: "BK123458", user: "Lê Văn C", route: "Hồ Chí Minh - Nha Trang", date: "13/06/2024", amount: 700000 },
          { id: "BK123459", user: "Phạm Thị D", route: "Hồ Chí Minh - Đà Nẵng", date: "12/06/2024", amount: 900000 },
        ],
        popularRoutes: [
          { route: "Hồ Chí Minh - Đà Lạt", bookings: 456, revenue: 127680000 },
          { route: "Hồ Chí Minh - Vũng Tàu", bookings: 389, revenue: 62240000 },
          { route: "Hồ Chí Minh - Nha Trang", bookings: 312, revenue: 93600000 },
          { route: "Hồ Chí Minh - Đà Nẵng", bookings: 287, revenue: 143500000 },
        ],
      })

      setIsLoading(false)
    }

    fetchData()
  }, [])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan về hoạt động của hệ thống</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng chuyến xe</CardTitle>
                <Bus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTrips.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+5% so với tháng trước</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng đặt vé</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+18% so với tháng trước</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">+15% so với tháng trước</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="analytics">Phân tích</TabsTrigger>
              <TabsTrigger value="reports">Báo cáo</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Đặt vé gần đây</CardTitle>
                    <CardDescription>{stats.recentBookings.length} đặt vé mới nhất trong hệ thống</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {stats.recentBookings.map((booking: any) => (
                        <div key={booking.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                          <div>
                            <p className="font-medium">{booking.user}</p>
                            <p className="text-sm text-muted-foreground">{booking.route}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(booking.amount)}</p>
                            <p className="text-xs text-muted-foreground">{booking.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Tuyến phổ biến</CardTitle>
                    <CardDescription>Các tuyến đường được đặt nhiều nhất</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.popularRoutes.map((route: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{route.route}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Ticket className="mr-1 h-3 w-3" />
                              <span>{route.bookings} vé</span>
                            </div>
                          </div>
                          <div className="font-medium">{formatCurrency(route.revenue)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Doanh thu theo tháng</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[200px] flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Đặt vé theo ngày</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[200px] flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-muted-foreground/50" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Xu hướng doanh thu</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[200px] flex items-center justify-center">
                    <TrendingUp className="h-16 w-16 text-muted-foreground/50" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <p className="mt-2 text-lg font-medium">Phân tích chi tiết</p>
                <p className="text-sm text-muted-foreground">Tính năng đang được phát triển</p>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <CreditCard className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <p className="mt-2 text-lg font-medium">Báo cáo tài chính</p>
                <p className="text-sm text-muted-foreground">Tính năng đang được phát triển</p>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
