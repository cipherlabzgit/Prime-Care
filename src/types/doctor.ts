import type { DoctorAvailabilityStatus } from "../utils/doctorAvailability";

export interface DoctorProfile {
  doctorId: number;
  doctorName: string;
  /** @deprecated Use doctorName */
  fullName: string;
  designation?: string;
  qualification?: string;
  experienceYears?: number;
  slmcNumber?: string;
  profileSummary?: string;
  profilePhoto?: string;
  /** ERP public doctors API field */
  profileImage?: string;
  specialization: string;
  centers: string[];
  sessionCount: number;
  futureSessionCount: number;
  status?: string;
  isActive?: boolean;
  availabilityStatus: DoctorAvailabilityStatus;
}
