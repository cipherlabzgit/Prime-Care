/** Minutes spent at RMO for new-patient case taking. */
export const RMO_CASE_TAKING_MINUTES = 15;

/** Extra buffer before case taking (queue, walk to RMO desk). */
export const RMO_ARRIVAL_BUFFER_MINUTES = 5;

/** RMO case-taking fee charged for first-time patients. */
export const RMO_CONSULTATION_FEE = 2500;

export interface BookingFeeBreakdown {
  consultationFee: number;
  rmoFee: number;
  total: number;
}

export function calculateBookingFees(
  consultationFee: number,
  requiresRmoFee: boolean,
): BookingFeeBreakdown {
  const rmoFee = requiresRmoFee ? RMO_CONSULTATION_FEE : 0;
  return {
    consultationFee,
    rmoFee,
    total: consultationFee + rmoFee,
  };
}

export interface RmoCaseTakingInfo {
  requiresRmoCaseTaking: boolean;
  rmoCaseTakingMinutes: number;
  doctorAppointmentTime: string;
  recommendedArrivalTime: string;
}

export interface RmoCaseTakingApiFields {
  requiresRmoCaseTaking?: boolean;
  rmoCaseTakingMinutes?: number;
  doctorAppointmentTime?: string;
  recommendedArrivalTime?: string;
}

function parseTimeToMinutes(time: string): number | null {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return hours * 60 + minutes;
}

function formatMinutesToTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function subtractMinutesFromTime(
  time: string,
  minutes: number,
): string | null {
  const base = parseTimeToMinutes(time);
  if (base == null) return null;
  return formatMinutesToTime(base - minutes);
}

export function isNewPatientBooking(
  profileLinked: boolean,
  existingPatientRegistrationId?: number,
): boolean {
  return !profileLinked && existingPatientRegistrationId == null;
}

/** Show RMO/Reception notice only for confirmed new patients, not returning ones. */
export function shouldShowNewPatientRmoNotice(options: {
  profileLinked: boolean;
  existingPatientRegistrationId?: number;
  detectedPatient: { registrationId: number } | null;
}): boolean {
  if (options.profileLinked || options.existingPatientRegistrationId != null) {
    return false;
  }
  if (options.detectedPatient) {
    return false;
  }
  return true;
}

export function resolveRmoCaseTakingInfo(options: {
  isNewPatient: boolean;
  doctorAppointmentTime: string;
  apiFields?: RmoCaseTakingApiFields;
}): RmoCaseTakingInfo | null {
  if (!options.isNewPatient) return null;

  const api = options.apiFields;
  if (api?.requiresRmoCaseTaking === false) return null;

  const rmoMinutes = api?.rmoCaseTakingMinutes ?? RMO_CASE_TAKING_MINUTES;
  const doctorTime = api?.doctorAppointmentTime ?? options.doctorAppointmentTime;

  const recommendedArrivalTime =
    api?.recommendedArrivalTime ??
    subtractMinutesFromTime(
      doctorTime,
      rmoMinutes + RMO_ARRIVAL_BUFFER_MINUTES,
    ) ??
    subtractMinutesFromTime(doctorTime, rmoMinutes) ??
    doctorTime;

  return {
    requiresRmoCaseTaking: true,
    rmoCaseTakingMinutes: rmoMinutes,
    doctorAppointmentTime: doctorTime,
    recommendedArrivalTime,
  };
}
