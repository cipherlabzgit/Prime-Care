import type { BookingFilters, Doctor, DoctorSession } from "../types/booking";
import { doctors } from "../data/bookingData";

export function getDoctorsForFilters(
  centerId: string,
  specializationId: string,
): Doctor[] {
  return doctors.filter((doctor) => {
    const matchesCenter = !centerId || doctor.centerIds.includes(centerId);
    const matchesSpec =
      !specializationId || doctor.specializationId === specializationId;
    return matchesCenter && matchesSpec;
  });
}

export function filterSessions(
  sessions: DoctorSession[],
  filters: BookingFilters,
): DoctorSession[] {
  return sessions.filter((session) => {
    if (filters.centerId && session.centerId !== filters.centerId) {
      return false;
    }
    if (filters.date && session.date !== filters.date) {
      return false;
    }
    if (filters.doctorId && session.doctorId !== filters.doctorId) {
      return false;
    }
    if (filters.specializationId) {
      const doctor = doctors.find((d) => d.id === session.doctorId);
      if (doctor?.specializationId !== filters.specializationId) {
        return false;
      }
    }
    return true;
  });
}
