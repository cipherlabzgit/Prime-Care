import { Link } from "react-router-dom";
import type { LandingPageConfig } from "../../types/landingPage";

interface HealthcareServiceDiscoveryCardProps {
  page: LandingPageConfig;
}

function HealthcareServiceDiscoveryCard({ page }: HealthcareServiceDiscoveryCardProps) {
  const href = `/${page.slug}`;

  return (
    <Link
      to={href}
      className="healthcare-discovery-card"
      aria-label={`Explore ${page.seoTitle}`}
    >
      <div className="healthcare-discovery-card__media">
        <img
          src={page.heroImage}
          alt=""
          className="healthcare-discovery-card__image"
          loading="lazy"
          decoding="async"
        />
        <span className="healthcare-discovery-card__media-accent" aria-hidden="true" />
      </div>
      <div className="healthcare-discovery-card__body">
        <h3 className="healthcare-discovery-card__title">{page.seoTitle}</h3>
        <p className="healthcare-discovery-card__desc">{page.seoDescription}</p>
        <span className="healthcare-discovery-card__cta">
          Explore Service
          <span className="healthcare-discovery-card__cta-arrow" aria-hidden="true">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export default HealthcareServiceDiscoveryCard;
