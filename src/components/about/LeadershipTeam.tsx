import { Link } from "react-router-dom";
import { leadershipTeam } from "../../data/aboutData";
import DoctorCard from "../home/DoctorCard";
import ScrollReveal from "../home/ScrollReveal";

function LeadershipTeam() {
  return (
    <section
      className="why-choose-section home-section about-unorthodox-leadership"
      aria-labelledby="about-leadership-heading"
    >
      <ScrollReveal>
        <header className="why-choose-section__header">
          <span className="section-header__eyebrow">Meet Our Team</span>
          <h2 id="about-leadership-heading" className="why-choose-section__title">
            <span>The People</span>
            <span>Behind Your Care</span>
          </h2>
        </header>
      </ScrollReveal>

      <div className="about-leadership__grid home-grid home-grid--doctors">
        {leadershipTeam.map((member, index) => (
          <ScrollReveal key={member.id} delay={index * 100} className="h-full">
            <DoctorCard
              doctorId={member.doctorId}
              name={member.name}
              specialization={member.specialization}
              designation={member.specialties}
              experienceYears={member.yearsExperience}
              profileImage={member.image}
            />
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={180}>
        <div className="about-unorthodox-leadership__cta">
          <Link to="/doctors" className="home-btn home-btn--primary">
            See more doctors
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default LeadershipTeam;
