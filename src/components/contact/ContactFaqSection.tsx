import { useState } from "react";
import { faqItems } from "../../data/siteContent";
import ScrollReveal from "../home/ScrollReveal";
import ContactSectionHeader from "./ContactSectionHeader";

function ContactFaqSection() {
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  return (
    <section
      className="contact-band contact-band--faq why-choose-section"
      id="faq"
      aria-labelledby="contact-faq-heading"
    >
      <div className="contact-section__inner">
        <ScrollReveal>
          <ContactSectionHeader
            id="contact-faq-heading"
            eyebrow="FAQ"
            titleLead="Common"
            titleAccent="questions"
            description="Answers to frequent questions about appointments, services, and visiting Premier Care."
          />
        </ScrollReveal>

        <div className="contact-faq-list">
          {faqItems.map((item, index) => {
            const isOpen = openId === item.id;
            return (
              <ScrollReveal key={item.id} delay={index * 45}>
                <article
                  className={`contact-faq-item${isOpen ? " contact-faq-item--open" : ""}`}
                >
                  <button
                    type="button"
                    className="contact-faq-item__question"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                  >
                    <span>{item.question}</span>
                    <span className="contact-faq-item__toggle" aria-hidden="true" />
                  </button>
                  <div className="contact-faq-item__answer-wrap">
                    <div className="contact-faq-item__answer">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ContactFaqSection;
