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
  primaryCta: "Book an Appointment",
  secondaryCta: "Explore Our Services",
} as const;

export const welcomeSection = {
  eyebrow: "Welcome to Premier Care",
  title: "A More Complete Approach to Healthcare",
  lead: "Your health is more than a collection of symptoms.",
  image: "/images/services/general-medicine.jpg",
  imageAlt: "Premier Care Integrative Clinic consultation",
  paragraphs: [
    "Every individual has a unique story—shaped by their physical health, emotional wellbeing, lifestyle, environment, experiences, and personal history. At Premier Care Integrative Clinic, we take a holistic view of that story.",
  ],
  disciplinesIntro:
    "Our approach brings together multiple healthcare disciplines, including:",
  disciplines: [
    "Homeopathy",
    "Speech Therapy",
    "Physiotherapy",
    "Occupational Therapy",
    "Educational Therapy",
    "Psychotherapy",
    "Counselling",
    "Performance Enhancement",
    "Sex Therapy",
    "Hippotherapy",
    "Addiction Recovery",
    "Psychiatric Assessment",
    "ANTS based Therapy",
    "Wellness",
    "Laboratory Services",
    "Nutraceuticals & Supplements",
    "Preventive Healthcare",
    "Diet & Nutrition Support",
    "Diagnostics",
    "Corporate Healthcare",
  ],
} as const;

export const careModelSteps = [
  {
    id: "assess",
    step: "01",
    title: "Assess",
    image: "/images/care-model/assess.png",
    imageAlt: "Doctor assessing a patient during consultation",
  },
  {
    id: "understand",
    step: "02",
    title: "Understand",
    image: "/images/care-model/understand.png",
    imageAlt: "Looking deeper at lifestyle and health factors",
  },
  {
    id: "personalize",
    step: "03",
    title: "Personalize",
    image: "/images/care-model/personalize.png",
    imageAlt: "Personalized care planned around the individual",
  },
  {
    id: "treat",
    step: "04",
    title: "Treat & Support",
    image: "/images/care-model/treat.png",
    imageAlt: "Caring treatment and supportive healthcare",
  },
  {
    id: "prevent",
    step: "05",
    title: "Prevent",
    image: "/images/care-model/prevent.png",
    imageAlt: "Preventive care protecting long-term health",
  },
  {
    id: "thrive",
    step: "06",
    title: "Thrive",
    image: "/images/care-model/thrive.png",
    imageAlt: "Living actively and thriving in good health",
  },
] as const;

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
      "Our services include Homeopathy, Speech-Language Therapy, Physiotherapy, Occupational Therapy, Psychological Counseling, Clinical Psychology, Diet & Nutrition Support, Laboratory Services, Nutraceuticals, Supplements, Wellness Programs, Preventive Healthcare, and Corporate Healthcare Solutions.",
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
