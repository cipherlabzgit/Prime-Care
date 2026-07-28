import axios from "axios";
import type {
  Review,
  ReviewStats,
  SubmitReviewPayload,
  SubmitReviewResponse,
  VerifyBookingPayload,
  VerifyBookingResponse,
} from "../types/review";

const REVIEWS_API_BASE = import.meta.env.VITE_REVIEWS_API_BASE ?? "";

export async function fetchApprovedReviews(): Promise<Review[]> {
  const { data } = await axios.get<Review[]>(
    `${REVIEWS_API_BASE}/api/public/reviews`,
  );
  return data;
}

export async function fetchTopReviews(limit = 3): Promise<Review[]> {
  const { data } = await axios.get<Review[]>(
    `${REVIEWS_API_BASE}/api/public/reviews/top`,
    { params: { limit } },
  );
  return data;
}

export async function fetchReviewStats(): Promise<ReviewStats> {
  const { data } = await axios.get<ReviewStats>(
    `${REVIEWS_API_BASE}/api/public/reviews/stats`,
  );
  return data;
}

export async function verifyBookingForReview(
  payload: VerifyBookingPayload,
): Promise<VerifyBookingResponse> {
  const { data } = await axios.post<VerifyBookingResponse>(
    `${REVIEWS_API_BASE}/api/public/reviews/verify-booking`,
    payload,
  );
  return data;
}

export async function submitReview(
  payload: SubmitReviewPayload,
): Promise<SubmitReviewResponse> {
  const { data } = await axios.post<SubmitReviewResponse>(
    `${REVIEWS_API_BASE}/api/public/reviews`,
    payload,
  );
  return data;
}

export async function fetchAllReviewsAdmin(): Promise<Review[]> {
  const { data } = await axios.get<Review[]>(
    `${REVIEWS_API_BASE}/api/channeling/reviews`,
  );
  return data;
}

export async function approveReview(reviewId: number): Promise<Review> {
  const { data } = await axios.patch<Review>(
    `${REVIEWS_API_BASE}/api/channeling/reviews/${reviewId}/approve`,
  );
  return data;
}

export async function rejectReview(reviewId: number): Promise<Review> {
  const { data } = await axios.patch<Review>(
    `${REVIEWS_API_BASE}/api/channeling/reviews/${reviewId}/reject`,
  );
  return data;
}

export async function deleteReview(reviewId: number): Promise<void> {
  await axios.delete(`${REVIEWS_API_BASE}/api/channeling/reviews/${reviewId}`);
}
