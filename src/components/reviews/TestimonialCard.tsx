import type { Review } from "../../types/review";
import {
  formatReviewDate,
  formatReviewLocation,
  getReviewInitials,
} from "../../utils/reviewUtils";

interface TestimonialCardProps {
  review: Review;
}

function TestimonialCard({ review }: TestimonialCardProps) {
  const displayDate = formatReviewDate(review.approvedDate || review.createdDate);
  const locationLabel = formatReviewLocation(review);

  return (
    <blockquote className="testimonial-card">
      <div
        className="testimonial-card__stars"
        aria-label={`${review.rating} out of 5 stars`}
      >
        {Array.from({ length: review.rating }, (_, i) => (
          <span key={i} aria-hidden="true">
            ★
          </span>
        ))}
      </div>
      <p className="testimonial-card__quote">&ldquo;{review.reviewText}&rdquo;</p>
      <footer className="testimonial-card__footer">
        <div className="testimonial-card__avatar" aria-hidden="true">
          {getReviewInitials(review.fullName)}
        </div>
        <div>
          <cite className="testimonial-card__name">{review.fullName}</cite>
          <p className="testimonial-card__role">{locationLabel}</p>
          {displayDate ? (
            <p className="testimonial-card__date">{displayDate}</p>
          ) : null}
        </div>
      </footer>
    </blockquote>
  );
}

export default TestimonialCard;
