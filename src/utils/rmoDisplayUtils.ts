import { formatDisplayDate, formatFee, formatTime } from "./channelingUtils";
import type { RmoBooking } from "../types/rmo";
import { getRmoStatusLabel } from "./rmoStatusUtils";

export function formatRmoBookingSummary(booking: RmoBooking): string {
  return `${booking.fullName} — ${formatTime(booking.doctorAppointmentTime)} with ${booking.doctorName}`;
}

export function rmoBookingDisplayFields(booking: RmoBooking) {
  return [
    { label: "Reference", value: booking.bookingReference },
    { label: "Status", value: getRmoStatusLabel(booking.rmoStatus) },
    { label: "Patient", value: booking.fullName },
    { label: "Mobile", value: booking.mobileNumber },
    { label: "NIC / Passport", value: booking.nicOrPassport || "—" },
    { label: "Date", value: formatDisplayDate(booking.sessionDate) },
    { label: "Arrive by", value: formatTime(booking.recommendedArrivalTime) },
    {
      label: "Doctor appointment",
      value: formatTime(booking.doctorAppointmentTime),
    },
    { label: "Doctor", value: booking.doctorName },
    { label: "Specialization", value: booking.specialization },
    { label: "Center", value: booking.centerName },
    { label: "Room", value: booking.roomCode },
    { label: "Consultation fee", value: formatFee(booking.consultationFee) },
  ];
}
