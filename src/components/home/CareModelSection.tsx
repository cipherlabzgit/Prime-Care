import { useRef, useState, type CSSProperties } from "react";
import { careModelSteps } from "../../data/siteContent";
import ScrollReveal from "./ScrollReveal";

const carouselColors = [
  ["#d7f2ef", "#eff9f8"],
  ["#d6eef1", "#f3fbfb"],
  ["#e4f4ef", "#fff7df"],
  ["#d9f0e8", "#f7fbf8"],
  ["#cfecee", "#eef8f8"],
  ["#d8f1e3", "#fff3cf"],
] as const;

function CareModelSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStart = useRef<number | null>(null);
  const didDrag = useRef(false);

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + careModelSteps.length) % careModelSteps.length);
  };

  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    const half = careModelSteps.length / 2;
    if (offset > half) offset -= careModelSteps.length;
    if (offset < -half) offset += careModelSteps.length;
    return offset;
  };

  const [colorA, colorB] = carouselColors[activeIndex];

  return (
    <section
      className="home-section home-section--alt care-model-section"
      id="care-model"
      aria-labelledby="care-model-heading"
      style={{
        "--care-gradient-a": colorA,
        "--care-gradient-b": colorB,
      } as CSSProperties}
    >
      <ScrollReveal>
        <header className="section-header section-header--center">
          <span className="section-header__eyebrow">Our Integrated Care Model</span>
          <h2 id="care-model-heading" className="care-model-section__title">
            <span>We Look Beyond the</span>
            <span>Symptom</span>
          </h2>
        </header>
      </ScrollReveal>

      <div
        className="care-model-section__carousel"
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          dragStart.current = event.clientX;
          didDrag.current = false;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (dragStart.current === null) return;
          const distance = event.clientX - dragStart.current;
          if (Math.abs(distance) > 35) {
            didDrag.current = true;
            move(distance < 0 ? 1 : -1);
            dragStart.current = event.clientX;
          }
        }}
        onPointerUp={() => {
          dragStart.current = null;
        }}
        onPointerCancel={() => {
          dragStart.current = null;
        }}
        onWheel={(event) => {
          if (Math.abs(event.deltaX) > 15) move(event.deltaX > 0 ? 1 : -1);
        }}
        aria-label="Integrated care model carousel"
      >
        <div className="care-model-section__track">
        {careModelSteps.map((step, index) => {
          const offset = getOffset(index);
          return (
          <article
            className="care-model-card"
            key={step.id}
            data-active={index === activeIndex}
            aria-hidden={Math.abs(offset) > 1}
            style={{
              "--card-x": `${offset * 32}vw`,
              "--card-z": `${Math.abs(offset) * -7}rem`,
              "--card-rotation": `${offset * -18}deg`,
              "--card-scale": Math.max(0.72, 1 - Math.abs(offset) * 0.07),
              "--card-opacity": Math.max(0.18, 1 - Math.abs(offset) * 0.22),
            } as CSSProperties}
            onClick={() => {
              if (!didDrag.current) setActiveIndex(index);
              didDrag.current = false;
            }}
          >
              <img
                className="care-model-card__image"
                src={step.image}
                alt={step.imageAlt}
                width={640}
                height={400}
                loading="lazy"
                decoding="async"
              />
              <div className="care-model-card__overlay" aria-hidden="true" />
              <div className="care-model-card__content">
                <span className="care-model-card__step">{step.step}</span>
                <h3 className="care-model-card__title">{step.title}</h3>
              </div>
            </article>
          );
        })}
        </div>

        <button
          className="care-model-section__arrow care-model-section__arrow--previous"
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => move(-1)}
          aria-label="Previous care model step"
        >
          ‹
        </button>
        <button
          className="care-model-section__arrow care-model-section__arrow--next"
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => move(1)}
          aria-label="Next care model step"
        >
          ›
        </button>
      </div>

      <div className="care-model-section__dots" aria-label="Choose a care model step">
        {careModelSteps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            aria-label={`Show ${step.title}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default CareModelSection;
