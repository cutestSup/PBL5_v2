import apiClient from "@/lib/api-client"

export interface Location {
  id: number
  name: string
  province: string
  address: string | null
}

export interface LocationResponse {
  success: boolean
  data: {
    count: number
    rows: Location[]
  }
}

export const locationService = {
  search: async (text: string) => {
    const body = {text}
    const response = await apiClient.get<LocationResponse>("/location", text)
    return response.data
  },
} 