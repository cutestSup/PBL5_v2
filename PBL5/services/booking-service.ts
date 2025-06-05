import { api } from '@/lib/api'
import { Booking as ImportedBooking } from '@/types/booking'

export interface BookingRequest {
  name: string
  email: string
  phone: string
  scheduleId: string
  seats: string[]
}

export interface BookingResponse {
  success: boolean
  data: {
    id: string
    name: string
    email: string
    phone: string
    scheduleId: string
    seats: string[]
    status: string
    createdAt: string
  }
}

export interface BookingDetailResponse {
  success: boolean
  data: {
    booking: {
      id: number
      name: string
      email: string
      phone: string
      scheduleId: number
      reference: string
      booking_status: string
      totalAmount: number
      payment_method: string
      payment_url: string
      expires_at: string
      scheduleData: {
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
        routeData: {
          id: number
          fromLocationId: number
          toLocationId: number
          fromLocation: {
            name: string
          }
          toLocation: {
            name: string
          }
        }
      }
    }
    seats: {
      count: number
      rows: Array<{
        id: number
        bookingId: number
        seatId: number
      }>
    }
  }
}

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

export interface LocalBooking {
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
  async getBookings() {
    const response = await api.get<LocalBooking[]>('/booking')
    return response.data
  },

  async createBooking(data: BookingRequest) {
    const response = await fetch("http://localhost:5000/api/booking/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Đặt vé thất bại")
    }
    return response.json() as Promise<BookingResponse>
  },

  async cancelBooking(id: string) {
    const response = await api.delete<LocalBooking>(`/booking/${id}`)
    return response.data
  },

  getSeats: async (tripId: number | string) => {
    const response = await api.get<{ success: boolean; mes: string; data: Seat[] }>(`/trips/${tripId}/seats`)
    return response.data
  },

  getUserBookings: async () => {
    const response = await api.get<{
      success: boolean
      mes: string
      data: { bookings: LocalBooking[] }
    }>("/bookings/me")
    return response.data
  },

  getBookingById: async (id: number | string) => {
    const response = await fetch("http://localhost:5000/api/booking/detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: String(id) })
    })
    if (!response.ok) {
      throw new Error("Không thể tải thông tin đặt vé")
    }
    const data = await response.json() as BookingDetailResponse
    return data
  }
}
