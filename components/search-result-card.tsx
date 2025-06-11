import Link from "next/link"
import Image from "next/image"
import { Clock, MapPin, Star, Users, Wifi, Coffee, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Trip } from "@/services/trip-service"

interface SearchResultCardProps {
  trip: Trip
}

export default function SearchResultCard({ trip }: SearchResultCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  // Tính thời gian di chuyển
  const calculateTravelTime = (departure: string, arrival: string) => {
    const departureTime = new Date(departure).getTime()
    const arrivalTime = new Date(arrival).getTime()
    const diffInMinutes = Math.round((arrivalTime - departureTime) / (1000 * 60))

    const hours = Math.floor(diffInMinutes / 60)
    const minutes = diffInMinutes % 60

    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative h-48 md:h-full">
            <Image
              src={trip.image || "/placeholder.svg?height=200&width=300"}
              alt={`${trip.from} to ${trip.to}`}
              layout="fill"
              objectFit="cover"
              className="rounded-l-lg"
            />
            {trip.rating && (
              <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                <div className="flex items-center px-2 py-1">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{trip.rating}</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 md:p-6 md:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{trip.company_name}</h3>
                <p className="text-sm text-gray-500">{trip.bus_type}</p>
              </div>
              <div className="mt-2 md:mt-0">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {trip.available_seats} chỗ trống
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-start mb-2">
                  <div className="mt-1 mr-3">
                    <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  </div>
                  <div>
                    <p className="font-semibold">{formatTime(trip.departure_time)}</p>
                    <p className="text-sm text-gray-600">{formatDate(trip.departure_time)}</p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" /> {trip.from}
                    </p>
                  </div>
                </div>

                <div className="flex items-start ml-[22px]">
                  <div className="border-l-2 border-dashed border-gray-300 h-8 ml-[6px]"></div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 mr-3">
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  </div>
                  <div>
                    <p className="font-semibold">{formatTime(trip.arrival_time)}</p>
                    <p className="text-sm text-gray-600">{formatDate(trip.arrival_time)}</p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" /> {trip.to}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-sm text-gray-500 flex items-center mb-2">
                    <Clock className="h-4 w-4 mr-1" /> Thời gian:{" "}
                    {calculateTravelTime(trip.departure_time, trip.arrival_time)}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center mb-2">
                    <Users className="h-4 w-4 mr-1" /> Sức chứa: {trip.total_seats} chỗ
                  </p>
                  <div className="flex items-center space-x-2 mb-2">
                    {trip.amenities?.includes("wifi") && (
                      <Badge variant="outline" className="bg-gray-50">
                        <Wifi className="h-3 w-3 mr-1" /> WiFi
                      </Badge>
                    )}
                    {trip.amenities?.includes("coffee") && (
                      <Badge variant="outline" className="bg-gray-50">
                        <Coffee className="h-3 w-3 mr-1" /> Đồ uống
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col items-end">
                  <p className="text-2xl font-bold text-blue-600">{formatPrice(trip.price)}</p>
                  <Link href={`/trips/${trip.id}`}>
                    <Button className="mt-2 w-full md:w-auto">
                      Chọn chuyến <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
