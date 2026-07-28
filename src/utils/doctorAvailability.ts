import type { DoctorProfile } from "../types/doctor";
import { sessionDateKey } from "./channelingUtils";

export type DoctorAvailabilityStatus =
  | "available"
  | "unavailable"
  | "no-sessions";

export interface DoctorAvailabilityMeta {
  status: DoctorAvailabilityStatus;
  label: string;
}

const AVAILABILITY_LABELS: Record<DoctorAvailabilityStatus, string> = {
  available: "Available",
  unavailable: "Unavailable",
  "no-sessions": "No Sessions",
};

export function isFutureSessionDate(sessionDate: string): boolean {
  const key = sessionDateKey(sessionDate);
  const todayKey = sessionDateKey(new Date().toISOString());
  return key >= todayKey;
}

export function isDoctorInactive(
  status?: string | null,
  isActive?: boolean | null,
): boolean {
  if (isActive === false) return true;
  const normalized = status?.trim().toLowerCase();
  if (!normalized) return false;
  return normalized === "inactive" || normalized === "disabled";
}

export function resolveDoctorAvailability(
  status: string | undefined,
  isActive: boolean | undefined,
  futureSessionCount: number,
): DoctorAvailabilityStatus {
  if (isDoctorInactive(status, isActive)) return "unavailable";
  if (futureSessionCount > 0) return "available";
  return "no-sessions";
}

export function getDoctorAvailabilityMeta(
  doctor: Pick<
    DoctorProfile,
    "status" | "isActive" | "futureSessionCount"
  >,
): DoctorAvailabilityMeta {
  const status = resolveDoctorAvailability(
    doctor.status,
    doctor.isActive,
    doctor.futureSessionCount,
  );
  return { status, label: AVAILABILITY_LABELS[status] };
}
