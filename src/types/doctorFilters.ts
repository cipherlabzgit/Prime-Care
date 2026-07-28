import type { DoctorAvailabilityStatus } from "../utils/doctorAvailability";

export interface DoctorFiltersState {
  centers: string[];
  specializations: string[];
  availability: DoctorAvailabilityStatus[];
  searchQuery: string;
}

export const emptyDoctorFilters: DoctorFiltersState = {
  centers: [],
  specializations: [],
  availability: [],
  searchQuery: "",
};
