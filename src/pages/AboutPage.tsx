import { useEffect, useMemo, useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { USER_MESSAGES } from "../utils/userMessages";
import AboutHero from "../components/about/AboutHero";
import LeadershipTeam from "../components/about/LeadershipTeam";
import AboutWhyChoose from "../components/about/AboutWhyChoose";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import ScrollReveal from "../components/home/ScrollReveal";
import FeaturedReviews from "../components/reviews/FeaturedReviews";
import ReviewSortControls from "../components/reviews/ReviewSortControls";
import ReviewStatistics from "../components/reviews/ReviewStatistics";
import ReviewSubmissionForm from "../components/reviews/ReviewSubmissionForm";
import TestimonialCard from "../components/reviews/TestimonialCard";
import PageState from "../components/ui/PageState";
import {
  fetchApprovedReviews,
  fetchReviewStats,
  fetchTopReviews,
} from "../services/reviewService";
import type { Review, ReviewSortOption, ReviewStats } from "../types/review";
import { sortReviews } from "../utils/reviewUtils";
import ServicesCtaSection from "../components/services/ServicesCtaSection";
import { aboutCta } from "../data/aboutData";
import "../styles/about.css";
import "../styles/home.css";
import "../styles/services.css";

function AboutPage() {
  usePageTitle("About Us");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [featuredReviews, setFeaturedReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [sort, setSort] = useState<ReviewSortOption>("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortedReviews = useMemo(
    () => sortReviews(reviews, sort),
    [reviews, sort],
  );

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const [approved, top, reviewStats] = await Promise.all([
        fetchApprovedReviews(),
        fetchTopReviews(3),
        fetchReviewStats(),
      ]);
      setReviews(approved);
      setFeaturedReviews(top);
      setStats(reviewStats);
    } catch {
      setError(USER_MESSAGES.loadFailed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, []);

  useEffect(() => {
    if (window.location.hash === "#reviews") {
      const el = document.getElementById("reviews");
      if (el) {
        window.setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [loading]);

  return (
    <div className="about-page home-page flex min-h-svh flex-col">
      <Navbar />

      <AboutHero />

      <LeadershipTeam />

      {/* WHY PREMIER CARE — homepage why-choose style + carousel */}
      <AboutWhyChoose />

      {/* PATIENT STORIES — exact testimonials-section homepage style */}
      <section
        className="testimonials-section about-testimonials-section"
        id="reviews"
        aria-labelledby="about-reviews-heading"
      >
        <div className="testimonials-section__glow" aria-hidden="true" />

        <ScrollReveal>
          <header className="testimonials-section__header">
            <div>
              <span className="testimonials-section__eyebrow">
                <span aria-hidden="true">✦</span>
                Patient Stories
              </span>
              <h2 id="about-reviews-heading" className="testimonials-section__title">
                Trusted by
                <span>the People We Care For.</span>
              </h2>
            </div>
            <p className="testimonials-section__intro">
              The greatest measure of our work is the experience of the people we serve. We are grateful to every patient and family who places their trust in Premier Care Integrative Clinic.
            </p>
          </header>
        </ScrollReveal>

        <ScrollReveal delay={60}>
          <ReviewStatistics stats={stats} loading={loading} />
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <FeaturedReviews reviews={featuredReviews} loading={loading} />
        </ScrollReveal>

        {!loading && !error && reviews.length > 0 ? (
          <div className="about-reviews-toolbar">
            <p className="about-reviews-toolbar__count">
              {reviews.length} approved review{reviews.length === 1 ? "" : "s"}
            </p>
            <ReviewSortControls value={sort} onChange={setSort} />
          </div>
        ) : null}

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
            onRetry={loadReviews}
            retryLabel="Try Again"
          />
        )}

        {!loading && !error && reviews.length === 0 && (
          <PageState
            variant="empty"
            icon="reviews"
            title="No reviews available"
            message="Approved patient stories will appear here. Share your experience using the form below."
            action={{ label: "Share a review", href: "#share-experience" }}
          />
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="testimonials-section__grid">
            {sortedReviews.map((review, index) => (
              <ScrollReveal key={review.reviewId} delay={index * 60}>
                <TestimonialCard review={review} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* SHARE EXPERIENCE — styled like homepage care-model-section */}
      <section
        className="care-model-section home-section about-share-section"
        id="share-experience"
        aria-labelledby="share-heading"
      >
        <ScrollReveal>
          <header className="section-header section-header--center">
            <span className="section-header__eyebrow">Your Voice Matters</span>
            <h2 id="share-heading" className="about-share-section__title">
              <span>Share Your</span>
              <span>Experience.</span>
            </h2>
          </header>
        </ScrollReveal>

        <div className="about-share-layout">
          <ScrollReveal className="about-share-intro">
            <p className="about-share-desc">
              Verified patients can share feedback about their appointment journey. Reviews are moderated and published after approval.
            </p>
            <ul className="about-share-notes">
              <li>
                <span className="about-share-check" aria-hidden="true">✓</span>
                Booking reference and mobile number required
              </li>
              <li>
                <span className="about-share-check" aria-hidden="true">✓</span>
                Only verified bookings can submit reviews
              </li>
              <li>
                <span className="about-share-check" aria-hidden="true">✓</span>
                Pending reviews are not shown publicly
              </li>
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={100} className="about-share-form-wrapper">
            <ReviewSubmissionForm />
          </ScrollReveal>
        </div>
      </section>

      <ServicesCtaSection
        headingId="about-cta-heading"
        eyebrow={aboutCta.eyebrow}
        titleLead={aboutCta.titleLead}
        titleAccent={aboutCta.titleAccent}
        description={aboutCta.description}
        watermark={aboutCta.watermark}
        primaryLabel={aboutCta.primaryLabel}
        secondaryLabel={aboutCta.secondaryLabel}
        secondaryHref={aboutCta.secondaryHref}
      />

      <SiteFooter />
    </div>
  );
}

export default AboutPage;
