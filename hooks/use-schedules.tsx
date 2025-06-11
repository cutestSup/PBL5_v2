"use client"

import { useQuery } from "@tanstack/react-query"
import { scheduleService, type SearchParams } from "@/services/schedule-service"

export function useSchedules(params?: SearchParams) {
  return useQuery({
    queryKey: ["schedules", params],
    queryFn: () => scheduleService.getSchedules(params).then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useScheduleSearch(params: SearchParams) {
  return useQuery({
    queryKey: ["scheduleSearch", params],
    queryFn: () => scheduleService.searchSchedules(params).then((res) => res.data),
    enabled: !!params.from && !!params.to, // Only run if from and to are provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useScheduleDetails(id: string) {
  return useQuery({
    queryKey: ["schedule", id],
    queryFn: () => scheduleService.getScheduleById(id).then((res) => res.data),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useScheduleSeats(id: string) {
  return useQuery({
    queryKey: ["scheduleSeats", id],
    queryFn: () => scheduleService.getScheduleSeats(id).then((res) => res.data),
    enabled: !!id,
    staleTime: 1000 * 60, // 1 minute (seats change more frequently)
  })
}
