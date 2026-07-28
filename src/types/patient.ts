export interface PatientFormData {
  fullName: string;
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
