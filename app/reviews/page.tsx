"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Clock, MessageSquare, Send, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function ReviewsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [reviews, setReviews] = useState<any[]>([])
  const [pendingReviews, setPendingReviews] = useState<any[]>([])
  const [currentRating, setCurrentRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [selectedTrip, setSelectedTrip] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock reviews data
  const mockReviews = [
    {
      id: "R123",
      company: "Phương Trang",
      route: "Hồ Chí Minh - Đà Lạt",
      tripDate: "01/05/2024",
      rating: 4,
      content: "Xe sạch sẽ, tài xế lái an toàn. Tuy nhiên, điều hòa hơi lạnh.",
      createdAt: "03/05/2024",
    },
    {
      id: "R456",
      company: "Thành Bưởi",
      route: "Hồ Chí Minh - Vũng Tàu",
      tripDate: "15/04/2024",
      rating: 5,
      content: "Dịch vụ rất tốt, nhân viên nhiệt tình, xe mới và sạch sẽ. Sẽ sử dụng dịch vụ lần sau.",
      createdAt: "16/04/2024",
    },
  ]

  // Mock pending reviews data
  const mockPendingReviews = [
    {
      id: "T7890",
      company: "Kumho Samco",
      route: "Hồ Chí Minh - Nha Trang",
      tripDate: "05/05/2024",
      tripId: "3",
    },
    {
      id: "T5432",
      company: "Mai Linh",
      route: "Hồ Chí Minh - Đà Lạt",
      tripDate: "25/04/2024",
      tripId: "4",
    },
  ]

  // Load reviews
  useEffect(() => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setReviews(mockReviews)
      setPendingReviews(mockPendingReviews)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Handle star rating click
  const handleStarClick = (rating: number) => {
    setCurrentRating(rating)
  }

  // Handle review text change
  const handleReviewTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value)
  }

  // Submit review
  const handleSubmitReview = async () => {
    if (!selectedTrip) return

    if (currentRating === 0) {
      alert("Vui lòng chọn số sao đánh giá")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Add the new review to reviews list
      const newReview = {
        id: `R${Math.floor(Math.random() * 1000)}`,
        company: selectedTrip.company,
        route: selectedTrip.route,
        tripDate: selectedTrip.tripDate,
        rating: currentRating,
        content: reviewText,
        createdAt: new Date().toLocaleDateString("vi-VN"),
      }

      setReviews([newReview, ...reviews])

      // Remove from pending reviews
      setPendingReviews(pendingReviews.filter((trip) => trip.id !== selectedTrip.id))

      // Reset form
      setSelectedTrip(null)
      setCurrentRating(0)
      setReviewText("")
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render empty state
  const renderEmptyState = (message: string) => (
    <div className="text-center py-12">
      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">Không có đánh giá nào</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  )

  // Render star rating
  const renderStarRating = (rating: number, size = 4, interactive = false) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`cursor-${interactive ? "pointer" : "default"}`}
            onMouseEnter={() => interactive && setHoverRating(i)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && handleStarClick(i)}
          >
            <Star
              className={`h-${size} w-${size} ${
                i <= (hoverRating || currentRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              } ${interactive ? "transition-colors duration-150" : ""}`}
            />
          </span>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-6">Đánh giá của tôi</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 h-40 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">Đánh giá của tôi</h1>

      <Tabs defaultValue="write">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="write">Viết đánh giá ({pendingReviews.length})</TabsTrigger>
          <TabsTrigger value="my-reviews">Đánh giá đã gửi ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="write">
          {pendingReviews.length > 0 ? (
            <>
              {selectedTrip ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Đánh giá chuyến đi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="bg-blue-50 p-4 rounded-md">
                        <h3 className="font-semibold text-lg">{selectedTrip.company}</h3>
                        <p className="text-gray-600">{selectedTrip.route}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Ngày đi: {selectedTrip.tripDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="font-medium mb-2">Đánh giá của bạn</p>
                        <div className="flex items-center">
                          {renderStarRating(0, 6, true)}
                          <span className="ml-2 text-gray-600">
                            {currentRating > 0 ? `${currentRating}/5` : "Chọn đánh giá"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="font-medium mb-2">Nhận xét của bạn</p>
                        <Textarea
                          placeholder="Chia sẻ trải nghiệm của bạn về chuyến đi này..."
                          className="min-h-[150px]"
                          value={reviewText}
                          onChange={handleReviewTextChange}
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedTrip(null)
                            setCurrentRating(0)
                            setReviewText("")
                          }}
                        >
                          Hủy
                        </Button>
                        <Button
                          onClick={handleSubmitReview}
                          disabled={isSubmitting}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Đang gửi...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Send className="mr-2 h-4 w-4" /> Gửi đánh giá
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <p className="text-lg">Chọn chuyến đi để đánh giá:</p>

                  {pendingReviews.map((trip) => (
                    <Card
                      key={trip.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedTrip(trip)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-lg">{trip.company}</h3>
                            <p className="text-gray-600">{trip.route}</p>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Ngày đi: {trip.tripDate}</span>
                            </div>
                          </div>
                          <Button size="sm">Đánh giá ngay</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-6">{renderEmptyState("Bạn không có chuyến đi nào cần đánh giá.")}</CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-reviews">
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{review.company}</h3>
                          <p className="text-gray-600">{review.route}</p>
                        </div>
                        <div className="flex items-center">{renderStarRating(review.rating)}</div>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Chuyến đi ngày: {review.tripDate}</span>
                        <Separator orientation="vertical" className="mx-2 h-3" />
                        <span>Đánh giá ngày: {review.createdAt}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 border-t pt-3">{review.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">{renderEmptyState("Bạn chưa viết đánh giá nào.")}</CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
