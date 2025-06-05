import apiClient from "@/lib/api-client"
import { Location } from "./location-service"
import { SearchParams } from "next/dist/server/request/search-params"

export interface Schedule {
  id: number
  routeId: number
  departureTime: string
  arrivalTime: string
  date: string
  price: number
  availableSeats: number
  totalSeats: number
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
  success: boolean;
  data: {
    arrivalTime: string;
    availableSeats: number;
    busType: string | null;
    date: string;
    departureTime: string;
    id: number;
    price: number;
    routeData: {
      fromLocation: { name: string; id: string };
      fromLocationId: number;
      id: number;
      toLocation: { name: string; id: string };
      toLocationId: number;
    };
    totalSeats: number;
    status_code: string | null;
  };
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
  search: async (params: { fromLocationId: string, toLocationId: string, date: string }) => {
    console.log("Gọi API /api/schedule/ với params:", params)
    const response = await fetch("http://localhost:5000/api/schedule/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error("Không tìm thấy chuyến xe phù hợp");
    const data = await response.json();
    console.log("Kết quả trả về từ API /api/schedule/:", data)
    return data as ScheduleResponse;
  },
  detail: async (id: string) => {
    const response = await fetch("http://localhost:5000/api/schedule/detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error("Không tìm thấy chi tiết chuyến đi");
    return response.json() as Promise<ScheduleDetailResponse>;
  },
  getSchedules: async (params?: SearchParams) => {
    const response = await apiClient.get<ScheduleResponse>("/schedules", { params })
    return response.data
  },
  searchSchedules: async (params: SearchParams) => {
    const response = await apiClient.get<ScheduleResponse>("/schedules/search", { params })
    return response.data
  },
  getScheduleSeats: async (id: string) => {
    const response = await apiClient.get<SeatsResponse>(`/schedules/${id}/seats`)
    return response.data
  },
}
export type { SearchParams }

