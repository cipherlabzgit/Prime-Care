export interface MedicalCenter {
  id: string;
  name: string;
  city: string;
}

export interface Specialization {
  id: string;
  name: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specializationId: string;
  centerIds: string[];
  imageInitials: string;
}

export interface DoctorSession {
  id: string;
  doctorId: string;
  centerId: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  consultationFee: number;
  maxPatients: number;
  bookedCount: number;
}

export interface TimeSlot {
  id: string;
  sessionId: string;
  time: string;
  available: boolean;
}

export interface BookingFilters {
  centerId: string;
  specializationId: string;
  date: string;
  doctorId: string;
}

export interface PatientDetails {
  fullName: string;
  nic: string;
  phone: string;
  email: string;
  notes: string;
}

export interface AppointmentSelection {
  session: DoctorSession | null;
  slot: TimeSlot | null;
}
