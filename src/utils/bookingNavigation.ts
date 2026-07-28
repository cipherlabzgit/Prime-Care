export function getBookDoctorUrl(doctorId: number | string): string {
  return `/book?doctorId=${encodeURIComponent(String(doctorId))}`;
}
