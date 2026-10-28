import axios from "axios";
import type {
  PublicBookingLookupResponse,
  ResendBookingSmsResponse,
} from "../types/myBooking";

const PUBLIC_BOOKINGS_BASE =
  (import.meta.env.VITE_MY_BOOKINGS_API_BASE as string | undefined)?.trim() ||
  "";

const LOOKUP_URL = `${PUBLIC_BOOKINGS_BASE}/api/channeling/public/bookings/lookup`;
const RESEND_SMS_URL = `${PUBLIC_BOOKINGS_BASE}/api/channeling/public/bookings/resend-sms`;

export async function lookupMyBooking(params: {
  bookingReference: string;
  mobileNumber: string;
}): Promise<PublicBookingLookupResponse> {
  const { data } = await axios.get<PublicBookingLookupResponse>(LOOKUP_URL, {
    params: {
      bookingReference: params.bookingReference.trim(),
      mobileNumber: params.mobileNumber.trim(),
    },
  });
  return data;
}

export async function resendBookingSms(params: {
  bookingReference: string;
  mobileNumber: string;
}): Promise<ResendBookingSmsResponse> {
  const { data } = await axios.post<ResendBookingSmsResponse>(RESEND_SMS_URL, {
    bookingReference: params.bookingReference.trim(),
    mobileNumber: params.mobileNumber.trim(),
  });
  return data;
}
