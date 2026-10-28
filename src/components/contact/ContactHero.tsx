import { useEffect, useRef, useState } from "react";
import { contactHero } from "../../data/contactData";

const HERO_IMAGE_URL =
  "https://res.cloudinary.com/dbyuqt5xh/image/upload/v1790928231/Gemini_Generated_Image_6pxj6y6pxj6y6pxj_lllpwc.jpg";

function ContactHero() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const imageScale = 1 + scrollY * 0.0004;
  const imageTranslate = scrollY * 0.25;
  const contentTranslate = scrollY * 0.1;

  return (
    <section
      ref={heroRef}
      className="about-unorthodox-hero about-unorthodox-hero--fullscreen contact-hero-full"
      aria-labelledby="contact-hero-heading"
    >
      <div className="about-unorthodox-hero__bg-wrapper">
        <img
          src={HERO_IMAGE_URL}
          alt="Premier Care Integrative Clinic reception and patient support"
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
        CONTACT
      </div>

      <div
        className="about-unorthodox-hero__content-fullscreen"
        style={{ transform: `translateY(${contentTranslate}px)` }}
      >
        <div className="about-unorthodox-hero__eyebrow-container">
          <span className="about-unorthodox-hero__eyebrow about-unorthodox-hero__eyebrow--dark-bg">
            <span className="about-unorthodox-hero__eyebrow-dot" />
            {contactHero.eyebrow}
          </span>
        </div>

        <h1 id="contact-hero-heading" className="about-unorthodox-hero__title">
          <span className="about-unorthodox-hero__title-line about-unorthodox-hero__title-line--cyan">
            {contactHero.titleLead}
          </span>
          <span className="about-unorthodox-hero__title-line about-unorthodox-hero__title-line--accent">
            {contactHero.titleAccent}
          </span>
        </h1>

        <div className="about-unorthodox-hero__footer about-unorthodox-hero__footer--fullscreen">
          <p className="about-unorthodox-hero__desc about-unorthodox-hero__desc--white">
            {contactHero.description}
          </p>

          <div className="about-unorthodox-hero__badges-inline">
            <div className="about-unorthodox-hero__glass-pill">
              <span>Patient support team</span>
            </div>
            <div className="about-unorthodox-hero__glass-pill">
              <span>English, Sinhala &amp; Tamil</span>
            </div>
          </div>
        </div>

        <div className="about-unorthodox-hero__scroll-indicator about-unorthodox-hero__scroll-indicator--white">
          <div className="about-unorthodox-hero__scroll-line about-unorthodox-hero__scroll-line--white" />
          <span>Scroll for details</span>
        </div>
      </div>
    </section>
  );
}

export default ContactHero;
