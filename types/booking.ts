import { Schedule } from './schedule'

export interface Booking {
  id: string
  userId: string
  scheduleId: string
  seatNumbers: number[]
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed'
  createdAt: string
  updatedAt: string
  schedule: {
    id: string
    departureTime: string
    arrivalTime: string
    price: number
    bus: {
      id: string
      plateNumber: string
      type: string
    }
    route: {
      id: string
      departureLocation: {
        id: string
        name: string
        province: string
      }
      arrivalLocation: {
        id: string
        name: string
        province: string
      }
    }
  }
} 