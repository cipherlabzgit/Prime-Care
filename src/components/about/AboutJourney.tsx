import { aboutJourney } from "../../data/aboutData";

function AboutJourney() {
  return (
    <section className="about-section about-journey" aria-labelledby="about-journey-heading">
      <div className="about-section__header">
        <p className="about-section__eyebrow">Our Integrated Care Model</p>
        <h2 id="about-journey-heading" className="about-section__title">
          From Assessment to Thriving
        </h2>
        <p className="about-section__subtitle">
          Our care philosophy guides every patient journey — Assess, Understand, Personalize,
          Treat &amp; Support, Prevent, and Thrive.
        </p>
      </div>
      <ol className="about-journey__timeline">
        {aboutJourney.map((milestone, index) => (
          <li key={milestone.year} className="about-journey__item">
            <div className="about-journey__marker" aria-hidden="true">
              <span className="about-journey__dot" />
              {index < aboutJourney.length - 1 ? (
                <span className="about-journey__line" />
              ) : null}
            </div>
            <div className="about-journey__content">
              <span className="about-journey__year">{milestone.year}</span>
              <h3 className="about-journey__title">{milestone.title}</h3>
              <p className="about-journey__description">{milestone.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default AboutJourney;
