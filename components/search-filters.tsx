"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/format-utils"

interface SearchFiltersProps {
  minPrice: number
  maxPrice: number
  onPriceChange: (range: [number, number]) => void
  onBusTypeChange: (types: string[]) => void
  onTimeChange: (times: string[]) => void
  onReset: () => void
  className?: string
}

const busTypes = [
  { id: "sleeper", label: "Giường nằm" },
  { id: "seater", label: "Ghế ngồi" },
  { id: "limousine", label: "Limousine" },
]

const timePeriods = [
  { id: "morning", label: "Sáng (6h - 12h)" },
  { id: "afternoon", label: "Chiều (12h - 18h)" },
  { id: "evening", label: "Tối (18h - 24h)" },
  { id: "night", label: "Đêm (0h - 6h)" },
]

export function SearchFilters({
  minPrice,
  maxPrice,
  onPriceChange,
  onBusTypeChange,
  onTimeChange,
  onReset,
  className
}: SearchFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
  const [selectedBusTypes, setSelectedBusTypes] = useState<string[]>([])
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])

  // Update local state when props change
  useEffect(() => {
    setPriceRange([minPrice, maxPrice])
  }, [minPrice, maxPrice])

  // Handle price range change
  const handlePriceChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]]
    setPriceRange(newRange)
    onPriceChange(newRange)
  }

  // Handle bus type selection
  const handleBusTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...selectedBusTypes, type]
      : selectedBusTypes.filter(t => t !== type)
    setSelectedBusTypes(newTypes)
    onBusTypeChange(newTypes)
  }

  // Handle time period selection
  const handleTimeChange = (time: string, checked: boolean) => {
    const newTimes = checked
      ? [...selectedTimes, time]
      : selectedTimes.filter(t => t !== time)
    setSelectedTimes(newTimes)
    onTimeChange(newTimes)
  }

  // Handle reset filters
  const handleReset = () => {
    setPriceRange([minPrice, maxPrice])
    setSelectedBusTypes([])
    setSelectedTimes([])
    onReset()
  }

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Bộ lọc tìm kiếm</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <X className="h-4 w-4 mr-2" />
          Đặt lại
        </Button>
      </div>

      {/* Price Range */}
      <div className="space-y-4 mb-6">
        <Label>Khoảng giá</Label>
        <Slider
          min={minPrice}
          max={maxPrice}
          step={50000}
          value={priceRange}
          onValueChange={handlePriceChange}
          className="mt-2"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Bus Types */}
      <div className="space-y-4 mb-6">
        <Label>Loại xe</Label>
        <div className="space-y-2">
          {busTypes.map(type => (
            <div key={type.id} className="flex items-center">
              <Checkbox
                id={`bus-${type.id}`}
                checked={selectedBusTypes.includes(type.id)}
                onCheckedChange={(checked) => handleBusTypeChange(type.id, checked as boolean)}
              />
              <label
                htmlFor={`bus-${type.id}`}
                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Time Periods */}
      <div className="space-y-4">
        <Label>Thời gian khởi hành</Label>
        <div className="space-y-2">
          {timePeriods.map(time => (
            <div key={time.id} className="flex items-center">
              <Checkbox
                id={`time-${time.id}`}
                checked={selectedTimes.includes(time.id)}
                onCheckedChange={(checked) => handleTimeChange(time.id, checked as boolean)}
              />
              <label
                htmlFor={`time-${time.id}`}
                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {time.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
