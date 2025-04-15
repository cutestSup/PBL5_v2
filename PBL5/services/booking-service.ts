import apiClient from "@/lib/api-client"

export interface Seat {
  id: number
  seat_number: string
  status: "available" | "booked" | "reserved" | "unavailable"
  price: number
}

export interface BookingData {
  trip_id: number
  seat_ids: number[]
  passenger_name: string
  passenger_phone: string
  passenger_email: string
  payment_method: string
}

export interface Booking {
  id: number
  booking_code: string
  trip_id: number
  user_id: number
  status: string
  total_price: number
  payment_status: string
  payment_method: string
  created_at: string
  seats: Seat[]
  trip: {
    from: string
    to: string
    departure_time: string
    arrival_time: string
    company_name: string
  }
}

export const bookingService = {
  getSeats: async (tripId: number | string) => {
    const response = await apiClient.get<{ success: boolean; mes: string; data: Seat[] }>(`/trips/${tripId}/seats`)
    return response.data
  },

  createBooking: async (bookingData: BookingData) => {
    const response = await apiClient.post<{ success: boolean; mes: string; data: Booking }>("/bookings", bookingData)
    return response.data
  },

  getUserBookings: async () => {
    const response = await apiClient.get<{
      success: boolean
      mes: string
      data: { bookings: Booking[] }
    }>("/bookings/me")
    return response.data
  },

  getBookingById: async (id: number | string) => {
    const response = await apiClient.get<{ success: boolean; mes: string; data: Booking }>(`/bookings/${id}`)
    return response.data
  },

  cancelBooking: async (id: number | string) => {
    const response = await apiClient.put<{ success: boolean; mes: string }>(`/bookings/${id}/cancel`)
    return response.data
  },
}
