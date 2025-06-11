"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Calendar, CreditCard, Info, MapPin, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SimplifiedSeatSelector } from "@/components/simplified-seat-selector"
import { CTAButton } from "@/components/cta-button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useScheduleDetails, useScheduleSeats } from "@/hooks/use-schedules"
import { useCreateBooking } from "@/hooks/use-bookings"
import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"
import { AuthProvider } from "@/components/auth-provider"
import { TripDetail } from "@/components/trip-detail"

function TripDetailContent() {
  const params = useParams()
  const { data: schedule, isLoading: isScheduleLoading } = useScheduleDetails(params.id as string)
  const { data: seats, isLoading: isSeatsLoading } = useScheduleSeats(params.id as string)

  if (isScheduleLoading || isSeatsLoading) {
    return <div>Đang tải...</div>
  }

  if (!schedule || !seats) {
    return <div>Không tìm thấy thông tin chuyến xe</div>
  }

  return <TripDetail />
}

export default function TripDetailPage() {
  return (
    <AuthProvider>
      <TripDetailContent />
    </AuthProvider>
  )
}
