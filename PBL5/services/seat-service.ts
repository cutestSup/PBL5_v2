export interface Seat {
  id: number;
  number: string;
  status: 'available' | 'booked' | 'reserved';
  position: string;
}

export interface SeatStatusResponse {
  success: boolean;
  data: {
    seatStatusCode: string;
    seats: Seat[];
  };
}

export interface ReservationResponse {
  success: boolean;
  message: string;
  data: {
    seats: string[];
    scheduleId: string;
    expiresAt?: string;
  };
}

// Ánh xạ từ vị trí sang mã ghế (A01->A17, B01->B17)
function getSeatLabel(position: number): string {
  const isUpperDeck = position >= 17;
  const deck = isUpperDeck ? 'B' : 'A';
  const seatNumber = (position % 17 + 1).toString().padStart(2, '0');
  return `${deck}${seatNumber}`;
}

// Ánh xạ từ mã ghế sang vị trí index
function getSeatPosition(label: string): number {
  const deck = label.charAt(0);
  const number = parseInt(label.slice(1));
  return (deck === 'B' ? 17 : 0) + (number - 1);
}

export const seatService = {
  // Lấy status của tất cả ghế
  getSeatStatus: async (scheduleId: string): Promise<SeatStatusResponse> => {
    const response = await fetch("http://localhost:5000/api/seat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduleId }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to get seat status");
    }
    
    const data = await response.json();
    
    // Chuyển đổi dữ liệu từ API sang định dạng phù hợp
    const seatStatusCode = data.data.seatStatusCode;
    const seats = Array.from({ length: 34 }, (_, index) => {
      const seatLabel = getSeatLabel(index);
      return {
        id: index + 1,
        number: seatLabel,
        status: seatStatusCode[index] === '1' ? 'available' : 'booked',
        position: index.toString()
      } as Seat;
    });

    return {
      success: true,
      data: {
        seatStatusCode: data.data.seatStatusCode,
        seats: seats
      }
    };
  },

  // Tạm giữ ghế trong 10 phút
  reserveSeats: async (scheduleId: string, seats: string[]): Promise<ReservationResponse> => {
    const response = await fetch("http://localhost:5000/api/seat/reserve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scheduleId,
        seats: seats.map(seat => getSeatPosition(seat) + 1)
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to reserve seats");
    }

    return response.json();
  },

  // Hủy giữ ghế
  releaseSeats: async (scheduleId: string, seats: string[]): Promise<ReservationResponse> => {
    const response = await fetch("http://localhost:5000/api/seat/release", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scheduleId,
        seats: seats.map(seat => getSeatPosition(seat) + 1)
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to release seats");
    }

    return response.json();
  }
}
