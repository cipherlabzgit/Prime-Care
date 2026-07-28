import { Link } from "react-router-dom";
import { welcomeSection } from "../../data/siteContent";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

function WelcomeSection() {
  return (
    <section className="home-section welcome-section" id="welcome" aria-labelledby="welcome-heading">
      <div className="welcome-section__grid">
        <ScrollReveal>
          <SectionHeader
            eyebrow={welcomeSection.eyebrow}
            title={welcomeSection.title}
            description={welcomeSection.lead}
            align="left"
          />
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <div className="welcome-section__body">
            {welcomeSection.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="welcome-section__text">
                {paragraph}
              </p>
            ))}
            <p className="welcome-section__closing">{welcomeSection.closing}</p>
            <Link to="/about" className="home-btn home-btn--outline">
              Learn About Our Approach
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default WelcomeSection;
