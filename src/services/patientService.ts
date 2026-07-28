import axios from "axios";
import type { ExistingPatientProfile, PatientFormData } from "../types/patient";
import { formatPhoneForLookup } from "../utils/patientValidation";
import { CHANNELING_API_ORIGIN } from "./channelingService";

const PATIENT_LOOKUP_URL = `${CHANNELING_API_ORIGIN}/api/channeling/public/patients/lookup`;

export interface PatientSearchParams {
  patientCode?: string;
  nic?: string;
  mobileNumber?: string;
}

interface ExistingPatientApi {
  patientRegistrationId?: number;
  registrationId?: number;
  id?: number;
  patientCode?: string;
  code?: string;
  fullName?: string;
  patientName?: string;
  name?: string;
  mobileNumber?: string;
  mobile?: string;
  phone?: string;
  nicOrPassport?: string;
  nic?: string;
  email?: string;
}

function trimOptional(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function normalizeExistingPatient(raw: ExistingPatientApi): ExistingPatientProfile | null {
  const registrationId =
    raw.patientRegistrationId ?? raw.registrationId ?? raw.id;
  if (registrationId == null || !Number.isFinite(registrationId)) {
    return null;
  }

  const fullName =
    trimOptional(raw.fullName) ??
    trimOptional(raw.patientName) ??
    trimOptional(raw.name);
  const mobileNumber =
    trimOptional(raw.mobileNumber) ??
    trimOptional(raw.mobile) ??
    trimOptional(raw.phone);
  const patientCode =
    trimOptional(raw.patientCode) ?? trimOptional(raw.code) ?? String(registrationId);

  if (!fullName || !mobileNumber) return null;

  return {
    registrationId,
    patientCode,
    fullName,
    mobileNumber,
    nic: trimOptional(raw.nicOrPassport) ?? trimOptional(raw.nic),
    email: trimOptional(raw.email),
  };
}

function unwrapPatientPayload(data: unknown): ExistingPatientApi[] {
  if (Array.isArray(data)) return data as ExistingPatientApi[];
  if (!data || typeof data !== "object") return [];

  const record = data as Record<string, unknown>;
  if (Array.isArray(record.data)) return record.data as ExistingPatientApi[];
  if (Array.isArray(record.value)) return record.value as ExistingPatientApi[];
  if (record.data && typeof record.data === "object") {
    return [record.data as ExistingPatientApi];
  }
  if (record.value && typeof record.value === "object") {
    return [record.value as ExistingPatientApi];
  }

  return [data as ExistingPatientApi];
}

export async function searchPatients(
  params: PatientSearchParams,
): Promise<ExistingPatientProfile[]> {
  const query: Record<string, string> = {};
  const nic = params.nic?.trim();
  const mobile = params.mobileNumber?.trim();

  if (nic) query.nic = nic;
  if (mobile) query.phone = formatPhoneForLookup(mobile);
  if (!query.nic && !query.phone) return [];

  const { data } = await axios.get(PATIENT_LOOKUP_URL, { params: query });
  return unwrapPatientPayload(data)
    .map(normalizeExistingPatient)
    .filter((patient): patient is ExistingPatientProfile => patient !== null);
}

export function existingPatientToFormData(
  profile: ExistingPatientProfile,
  notes = "",
): PatientFormData {
  return {
    fullName: profile.fullName,
    nic: profile.nic ?? "",
    phone: profile.mobileNumber,
    email: profile.email ?? "",
    notes,
    existingPatientRegistrationId: profile.registrationId,
    patientCode: profile.patientCode,
  };
}
