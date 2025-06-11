"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Trip {
  id: string
  company: string
  route: string
  image: string
  price: number
  rating: number
  reviewCount: number
  popular: boolean
}

export function TripSuggestions() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [trips, setTrips] = useState<Trip[]>([])

  // Mock data for popular trips
  const mockTrips = [
    {
      id: "1",
      company: "Phương Trang",
      route: "Hồ Chí Minh - Đà Lạt",
      image: "/placeholder.svg?height=200&width=300&text=Đà+Lạt",
      price: 280000,
      rating: 4.5,
      reviewCount: 120,
      popular: true,
    },
    {
      id: "2",
      company: "Thành Bưởi",
      route: "Hồ Chí Minh - Vũng Tàu",
      image: "/placeholder.svg?height=200&width=300&text=Vũng+Tàu",
      price: 160000,
      rating: 4.2,
      reviewCount: 85,
      popular: true,
    },
    {
      id: "3",
      company: "Kumho Samco",
      route: "Hồ Chí Minh - Nha Trang",
      image: "/placeholder.svg?height=200&width=300&text=Nha+Trang",
      price: 300000,
      rating: 4.3,
      reviewCount: 93,
      popular: true,
    },
    {
      id: "4",
      company: "Mai Linh",
      route: "Hồ Chí Minh - Đà Nẵng",
      image: "/placeholder.svg?height=200&width=300&text=Đà+Nẵng",
      price: 500000,
      rating: 4.4,
      reviewCount: 78,
      popular: false,
    },
    {
      id: "5",
      company: "Hoàng Long",
      route: "Hồ Chí Minh - Huế",
      image: "/placeholder.svg?height=200&width=300&text=Huế",
      price: 550000,
      rating: 4.6,
      reviewCount: 65,
      popular: false,
    },
    {
      id: "6",
      company: "Phúc Thuận Thảo",
      route: "Hồ Chí Minh - Cần Thơ",
      image: "/placeholder.svg?height=200&width=300&text=Cần+Thơ",
      price: 180000,
      rating: 4.1,
      reviewCount: 102,
      popular: true,
    },
  ]

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true)
    setTimeout(() => {
      setTrips(mockTrips)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  // Scroll the carousel
  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { current } = containerRef
      const scrollAmount =
        direction === "left"
          ? current.scrollLeft - current.offsetWidth * 0.8
          : current.scrollLeft + current.offsetWidth * 0.8

      current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gợi ý cho bạn</h2>
          <div className="space-x-2 hidden md:block">
            <Button variant="outline" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-40 rounded-t-lg"></div>
              <div className="bg-gray-100 h-28 rounded-b-lg p-4">
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2 mb-4"></div>
                <div className="bg-gray-200 h-6 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gợi ý cho bạn</h2>
        <div className="space-x-2 hidden md:block">
          <Button variant="outline" size="icon" onClick={() => scroll("left")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 snap-x scroll-px-4 no-scrollbar"
      >
        {trips.map((trip) => (
          <Card
            key={trip.id}
            className="min-w-[280px] sm:min-w-[320px] transition-transform duration-300 hover:shadow-lg hover:scale-[1.02] snap-start cursor-pointer"
            onClick={() => router.push(`/trips/${trip.id}`)}
          >
            <div
              className="h-40 bg-cover bg-center rounded-t-lg relative"
              style={{ backgroundImage: `url(${trip.image})` }}
            >
              {trip.popular && (
                <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Phổ biến
                </span>
              )}
            </div>
            <CardContent className="p-4">
              <div className="mb-2">
                <h3 className="font-bold">{trip.route}</h3>
                <p className="text-gray-600 text-sm">{trip.company}</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="text-sm font-medium mr-1">{trip.rating}</span>
                  <span className="text-xs text-gray-500">({trip.reviewCount})</span>
                </div>
                <p className="font-bold text-green-600">{formatPrice(trip.price)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
