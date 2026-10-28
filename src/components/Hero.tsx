import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { homeHero } from "../data/siteContent";

const HERO_IMAGE_URL =
  "https://res.cloudinary.com/dbyuqt5xh/image/upload/q_auto,f_auto,c_limit,w_2000/v1793098836/Welcoming_PremierCare_Clinic_Consultation_vmjmzu.png";

function splitHeroTitle(title: string) {
  const words = title.trim().split(/\s+/);
  if (words.length === 3) {
    return {
      line1: `${words[0]} ${words[1]}`,
      line2: "",
      line3: words[2],
    };
  }
  if (words.length >= 4) {
    return {
      line1: words[0],
      line2: words[1],
      line3: words.slice(2).join(" "),
    };
  }
  if (words.length === 2) {
    return { line1: words[0], line2: "", line3: words[1] };
  }
  return { line1: title, line2: "", line3: "" };
}

function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const { line1, line2, line3 } = splitHeroTitle(homeHero.title);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const imageScale = 1 + scrollY * 0.0004;
  const imageTranslate = scrollY * 0.25;
  const contentTranslate = scrollY * 0.1;

  return (
    <section
      ref={heroRef}
      className="about-unorthodox-hero about-unorthodox-hero--fullscreen"
      aria-labelledby="hero-heading"
    >
      <div className="about-unorthodox-hero__bg-wrapper">
        <img
          src={HERO_IMAGE_URL}
          alt="Warm modern clinic consultation at Premier Care Integrative Clinic"
          className="about-unorthodox-hero__bg-img"
          style={{
            transform: `scale(${imageScale}) translateY(${imageTranslate}px)`,
          }}
        />
        <div className="about-unorthodox-hero__bg-overlay" />
        <div className="about-unorthodox-hero__bg-vignette" />
        <div className="about-unorthodox-hero__noise" />
      </div>

      <div
        className="about-unorthodox-hero__watermark about-unorthodox-hero__watermark--light"
        style={{ transform: `translateX(${-scrollY * 0.4}px)` }}
        aria-hidden="true"
      >
        PREMIER
      </div>

      <div
        className="about-unorthodox-hero__content-fullscreen"
        style={{ transform: `translateY(${contentTranslate}px)` }}
      >
        <div className="about-unorthodox-hero__eyebrow-container">
          <span className="about-unorthodox-hero__eyebrow about-unorthodox-hero__eyebrow--dark-bg">
            <span className="about-unorthodox-hero__eyebrow-dot" />
            {homeHero.badge}
          </span>
        </div>

        <h1 id="hero-heading" className="about-unorthodox-hero__title">
          <span className="about-unorthodox-hero__title-line about-unorthodox-hero__title-line--cyan">
            {line1}
          </span>
          {line2 ? (
            <span className="about-unorthodox-hero__title-line about-unorthodox-hero__title-line--white">
              {line2}
            </span>
          ) : null}
          {line3 ? (
            <span className="about-unorthodox-hero__title-line about-unorthodox-hero__title-line--accent">
              {line3}
            </span>
          ) : null}
        </h1>

        <div className="about-unorthodox-hero__footer about-unorthodox-hero__footer--fullscreen">
          <p className="about-unorthodox-hero__desc about-unorthodox-hero__desc--white">
            {homeHero.subtitle}
          </p>

          <div className="about-unorthodox-hero__badges-inline">
            <Link to="/services" className="about-unorthodox-hero__glass-pill">
              {homeHero.secondaryCta}
            </Link>
            <Link to="/channeling" className="about-unorthodox-hero__glass-pill">
              {homeHero.primaryCta}
            </Link>
          </div>
        </div>

        <div className="about-unorthodox-hero__scroll-indicator about-unorthodox-hero__scroll-indicator--white">
          <div className="about-unorthodox-hero__scroll-line about-unorthodox-hero__scroll-line--white" />
          <span>Scroll to Explore</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
