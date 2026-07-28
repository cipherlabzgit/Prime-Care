import { clinicInfo } from "./siteContent";

export const contactHero = {
  eyebrow: "Contact Us",
  title: "We Are Here to Help",
  description:
    "Whether you are ready to book an appointment, looking for the right healthcare service, interested in corporate healthcare solutions, or simply want to learn more about Premier Care, our team is here to help.",
};

export const contactInfo = {
  address: {
    label: "Visit Us",
    lines: [clinicInfo.address.line1, clinicInfo.address.line2, clinicInfo.address.country],
    mapQuery: clinicInfo.address.mapQuery,
    parking: clinicInfo.parking,
  },
  phones: [
    {
      label: "Phone",
      value: clinicInfo.phone,
      href: clinicInfo.phoneHref,
    },
    {
      label: "WhatsApp",
      value: clinicInfo.whatsapp,
      href: clinicInfo.whatsappHref,
    },
  ],
  emails: [
    {
      label: "Email",
      value: clinicInfo.email,
      href: clinicInfo.emailHref,
    },
  ],
  hours: [{ day: "Opening Hours", time: clinicInfo.hours }],
  languages: clinicInfo.languages,
};

export const emergencyContact = {
  label: "Medical Emergency",
  hotline: "1990",
  hotlineHref: "tel:1990",
  subtitle:
    "For life-threatening emergencies, call the national ambulance hotline immediately.",
  supportLine: clinicInfo.phone,
  supportHref: clinicInfo.phoneHref,
  supportLabel: "Premier Care clinic line (non-emergency)",
};

export const mapEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7987654321!2d79.8772!3d6.8889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593c8c8c8c8c%3A0x1234567890abcdef!2s34%2F6%20Kirula%20Rd%2C%20Colombo%2000500!5e0!3m2!1sen!2slk!4v1710000000000!5m2!1sen!2slk";

export const contactSubjects = [
  "General Enquiry",
  "Appointment Support",
  "Corporate Healthcare",
  "Wellness Programs",
  "Feedback",
  "Other",
] as const;
