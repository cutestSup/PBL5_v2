import { useQuery, useMutation } from "@tanstack/react-query"
import { bookingService } from "@/services/booking-service"
import { paymentService } from "@/services/payment-service"

// Get booking detail
export function useBookingDetail(bookingId: string | undefined) {
  return useQuery({
    queryKey: ["booking-detail", bookingId],
    queryFn: () => bookingId ? bookingService.getBookingById(bookingId) : null,
    enabled: !!bookingId,
  })
}

// Create new booking
export function useCreateBooking() {
  return useMutation({
    mutationFn: bookingService.createBooking,
  })
}

// Process payment
export function useProcessPayment() {
  return useMutation({
    mutationFn: paymentService.processPayment,
  })
}

// Get user bookings history
export function useUserBookings(token: string | undefined) {
  return useQuery({
    queryKey: ["user-bookings"],
    queryFn: () => token ? bookingService.getUserBookings() : null,
    enabled: !!token,
  })
}
