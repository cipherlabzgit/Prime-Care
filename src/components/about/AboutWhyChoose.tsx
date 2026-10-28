import { aboutWhyChoose } from "../../data/aboutData";
import ScrollReveal from "../home/ScrollReveal";

function AboutWhyChoose() {
  return (
    <section
      className="why-choose-section home-section about-why-choose-section"
      id="why-choose"
      aria-labelledby="about-why-heading"
    >
      <ScrollReveal>
        <header className="why-choose-section__header">
          <span className="section-header__eyebrow">Why Premier Care?</span>
          <h2 id="about-why-heading" className="why-choose-section__title">
            <span>Healthcare Designed</span>
            <span>Around You</span>
          </h2>
        </header>
      </ScrollReveal>

      <div className="why-choose-section__grid">
        {aboutWhyChoose.map((item, index) => (
          <ScrollReveal key={item.id} delay={index * 80}>
            <article className="feature-card" data-index={`0${index + 1}`}>
              <div className="feature-card__icon">
                <span aria-hidden="true" style={{ fontSize: "1.6rem" }}>{item.icon}</span>
              </div>
              <h3 className="feature-card__title">{item.title}</h3>
              <p className="feature-card__desc">{item.description}</p>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default AboutWhyChoose;
