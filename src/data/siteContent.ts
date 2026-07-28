/** Premier Care Integrative Clinic — official site copy (from PCIC master content). */

export const clinicInfo = {
  name: "Premier Care Integrative Clinic (Pvt) Ltd",
  shortName: "Premier Care Integrative Clinic",
  tagline: "Live Better. Live Longer. Live Fully.",
  address: {
    line1: "34/6, Kirula Road",
    line2: "Colombo 05",
    country: "Sri Lanka",
    full: "34/6, Kirula Road, Colombo 05, Sri Lanka",
    mapQuery: "34/6 Kirula Road, Colombo 05, Sri Lanka",
  },
  hours: "Every Day | 9.00 AM – 9.00 PM",
  parking: "Parking Available",
  phone: "076 5 588 588",
  phoneHref: "tel:+94765588588",
  whatsapp: "076 5 588 588",
  whatsappHref: "https://wa.me/94765588588",
  email: "info@premiercare.lk",
  emailHref: "mailto:info@premiercare.lk",
  languages: "English | Sinhala | Tamil",
} as const;

export const homeHero = {
  badge: "Premier Care Integrative Clinic",
  title: "Healthcare That Looks Beyond the Symptoms",
  subtitle: clinicInfo.tagline,
  description:
    "At Premier Care Integrative Clinic, we believe healthcare should go beyond simply managing symptoms. We take time to understand your health history, your individual circumstances, and the factors that may be influencing your wellbeing.",
  closing: "Your health is personal. Your care should be too.",
  primaryCta: "Book an Appointment",
  secondaryCta: "Explore Our Services",
} as const;

export const welcomeSection = {
  eyebrow: "Welcome to Premier Care",
  title: "A More Complete Approach to Healthcare",
  lead: "Your health is more than a collection of symptoms.",
  paragraphs: [
    "Every individual has a unique story—shaped by their physical health, emotional wellbeing, lifestyle, environment, experiences, and personal history. At Premier Care Integrative Clinic, we take a holistic view of that story.",
    "Our approach brings together multiple healthcare disciplines, including Homeopathy, therapeutic services, psychological care, diagnostics, nutraceuticals, supplements, wellness programs, and preventive healthcare.",
    "Rather than focusing only on what is happening today, we strive to understand the bigger picture, explore the underlying factors contributing to health concerns, support the body's journey toward recovery and balance, and empower you with knowledge and preventive strategies for the future.",
  ],
  closing:
    "Because we believe the goal of healthcare is not simply to help you feel better today. It is to help you Live Better. Live Longer. Live Fully.",
} as const;

export const careModelSteps = [
  {
    id: "assess",
    step: "01",
    title: "Assess",
    description:
      "We begin by understanding your health concerns, symptoms, history, lifestyle, and individual needs.",
  },
  {
    id: "understand",
    step: "02",
    title: "Understand",
    description:
      "We look deeper to identify the underlying factors that may be contributing to your health concerns.",
  },
  {
    id: "personalize",
    step: "03",
    title: "Personalize",
    description: "Your care is tailored to you, because no two individuals are exactly alike.",
  },
  {
    id: "treat",
    step: "04",
    title: "Treat & Support",
    description:
      "We bring together appropriate healthcare and therapeutic approaches to support your journey toward better health.",
  },
  {
    id: "prevent",
    step: "05",
    title: "Prevent",
    description:
      "We focus not only on today's concerns, but also on reducing future health risks through awareness, lifestyle support, and preventive strategies.",
  },
  {
    id: "thrive",
    step: "06",
    title: "Thrive",
    description:
      "Our ultimate goal is to help you move beyond simply managing health concerns and toward living a healthier, more fulfilling life.",
  },
] as const;

export const carePhilosophy =
  "Assess → Understand → Personalize → Treat & Support → Prevent → Thrive";

