"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SeatProps {
  seatId: string
  isSelected: boolean
  isDisabled: boolean
  onClick: (seatId: string) => void
}

const Seat = ({ seatId, isSelected, isDisabled, onClick }: SeatProps) => (
  <Button
    variant={isSelected ? 'default' : 'outline'}
    disabled={isDisabled}
    onClick={() => onClick(seatId)}
    className={cn(
      'aspect-square w-12 h-12 p-0',
      isSelected && 'bg-green-100 text-green-500 border-green-500',
      isDisabled && 'bg-gray-200 text-gray-400 border-gray-400'
    )}
  >
    {seatId}
  </Button>
)

interface FloorLayoutProps {
  layout: string[][]
  selectedSeats: string[]
  bookedSeats: string[]
  onSeatClick: (seatId: string) => void
}

const FloorLayout = ({ layout, selectedSeats, bookedSeats, onSeatClick }: FloorLayoutProps) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <div className="grid grid-cols-3 gap-4">
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className="space-y-4">
          {row.map((seatId, seatIndex) => (
            <div key={`${rowIndex}-${seatIndex}`}>
              {seatId ? (
                <Seat
                  seatId={seatId}
                  isSelected={selectedSeats.includes(seatId)}
                  isDisabled={bookedSeats.includes(seatId)}
                  onClick={onSeatClick}
                />
              ) : (
                // Empty space for aisle or driver area
                <div className="aspect-square w-12 h-12" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
)

interface DynamicBusLayoutProps {
  busType: {
    code: string
    name: string
    totalSeats: number
    layout: string // JSON string of layout
  }
  selectedSeats: string[]
  bookedSeats: string[]
  onSeatSelect: (seatId: string) => void
}

export function DynamicBusLayout({
  busType,
  selectedSeats,
  bookedSeats,
  onSeatSelect
}: DynamicBusLayoutProps) {
  // Parse the layout JSON string
  const layoutData = JSON.parse(busType.layout) as string[][][]

  return (
    <div className="space-y-8">
      {/* Display bus type information */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{busType.name}</h3>
          <p className="text-sm text-muted-foreground">Tổng số ghế: {busType.totalSeats}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-sm">Còn trống</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">Đang chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span className="text-sm">Đã đặt</span>
          </div>
        </div>
      </div>

      {/* Tầng layout */}
      {layoutData.map((floorLayout, index) => (
        <div key={index}>
          <h4 className="text-sm font-medium mb-4 text-center">
            {index === 0 ? 'Tầng dưới' : 'Tầng trên'}
          </h4>
          <FloorLayout
            layout={floorLayout}
            selectedSeats={selectedSeats}
            bookedSeats={bookedSeats}
            onSeatClick={onSeatSelect}
          />
        </div>
      ))}
    </div>
  )
}
