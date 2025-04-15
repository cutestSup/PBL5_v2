"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ZoomImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
}

export function ZoomImage({ src, alt, width, height, className, fill = false }: ZoomImageProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn("overflow-hidden rounded-md relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={cn("transition-transform duration-500 ease-out object-cover", isHovered ? "scale-110" : "scale-100")}
      />
    </div>
  )
}
