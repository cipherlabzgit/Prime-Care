import type { Review } from "../../types/review";
import TestimonialCard from "./TestimonialCard";

interface FeaturedReviewsProps {
  reviews: Review[];
  loading?: boolean;
}

function FeaturedReviews({ reviews, loading }: FeaturedReviewsProps) {
  if (loading) {
    return (
      <div className="featured-reviews featured-reviews--loading">
        <div className="featured-reviews__skeleton" />
        <div className="featured-reviews__skeleton" />
        <div className="featured-reviews__skeleton" />
      </div>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="featured-reviews" aria-labelledby="featured-reviews-heading">
      <div className="featured-reviews__header">
        <p className="about-section__eyebrow">Featured</p>
        <h3 id="featured-reviews-heading" className="featured-reviews__title">
          Top Patient Stories
        </h3>
        <p className="featured-reviews__subtitle">
          Highest-rated reviews from verified patients across our partner centers.
        </p>
      </div>
      <div className="featured-reviews__grid">
        {reviews.map((review) => (
          <TestimonialCard key={review.reviewId} review={review} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedReviews;
