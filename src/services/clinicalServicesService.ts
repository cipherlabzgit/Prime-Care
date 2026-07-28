import { clinicalServices } from "../data/servicesData";
import type { ClinicalService } from "../types/service";

/**
 * Fetches clinical services for the public Services page.
 * Replace the mock implementation with an ERP/API call when available.
 */
export async function fetchClinicalServices(): Promise<ClinicalService[]> {
  return clinicalServices;
}
