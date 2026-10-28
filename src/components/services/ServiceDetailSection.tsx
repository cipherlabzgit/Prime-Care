import { useState, type CSSProperties, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { CHANNELING_BOOKING_URL } from "../../utils/bookingNavigation";
import type { ClinicalService } from "../../types/service";
import ScrollReveal from "../home/ScrollReveal";

interface ServiceDetailSectionProps {
  service: ClinicalService;
  index: number;
}

function ServiceTitle({ name, id }: { name: string; id: string }) {
  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return (
      <h2 id={id} className="svc-modern__title">
        <span className="svc-modern__title-teal">{words[0]}</span>
      </h2>
    );
  }

  const lead = words.slice(0, words.length - 1).join(" ");
  const accent = words[words.length - 1];

  return (
    <h2 id={id} className="svc-modern__title">
      <span className="svc-modern__title-teal">{lead}</span>{" "}
      <span className="svc-modern__title-amber">{accent}</span>
    </h2>
  );
}

function ServiceDetailSection({ service, index }: ServiceDetailSectionProps) {
  const [imageError, setImageError] = useState(false);
  const reversed = index % 2 === 1;
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setScrollY((window.innerHeight - rect.top) * 0.1);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const treatmentsLabel =
    service.slug === "homeopathy"
      ? "Our approach"
      : service.slug === "corporate-healthcare"
        ? "Corporate solutions"
        : "Focus areas";

  const iconColors = [
    "var(--svc-teal)",
    "var(--svc-accent)",
    "var(--svc-teal)",
    "var(--svc-accent)",
    "var(--svc-teal)",
    "var(--svc-accent)",
    "var(--svc-teal)",
  ];

  return (
    <section
      id={service.slug}
      ref={sectionRef}
      className={`svc-modern scroll-mt-28 ${reversed ? "svc-modern--reversed" : ""}`}
      aria-labelledby={`svc-${service.slug}-heading`}
    >
      <div 
        className="svc-modern__watermark" 
        aria-hidden="true"
        style={{ transform: `translateY(${scrollY}px)` }}
      >
        {service.name.charAt(0)}
      </div>

      <ScrollReveal>
        <div className="svc-modern__grid">
          
          {/* Visual Column */}
          <div className="svc-modern__visual">
            <div className="svc-modern__image-wrapper">
              <div className="svc-modern__image-shape svc-modern__image-shape--primary">
                {!imageError ? (
                  <img
                    className="svc-modern__image"
                    src={service.image}
                    alt={`${service.name} at PremierCare`}
                    loading="lazy"
                    decoding="async"
                    onError={() => setImageError(true)}
                  />
                ) : null}
                {imageError ? (
                  <div className="svc-modern__fallback">
                    <span>{service.icon}</span>
                  </div>
                ) : null}
              </div>
              
              <div className="svc-modern__decoration-circle" />
              <div className="svc-modern__decoration-glass">
                <span className="svc-modern__icon" style={{ "--icon-color": iconColors[index % iconColors.length] } as CSSProperties}>
                  {service.icon}
                </span>
                <span className="svc-modern__glass-text">0{index + 1}</span>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="svc-modern__content">
            <ServiceTitle name={service.name} id={`svc-${service.slug}-heading`} />
            
            <p className="svc-modern__desc">{service.description}</p>
            
            <div className="svc-modern__features-wrapper">
              <div className="svc-modern__list-container svc-modern__list-container--primary">
                <h3 className="svc-modern__list-title">Services offered</h3>
                <ul className="svc-modern__list">
                  {service.services.map((item) => (
                    <li key={item}>
                       <span className="svc-modern__list-dot" />
                       {item}
                    </li>
                  ))}
                </ul>
              </div>

              {service.treatments && service.treatments.length > 0 ? (
                <div className="svc-modern__list-container svc-modern__list-container--accent">
                  <h3 className="svc-modern__list-title">{treatmentsLabel}</h3>
                  <ul className="svc-modern__list">
                    {service.treatments.map((item) => (
                      <li key={item}>
                        <span className="svc-modern__list-dot" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="svc-modern__action">
              <Link
                to={CHANNELING_BOOKING_URL}
                className="svc-modern__cta-btn"
              >
                <span className="svc-modern__cta-text">
                  {service.slug === "corporate-healthcare"
                    ? "Talk to Us"
                    : "Book Appointment"}
                </span>
                <span className="svc-modern__cta-arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

        </div>
      </ScrollReveal>
    </section>
  );
}

export default ServiceDetailSection;
