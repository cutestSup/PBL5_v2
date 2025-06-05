export interface SeatStatus {
  id: string;
  seatId: string;
  scheduleId: string;
  status: "available" | "booked" | "selected";
}

export interface SeatStatusResponse {
  success: boolean;
  data: {
    seats: {
      rows: SeatStatus[];
    };
  };
}

export interface ReservationResponse {
  success: boolean;
  message: string;
}

export const seatService = {
  getSeatStatus: async (scheduleId: string): Promise<SeatStatusResponse> => {
    const response = await fetch("http://localhost:5000/api/seat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduleId }),
    });
    
    if (!response.ok) {
      throw new Error("Không thể lấy thông tin ghế");
    }
    
    return response.json();
  },

  // Tạm giữ ghế trong 20 phút
  reserveSeats: async (scheduleId: string, seats: string[]): Promise<ReservationResponse> => {
    const response = await fetch("http://localhost:5000/api/seat/reserve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduleId, seats }),
    });

    if (!response.ok) {
      throw new Error("Không thể đặt giữ ghế");
    }

    return response.json();
  },

  // Hủy giữ ghế
  releaseSeats: async (scheduleId: string, seats: string[]): Promise<ReservationResponse> => {
    const response = await fetch("http://localhost:5000/api/seat/release", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduleId, seats }),
    });

    if (!response.ok) {
      throw new Error("Không thể hủy giữ ghế");
    }

    return response.json();
  }
}
