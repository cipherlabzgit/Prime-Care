/** In-memory slot holds for Vercel serverless (warm-instance scoped). */

const SLOT_HOLD_SECONDS = Number(process.env.SLOT_HOLD_SECONDS || 10 * 60);

function store() {
  const g = globalThis;
  if (!g.__premiercareSlotHolds) {
    g.__premiercareSlotHolds = new Map();
  }
  return g.__premiercareSlotHolds;
}

function pruneExpired(now = Date.now()) {
  const holds = store();
  for (const [slotId, hold] of holds.entries()) {
    const expiresAt = Date.parse(hold.expiresAt);
    if (!Number.isFinite(expiresAt) || expiresAt <= now) {
      holds.delete(slotId);
    }
  }
}

function createHoldToken() {
  return `hold_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function listHolds(sessionId = null) {
  pruneExpired();
  const holds = [...store().values()];
  const filtered =
    Number.isFinite(sessionId) && sessionId > 0
      ? holds.filter((hold) => Number(hold.sessionId) === sessionId)
      : holds;
  return filtered.map((hold) => ({
    channelSlotId: Number(hold.channelSlotId),
    sessionId: Number(hold.sessionId),
    expiresAt: hold.expiresAt,
  }));
}

export function reserveHold({
  channelSlotId,
  sessionId,
  holdToken = "",
  durationSeconds = SLOT_HOLD_SECONDS,
}) {
  const now = Date.now();
  pruneExpired(now);
  const holds = store();
  const existing = holds.get(Number(channelSlotId));

  if (existing && existing.holdToken !== holdToken) {
    const err = new Error(
      "This time slot is currently reserved by another patient. Please choose another slot.",
    );
    err.code = "SLOT_HELD";
    err.status = 409;
    err.expiresAt = existing.expiresAt;
    throw err;
  }

  const nextToken = existing?.holdToken || holdToken || createHoldToken();
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
  };

  holds.set(Number(channelSlotId), nextHold);

  return {
    channelSlotId: nextHold.channelSlotId,
    sessionId: nextHold.sessionId,
    holdToken: nextToken,
    expiresAt,
    holdSeconds: safeDuration,
  };
}

export function releaseHold({ channelSlotId, holdToken }) {
  pruneExpired();
  const holds = store();
  const existing = holds.get(Number(channelSlotId));
  if (!existing) {
    return { released: false, message: "Hold already released." };
  }
  if (existing.holdToken !== holdToken) {
    const err = new Error("Hold token does not match.");
    err.status = 403;
    throw err;
  }
  holds.delete(Number(channelSlotId));
  return { released: true, message: "Hold released." };
}
