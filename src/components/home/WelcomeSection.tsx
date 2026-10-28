import { Link } from "react-router-dom";
import { welcomeSection } from "../../data/siteContent";
import { DarkGradientBg } from "../ui/elegant-dark-pattern";
import ScrollReveal from "./ScrollReveal";

const FEATURED_COUNT = 6;

function WelcomeSection() {
  const [lead, accent] = welcomeSection.title.split(" ");
  const disciplines = welcomeSection.disciplines.slice(0, FEATURED_COUNT);

  return (
    <section className="home-section welcome-section" id="welcome" aria-labelledby="welcome-heading">
      <DarkGradientBg className="welcome-section__background" aria-hidden="true" />
      <div className="welcome-section__panel">
        <ScrollReveal>
          <h2 id="welcome-heading" className="welcome-section__title">
            <span>{lead}</span>
            {accent ? <span className="welcome-section__title-accent">{accent}</span> : null}
          </h2>
        </ScrollReveal>

        <div className="welcome-section__stage">
          <ScrollReveal className="welcome-section__copy">
            {welcomeSection.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </ScrollReveal>

          <ScrollReveal className="welcome-section__media" delay={60}>
            <img
              className="welcome-section__image"
              src={welcomeSection.image}
              alt={welcomeSection.imageAlt}
              width={1400}
              height={2102}
              loading="lazy"
              decoding="async"
            />
          </ScrollReveal>

          <ScrollReveal className="welcome-section__side" delay={100}>
            <ul className="welcome-section__list" aria-label="Healthcare disciplines">
              {disciplines.map((item, index) => (
                <li key={item}>
                  <span className="welcome-section__index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/services" className="welcome-section__more">
              More
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export default WelcomeSection;
