import { Link } from "react-router-dom";
import { servicesCta } from "../../data/servicesData";
import ScrollReveal from "../home/ScrollReveal";

const defaultTitleLead = servicesCta.title.split(" ").slice(0, 3).join(" ");
const defaultTitleAccent = servicesCta.title.split(" ").slice(3).join(" ");

export interface ServicesCtaSectionProps {
  headingId?: string;
  eyebrow?: string;
  titleLead?: string;
  titleAccent?: string;
  description?: string;
  watermark?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

function ServicesCtaSection({
  headingId = "svc-cta-heading",
  eyebrow = servicesCta.eyebrow,
  titleLead = defaultTitleLead,
  titleAccent = defaultTitleAccent,
  description = servicesCta.description,
  watermark = "Care",
  primaryLabel = "Book Appointment",
  primaryHref = "/channeling",
  secondaryLabel = "Contact Us",
  secondaryHref = "/contact",
}: ServicesCtaSectionProps = {}) {
  return (
    <section className="svc-cta" aria-labelledby={headingId}>
      <div className="svc-cta__bg" aria-hidden="true" />

      <div className="svc-cta__inner">
        <ScrollReveal>
          <span className="svc-cta__watermark" aria-hidden="true">
            {watermark}
          </span>

          <span className="svc-cta__eyebrow">{eyebrow}</span>

          <h2 id={headingId} className="svc-cta__title">
            <span>{titleLead}</span>
            {titleAccent ? (
              <span className="svc-cta__title-accent">{titleAccent}</span>
            ) : null}
          </h2>

          <p className="svc-cta__desc">{description}</p>

          <div className="svc-cta__actions">
            <Link to={primaryHref} className="home-btn home-btn--accent">
              {primaryLabel}
            </Link>
            <Link to={secondaryHref} className="home-btn home-btn--ghost">
              {secondaryLabel}
            </Link>
          </div>
        </ScrollReveal>

        <div className="svc-cta__ring svc-cta__ring--1" aria-hidden="true" />
        <div className="svc-cta__ring svc-cta__ring--2" aria-hidden="true" />
      </div>
    </section>
  );
}

export default ServicesCtaSection;
