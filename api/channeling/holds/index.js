import { listHolds } from "../../_lib/slotHolds.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const sessionId = req.query?.sessionId ? Number(req.query.sessionId) : null;
  return res.status(200).json({ holds: listHolds(sessionId) });
}
