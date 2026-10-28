import { usePageTitle } from "../hooks/usePageTitle";
import Navbar from "../components/Navbar";
import ContactForm from "../components/contact/ContactForm";
import ContactFaqSection from "../components/contact/ContactFaqSection";
import ContactHero from "../components/contact/ContactHero";
import ContactPatientSection from "../components/contact/ContactPatientSection";
import ContactQuickLinks from "../components/contact/ContactQuickLinks";
import ContactSectionHeader from "../components/contact/ContactSectionHeader";
import SiteFooter from "../components/layout/SiteFooter";
import ServicesCtaSection from "../components/services/ServicesCtaSection";
import ScrollReveal from "../components/home/ScrollReveal";
import {
  contactCta,
  contactInfo,
  emergencyContact,
  mapEmbedUrl,
} from "../data/contactData";
import "../styles/about.css";
import "../styles/contact.css";
import "../styles/home.css";
import "../styles/services.css";

function ContactPage() {
  usePageTitle("Contact Us");

  return (
    <div className="contact-page flex min-h-svh flex-col">
      <Navbar />

      <main className="contact-page__main flex-1">
        <ContactHero />
        <ContactQuickLinks />

        <section
          className="contact-band contact-band--info why-choose-section"
          aria-labelledby="contact-info-heading"
        >
          <div className="contact-section__inner">
            <ScrollReveal>
              <ContactSectionHeader
                id="contact-info-heading"
                eyebrow="Contact details"
                titleLead="How to"
                titleAccent="reach us"
                description="Visit our clinic, call our support lines, or send us an email. We're here for your healthcare needs."
              />
            </ScrollReveal>

            <div className="contact-unorthodox-grid">
              <ScrollReveal delay={0} className="h-full">
                <article className="contact-info-card contact-unorthodox-card" data-index="01">
                  <span className="contact-info-card__icon" aria-hidden="true">📍</span>
                  <h3 className="contact-info-card__title">Address</h3>
                  <address className="contact-info-card__body">
                    {contactInfo.address.lines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </address>
                  <p className="contact-info-card__parking">
                    {contactInfo.address.parking}
                  </p>
                </article>
              </ScrollReveal>

              <ScrollReveal delay={80} className="h-full">
                <article className="contact-info-card contact-unorthodox-card" data-index="02">
                  <span className="contact-info-card__icon" aria-hidden="true">📞</span>
                  <h3 className="contact-info-card__title">Phone &amp; WhatsApp</h3>
                  <ul className="contact-info-card__list">
                    {contactInfo.phones.map((phone) => (
                      <li key={phone.href}>
                        <span className="contact-info-card__meta">{phone.label}</span>
                        <a href={phone.href}>{phone.value}</a>
                      </li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>

              <ScrollReveal delay={160} className="h-full">
                <article className="contact-info-card contact-unorthodox-card" data-index="03">
                  <span className="contact-info-card__icon" aria-hidden="true">✉️</span>
                  <h3 className="contact-info-card__title">Email</h3>
                  <ul className="contact-info-card__list">
                    {contactInfo.emails.map((item) => (
                      <li key={item.href}>
                        <span className="contact-info-card__meta">{item.label}</span>
                        <a href={item.href}>{item.value}</a>
                      </li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>

              <ScrollReveal delay={240} className="h-full">
                <article className="contact-info-card contact-unorthodox-card" data-index="04">
                  <span className="contact-info-card__icon" aria-hidden="true">🕐</span>
                  <h3 className="contact-info-card__title">Working hours</h3>
                  <ul className="contact-info-card__hours">
                    {contactInfo.hours.map((slot) => (
                      <li key={slot.day}>
                        <span>{slot.day}</span>
                        <strong>{slot.time}</strong>
                      </li>
                    ))}
                  </ul>
                  <p className="contact-info-card__languages">
                    Services in {contactInfo.languages}
                  </p>
                </article>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <ContactPatientSection />
        <ContactFaqSection />

        <section
          className="contact-band contact-band--form why-choose-section home-section--alt"
          aria-labelledby="contact-form-heading"
        >
          <div className="contact-section__inner">
            <div className="contact-form-layout">
              <ScrollReveal>
                <div className="contact-form-intro">
                  <ContactSectionHeader
                    id="contact-form-heading"
                    align="left"
                    eyebrow="Send a message"
                    titleLead="Contact our"
                    titleAccent="team"
                    description="Fill in the form and a member of our patient support team will get back to you shortly."
                  />
                  <ul className="contact-form-notes">
                    <li>Typical response within 24 hours on business days</li>
                    <li>For urgent appointments, use online channeling</li>
                    <li>Your information is kept confidential</li>
                  </ul>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <div className="contact-form-panel">
                  <ContactForm />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section
          className="contact-band contact-band--map why-choose-section"
          aria-labelledby="map-heading"
        >
          <div className="contact-section__inner">
            <ScrollReveal>
              <ContactSectionHeader
                id="map-heading"
                eyebrow="Find us"
                titleLead="Visit our"
                titleAccent="clinic"
                description={`Premier Care Integrative Clinic, ${contactInfo.address.lines.join(", ")}. Parking available.`}
              />
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className="contact-map">
                <iframe
                  title="PremierCare clinic location on Google Maps"
                  src={mapEmbedUrl}
                  className="contact-map__iframe"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <div className="contact-map__caption">
                  <p>
                    <strong>{contactInfo.address.lines.join(", ")}</strong>
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address.mapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-map__link"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section
          className="contact-band contact-band--emergency"
          aria-labelledby="emergency-heading"
        >
          <div className="contact-section__inner">
            <ScrollReveal>
              <div className="contact-emergency__inner">
                <div className="contact-emergency__icon" aria-hidden="true">🚨</div>
                <div className="contact-emergency__content">
                  <h2 id="emergency-heading">{emergencyContact.label}</h2>
                  <p>{emergencyContact.subtitle}</p>
                  <div className="contact-emergency__actions">
                    <a href={emergencyContact.hotlineHref} className="contact-emergency__hotline">
                      Call {emergencyContact.hotline}
                    </a>
                    <a href={emergencyContact.supportHref} className="contact-emergency__support">
                      {emergencyContact.supportLabel}: {emergencyContact.supportLine}
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <ServicesCtaSection
          headingId="contact-cta-heading"
          eyebrow={contactCta.eyebrow}
          titleLead={contactCta.titleLead}
          titleAccent={contactCta.titleAccent}
          description={contactCta.description}
          watermark={contactCta.watermark}
          primaryLabel={contactCta.primaryLabel}
          secondaryLabel={contactCta.secondaryLabel}
          secondaryHref={contactCta.secondaryHref}
        />
      </main>

      <SiteFooter />
    </div>
  );
}

export default ContactPage;
