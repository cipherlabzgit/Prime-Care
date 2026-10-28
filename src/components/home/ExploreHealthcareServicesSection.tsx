import { landingPages } from "../../data/landingPagesData";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";
import HealthcareServiceDiscoveryCard from "./HealthcareServiceDiscoveryCard";

function ExploreHealthcareServicesSection() {
  return (
    <section
      className="home-section home-section--alt explore-services-section"
      id="healthcare-services"
      aria-labelledby="explore-services-heading"
    >
      <ScrollReveal>
        <SectionHeader
          eyebrow="Integrative care"
          title="Explore Our Healthcare Services"
          titleId="explore-services-heading"
          description="Discover focused support pathways at Premier Care — each designed around personalised, multidisciplinary care."
        />
      </ScrollReveal>

      <div className="home-grid home-grid--discovery">
        {landingPages.map((page, index) => (
          <ScrollReveal key={page.id} delay={index * 50}>
            <HealthcareServiceDiscoveryCard page={page} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default ExploreHealthcareServicesSection;
