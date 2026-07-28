import axios from "axios";
import type {
  ReceptionBookingActionResponse,
  RmoBooking,
  RmoBookingLookupParams,
} from "../types/rmo";

const RECEPTION_API_BASE = import.meta.env.VITE_RECEPTION_API_BASE ?? "";

const RECEPTION_ROOT = `${RECEPTION_API_BASE}/api/channeling/reception/bookings`;

function unwrapBookings(data: unknown): RmoBooking[] {
  if (Array.isArray(data)) return data as RmoBooking[];
  if (!data || typeof data !== "object") return [];

  const record = data as Record<string, unknown>;
  if (Array.isArray(record.data)) return record.data as RmoBooking[];
  if (Array.isArray(record.value)) return record.value as RmoBooking[];
  return [];
}

export async function lookupReceptionBookings(
  params: RmoBookingLookupParams,
): Promise<RmoBooking[]> {
  const { data } = await axios.get<unknown>(`${RECEPTION_ROOT}/lookup`, {
    params,
  });
  return unwrapBookings(data);
}

export async function checkInReceptionBooking(
  bookingId: number,
): Promise<ReceptionBookingActionResponse> {
  const { data } = await axios.patch<ReceptionBookingActionResponse>(
    `${RECEPTION_ROOT}/${bookingId}/check-in`,
  );
  return data;
}

export async function assignReceptionBookingToRmo(
  bookingId: number,
): Promise<ReceptionBookingActionResponse> {
  const { data } = await axios.patch<ReceptionBookingActionResponse>(
    `${RECEPTION_ROOT}/${bookingId}/assign-rmo`,
  );
  return data;
}

export async function fetchReceptionBooking(
  bookingId: number,
): Promise<RmoBooking> {
  const { data } = await axios.get<RmoBooking | { data: RmoBooking }>(
    `${RECEPTION_ROOT}/${bookingId}`,
  );
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data: RmoBooking }).data;
  }
  return data as RmoBooking;
}
