"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useScheduleSearch } from "@/hooks/use-schedules"
import { ScheduleDetailDialog } from "@/components/schedule-detail-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Bus, ArrowRight } from "lucide-react"
import { SearchFilters } from "@/components/search-filters"
import { useQuery } from "@tanstack/react-query"
import { Schedule, scheduleService } from "@/services/schedule-service"
import { useRouter } from "next/navigation"
import { useLocation } from "@/hooks/use-location"
import { formatPrice, getDuration } from "@/lib/format-utils"

// Interfaces
interface PriceRange {
  min: number
  max: number
}

interface SearchPageProps {
  initialData?: any
}

export default function SearchPage({ initialData }: SearchPageProps) {
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const date = searchParams.get("date") || ""

  // States for filters
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([0, 2000000])
  const [selectedBusTypes, setSelectedBusTypes] = useState<string[]>([])
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Get schedules data
  const { data, error } = useQuery({
    queryKey: ["schedule", from, to, date],
    queryFn: () => scheduleService.search({
      fromLocationId: from,
      toLocationId: to,
      date: date || "",
    }),
    enabled: !!from && !!to && !!date,
    initialData
  })

  const { locations } = useLocation()

  // Helper to get location name
  const getLocationName = (id: string) => {
    const location = locations.find(loc => String(loc.id) === id)
    return location ? location.name : ""
  }

  // Calculate price range from schedules
  const getPriceRange = (): PriceRange => {
    if (!data?.data?.scheduleData?.rows) return { min: 0, max: 2000000 }
    return data.data.scheduleData.rows.reduce(
      (acc: PriceRange, schedule: Schedule) => ({
        min: Math.min(acc.min, schedule.price),
        max: Math.max(acc.max, schedule.price)
      }),
      { min: Infinity, max: 0 }
    )
  }

  // Filter schedules
  const filterSchedules = (schedules: Schedule[]): Schedule[] => {
    if (!schedules) return []
    
    return schedules.filter(schedule => {
      // Filter by price
      const price = schedule.price
      if (price < currentPriceRange[0] || price > currentPriceRange[1]) return false

      // Filter by bus type
      if (selectedBusTypes.length > 0 && !selectedBusTypes.includes(schedule.busType || "")) return false

      // Filter by time
      const departureHour = parseInt(schedule.departureTime.split(":")[0])
      const isInSelectedTime = selectedTimes.length === 0 || selectedTimes.some(period => {
        switch (period) {
          case "morning": return departureHour >= 6 && departureHour < 12
          case "afternoon": return departureHour >= 12 && departureHour < 18
          case "evening": return departureHour >= 18 && departureHour < 24
          case "night": return departureHour >= 0 && departureHour < 6
          default: return false
        }
      })
      if (!isInSelectedTime) return false

      return true
    })
  }

  // Filter handlers
  const handlePriceChange = (range: [number, number]) => setCurrentPriceRange(range)
  const handleBusTypeChange = (types: string[]) => setSelectedBusTypes(types)
  const handleTimeChange = (times: string[]) => setSelectedTimes(times)
  const handleResetFilters = () => {
    const { min, max } = getPriceRange()
    setCurrentPriceRange([min, max])
    setSelectedBusTypes([])
    setSelectedTimes([])
  }

  // Get filtered schedules
  const schedules = data?.data?.scheduleData?.rows || []
  const filteredSchedules = filterSchedules(schedules)

  // Effect to initialize price range when data loads
  useEffect(() => {
    const { min, max } = getPriceRange()
    setCurrentPriceRange([min, max])
  }, [data])

  return (
    <div className="container mx-auto py-6">
      <div className="flex gap-6">
        {/* Filters sidebar */}
        <div className="w-64 flex-shrink-0">
          <SearchFilters
            minPrice={getPriceRange().min}
            maxPrice={getPriceRange().max}
            onPriceChange={handlePriceChange}
            onBusTypeChange={handleBusTypeChange}
            onTimeChange={handleTimeChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Search results */}
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-2">
              Kết quả tìm kiếm ({filteredSchedules.length})
            </h1>
            <p className="text-gray-600">
              {from && to ? `${getLocationName(from)} → ${getLocationName(to)}` : ""}
              {date ? ` • ${new Date(date).toLocaleDateString()}` : ""}
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-red-600 mb-4">
              Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
            </div>
          )}

          <div className="space-y-4">
            {filteredSchedules.map((schedule) => (
              <Card key={schedule.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold mb-2">{schedule.busType}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{schedule.departureTime}</span>
                        <ArrowRight className="w-4 h-4 mx-2" />
                        <span>{schedule.arrivalTime}</span>
                        <span className="mx-2">•</span>
                        <span>({getDuration(schedule.departureTime, schedule.arrivalTime)})</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{ "Bến xe"}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {formatPrice(schedule.price)}
                      </div>
                      <div className="flex gap-2 items-center mb-2">
                        <Badge variant="secondary">
                          <Bus className="w-4 h-4 mr-1" />
                          {schedule.availableSeats} ghế trống
                        </Badge>
                      </div>
                      <Button onClick={() => {
                        setSelectedSchedule(schedule)
                        setIsDetailOpen(true)
                      }}>
                        Chọn chỗ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredSchedules.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Không tìm thấy chuyến xe nào phù hợp với bộ lọc</p>
                {selectedBusTypes.length > 0 || selectedTimes.length > 0 && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleResetFilters}
                  >
                    Đặt lại bộ lọc
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedSchedule && (
        <ScheduleDetailDialog
          schedule={selectedSchedule}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false)
            setSelectedSchedule(null)
          }}
        />
      )}
    </div>
  )
}


