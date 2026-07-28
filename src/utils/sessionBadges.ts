import type { ChannelingSession } from "../services/channelingService";

export type SessionBadgeType = "Available Today" | "Top Rated" | "Most Booked";

export function getSessionBadges(session: ChannelingSession): SessionBadgeType[] {
  const badges: SessionBadgeType[] = [];
  const today = new Date().toISOString().slice(0, 10);
  const sessionDate = session.sessionDate?.slice(0, 10);

  if (sessionDate === today) {
    badges.push("Available Today");
  }

  if (session.experienceYears != null && session.experienceYears >= 10) {
    badges.push("Top Rated");
  }

  const total = session.totalSlotCount ?? 0;
  if (total > 0 && session.availableSlotCount / total <= 0.35) {
    badges.push("Most Booked");
  }

  return badges.slice(0, 2);
}

export type AvailabilityLevel = "high" | "medium" | "none";

export function getAvailabilityLevel(session: ChannelingSession): AvailabilityLevel {
  if (session.availableSlotCount <= 0) return "none";
  const total = session.totalSlotCount ?? session.availableSlotCount;
  const ratio = session.availableSlotCount / total;
  if (ratio >= 0.5) return "high";
  return "medium";
}
