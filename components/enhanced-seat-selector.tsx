"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Check, Info } from "lucide-react"
import { Bus } from "lucide-react"

interface EnhancedSeatSelectorProps {
  busType: string
  availableSeats: number
  onSelectSeats: (seats: string[]) => void
  selectedSeats: string[]
  maxSeats?: number
}

export function EnhancedSeatSelector({
  busType,
  availableSeats,
  onSelectSeats,
  selectedSeats,
  maxSeats = 5,
}: EnhancedSeatSelectorProps) {
  // Generate seat layout based on bus type
  const [seatLayout, setSeatLayout] = useState<{
    rows: number
    cols: number
    totalSeats: number
    unavailableSeats: string[]
    seatMap: { [key: string]: { type: string; position: string } }
  }>({
    rows: 0,
    cols: 0,
    totalSeats: 0,
    unavailableSeats: [],
    seatMap: {},
  })

  // Initialize seat layout based on bus type
  useEffect(() => {
    const layout = {
      rows: 0,
      cols: 0,
      totalSeats: 0,
      unavailableSeats: [] as string[],
      seatMap: {} as { [key: string]: { type: string; position: string } },
    }

    switch (busType) {
      case "Giường nằm":
        layout.rows = 10
        layout.cols = 3
        layout.totalSeats = 30

        // Define seat types for sleeper bus
        for (let row = 1; row <= layout.rows; row++) {
          for (let col = 0; col < layout.cols; col++) {
            const colLetter = String.fromCharCode(65 + col)
            const seat = `${row}${colLetter}`

            // Determine seat position (upper/lower)
            const position = row <= 5 ? "Tầng dưới" : "Tầng trên"

            // Determine seat type
            let type = "Giường đơn"
            if (col === 2) {
              type = "Giường đôi"
            }

            layout.seatMap[seat] = { type, position }
          }
        }
        break

      case "Limousine":
        layout.rows = 8
        layout.cols = 3
        layout.totalSeats = 22 // Some seats are removed for luxury space

        // Define seat types for limousine
        for (let row = 1; row <= layout.rows; row++) {
          for (let col = 0; col < layout.cols; col++) {
            // Skip some seats for Limousine to create luxury space
            if ((row > 6 && col === 2) || (row === 8 && col === 1)) {
              continue
            }

            const colLetter = String.fromCharCode(65 + col)
            const seat = `${row}${colLetter}`

            // Determine seat position
            const position = row <= 4 ? "Phía trước" : "Phía sau"

            // Determine seat type
            let type = "Ghế thường"
            if (col === 1) {
              type = "Ghế VIP"
            }

            layout.seatMap[seat] = { type, position }
          }
        }
        break

      case "Ghế ngồi":
      default:
        layout.rows = 12
        layout.cols = 4
        layout.totalSeats = 45

        // Define seat types for regular bus
        for (let row = 1; row <= layout.rows; row++) {
          for (let col = 0; col < layout.cols; col++) {
            const colLetter = String.fromCharCode(65 + col)
            const seat = `${row}${colLetter}`

            // Determine seat position
            let position = "Giữa"
            if (row <= 4) {
              position = "Phía trước"
            } else if (row >= 9) {
              position = "Phía sau"
            }

            // Determine seat type
            let type = "Ghế thường"
            if (col === 0 || col === 3) {
              type = "Ghế cửa sổ"
            }

            layout.seatMap[seat] = { type, position }
          }
        }
        break
    }

    // Generate random unavailable seats
    const unavailable = new Set<string>()
    const totalUnavailable = layout.totalSeats - availableSeats

    while (unavailable.size < totalUnavailable) {
      const row = Math.floor(Math.random() * layout.rows) + 1
      const col = String.fromCharCode(65 + Math.floor(Math.random() * layout.cols))
      const seat = `${row}${col}`

      // Skip if the seat doesn't exist in the seatMap (for Limousine)
      if (!layout.seatMap[seat]) {
        continue
      }

      unavailable.add(seat)
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
      // Check if max seats limit is reached
      if (newSelectedSeats.length >= maxSeats) {
        alert(`Bạn chỉ có thể chọn tối đa ${maxSeats} ghế.`)
        return
      }
      newSelectedSeats.push(seat)
    } else {
      newSelectedSeats.splice(seatIndex, 1)
    }

    onSelectSeats(newSelectedSeats)
  }

  // Generate seat grid
  const renderSeats = () => {
    const seats = []
    const { rows, cols } = seatLayout

    for (let row = 1; row <= rows; row++) {
      const rowSeats = []

      for (let col = 0; col < cols; col++) {
        // Skip middle seat for aisle in sleeper buses
        if (busType === "Giường nằm" && col === 1) {
          rowSeats.push(
            <div key={`${row}-aisle`} className="w-10 h-10 flex items-center justify-center">
              <div className="w-2 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>,
          )
          continue
        }

        // Skip some seats for Limousine to create luxury space
        if (busType === "Limousine" && ((row > 6 && col === 2) || (row === 8 && col === 1))) {
          rowSeats.push(<div key={`${row}-${col}-empty`} className="w-10 h-10"></div>)
          continue
        }

        const colLetter = String.fromCharCode(65 + col)
        const seat = `${row}${colLetter}`

        // Skip if the seat doesn't exist in the seatMap (for Limousine)
        if (!seatLayout.seatMap[seat]) {
          rowSeats.push(<div key={`${row}-${col}-empty`} className="w-10 h-10"></div>)
          continue
        }

        const isUnavailable = seatLayout.unavailableSeats.includes(seat)
        const isSelected = selectedSeats.includes(seat)
        const seatInfo = seatLayout.seatMap[seat]

        rowSeats.push(
          <TooltipProvider key={seat} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-10 h-10 m-1 p-0 font-medium transition-all relative",
                    isUnavailable
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500"
                      : isSelected
                        ? "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-500 dark:text-blue-300"
                        : "hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/30",
                  )}
                  onClick={() => toggleSeat(seat)}
                  disabled={isUnavailable}
                >
                  {seat}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <div className="space-y-1">
                  <p className="font-semibold">{seat}</p>
                  <p>{seatInfo.type}</p>
                  <p>{seatInfo.position}</p>
                  {isUnavailable && <p className="text-red-500">Đã đặt</p>}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>,
        )
      }

      seats.push(
        <div key={`row-${row}`} className="flex items-center justify-center my-1">
          {rowSeats}
        </div>,
      )
    }

    return seats
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex items-center justify-center gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
          <span className="text-sm">Đã đặt</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded mr-2"></div>
          <span className="text-sm">Còn trống</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-100 border border-blue-500 dark:bg-blue-900 dark:border-blue-500 rounded mr-2"></div>
          <span className="text-sm">Đã chọn</span>
        </div>
      </div>

      <div className="border dark:border-gray-700 rounded-lg p-4 mb-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="w-full h-10 bg-blue-600 dark:bg-blue-700 text-white rounded-md mb-6 flex items-center justify-center font-medium">
          <Bus className="h-4 w-4 mr-2" /> Phía trước xe
        </div>

        <div className="flex flex-col items-center">{renderSeats()}</div>

        <div className="w-full h-10 bg-blue-600 dark:bg-blue-700 text-white rounded-md mt-6 flex items-center justify-center font-medium">
          <Bus className="h-4 w-4 mr-2 rotate-180" /> Phía sau xe
        </div>
      </div>

      <div className="flex items-center justify-center text-sm text-center text-gray-500 dark:text-gray-400 mb-2">
        <Info className="h-4 w-4 mr-1" />
        <p>
          Chọn tối đa {maxSeats} ghế. Bạn đã chọn {selectedSeats.length}/{maxSeats} ghế.
        </p>
      </div>

      <div className="text-sm text-center text-gray-500 dark:text-gray-400">
        <p>Loại xe: {busType}</p>
        <p>Số ghế còn trống: {availableSeats}</p>
      </div>
    </div>
  )
}
