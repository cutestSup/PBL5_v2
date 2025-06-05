"use client"

import * as React from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
import { useLocation } from "@/hooks/use-location"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type Location } from "@/services/location-service"

// Popular locations in Vietnam
// const popularLocations = [
//   { value: "ho-chi-minh", label: "Hồ Chí Minh" },
//   { value: "ha-noi", label: "Hà Nội" },
//   { value: "da-nang", label: "Đà Nẵng" },
//   { value: "da-lat", label: "Đà Lạt" },
//   { value: "nha-trang", label: "Nha Trang" },
//   { value: "vung-tau", label: "Vũng Tàu" },
//   { value: "hue", label: "Huế" },
//   { value: "quy-nhon", label: "Quy Nhơn" },
//   { value: "phan-thiet", label: "Phan Thiết" },
//   { value: "can-tho", label: "Cần Thơ" },
//   { value: "hai-phong", label: "Hải Phòng" },
//   { value: "vinh", label: "Vinh" },
// ]

interface LocationComboboxProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function LocationCombobox({ placeholder, value, onChange, className }: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchText, setSearchText] = React.useState("")
  const { locations, isLoading, searchLocations } = useLocation()

  // Load locations when search text changes
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocations(searchText)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchText, searchLocations])

  const handleSelect = (currentValue: string) => {
    const selectedLocation = locations.find((location: Location) => location.name === currentValue)
    onChange(selectedLocation?.id?.toString() || "")
    console.log("Selected location:", currentValue)
    console.log("ID:", selectedLocation?.id)
    setOpen(false)
  }

  const displayValue = React.useMemo(() => {
    if (!value) return placeholder
    const selectedLocation = locations.find((location: Location) => location.id.toString() === value)
    return selectedLocation ? selectedLocation.name : placeholder
  }, [value, locations, placeholder])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-background border border-input hover:bg-accent hover:text-accent-foreground pl-9 relative h-10",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={`Tìm ${placeholder.toLowerCase()}`} 
            value={searchText}
            onValueChange={setSearchText}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Đang tìm kiếm..." : "Không tìm thấy địa điểm"}
            </CommandEmpty>
            <CommandGroup>
              {locations.map((location: Location) => (
                <CommandItem 
                  key={location.id} 
                  value={location.name} 
                  onSelect={handleSelect}
                  className="flex items-center gap-3 py-3"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === location.id.toString() ? "opacity-100" : "opacity-0")} />
                  {location.image_url ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={location.image_url} 
                        alt={location.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{location.name}</span>
                    {location.province && (
                      <span className="text-sm text-gray-500">{location.province}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
