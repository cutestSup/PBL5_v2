import { api } from '@/lib/axios'
import { Booking } from '@/types/booking'

export const bookingService = {
  async getAll() {
    const response = await api.get<Booking[]>('/booking')
    return response.data
  },

  async getById(id: string) {
    const response = await api.get<Booking>(`/booking/${id}`)
    return response.data
  },

  async create(data: {
    scheduleId: string
    seatNumbers: number[]
    totalPrice: number
  }) {
    const response = await api.post<Booking>('/booking', data)
    return response.data
  },

  async cancel(id: string) {
    const response = await api.post<Booking>(`/booking/${id}/cancel`)
    return response.data
  },

  async getByUser() {
    const response = await api.get<Booking[]>('/booking/user')
    return response.data
  }
} 