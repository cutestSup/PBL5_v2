import apiClient from "@/lib/api-client"

export interface ReviewData {
  companyId: string
  tripId?: string
  rating: number
  content: string
}

export interface Review {
  id: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  company: {
    id: string
    name: string
  }
  trip?: {
    id: string
    route: string
    departureDate: string
  }
  rating: number
  content: string
  createdAt: string
}

export interface ReviewResponse {
  success: boolean
  data: Review[]
}

export interface ReviewDetailResponse {
  success: boolean
  data: Review
}

export const reviewService = {
  getReviews: async () => {
    const response = await apiClient.get<ReviewResponse>("/reviews")
    return response.data
  },

  getReviewById: async (id: string) => {
    const response = await apiClient.get<ReviewDetailResponse>(`/reviews/${id}`)
    return response.data
  },

  createReview: async (reviewData: ReviewData) => {
    const response = await apiClient.post<ReviewDetailResponse>("/reviews", reviewData)
    return response.data
  },

  updateReview: async (id: string, reviewData: Partial<ReviewData>) => {
    const response = await apiClient.put<ReviewDetailResponse>(`/reviews/${id}`, reviewData)
    return response.data
  },

  deleteReview: async (id: string) => {
    const response = await apiClient.delete(`/reviews/${id}`)
    return response.data
  },
}
