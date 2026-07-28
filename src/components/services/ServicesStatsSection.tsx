import { servicesStatistics } from "../../data/servicesData";
import { useCountUp } from "../../hooks/useCountUp";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import ScrollReveal from "../home/ScrollReveal";

function AnimatedStat({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  const { ref, isVisible } = useScrollReveal<HTMLLIElement>();
  const display = useCountUp(value, isVisible);

  return (
    <li
      ref={ref}
      className={`stat-item stat-item--animated home-reveal ${isVisible ? "home-reveal--visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="stat-item__value">{display}</span>
      <span className="stat-item__label">{label}</span>
    </li>
  );
}

function ServicesStatsSection() {
  return (
    <section className="stats-section" aria-label="PremierCare service statistics">
      <div className="stats-section__glow" aria-hidden="true" />
      <div className="stats-section__inner">
        <ScrollReveal>
          <p className="stats-section__eyebrow">Care at Scale</p>
        </ScrollReveal>
        <ul className="stats-grid">
          {servicesStatistics.map((stat, index) => (
            <AnimatedStat
              key={stat.id}
              value={stat.value}
              label={stat.label}
              delay={index * 100}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ServicesStatsSection;
