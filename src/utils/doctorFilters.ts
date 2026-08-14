import type { ChannelingSession } from "../services/channelingService";
import type { DoctorProfile } from "../types/doctor";
import type { DoctorFiltersState } from "../types/doctorFilters";
import type { DoctorAvailabilityStatus } from "./doctorAvailability";
import { uniqueCenters, uniqueSpecializations } from "./channelingUtils";
import { getSessionDoctorName } from "./doctorDisplayUtils";

export const AVAILABILITY_FILTER_OPTIONS: {
  value: DoctorAvailabilityStatus;
  label: string;
}[] = [
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
  { value: "no-sessions", label: "No Sessions" },
];

export interface DoctorFilterOptions {
  centers: string[];
  specializations: string[];
}

function isUsableFilterLabel(value: string | undefined): value is string {
  return Boolean(value) && value !== "-";
}

export function deriveDoctorFilterOptions(
  doctors: DoctorProfile[],
  sessions: ChannelingSession[],
  catalog: string[] = [],
): DoctorFilterOptions {
  const centersFromSessions = uniqueCenters(sessions);
  const centersFromDoctors = [
    ...new Set(doctors.flatMap((doctor) => doctor.centers)),
  ].sort();
  const centers =
    centersFromSessions.length > 0
      ? centersFromSessions
      : centersFromDoctors;

  const specsFromSessions = uniqueSpecializations(sessions);
  const specsFromDoctors = doctors.map((doctor) => doctor.specialization);
  const specializations = [
    ...new Set(
      [...catalog, ...specsFromDoctors, ...specsFromSessions].filter(
        isUsableFilterLabel,
      ),
    ),
  ].sort((a, b) => a.localeCompare(b));

  return { centers, specializations };
}

export function countActiveDoctorFilters(filters: DoctorFiltersState): number {
  let count =
    filters.centers.length +
    filters.specializations.length +
    filters.availability.length;
  if (filters.searchQuery.trim()) count += 1;
  return count;
}

export function hasActiveDoctorFilters(filters: DoctorFiltersState): boolean {
  return countActiveDoctorFilters(filters) > 0;
}

function matchesSearch(doctor: DoctorProfile, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const name = getSessionDoctorName(doctor).toLowerCase();
  const qualification = doctor.qualification?.toLowerCase() ?? "";
  const specialization = doctor.specialization.toLowerCase();

  return (
    name.includes(normalized) ||
    qualification.includes(normalized) ||
    specialization.includes(normalized)
  );
}

export function filterDoctors(
  doctors: DoctorProfile[],
  filters: DoctorFiltersState,
): DoctorProfile[] {
  return doctors.filter((doctor) => {
    if (filters.centers.length > 0) {
      const hasCenter = doctor.centers.some((center) =>
        filters.centers.includes(center),
      );
      if (!hasCenter) return false;
    }

    if (filters.specializations.length > 0) {
      if (!filters.specializations.includes(doctor.specialization)) {
        return false;
      }
    }

    if (filters.availability.length > 0) {
      if (!filters.availability.includes(doctor.availabilityStatus)) {
        return false;
      }
    }

    return matchesSearch(doctor, filters.searchQuery);
  });
}

export function getDoctorResultsLabel(
  total: number,
  filtered: number,
  filtersActive: boolean,
): string {
  const noun = filtered === 1 ? "Doctor" : "Doctors";
  if (!filtersActive) {
    return `Showing ${total} ${noun}`;
  }
  return `Showing ${filtered} ${noun} matching filters`;
}

export function toggleFilterValue<T extends string>(
  values: T[],
  value: T,
): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}
