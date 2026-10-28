import { Link } from "react-router-dom";
import type { LandingPageConfig } from "../../types/landingPage";
import { usePageTitle } from "../../hooks/usePageTitle";
import LandingHeader from "./LandingHeader";
import LandingEnquiryForm from "./LandingEnquiryForm";
import Button from "../ui/Button";

interface CampaignLandingPageProps {
  config: LandingPageConfig;
}

function scrollToEnquiry() {
  document.getElementById("landing-enquiry")?.scrollIntoView({ behavior: "smooth" });
}

const TITLE_LINES: Record<string, [string, string]> = {
  "Helping Children Develop, Communicate & Thrive": ["Helping Children", "Develop & Thrive"],
  "Is Your Child Experiencing Developmental Challenges?": ["Developmental", "Challenges?"],
  "The Right Support, Under One Roof": ["The Right Support,", "Under One Roof"],
  "Support Built Around Your Child": ["Support Built", "Around Your Child"],
  "Concerned About Your Child's Development?": ["Concerned About", "Your Child?"],
  "Move Better. Recover Better. Live Better.": ["Move Better.", "Live Better."],
  "Is Pain or Reduced Mobility Affecting You?": ["Pain or Reduced", "Mobility?"],
  "Physiotherapy & Physical Rehabilitation": ["Physiotherapy &", "Rehabilitation"],
  "Care That Looks Beyond the Symptom": ["Care That Looks", "Beyond the Symptom"],
  "Ready to Take the Next Step?": ["Ready to Take", "the Next Step?"],
  "Your Mental Wellbeing Matters": ["Your Mental", "Wellbeing Matters"],
  "You May Be Looking for Support If You're Experiencing:": ["Looking for", "Support?"],
  "Professional Support for Your Wellbeing": ["Professional Support", "for Wellbeing"],
  "Support That Starts With You": ["Support That", "Starts With You"],
  "Ready to Talk?": ["Ready", "to Talk?"],
  "Healthcare That Looks Beyond the Symptom": ["Healthcare That", "Looks Beyond"],
  "Looking for a More Holistic Approach?": ["A More Holistic", "Approach?"],
  "Personalised Integrative Care": ["Personalised", "Integrative Care"],
  "One Clinic. Multiple Disciplines.": ["One Clinic.", "Multiple Disciplines."],
  "Looking for a More Personalised Approach?": ["A More Personalised", "Approach?"],
  "Better Nutrition Starts With Understanding Your Needs": ["Better Nutrition", "Starts With You"],
  "Looking for Support With Your Nutrition?": ["Support With", "Your Nutrition?"],
  "Personalised Nutrition & Lifestyle Support": ["Nutrition &", "Lifestyle Support"],
  "Nutrition That's Built Around You": ["Nutrition Built", "Around You"],
  "Ready to Take a More Personalised Approach?": ["A More Personalised", "Approach?"],
};

function splitTitle(text: string): [string, string] {
  const known = TITLE_LINES[text];
  if (known) return known;
  const words = text.replace(/[?]$/, "").split(" ");
  const mid = Math.max(1, Math.ceil(words.length / 2));
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ") || ""];
}

function LandingBigTitle({
  id,
  text,
  left = false,
}: {
  id?: string;
  text: string;
  left?: boolean;
}) {
  const [lead, accent] = splitTitle(text);
  return (
    <h2 id={id} className={`home-big-title home-big-title--compact${left ? " home-big-title--left" : ""}`}>
      <span>{lead}</span>
      {accent ? <span>{accent}</span> : null}
    </h2>
  );
}

