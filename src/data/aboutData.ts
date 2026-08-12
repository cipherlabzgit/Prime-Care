import { clinicInfo } from "./siteContent";

export const aboutStory = {
  eyebrow: "About Us",
  title: "Integrative Care for Lasting Wellbeing",
  mission:
    "To provide compassionate, personalized, and integrative healthcare by bringing together diverse healthcare disciplines, understanding the whole person, addressing underlying factors, promoting prevention, and empowering individuals and communities to achieve lasting health and wellbeing.",
  vision:
    "To create a future where healthcare looks beyond illness, empowers people to understand their health, and enables every individual to live better, live longer, and live fully.",
  heroImage: "/images/hero-consultation.png",
};

export interface AboutPresentationSlide {
  id: string;
  label: string;
  headline: string[];
  description: string;
  keywords: string[];
  image: string;
  imageAlt: string;
  tone: "vision" | "mission";
}

export const aboutPresentationSlides: AboutPresentationSlide[] = [
  {
    id: "vision",
    label: "Our Vision",
    headline: ["Live Better.", "Live Longer.", "Live Fully."],
    description:
      "Healthcare that goes beyond treating illness — helping people understand their health and build a healthier future.",
    keywords: ["Whole-Person Care", "Prevention", "Better Living"],
    image: "/images/about/vision.png",
    imageAlt: "Vision of healthier living and lasting wellbeing",
    tone: "vision",
  },
  {
    id: "mission",
    label: "Our Mission",
    headline: ["Care That Understands", "the Whole Person."],
    description:
      "We combine medical expertise, personal understanding, and continuous support to create care around each individual.",
    keywords: ["Listen", "Understand", "Personalize"],
    image: "/images/about/mission.png",
    imageAlt: "Mission of compassionate personalized integrative care",
    tone: "mission",
  },
];

export const aboutJourney = [
  {
    year: "Assess",
    title: "Understand your needs",
    description:
      "We begin by understanding your health concerns, symptoms, history, lifestyle, and individual needs.",
  },
  {
    year: "Personalize",
    title: "Tailored care pathways",
    description:
      "Your care is tailored to you, because no two individuals are exactly alike.",
  },
  {
    year: "Prevent",
    title: "Long-term wellbeing",
    description:
      "We focus on reducing future health risks through awareness, lifestyle support, and preventive strategies.",
  },
  {
    year: "Thrive",
    title: "Live fully",
    description: clinicInfo.tagline,
  },
] as const;

export const leadershipTeam = [
  {
    id: "homeopathy",
    name: "Homeopathy Practitioners",
    role: "Core Healthcare Practice",
    bio: "Qualified Homeopathic practitioners providing holistic, individualized consultations as part of our integrative care model.",
    initials: "HP",
  },
  {
    id: "therapy",
    name: "Therapeutic Team",
    role: "Speech · Physio · OT · Psychology",
    bio: "Multidisciplinary therapists supporting communication, movement, daily function, and emotional wellbeing across all stages of life.",
    initials: "TT",
  },
  {
    id: "wellness",
    name: "Wellness & Clinical Team",
    role: "Diagnostics · Wellness · Preventive Care",
    bio: "Healthcare professionals supporting laboratory services, wellness programs, preventive care, and personalized health improvement pathways.",
    initials: "WC",
  },
] as const;

export const coreValues = [
  {
    id: "compassion",
    icon: "💛",
    title: "Compassion",
    description:
      "We see the person before the condition and treat everyone with empathy, dignity, kindness, and respect.",
  },
  {
    id: "whole-person",
    icon: "🧩",
    title: "Whole-Person Care",
    description:
      "We look beyond individual symptoms and consider the physical, emotional, psychological, lifestyle, and environmental factors that influence wellbeing.",
  },
  {
    id: "personalized",
    icon: "✨",
    title: "Personalized Care",
    description:
      "We recognize that every person is unique. Our care begins by listening and understanding.",
  },
  {
    id: "integrity",
    icon: "🛡️",
    title: "Integrity",
    description:
      "We build trust through honesty, transparency, professionalism, and ethical practice.",
  },
  {
    id: "collaboration",
    icon: "🤝",
    title: "Collaboration",
    description:
      "We believe better healthcare happens when different disciplines and professionals work together.",
  },
  {
    id: "prevention",
    icon: "🌱",
    title: "Prevention",
    description:
      "We believe the best time to care for your health is before a problem becomes a bigger problem.",
  },
  {
    id: "growth",
    icon: "📈",
    title: "Continuous Growth",
    description:
      "We are committed to learning, improving, and evolving with the changing needs of healthcare and the communities we serve.",
  },
  {
    id: "empowerment",
    icon: "💪",
    title: "Empowerment",
    description:
      "We believe patients should be active participants in their own healthcare journey, equipped with knowledge and confidence to make informed decisions.",
  },
] as const;

export const aboutWhyChoose = [
  {
    id: "holistic",
    icon: "🌿",
    title: "A Holistic Perspective",
    description: "We look at the person, not just the symptom.",
  },
  {
    id: "integrative",
    icon: "🔗",
    title: "Integrative Care",
    description:
      "We bring together multiple healthcare disciplines to create a more complete care experience.",
  },
  {
    id: "homeopathy",
    icon: "💚",
    title: "Homeopathy",
    description:
      "Homeopathy is one of the core healthcare practices offered at Premier Care, provided as part of our broader integrative healthcare approach.",
  },
  {
    id: "therapeutic",
    icon: "🧠",
    title: "Other Therapeutic Services",
    description:
      "Speech-Language Therapy, Physiotherapy, Occupational Therapy, Psychological Counseling, Clinical Psychology, and Diet & Nutrition Support as part of our integrative approach.",
  },
  {
    id: "multidisciplinary",
    icon: "👥",
    title: "Multidisciplinary Expertise",
    description:
      "Our team includes practitioners across different areas of healthcare and therapy, allowing patients to access diverse professional expertise.",
  },
  {
    id: "personalized",
    icon: "✨",
    title: "Personalized Care",
    description:
      "Your health journey is unique. We strive to understand your individual needs and create care pathways that are meaningful to you.",
  },
  {
    id: "prevention",
    icon: "🛡️",
    title: "Prevention-Focused",
    description:
      "We believe good healthcare should not stop when symptoms improve. We encourage proactive steps toward maintaining long-term wellbeing.",
  },
  {
    id: "compassion",
    icon: "💛",
    title: "Compassionate Care",
    description: "We treat every patient with dignity, empathy, respect, and genuine care.",
  },
] as const;
