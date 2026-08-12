import { Link } from "react-router-dom";
import { welcomeSection } from "../../data/siteContent";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

function WelcomeSection() {
  return (
    <section className="home-section welcome-section" id="welcome" aria-labelledby="welcome-heading">
      <div className="welcome-section__grid">
        <ScrollReveal>
          <div className="welcome-section__intro">
            <SectionHeader
              eyebrow={welcomeSection.eyebrow}
              title={welcomeSection.title}
              description={welcomeSection.lead}
              align="left"
            />
            <div className="welcome-section__media">
              <img
                className="welcome-section__image"
                src={welcomeSection.image}
                alt={welcomeSection.imageAlt}
                width={640}
                height={480}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <div className="welcome-section__body">
            {welcomeSection.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="welcome-section__text">
                {paragraph}
              </p>
            ))}

            <div className="welcome-section__disciplines">
              <p className="welcome-section__text">
                {welcomeSection.disciplinesIntro}
              </p>
              <ul className="welcome-section__list" aria-label="Healthcare disciplines">
                {welcomeSection.disciplines.map((item) => (
                  <li key={item} className="welcome-section__list-item">
                    <span className="welcome-section__list-mark" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/about"
              className="home-btn home-btn--outline welcome-section__cta"
            >
              Learn About Our Approach
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default WelcomeSection;
