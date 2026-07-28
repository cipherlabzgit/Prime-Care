import { Link } from "react-router-dom";
import type { ServiceItem } from "../../types/home";

interface ServiceCardProps {
  service: ServiceItem;
}

function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      to={`/services#${service.slug}`}
      className="service-card service-card--link"
      aria-label={`Learn more about ${service.name}`}
    >
      <span className="service-card__icon" aria-hidden="true">
        {service.icon}
      </span>
      <h3 className="service-card__title">{service.name}</h3>
      <p className="service-card__desc">{service.description}</p>
      <span className="service-card__more">View details →</span>
    </Link>
  );
}

export default ServiceCard;
