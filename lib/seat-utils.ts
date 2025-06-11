/**
 * Chuyển đổi từ seat ID dạng chữ (A1, B1) sang ID số
 * scheduleId = 1 -> seatIds: 1-34
 * scheduleId = 2 -> seatIds: 35-68
 * ...
 */
export function convertToNumericId(letterSeatId: string, scheduleId: string | number): number {
  const baseId = ((Number(scheduleId) - 1) * 34) + 1; // Mỗi xe 34 ghế, bắt đầu từ 1
  const floor = letterSeatId.charAt(0); // A hoặc B
  const number = parseInt(letterSeatId.slice(1));
  
  // Tầng dưới (A): 1-17
  if (floor === 'A') {
    return baseId + number - 1;
  }
  // Tầng trên (B): 18-34
  else if (floor === 'B') {
    return baseId + 17 + number - 1;
  }
  
  throw new Error('Invalid seat ID format');
}

/**
 * Chuyển đổi từ ID số sang seat ID dạng chữ (A1, B1)
 */
export function convertToLetterId(numericId: number, scheduleId: string | number): string {
  const baseId = ((Number(scheduleId) - 1) * 34) + 1;
  const relativeId = numericId - baseId + 1; // Id tương đối trong xe (1-34)
  
  if (relativeId <= 17) {
    // Tầng dưới (A1-A17)
    return `A${relativeId}`;
  } else {
    // Tầng trên (B1-B17)
    return `B${relativeId - 17}`;
  }
}