export const appointmentSteps = [
  {
    id: "service",
    title: "Select Your Service",
    description: "Choose the healthcare or therapeutic service you require.",
  },
  {
    id: "practitioner",
    title: "Choose Your Practitioner",
    description: "Select your preferred available practitioner.",
  },
  {
    id: "datetime",
    title: "Select Your Date & Time",
    description: "Choose an appointment time that works for you.",
  },
  {
    id: "confirm",
    title: "Confirm Your Booking",
    description: "Complete your booking and receive your appointment confirmation.",
  },
] as const;

export const patientVisitInfo = {
  eyebrow: "Patient Information",
  title: "Preparing for Your Visit",
  intro:
    "We want your experience at Premier Care Integrative Clinic to be as comfortable and convenient as possible.",
  beforeTitle: "Before Your Appointment",
  beforeIntro: "If available, please bring:",
  beforeItems: [
    "Your National Identity Card or other identification",
    "Previous medical records",
    "Relevant laboratory reports",
    "Current medication information",
    "Previous treatment information",
    "Referral letters, if applicable",
  ],
  duringTitle: "During Your Consultation",
  duringText:
    "Your practitioner may ask about your current concerns, health history, lifestyle, previous treatments, and other relevant information. Please feel comfortable sharing information openly. The more your healthcare professional understands about you, the better they can understand your individual healthcare needs.",
  privacyTitle: "Privacy & Confidentiality",
  privacyText:
    "Your privacy matters to us. We are committed to protecting the confidentiality of your personal and healthcare information and handling your information responsibly.",
  newPatientNote:
    "Every new patient must go through a mandatory initial case taking session designed to dive deep into your health history and to better understand your body and mind. That is one of the unique benefits you get to experience at Premier Care Integrative Clinic. Subject to a one-time registration and case taking fee.",
} as const;

export const faqItems = [
  {
    id: "integrative",
    question: "What is an integrative healthcare clinic?",
    answer:
      "Integrative healthcare brings together different healthcare approaches and professional disciplines to provide a more comprehensive and personalized approach to health and wellbeing. At Premier Care, our integrative model includes Homeopathy, therapeutic services, psychological care, diagnostics, wellness, nutraceuticals, supplements, and preventive healthcare.",
  },
  {
    id: "homeopathy",
    question: "Is Homeopathy offered at Premier Care?",
    answer:
      "Yes. Homeopathy is one of the core healthcare practices offered at Premier Care Integrative Clinic. Our Homeopathic services form part of our broader integrative healthcare model.",
  },
  {
    id: "services",
    question: "What other services do you offer?",
    answer:
      "Our services include Homeopathy, Speech Therapy, Physiotherapy, Occupational Therapy, Psychological Counseling, Clinical Psychology, Laboratory Services, Nutraceuticals, Supplements, Wellness Programs, Preventive Healthcare, and Corporate Healthcare Solutions.",
  },
  {
    id: "appointment",
    question: "Do I need an appointment?",
    answer:
      "We recommend booking an appointment in advance to ensure your preferred practitioner and time are available. Walk-in availability may depend on the service and practitioner schedule.",
  },
  {
    id: "practitioner",
    question: "Can I choose my practitioner?",
    answer:
      "Where availability permits, patients can select their preferred practitioner through our appointment booking system.",
  },
  {
    id: "corporate",
    question: "Do you offer corporate healthcare packages?",
    answer:
      "Yes. We provide customized integrated healthcare and wellness packages for organizations and businesses.",
  },
  {
    id: "languages",
    question: "Do you provide services in Sinhala and Tamil?",
    answer:
      "Our team includes professionals who can provide services in English, Sinhala, and Tamil, depending on practitioner availability.",
  },
  {
    id: "laboratory",
    question: "Do you offer laboratory services?",
    answer:
      "Yes. Our laboratory services support health assessments, screening, monitoring, and healthcare decision-making.",
  },
  {
    id: "supplements",
    question: "Do you offer nutraceuticals and supplements?",
    answer:
      "Yes. We provide selected nutraceuticals, dietary supplements, and wellness products as part of our broader healthcare and wellness solutions.",
  },
] as const;
