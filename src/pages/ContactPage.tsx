import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import Navbar from "../components/Navbar";
import ContactForm from "../components/contact/ContactForm";
import SiteFooter from "../components/layout/SiteFooter";
import FaqSection from "../components/home/FaqSection";
import PatientInfoSection from "../components/home/PatientInfoSection";
import ScrollReveal from "../components/home/ScrollReveal";
import SectionHeader from "../components/home/SectionHeader";
import {
  contactHero,
  contactInfo,
  emergencyContact,
  mapEmbedUrl,
} from "../data/contactData";
import "../styles/contact.css";
import "../styles/home.css";

function ContactHeroVisual() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="contact-hero__visual" aria-hidden="true">
      <div className="contact-hero__image-shell">
        {!imageError ? (
          <img
            className="contact-hero__image"
            src="/images/hero-consultation.png"
            alt=""
            width={560}
            height={480}
            loading="eager"
            decoding="async"
            onError={() => setImageError(true)}
          />
        ) : null}
        <div
          className={`contact-hero__image-fallback${
            imageError ? " contact-hero__image-fallback--visible" : ""
          }`}
        >
          <span className="contact-hero__fallback-icon">🏥</span>
          <span>Patient Support</span>
        </div>
        <div className="contact-hero__image-overlay" />
      </div>
      <div className="contact-hero__float contact-hero__float--support">
        <span aria-hidden="true">💬</span>
        <div>
          <strong>Live Support</strong>
          <span>Mon – Sat</span>
        </div>
      </div>
      <div className="contact-hero__float contact-hero__float--booking">
        <span aria-hidden="true">📅</span>
        <div>
          <strong>24/7 Booking</strong>
          <span>Online channeling</span>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  usePageTitle("Contact Us");
  return (
    <div className="contact-page flex min-h-svh flex-col">
      <Navbar />

      <section className="contact-hero" aria-labelledby="contact-hero-heading">
        <div className="contact-hero__pattern" aria-hidden="true" />
        <div className="contact-hero__layout">
          <div className="contact-hero__content">
            <ScrollReveal>
              <span className="contact-hero__eyebrow">{contactHero.eyebrow}</span>
              <h1 id="contact-hero-heading" className="contact-hero__title">
                {contactHero.title}
              </h1>
              <p className="contact-hero__description">{contactHero.description}</p>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={120}>
            <ContactHeroVisual />
          </ScrollReveal>
        </div>
      </section>

      <section className="home-section" aria-labelledby="contact-info-heading">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Contact Details"
            title="How to Reach Us"
            description="Visit our clinic, call our support lines, or send us an email — we're here for your healthcare needs."
          />
        </ScrollReveal>
        <div className="contact-info-grid">
          <ScrollReveal delay={0}>
            <article className="contact-info-card">
              <span className="contact-info-card__icon" aria-hidden="true">
                📍
              </span>
              <h2 className="contact-info-card__title">Address</h2>
              <address className="contact-info-card__body">
                {contactInfo.address.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
              <p className="contact-info-card__parking">{contactInfo.address.parking}</p>
            </article>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <article className="contact-info-card">
              <span className="contact-info-card__icon" aria-hidden="true">
                📞
              </span>
              <h2 className="contact-info-card__title">Phone &amp; WhatsApp</h2>
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

          <ScrollReveal delay={160}>
            <article className="contact-info-card">
              <span className="contact-info-card__icon" aria-hidden="true">
                ✉️
              </span>
              <h2 className="contact-info-card__title">Email Addresses</h2>
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

          <ScrollReveal delay={240}>
            <article className="contact-info-card">
              <span className="contact-info-card__icon" aria-hidden="true">
                🕐
              </span>
              <h2 className="contact-info-card__title">Working Hours</h2>
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
      </section>

      <PatientInfoSection />

      <FaqSection />

      <section className="home-section home-section--alt" aria-labelledby="contact-form-heading">
        <div className="contact-form-layout">
          <ScrollReveal>
            <div className="contact-form-intro">
              <SectionHeader
                align="left"
                eyebrow="Send a Message"
                title="Contact Our Team"
                description="Fill in the form below and a member of our patient support team will get back to you shortly."
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
      </section>

      <section className="home-section" aria-labelledby="map-heading">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Find Us"
            title="Visit Our Clinic"
            description={`Premier Care Integrative Clinic — ${contactInfo.address.lines.join(", ")}. Parking available.`}
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
      </section>

      <section className="contact-emergency" aria-labelledby="emergency-heading">
        <div className="contact-emergency__inner">
          <div className="contact-emergency__icon" aria-hidden="true">
            🚨
          </div>
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
      </section>

      <SiteFooter />
    </div>
  );
}

export default ContactPage;
