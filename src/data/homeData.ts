import type {
  FeatureItem,
  FeaturedDoctor,
  MedicalCenter,
  ServiceItem,
  StatisticItem,
  Testimonial,
} from "../types/home";
import { clinicInfo } from "./siteContent";
import { getHomeServiceCards } from "./servicesData";

export const features: FeatureItem[] = [
  {
    id: "holistic",
    title: "A Holistic Perspective",
    description: "We look at the person, not just the symptom.",
    icon: "care",
  },
  {
    id: "integrative",
    title: "Integrative Care",
    description:
      "Homeopathy, therapeutic services, psychological care, diagnostics, wellness, and preventive healthcare—connected in one clinic.",
    icon: "centers",
  },
  {
    id: "personalized",
    title: "Personalized Care",
    description:
      "Your health journey is unique. We listen, understand, and create care pathways meaningful to you.",
    icon: "doctors",
  },
  {
    id: "prevention",
    title: "Prevention-Focused",
    description:
      "We encourage proactive steps toward maintaining and improving long-term wellbeing—not only treating today's concerns.",
    icon: "booking",
  },
];

export const services: ServiceItem[] = getHomeServiceCards();

/** Practical clinic facts — used in home stats strip (footer keeps its own copy). */
export const statistics: StatisticItem[] = [
  { id: "disciplines", value: "7+", label: "Healthcare Disciplines" },
  { id: "hours", value: "9am–9pm", label: "Daily Clinic Hours" },
  { id: "languages", value: "3", label: "Languages Supported" },
  { id: "parking", value: "Yes", label: "Parking Available" },
];

/** Hero highlights — distinct from footer/hours cards so the first screen is not duplicated. */
export const heroHighlights: StatisticItem[] = [
  { id: "integrative", value: "Whole-Person", label: "Integrative Care Model" },
  { id: "therapies", value: "Therapies+", label: "Speech, Physio, OT & Psychology" },
  { id: "nutrition", value: "Nutrition", label: "Diet & Nutrition Support" },
  { id: "connected", value: "One Clinic", label: "All Services Under One Roof" },
];

export const featuredDoctors: FeaturedDoctor[] = [
  {
    id: "homeopathy",
    name: "Homeopathy Team",
    specialization: "Homeopathy",
    qualifications: "Holistic integrative consultations",
    initials: "HT",
  },
  {
    id: "therapy",
    name: "Other Therapeutic Services Team",
    specialization: "Speech · Physio · OT · Psychology",
    qualifications: "Multidisciplinary therapeutic care",
    initials: "TS",
  },
  {
    id: "wellness",
    name: "Wellness & Preventive Care",
    specialization: "Wellness & Preventive Healthcare",
    qualifications: "Long-term wellbeing support",
    initials: "WP",
  },
];

export const medicalCenters: MedicalCenter[] = [
  {
    id: "pcic",
    name: clinicInfo.shortName,
    location: "Colombo 05",
    services: "Integrative clinic · All services under one roof",
    icon: "🏥",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Verified Patient",
    role: "Patient · Colombo",
    quote:
      "Premier Care took time to understand my health history and provided a personalized approach that felt genuinely caring and thorough.",
    rating: 5,
    initials: "VP",
  },
  {
    id: "t2",
    name: "Verified Patient",
    role: "Patient · Sri Lanka",
    quote:
      "The integrative model brought together the therapeutic and wellness support I needed in one place. A refreshing healthcare experience.",
    rating: 5,
    initials: "VP",
  },
  {
    id: "t3",
    name: "Verified Patient",
    role: "Patient · Colombo",
    quote:
      "From consultation to follow-up, the team treated me with dignity and respect. I felt heard—not just another appointment.",
    rating: 5,
    initials: "VP",
  },
];

export const whyChooseSection = {
  eyebrow: "Why Premier Care?",
  title: "Healthcare Designed Around the Whole You",
} as const;

export const specialtiesSection = {
  eyebrow: "Our Services",
  title: "Comprehensive Care. One Connected Experience.",
  description:
    "From Homeopathy and therapeutic services to wellness, laboratory support, and corporate healthcare—we support you at every stage of your health journey.",
  cta: "Explore All Services",
} as const;

export const ctaSection = {
  eyebrow: "Appointments",
  title: "Your Healthcare Journey Starts With One Step",
  description:
    "Book your preferred service, practitioner, date, and time through our online appointment system—or contact our team for assistance.",
  primaryCta: "Book an Appointment",
  secondaryCta: "Contact Our Team",
} as const;
