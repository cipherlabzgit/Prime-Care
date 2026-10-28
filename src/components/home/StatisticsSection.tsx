import { statistics } from "../../data/homeData";
import { useCountUp } from "../../hooks/useCountUp";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import ScrollReveal from "./ScrollReveal";

function AnimatedStat({
  value,
  label,
  delay,
  index,
}: {
  value: string;
  label: string;
  delay: number;
  index: number;
}) {
  const { ref, isVisible } = useScrollReveal<HTMLLIElement>();
  const display = useCountUp(value, isVisible);

  return (
    <li
      ref={ref}
      className={`stat-item stat-item--animated home-reveal ${isVisible ? "home-reveal--visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
      data-index={`0${index + 1}`}
    >
      <span className="stat-item__value">{display}</span>
      <span className="stat-item__label">{label}</span>
    </li>
  );
}

function StatisticsSection() {
  return (
    <section className="stats-section" aria-label="PremierCare statistics">
      <div className="stats-section__glow" aria-hidden="true" />
      <div className="stats-section__inner">
        <div className="stats-section__intro">
          <ScrollReveal>
            <header className="stats-section__header">
              <p className="stats-section__eyebrow">Our Impact</p>
              <h2 className="stats-section__title">
                <span>Care You Can</span>
                <span>Count On</span>
              </h2>
            </header>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <figure className="stats-section__photo">
              <img
                src="https://res.cloudinary.com/dbyuqt5xh/image/upload/v1790926649/Gemini_Generated_Image_mdveshmdveshmdve_nw9md4.jpg"
                alt="Doctor and patient in a compassionate consultation at Premier Care"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <span aria-hidden="true">+</span>
                Thoughtful care, measured in moments that matter.
              </figcaption>
            </figure>
          </ScrollReveal>
        </div>
        <ul className="stats-grid">
          {statistics.map((stat, index) => (
            <AnimatedStat
              key={stat.id}
              value={stat.value}
              label={stat.label}
              delay={index * 100}
              index={index}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default StatisticsSection;
