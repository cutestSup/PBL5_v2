export interface PaymentResponse {
  success: boolean
  data: {
    bookingId: string
    status: string
    url?: string
  }
}

export const paymentService = {
  processPayment: async (bookingId: string) => {
    const response = await fetch("http://localhost:5000/api/payment/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    })
    if (!response.ok) {
      throw new Error("Không thể xử lý thanh toán")
    }
    return response.json() as Promise<PaymentResponse>
  }
}
