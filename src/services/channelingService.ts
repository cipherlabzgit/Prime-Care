import axios from "axios";

export const CHANNELING_API_ORIGIN = "http://localhost:7000";

const DISCOVER_URL =
  `${CHANNELING_API_ORIGIN}/api/channeling/public/discover`;
const CHECKOUT_URL =
  `${CHANNELING_API_ORIGIN}/api/channeling/public/bookings/checkout`;
const SESSION_SLOTS_URL = (sessionId: number) =>
  `${CHANNELING_API_ORIGIN}/api/channeling/public/sessions/${sessionId}/slots`;

/** Raw ERP discover API session shape */
export interface ChannelingSessionApi {
  sessionId: number;
  hospitalPartnerId?: number;
  sessionDate: string;
  doctorId: number;
  doctorName?: string;
  fullName?: string;
  designation?: string;
  specialization: string;
  qualification?: string | null;
  experienceYears?: number | null;
  profileSummary?: string | null;
  slmcNumber?: string | null;
  profileImage?: string | null;
  profileImagePath?: string | null;
  profilePhoto?: string | null;
  profilePhotoUrl?: string | null;
  photoUrl?: string | null;
  doctorStatus?: string | null;
  status?: string | null;
  isDoctorActive?: boolean | null;
  isActive?: boolean | null;
  centerName: string;
  roomCode: string;
  startTime: string;
  endTime: string;
  consultationFee: number;
  availableSlotCount: number;
  totalSlotCount?: number;
}

/** Normalized session used across the channeling UI */
export interface ChannelingSession {
  sessionId: number;
  hospitalPartnerId?: number;
  sessionDate: string;
  doctorId: number;
  doctorName: string;
  /** @deprecated Use doctorName — kept for backward compatibility */
  fullName: string;
  designation?: string;
  specialization: string;
  qualification?: string;
  experienceYears?: number;
  profileSummary?: string;
  slmcNumber?: string;
  profilePhoto?: string;
  profileImage?: string;
  doctorStatus?: string;
  isDoctorActive?: boolean;
  centerName: string;
  roomCode: string;
  startTime: string;
  endTime: string;
  consultationFee: number;
  availableSlotCount: number;
  totalSlotCount?: number;
}

export interface ChannelingBookingCheckoutPayload {
  channelSlotId: number;
  fullName: string;
  mobileNumber: string;
  nicOrPassport?: string;
  existingPatientRegistrationId?: number;
  paymentMethod: string;
  gatewayProvider?: string;
  idempotencyKey?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface ChannelingBookingCheckoutResponse {
  bookingReference?: string;
  referenceNumber?: string;
  bookingRef?: string;
  requiresRmoCaseTaking?: boolean;
  rmoCaseTakingMinutes?: number;
  doctorAppointmentTime?: string;
  recommendedArrivalTime?: string;
  [key: string]: unknown;
}

export interface ChannelingSessionSlot {
  id?: number;
  slotId?: number;
  startTime?: string;
  endTime?: string;
  slotTime?: string;
  time?: string;
  isAvailable?: boolean;
  available?: boolean;
  status?: string;
  slotStatus?: string;
}

function trimOptional(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function resolveProfileImagePath(raw: ChannelingSessionApi): string | undefined {
  return (
    trimOptional(raw.profileImage) ??
    trimOptional(raw.profileImagePath) ??
    trimOptional(raw.profilePhoto) ??
    trimOptional(raw.profilePhotoUrl) ??
    trimOptional(raw.photoUrl)
  );
}

function normalizeOptionalNumber(value?: number | null): number | undefined {
  if (value == null || !Number.isFinite(value)) return undefined;
  return value;
}

export function normalizeChannelingSession(
  raw: ChannelingSessionApi,
): ChannelingSession {
  const doctorName =
    trimOptional(raw.doctorName) ?? trimOptional(raw.fullName) ?? "Unknown Doctor";

  return {
    sessionId: raw.sessionId,
    hospitalPartnerId: raw.hospitalPartnerId,
    sessionDate: raw.sessionDate,
    doctorId: raw.doctorId,
    doctorName,
    fullName: doctorName,
    designation: trimOptional(raw.designation),
    specialization: raw.specialization?.trim() || "-",
    qualification: trimOptional(raw.qualification),
    experienceYears: normalizeOptionalNumber(raw.experienceYears),
    profileSummary: trimOptional(raw.profileSummary),
    slmcNumber: trimOptional(raw.slmcNumber),
    profilePhoto: resolveProfileImagePath(raw),
    profileImage: resolveProfileImagePath(raw),
    doctorStatus: trimOptional(raw.doctorStatus) ?? trimOptional(raw.status),
    isDoctorActive:
      raw.isDoctorActive ?? raw.isActive ?? undefined,
    centerName: raw.centerName,
    roomCode: raw.roomCode,
    startTime: raw.startTime,
    endTime: raw.endTime,
    consultationFee: raw.consultationFee,
    availableSlotCount: raw.availableSlotCount,
    totalSlotCount: raw.totalSlotCount,
  };
}

function normalizeSessions(
  data:
    | ChannelingSessionApi[]
    | { value?: ChannelingSessionApi[]; data?: ChannelingSessionApi[] },
): ChannelingSession[] {
  let raw: ChannelingSessionApi[] = [];
  if (Array.isArray(data)) {
    raw = data;
  } else if (data && Array.isArray(data.data)) {
    raw = data.data;
  } else if (data && Array.isArray(data.value)) {
    raw = data.value;
  }
  return raw.map(normalizeChannelingSession);
}

function normalizeSessionSlots(
  data:
    | ChannelingSessionSlot[]
    | { value?: ChannelingSessionSlot[]; data?: ChannelingSessionSlot[] },
): ChannelingSessionSlot[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.value)) return data.value;
  return [];
}

