import apiClient from "@/lib/api-client"

export interface Trip {
  id: number
  from: string
  to: string
  departure_time: string
  arrival_time: string
  price: number
  company_id: number
  company_name: string
  bus_type: string
  available_seats: number
  total_seats: number
  image?: string
  rating?: number
  amenities?: string[]
}

export interface TripSearchParams {
  from?: string
  to?: string
  date?: string
  company_id?: number
  price_min?: number
  price_max?: number
  bus_type?: string
  page?: number
  limit?: number
}

export interface TripResponse {
  success: boolean
  mes: string
  data: {
    trips: Trip[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export const tripService = {
  searchTrips: async (params: TripSearchParams) => {
    const response = await apiClient.get<TripResponse>("/trips", { params })
    return response.data
  },

  getTripById: async (id: number | string) => {
    const response = await apiClient.get<{ success: boolean; mes: string; data: Trip }>(`/trips/${id}`)
    return response.data
  },

  getPopularTrips: async () => {
    const response = await apiClient.get<TripResponse>("/trips/popular")
    return response.data
  },
}
