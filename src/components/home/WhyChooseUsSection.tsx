import { features, whyChooseSection } from "../../data/homeData";
import FeatureCard from "./FeatureCard";
import ScrollReveal from "./ScrollReveal";

function WhyChooseUsSection() {
  return (
    <section
      className="home-section home-section--alt why-choose-section"
      id="why-choose"
      aria-labelledby="why-heading"
    >
      <ScrollReveal>
        <header className="why-choose-section__header">
          <span className="section-header__eyebrow">{whyChooseSection.eyebrow}</span>
          <h2 id="why-heading" className="why-choose-section__title">
            <span>Healthcare Designed</span>
            <span>Around the Whole You</span>
          </h2>
        </header>
      </ScrollReveal>
      <div className="why-choose-section__grid">
        {features.map((feature, index) => (
          <ScrollReveal key={feature.id} delay={index * 80}>
            <FeatureCard feature={feature} index={index} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUsSection;
