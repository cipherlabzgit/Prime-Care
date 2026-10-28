import { useEffect, useRef, useState } from "react";
import { channelingHero } from "../../data/channelingData";

const HERO_IMAGE_URL =
  "https://res.cloudinary.com/dbyuqt5xh/image/upload/v1790932232/Gemini_Generated_Image_bztes7bztes7bzte_nijktw.jpg";

function ChannelingHero() {
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
      className="about-unorthodox-hero about-unorthodox-hero--fullscreen channeling-hero-full"
      aria-labelledby="channeling-hero-heading"
    >
      <div className="about-unorthodox-hero__bg-wrapper">
        <img
          src={HERO_IMAGE_URL}
          alt="Premier Care clinic reception welcoming a patient at the front desk"
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
        BOOK
      </div>

      <div
        className="about-unorthodox-hero__content-fullscreen"
        style={{ transform: `translateY(${contentTranslate}px)` }}
      >
        <div className="about-unorthodox-hero__eyebrow-container">
          <span className="about-unorthodox-hero__eyebrow about-unorthodox-hero__eyebrow--dark-bg">
            <span className="about-unorthodox-hero__eyebrow-dot" />
            {channelingHero.eyebrow}
          </span>
        </div>

        <h1 id="channeling-hero-heading" className="about-unorthodox-hero__title">
          <span className="about-unorthodox-hero__title-line about-unorthodox-hero__title-line--cyan">
            {channelingHero.titleLead}
          </span>
          <span className="about-unorthodox-hero__title-line about-unorthodox-hero__title-line--accent">
            {channelingHero.titleAccent}
          </span>
        </h1>

        <div className="about-unorthodox-hero__footer about-unorthodox-hero__footer--fullscreen">
          <p className="about-unorthodox-hero__desc about-unorthodox-hero__desc--white">
            {channelingHero.description}
          </p>

          <div className="about-unorthodox-hero__badges-inline">
            <div className="about-unorthodox-hero__glass-pill">
              <span>Live session availability</span>
            </div>
            <div className="about-unorthodox-hero__glass-pill">
              <span>Secure online checkout</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChannelingHero;
