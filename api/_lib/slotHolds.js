/** In-memory slot holds for Vercel serverless (warm-instance scoped). */

const SLOT_HOLD_SECONDS = Number(process.env.SLOT_HOLD_SECONDS || 10 * 60);

function store() {
  const g = globalThis;
  if (!g.__premiercareSlotHolds) {
    g.__premiercareSlotHolds = new Map();
  }
  return g.__premiercareSlotHolds;
}

function normalizeSlotTime(raw) {
  if (typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const ampm = trimmed.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
  if (ampm) {
    let hour = Number(ampm[1]);
    const minute = Number(ampm[2]);
    const period = ampm[3].toUpperCase();
    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  }
  if (trimmed.length >= 5 && trimmed.includes(":")) {
    return `${trimmed.slice(0, 5)}:00`;
  }
  return trimmed;
}

function holdKey(channelSlotId, sessionId, slotTime) {
  const time = normalizeSlotTime(slotTime);
  if (time && Number.isFinite(sessionId) && sessionId > 0) {
    return `t:${sessionId}:${time}`;
  }
  return `id:${Number(channelSlotId)}`;
}

function pruneExpired(now = Date.now()) {
  const holds = store();
  for (const [key, hold] of holds.entries()) {
    const expiresAt = Date.parse(hold.expiresAt);
    if (!Number.isFinite(expiresAt) || expiresAt <= now) {
      holds.delete(key);
    }
  }
}

function createHoldToken() {
  return `hold_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function toPublicHold(hold) {
  return {
    channelSlotId: Number(hold.channelSlotId),
    sessionId: Number(hold.sessionId),
    expiresAt: hold.expiresAt,
    ...(hold.slotTime ? { slotTime: hold.slotTime } : {}),
  };
}

function findHoldEntry(channelSlotId, sessionId, slotTime) {
  const holds = store();
  const preferredKey = holdKey(channelSlotId, sessionId, slotTime);
  if (holds.has(preferredKey)) {
    return { key: preferredKey, hold: holds.get(preferredKey) };
  }

  const time = normalizeSlotTime(slotTime);
  for (const [key, hold] of holds.entries()) {
    if (Number(hold.channelSlotId) === Number(channelSlotId)) {
      return { key, hold };
    }
    if (
      time &&
      Number(hold.sessionId) === Number(sessionId) &&
      normalizeSlotTime(hold.slotTime) === time
    ) {
      return { key, hold };
    }
  }
  return null;
}

export function listHolds(sessionId = null) {
  pruneExpired();
  const holds = [...store().values()];
  const filtered =
    Number.isFinite(sessionId) && sessionId > 0
      ? holds.filter((hold) => Number(hold.sessionId) === sessionId)
      : holds;
  return filtered.map(toPublicHold);
}

export function reserveHold({
  channelSlotId,
  sessionId,
  holdToken = "",
  durationSeconds = SLOT_HOLD_SECONDS,
  slotTime = "",
}) {
  const now = Date.now();
  pruneExpired(now);
  const holds = store();
  const normalizedTime = normalizeSlotTime(slotTime);
  const existingEntry = findHoldEntry(channelSlotId, sessionId, normalizedTime);

  if (existingEntry && existingEntry.hold.holdToken !== holdToken) {
    const err = new Error(
      "This time slot is currently reserved by another patient. Please choose another slot.",
    );
    err.code = "SLOT_HELD";
    err.status = 409;
    err.expiresAt = existingEntry.hold.expiresAt;
    throw err;
  }

  const nextToken =
    existingEntry?.hold.holdToken || holdToken || createHoldToken();
  const safeDuration = Math.min(
    Math.max(Number(durationSeconds) || SLOT_HOLD_SECONDS, 30),
    30 * 60,
  );
  const expiresAt = new Date(now + safeDuration * 1000).toISOString();
  const nextHold = {
    channelSlotId: Number(channelSlotId),
    sessionId: Number(sessionId),
    holdToken: nextToken,
    expiresAt,
    updatedAt: new Date(now).toISOString(),
    ...(normalizedTime ? { slotTime: normalizedTime } : {}),
  };

  if (existingEntry) {
    holds.delete(existingEntry.key);
  }
  const key = holdKey(channelSlotId, sessionId, normalizedTime);
  holds.set(key, nextHold);

  return {
    channelSlotId: nextHold.channelSlotId,
    sessionId: nextHold.sessionId,
    holdToken: nextToken,
    expiresAt,
    holdSeconds: safeDuration,
    ...(normalizedTime ? { slotTime: normalizedTime } : {}),
  };
}

export function releaseHold({ channelSlotId, holdToken, slotTime = "", sessionId = null }) {
  pruneExpired();
  const holds = store();
  const existingEntry = findHoldEntry(channelSlotId, sessionId, slotTime);
  if (!existingEntry) {
    return { released: false, message: "Hold already released." };
  }
  if (existingEntry.hold.holdToken !== holdToken) {
    const err = new Error("Hold token does not match.");
    err.status = 403;
    throw err;
  }
  holds.delete(existingEntry.key);
  return { released: true, message: "Hold released." };
}
