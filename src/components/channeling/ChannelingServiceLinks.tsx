import { Link } from "react-router-dom";
import { getHomeServiceCards } from "../../data/servicesData";
import { MY_BOOKINGS_URL } from "../../utils/bookingNavigation";

const links = getHomeServiceCards();

function ChannelingServiceLinks() {
  return (
    <section
      className="channeling-service-links"
      aria-labelledby="channeling-services-heading"
    >
      <h2 id="channeling-services-heading" className="sr-only">
        Our services
      </h2>
      <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
        <Link
          to={MY_BOOKINGS_URL}
          className="inline-flex items-center rounded-full border border-brand-300 bg-white px-4 py-2 text-sm font-bold text-brand-700 shadow-sm transition hover:border-brand-500 hover:bg-brand-50"
        >
          My Bookings
        </Link>
        <span className="text-sm text-slate-500">
          Check ongoing number, receipt, or resend SMS
        </span>
      </div>
      <ul className="channeling-service-links__list">
        {links.map((service) => (
          <li key={service.id}>
            <Link
              to={`/services#${service.slug}`}
              className="channeling-service-links__item"
            >
              <span className="channeling-service-links__icon" aria-hidden="true">
                {service.icon}
              </span>
              <span className="channeling-service-links__label">{service.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ChannelingServiceLinks;
