import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useScheduleDetails, useScheduleSeats } from '@/hooks/use-schedules'
import { useBooking } from '@/hooks/use-booking'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Bus, ArrowRight } from 'lucide-react'
import { DynamicBusLayout } from '@/components/bus-layouts/dynamic-bus-layout'
import { convertToNumericId, convertToLetterId } from '@/lib/seat-utils'

export function TripDetail() {
  const params = useParams()
  const { data: schedule, isLoading: isScheduleLoading } = useScheduleDetails(params.id as string)
  const { data: seats, isLoading: isSeatsLoading } = useScheduleSeats(params.id as string)
  const { createBooking, isLoading: isBookingLoading } = useBooking()
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const handleSeatSelect = (seatId: string) => {
    console.log('Selected seat:', seatId, 'Numeric ID:', parseInt(seatId.replace(/[A-Z]/g, '')))
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        console.log('Unselecting seat:', seatId)
        return prev.filter(id => id !== seatId)
      }
      console.log('Adding seat:', seatId)
      return [...prev, seatId]
    })
  }

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất một ghế')
      return
    }

    try {
      // Convert seat IDs from string to number if needed
      const seatIds = selectedSeats.map(seatId => parseInt(seatId.replace(/[A-Z]/g, '')))
      await createBooking(schedule.id, seatIds)
      alert('Đặt vé thành công!')
    } catch (error) {
      alert('Đặt vé thất bại. Vui lòng thử lại.')
    }
  }

  if (isScheduleLoading || isSeatsLoading) {
    return <div>Đang tải...</div>
  }

  if (!schedule || !seats) {
    return <div>Không tìm thấy thông tin chuyến xe</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">
                {schedule.route.departureLocation.name} → {schedule.route.arrivalLocation.name}
              </h3>
              <p className="text-muted-foreground">
                {new Date(schedule.departureTime).toLocaleTimeString()} - {new Date(schedule.arrivalTime).toLocaleTimeString()}
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                {seats.filter(seat => seat.status === 'available').length} ghế trống
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center">
              <Bus className="h-4 w-4 text-muted-foreground mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Loại xe:</p>
                <p className="font-medium">{schedule.bus.type}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Thời gian:</p>
                <p className="font-medium">
                  {new Date(schedule.departureTime).toLocaleTimeString()} - {new Date(schedule.arrivalTime).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Ngày:</p>
                <p className="font-medium">{new Date(schedule.departureTime).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(schedule.price)}
            </div>
            <Button onClick={handleBooking} disabled={isBookingLoading}>
              {isBookingLoading ? 'Đang xử lý...' : 'Đặt vé'}
            </Button>
          </div>
        </CardContent>
      </Card>      {schedule.BusType && (
        <DynamicBusLayout
          busType={schedule.BusType}
          selectedSeats={selectedSeats}
          bookedSeats={seats.filter(seat => seat.status === 'booked').map(seat => seat.number)}
          onSeatSelect={handleSeatSelect}
        />
      )}
    </div>
  )
} 