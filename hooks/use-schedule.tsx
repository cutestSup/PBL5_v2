import { useState } from "react"
import { scheduleService, type Schedule, type RouteData, type ScheduleSearchParams } from "@/services/schedule-service"

export function useSchedule() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [routeData, setRouteData] = useState<RouteData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchSchedules = async (params: ScheduleSearchParams) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await scheduleService.search(params)
      if (response.success) {
        setSchedules(response.data.scheduleData.rows)
        setRouteData(response.data.routeData)
        console.log(response.data.scheduleData.rows)
      } else {
        setError("Không tìm thấy lịch trình phù hợp")
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tìm kiếm lịch trình")
      console.error("Schedule search error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    schedules,
    routeData,
    isLoading,
    error,
    searchSchedules,
  }
} 