export async function fetchDiscoverSessions(): Promise<ChannelingSession[]> {
  const { data } = await axios.get<
    ChannelingSessionApi[] | { value?: ChannelingSessionApi[]; data?: ChannelingSessionApi[] }
  >(DISCOVER_URL);
  return normalizeSessions(data);
}

export async function fetchSessionSlots(
  sessionId: number,
): Promise<ChannelingSessionSlot[]> {
  const { data } = await axios.get<
    ChannelingSessionSlot[] | { value?: ChannelingSessionSlot[]; data?: ChannelingSessionSlot[] }
  >(SESSION_SLOTS_URL(sessionId));
  return normalizeSessionSlots(data);
}

export async function checkoutChannelingBooking(
  payload: ChannelingBookingCheckoutPayload,
): Promise<ChannelingBookingCheckoutResponse> {
  const { data } = await axios.post<ChannelingBookingCheckoutResponse>(
    CHECKOUT_URL,
    payload,
  );
  return data;
}

export function getCheckoutErrorMessage(err: unknown, fallback: string): string {
  if (!axios.isAxiosError(err)) {
    return err instanceof Error && err.message.trim() ? err.message : fallback;
  }

  const data = err.response?.data;
  if (typeof data === "string" && data.trim()) {
    return sanitizeServerErrorText(data.trim(), fallback);
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    for (const key of ["message", "title", "detail", "error"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) {
        return sanitizeServerErrorText(value.trim(), fallback);
      }
    }
    if (Array.isArray(record.errors) && record.errors.length > 0) {
      const first = record.errors[0];
      if (typeof first === "string" && first.trim()) {
        return sanitizeServerErrorText(first.trim(), fallback);
      }
      if (first && typeof first === "object") {
        const msg = (first as { message?: string }).message;
        if (typeof msg === "string" && msg.trim()) {
          return sanitizeServerErrorText(msg.trim(), fallback);
        }
      }
    }
  }

  return fallback;
}

function sanitizeServerErrorText(text: string, fallback: string): string {
  const missingColumn = text.match(
    /42703: column "([^"]+)" of relation "([^"]+)" does not exist/i,
  );
  if (missingColumn) {
    return `Booking could not be completed because the hospital system database is missing a required field (${missingColumn[1]}). Please contact the hospital IT team.`;
  }

  if (
    text.includes("Npgsql.") ||
    text.includes("PostgresException") ||
    text.includes("\n   at ")
  ) {
    return fallback;
  }

  return text.length > 280 ? fallback : text;
}
