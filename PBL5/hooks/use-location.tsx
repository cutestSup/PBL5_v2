import { useState, useEffect } from "react"
import { locationService, type Location } from "@/services/location-service"

export function useLocation() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchText, setSearchText] = useState("")

  const searchLocations = async (text: string) => {
    setSearchText(text)
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await locationService.search(searchText)
        if (response.success) {
          setLocations(response.data.rows)
        } else {
          setError("Không tìm thấy kết quả")
        }
      } catch (err) {
        console.error("Location search error:", err)
        setError("Đã xảy ra lỗi khi tìm kiếm")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchText])

  return {
    locations,
    isLoading,
    error,
    searchLocations,
  }
} 