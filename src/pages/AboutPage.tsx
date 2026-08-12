import { useEffect, useMemo, useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { USER_MESSAGES } from "../utils/userMessages";
import { Link } from "react-router-dom";
import AboutHero from "../components/about/AboutHero";
import LeadershipTeam from "../components/about/LeadershipTeam";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import ScrollReveal from "../components/home/ScrollReveal";
import SectionHeader from "../components/home/SectionHeader";
import FeaturedReviews from "../components/reviews/FeaturedReviews";
import ReviewSortControls from "../components/reviews/ReviewSortControls";
import ReviewStatistics from "../components/reviews/ReviewStatistics";
import ReviewSubmissionForm from "../components/reviews/ReviewSubmissionForm";
import TestimonialCard from "../components/reviews/TestimonialCard";
import PageState from "../components/ui/PageState";
import { aboutWhyChoose } from "../data/aboutData";
import {
  fetchApprovedReviews,
  fetchReviewStats,
  fetchTopReviews,
} from "../services/reviewService";
import type { Review, ReviewSortOption, ReviewStats } from "../types/review";
import { sortReviews } from "../utils/reviewUtils";
import "../styles/about.css";
import "../styles/home.css";

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
    <div className="about-page flex min-h-svh flex-col">
      <Navbar />

      <AboutHero />

      <LeadershipTeam />

      <section className="home-section home-section--alt" aria-labelledby="why-choose-heading">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Why Premier Care?"
            title="Healthcare Designed Around the Whole You"
            description="Premier Care delivers integrative healthcare with compassion, personalization, and a prevention-focused approach."
          />
        </ScrollReveal>
        <div className="home-grid home-grid--4">
          {aboutWhyChoose.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 80}>
              <article className="about-feature-card">
                <span className="about-feature-card__icon" aria-hidden="true">
                  {item.icon}
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section
        className="home-section"
        id="reviews"
        aria-labelledby="reviews-heading"
      >
        <ScrollReveal>
          <SectionHeader
            eyebrow="Patient Stories"
            title="Trusted by the People We Care For"
            description="The greatest measure of our work is the experience of the people we serve. We are grateful to every patient and family who places their trust in Premier Care Integrative Clinic."
          />
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
          <div className="home-grid home-grid--3">
            {sortedReviews.map((review, index) => (
              <ScrollReveal key={review.reviewId} delay={index * 60}>
                <TestimonialCard review={review} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      <section
        className="home-section home-section--alt"
        id="share-experience"
        aria-labelledby="share-heading"
      >
        <div className="about-submit-layout">
          <ScrollReveal>
            <div className="about-submit-intro">
              <SectionHeader
                align="left"
                eyebrow="Your Voice Matters"
                title="Share Your Experience"
                description="Verified patients can share feedback about their appointment journey. Reviews are moderated and published after approval."
              />
              <ul className="about-submit-notes">
                <li>Booking reference and mobile number required</li>
                <li>Only verified bookings can submit reviews</li>
                <li>Pending reviews are not shown publicly</li>
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="about-submit-panel">
              <ReviewSubmissionForm />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="about-cta-band">
        <div className="about-cta-band__inner">
          <h2>Ready to begin your healthcare journey?</h2>
          <p>Book an appointment online or contact our team for guidance on the right service for you.</p>
          <div className="about-cta-band__actions">
            <Link to="/channeling" className="about-cta-band__btn about-cta-band__btn--primary">
              Book Appointment
            </Link>
            <Link to="/doctors" className="about-cta-band__btn about-cta-band__btn--secondary">
              Find a Doctor
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

export default AboutPage;
