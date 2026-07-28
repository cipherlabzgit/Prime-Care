import type { RmoBookingStatus } from "../types/rmo";

const STATUS_LABELS: Record<RmoBookingStatus, string> = {
  WebBooked: "Booked online",
  ArrivedAtReception: "At reception",
  AssignedToRmo: "Assigned to RMO",
  PendingRmo: "Booked online",
  RmoInProgress: "RMO in progress",
  RmoComplete: "RMO complete",
  ReadyForDoctor: "Ready for doctor",
};

export function getRmoStatusLabel(status: RmoBookingStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export function isReceptionActionable(status: RmoBookingStatus): boolean {
  return status === "WebBooked" || status === "PendingRmo" || status === "ArrivedAtReception";
}

export function canAssignToRmo(status: RmoBookingStatus): boolean {
  return status === "ArrivedAtReception";
}

export function canCheckIn(status: RmoBookingStatus): boolean {
  return status === "WebBooked" || status === "PendingRmo";
}

export function isRmoQueueStatus(status: RmoBookingStatus): boolean {
  return status === "AssignedToRmo" || status === "RmoInProgress";
}

export function isCaseTakingEditable(status: RmoBookingStatus): boolean {
  return isRmoQueueStatus(status);
}

export function normalizeLegacyStatus(status: RmoBookingStatus): RmoBookingStatus {
  return status === "PendingRmo" ? "WebBooked" : status;
}
