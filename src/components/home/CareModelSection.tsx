import { careModelSteps } from "../../data/siteContent";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

function CareModelSection() {
  return (
    <section
      className="home-section home-section--alt care-model-section"
      id="care-model"
      aria-labelledby="care-model-heading"
    >
      <ScrollReveal>
        <SectionHeader
          eyebrow="Our Integrated Care Model"
          title="We Look Beyond the Symptom"
        />
      </ScrollReveal>

      <div className="care-model-section__grid">
        {careModelSteps.map((step, index) => (
          <ScrollReveal key={step.id} delay={index * 60}>
            <article className="care-model-card">
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
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default CareModelSection;
