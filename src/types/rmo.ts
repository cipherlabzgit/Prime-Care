export type RmoBookingStatus =
  | "WebBooked"
  | "ArrivedAtReception"
  | "AssignedToRmo"
  | "RmoInProgress"
  | "RmoComplete"
  | "ReadyForDoctor"
  /** @deprecated Use WebBooked — kept for backward compatibility with older API responses */
  | "PendingRmo";

export type RmoPatientType = "NEW" | "EXISTING";

export interface RmoBooking {
  bookingId: number;
  bookingReference: string;
  patientType: RmoPatientType;
  requiresRmoCaseTaking: boolean;
  rmoStatus: RmoBookingStatus;
  fullName: string;
  mobileNumber: string;
  nicOrPassport?: string;
  email?: string;
  notes?: string;
  sessionDate: string;
  doctorAppointmentTime: string;
  recommendedArrivalTime: string;
  rmoCaseTakingMinutes: number;
  doctorName: string;
  specialization: string;
  centerName: string;
  roomCode: string;
  consultationFee: number;
  existingPatientRegistrationId?: number;
  newPatientRegistrationId?: number;
  arrivedAt?: string | null;
  assignedToRmoAt?: string | null;
  rmoCompletedAt?: string | null;
  caseTakingNotes?: string | null;
}

export interface RmoBookingLookupParams {
  bookingReference?: string;
  mobileNumber?: string;
  nic?: string;
  sessionDate?: string;
  centerName?: string;
}

export interface RmoTodayBookingsParams {
  sessionDate?: string;
  centerName?: string;
}

export interface CompleteCaseTakingPayload {
  fullName?: string;
  mobileNumber?: string;
  nicOrPassport?: string;
  email?: string;
  caseTakingNotes?: string;
  /** When true, marks RMO case taking complete and releases patient to doctor queue. */
  complete: boolean;
}

export interface CompleteCaseTakingResponse {
  booking: RmoBooking;
  message: string;
  newPatientRegistrationId?: number;
}

export interface ReceptionBookingActionResponse {
  booking: RmoBooking;
  message: string;
}
