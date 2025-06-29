"use client"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  setDate: (date?: Date) => void
  className?: string
}

export function DatePicker({ date, setDate, className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            <span>
              {(() => {
                const day = format(date, "i", { locale: vi });
                const dayMap: { [key: string]: string } = {
                  "1": "T2",
                  "2": "T3",
                  "3": "T4",
                  "4": "T5",
                  "5": "T6",
                  "6": "T7",
                  "7": "CN"
                };
                return `${dayMap[day]}, ${format(date, "dd/MM/yyyy", { locale: vi })}`;
              })()}
            </span>
          ) : (
            <span>Chọn ngày đi</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={vi}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          className="border-none"
        />
      </PopoverContent>
    </Popover>
  )
}
