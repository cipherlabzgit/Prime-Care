import type { ClinicalService, ServiceStatistic } from "../types/service";

const serviceImages = {
  homeopathy: "/images/services/general-medicine.jpg",
  therapeutic: "/images/services/pediatrics.jpg",
  wellness: "/images/hero-consultation.png",
  laboratory: "/images/services/laboratory.jpg",
  pharmacy: "/images/services/radiology.jpg",
  corporate: "/images/services/cardiology.jpg",
} as const;

export const servicesHero = {
  eyebrow: "Our Services",
  title: "Comprehensive Care. One Connected Healthcare Experience.",
  description:
    "At Premier Care Integrative Clinic, we bring together a range of healthcare and therapeutic services to support individuals at different stages of their health journey.",
  image: "/images/hero-consultation.png",
} as const;

export const servicesStatistics: ServiceStatistic[] = [
  { id: "disciplines", value: "6+", label: "Healthcare Disciplines" },
  { id: "hours", value: "9–9", label: "Daily Clinic Hours" },
  { id: "languages", value: "3", label: "Languages Supported" },
  { id: "parking", value: "✓", label: "Parking Available" },
];

export const clinicalServices: ClinicalService[] = [
  {
    id: "homeopathy",
    name: "Homeopathy",
    slug: "homeopathy",
    description:
      "Homeopathy is one of the core healthcare practices at Premier Care Integrative Clinic. Our Homeopathic consultations take a holistic approach, considering the individual's health history, current concerns, personal circumstances, and overall wellbeing.",
    icon: "🌿",
    image: serviceImages.homeopathy,
    services: [
      "Holistic Homeopathic consultations",
      "Individualized care planning",
      "Chronic and recurrent health concerns",
      "Skin-related and allergic tendencies",
      "Digestive and respiratory wellbeing",
      "Women's and children's health support",
      "General wellness and preventive care",
    ],
    treatments: [
      "Listen — understand your concerns and experiences",
      "Explore — consider health history and influencing factors",
      "Individualize — personalized approaches for each person",
      "Support — journey toward improved health and wellbeing",
    ],
  },
  {
    id: "therapeutic",
    name: "Therapeutic Services",
    slug: "therapeutic-services",
    description:
      "Health is not only about treating illness. It is also about being able to communicate, move freely, participate in daily life, manage emotions, and reach your potential. Our therapeutic services support individuals across different stages of life.",
    icon: "🧠",
    image: serviceImages.therapeutic,
    services: [
      "Speech Therapy",
      "Physiotherapy",
      "Occupational Therapy",
      "Psychological Counseling",
      "Clinical Psychology",
    ],
    treatments: [
      "Communication and speech support",
      "Mobility, strength, and recovery",
      "Daily living and functional skills",
      "Emotional wellbeing and counseling",
      "Professional psychological assessment and care",
    ],
  },
  {
    id: "wellness",
    name: "Wellness & Preventive Healthcare",
    slug: "wellness-preventive",
    description:
      "Good healthcare is not only about responding to problems after they appear. Our wellness and preventive healthcare programs help individuals become more aware of their health, understand potential risks, and take proactive steps toward long-term wellbeing.",
    icon: "🌱",
    image: serviceImages.wellness,
    services: [
      "Lifestyle and wellness guidance",
      "Preventive health initiatives",
      "Health awareness programs",
      "Individual wellness consultations",
      "Healthy living support",
      "Corporate wellness programs",
      "Personalized health improvement pathways",
    ],
    treatments: [
      "Proactive health awareness",
      "Risk reduction strategies",
      "Healthy habit development",
      "Long-term wellbeing planning",
    ],
  },
  {
    id: "laboratory",
    name: "Laboratory Services",
    slug: "laboratory-services",
    description:
      "Accurate health information is an important part of making informed healthcare decisions. Our laboratory services support healthcare assessment, health monitoring, screening, and the evaluation of individual health needs.",
    icon: "🔬",
    image: serviceImages.laboratory,
    services: [
      "Health assessments and screening",
      "Health monitoring investigations",
      "Clinical laboratory support",
      "Coordinated investigation planning",
      "Results guidance and next steps",
    ],
    treatments: [
      "Diagnostic support when clinically appropriate",
      "Preventive screening pathways",
      "Monitoring for ongoing care plans",
    ],
  },
  {
    id: "pharmacy",
    name: "Pharmacy, Nutraceuticals & Wellness Solutions",
    slug: "pharmacy-wellness",
    description:
      "Our pharmacy and wellness services provide access to carefully selected healthcare products that may complement an individual's personalized care plan. Products and supplements should form part of a thoughtful healthcare plan—not replace professional assessment and care.",
    icon: "💊",
    image: serviceImages.pharmacy,
    services: [
      "Homeopathic medicines",
      "Nutraceuticals",
      "Dietary supplements",
      "Selected wellness products",
      "Professional product guidance",
    ],
    treatments: [
      "Personalized product recommendations",
      "Complementary wellness support",
      "Integrated care planning",
    ],
  },
  {
    id: "corporate",
    name: "Corporate Healthcare",
    slug: "corporate-healthcare",
    description:
      "A healthy organization begins with healthy people. Premier Care Integrative Clinic works with businesses and organizations to develop integrated healthcare and wellness solutions designed around the needs of their employees.",
    icon: "🏢",
    image: serviceImages.corporate,
    services: [
      "Employee health screening programs",
      "Preventive healthcare initiatives",
      "Corporate wellness programs",
      "Mental health and psychological wellbeing support",
      "Health awareness sessions",
      "Workplace wellness education",
      "Therapeutic support programs",
      "Customized healthcare packages",
    ],
    treatments: [
      "Tailored organizational packages",
      "Employee wellbeing partnerships",
      "Healthier workplace initiatives",
    ],
  },
];

export const servicesCta = {
  eyebrow: "Book your visit",
  title: "Your Healthcare Journey Starts With One Step",
  description:
    "Whether you need a consultation, Homeopathic care, therapeutic support, psychological care, laboratory services, wellness guidance, or preventive healthcare, booking your appointment is the first step.",
} as const;

export function getHomeServiceCards(): Pick<
  ClinicalService,
  "id" | "slug" | "name" | "description" | "icon"
>[] {
  return clinicalServices.map(({ id, slug, name, description, icon }) => ({
    id,
    slug,
    name,
    description,
    icon,
  }));
}

export const homeopathyDisclaimer =
  "Homeopathic care is individualized and should be discussed with a qualified practitioner. Patients should not discontinue prescribed conventional medication or delay emergency medical treatment without consulting an appropriate healthcare professional.";
