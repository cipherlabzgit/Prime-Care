import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { handleLandingEnquiry, validateLandingEnquiryBody } from "../../server/landingEnquiry.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveDataDir() {
  if (process.env.LANDING_ENQUIRY_DATA_DIR) {
    return process.env.LANDING_ENQUIRY_DATA_DIR;
  }
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), "premiercare-landing-data");
  }
  return path.join(__dirname, "../../server/data");
}

function ensureDataDir(dataDir) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const validation = validateLandingEnquiryBody(req.body);
  if (!validation.ok) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    const dataDir = resolveDataDir();
    ensureDataDir(dataDir);
    const result = await handleLandingEnquiry({
      dataDir,
      landingId: validation.landingId,
      fields: validation.fields,
    });
    return res.status(200).json({
      message: "Enquiry received.",
      emailed: result.emailed,
    });
  } catch (err) {
    console.error("[landing-enquiry]", err);
    return res.status(500).json({
      message: "We could not send your enquiry right now. Please try again.",
    });
  }
}
