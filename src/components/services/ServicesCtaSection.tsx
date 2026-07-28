import { Link } from "react-router-dom";
import { servicesCta } from "../../data/servicesData";
import ScrollReveal from "../home/ScrollReveal";

function ServicesCtaSection() {
  return (
    <section className="services-cta" aria-labelledby="services-cta-heading">
      <div className="services-cta__bg" aria-hidden="true" />
      <div className="services-cta__inner">
        <ScrollReveal>
          <div className="services-cta__content">
            <span className="services-cta__eyebrow">{servicesCta.eyebrow}</span>
            <h2 id="services-cta-heading" className="services-cta__title">
              {servicesCta.title}
            </h2>
            <p className="services-cta__desc">{servicesCta.description}</p>
            <div className="services-cta__actions">
              <Link to="/channeling" className="home-btn home-btn--accent">
                Book Appointment
              </Link>
              <Link to="/contact" className="home-btn home-btn--ghost">
                Contact Us
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default ServicesCtaSection;
