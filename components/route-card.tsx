"use client"

import Image from "next/image"
import { MapPin, Clock, Route as RouteIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { type RouteData } from "@/services/schedule-service"

interface RouteCardProps {
  route: RouteData
  className?: string
}

export function RouteCard({ route, className }: RouteCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="relative w-full h-48">
          {route.image_url ? (
            <Image
              src={route.image_url}
              alt={`${route.fromLocation.name} - ${route.toLocation.name}`}
              fill
              className="object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-lg">
              <RouteIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">
            {route.fromLocation.name} - {route.toLocation.name}
          </h3>
          {route.description && (
            <p className="text-sm text-gray-600 mb-3">{route.description}</p>
          )}
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span>Khoảng cách: {route.distance || "Chưa cập nhật"}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>Thời gian: {route.duration || "Chưa cập nhật"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
