import axios from "axios";
import type { ExistingPatientProfile } from "../types/patient";
import { formatMobileForApi } from "../utils/patientValidation";

const AUTH_BASE =
  (import.meta.env.VITE_PATIENT_AUTH_API_BASE as string | undefined)?.trim() ||
  "";

const REQUEST_OTP_URL = `${AUTH_BASE}/api/channeling/public/auth/otp/request`;
const VERIFY_OTP_URL = `${AUTH_BASE}/api/channeling/public/auth/otp/verify`;
const SESSION_URL = `${AUTH_BASE}/api/channeling/public/auth/session`;
const LOGOUT_URL = `${AUTH_BASE}/api/channeling/public/auth/logout`;

export const PATIENT_SESSION_STORAGE_KEY = "premiercare.patientSession";

export interface PatientAuthSession {
  sessionToken: string;
  expiresAt: string;
  patient: ExistingPatientProfile;
  mobileNumber: string;
}

export interface OtpRequestResult {
  sent: boolean;
  mobileNumberMasked: string;
  expiresInSeconds: number;
  devOtp?: string;
  message: string;
}

export interface OtpVerifyResult {
  verified: boolean;
  sessionToken: string;
  expiresAt: string;
  mobileNumberMasked: string;
  patient: ExistingPatientProfile;
  profileFound: boolean;
  message: string;
}

function normalizePatient(raw: Partial<ExistingPatientProfile> & {
  registrationId?: number;
}): ExistingPatientProfile | null {
  if (raw.registrationId == null || !Number.isFinite(raw.registrationId)) {
    return null;
  }
  if (!raw.fullName?.trim() || !raw.mobileNumber?.trim()) return null;
  return {
    registrationId: raw.registrationId,
    patientCode: raw.patientCode?.trim() || String(raw.registrationId),
    fullName: raw.fullName.trim(),
    mobileNumber: formatMobileForApi(raw.mobileNumber),
    nic: raw.nic?.trim() || undefined,
    email: raw.email?.trim() || undefined,
  };
}

export function readStoredPatientSession(): PatientAuthSession | null {
  try {
    const raw = localStorage.getItem(PATIENT_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PatientAuthSession;
    if (!parsed?.sessionToken || !parsed?.expiresAt || !parsed?.patient) {
      return null;
    }
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(PATIENT_SESSION_STORAGE_KEY);
      return null;
    }
    const patient = normalizePatient(parsed.patient);
    if (!patient) {
      localStorage.removeItem(PATIENT_SESSION_STORAGE_KEY);
      return null;
    }
    return {
      sessionToken: parsed.sessionToken,
      expiresAt: parsed.expiresAt,
      mobileNumber: formatMobileForApi(parsed.mobileNumber || patient.mobileNumber),
      patient,
    };
  } catch {
    return null;
  }
}

export function writeStoredPatientSession(session: PatientAuthSession): void {
  localStorage.setItem(PATIENT_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredPatientSession(): void {
  localStorage.removeItem(PATIENT_SESSION_STORAGE_KEY);
}

export async function requestPatientOtp(
  mobileNumber: string,
): Promise<OtpRequestResult> {
  const { data } = await axios.post<OtpRequestResult>(REQUEST_OTP_URL, {
    mobileNumber: formatMobileForApi(mobileNumber),
  });
  return data;
}

export async function verifyPatientOtp(params: {
  mobileNumber: string;
  code: string;
}): Promise<OtpVerifyResult> {
  const { data } = await axios.post<OtpVerifyResult>(VERIFY_OTP_URL, {
    mobileNumber: formatMobileForApi(params.mobileNumber),
    code: params.code.trim(),
  });
  return data;
}

export async function fetchPatientSession(
  sessionToken: string,
): Promise<PatientAuthSession | null> {
  try {
    const { data } = await axios.get<{
      sessionToken: string;
      expiresAt: string;
      patient: ExistingPatientProfile;
    }>(SESSION_URL, {
      params: { token: sessionToken },
      headers: { "x-patient-session": sessionToken },
    });
    const patient = normalizePatient(data.patient);
    if (!patient) return null;
    return {
      sessionToken: data.sessionToken,
      expiresAt: data.expiresAt,
      mobileNumber: patient.mobileNumber,
      patient,
    };
  } catch {
    return null;
  }
}

export async function logoutPatientSession(sessionToken: string): Promise<void> {
  try {
    await axios.post(LOGOUT_URL, { sessionToken });
  } catch {
    // Local sign-out still proceeds.
  }
}
