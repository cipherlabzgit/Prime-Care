export interface PatientFormData {
  title: string;
  firstName: string;
  lastName: string;
  nic: string;
  phone: string;
  email: string;
  notes: string;
  existingPatientRegistrationId?: number;
  patientCode?: string;
}

export interface ExistingPatientProfile {
  registrationId: number;
  patientCode: string;
  fullName: string;
  mobileNumber: string;
  nic?: string;
  email?: string;
}

export type PatientFormErrors = Partial<Record<keyof PatientFormData, string>>;

/** Split a stored full name into first + remaining last name parts. */
export function splitPatientFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

/** Display / API name: "Mr. First Last" (title optional). */
export function getPatientFullName(
  patient: Pick<PatientFormData, "title" | "firstName" | "lastName">,
): string {
  return [patient.title, patient.firstName, patient.lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
