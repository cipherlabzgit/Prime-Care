import type { LandingPageConfig } from "../types/landingPage";

const urgencyOptions = [
  "As soon as possible",
  "Within 7 days",
  "Within 2–4 weeks",
  "Just exploring options",
] as const;

const sharedFormIntro =
  "A few quick details will help us understand what support you are looking for and direct your enquiry to the appropriate Premier Care professional.";

export const landingPages: readonly LandingPageConfig[] = [
  {
    id: "child-development",
    slug: "child-development",
    seoTitle: "Child Development Support",
    seoDescription:
      "Speech, communication, occupational therapy and child psychology support for developmental concerns at Premier Care Integrative Clinic.",
    heroTitle: "Helping Children Develop, Communicate & Thrive",
    heroSubtitle:
      "Every child develops differently. If you have concerns about your child's speech, communication, behaviour, learning or development, the right professional support can help. At Premier Care, multiple disciplines come together to understand your child's needs and provide personalised care.",
    heroImage:
      "https://res.cloudinary.com/dbyuqt5xh/image/upload/q_auto,f_auto,c_limit,w_1600/v1791799560/Playful_Speech_Therapy_Session_ve5o89.png",
    heroImageAlt: "Child development and speech-language support at Premier Care",
    challengesTitle: "Is Your Child Experiencing Developmental Challenges?",
    challengesIntro: "You may be looking for support if your child is experiencing:",
    challenges: [
      "Speech or language difficulties",
      "Communication challenges",
      "Delays in developmental milestones",
      "Behavioural or emotional difficulties",
      "Challenges affecting school or everyday activities",
    ],
    disciplinesTitle: "The Right Support, Under One Roof",
    disciplines: [
      {
        title: "Speech & Language",
        description:
          "Support for children experiencing speech, language and communication difficulties.",
      },
      {
        title: "Occupational Therapy",
        description:
          "Support to help children develop skills needed for everyday activities and participation.",
      },
      {
        title: "Child Psychology",
        description:
          "Professional support for children's emotional, behavioural and developmental needs.",
      },
    ],
    whyTitle: "Support Built Around Your Child",
    whyBody:
      "Rather than looking at one concern in isolation, Premier Care brings relevant disciplines together to understand your child's individual needs.",
    whyTagline: "One clinic. Multiple disciplines. Personalised care.",
    ctaTitle: "Concerned About Your Child's Development?",
    ctaDescription:
      "Tell us about your child's needs and our team can help guide you towards the appropriate support.",
    ctaButtonLabel: "Book a Child Development Consultation",
    learnMoreHref: "/services#speech-language-therapy",
    learnMoreLabel: "Learn more about our services",
    formHeader: "Tell Us About Your Child's Needs",
    formIntro: sharedFormIntro,
    formFields: [
      {
        id: "parentName",
        label: "Parent / Guardian Name",
        type: "text",
        required: true,
        autoComplete: "name",
      },
      {
        id: "childAge",
        label: "Child's Age",
        type: "select",
        required: true,
        options: ["Under 3", "3–5", "6–8", "9–12", "13–17"],
      },
      {
        id: "helpWith",
        label: "What would you like help with?",
        type: "select",
        required: true,
        options: [
          "Speech & Language",
          "Communication",
          "Developmental Concerns",
          "Behaviour / Emotional Support",
          "Occupational Therapy",
          "Other",
        ],
      },
      {
        id: "concern",
        label: "Briefly tell us about your concern",
        type: "textarea",
        required: true,
      },
      {
        id: "urgency",
        label: "How soon are you looking for support?",
        type: "select",
        required: true,
        options: urgencyOptions,
      },
      {
        id: "phone",
        label: "WhatsApp / Mobile Number",
        type: "tel",
        required: true,
        autoComplete: "tel",
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        required: false,
        autoComplete: "email",
      },
    ],
    formSubmitLabel: "Request a Consultation",
    emailSubject: "Child Development Landing Page Enquiry",
  },
  {
    id: "physical-health",
    slug: "physical-health",
    seoTitle: "Physiotherapy & Physical Rehabilitation",
    seoDescription:
      "Physiotherapy and physical rehabilitation for pain, mobility, sports injuries and post-surgery recovery at Premier Care.",
    heroTitle: "Move Better. Recover Better. Live Better.",
    heroSubtitle:
      "Persistent pain, reduced mobility, injuries or recovery after surgery can affect your everyday life. Premier Care provides physiotherapy and physical rehabilitation support focused on your individual needs.",
    heroImage:
      "https://res.cloudinary.com/dbyuqt5xh/image/upload/q_auto,f_auto,c_limit,w_1600/v1791799560/Supported_Resistance_Band_Exercise_fjytw4.png",
    heroImageAlt: "Physiotherapy and rehabilitation at Premier Care",
    challengesTitle: "Is Pain or Reduced Mobility Affecting You?",
    challengesIntro: "You may be looking for support if you are experiencing:",
    challenges: [
      "Persistent or recurring pain",
      "Reduced mobility or movement",
      "Sports or activity-related injuries",
      "Recovery needs following surgery",
      "Physical difficulties affecting everyday activities",
    ],
    disciplinesTitle: "Physiotherapy & Physical Rehabilitation",
    disciplines: [
      {
        title: "Assessment",
        description: "Understand your physical concerns and individual needs.",
      },
      {
        title: "Physiotherapy",
        description:
          "Professional support focused on movement, function and physical wellbeing.",
      },
      {
        title: "Rehabilitation",
        description:
          "Support as you work towards improved movement and everyday activity.",
      },
    ],
    whyTitle: "Care That Looks Beyond the Symptom",
    whyBody:
      "Premier Care brings different healthcare and wellness disciplines together, allowing your wider wellbeing to be considered where appropriate.",
    whyTagline: "One clinic. Multiple disciplines. Personalised care.",
    ctaTitle: "Ready to Take the Next Step?",
    ctaDescription:
      "Tell us about your physical health needs and our team can help guide you towards the appropriate support.",
    ctaButtonLabel: "Book a Physiotherapy Consultation",
    learnMoreHref: "/services#therapeutic-services",
    learnMoreLabel: "Learn more about therapeutic services",
    formHeader: "Tell Us About Your Physical Health Needs",
    formIntro: sharedFormIntro,
    formFields: [
      {
        id: "name",
        label: "Name",
        type: "text",
        required: true,
        autoComplete: "name",
      },
      {
        id: "helpWith",
        label: "What would you like help with?",
        type: "select",
        required: true,
        options: [
          "Back / Neck Pain",
          "Joint / Muscle Pain",
          "Sports Injury",
          "Post-Surgery Rehabilitation",
          "Mobility Difficulties",
          "Other",
        ],
      },
      {
        id: "duration",
        label: "How long have you been experiencing this issue?",
        type: "select",
        required: true,
        options: [
          "Less than 1 week",
          "1–4 weeks",
          "1–3 months",
          "More than 3 months",
          "Ongoing / Recurring",
        ],
      },
      {
        id: "concern",
        label: "Briefly tell us about your concern",
        type: "textarea",
        required: true,
      },
      {
        id: "urgency",
        label: "How soon are you looking for support?",
        type: "select",
        required: true,
        options: urgencyOptions,
      },
      {
        id: "phone",
        label: "WhatsApp / Mobile Number",
        type: "tel",
        required: true,
        autoComplete: "tel",
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        required: false,
        autoComplete: "email",
      },
    ],
    formSubmitLabel: "Request a Consultation",
    emailSubject: "Physical Health Landing Page Enquiry",
  },
  {
    id: "mental-wellbeing",
    slug: "mental-wellbeing",
    seoTitle: "Mental Wellbeing & Counselling",
    seoDescription:
      "Professional psychology and counselling support for stress, anxiety and emotional wellbeing at Premier Care.",
    heroTitle: "Your Mental Wellbeing Matters",
    heroSubtitle:
      "Stress, anxiety, emotional difficulties and major life changes can affect how you feel and function every day. Premier Care provides access to professional psychology and counselling support in a supportive environment.",
    heroImage:
      "https://res.cloudinary.com/dbyuqt5xh/image/upload/q_auto,f_auto,c_limit,w_1600/v1791799560/Warm_Counselling_Session_in_a_Modern_Office_bhf497.png",
    heroImageAlt: "Mental wellbeing and counselling support at Premier Care",
    challengesTitle: "You May Be Looking for Support If You're Experiencing:",
    challenges: [
      "Ongoing stress or pressure",
      "Anxiety or emotional difficulties",
      "Work-related stress or burnout",
      "Relationship challenges",
      "Major life changes",
      "Personal challenges affecting your wellbeing",
    ],
    disciplinesTitle: "Professional Support for Your Wellbeing",
    disciplines: [
      {
        title: "Psychology",
        description: "Professional psychological support tailored to individual needs.",
      },
      {
        title: "Counselling",
        description: "A confidential space to explore personal challenges and concerns.",
      },
      {
        title: "Stress & Wellbeing Support",
        description:
          "Support for individuals navigating periods of pressure, change or emotional difficulty.",
      },
    ],
    whyTitle: "Support That Starts With You",
    whyBody:
      "Mental wellbeing is personal. Premier Care focuses on understanding the individual and connecting you with appropriate professional support.",
    whyTagline: "One clinic. Multiple disciplines. Personalised care.",
    ctaTitle: "Ready to Talk?",
    ctaDescription:
      "Tell us about what you're experiencing and our team can help guide you towards the appropriate support.",
    ctaButtonLabel: "Book a Mental Wellbeing Consultation",
    learnMoreHref: "/services#therapeutic-services",
    learnMoreLabel: "Learn more about our care",
    formHeader: "Tell Us How We Can Support You",
    formIntro:
      "A few quick details will help us understand what type of support you may be looking for.",
    formFields: [
      {
        id: "name",
        label: "Name",
        type: "text",
        required: true,
        autoComplete: "name",
      },
      {
        id: "helpWith",
        label: "What would you like support with?",
        type: "select",
        required: true,
        options: [
          "Stress / Burnout",
          "Anxiety",
          "Emotional Wellbeing",
          "Relationship / Family Concerns",
          "Major Life Changes",
          "Other",
        ],
      },
      {
        id: "concern",
        label: "Briefly tell us what you're experiencing",
        type: "textarea",
        required: true,
      },
      {
        id: "urgency",
        label: "How soon are you looking for support?",
        type: "select",
        required: true,
        options: urgencyOptions,
      },
      {
        id: "phone",
        label: "WhatsApp / Mobile Number",
        type: "tel",
        required: true,
        autoComplete: "tel",
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        required: false,
        autoComplete: "email",
      },
    ],
    formSubmitLabel: "Request a Consultation",
    formPrivacyNote:
      "Your information will be treated confidentially and used to help us respond to your enquiry.",
    emailSubject: "Mental Wellbeing Landing Page Enquiry",
  },
  {
    id: "integrative-health",
    slug: "integrative-health",
    seoTitle: "Integrative & Holistic Healthcare",
    seoDescription:
      "Personalised integrative care including homeopathy and holistic wellness at Premier Care Integrative Clinic.",
    heroTitle: "Healthcare That Looks Beyond the Symptom",
    heroSubtitle:
      "Your health is more than a single symptom. Premier Care brings healthcare and wellness disciplines together to provide personalised care around the individual.",
    heroImage:
      "https://res.cloudinary.com/dbyuqt5xh/image/upload/q_auto,f_auto,c_limit,w_1600/v1791799559/Warm_Integrative_Healthcare_Consultation_z8iyoy.png",
    heroImageAlt: "Integrative and homeopathic care at Premier Care",
    challengesTitle: "Looking for a More Holistic Approach?",
    challengesIntro: "You may be looking for support if you:",
    challenges: [
      "Want a more personalised approach to your wellbeing",
      "Are interested in homeopathy",
      "Are looking for holistic wellness support",
      "Have ongoing health concerns",
      "Want to understand your options for professional support",
    ],
    disciplinesTitle: "Personalised Integrative Care",
    disciplines: [
      {
        title: "Homeopathy",
        description:
          "Homeopathy is one of the disciplines available within Premier Care's wider healthcare and wellness offering.",
      },
      {
        title: "Holistic Wellness",
        description: "Support focused on the individual and their wider wellbeing.",
      },
      {
        title: "Integrated Support",
        description: "Access to multiple disciplines within one clinic where appropriate.",
      },
    ],
    whyTitle: "One Clinic. Multiple Disciplines.",
    whyBody:
      "Premier Care brings different healthcare and wellness disciplines together, making it easier to access personalised support around your individual needs. Healthcare that looks beyond the symptom.",
    whyTagline: "One clinic. Multiple disciplines. Personalised care.",
    ctaTitle: "Looking for a More Personalised Approach?",
    ctaDescription:
      "Tell us about your health and wellbeing needs and our team can help guide you towards the appropriate support.",
    ctaButtonLabel: "Book an Integrative Health Consultation",
    learnMoreHref: "/services#homeopathy",
    learnMoreLabel: "Learn more about homeopathy",
    formHeader: "Tell Us About Your Health & Wellness Needs",
    formIntro:
      "A few quick details will help us understand what you are looking for and direct your enquiry appropriately.",
    formFields: [
      {
        id: "name",
        label: "Name",
        type: "text",
        required: true,
        autoComplete: "name",
      },
      {
        id: "helpWith",
        label: "What would you like support with?",
        type: "select",
        required: true,
        options: [
          "Homeopathy",
          "Ongoing Health Concerns",
          "General Wellbeing",
          "Holistic Health Support",
          "Other",
        ],
      },
      {
        id: "concern",
        label: "Briefly tell us about your concern or what you are looking for",
        type: "textarea",
        required: true,
      },
      {
        id: "urgency",
        label: "How soon are you looking for support?",
        type: "select",
        required: true,
        options: urgencyOptions,
      },
      {
        id: "phone",
        label: "WhatsApp / Mobile Number",
        type: "tel",
        required: true,
        autoComplete: "tel",
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        required: false,
        autoComplete: "email",
      },
    ],
    formSubmitLabel: "Request a Consultation",
    emailSubject: "Integrative Health Landing Page Enquiry",
  },
  {
    id: "nutrition",
    slug: "nutrition",
    seoTitle: "Nutrition & Lifestyle Support",
    seoDescription:
      "Personalised nutrition, dietary planning and lifestyle guidance at Premier Care Integrative Clinic.",
    heroTitle: "Better Nutrition Starts With Understanding Your Needs",
    heroSubtitle:
      "Your nutritional needs are personal. Premier Care provides personalised nutrition, dietary planning and lifestyle support designed around the individual.",
    heroImage:
      "https://res.cloudinary.com/dbyuqt5xh/image/upload/q_auto,f_auto,c_limit,w_1600/v1791799559/Personalised_Nutrition_Consultation_hquteg.png",
    heroImageAlt: "Nutrition and lifestyle support at Premier Care",
    challengesTitle: "Looking for Support With Your Nutrition?",
    challengesIntro: "You may be looking for professional guidance if you want help with:",
    challenges: [
      "Improving your everyday eating habits",
      "Creating a more balanced approach to nutrition",
      "Dietary planning",
      "Making lifestyle changes",
      "Understanding your nutritional needs",
      "Supporting your wider wellbeing",
    ],
    disciplinesTitle: "Personalised Nutrition & Lifestyle Support",
    disciplines: [
      {
        title: "Dietary Planning",
        description:
          "Develop a practical approach to nutrition based on your individual needs.",
      },
      {
        title: "Nutrition Guidance",
        description: "Understand your nutritional needs and make more informed choices.",
      },
      {
        title: "Lifestyle Support",
        description: "Work towards practical changes that fit your everyday life.",
      },
    ],
    whyTitle: "Nutrition That's Built Around You",
    whyBody:
      "There is no single approach that works for everyone. Premier Care focuses on understanding your individual needs, lifestyle and goals before providing appropriate nutritional guidance.",
    whyTagline: "One clinic. Multiple disciplines. Personalised care.",
    ctaTitle: "Ready to Take a More Personalised Approach?",
    ctaDescription:
      "Tell us about your nutrition and lifestyle needs and our team can help guide you towards the appropriate support.",
    ctaButtonLabel: "Book a Nutrition Consultation",
    learnMoreHref: "/services#therapeutic-services",
    learnMoreLabel: "Learn more about wellness services",
    formHeader: "Tell Us About Your Nutrition Goals",
    formIntro:
      "A few quick details will help us understand what you are looking for and direct your enquiry appropriately.",
    formFields: [
      {
        id: "name",
        label: "Name",
        type: "text",
        required: true,
        autoComplete: "name",
      },
      {
        id: "helpWith",
        label: "What would you like help with?",
        type: "select",
        required: true,
        options: [
          "Dietary Planning",
          "Improving Eating Habits",
          "Nutrition Guidance",
          "Lifestyle Changes",
          "General Wellbeing",
          "Other",
        ],
      },
      {
        id: "goals",
        label: "What would you like to achieve?",
        type: "textarea",
        required: true,
      },
      {
        id: "urgency",
        label: "How soon are you looking for support?",
        type: "select",
        required: true,
        options: urgencyOptions,
      },
      {
        id: "phone",
        label: "WhatsApp / Mobile Number",
        type: "tel",
        required: true,
        autoComplete: "tel",
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        required: false,
        autoComplete: "email",
      },
    ],
    formSubmitLabel: "Request a Consultation",
    emailSubject: "Nutrition Landing Page Enquiry",
  },
];

const landingBySlug = new Map(landingPages.map((page) => [page.slug, page]));

export function getLandingPageBySlug(slug: string | undefined): LandingPageConfig | undefined {
  if (!slug) return undefined;
  return landingBySlug.get(slug.replace(/\/$/, ""));
}

export const landingPageSlugs = landingPages.map((p) => p.slug);
