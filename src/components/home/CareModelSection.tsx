import { careModelSteps, carePhilosophy } from "../../data/siteContent";
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
          description="At Premier Care, we believe meaningful healthcare begins with understanding. Our care model is designed around six important steps."
        />
      </ScrollReveal>

      <div className="care-model-section__grid">
        {careModelSteps.map((step, index) => (
          <ScrollReveal key={step.id} delay={index * 60}>
            <article className="care-model-card">
              <span className="care-model-card__step" aria-hidden="true">
                {step.step}
              </span>
              <h3 className="care-model-card__title">{step.title}</h3>
              <p className="care-model-card__text">{step.description}</p>
            </article>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={200}>
        <p className="care-model-section__philosophy">
          <strong>Our Care Philosophy:</strong> {carePhilosophy}
        </p>
      </ScrollReveal>
    </section>
  );
}

export default CareModelSection;
