export type LandingFormFieldType =
  | "text"
  | "tel"
  | "email"
  | "textarea"
  | "select";

export interface LandingFormField {
  id: string;
  label: string;
  type: LandingFormFieldType;
  required?: boolean;
  options?: readonly string[];
  placeholder?: string;
  autoComplete?: string;
}

export interface LandingDisciplineCard {
  title: string;
  description: string;
}

export interface LandingPageConfig {
  id: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroImageAlt: string;
  challengesTitle: string;
  challengesIntro?: string;
  challenges: readonly string[];
  disciplinesTitle: string;
  disciplines: readonly LandingDisciplineCard[];
  whyTitle: string;
  whyBody: string;
  whyTagline: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonLabel: string;
  learnMoreHref: string;
  learnMoreLabel: string;
  formHeader: string;
  formIntro: string;
  formFields: readonly LandingFormField[];
  formSubmitLabel: string;
  formPrivacyNote?: string;
  emailSubject: string;
}

export type LandingEnquiryPayload = {
  landingId: string;
  fields: Record<string, string>;
};
