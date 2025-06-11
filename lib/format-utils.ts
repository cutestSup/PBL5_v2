// Format price for display
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(price)
}

// Calculate duration between two times
export const getDuration = (start: string, end: string) => {
  const [startHour, startMinute] = start.split(":").map(Number)
  const [endHour, endMinute] = end.split(":").map(Number)
  
  let hours = endHour - startHour
  let minutes = endMinute - startMinute
  
  if (minutes < 0) {
    hours -= 1
    minutes += 60
  }
  if (hours < 0) {
    hours += 24
  }
  
  return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`
}
