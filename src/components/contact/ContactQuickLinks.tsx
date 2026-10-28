import { Link } from "react-router-dom";
import { contactQuickLinks } from "../../data/contactData";
import ScrollReveal from "../home/ScrollReveal";
import ContactSectionHeader from "./ContactSectionHeader";

function ContactQuickLinks() {
  return (
    <section
      className="contact-band contact-band--quick why-choose-section"
      aria-labelledby="contact-quick-heading"
    >
      <div className="contact-section__inner">
        <ScrollReveal>
          <ContactSectionHeader
            id="contact-quick-heading"
            eyebrow="Quick actions"
            titleLead="Start"
            titleAccent="here"
            description="Book online, find a practitioner, or manage an existing appointment."
          />
        </ScrollReveal>
        <div className="contact-quick-links contact-unorthodox-row">
          {contactQuickLinks.map((item, index) => (
            <ScrollReveal key={item.href} delay={index * 70} className="h-full">
              <Link to={item.href} className="contact-quick-link">
                <span className="contact-quick-link__icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="contact-quick-link__text">
                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                </span>
                <span className="contact-quick-link__arrow" aria-hidden="true">→</span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactQuickLinks;
