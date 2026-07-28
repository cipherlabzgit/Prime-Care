import { useState } from "react";
import { faqItems } from "../../data/siteContent";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  return (
    <section className="home-section faq-section" id="faq" aria-labelledby="faq-heading">
      <ScrollReveal>
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          description="Answers to common questions about our integrative healthcare clinic and services."
        />
      </ScrollReveal>

      <div className="faq-section__list">
        {faqItems.map((item, index) => {
          const isOpen = openId === item.id;
          return (
            <ScrollReveal key={item.id} delay={index * 40}>
              <article className={`faq-item${isOpen ? " faq-item--open" : ""}`}>
                <button
                  type="button"
                  className="faq-item__question"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  {item.question}
                  <span className="faq-item__icon" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen ? (
                  <div className="faq-item__answer">
                    <p>{item.answer}</p>
                  </div>
                ) : null}
              </article>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}

export default FaqSection;
