import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTopReviews } from "../../services/reviewService";
import type { Review } from "../../types/review";
import PageState from "../ui/PageState";
import { USER_MESSAGES } from "../../utils/userMessages";
import TestimonialCard from "../reviews/TestimonialCard";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTopReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTopReviews(3);
      setReviews(data);
    } catch {
      setError(USER_MESSAGES.loadFailed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTopReviews();
  }, []);

  return (
    <section className="home-section" id="testimonials" aria-labelledby="testimonials-heading">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Patient Stories"
          title="Trusted by the People We Care For"
          description="The greatest measure of our work is the experience of the people we serve at Premier Care Integrative Clinic."
        />
      </ScrollReveal>

      {loading && (
        <div className="about-reviews-loading" aria-busy="true">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="about-review-skeleton" />
          ))}
        </div>
      )}

      {!loading && error && (
        <PageState
          variant="error"
          icon="reviews"
          title="Unable to load reviews"
          message={USER_MESSAGES.loadFailed}
          onRetry={loadTopReviews}
          retryLabel="Try Again"
        />
      )}

      {!loading && !error && reviews.length === 0 && (
        <PageState
          variant="empty"
          icon="reviews"
          title="No reviews available"
          message="Approved patient stories will appear here once published."
          action={{ label: "Share your experience", href: "/about#share-experience" }}
        />
      )}

      {!loading && !error && reviews.length > 0 && (
        <>
          <div className="home-grid home-grid--3">
            {reviews.map((review, index) => (
              <ScrollReveal key={review.reviewId} delay={index * 100}>
                <TestimonialCard review={review} />
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={200}>
            <div className="testimonials-section__cta">
              <Link to="/about#reviews" className="testimonials-section__link">
                View All Reviews
              </Link>
            </div>
          </ScrollReveal>
        </>
      )}
    </section>
  );
}

export default TestimonialsSection;
