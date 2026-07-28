import type { ChannelingSession } from "../services/channelingService";
import type { DoctorProfile } from "../types/doctor";
import { resolveDoctorAvailability } from "./doctorAvailability";
import { getSessionDoctorName } from "./doctorDisplayUtils";

export interface ChannelingFilters {
  centerName: string;
  specialization: string;
  date: string;
  doctorId: string;
}

export function sessionDateKey(sessionDate: string): string {
  return sessionDate.slice(0, 10);
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const h = parseInt(hours, 10);
  const m = minutes?.slice(0, 2) ?? "00";
  if (Number.isNaN(h)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m} ${period}`;
}

export function formatFee(amount: number): string {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}

export function formatDisplayDate(isoDate: string): string {
  const key = sessionDateKey(isoDate);
  return new Date(`${key}T12:00:00`).toLocaleDateString("en-LK", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function uniqueCenters(sessions: ChannelingSession[]): string[] {
  return [...new Set(sessions.map((s) => s.centerName))].sort();
}

export function uniqueSpecializations(sessions: ChannelingSession[]): string[] {
  return [...new Set(sessions.map((s) => s.specialization))].sort();
}

export function uniqueDoctors(
  sessions: ChannelingSession[],
): {
  doctorId: number;
  fullName: string;
  designation?: string;
  qualification?: string;
  experienceYears?: number;
  profileSummary?: string;
  profilePhoto?: string;
}[] {
  const map = new Map<
    number,
    {
      fullName: string;
      designation?: string;
      qualification?: string;
      experienceYears?: number;
      profileSummary?: string;
      profilePhoto?: string;
    }
  >();

  const pickString = (
    current?: string,
    incoming?: string,
  ): string | undefined => {
    const next = incoming?.trim();
    if (next) return next;
    return current;
  };

  const pickNumber = (
    current?: number,
    incoming?: number,
  ): number | undefined => {
    if (incoming != null) return incoming;
    return current;
  };

  for (const s of sessions) {
    const name = getSessionDoctorName(s);
    const existing = map.get(s.doctorId);
    if (!existing) {
      map.set(s.doctorId, {
        fullName: name,
        designation: s.designation,
        qualification: s.qualification,
        experienceYears: s.experienceYears,
        profileSummary: s.profileSummary,
        profilePhoto: s.profilePhoto,
      });
      continue;
    }

    map.set(s.doctorId, {
      fullName: name || existing.fullName,
      designation: pickString(existing.designation, s.designation),
      qualification: pickString(existing.qualification, s.qualification),
      experienceYears: pickNumber(existing.experienceYears, s.experienceYears),
      profileSummary: pickString(existing.profileSummary, s.profileSummary),
      profilePhoto: pickString(existing.profilePhoto, s.profilePhoto),
    });
  }
  return [...map.entries()]
    .map(([doctorId, details]) => ({ doctorId, ...details }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

function applyPartialFilters(
  sessions: ChannelingSession[],
  centerName: string,
  specialization: string,
  doctorId: string,
): ChannelingSession[] {
  return sessions.filter((session) => {
    if (centerName && session.centerName !== centerName) return false;
    if (specialization && session.specialization !== specialization) {
      return false;
    }
    if (doctorId && String(session.doctorId) !== doctorId) return false;
    return true;
  });
}

export function getSpecializationsForFilters(
  sessions: ChannelingSession[],
  centerName: string,
  doctorId: string,
): string[] {
  const filtered = applyPartialFilters(sessions, centerName, "", doctorId);
  return uniqueSpecializations(filtered);
}

export function getDoctorsForFilters(
  sessions: ChannelingSession[],
  centerName: string,
  specialization: string,
): {
  doctorId: number;
  fullName: string;
  designation?: string;
  qualification?: string;
  experienceYears?: number;
  profileSummary?: string;
}[] {
  return uniqueDoctors(
    applyPartialFilters(sessions, centerName, specialization, ""),
  );
}

export function getDatesForFilters(
  sessions: ChannelingSession[],
  centerName: string,
  specialization: string,
  doctorId: string,
): string[] {
  const filtered = applyPartialFilters(
    sessions,
    centerName,
    specialization,
    doctorId,
  );
  return uniqueSessionDates(filtered);
}

export function deriveDoctorsFromSessions(
  sessions: ChannelingSession[],
): DoctorProfile[] {
  const map = new Map<
    number,
    DoctorProfile & { centerSet: Set<string> }
  >();

  const pickString = (
    current?: string,
    incoming?: string,
  ): string | undefined => {
    const next = incoming?.trim();
    if (next) return next;
    return current;
  };

  const pickNumber = (
    current?: number,
    incoming?: number,
  ): number | undefined => {
    if (incoming != null) return incoming;
    return current;
  };

  for (const session of sessions) {
    const name = getSessionDoctorName(session);
    const sessionDay = sessionDateKey(session.sessionDate);
    const todayKey = sessionDateKey(new Date().toISOString());
    const isFuture = sessionDay >= todayKey;
    const imagePath = session.profileImage ?? session.profilePhoto;
    const existing = map.get(session.doctorId);
    if (!existing) {
      map.set(session.doctorId, {
        doctorId: session.doctorId,
        doctorName: name,
        fullName: name,
        designation: session.designation,
        qualification: session.qualification,
        experienceYears: session.experienceYears,
        slmcNumber: session.slmcNumber,
        profileSummary: session.profileSummary,
        profilePhoto: imagePath,
        profileImage: imagePath,
        specialization: session.specialization,
        status: session.doctorStatus,
        isActive: session.isDoctorActive,
        centers: [],
        sessionCount: 1,
        futureSessionCount: isFuture ? 1 : 0,
        availabilityStatus: "no-sessions",
        centerSet: new Set([session.centerName]),
      });
      continue;
    }

    existing.sessionCount += 1;
    if (isFuture) existing.futureSessionCount += 1;
    existing.centerSet.add(session.centerName);
    existing.doctorName = name;
    existing.fullName = name;
    existing.designation = pickString(existing.designation, session.designation);
    existing.qualification = pickString(
      existing.qualification,
      session.qualification,
    );
    existing.experienceYears = pickNumber(
      existing.experienceYears,
      session.experienceYears,
    );
    existing.slmcNumber = pickString(existing.slmcNumber, session.slmcNumber);
    existing.profileSummary = pickString(
      existing.profileSummary,
      session.profileSummary,
    );
    const nextImage = pickString(imagePath, existing.profilePhoto);
    existing.profilePhoto = nextImage;
    existing.profileImage = nextImage;
    existing.status = pickString(existing.status, session.doctorStatus);
    if (session.isDoctorActive != null) {
      existing.isActive = session.isDoctorActive;
    }
    existing.specialization = session.specialization;
  }

  return [...map.values()]
    .map(({ centerSet, ...doctor }) => ({
      ...doctor,
      centers: [...centerSet].sort(),
      availabilityStatus: resolveDoctorAvailability(
        doctor.status,
        doctor.isActive,
        doctor.futureSessionCount,
      ),
    }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export function uniqueSessionDates(sessions: ChannelingSession[]): string[] {
  return [...new Set(sessions.map((s) => sessionDateKey(s.sessionDate)))].sort();
}

export function filterSessions(
  sessions: ChannelingSession[],
  filters: ChannelingFilters,
): ChannelingSession[] {
  return sessions.filter((session) => {
    if (filters.centerName && session.centerName !== filters.centerName) {
      return false;
    }
    if (
      filters.specialization &&
      session.specialization !== filters.specialization
    ) {
      return false;
    }
    if (filters.date && sessionDateKey(session.sessionDate) !== filters.date) {
      return false;
    }
    if (filters.doctorId && String(session.doctorId) !== filters.doctorId) {
      return false;
    }
    return true;
  });
}
