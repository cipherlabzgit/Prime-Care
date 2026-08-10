import axios from "axios";

const HOLDS_ROOT = "/api/channeling/holds";

/** Hold window while patient fills details and confirms. */
export const SLOT_HOLD_SECONDS = 10 * 60;

export interface SlotHold {
  channelSlotId: number;
  sessionId: number;
  expiresAt: string;
}

export interface SlotHoldReservation extends SlotHold {
  holdToken: string;
  holdSeconds: number;
}

export type SlotHoldFailureKind = "conflict" | "unavailable" | "other";

export async function fetchActiveHolds(sessionId: number): Promise<SlotHold[]> {
  const { data } = await axios.get<{ holds?: SlotHold[] }>(HOLDS_ROOT, {
    params: { sessionId },
  });
  return Array.isArray(data?.holds) ? data.holds : [];
}

export async function reserveSlotHold(payload: {
  channelSlotId: number;
  sessionId: number;
  holdToken?: string;
  durationSeconds?: number;
}): Promise<SlotHoldReservation> {
  const { data } = await axios.post<SlotHoldReservation>(
    `${HOLDS_ROOT}/reserve`,
    payload,
  );
  return data;
}

export async function releaseSlotHold(payload: {
  channelSlotId: number;
  holdToken: string;
}): Promise<void> {
  await axios.post(`${HOLDS_ROOT}/release`, payload);
}

/** Best-effort release when the tab closes. */
export function releaseSlotHoldBeacon(payload: {
  channelSlotId: number;
  holdToken: string;
}): void {
  const body = JSON.stringify(payload);
  if (typeof fetch === "function") {
    void fetch(`${HOLDS_ROOT}/release`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
    return;
  }

  void axios.post(`${HOLDS_ROOT}/release`, payload).catch(() => undefined);
}

export function getSlotHoldFailureKind(err: unknown): SlotHoldFailureKind {
  if (!axios.isAxiosError(err)) return "other";

  if (err.response?.status === 409) return "conflict";

  // Proxy/server down, timeout, or no response
  if (!err.response) return "unavailable";
  if ([502, 503, 504].includes(err.response.status)) return "unavailable";

  const data = err.response.data;
  if (typeof data === "string" && /econnrefused|proxy|bad gateway/i.test(data)) {
    return "unavailable";
  }

  return "other";
}

export function getHoldErrorMessage(err: unknown, fallback: string): string {
  const kind = getSlotHoldFailureKind(err);

  if (kind === "conflict") {
    return "This time slot is currently reserved by another patient. Please choose another slot.";
  }

  if (kind === "unavailable") {
    return "Could not lock this slot right now. Restart the Vite dev server (`npm run dev`) and try again.";
  }

  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (data && typeof data === "object") {
      const message = (data as { message?: string }).message;
      if (typeof message === "string" && message.trim()) return message.trim();
    }
  }

  if (err instanceof Error && err.message.trim()) {
    return err.message.trim();
  }

  return fallback;
}
