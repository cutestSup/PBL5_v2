import apiClient from "@/lib/api-client"
import { Location } from "./location-service"

export interface Schedule {
  id: number
  routeId: string
  departureTime: string
  arrivalTime: string
  date: string
  price: number
  availableSeats: number | null
  totalSeats: number | null
  busType: string | null
  status_code: string | null
}

export interface RouteData {
  id: number
  fromLocation: Location
  toLocation: Location
}

export interface ScheduleResponse {
  success: boolean
  data: {
    scheduleData: {
      count: number
      rows: Schedule[]
    }
    routeData: RouteData
  }
}

export interface ScheduleSearchParams {
  fromLocationId: string
  toLocationId: string
  date: string
}

export interface ScheduleDetailResponse {
  success: boolean
  data: Schedule
}

export interface SeatInfo {
  id: string
  number: string
  status: "available" | "booked" | "reserved"
  type: string
  position: string
  floor?: string
}

export interface SeatsResponse {
  success: boolean
  data: SeatInfo[]
}

export const scheduleService = {
  search: async (params: ScheduleSearchParams) => {
    const response = await apiClient.post<ScheduleResponse>("/schedule", params)
    return response.data
  },

  getSchedules: async (params?: SearchParams) => {
    const response = await apiClient.get<ScheduleResponse>("/schedules", { params })
    return response.data
  },

  searchSchedules: async (params: SearchParams) => {
    const response = await apiClient.get<ScheduleResponse>("/schedules/search", { params })
    return response.data
  },

  getScheduleById: async (id: string) => {
    const response = await apiClient.get<ScheduleDetailResponse>(`/schedules/${id}`)
    return response.data
  },

  getScheduleSeats: async (id: string) => {
    const response = await apiClient.get<SeatsResponse>(`/schedules/${id}/seats`)
    return response.data
  },
}
