export interface Schedule {
  id: string;
  busId: string;
  routeId: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  date: string;
  busType: string;
  availableSeats: number;
  pickupPoint?: string;
  dropoffPoint?: string;
}

export interface ScheduleResponse {
  success: boolean;
  message: string;
  data: {
    scheduleData: {
      count: number;
      rows: Schedule[];
    };
    routeData: {
      fromLocation: {
        id: string;
        name: string;
      };
      toLocation: {
        id: string;
        name: string;
      };
    };
  };
}