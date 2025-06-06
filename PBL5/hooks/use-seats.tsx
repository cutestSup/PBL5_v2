import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { seatService, type Seat } from "@/services/seat-service"
import { toast } from "@/components/ui/use-toast"

export function useSeatStatus(scheduleId: string | undefined) {
  return useQuery({
    queryKey: ["seat-status", scheduleId],
    queryFn: () => scheduleId ? seatService.getSeatStatus(scheduleId) : null,
    enabled: !!scheduleId,
    refetchInterval: 15000, // Refetch every 15 seconds
    select: (data) => {
      if (!data) return null;
      return {
        ...data,
        data: {
          ...data.data,
          seats: data.data.seats.map(seat => ({
            ...seat,
            available: seat.status === 'available'
          }))
        }
      };
    }
  })
}

export function useReserveSeats(scheduleId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (seats: string[]) => {
      if (!scheduleId) throw new Error("Schedule ID is required")
      return seatService.reserveSeats(scheduleId, seats)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seat-status", scheduleId] })
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Reserve Seats",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useReleaseSeats(scheduleId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (seats: string[]) => {
      if (!scheduleId) throw new Error("Schedule ID is required")
      return seatService.releaseSeats(scheduleId, seats)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seat-status", scheduleId] })
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Release Seats",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
