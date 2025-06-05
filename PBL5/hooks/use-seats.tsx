import { useQuery, useMutation } from "@tanstack/react-query"
import { seatService } from "@/services/seat-service"

export function useSeatStatus(scheduleId: string | undefined) {
  return useQuery({
    queryKey: ["seat-status", scheduleId],
    queryFn: () => scheduleId ? seatService.getSeatStatus(scheduleId) : null,
    enabled: !!scheduleId,
  })
}
