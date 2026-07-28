import type { FeatureItem } from "../../types/home";

interface FeatureCardProps {
  feature: FeatureItem;
}

function FeatureIcon({ type }: { type: FeatureItem["icon"] }) {
  switch (type) {
    case "booking":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01" />
        </svg>
      );
    case "doctors":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
          <path d="M6 21v-1a5 5 0 0 1 10 0v1" />
          <path d="M19 8v6M22 11h-6" />
        </svg>
      );
    case "centers":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M3 21h18M5 21V7l7-4 7 4v14" />
          <path d="M9 21v-6h6v6M9 9h.01M15 9h.01" />
        </svg>
      );
    case "care":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
  }
}

function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <article className="feature-card">
      <div className="feature-card__icon">
        <FeatureIcon type={feature.icon} />
      </div>
      <h3 className="feature-card__title">{feature.title}</h3>
      <p className="feature-card__desc">{feature.description}</p>
    </article>
  );
}

export default FeatureCard;
