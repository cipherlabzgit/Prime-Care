import { releaseHold } from "../../_lib/slotHolds.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const body = req.body ?? {};
    const channelSlotId = Number(body.channelSlotId);
    const holdToken =
      typeof body.holdToken === "string" ? body.holdToken.trim() : "";

    if (!Number.isFinite(channelSlotId) || channelSlotId <= 0 || !holdToken) {
      return res.status(400).json({
        message: "channelSlotId and holdToken are required.",
      });
    }

    const result = releaseHold({
      channelSlotId,
      holdToken,
      slotTime: typeof body.slotTime === "string" ? body.slotTime : "",
      sessionId: Number(body.sessionId) || null,
    });
    return res.status(200).json(result);
  } catch (err) {
    const status = Number(err?.status) || 500;
    return res.status(status).json({
      message: err?.message || "Hold release failed.",
    });
  }
}
