import type {
  Doctor,
  DoctorSession,
  MedicalCenter,
  Specialization,
  TimeSlot,
} from "../types/booking";

export const medicalCenters: MedicalCenter[] = [
  { id: "colombo-main", name: "PremierCare Colombo", city: "Colombo" },
  { id: "kandy", name: "PremierCare Kandy", city: "Kandy" },
  { id: "galle", name: "PremierCare Galle", city: "Galle" },
];

export const specializations: Specialization[] = [
  { id: "general", name: "General Medicine" },
  { id: "cardiology", name: "Cardiology" },
  { id: "pediatrics", name: "Pediatrics" },
  { id: "dermatology", name: "Dermatology" },
  { id: "orthopedics", name: "Orthopedics" },
  { id: "ent", name: "ENT" },
];

export const doctors: Doctor[] = [
  {
    id: "dr-silva",
    name: "Dr. Nimal Silva",
    title: "Consultant Physician",
    specializationId: "general",
    centerIds: ["colombo-main", "kandy"],
    imageInitials: "NS",
  },
  {
    id: "dr-fernando",
    name: "Dr. Anjali Fernando",
    title: "Senior Cardiologist",
    specializationId: "cardiology",
    centerIds: ["colombo-main"],
    imageInitials: "AF",
  },
  {
    id: "dr-jayawardena",
    name: "Dr. Ruwan Jayawardena",
    title: "Pediatric Specialist",
    specializationId: "pediatrics",
    centerIds: ["colombo-main", "galle"],
    imageInitials: "RJ",
  },
  {
    id: "dr-perera",
    name: "Dr. Maya Perera",
    title: "Dermatologist",
    specializationId: "dermatology",
    centerIds: ["kandy", "galle"],
    imageInitials: "MP",
  },
  {
    id: "dr-ratnayake",
    name: "Dr. Kavindu Ratnayake",
    title: "Orthopedic Surgeon",
    specializationId: "orthopedics",
    centerIds: ["colombo-main"],
    imageInitials: "KR",
  },
  {
    id: "dr-wickramasinghe",
    name: "Dr. Sithmi Wickramasinghe",
    title: "ENT Consultant",
    specializationId: "ent",
    centerIds: ["kandy"],
    imageInitials: "SW",
  },
];

function todayIso(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function addDaysIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const defaultBookingDate = todayIso();

export const doctorSessions: DoctorSession[] = [
  {
    id: "sess-1",
    doctorId: "dr-silva",
    centerId: "colombo-main",
    date: todayIso(),
    startTime: "08:30",
    endTime: "12:30",
    room: "Room 204, Block A",
    consultationFee: 3500,
    maxPatients: 24,
    bookedCount: 11,
  },
  {
    id: "sess-2",
    doctorId: "dr-fernando",
    centerId: "colombo-main",
    date: todayIso(),
    startTime: "14:00",
    endTime: "17:00",
    room: "Cardiology Unit 3",
    consultationFee: 5500,
    maxPatients: 18,
    bookedCount: 14,
  },
  {
    id: "sess-3",
    doctorId: "dr-jayawardena",
    centerId: "colombo-main",
    date: addDaysIso(1),
    startTime: "09:00",
    endTime: "13:00",
    room: "Pediatric Wing 1",
    consultationFee: 4000,
    maxPatients: 20,
    bookedCount: 6,
  },
  {
    id: "sess-4",
    doctorId: "dr-perera",
    centerId: "kandy",
    date: todayIso(),
    startTime: "10:00",
    endTime: "14:00",
    room: "Dermatology Clinic",
    consultationFee: 4500,
    maxPatients: 16,
    bookedCount: 9,
  },
  {
    id: "sess-5",
    doctorId: "dr-ratnayake",
    centerId: "colombo-main",
    date: addDaysIso(2),
    startTime: "08:00",
    endTime: "11:30",
    room: "Ortho Theatre 2",
    consultationFee: 6000,
    maxPatients: 14,
    bookedCount: 4,
  },
  {
    id: "sess-6",
    doctorId: "dr-wickramasinghe",
    centerId: "kandy",
    date: addDaysIso(1),
    startTime: "15:00",
    endTime: "18:00",
    room: "ENT Suite 5",
    consultationFee: 4200,
    maxPatients: 12,
    bookedCount: 3,
  },
  {
    id: "sess-7",
    doctorId: "dr-jayawardena",
    centerId: "galle",
    date: todayIso(),
    startTime: "09:30",
    endTime: "12:00",
    room: "Coastal Clinic 2",
    consultationFee: 3800,
    maxPatients: 15,
    bookedCount: 7,
  },
];

export const timeSlotsBySession: Record<string, TimeSlot[]> = {
  "sess-1": buildSlots("sess-1", [
    "08:30",
    "08:50",
    "09:10",
    "09:30",
    "09:50",
    "10:10",
    "10:30",
    "10:50",
    "11:10",
    "11:30",
  ]),
  "sess-2": buildSlots("sess-2", [
    "14:00",
    "14:25",
    "14:50",
    "15:15",
    "15:40",
    "16:05",
    "16:30",
  ]),
  "sess-3": buildSlots("sess-3", [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
  ]),
  "sess-4": buildSlots("sess-4", [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
  ]),
  "sess-5": buildSlots("sess-5", [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
  ]),
  "sess-6": buildSlots("sess-6", [
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ]),
  "sess-7": buildSlots("sess-7", [
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
  ]),
};

function buildSlots(
  sessionId: string,
  times: string[],
  unavailableIndices: number[] = [],
): TimeSlot[] {
  return times.map((time, index) => ({
    id: `${sessionId}-${time.replace(":", "")}`,
    sessionId,
    time,
    available: !unavailableIndices.includes(index),
  }));
}

// Mark some slots as booked for realism
timeSlotsBySession["sess-1"] = buildSlots(
  "sess-1",
  ["08:30", "08:50", "09:10", "09:30", "09:50", "10:10", "10:30", "10:50", "11:10", "11:30"],
  [0, 2, 5, 7],
);
timeSlotsBySession["sess-2"] = buildSlots(
  "sess-2",
  ["14:00", "14:25", "14:50", "15:15", "15:40", "16:05", "16:30"],
  [1, 3, 4, 6],
);

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id);
}

export function getCenterById(id: string): MedicalCenter | undefined {
  return medicalCenters.find((c) => c.id === id);
}

export function getSpecializationById(id: string): Specialization | undefined {
  return specializations.find((s) => s.id === id);
}

export function formatCurrency(amount: number): string {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}

export function formatDisplayDate(isoDate: string): string {
  return new Date(isoDate + "T12:00:00").toLocaleDateString("en-LK", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
