/** User-facing copy — never expose raw API/technical errors in the UI. */
export const USER_MESSAGES = {
  loadFailed: "Unable to load data. Please try again later.",
  networkError:
    "We couldn't reach the server. Please check your connection and try again.",
  bookingFailed:
    "Unable to complete your booking. Please try another time slot or try again later.",
  contactFailed: "Unable to send your message. Please try again or call us directly.",
  reviewSubmitFailed: "Unable to submit your review. Please try again later.",
  profileNotFound:
    "No patient profile found. Check your mobile number or NIC and try again.",
  profileLoadFailed: "Unable to load your profile. Please try again later.",
  bookingSuccess: "Appointment booked successfully.",
  contactSuccess: "Message sent successfully.",
  reviewSubmitSuccess: "Review submitted for approval.",
  profileUpdateSuccess: "Profile updated successfully.",
  reviewApproved: "Review approved and published.",
  reviewRejected: "Review rejected.",
  reviewDeleted: "Review deleted.",
} as const;

export function getUserFacingLoadError(): string {
  return USER_MESSAGES.loadFailed;
}
