import { leadershipTeam } from "../../data/aboutData";

function LeadershipTeam() {
  return (
    <section
      className="about-section about-leadership"
      aria-labelledby="about-leadership-heading"
    >
      <div className="about-section__header">
        <p className="about-section__eyebrow">Meet Our Team</p>
        <h2 id="about-leadership-heading" className="about-section__title">
          The People Behind Your Care
        </h2>
        <p className="about-section__subtitle">
          At Premier Care Integrative Clinic, we bring together practitioners from diverse
          healthcare and therapeutic disciplines who share a common commitment to compassionate,
          personalized, and professional care.
        </p>
      </div>
      <div className="about-leadership__grid">
        {leadershipTeam.map((member) => (
          <article key={member.id} className="leadership-card">
            <div className="leadership-card__avatar" aria-hidden="true">
              {member.initials}
            </div>
            <h3 className="leadership-card__name">{member.name}</h3>
            <p className="leadership-card__role">{member.role}</p>
            <p className="leadership-card__bio">{member.bio}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LeadershipTeam;
