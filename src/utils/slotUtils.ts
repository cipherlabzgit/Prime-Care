import type { ChannelingSession } from "../services/channelingService";
import type { SessionTimeSlot } from "../types/channeling";
import { formatTime } from "./channelingUtils";

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function minutesToTimeString(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}

/**
 * Builds bookable time slots from session window and slot counts (API has no per-slot endpoint).
 */
export function generateSessionTimeSlots(
  session: ChannelingSession,
): SessionTimeSlot[] {
  const total = Math.max(session.totalSlotCount ?? session.availableSlotCount, 1);
  const available = Math.max(0, Math.min(session.availableSlotCount, total));
  const bookedCount = total - available;

  const startMins = timeToMinutes(session.startTime);
  const endMins = timeToMinutes(session.endTime);
  const windowMins = Math.max(endMins - startMins, total * 10);
  const interval = windowMins / total;

  return Array.from({ length: total }, (_, index) => {
    const slotMins = startMins + interval * index;
    const time = minutesToTimeString(slotMins);
    return {
      id: -1 - index,
      channelSlotId: -1 - index,
      time,
      label: formatTime(time),
      available: index >= bookedCount,
    };
  });
}
