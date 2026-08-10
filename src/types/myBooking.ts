export type MyBookingSearchPurpose =
  | "ongoing"
  | "receipt"
  | "resend-sms";

export interface PublicBooking {
  bookingId: number;
  bookingReference: string;
  fullName: string;
  mobileNumberMasked: string;
  sessionDate: string;
  doctorAppointmentTime: string;
  recommendedArrivalTime?: string;
  doctorName: string;
  specialization: string;
  centerName: string;
  roomCode?: string;
  consultationFee: number;
  patientType: "NEW" | "EXISTING";
  requiresRmoCaseTaking: boolean;
  status: string;
  statusLabel: string;
  ongoingNumber: number;
  currentServingNumber: number | null;
  queueMessage?: string;
}

export interface PublicBookingLookupResponse {
  booking: PublicBooking;
  attemptsRemaining?: number;
}

export interface ResendBookingSmsResponse {
  sent: boolean;
  bookingReference: string;
  mobileNumberMasked: string;
  message: string;
}
