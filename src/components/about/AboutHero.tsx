import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { aboutPresentationSlides, aboutStory } from "../../data/aboutData";

const SLIDES = aboutPresentationSlides;
const AUTO_MS = 6000;
const TOTAL = SLIDES.length;

function padSlide(n: number) {
  return String(n).padStart(2, "0");
}

function AboutHero() {
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [systemPaused, setSystemPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [sideHover, setSideHover] = useState<"left" | "right" | null>(null);
  const [touched, setTouched] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const dragging = useRef(false);
  const ignoreClick = useRef(false);

  const playing = !userPaused && !systemPaused;

  const goTo = useCallback((index: number) => {
    setActive(((index % TOTAL) + TOTAL) % TOTAL);
    setProgressKey((key) => key + 1);
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % TOTAL);
      setProgressKey((key) => key + 1);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [playing, progressKey]);

  useEffect(() => {
    const onVisibility = () => {
      setSystemPaused(document.hidden);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!touched) return;
    const timer = window.setTimeout(() => setTouched(false), 2600);
    return () => window.clearTimeout(timer);
  }, [touched]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("[data-nav]")) return;
    dragging.current = true;
    startX.current = event.clientX;
    ignoreClick.current = false;
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current || startX.current == null) {
      dragging.current = false;
      return;
    }
    const delta = event.clientX - startX.current;
    dragging.current = false;
    startX.current = null;
    if (Math.abs(delta) > 48) {
      ignoreClick.current = true;
      setTouched(true);
      if (delta < 0) next();
      else prev();
    }
  };

  const onStageClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (ignoreClick.current) {
      ignoreClick.current = false;
      return;
    }
    if ((event.target as HTMLElement).closest("[data-nav]")) return;
    setUserPaused((value) => !value);
    setProgressKey((key) => key + 1);
    setTouched(true);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    } else if (event.key === " " || event.key === "Enter") {
      if ((event.target as HTMLElement).closest("[data-nav]")) return;
      event.preventDefault();
      setUserPaused((value) => !value);
      setProgressKey((key) => key + 1);
    }
  };

  const current = SLIDES[active];
  const showArrows = sideHover !== null || touched || systemPaused;

  return (
    <section className="about-hero" aria-labelledby="about-hero-heading">
      <div className="about-hero__atmosphere" aria-hidden="true">
        <span className="about-hero__blob about-hero__blob--teal" />
        <span className="about-hero__blob about-hero__blob--gold" />
      </div>
      <div className="about-hero__logo-bg" aria-hidden="true">
        <img
          src="/images/premiercare-logo-full.png"
          alt=""
          className="about-hero__logo-bg-img"
          width={520}
          height={160}
          decoding="async"
        />
      </div>

      <div className="about-hero__shell">
        <header className="about-hero__intro about-hero__intro--in">
          <span className="about-hero__eyebrow">{aboutStory.eyebrow}</span>
          <h1 id="about-hero-heading" className="about-hero__title">
            {aboutStory.title}
          </h1>
        </header>

        <div
          ref={stageRef}
          className={`about-hero__stage${showArrows ? " about-hero__stage--controls" : ""}`}
          role="region"
          aria-roledescription="carousel"
          aria-label="Premier Care brand presentation"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            dragging.current = false;
            startX.current = null;
          }}
          onClick={onStageClick}
          onKeyDown={onKeyDown}
          onTouchStart={() => setTouched(true)}
        >
          {SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`about-hero__bg${
                index === active ? " about-hero__bg--active" : ""
              }`}
              aria-hidden={index !== active}
            >
              <img
                key={index === active ? `${slide.id}-${progressKey}` : slide.id}
                className="about-hero__bg-image"
                src={slide.image}
                alt=""
                width={1600}
                height={900}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
              />
            </div>
          ))}

          <div
            className={`about-hero__veil about-hero__veil--${current.tone}`}
            aria-hidden="true"
          />

          <button
            type="button"
            data-nav
            className={`about-hero__arrow about-hero__arrow--prev${
              sideHover === "left" || showArrows
                ? " about-hero__arrow--visible"
                : ""
            }`}
            aria-label="Previous slide"
            onClick={(event) => {
              event.stopPropagation();
              prev();
            }}
            onFocus={() => setSystemPaused(true)}
            onBlur={() => setSystemPaused(false)}
          >
            ‹
          </button>
          <button
            type="button"
            data-nav
            className={`about-hero__arrow about-hero__arrow--next${
              sideHover === "right" || showArrows
                ? " about-hero__arrow--visible"
                : ""
            }`}
            aria-label="Next slide"
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
            onFocus={() => setSystemPaused(true)}
            onBlur={() => setSystemPaused(false)}
          >
            ›
          </button>

          <button
            type="button"
            data-nav
            className="about-hero__zone about-hero__zone--left"
            aria-label="Previous slide"
            onMouseEnter={() => setSideHover("left")}
            onMouseLeave={() => setSideHover(null)}
            onClick={(event) => {
              event.stopPropagation();
              prev();
            }}
          />
          <button
            type="button"
            data-nav
            className="about-hero__zone about-hero__zone--right"
            aria-label="Next slide"
            onMouseEnter={() => setSideHover("right")}
            onMouseLeave={() => setSideHover(null)}
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
          />

          <div className="about-hero__meta" aria-hidden="true">
            <span className="about-hero__count">
              {padSlide(active + 1)} / {padSlide(TOTAL)}
            </span>
            <span className="about-hero__label">{current.label}</span>
          </div>

          <div
            className={`about-hero__status${
              userPaused ? " about-hero__status--visible" : ""
            }`}
            aria-live="polite"
          >
            {userPaused ? "Paused" : "Playing"}
          </div>

          <article
            key={`${current.id}-${progressKey}`}
            className={`about-story about-story--${current.tone}`}
            aria-live="polite"
            onMouseEnter={() => setSystemPaused(true)}
            onMouseLeave={() => setSystemPaused(false)}
          >
            <p className="about-story__eyebrow">{current.label}</p>
            <h2 className="about-story__headline">
              {current.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className="about-story__copy">{current.description}</p>
            <ul className="about-story__pills">
              {current.keywords.map((keyword, index) => (
                <li
                  key={keyword}
                  className="about-story__pill"
                  style={{ animationDelay: `${180 + index * 90}ms` }}
                >
                  {keyword}
                </li>
              ))}
            </ul>
          </article>

          <div
            className="about-hero__progress"
            role="tablist"
            aria-label="Presentation slides"
            data-nav
            onMouseEnter={() => setSystemPaused(true)}
            onMouseLeave={() => setSystemPaused(false)}
          >
            {SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                data-nav
                aria-selected={index === active}
                aria-label={`Go to ${slide.label}`}
                className={`about-hero__progress-item${
                  index === active ? " about-hero__progress-item--active" : ""
                }${index < active ? " about-hero__progress-item--done" : ""}`}
                onClick={(event) => {
                  event.stopPropagation();
                  goTo(index);
                }}
              >
                <span className="about-hero__progress-index">
                  {padSlide(index + 1)}
                </span>
                <span className="about-hero__progress-track">
                  {index === active ? (
                    <span
                      key={progressKey}
                      className={`about-hero__progress-fill${
                        !playing ? " about-hero__progress-fill--paused" : ""
                      }`}
                      style={{ animationDuration: `${AUTO_MS}ms` }}
                    />
                  ) : null}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutHero;
