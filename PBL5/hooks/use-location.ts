import { useState } from "react"
import { locationService, type Location } from "@/services/location-service"

export function useLocation() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchLocations = async (text: string) => {
    if (!text) {
      setLocations([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await locationService.search(text)
      if (response.success) {
        setLocations(response.data.rows)
      } else {
        setError("Không tìm thấy kết quả")
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tìm kiếm")
      console.error("Location search error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    locations,
    isLoading,
    error,
    searchLocations,
  }
} 