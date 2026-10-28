import { servicesStatistics } from "../../data/servicesData";
import { useCountUp } from "../../hooks/useCountUp";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import ScrollReveal from "../home/ScrollReveal";

function AnimatedStatCard({
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
      className={`svc-stat home-reveal ${isVisible ? "home-reveal--visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
      data-index={String(index + 1).padStart(2, "0")}
    >
      <span className="svc-stat__value">{display}</span>
      <span className="svc-stat__label">{label}</span>
    </li>
  );
}

function ServicesStatsSection() {
  return (
    <section className="svc-stats" aria-label="PremierCare service statistics">
      <div className="svc-stats__glow" aria-hidden="true" />
      <div className="svc-stats__inner">
        <ScrollReveal className="svc-stats__header">
          <p className="svc-stats__eyebrow">Care at Scale</p>
          <h2 className="svc-stats__title">
            <span>Comprehensive</span>
            <span className="svc-stats__title-accent">Healthcare</span>
          </h2>
          <p className="svc-stats__sub">
            Every discipline, every patient, every day at Premier Care
            Integrative Clinic.
          </p>
        </ScrollReveal>

        <ul className="svc-stats__grid">
          {servicesStatistics.map((stat, index) => (
            <AnimatedStatCard
              key={stat.id}
              value={stat.value}
              label={stat.label}
              delay={index * 110}
              index={index}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ServicesStatsSection;
