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
  getAll: async () => {
    const response = await apiClient.get<LocationResponse>("/location")
    return response.data
  },

  search: async (text: string) => {
    const response = await apiClient.post<LocationResponse>("/location", { text })
    return response.data
  },

  create: async (location: Omit<Location, "id">) => {
    const response = await apiClient.post<{ success: boolean; data: Location }>("/location/create", location)
    return response.data
  },

  update: async (id: number, location: Partial<Location>) => {
    const response = await apiClient.put<{ success: boolean; data: Location }>(`/location/${id}`, location)
    return response.data
  },

  delete: async (id: number) => {
    const response = await apiClient.delete<{ success: boolean }>(`/location/${id}`)
    return response.data
  },
} 