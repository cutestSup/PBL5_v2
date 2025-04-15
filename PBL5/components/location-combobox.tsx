"use client"

import * as React from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Popular locations in Vietnam
const popularLocations = [
  { value: "ho-chi-minh", label: "Hồ Chí Minh" },
  { value: "ha-noi", label: "Hà Nội" },
  { value: "da-nang", label: "Đà Nẵng" },
  { value: "da-lat", label: "Đà Lạt" },
  { value: "nha-trang", label: "Nha Trang" },
  { value: "vung-tau", label: "Vũng Tàu" },
  { value: "hue", label: "Huế" },
  { value: "quy-nhon", label: "Quy Nhơn" },
  { value: "phan-thiet", label: "Phan Thiết" },
  { value: "can-tho", label: "Cần Thơ" },
  { value: "hai-phong", label: "Hải Phòng" },
  { value: "vinh", label: "Vinh" },
]

interface LocationComboboxProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function LocationCombobox({ placeholder, value, onChange, className }: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [recentLocations, setRecentLocations] = React.useState<typeof popularLocations>([])

  // Load recent locations from localStorage on component mount
  React.useEffect(() => {
    const storedLocations = localStorage.getItem("recentLocations")
    if (storedLocations) {
      try {
        const parsed = JSON.parse(storedLocations)
        setRecentLocations(parsed.slice(0, 3)) // Only show top 3 recent locations
      } catch (e) {
        console.error("Failed to parse recent locations", e)
      }
    }
  }, [])

  // Save selected location to recent locations
  const handleSelect = (currentValue: string) => {
    const selectedLocation = popularLocations.find((location) => location.value === currentValue)

    if (selectedLocation) {
      // Add to recent locations
      setRecentLocations((prev) => {
        // Remove if already exists
        const filtered = prev.filter((loc) => loc.value !== currentValue)
        // Add to beginning of array
        const updated = [selectedLocation, ...filtered].slice(0, 3)
        // Save to localStorage
        localStorage.setItem("recentLocations", JSON.stringify(updated))
        return updated
      })
    }

    onChange(currentValue)
    setOpen(false)
  }

  const displayValue = React.useMemo(() => {
    const location = popularLocations.find((location) => location.value === value)
    return location?.label || value
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-background border border-input hover:bg-accent hover:text-accent-foreground pl-9 relative h-10",
            className,
          )}
        >
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {value ? displayValue : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Tìm ${placeholder.toLowerCase()}`} />
          <CommandList>
            <CommandEmpty>Không tìm thấy địa điểm</CommandEmpty>

            {recentLocations.length > 0 && (
              <CommandGroup heading="Tìm kiếm gần đây">
                {recentLocations.map((location) => (
                  <CommandItem key={`recent-${location.value}`} value={location.value} onSelect={handleSelect}>
                    <Check className={cn("mr-2 h-4 w-4", value === location.value ? "opacity-100" : "opacity-0")} />
                    {location.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            <CommandGroup heading="Địa điểm phổ biến">
              {popularLocations.map((location) => (
                <CommandItem key={location.value} value={location.value} onSelect={handleSelect}>
                  <Check className={cn("mr-2 h-4 w-4", value === location.value ? "opacity-100" : "opacity-0")} />
                  {location.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
