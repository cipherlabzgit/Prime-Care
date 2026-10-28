import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const SLOT_HOLDS_FILE = path.join(DATA_DIR, "slot-holds.json");
export const SLOT_HOLD_SECONDS = Number(process.env.SLOT_HOLD_SECONDS || 10 * 60);

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SLOT_HOLDS_FILE)) {
    fs.writeFileSync(SLOT_HOLDS_FILE, JSON.stringify({ holds: [] }, null, 2), "utf8");
  }
}

function readHolds() {
  ensureFile();
  try {
    const raw = JSON.parse(fs.readFileSync(SLOT_HOLDS_FILE, "utf8"));
    return Array.isArray(raw?.holds) ? raw.holds : [];
  } catch {
    return [];
  }
}

function writeHolds(holds) {
  ensureFile();
  fs.writeFileSync(SLOT_HOLDS_FILE, JSON.stringify({ holds }, null, 2), "utf8");
}

function pruneExpired(holds, now = Date.now()) {
  return holds.filter((hold) => {
    const expiresAt = Date.parse(hold.expiresAt);
    return Number.isFinite(expiresAt) && expiresAt > now;
  });
}

function createHoldToken() {
  return `hold_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
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

function toPublicHold(hold) {
  return {
    channelSlotId: Number(hold.channelSlotId),
    sessionId: Number(hold.sessionId),
    expiresAt: hold.expiresAt,
    ...(hold.slotTime ? { slotTime: hold.slotTime } : {}),
  };
}

function sameHold(hold, channelSlotId, sessionId, slotTime) {
  const time = normalizeSlotTime(slotTime);
  const holdTime = normalizeSlotTime(hold.slotTime || "");
  // Prefer clock-time identity so duplicate ERP slot ids cannot block every time.
  if (time && holdTime) {
    return Number(hold.sessionId) === Number(sessionId) && holdTime === time;
  }
  return Number(hold.channelSlotId) === Number(channelSlotId);
}

export function listHolds(sessionId = null) {
  let holds = pruneExpired(readHolds());
  writeHolds(holds);
  if (Number.isFinite(sessionId) && sessionId > 0) {
    holds = holds.filter((hold) => Number(hold.sessionId) === sessionId);
  }
  return holds.map(toPublicHold);
}

export function reserveHold({
  channelSlotId,
  sessionId,
  holdToken = "",
  durationSeconds = SLOT_HOLD_SECONDS,
  slotTime = "",
}) {
  const now = Date.now();
  let holds = pruneExpired(readHolds(), now);
  const normalizedTime = normalizeSlotTime(slotTime);
  const existing = holds.find((hold) =>
    sameHold(hold, channelSlotId, sessionId, normalizedTime),
  );

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
  const safeDuration = Math.min(Math.max(Number(durationSeconds) || SLOT_HOLD_SECONDS, 30), 30 * 60);
  const expiresAt = new Date(now + safeDuration * 1000).toISOString();
  const nextHold = {
    channelSlotId: Number(channelSlotId),
    sessionId: Number(sessionId),
    holdToken: nextToken,
    expiresAt,
    updatedAt: new Date(now).toISOString(),
    ...(normalizedTime ? { slotTime: normalizedTime } : {}),
  };

  holds = holds.filter(
    (hold) => !sameHold(hold, channelSlotId, sessionId, normalizedTime),
  );
  holds.push(nextHold);
  writeHolds(holds);

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
  let holds = pruneExpired(readHolds());
  const existing = holds.find((hold) =>
    sameHold(hold, channelSlotId, sessionId, slotTime),
  );
  if (!existing) {
    return { released: false, message: "Hold already released." };
  }
  if (existing.holdToken !== holdToken) {
    const err = new Error("Hold token does not match.");
    err.status = 403;
    throw err;
  }
  holds = holds.filter(
    (hold) => !sameHold(hold, channelSlotId, sessionId, slotTime),
  );
  writeHolds(holds);
  return { released: true, message: "Hold released." };
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    return {};
  }
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

/** Connect-style middleware for Vite and optional mounting elsewhere. */
export function createSlotHoldsMiddleware() {
  return async function slotHoldsMiddleware(req, res, next) {
    const url = new URL(req.url || "/", "http://local");
    if (!url.pathname.startsWith("/api/channeling/holds")) {
      return next();
    }

    try {
      if (req.method === "GET" && url.pathname === "/api/channeling/holds") {
        const sessionId = url.searchParams.get("sessionId")
          ? Number(url.searchParams.get("sessionId"))
          : null;
        return sendJson(res, 200, { holds: listHolds(sessionId) });
      }

      if (req.method === "POST" && url.pathname === "/api/channeling/holds/reserve") {
        const body = await readJsonBody(req);
        const channelSlotId = Number(body.channelSlotId);
        const sessionId = Number(body.sessionId);
        if (!Number.isFinite(channelSlotId) || channelSlotId <= 0) {
          return sendJson(res, 400, { message: "Valid channelSlotId is required." });
        }
        if (!Number.isFinite(sessionId) || sessionId <= 0) {
          return sendJson(res, 400, { message: "Valid sessionId is required." });
        }
        const reserved = reserveHold({
          channelSlotId,
          sessionId,
          holdToken: typeof body.holdToken === "string" ? body.holdToken.trim() : "",
          durationSeconds: body.durationSeconds,
          slotTime: typeof body.slotTime === "string" ? body.slotTime : "",
        });
        return sendJson(res, 200, reserved);
      }

      if (req.method === "POST" && url.pathname === "/api/channeling/holds/release") {
        const body = await readJsonBody(req);
        const channelSlotId = Number(body.channelSlotId);
        const holdToken =
          typeof body.holdToken === "string" ? body.holdToken.trim() : "";
        if (!Number.isFinite(channelSlotId) || channelSlotId <= 0 || !holdToken) {
          return sendJson(res, 400, {
            message: "channelSlotId and holdToken are required.",
          });
        }
        const result = releaseHold({
          channelSlotId,
          holdToken,
          slotTime: typeof body.slotTime === "string" ? body.slotTime : "",
          sessionId: Number(body.sessionId) || null,
        });
        return sendJson(res, 200, result);
      }

      return sendJson(res, 404, { message: "Not found." });
    } catch (err) {
      const status = Number(err?.status) || 500;
      return sendJson(res, status, {
        message: err?.message || "Hold request failed.",
        code: err?.code,
        expiresAt: err?.expiresAt,
      });
    }
  };
}
