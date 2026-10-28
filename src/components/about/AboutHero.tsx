import { useEffect, useRef, useState } from "react";
import { aboutStory } from "../../data/aboutData";

const HERO_IMAGE_URL = "https://res.cloudinary.com/dbyuqt5xh/image/upload/v1790843248/f8fe1e84-0360-4c98-8974-37699e3aa50b_gryego.jpg";

function AboutHero() {
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

  return (
    <section 
      ref={heroRef}
      className="about-unorthodox-hero about-unorthodox-hero--fullscreen" 
      aria-labelledby="about-hero-heading"
    >
      {/* Full Screen Background Image with Parallax & Subtle Zoom */}
      <div className="about-unorthodox-hero__bg-wrapper">
        <img 
          src={HERO_IMAGE_URL} 
          alt="Premier Care Integrative Clinic Hero" 
          className="about-unorthodox-hero__bg-img"
          style={{ 
            transform: `scale(${imageScale}) translateY(${imageTranslate}px)` 
          }}
        />
        {/* Multi-layered cinematic gradient overlays */}
        <div className="about-unorthodox-hero__bg-overlay" />
        <div className="about-unorthodox-hero__bg-vignette" />
        <div className="about-unorthodox-hero__noise" />
      </div>

      {/* Massive Text Watermark */}
      <div 
        className="about-unorthodox-hero__watermark about-unorthodox-hero__watermark--light"
        style={{ transform: `translateX(${-scrollY * 0.4}px)` }}
        aria-hidden="true"
      >
        PREMIER
      </div>

      {/* Hero Content Container */}
      <div 
        className="about-unorthodox-hero__content-fullscreen"
        style={{ transform: `translateY(${contentTranslate}px)` }}
      >
        <div className="about-unorthodox-hero__eyebrow-container">
          <span className="about-unorthodox-hero__eyebrow about-unorthodox-hero__eyebrow--dark-bg">
            <span className="about-unorthodox-hero__eyebrow-dot" />
            {aboutStory.eyebrow}
          </span>
        </div>

        <h1 
          id="about-hero-heading" 
          className="about-unorthodox-hero__title"
        >
          <span className="about-unorthodox-hero__title-line about-unorthodox-hero__title-line--cyan">
            The Story
          </span>
          <span className="about-unorthodox-hero__title-line about-unorthodox-hero__title-line--white">
            Behind
          </span>
          <span className="about-unorthodox-hero__title-line about-unorthodox-hero__title-line--accent">
            Premier Care
          </span>
        </h1>

        <div className="about-unorthodox-hero__footer about-unorthodox-hero__footer--fullscreen">
          <p className="about-unorthodox-hero__desc about-unorthodox-hero__desc--white">
            At Premier Care Integrative Clinic, we bring together practitioners from diverse healthcare and therapeutic disciplines who share a common commitment to compassionate, personalized, and professional care.
          </p>
          
          <div className="about-unorthodox-hero__badges-inline">
            <div className="about-unorthodox-hero__glass-pill">
              <span>Integrative Medicine</span>
            </div>
            <div className="about-unorthodox-hero__glass-pill">
              <span>100% Patient-Centered</span>
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

export default AboutHero;
