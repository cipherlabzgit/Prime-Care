import { clinicalServices } from "./servicesData";
import { clinicInfo } from "./siteContent";

export const footerQuickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Doctors", href: "/doctors" },
  { label: "Book Appointment", href: "/channeling" },
  { label: "My Bookings", href: "/my-bookings" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerServiceLinks = clinicalServices.map((service) => ({
  label: service.name,
  href: `/services#${service.slug}`,
}));

export const footerSocialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: "facebook",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: "instagram",
  },
] as const;

export const footerTrustItems = [
  { label: "Integrative Care" },
  { label: "Compassionate Service" },
  { label: "Open Every Day 9am to 9pm" },
] as const;

export const footerTrustStats = [
  { value: "6+", label: "Healthcare Disciplines" },
  { value: "9am–9pm", label: "Daily Clinic Hours" },
  { value: "3", label: "Languages Supported" },
  { value: "Yes", label: "Parking Available" },
] as const;

export const footerContact = {
  phone: clinicInfo.phone,
  phoneHref: clinicInfo.phoneHref,
  email: clinicInfo.email,
  emailHref: clinicInfo.emailHref,
  address: clinicInfo.address.full,
} as const;

export const footerBranding = {
  tagline: `${clinicInfo.tagline} — ${clinicInfo.shortName} at ${clinicInfo.address.line1}, ${clinicInfo.address.line2}.`,
  copyright: `© ${new Date().getFullYear()} ${clinicInfo.name}. All rights reserved.`,
} as const;
