export type ReviewStatus = "Pending" | "Approved" | "Rejected";

export type ReviewSortOption = "latest" | "highest" | "lowest";

export interface Review {
  reviewId: number;
  fullName: string;
  email?: string | null;
  rating: number;
  reviewText: string;
  location?: string | null;
  bookingReference?: string | null;
  mobileNumber?: string | null;
  status: ReviewStatus;
  createdDate: string;
  approvedDate?: string | null;
}

export interface SubmitReviewPayload {
  fullName: string;
  email?: string;
  rating: number;
  reviewText: string;
  location?: string;
  bookingReference: string;
  mobileNumber: string;
}

export interface SubmitReviewResponse {
  message: string;
  reviewId: number;
}

export interface VerifyBookingPayload {
  bookingReference: string;
  mobileNumber: string;
}

export interface VerifyBookingResponse {
  verified: boolean;
  bookingReference: string;
  patientName: string;
  message: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  patientsServed: number;
}
