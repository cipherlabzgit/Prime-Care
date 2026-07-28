import { coreValues } from "../../data/aboutData";
import ScrollReveal from "../home/ScrollReveal";

function CoreValuesSection() {
  return (
    <section
      className="about-section about-values"
      aria-labelledby="core-values-heading"
    >
      <div className="about-section__header">
        <p className="about-section__eyebrow">Our Core Values</p>
        <h2 id="core-values-heading" className="about-section__title">
          What Guides Our Care Every Day
        </h2>
      </div>
      <div className="about-values__grid">
        {coreValues.map((value, index) => (
          <ScrollReveal key={value.id} delay={index * 50}>
            <article className="about-feature-card">
              <span className="about-feature-card__icon" aria-hidden="true">
                {value.icon}
              </span>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default CoreValuesSection;
