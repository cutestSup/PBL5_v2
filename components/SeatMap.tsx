import React from "react"

export type SeatStatus = "available" | "booked" | "selected" | "empty"

export interface Seat {
  id: string
  label: string
  status: SeatStatus
  floor: string // "lower" | "upper" | ...
  row: string // "A" | "B" | "C"
  col: number
  isEmpty?: boolean
}

export interface SeatMapTemplate {
  floors: Array<{
    name: string // "Tầng dưới", "Tầng trên"
    rows: Array<{
      rowLabel: string // "A", "B", "C"
      seats: Array<Seat>
    }>
  }>
}

interface SeatMapProps {
  template: SeatMapTemplate
  selectedSeats: string[]
  onSelect: (seatId: string) => void
  disabled?: boolean
}

export const SeatMap: React.FC<SeatMapProps> = ({ template, selectedSeats, onSelect, disabled }) => {
  return (
    <div className="flex gap-8">
      {template.floors.map((floor, floorIdx) => (
        <div key={floorIdx} className="bg-gray-100 rounded-lg p-4">
          <div className="text-center font-medium mb-2">{floor.name}</div>
          {floor.rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-2 mb-2 items-center">
              {row.seats.map((seat, seatIdx) => {
                if (seat.isEmpty) {
                  return <div key={seat.id} className="w-10 h-10" />
                }
                const isSelected = selectedSeats.includes(seat.id)
                let seatClass = "w-10 h-10 rounded flex items-center justify-center border font-bold text-base transition-all "
                if (seat.status === "booked") {
                  seatClass += "bg-gray-300 text-gray-400 cursor-not-allowed"
                } else if (isSelected) {
                  seatClass += "ring-2 ring-blue-500 bg-blue-400 text-white"
                } else if (seat.status === "available") {
                  seatClass += "bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer"
                } else {
                  seatClass += "bg-gray-100 text-gray-300"
                }
                return (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={seat.status !== "available" || disabled}
                    onClick={() => onSelect(seat.id)}
                    className={seatClass}
                  >
                    {seat.label}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
} 