import { patientVisitInfo } from "../../data/siteContent";
import ScrollReveal from "../home/ScrollReveal";
import ContactSectionHeader from "./ContactSectionHeader";

function ContactPatientSection() {
  return (
    <section
      className="contact-band contact-band--patient why-choose-section home-section--alt"
      id="patient-info"
      aria-labelledby="contact-patient-heading"
    >
      <div className="contact-section__inner">
        <ScrollReveal>
          <ContactSectionHeader
            id="contact-patient-heading"
            eyebrow={patientVisitInfo.eyebrow}
            titleLead="Prepare for"
            titleAccent="your visit"
            description={patientVisitInfo.intro}
          />
        </ScrollReveal>

        <div className="contact-patient-grid contact-unorthodox-grid contact-unorthodox-grid--2">
          <ScrollReveal delay={0}>
            <article className="contact-patient-card contact-unorthodox-card" data-index="01">
              <span className="contact-patient-card__step" aria-hidden="true">01</span>
              <h3>{patientVisitInfo.beforeTitle}</h3>
              <p>{patientVisitInfo.beforeIntro}</p>
              <ul>
                {patientVisitInfo.beforeItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </ScrollReveal>

          <ScrollReveal delay={90}>
            <article className="contact-patient-card contact-unorthodox-card" data-index="02">
              <span className="contact-patient-card__step" aria-hidden="true">02</span>
              <h3>{patientVisitInfo.duringTitle}</h3>
              <p>{patientVisitInfo.duringText}</p>
              <h3 className="contact-patient-card__subhead">
                {patientVisitInfo.privacyTitle}
              </h3>
              <p>{patientVisitInfo.privacyText}</p>
            </article>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={160}>
          <div className="contact-patient-note" role="note">
            <strong>New patient note:</strong> {patientVisitInfo.newPatientNote}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default ContactPatientSection;