function CampaignLandingPage({ config }: CampaignLandingPageProps) {
  usePageTitle(config.seoTitle);

  return (
    <div className="landing-page">
      <LandingHeader />

      <section className="landing-hero" aria-labelledby="landing-hero-title">
        <div className="landing-hero__inner">
          <div className="landing-hero__copy">
            <p className="section-header__eyebrow landing-hero__eyebrow">Premier Care Integrative Clinic</p>
            <h1 id="landing-hero-title" className="home-big-title home-big-title--compact home-big-title--left landing-hero__title">
              <span>{splitTitle(config.heroTitle)[0]}</span>
              <span>{splitTitle(config.heroTitle)[1]}</span>
            </h1>
            <p className="landing-hero__subtitle section-header__desc">{config.heroSubtitle}</p>
            <div className="landing-hero__actions">
              <Button type="button" variant="accent" onClick={scrollToEnquiry}>
                {config.ctaButtonLabel}
              </Button>
              <Link to={config.learnMoreHref} className="landing-hero__learn">
                {config.learnMoreLabel}
              </Link>
            </div>
          </div>
          <div className="landing-hero__media">
            <img
              src={config.heroImage}
              alt={config.heroImageAlt}
              className="landing-hero__image"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="landing-section landing-challenges" aria-labelledby="landing-challenges-title">
        <div className="landing-section__inner">
          <header className="section-header section-header--center landing-section__header">
            <span className="section-header__eyebrow">Your concerns</span>
            <LandingBigTitle id="landing-challenges-title" text={config.challengesTitle} />
            {config.challengesIntro ? (
              <p className="section-header__desc">{config.challengesIntro}</p>
            ) : null}
          </header>
          <ul className="landing-challenges__list">
            {config.challenges.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {config.id === "child-development" ? (
            <p className="landing-section__note">
              Every child is different. Understanding the need is the first step.
            </p>
          ) : null}
          {config.id === "mental-wellbeing" ? (
            <p className="landing-section__note">
              You don&apos;t have to have everything figured out before asking for support.
            </p>
          ) : null}
        </div>
      </section>

      <section className="landing-section landing-disciplines" aria-labelledby="landing-disciplines-title">
        <div className="landing-section__inner">
          <header className="section-header section-header--center landing-section__header">
            <span className="section-header__eyebrow">Disciplines</span>
            <LandingBigTitle id="landing-disciplines-title" text={config.disciplinesTitle} />
          </header>
          <div className="landing-disciplines__grid">
            {config.disciplines.map((card, index) => (
              <article key={card.title} className="landing-discipline-card feature-card">
                <span className="landing-discipline-card__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="landing-discipline-card__title">{card.title}</h3>
                <p className="landing-discipline-card__text">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-why" aria-labelledby="landing-why-title">
        <div className="landing-why__inner">
          <span className="section-header__eyebrow landing-why__label">Why Premier Care?</span>
          <LandingBigTitle id="landing-why-title" text={config.whyTitle} />
          <p className="landing-why__body section-header__desc">{config.whyBody}</p>
          <p className="landing-why__tagline">{config.whyTagline}</p>
        </div>
      </section>

      <section className="landing-cta-band" aria-labelledby="landing-cta-title">
        <div className="landing-cta-band__inner">
          <LandingBigTitle id="landing-cta-title" text={config.ctaTitle} />
          <p className="landing-cta-band__text section-header__desc">{config.ctaDescription}</p>
          <Button type="button" variant="primary" onClick={scrollToEnquiry}>
            {config.ctaButtonLabel}
          </Button>
        </div>
      </section>

      <section
        id="landing-enquiry"
        className="landing-section landing-enquiry"
        aria-labelledby="landing-form-heading"
      >
        <div className="landing-section__inner landing-enquiry__layout">
          <div className="landing-enquiry__aside">
            <LandingBigTitle id="landing-form-heading" text="Request a Consultation" left />
            <p className="landing-enquiry__aside-text">
              Complete the form and our team will follow up to help you access the right support at
              Premier Care.
            </p>
            <Link to={config.learnMoreHref} className="landing-enquiry__learn-link">
              {config.learnMoreLabel} →
            </Link>
          </div>
          <LandingEnquiryForm config={config} />
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <p>© {new Date().getFullYear()} Premier Care Integrative Clinic</p>
          <Link to="/">premiercare.lk</Link>
        </div>
      </footer>
    </div>
  );
}

export default CampaignLandingPage;
