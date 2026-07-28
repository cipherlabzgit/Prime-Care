import { useState } from "react";
import ScrollReveal from "../home/ScrollReveal";
import { servicesHero } from "../../data/servicesData";

function ServicesHeroVisual() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="services-hero__visual" aria-hidden="true">
      <div className="services-hero__image-shell">
        {!imageError ? (
          <img
            className="services-hero__image"
            src={servicesHero.image}
            alt=""
            width={560}
            height={480}
            loading="eager"
            decoding="async"
            onError={() => setImageError(true)}
          />
        ) : null}
        <div
          className={`services-hero__image-fallback${
            imageError ? " services-hero__image-fallback--visible" : ""
          }`}
        >
          <span className="services-hero__fallback-icon">🩺</span>
          <span>Clinical Care</span>
        </div>
        <div className="services-hero__image-overlay" />
      </div>
      <div className="services-hero__float services-hero__float--care">
        <span aria-hidden="true">✓</span>
        <div>
          <strong>Verified Specialists</strong>
          <span>Board-certified consultants</span>
        </div>
      </div>
      <div className="services-hero__float services-hero__float--booking">
        <span aria-hidden="true">📅</span>
        <div>
          <strong>Easy Booking</strong>
          <span>Online channeling</span>
        </div>
      </div>
    </div>
  );
}

function ServicesHero() {
  return (
    <section className="services-hero" aria-labelledby="services-hero-heading">
      <div className="services-hero__pattern" aria-hidden="true" />
      <div className="services-hero__layout">
        <div className="services-hero__content">
          <ScrollReveal>
            <span className="services-hero__eyebrow">{servicesHero.eyebrow}</span>
            <h1 id="services-hero-heading" className="services-hero__title">
              {servicesHero.title}
            </h1>
            <p className="services-hero__description">{servicesHero.description}</p>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={120}>
          <ServicesHeroVisual />
        </ScrollReveal>
      </div>
    </section>
  );
}

export default ServicesHero;
