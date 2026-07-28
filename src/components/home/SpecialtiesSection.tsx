import { Link } from "react-router-dom";
import { services, specialtiesSection } from "../../data/homeData";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";
import ServiceCard from "./ServiceCard";

function SpecialtiesSection() {
  return (
    <section className="home-section" id="services" aria-labelledby="services-heading">
      <ScrollReveal>
        <SectionHeader
          eyebrow={specialtiesSection.eyebrow}
          title={specialtiesSection.title}
          description={specialtiesSection.description}
        />
      </ScrollReveal>
      <div className="home-grid home-grid--3">
        {services.map((service, index) => (
          <ScrollReveal key={service.id} delay={index * 60}>
            <ServiceCard service={service} />
          </ScrollReveal>
        ))}
      </div>
      <ScrollReveal delay={200}>
        <div className="home-section__cta">
          <Link to="/services" className="home-btn home-btn--primary">
            {specialtiesSection.cta}
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default SpecialtiesSection;
