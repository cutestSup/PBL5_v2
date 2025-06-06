import { useState } from 'react'
import { bookingService } from '@/services/booking-service'
import { Booking } from '@/types/booking'

export function useBooking() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await bookingService.getBookings()
      setBookings(data)
    } catch (err) {
      setError('Failed to fetch bookings')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const createBooking = async (scheduleId: string, seatNumbers: number[]) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await bookingService.createBooking({
        scheduleId,
        seatNumbers
      })
      const newBooking = response as unknown as Booking
      setBookings(prev => [...prev, newBooking])
      return newBooking
    } catch (err) {
      setError('Failed to create booking')
      console.error(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const cancelBooking = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      await bookingService.cancelBooking(id)
      setBookings(prev => prev.filter(booking => booking.id !== id))
    } catch (err) {
      setError('Failed to cancel booking')
      console.error(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    bookings,
    isLoading,
    error,
    fetchBookings,
    createBooking,
    cancelBooking
  }
} 