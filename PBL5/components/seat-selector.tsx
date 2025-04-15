"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SeatSelectorProps {
  busType: string
  availableSeats: number
  onSelectSeats: (seats: string[]) => void
  selectedSeats: string[]
}

export function SeatSelector({ busType, availableSeats, onSelectSeats, selectedSeats }: SeatSelectorProps) {
  // Generate seat layout based on bus type
  const [seatLayout, setSeatLayout] = useState<{
    rows: number
    cols: number
    totalSeats: number
    unavailableSeats: string[]
  }>({
    rows: 0,
    cols: 0,
    totalSeats: 0,
    unavailableSeats: [],
  })

  // Initialize seat layout based on bus type
  useEffect(() => {
    const layout = {
      rows: 0,
      cols: 0,
      totalSeats: 0,
      unavailableSeats: [] as string[],
    }

    switch (busType) {
      case "Giường nằm":
        layout.rows = 10
        layout.cols = 3
        layout.totalSeats = 30
        break
      case "Limousine":
        layout.rows = 8
        layout.cols = 3
        layout.totalSeats = 22 // Some seats are removed for luxury space
        break
      case "Ghế ngồi":
      default:
        layout.rows = 12
        layout.cols = 4
        layout.totalSeats = 45
        break
    }

    // Generate random unavailable seats
    const unavailable = new Set<string>()
    const totalUnavailable = layout.totalSeats - availableSeats

    while (unavailable.size < totalUnavailable) {
      const row = Math.floor(Math.random() * layout.rows) + 1
      const col = String.fromCharCode(65 + Math.floor(Math.random() * layout.cols))
      const seat = `${row}${col}`
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
        const isUnavailable = seatLayout.unavailableSeats.includes(seat)
        const isSelected = selectedSeats.includes(seat)

        rowSeats.push(
          <Button
            key={seat}
            variant="outline"
            size="sm"
            className={cn(
              "w-10 h-10 m-1 p-0 font-medium transition-all",
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
          </Button>,
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

      <div className="border dark:border-gray-700 rounded-lg p-4 mb-4">
        <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-md mb-6 flex items-center justify-center font-medium">
          Phía trước xe
        </div>

        <div className="flex flex-col items-center">{renderSeats()}</div>

        <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-md mt-6 flex items-center justify-center font-medium">
          Phía sau xe
        </div>
      </div>

      <div className="text-sm text-center text-gray-500 dark:text-gray-400">
        <p>Loại xe: {busType}</p>
        <p>Số ghế còn trống: {availableSeats}</p>
      </div>
    </div>
  )
}
