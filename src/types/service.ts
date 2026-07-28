export interface ClinicalService {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  services: string[];
  image: string;
  /** Optional secondary list (e.g. common treatments) */
  treatments?: string[];
}

export interface ServiceStatistic {
  id: string;
  value: string;
  label: string;
}
