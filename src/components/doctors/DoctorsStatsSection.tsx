import { doctorsStatistics } from "../../data/doctorsData";
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

function DoctorsStatsSection() {
  return (
    <section className="svc-stats doctors-stats" aria-label="Clinic highlights">
      <div className="svc-stats__glow" aria-hidden="true" />
      <div className="svc-stats__inner">
        <ScrollReveal className="svc-stats__header">
          <p className="svc-stats__eyebrow">Premier Care team</p>
          <h2 className="svc-stats__title">
            <span>Trusted</span>
            <span className="svc-stats__title-accent">Practitioners</span>
          </h2>
          <p className="svc-stats__sub">
            Integrative specialists working together under one clinic roof.
          </p>
        </ScrollReveal>

        <ul className="svc-stats__grid">
          {doctorsStatistics.map((stat, index) => (
            <AnimatedStatCard
              key={stat.id}
              value={stat.value}
              label={stat.label}
              delay={index * 90}
              index={index}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default DoctorsStatsSection;
