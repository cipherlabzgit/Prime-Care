import { useState } from "react";
import { Link } from "react-router-dom";
import { homeopathyDisclaimer } from "../../data/servicesData";
import type { ClinicalService } from "../../types/service";
import ScrollReveal from "../home/ScrollReveal";

interface ServiceDetailSectionProps {
  service: ClinicalService;
  index: number;
}

function ServiceDetailVisual({ service }: { service: ClinicalService }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="service-detail__visual">
      <div className="service-detail__image-shell">
        {!imageError ? (
          <img
            className="service-detail__image"
            src={service.image}
            alt={`${service.name} — PremierCare clinical service`}
            width={520}
            height={400}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
          />
        ) : null}
        <div
          className={`service-detail__image-fallback${
            imageError ? " service-detail__image-fallback--visible" : ""
          }`}
        >
          <span className="service-detail__fallback-icon" aria-hidden="true">
            {service.icon}
          </span>
        </div>
        <div className="service-detail__image-overlay" />
      </div>
      <div className="service-detail__icon-badge" aria-hidden="true">
        {service.icon}
      </div>
    </div>
  );
}

function ServiceDetailSection({ service, index }: ServiceDetailSectionProps) {
  const reversed = index % 2 === 1;
  const treatmentsLabel =
    service.slug === "homeopathy"
      ? "Our approach to Homeopathic care"
      : service.slug === "corporate-healthcare"
        ? "Corporate solutions"
        : "Focus areas";

  return (
    <section
      id={service.slug}
      className="service-detail scroll-mt-28"
      aria-labelledby={`service-${service.slug}-heading`}
    >
      <ScrollReveal>
        <article className="service-detail__card">
          <div
            className={`service-detail__body service-detail__layout${
              reversed ? " service-detail__layout--reversed" : ""
            }`}
          >
            <div className="service-detail__content">
              <span className="service-detail__eyebrow">{service.name}</span>
              <h2 id={`service-${service.slug}-heading`} className="service-detail__title">
                {service.name}
              </h2>
              <p className="service-detail__description">{service.description}</p>

              <div className="service-detail__lists">
                <div className="service-detail__list-block">
                  <h3 className="service-detail__list-title">Services offered</h3>
                  <ul className="service-detail__list">
                    {service.services.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                {service.treatments && service.treatments.length > 0 ? (
                  <div className="service-detail__list-block">
                    <h3 className="service-detail__list-title">{treatmentsLabel}</h3>
                    <ul className="service-detail__list service-detail__list--accent">
                      {service.treatments.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>

            <ServiceDetailVisual service={service} />
          </div>

          <footer className="service-detail__footer">
            {service.slug === "homeopathy" ? (
              <p className="service-detail__disclaimer" role="note">
                {homeopathyDisclaimer}
              </p>
            ) : null}
            <Link to="/channeling" className="home-btn home-btn--primary service-detail__cta">
              {service.slug === "corporate-healthcare"
                ? "Talk to Us About Your Organization"
                : "Book Appointment"}
            </Link>
          </footer>
        </article>
      </ScrollReveal>
    </section>
  );
}

export default ServiceDetailSection;
