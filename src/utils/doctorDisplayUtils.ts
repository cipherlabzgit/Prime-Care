import type { ChannelingSession } from "../services/channelingService";
import { CHANNELING_API_ORIGIN } from "../services/channelingService";

type DoctorNameSource = Pick<ChannelingSession, "doctorName" | "fullName">;

export function getSessionDoctorName(session: DoctorNameSource): string {
  return session.doctorName?.trim() || session.fullName?.trim() || "Unknown Doctor";
}

export function formatDoctorDisplayName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "this doctor";
  if (/^dr\.?\s/i.test(trimmed)) return trimmed;
  return `Dr. ${trimmed}`;
}

export function hasQualification(qualification?: string | null): boolean {
  const trimmed = qualification?.trim();
  return Boolean(trimmed && trimmed.length > 0);
}

/** Returns trimmed qualification text, or null when absent — never a placeholder. */
export function getQualificationDisplay(
  qualification?: string | null,
): string | null {
  const trimmed = qualification?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

/** @deprecated Prefer getQualificationDisplay for UI that should hide empty rows */
export function formatQualificationDisplay(
  qualification?: string | null,
): string {
  return getQualificationDisplay(qualification) ?? "Qualification not available";
}

export function formatExperienceDisplay(experienceYears?: number | null): string | null {
  if (experienceYears == null || !Number.isFinite(experienceYears)) {
    return null;
  }
  return `${experienceYears} Years Experience`;
}

export function hasProfileSummary(profileSummary?: string | null): boolean {
  const trimmed = profileSummary?.trim();
  return Boolean(trimmed && trimmed.length > 0);
}

export function getProfileSummaryPreview(
  profileSummary?: string | null,
  maxLength = 120,
): string | null {
  const trimmed = profileSummary?.trim();
  if (!trimmed) return null;
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

type DoctorPhotoSource = {
  profileImage?: string | null;
  profilePhoto?: string | null;
};

/** ERP returns `/uploads/...`; public gateway serves files under `/api/channeling/public/uploads/...`. */
function normalizePublicUploadPath(path: string): string {
  if (path.startsWith("/api/channeling/public/uploads/")) {
    return path;
  }
  if (path.startsWith("/uploads/")) {
    return `/api/channeling/public${path}`;
  }
  return path;
}

export function getDoctorProfileImagePath(
  source?: DoctorPhotoSource | null,
): string | undefined {
  if (!source) return undefined;
  const path =
    source.profileImage?.trim() || source.profilePhoto?.trim() || undefined;
  return path;
}

export function resolveDoctorPhotoUrl(photo?: string | null): string | undefined {
  const trimmed = photo?.trim();
  if (!trimmed) return undefined;
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  const path = normalizePublicUploadPath(
    trimmed.startsWith("/") ? trimmed : `/${trimmed}`,
  );
  return `${CHANNELING_API_ORIGIN}${path}`;
}

export function hasProfilePhoto(photo?: string | null): boolean {
  return Boolean(resolveDoctorPhotoUrl(photo));
}

export function formatSlotsAvailable(count: number): string {
  if (count <= 0) return "No slots available";
  return `${count} Slot${count === 1 ? "" : "s"} Available`;
}

export type SlotAvailabilityTier = "none" | "low" | "medium" | "high";

export function getSlotAvailabilityTier(count: number): SlotAvailabilityTier {
  if (count <= 0) return "none";
  if (count <= 3) return "low";
  if (count <= 6) return "medium";
  return "high";
}
