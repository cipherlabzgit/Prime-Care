import { services } from "../../data/homeData";
import SectionHeader from "./SectionHeader";
import ServiceCard from "./ServiceCard";

function ServicesSection() {
  return (
    <section className="home-section home-section--alt" id="services" aria-labelledby="services-heading">
      <SectionHeader
        eyebrow="Our Services"
        title="Comprehensive Medical Care"
        description="From routine check-ups to specialized treatment, we support every step of your health journey."
      />
      <div className="home-grid home-grid--3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;
