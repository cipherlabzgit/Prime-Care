import { Link } from "react-router-dom";
import SectionHeader from "./SectionHeader";

function AboutPreview() {
  return (
    <section className="home-section about-preview" id="about" aria-labelledby="about-heading">
      <div className="about-preview__grid">
        <div className="about-preview__content">
          <SectionHeader
            eyebrow="About PremierCare"
            title="Integrative Healthcare for Modern Life"
            description="PremierCare Integrative Clinic connects patients with trusted hospital partners and specialist doctors through a seamless digital channeling experience. We combine clinical excellence with compassionate, patient-centered care."
            align="left"
          />
          <p className="about-preview__text">
            Whether you need a routine consultation or specialized treatment, our
            network of medical centers and verified physicians ensures you receive
            timely, quality care—backed by transparent booking and dedicated support.
          </p>
          <Link to="/channeling" className="home-btn home-btn--primary" id="learn-more">
            Book Your Visit
          </Link>
        </div>
        <div className="about-preview__visual" aria-hidden="true">
          <div className="about-preview__card">
            <span className="about-preview__stat">15+</span>
            <span>Years of clinical partnerships</span>
          </div>
          <div className="about-preview__card about-preview__card--accent">
            <span className="about-preview__stat">100%</span>
            <span>Commitment to patient safety</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutPreview;
