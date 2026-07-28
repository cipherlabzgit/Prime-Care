import axios from "axios";
import type {
  CompleteCaseTakingPayload,
  CompleteCaseTakingResponse,
  RmoBooking,
  RmoBookingLookupParams,
  RmoTodayBookingsParams,
} from "../types/rmo";

/**
 * Empty string uses the Vite dev proxy (`/api/channeling/rmo` → reviews server mock).
 * Set `VITE_RMO_API_BASE=http://localhost:7000` when the ERP implements these routes.
 */
const RMO_API_BASE = import.meta.env.VITE_RMO_API_BASE ?? "";

const RMO_ROOT = `${RMO_API_BASE}/api/channeling/rmo/bookings`;

function unwrapBookings(data: unknown): RmoBooking[] {
  if (Array.isArray(data)) return data as RmoBooking[];
  if (!data || typeof data !== "object") return [];

  const record = data as Record<string, unknown>;
  if (Array.isArray(record.data)) return record.data as RmoBooking[];
  if (Array.isArray(record.value)) return record.value as RmoBooking[];
  return [];
}

export async function lookupRmoBookings(
  params: RmoBookingLookupParams,
): Promise<RmoBooking[]> {
  const { data } = await axios.get<unknown>(`${RMO_ROOT}/lookup`, { params });
  return unwrapBookings(data);
}

export async function fetchTodayRmoBookings(
  params?: RmoTodayBookingsParams,
): Promise<RmoBooking[]> {
  const { data } = await axios.get<unknown>(`${RMO_ROOT}/today`, {
    params,
  });
  return unwrapBookings(data);
}

export async function fetchRmoBooking(bookingId: number): Promise<RmoBooking> {
  const { data } = await axios.get<RmoBooking | { data: RmoBooking }>(
    `${RMO_ROOT}/${bookingId}`,
  );
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data: RmoBooking }).data;
  }
  return data as RmoBooking;
}

export async function saveCaseTaking(
  bookingId: number,
  payload: CompleteCaseTakingPayload,
): Promise<CompleteCaseTakingResponse> {
  const { data } = await axios.patch<CompleteCaseTakingResponse>(
    `${RMO_ROOT}/${bookingId}/case-taking`,
    payload,
  );
  return data;
}
