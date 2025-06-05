"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useScheduleSearch } from "@/hooks/use-schedules"
import { ScheduleDetailDialog } from "@/components/schedule-detail-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Bus, ArrowRight, Filter, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useQuery, useMutation } from "@tanstack/react-query"
import { scheduleService, Schedule, ScheduleDetailResponse, ScheduleResponse } from "@/services/schedule-service"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { LocationCombobox } from "@/components/location-combobox"
import { DatePicker } from "@/components/date-picker"
import { useLocation } from "@/hooks/use-location"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const date = searchParams.get("date") || ""
  const returnDate = searchParams.get("returnDate") || ""
  const type = searchParams.get("type") || "one-way"

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000000])
  const [selectedBusTypes, setSelectedBusTypes] = useState<string[]>([])
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const router = useRouter()
  const { locations } = useLocation()
  // State for search form - Initialize with URL params
  const [fromLocationId, setFromLocationId] = useState(from)
  const [toLocationId, setToLocationId] = useState(to)
  const [departDate, setDepartDate] = useState<Date | undefined>(date ? new Date(date) : undefined)

  // Keep form in sync with URL params
  useEffect(() => {
    setFromLocationId(from)
    setToLocationId(to)
    if (date) {
      setDepartDate(new Date(date))
    }
  }, [from, to, date])

  // State for selected schedule
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [bookingMessage, setBookingMessage] = useState<string>("")

  // Query to fetch schedules
  const { data, error } = useQuery({
    queryKey: ["schedule", from, to, date],
    queryFn: () => scheduleService.search({
      fromLocationId: from,
      toLocationId: to,
      date: date || "",
    }),
    enabled: !!from && !!to && !!date
  })

  // Helper to get location name by id (for display only)
  const getLocationName = (id: string) => {
    const loc = locations.find(l => String(l.id) === String(id))
    return loc ? loc.name : ""
  }

  // Query for schedule detail
  const { data: detail, isLoading: loadingDetail } = useQuery<ScheduleDetailResponse>({
    queryKey: ['schedule-detail', selectedId],
    queryFn: () => scheduleService.detail(selectedId!),
    enabled: !!selectedId,
  })

  // Fetch seat data when a schedule is selected
  const { data: seatData, isLoading: loadingSeats } = useQuery({
    queryKey: ['seats', selectedId],
    queryFn: () =>
      fetch('http://localhost:5000/api/seat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleId: selectedId }),
      }).then(res => res.json()),
    enabled: !!selectedId,
  })

  // Log schedules data
  useEffect(() => {
    if (data) {
      console.log("Danh sách chuyến đi:", data)
    }
  }, [data])

  // Log detail data
  useEffect(() => {
    if (detail) {
      console.log("Chi tiết chuyến đi:", detail)
    }
  }, [detail])

  // Log seat data
  useEffect(() => {
    if (seatData) {
      console.log("Danh sách ghế:", seatData)
    }
  }, [seatData])

  // Log from, to, date for debugging
  useEffect(() => {
    console.log("from:", from, "to:", to, "date:", date)
  }, [from, to, date])

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/booking/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          scheduleId: selectedId,
          seats: selectedSeats,
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

  const formatTime = (time: string) => {
    return time.split(":")[0] + ":" + time.split(":")[1]
  }

  // Helper to calculate duration
  function getDuration(start: string, end: string) {
    const [h1, m1] = start.split(":").map(Number)
    const [h2, m2] = end.split(":").map(Number)
    let mins = (h2 * 60 + m2) - (h1 * 60 + m1)
    if (mins < 0) mins += 24 * 60
    return `${Math.floor(mins / 60)}h${mins % 60 ? ` ${mins % 60}m` : ''}`
  }

  // Helper to format date as YYYY-MM-DD
  function formatDate(date: Date) {
    // Lấy ngày/tháng/năm theo local time
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fromLocationId || !toLocationId || !departDate) return
    const dateParam = departDate ? formatDate(departDate) : ""
    console.log("Ngày đi (dateParam):", dateParam)
    router.push(`/search?from=${fromLocationId}&to=${toLocationId}&date=${dateParam}`)
  }

  useEffect(() => {
    if (departDate) {
      console.log("Ngày đi (departDate) thay đổi:", departDate)
    }
  }, [departDate])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search form */}
      <Card className="mb-8">
        <CardContent className="p-6">
          {data?.data?.scheduleData?.rows && (
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Đang hiển thị kết quả cho chuyến đi từ{" "}
              <span className="font-semibold">{getLocationName(from)}</span> đến{" "}
              <span className="font-semibold">{getLocationName(to)}</span> vào ngày{" "}
              <span className="font-semibold">
                {new Date(date).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </span>
            </div>
          )}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-500 text-xs mb-1">Nơi xuất phát</label>
              <LocationCombobox
                placeholder="Chọn điểm đi"
                value={fromLocationId}
                onChange={setFromLocationId}
                className="w-full"
              />
            </div>

            <div className="flex-1">
              <label className="block text-gray-500 text-xs mb-1">Nơi đến</label>
              <LocationCombobox
                placeholder="Chọn điểm đến"
                value={toLocationId}
                onChange={setToLocationId}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-xs mb-1">Ngày đi</label>
              <DatePicker
                date={departDate}
                setDate={setDepartDate}
                className="w-full min-w-[200px]"
              />
            </div>

            <div className="flex items-end">
              <Button 
                type="submit"
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Tìm chuyến xe
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Search results */}
      {data?.data?.scheduleData?.rows && data.data.scheduleData.rows.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Bộ lọc</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="lg:hidden" 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <Filter className="h-5 w-5 mr-2" />
                    {isFilterOpen ? "Đóng" : "Mở"}
                  </Button>
                </div>

                <div className={`space-y-6 ${isFilterOpen || "hidden lg:block"}`}>
                  {/* Price Range Filter */}
                  <div>
                    <Label className="mb-2 block">Khoảng giá</Label>
                    <div className="px-2">
                      <Slider
                        defaultValue={[0, 2000000]}
                        max={2000000}
                        step={50000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="my-6"
                      />
                      <div className="flex justify-between text-sm">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bus Type Filter */}
                  <div>
                    <Label className="mb-2 block">Loại xe</Label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox
                          id="limousine"
                          checked={selectedBusTypes.includes("Limousine")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBusTypes([...selectedBusTypes, "Limousine"])
                            } else {
                              setSelectedBusTypes(selectedBusTypes.filter(type => type !== "Limousine"))
                          }
                          }}
                        />
                        <Label htmlFor="limousine" className="ml-2 text-sm">
                          Limousine
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="sleeper"
                          checked={selectedBusTypes.includes("Sleeper")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBusTypes([...selectedBusTypes, "Sleeper"])
                            } else {
                              setSelectedBusTypes(selectedBusTypes.filter(type => type !== "Sleeper"))
                          }
                          }}
                        />
                        <Label htmlFor="sleeper" className="ml-2 text-sm">
                          Giường nằm
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="seater"
                          checked={selectedBusTypes.includes("Seater")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBusTypes([...selectedBusTypes, "Seater"])
                            } else {
                              setSelectedBusTypes(selectedBusTypes.filter(type => type !== "Seater"))
                          }
                          }}
                        />
                        <Label htmlFor="seater" className="ml-2 text-sm">
                          Ghế ngồi
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Departure Time Filter */}
                  <div>
                    <Label className="mb-2 block">Giờ khởi hành</Label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox
                          id="morning"
                          checked={selectedTimes.includes("5-12")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTimes([...selectedTimes, "5-12"])
                            } else {
                              setSelectedTimes(selectedTimes.filter(time => time !== "5-12"))
                            }
                          }}
                        />
                        <Label htmlFor="morning" className="ml-2 text-sm">
                          5h - 12h
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="afternoon"
                          checked={selectedTimes.includes("12-18")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTimes([...selectedTimes, "12-18"])
                            } else {
                              setSelectedTimes(selectedTimes.filter(time => time !== "12-18"))
                            }
                          }}
                        />
                        <Label htmlFor="afternoon" className="ml-2 text-sm">
                          12h - 18h
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="evening"
                          checked={selectedTimes.includes("18-24")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTimes([...selectedTimes, "18-24"])
                            } else {
                              setSelectedTimes(selectedTimes.filter(time => time !== "18-24"))
                            }
                          }}
                        />
                        <Label htmlFor="evening" className="ml-2 text-sm">
                          18h - 24h
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="night"
                          checked={selectedTimes.includes("0-5")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTimes([...selectedTimes, "0-5"])
                            } else {
                              setSelectedTimes(selectedTimes.filter(time => time !== "0-5"))
                            }
                          }}
                        />
                        <Label htmlFor="night" className="ml-2 text-sm">
                          0h - 5h
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setPriceRange([0, 2000000])
                      setSelectedBusTypes([])
                      setSelectedTimes([])
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results panel */}
          <div className="lg:col-span-3">
            {data.data.scheduleData.rows?.map((schedule: any) => (
              <div key={schedule.id} className="flex bg-white dark:bg-gray-800 rounded-lg shadow mb-4 overflow-hidden">
                <div className="bg-blue-50 dark:bg-gray-700 p-4 flex flex-col items-start w-48 min-w-[180px]">
                  <div className="font-bold text-lg mb-1 dark:text-white">Nhà xe</div>
                  <div className="text-gray-600 dark:text-gray-300 mb-2">{schedule.busType || "Chưa rõ loại xe"}</div>
                  <div className="flex items-center text-yellow-500 mb-1">
                    <span className="mr-1">⭐</span>
                    <span className="font-semibold">4.5</span>
                    <span className="ml-1 text-gray-500 text-sm">(100 đánh giá)</span>
                  </div>
                </div>
                <div className="flex-1 p-4 flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-xl dark:text-white">{schedule.departureTime.slice(0,5)}</span>
                      <span className="mx-2 dark:text-gray-400">→</span>
                      <span className="font-bold text-xl dark:text-white">{schedule.arrivalTime.slice(0,5)}</span>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">
                        ({getDuration(schedule.departureTime, schedule.arrivalTime)})
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                      <span>📍</span>
                      <span className="ml-1">
                        {getLocationName(String(data.data.routeData.fromLocation.id))} - {getLocationName(String(data.data.routeData.toLocation.id))}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span>🧑‍💺</span>
                      <span className="ml-1">{schedule.availableSeats} chỗ trống</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-green-600 font-bold text-2xl mb-2">
                      {schedule.price.toLocaleString()} đ
                    </div>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
                      onClick={() => {
                        setSelectedSchedule(schedule)
                        setIsDetailOpen(true)
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Detail Dialog */}
      <ScheduleDetailDialog
        schedule={selectedSchedule}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedSchedule(null)
        }}
      />
    </div>
  )
}


