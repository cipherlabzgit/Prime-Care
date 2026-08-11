import type {
  ChannelingSession,
  ChannelingSessionSlot,
} from "../services/channelingService";
import type { SessionTimeSlot } from "../types/channeling";
import { formatTime } from "./channelingUtils";

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function minutesToTimeString(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}

/** Normalize API/UI times to `HH:MM:00` for hold matching. */
export function normalizeSlotTime(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  // 2:45 PM / 02:45 PM
  const ampm = trimmed.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
  if (ampm) {
    let hour = Number(ampm[1]);
    const minute = Number(ampm[2]);
    const period = ampm[3].toUpperCase();
    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  }
  // HH:MM or HH:MM:SS
  if (trimmed.length >= 5 && trimmed.includes(":")) {
    return `${trimmed.slice(0, 5)}:00`;
  }
  return trimmed;
}

/**
 * Stable positive hold key from session + clock time.
 * Used when ERP returns missing/duplicate slot ids so each time can be held independently.
 */
export function slotHoldIdFromTime(sessionId: number, time: string): number {
  const mins = Math.max(0, Math.min(timeToMinutes(normalizeSlotTime(time)), 24 * 60 - 1));
  return sessionId * 10_000 + mins;
}

function toDisplayTime(slot: ChannelingSessionSlot): string {
  if (slot.slotTime) return slot.slotTime;
  if (slot.time) return slot.time;
  if (slot.startTime) return slot.startTime;
  return "";
}

function readApiSlotAvailable(slot: ChannelingSessionSlot): boolean {
  if (typeof slot.isAvailable === "boolean") return slot.isAvailable;
  if (typeof slot.available === "boolean") return slot.available;
  if (slot.slotStatus) return slot.slotStatus.toLowerCase() === "available";
  if (slot.status) return slot.status.toLowerCase() === "available";
  return true;
}

function readApiSlotId(slot: ChannelingSessionSlot): number | null {
  const slotId = slot.slotId ?? slot.id;
  if (slotId == null) return null;
  const n = Number(slotId);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Maps ERP session slots to UI slots with unique hold ids.
 * If ERP reuses the same slotId for every time, derive hold ids from session + time
 * so only the held clock time is blocked for other patients.
 */
export function mapApiSlotsToUi(
  slots: ChannelingSessionSlot[],
  sessionId: number,
): SessionTimeSlot[] {
  const prepared = slots.map((slot, index) => {
    const apiId = readApiSlotId(slot);
    const time = normalizeSlotTime(toDisplayTime(slot));
    return {
      apiId,
      time,
      available: readApiSlotAvailable(slot),
      index,
    };
  });

  const apiIds = prepared.map((s) => s.apiId).filter((id): id is number => id != null);
  const uniqueApiIds = new Set(apiIds);
  const apiIdsAreUnique =
    apiIds.length === prepared.length && uniqueApiIds.size === prepared.length;

  return prepared.map((slot) => {
    const derivedId =
      slot.time && sessionId > 0
        ? slotHoldIdFromTime(sessionId, slot.time)
        : sessionId * 10_000 + slot.index + 1;

    const holdId = apiIdsAreUnique && slot.apiId != null ? slot.apiId : derivedId;
    const checkoutSlotId = slot.apiId != null ? slot.apiId : holdId;

    return {
      id: holdId,
      channelSlotId: holdId,
      checkoutSlotId,
      time: slot.time,
      label: slot.time ? formatTime(slot.time) : `Slot ${holdId}`,
      available: slot.available,
    };
  });
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
    const holdId = slotHoldIdFromTime(session.sessionId, time);
    return {
      id: holdId,
      channelSlotId: holdId,
      checkoutSlotId: holdId,
      time,
      label: formatTime(time),
      available: index >= bookedCount,
    };
  });
}
