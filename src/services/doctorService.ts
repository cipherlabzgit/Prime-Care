import axios from "axios";
import type { ChannelingSession } from "./channelingService";
import { CHANNELING_API_ORIGIN } from "./channelingService";
import type { DoctorProfile } from "../types/doctor";
import { deriveDoctorsFromSessions } from "../utils/channelingUtils";
import { resolveDoctorAvailability } from "../utils/doctorAvailability";
import { getSessionDoctorName } from "../utils/doctorDisplayUtils";

const PUBLIC_DOCTORS_URL = `${CHANNELING_API_ORIGIN}/api/channeling/public/doctors`;

export interface PublicDoctorApi {
  doctorId: number;
  doctorName?: string | null;
  fullName?: string | null;
  designation?: string | null;
  specialization?: string | null;
  qualification?: string | null;
  experienceYears?: number | null;
  profileSummary?: string | null;
  slmcNumber?: string | null;
  profileImage?: string | null;
  profileImagePath?: string | null;
  profilePhoto?: string | null;
  profilePhotoUrl?: string | null;
  photoUrl?: string | null;
  status?: string | null;
  doctorStatus?: string | null;
  isActive?: boolean | null;
  isDoctorActive?: boolean | null;
}

function trimOptional(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function normalizeOptionalNumber(value?: number | null): number | undefined {
  if (value == null || !Number.isFinite(value)) return undefined;
  return value;
}

function resolveApiProfileImage(raw: PublicDoctorApi): string | undefined {
  return (
    trimOptional(raw.profileImage) ??
    trimOptional(raw.profileImagePath) ??
    trimOptional(raw.profilePhoto) ??
    trimOptional(raw.profilePhotoUrl) ??
    trimOptional(raw.photoUrl)
  );
}

function normalizePublicDoctor(raw: PublicDoctorApi): Omit<
  DoctorProfile,
  "centers" | "sessionCount" | "futureSessionCount" | "availabilityStatus"
> {
  const doctorName =
    trimOptional(raw.doctorName) ??
    trimOptional(raw.fullName) ??
    "Unknown Doctor";
  const imagePath = resolveApiProfileImage(raw);
  const status =
    trimOptional(raw.doctorStatus) ?? trimOptional(raw.status);
  const isActive = raw.isDoctorActive ?? raw.isActive ?? undefined;

  return {
    doctorId: raw.doctorId,
    doctorName,
    fullName: doctorName,
    designation: trimOptional(raw.designation),
    qualification: trimOptional(raw.qualification),
    experienceYears: normalizeOptionalNumber(raw.experienceYears),
    slmcNumber: trimOptional(raw.slmcNumber),
    profileSummary: trimOptional(raw.profileSummary),
    profilePhoto: imagePath,
    profileImage: imagePath,
    specialization: trimOptional(raw.specialization) ?? "-",
    status,
    isActive,
  };
}

function normalizePublicDoctors(
  data:
    | PublicDoctorApi[]
    | { value?: PublicDoctorApi[]; data?: PublicDoctorApi[] },
): ReturnType<typeof normalizePublicDoctor>[] {
  let raw: PublicDoctorApi[] = [];
  if (Array.isArray(data)) raw = data;
  else if (data && Array.isArray(data.data)) raw = data.data;
  else if (data && Array.isArray(data.value)) raw = data.value;
  return raw.map(normalizePublicDoctor);
}

export async function fetchPublicDoctors(): Promise<
  ReturnType<typeof normalizePublicDoctor>[]
> {
  const { data } = await axios.get<
    PublicDoctorApi[] | { value?: PublicDoctorApi[]; data?: PublicDoctorApi[] }
  >(PUBLIC_DOCTORS_URL);
  return normalizePublicDoctors(data);
}

interface SessionDoctorStats {
  centers: Set<string>;
  sessionCount: number;
  futureSessionCount: number;
  profilePhoto?: string;
  profileImage?: string;
  status?: string;
  isActive?: boolean;
  designation?: string;
  qualification?: string;
  experienceYears?: number;
  slmcNumber?: string;
  profileSummary?: string;
  specialization?: string;
  doctorName?: string;
}

function buildSessionStats(
  sessions: ChannelingSession[],
): Map<number, SessionDoctorStats> {
  const map = new Map<number, SessionDoctorStats>();

  for (const session of sessions) {
    const existing = map.get(session.doctorId);
    const isFuture = isFutureSessionFromSession(session);

    if (!existing) {
      map.set(session.doctorId, {
        centers: new Set([session.centerName]),
        sessionCount: 1,
        futureSessionCount: isFuture ? 1 : 0,
        profilePhoto: session.profilePhoto ?? session.profileImage,
        profileImage: session.profileImage ?? session.profilePhoto,
        status: session.doctorStatus,
        isActive: session.isDoctorActive,
        designation: session.designation,
        qualification: session.qualification,
        experienceYears: session.experienceYears,
        slmcNumber: session.slmcNumber,
        profileSummary: session.profileSummary,
        specialization: session.specialization,
        doctorName: getSessionDoctorName(session),
      });
      continue;
    }

    existing.sessionCount += 1;
    if (isFuture) existing.futureSessionCount += 1;
    existing.centers.add(session.centerName);
    if (session.profileImage ?? session.profilePhoto) {
      existing.profileImage = session.profileImage ?? session.profilePhoto;
      existing.profilePhoto = session.profilePhoto ?? session.profileImage;
    }
    if (session.doctorStatus) existing.status = session.doctorStatus;
    if (session.isDoctorActive != null) {
      existing.isActive = session.isDoctorActive;
    }
    existing.doctorName = getSessionDoctorName(session);
  }

  return map;
}

function isFutureSessionFromSession(session: ChannelingSession): boolean {
  const key = session.sessionDate.slice(0, 10);
  const todayKey = new Date().toISOString().slice(0, 10);
  return key >= todayKey;
}

function pickString(
  current?: string,
  incoming?: string,
): string | undefined {
  const next = incoming?.trim();
  if (next) return next;
  return current;
}

export function buildDoctorDirectory(
  sessions: ChannelingSession[],
  apiDoctors: ReturnType<typeof normalizePublicDoctor>[] = [],
): DoctorProfile[] {
  const sessionStats = buildSessionStats(sessions);

  const source =
    apiDoctors.length > 0
      ? apiDoctors
      : deriveDoctorsFromSessions(sessions).map((doctor) => ({
          doctorId: doctor.doctorId,
          doctorName: doctor.doctorName,
          fullName: doctor.fullName,
          designation: doctor.designation,
          qualification: doctor.qualification,
          experienceYears: doctor.experienceYears,
          slmcNumber: doctor.slmcNumber,
          profileSummary: doctor.profileSummary,
          profilePhoto: doctor.profilePhoto,
          profileImage: doctor.profileImage ?? doctor.profilePhoto,
          specialization: doctor.specialization,
          status: doctor.status,
          isActive: doctor.isActive,
        }));

  const profiles = source.map((doctor) => {
    const stats = sessionStats.get(doctor.doctorId);
    const centers = stats ? [...stats.centers].sort() : [];
    const sessionCount = stats?.sessionCount ?? 0;
    const futureSessionCount = stats?.futureSessionCount ?? 0;
    const status = pickString(doctor.status, stats?.status);
    const isActive = doctor.isActive ?? stats?.isActive;
    const profileImage = pickString(
      doctor.profileImage ?? doctor.profilePhoto,
      stats?.profileImage ?? stats?.profilePhoto,
    );

    return {
      doctorId: doctor.doctorId,
      doctorName: pickString(doctor.doctorName, stats?.doctorName) ?? doctor.doctorName,
      fullName: pickString(doctor.fullName, stats?.doctorName) ?? doctor.fullName,
      designation: pickString(doctor.designation, stats?.designation),
      qualification: pickString(doctor.qualification, stats?.qualification),
      experienceYears: doctor.experienceYears ?? stats?.experienceYears,
      slmcNumber: pickString(doctor.slmcNumber, stats?.slmcNumber),
      profileSummary: pickString(doctor.profileSummary, stats?.profileSummary),
      profilePhoto: profileImage,
      profileImage,
      specialization:
        pickString(doctor.specialization, stats?.specialization) ??
        doctor.specialization,
      status,
      isActive,
      centers,
      sessionCount,
      futureSessionCount,
      availabilityStatus: resolveDoctorAvailability(
        status,
        isActive,
        futureSessionCount,
      ),
    } satisfies DoctorProfile;
  });

  return profiles.sort((a, b) => a.doctorName.localeCompare(b.doctorName));
}
