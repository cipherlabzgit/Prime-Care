import { reserveHold } from "../../_lib/slotHolds.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const body = req.body ?? {};
    const channelSlotId = Number(body.channelSlotId);
    const sessionId = Number(body.sessionId);

    if (!Number.isFinite(channelSlotId) || channelSlotId <= 0) {
      return res.status(400).json({ message: "Valid channelSlotId is required." });
    }
    if (!Number.isFinite(sessionId) || sessionId <= 0) {
      return res.status(400).json({ message: "Valid sessionId is required." });
    }

    const reserved = reserveHold({
      channelSlotId,
      sessionId,
      holdToken: typeof body.holdToken === "string" ? body.holdToken.trim() : "",
      durationSeconds: body.durationSeconds,
      slotTime: typeof body.slotTime === "string" ? body.slotTime : "",
    });
    return res.status(200).json(reserved);
  } catch (err) {
    const status = Number(err?.status) || 500;
    return res.status(status).json({
      message: err?.message || "Hold request failed.",
      code: err?.code,
      expiresAt: err?.expiresAt,
    });
  }
}
