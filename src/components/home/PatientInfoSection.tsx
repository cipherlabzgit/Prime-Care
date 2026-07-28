import { patientVisitInfo } from "../../data/siteContent";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

function PatientInfoSection() {
  return (
    <section
      className="home-section home-section--alt patient-info-section"
      id="patient-info"
      aria-labelledby="patient-info-heading"
    >
      <ScrollReveal>
        <SectionHeader
          eyebrow={patientVisitInfo.eyebrow}
          title={patientVisitInfo.title}
          description={patientVisitInfo.intro}
        />
      </ScrollReveal>

      <div className="patient-info-section__grid">
        <ScrollReveal delay={0}>
          <article className="patient-info-card">
            <h3>{patientVisitInfo.beforeTitle}</h3>
            <p>{patientVisitInfo.beforeIntro}</p>
            <ul>
              {patientVisitInfo.beforeItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <article className="patient-info-card">
            <h3>{patientVisitInfo.duringTitle}</h3>
            <p>{patientVisitInfo.duringText}</p>
            <h3>{patientVisitInfo.privacyTitle}</h3>
            <p>{patientVisitInfo.privacyText}</p>
          </article>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={160}>
        <div className="patient-info-section__note" role="note">
          <strong>New patient note:</strong> {patientVisitInfo.newPatientNote}
        </div>
      </ScrollReveal>
    </section>
  );
}

export default PatientInfoSection;
