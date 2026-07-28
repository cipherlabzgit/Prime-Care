import { useState } from "react";
import type { FormEvent } from "react";
import { useToast } from "../../context/ToastContext";
import {
  submitReview,
  verifyBookingForReview,
} from "../../services/reviewService";
import { USER_MESSAGES } from "../../utils/userMessages";
import Button from "../ui/Button";
import ReviewSubmissionSuccess from "./ReviewSubmissionSuccess";
import StarRatingInput from "./StarRatingInput";

const inputClass =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:cursor-not-allowed disabled:bg-slate-50";

const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-800";

const optionalClass = "font-semibold text-slate-600 normal-case tracking-normal";

function ReviewSubmissionForm() {
  const { showToast } = useToast();
  const [bookingReference, setBookingReference] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [verified, setVerified] = useState(false);
  const [verifiedName, setVerifiedName] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const resetForm = () => {
    setBookingReference("");
    setMobileNumber("");
    setVerified(false);
    setVerifiedName("");
    setFullName("");
    setEmail("");
    setLocation("");
    setRating(0);
    setReviewText("");
    setError(null);
    setSubmitted(false);
  };

  const handleVerify = async () => {
    setError(null);

    if (!bookingReference.trim()) {
      setError("Please enter your booking reference number.");
      return;
    }
    if (!mobileNumber.trim()) {
      setError("Please enter the mobile number used for your booking.");
      return;
    }

    setVerifying(true);
    try {
      const response = await verifyBookingForReview({
        bookingReference: bookingReference.trim(),
        mobileNumber: mobileNumber.trim(),
      });
      setVerified(true);
      setVerifiedName(response.patientName);
      setFullName(response.patientName);
    } catch {
      setVerified(false);
      setError("Could not verify your booking. Please check your reference and mobile number.");
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!verified) {
      setError("Please verify your booking before submitting a review.");
      return;
    }
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }
    if (!reviewText.trim()) {
      setError("Please write your review message.");
      return;
    }

    setSubmitting(true);
    try {
      await submitReview({
        fullName: fullName.trim(),
        email: email.trim() || undefined,
        rating,
        reviewText: reviewText.trim(),
        location: location.trim() || undefined,
        bookingReference: bookingReference.trim(),
        mobileNumber: mobileNumber.trim(),
      });
      setSubmitted(true);
      showToast(USER_MESSAGES.reviewSubmitSuccess);
    } catch {
      setError(USER_MESSAGES.reviewSubmitFailed);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <ReviewSubmissionSuccess onSubmitAnother={resetForm} />;
  }

  return (
    <form
      className="review-form"
      onSubmit={handleSubmit}
      aria-label="Share your experience"
    >
      <div className="review-form__verify">
        <p className="review-form__verify-title">Verify Your Booking</p>
        <p className="review-form__verify-hint">
          Only patients with a confirmed PremierCare booking can submit a review.
        </p>

        <div className="review-form__grid">
          <div>
            <label htmlFor="review-booking-ref" className={labelClass}>
              Booking Reference Number <span className="text-red-500">*</span>
            </label>
            <input
              id="review-booking-ref"
              type="text"
              className={inputClass}
              value={bookingReference}
              disabled={verified || verifying || submitting}
              onChange={(e) => {
                setBookingReference(e.target.value);
                if (verified) {
                  setVerified(false);
                  setVerifiedName("");
                }
              }}
              placeholder="e.g. PC-2026-001"
              autoComplete="off"
              required
            />
          </div>
          <div>
            <label htmlFor="review-mobile" className={labelClass}>
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              id="review-mobile"
              type="tel"
              className={inputClass}
              value={mobileNumber}
              disabled={verified || verifying || submitting}
              onChange={(e) => {
                setMobileNumber(e.target.value);
                if (verified) {
                  setVerified(false);
                  setVerifiedName("");
                }
              }}
              placeholder="e.g. 0771234567"
              autoComplete="tel"
              required
            />
          </div>
        </div>

        {!verified ? (
          <Button
            type="button"
            variant="primary"
            fullWidth
            disabled={verifying}
            className="mt-4 py-3 font-bold"
            onClick={() => void handleVerify()}
          >
            {verifying ? "Verifying…" : "Verify Booking"}
          </Button>
        ) : (
          <p className="review-form__verified-badge" role="status">
            ✓ Booking verified for {verifiedName}
          </p>
        )}
      </div>

      {verified ? (
        <>
          <div className="review-form__divider" aria-hidden="true" />

          <div className="review-form__grid">
            <div>
              <label htmlFor="review-full-name" className={labelClass}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="review-full-name"
                type="text"
                className={inputClass}
                value={fullName}
                disabled={submitting}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label htmlFor="review-email" className={labelClass}>
                Email <span className={optionalClass}>(optional)</span>
              </label>
              <input
                id="review-email"
                type="email"
                className={inputClass}
                value={email}
                disabled={submitting}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="review-location" className={labelClass}>
              Location <span className={optionalClass}>(optional)</span>
            </label>
            <input
              id="review-location"
              type="text"
              className={inputClass}
              value={location}
              disabled={submitting}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Colombo"
            />
          </div>

          <div className="mt-4">
            <p className={labelClass}>
              Rating <span className="text-red-500">*</span>
            </p>
            <StarRatingInput
              value={rating}
              onChange={setRating}
              disabled={submitting}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="review-message" className={labelClass}>
              Review Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="review-message"
              className={`${inputClass} min-h-[8rem] resize-y`}
              value={reviewText}
              disabled={submitting}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us about your experience with PremierCare..."
              required
            />
          </div>

          <Button
            type="submit"
            variant="accent"
            fullWidth
            disabled={submitting}
            className="mt-5 py-3.5 font-bold shadow-lg"
          >
            {submitting ? "Submitting…" : "Submit Review"}
          </Button>
        </>
      ) : null}

      {error ? (
        <p className="review-form__feedback review-form__feedback--error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}

export default ReviewSubmissionForm;
