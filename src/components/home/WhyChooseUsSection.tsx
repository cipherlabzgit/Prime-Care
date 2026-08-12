import { features, whyChooseSection } from "../../data/homeData";
import FeatureCard from "./FeatureCard";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

function WhyChooseUsSection() {
  return (
    <section
      className="home-section home-section--alt"
      id="why-choose"
      aria-labelledby="why-heading"
    >
      <ScrollReveal>
        <SectionHeader
          eyebrow={whyChooseSection.eyebrow}
          title={whyChooseSection.title}
        />
      </ScrollReveal>
      <div className="home-grid home-grid--4">
        {features.map((feature, index) => (
          <ScrollReveal key={feature.id} delay={index * 80}>
            <FeatureCard feature={feature} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUsSection;
