export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: "booking" | "doctors" | "centers" | "care";
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface StatisticItem {
  id: string;
  value: string;
  label: string;
}

export interface FeaturedDoctor {
  id: string;
  name: string;
  specialization: string;
  qualifications: string;
  initials: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface MedicalCenter {
  id: string;
  name: string;
  location: string;
  services: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
}
