"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { bookingService, type BookingData } from "@/services/booking-service"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: () => bookingService.getBookings().then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useBookingDetails(id: string) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingService.getBookingById(id).then((res) => res.data),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (bookingData: BookingData) => bookingService.createBooking(bookingData),
    onSuccess: (data) => {
      // Invalidate bookings query to refetch
      queryClient.invalidateQueries({ queryKey: ["bookings"] })

      toast({
        title: "Booking Successful",
        description: "Your booking has been confirmed. You can view it in your tickets.",
      })

      // Redirect to booking details or payment page
      router.push(`/payment?tripId=${data.data.schedule.id}&bookingId=${data.data.id}`)
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.response?.data?.message || "Could not complete your booking",
        variant: "destructive",
      })
    },
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => bookingService.cancelBooking(id),
    onSuccess: (data) => {
      // Invalidate bookings query to refetch
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["booking", data.data.id] })

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation Failed",
        description: error.response?.data?.message || "Could not cancel your booking",
        variant: "destructive",
      })
    },
  })
}

export function useDownloadTicket() {
  return useMutation({
    mutationFn: (id: string) => bookingService.downloadTicket(id),
    onSuccess: () => {
      toast({
        title: "Download Started",
        description: "Your ticket is being downloaded.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Download Failed",
        description: error.response?.data?.message || "Could not download your ticket",
        variant: "destructive",
      })
    },
  })
}
