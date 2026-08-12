import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCountUp } from "../hooks/useCountUp";
import { clinicInfo, homeHero } from "../data/siteContent";
import { heroHighlights } from "../data/homeData";
import "../styles/hero.css";

const TRUST_STATS = heroHighlights.map((stat, index) => ({
  key: stat.id,
  value: stat.value,
  label: stat.label,
  animate: false,
  delay: index * 100,
}));

function HeroTrustValue({
  value,
  animate,
  delay,
}: {
  value: string;
  animate: boolean;
  delay: number;
}) {
  const [active, setActive] = useState(false);
  const display = useCountUp(value, active && animate, 1600);

  useEffect(() => {
    const timer = window.setTimeout(() => setActive(true), 400 + delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  return <strong className="hero__trust-value">{animate ? display : value}</strong>;
}

function HeroDecorations() {
  return (
    <>
      <span className="hero__deco hero__deco--ring" aria-hidden="true" />
      <span className="hero__deco hero__deco--dot hero__deco--dot-1" aria-hidden="true" />
      <span className="hero__deco hero__deco--dot hero__deco--dot-2" aria-hidden="true" />
      <span className="hero__deco hero__deco--plus" aria-hidden="true">
        +
      </span>
      <span className="hero__deco hero__deco--pulse" aria-hidden="true" />
    </>
  );
}

function HeroConsultationVisual() {
  return (
    <div className="hero__visual" aria-hidden="true">
      <div className="hero__image-frame hero__image-frame--float">
        <div className="hero__image-shell">
          <img
            className="hero__image-photo"
            src="/images/hero-consultation.png"
            alt=""
            width={640}
            height={720}
            loading="eager"
            decoding="async"
          />
          <div className="hero__image-overlay" />
          <div className="hero__image-glass" />
        </div>

        <div className="hero__float hero__float--rating">
          <span className="hero__float-icon hero__float-icon--gold" aria-hidden="true">
            🌿
          </span>
          <div>
            <strong>Homeopathy &amp; Therapeutics</strong>
            <span>Core integrative services</span>
          </div>
        </div>

        <div className="hero__float hero__float--verified">
          <span className="hero__float-icon hero__float-icon--teal" aria-hidden="true">
            ✓
          </span>
          <div>
            <strong>Integrative Care</strong>
            <span>Whole-person healthcare</span>
          </div>
        </div>

        <div className="hero__float hero__float--slots">
          <span className="hero__float-icon hero__float-icon--slots" aria-hidden="true">
            🕐
          </span>
          <div>
            <strong>{clinicInfo.hours}</strong>
            <span>Open every day</span>
          </div>
        </div>

        <div className="hero__float hero__float--patients">
          <span className="hero__float-icon hero__float-icon--patients" aria-hidden="true">
            📍
          </span>
          <div>
            <strong>{clinicInfo.address.line2}</strong>
            <span>{clinicInfo.parking}</span>
          </div>
        </div>
      </div>

      <HeroDecorations />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__bg-pattern" aria-hidden="true" />
      <div className="hero__layout">
        <div className="hero__inner hero__inner--animate">
          <span className="hero__badge">
            <span className="hero__badge-dot" aria-hidden="true" />
            {homeHero.badge}
          </span>
          <h1 id="hero-heading" className="hero__title">
            {homeHero.title}
          </h1>
          <p className="hero__subtitle hero__subtitle--tagline">{homeHero.subtitle}</p>
          <div className="hero__actions">
            <Link to="/channeling" className="hero__btn hero__btn--primary">
              <span className="hero__btn-text">{homeHero.primaryCta}</span>
            </Link>
            <Link to="/services" className="hero__btn hero__btn--secondary">
              <span className="hero__btn-text">{homeHero.secondaryCta}</span>
            </Link>
          </div>
          <div className="hero__trust" aria-label="Key highlights">
            {TRUST_STATS.map((stat) => (
              <div key={stat.key} className="hero__trust-item">
                <HeroTrustValue
                  value={stat.value}
                  animate={stat.animate}
                  delay={stat.delay}
                />
                <span className="hero__trust-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <HeroConsultationVisual />
      </div>
    </section>
  );
}

export default Hero;
