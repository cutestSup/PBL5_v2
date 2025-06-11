"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Bus, Info } from "lucide-react"

interface SimplifiedSeatSelectorProps {
  busType: string
  availableSeats: number
  onSelectSeats: (seats: string[]) => void
  selectedSeats: string[]
  maxSeats?: number
  price: number
}

export function SimplifiedSeatSelector({
  busType,
  availableSeats,
  onSelectSeats,
  selectedSeats,
  price,
}: SimplifiedSeatSelectorProps) {
  // Generate seat layout based on bus type
  const [seatLayout, setSeatLayout] = useState<{
    lowerDeckSeats: string[]
    upperDeckSeats: string[]
    unavailableSeats: string[]
  }>({
    lowerDeckSeats: [],
    upperDeckSeats: [],
    unavailableSeats: [],
  })

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)
  }

  // Initialize seat layout
  useEffect(() => {
    const layout = {
      lowerDeckSeats: [] as string[],
      upperDeckSeats: [] as string[],
      unavailableSeats: [] as string[],
    }

    // Generate seats based on bus type
    if (busType === "Giường nằm") {
      // Lower deck seats (A01-A17)
      for (let i = 1; i <= 17; i++) {
        const seatNumber = `A${i.toString().padStart(2, "0")}`
        layout.lowerDeckSeats.push(seatNumber)
      }

      // Upper deck seats (B01-B17)
      for (let i = 1; i <= 17; i++) {
        const seatNumber = `B${i.toString().padStart(2, "0")}`
        layout.upperDeckSeats.push(seatNumber)
      }
    } else if (busType === "Limousine") {
      // Limousine typically has fewer seats
      for (let i = 1; i <= 12; i++) {
        const seatNumber = `A${i.toString().padStart(2, "0")}`
        layout.lowerDeckSeats.push(seatNumber)
      }

      for (let i = 1; i <= 10; i++) {
        const seatNumber = `B${i.toString().padStart(2, "0")}`
        layout.upperDeckSeats.push(seatNumber)
      }
    } else {
      // Regular bus with single level
      for (let i = 1; i <= 34; i++) {
        const seatNumber = `A${i.toString().padStart(2, "0")}`
        layout.lowerDeckSeats.push(seatNumber)
      }
    }

    // Generate random unavailable seats
    const allSeats = [...layout.lowerDeckSeats, ...layout.upperDeckSeats]
    const totalUnavailable = allSeats.length - availableSeats
    const unavailable = new Set<string>()

    while (unavailable.size < totalUnavailable) {
      const randomIndex = Math.floor(Math.random() * allSeats.length)
      unavailable.add(allSeats[randomIndex])
    }

    layout.unavailableSeats = Array.from(unavailable)
    setSeatLayout(layout)
  }, [busType, availableSeats])

  // Handle seat selection
  const toggleSeat = (seat: string) => {
    if (seatLayout.unavailableSeats.includes(seat)) return

    const newSelectedSeats = [...selectedSeats]
    const seatIndex = newSelectedSeats.indexOf(seat)

    if (seatIndex === -1) {

      newSelectedSeats.push(seat)
    } else {
      newSelectedSeats.splice(seatIndex, 1)
    }

    onSelectSeats(newSelectedSeats)
  }

  // Render a single seat
  const renderSeat = (seat: string) => {
    const isUnavailable = seatLayout.unavailableSeats.includes(seat)
    const isSelected = selectedSeats.includes(seat)

    return (
      <TooltipProvider key={seat} delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative mb-4">
              <button
                className={cn(
                  "w-12 h-12 rounded-md border-2 flex items-center justify-center relative",
                  isUnavailable
                    ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600"
                    : isSelected
                      ? "bg-red-100 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400"
                      : "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400",
                )}
                onClick={() => toggleSeat(seat)}
                disabled={isUnavailable}
              >
                {seat}
              </button>
              {/* Seat icon */}
              <div className="absolute -bottom-3 left-0 right-0 flex justify-center">
                <svg width="20" height="6" viewBox="0 0 20 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1 1H19V5H1V1Z"
                    stroke={isUnavailable ? "#D1D5DB" : isSelected ? "#EF4444" : "#60A5FA"}
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            <div className="space-y-1">
              <p className="font-semibold">{seat}</p>
              <p>{seat.startsWith("A") ? "Tầng dưới" : "Tầng trên"}</p>
              {isUnavailable && <p className="text-red-500">Đã bán</p>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Calculate total price
  const totalPrice = price * selectedSeats.length

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Bus className="mr-2 h-5 w-5" /> Chọn ghế
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-end gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
            <span className="text-sm">Đã bán</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded mr-2"></div>
            <span className="text-sm">Còn trống</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded mr-2"></div>
            <span className="text-sm">Đang chọn</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-8">
              {/* Lower Deck */}
              <div>
                <h3 className="text-center font-medium mb-4 bg-blue-100 dark:bg-blue-900/20 py-2 rounded-md">
                  Tầng dưới
                </h3>
                <div className="grid grid-cols-3 gap-2 justify-items-center">
                  {seatLayout.lowerDeckSeats.map((seat) => renderSeat(seat))}
                </div>
              </div>

              {/* Upper Deck */}
              <div>
                <h3 className="text-center font-medium mb-4 bg-blue-100 dark:bg-blue-900/20 py-2 rounded-md">
                  Tầng trên
                </h3>
                <div className="grid grid-cols-3 gap-2 justify-items-center">
                  {seatLayout.upperDeckSeats.map((seat) => renderSeat(seat))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Thông tin ghế đã chọn</h3>

              {selectedSeats.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((seat) => (
                      <span
                        key={seat}
                        className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded-md text-sm"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2"></div>

                  <div className="flex justify-between items-center">
                    <span>Số lượng ghế:</span>
                    <span className="font-medium">{selectedSeats.length}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Giá vé:</span>
                    <span>{formatPrice(price)}</span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2"></div>

                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold">Tổng tiền:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Info className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Vui lòng chọn ghế</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
