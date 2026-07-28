import { features } from "../../data/homeData";
import FeatureCard from "./FeatureCard";
import SectionHeader from "./SectionHeader";

function FeaturesSection() {
  return (
    <section className="home-section" id="features" aria-labelledby="features-heading">
      <SectionHeader
        eyebrow="Why PremierCare"
        title="Care You Can Trust"
        description="Integrated healthcare designed around your comfort, safety, and schedule."
      />
      <div className="home-grid home-grid--3">
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;
