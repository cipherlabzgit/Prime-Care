export const doctorsHero = {
  eyebrow: "Medical directory",
  titleLead: "Our",
  titleAccent: "Doctors",
  description:
    "Browse experienced consultants across Homeopathy, therapy, psychology, and wellness at Premier Care Integrative Clinic.",
} as const;

export const doctorsDirectoryIntro = {
  eyebrow: "Find your practitioner",
  titleLead: "Search &",
  titleAccent: "filter",
  description:
    "Use specialization, location, and availability filters to find the right practitioner for your care journey.",
} as const;

export const doctorsStatistics = [
  { id: "disciplines", value: "7+", label: "Healthcare disciplines" },
  { id: "hours", value: "9am–9pm", label: "Daily clinic hours" },
  { id: "languages", value: "3", label: "Languages supported" },
  { id: "booking", value: "Online", label: "Appointment booking" },
] as const;

export const doctorsCta = {
  eyebrow: "Next step",
  titleLead: "Ready to book",
  titleAccent: "your visit?",
  description:
    "Choose a practitioner and reserve your preferred session time through our online booking system.",
  watermark: "Care",
  primaryLabel: "Book Appointment",
  secondaryLabel: "Contact Us",
  secondaryHref: "/contact",
} as const;
