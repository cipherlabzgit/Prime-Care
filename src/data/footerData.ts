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
  { icon: "🌿", label: "Integrative Care" },
  { icon: "💛", label: "Compassionate Service" },
  { icon: "🕐", label: "Open Every Day 9–9" },
] as const;

export const footerTrustStats = [
  { value: "6+", label: "Healthcare Disciplines" },
  { value: "9–9", label: "Daily Clinic Hours" },
  { value: "3", label: "Languages Supported" },
  { value: "✓", label: "Parking Available" },
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
