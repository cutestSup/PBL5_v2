"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { reviewService, type ReviewData } from "@/services/review-service"
import { toast } from "@/components/ui/use-toast"

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => reviewService.getReviews().then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useReviewDetails(id: string) {
  return useQuery({
    queryKey: ["review", id],
    queryFn: () => reviewService.getReviewById(id).then((res) => res.data),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reviewData: ReviewData) => reviewService.createReview(reviewData),
    onSuccess: () => {
      // Invalidate reviews query to refetch
      queryClient.invalidateQueries({ queryKey: ["reviews"] })

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "Could not submit your review",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ReviewData> }) => reviewService.updateReview(id, data),
    onSuccess: (data) => {
      // Invalidate reviews query to refetch
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
      queryClient.invalidateQueries({ queryKey: ["review", data.data.id] })

      toast({
        title: "Review Updated",
        description: "Your review has been updated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Could not update your review",
        variant: "destructive",
      })
    },
  })
}

export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => reviewService.deleteReview(id),
    onSuccess: () => {
      // Invalidate reviews query to refetch
      queryClient.invalidateQueries({ queryKey: ["reviews"] })

      toast({
        title: "Review Deleted",
        description: "Your review has been deleted successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Deletion Failed",
        description: error.response?.data?.message || "Could not delete your review",
        variant: "destructive",
      })
    },
  })
}
