export const CHANNELING_BOOKING_URL = "/channeling#channeling-booking";
export const MY_BOOKINGS_URL = "/my-bookings";

export function getBookDoctorUrl(doctorId: number | string): string {
  return `/channeling?doctorId=${encodeURIComponent(String(doctorId))}#doctor-sessions`;
}
