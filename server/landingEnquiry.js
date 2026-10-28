import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

const DEFAULT_TO = "rmo01pcic@gmail.com";

const LANDING_LABELS = {
  "child-development": "Child Development",
  "physical-health": "Physical Health",
  "mental-wellbeing": "Mental Wellbeing",
  "integrative-health": "Integrative Health",
  nutrition: "Nutrition",
};

const LANDING_SUBJECTS = {
  "child-development": "Child Development Landing Page Enquiry",
  "physical-health": "Physical Health Landing Page Enquiry",
  "mental-wellbeing": "Mental Wellbeing Landing Page Enquiry",
  "integrative-health": "Integrative Health Landing Page Enquiry",
  nutrition: "Nutrition Landing Page Enquiry",
};

const FIELD_LABELS = {
  parentName: "Parent / Guardian Name",
  childAge: "Child's Age",
  name: "Name",
  helpWith: "What would you like help with?",
  concern: "Concern / details",
  goals: "What would you like to achieve?",
  duration: "How long have you been experiencing this issue?",
  urgency: "How soon are you looking for support?",
  phone: "WhatsApp / Mobile Number",
  email: "Email",
};

function getEnquiriesFile(dataDir) {
  return path.join(dataDir, "landing-enquiries.json");
}

function appendEnquiryRecord(dataDir, record) {
  const file = getEnquiriesFile(dataDir);
  let list = [];
  if (fs.existsSync(file)) {
    try {
      list = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      list = [];
    }
  }
  list.push(record);
  fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf8");
}

function buildMailBody(landingId, fields) {
  const label = LANDING_LABELS[landingId] ?? landingId;
  const lines = [`Landing page: ${label}`, `Submitted: ${new Date().toISOString()}`, ""];
  for (const [key, value] of Object.entries(fields)) {
    if (!value) continue;
    const fieldLabel = FIELD_LABELS[key] ?? key;
    lines.push(`${fieldLabel}: ${value}`);
  }
  return lines.join("\n");
}

function createTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return null;
  }
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function handleLandingEnquiry({ dataDir, landingId, fields }) {
  const sanitizedFields = {};
  for (const [key, value] of Object.entries(fields ?? {})) {
    if (typeof value !== "string") continue;
    sanitizedFields[key] = value.trim().slice(0, 4000);
  }

  const record = {
    id: `le-${Date.now()}`,
    landingId,
    fields: sanitizedFields,
    createdAt: new Date().toISOString(),
  };
  appendEnquiryRecord(dataDir, record);

  const to = process.env.LANDING_ENQUIRY_TO || DEFAULT_TO;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@premiercare.lk";
  const transport = createTransport();

  if (!transport) {
    console.warn(
      "[landing-enquiry] SMTP not configured — enquiry saved to landing-enquiries.json only.",
    );
    return { emailed: false, saved: true };
  }

  const label = LANDING_LABELS[landingId] ?? landingId;
  const subject =
    LANDING_SUBJECTS[landingId] ?? `Premier Care — ${label} enquiry`;
  await transport.sendMail({
    from,
    to,
    subject: `Premier Care — ${subject}`,
    text: buildMailBody(landingId, sanitizedFields),
  });

  return { emailed: true, saved: true };
}

export function validateLandingEnquiryBody(body) {
  const landingId = typeof body?.landingId === "string" ? body.landingId.trim() : "";
  const fields = body?.fields;
  if (!landingId || !LANDING_LABELS[landingId]) {
    return { ok: false, message: "Invalid landing page." };
  }
  if (!fields || typeof fields !== "object") {
    return { ok: false, message: "Form data is required." };
  }
  const phone = String(fields.phone ?? "").trim();
  if (!phone) {
    return { ok: false, message: "WhatsApp / mobile number is required." };
  }
  return { ok: true, landingId, fields };
}
