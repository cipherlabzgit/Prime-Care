import { Link } from "react-router-dom";
import { ctaSection } from "../../data/homeData";
import ScrollReveal from "./ScrollReveal";

function CtaSection() {
  return (
    <section className="cta-section" aria-labelledby="cta-heading">
      <div className="cta-section__bg" aria-hidden="true" />
      <div className="cta-section__inner">
        <ScrollReveal>
          <div className="cta-section__content">
            <span className="cta-section__eyebrow">{ctaSection.eyebrow}</span>
            <h2 id="cta-heading" className="cta-section__title">
              {ctaSection.title}
            </h2>
            <p className="cta-section__desc">{ctaSection.description}</p>
            <div className="cta-section__actions">
              <Link to="/channeling" className="home-btn home-btn--accent">
                {ctaSection.primaryCta}
              </Link>
              <Link to="/contact" className="home-btn home-btn--ghost">
                {ctaSection.secondaryCta}
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default CtaSection;
