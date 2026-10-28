import { useEffect, useRef, useState } from "react";
import { servicesHero } from "../../data/servicesData";

const HERO_IMAGE_URL =
  "https://res.cloudinary.com/dbyuqt5xh/image/upload/v1790926853/Gemini_Generated_Image_eyeqi0eyeqi0eyeq_wtowno.jpg";

function ServicesHero() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

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
  const [titleLead, titleAccent] = servicesHero.title.split(" ");

  return (
    <section
      ref={heroRef}
      className="about-unorthodox-hero about-unorthodox-hero--fullscreen"
      aria-labelledby="svc-hero-heading"
    >
      <div className="about-unorthodox-hero__bg-wrapper">
        <img
          src={HERO_IMAGE_URL}
          alt="Clinician providing attentive care during a patient visit at Premier Care"
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
        SERVICES
      </div>

      <div
        className="about-unorthodox-hero__content-fullscreen"
        style={{ transform: `translateY(${contentTranslate}px)` }}
      >
        <div className="about-unorthodox-hero__eyebrow-container">
          <span className="about-unorthodox-hero__eyebrow about-unorthodox-hero__eyebrow--dark-bg">
            <span className="about-unorthodox-hero__eyebrow-dot" />
            {servicesHero.eyebrow}
          </span>
        </div>

        <h1 id="svc-hero-heading" className="about-unorthodox-hero__title">
          <span className="about-unorthodox-hero__title-line about-unorthodox-hero__title-line--cyan">
            {titleLead}
          </span>
          {titleAccent ? (
            <span className="about-unorthodox-hero__title-line about-unorthodox-hero__title-line--accent">
              {titleAccent}
            </span>
          ) : null}
        </h1>

        <div className="about-unorthodox-hero__footer about-unorthodox-hero__footer--fullscreen">
          <p className="about-unorthodox-hero__desc about-unorthodox-hero__desc--white">
            {servicesHero.description}
          </p>

          <div className="about-unorthodox-hero__badges-inline">
            <div className="about-unorthodox-hero__glass-pill">
              <span>7+ Healthcare Disciplines</span>
            </div>
            <div className="about-unorthodox-hero__glass-pill">
              <span>One Connected Clinic</span>
            </div>
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

export default ServicesHero;
