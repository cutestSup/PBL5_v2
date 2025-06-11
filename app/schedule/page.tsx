"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin, Bus, ArrowRight, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CTAButton } from "@/components/cta-button"

export default function SchedulePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [schedules, setSchedules] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCompany, setFilterCompany] = useState("")
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)

  // Mock schedule data
  const mockSchedules = [
    {
      id: "S1001",
      company: "Phương Trang",
      route: "Hồ Chí Minh - Đà Lạt",
      departureTime: "07:00",
      arrivalTime: "13:00",
      departureDate: "15/06/2024",
      departurePoint: "Bến xe miền Đông, TP. Hồ Chí Minh",
      arrivalPoint: "Bến xe Đà Lạt, TP. Đà Lạt",
      price: 280000,
      availableSeats: 12,
      frequency: "Hàng ngày",
      type: "Giường nằm",
    },
    {
      id: "S1002",
      company: "Thành Bưởi",
      route: "Hồ Chí Minh - Vũng Tàu",
      departureTime: "09:00",
      arrivalTime: "11:30",
      departureDate: "15/06/2024",
      departurePoint: "Bến xe miền Đông, TP. Hồ Chí Minh",
      arrivalPoint: "Bến xe Vũng Tàu, TP. Vũng Tàu",
      price: 160000,
      availableSeats: 8,
      frequency: "Hàng ngày",
      type: "Ghế ngồi",
    },
    {
      id: "S1003",
      company: "Kumho Samco",
      route: "Hồ Chí Minh - Nha Trang",
      departureTime: "20:00",
      arrivalTime: "05:00",
      departureDate: "15/06/2024",
      departurePoint: "Bến xe miền Đông, TP. Hồ Chí Minh",
      arrivalPoint: "Bến xe Nha Trang, TP. Nha Trang",
      price: 300000,
      availableSeats: 5,
      frequency: "Thứ 2, 4, 6, Chủ nhật",
      type: "Giường nằm",
    },
    {
      id: "S1004",
      company: "Mai Linh",
      route: "Hồ Chí Minh - Đà Nẵng",
      departureTime: "19:00",
      arrivalTime: "08:00",
      departureDate: "16/06/2024",
      departurePoint: "Bến xe miền Tây, TP. Hồ Chí Minh",
      arrivalPoint: "Bến xe Đà Nẵng, TP. Đà Nẵng",
      price: 500000,
      availableSeats: 15,
      frequency: "Thứ 3, 5, 7",
      type: "Limousine",
    },
    {
      id: "S1005",
      company: "Hoàng Long",
      route: "Hồ Chí Minh - Huế",
      departureTime: "18:00",
      arrivalTime: "08:00",
      departureDate: "16/06/2024",
      departurePoint: "Bến xe miền Đông, TP. Hồ Chí Minh",
      arrivalPoint: "Bến xe Huế, TP. Huế",
      price: 550000,
      availableSeats: 10,
      frequency: "Thứ 2, 5, Chủ nhật",
      type: "Limousine",
    },
  ]

  // Load schedules
  useEffect(() => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSchedules(mockSchedules)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter schedules
  const filteredSchedules = schedules.filter((schedule) => {
    // Search query filter
    const matchesSearch =
      schedule.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.company.toLowerCase().includes(searchQuery.toLowerCase())

    // Company filter
    const matchesCompany = filterCompany ? schedule.company === filterCompany : true

    return matchesSearch && matchesCompany
  })

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  // Get unique companies
  const companies = Array.from(new Set(schedules.map((schedule) => schedule.company)))

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">Lịch trình xe</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Filter className="mr-2 h-4 w-4" /> Bộ lọc
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search">Tìm kiếm</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Tìm kiếm tuyến đường, nhà xe..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company">Nhà xe</Label>
                <Select value={filterCompany} onValueChange={setFilterCompany}>
                  <SelectTrigger id="company" className="mt-1">
                    <SelectValue placeholder="Tất cả nhà xe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả nhà xe</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Ngày đi</Label>
                <DatePicker date={filterDate} setDate={setFilterDate} className="w-full mt-1" />
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("")
                    setFilterCompany("")
                    setFilterDate(undefined)
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule List */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="popular">Phổ biến</TabsTrigger>
              <TabsTrigger value="promotion">Khuyến mãi</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse dark:border-gray-700">
                      <CardContent className="p-6">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredSchedules.length > 0 ? (
                <div className="space-y-4">
                  {filteredSchedules.map((schedule) => (
                    <Card key={schedule.id} className="dark:border-gray-700 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{schedule.company}</h3>
                            <p className="text-muted-foreground">{schedule.route}</p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                            >
                              {schedule.type}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                            <div>
                              <p className="text-sm text-muted-foreground">Giờ chạy:</p>
                              <p className="font-medium">
                                {schedule.departureTime} - {schedule.arrivalTime}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                            <div>
                              <p className="text-sm text-muted-foreground">Lịch chạy:</p>
                              <p className="font-medium">{schedule.frequency}</p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                            <div>
                              <p className="text-sm text-muted-foreground">Điểm đón:</p>
                              <p className="font-medium truncate max-w-[200px]">{schedule.departurePoint}</p>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex flex-col sm:flex-row justify-between items-center">
                          <div className="mb-3 sm:mb-0">
                            <p className="text-sm text-muted-foreground">Giá vé từ:</p>
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">
                              {formatPrice(schedule.price)}
                            </p>
                          </div>

                          <CTAButton onClick={() => router.push(`/trips/${schedule.id}`)}>Xem chi tiết</CTAButton>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="dark:border-gray-700">
                  <CardContent className="p-6 text-center py-12">
                    <Bus className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Không tìm thấy lịch trình
                    </h3>
                    <p className="text-muted-foreground mb-4">Không có lịch trình nào phù hợp với bộ lọc của bạn.</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("")
                        setFilterCompany("")
                        setFilterDate(undefined)
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="popular">
              <Card className="dark:border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Tuyến phổ biến</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockSchedules.slice(0, 4).map((schedule) => (
                      <Card key={schedule.id} className="dark:border-gray-700 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{schedule.route}</h4>
                              <p className="text-sm text-muted-foreground">{schedule.company}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                            >
                              {schedule.type}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm mb-2">
                            <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                            <span>
                              {schedule.departureTime} - {schedule.arrivalTime}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="font-bold text-green-600 dark:text-green-400">
                              {formatPrice(schedule.price)}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => router.push(`/trips/${schedule.id}`)}
                            >
                              Chi tiết <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="promotion">
              <Card className="dark:border-gray-700">
                <CardContent className="p-6 text-center py-12">
                  <h3 className="text-lg font-medium mb-4">Chương trình khuyến mãi</h3>
                  <p className="text-muted-foreground mb-6">Hiện tại không có chương trình khuyến mãi nào.</p>
                  <p className="text-sm text-muted-foreground">
                    Vui lòng quay lại sau để cập nhật các chương trình khuyến mãi mới nhất.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
