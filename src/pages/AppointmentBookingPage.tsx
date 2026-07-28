import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import AppointmentSummary from "../components/booking/AppointmentSummary";
import BookingFilters from "../components/booking/BookingFilters";
import DoctorSessionList from "../components/booking/DoctorSessionList";
import PatientDetailsForm from "../components/booking/PatientDetailsForm";
import TimeSlotGrid from "../components/booking/TimeSlotGrid";
import {
  defaultBookingDate,
  doctorSessions,
  medicalCenters,
  specializations,
  timeSlotsBySession,
} from "../data/bookingData";
import type {
  AppointmentSelection,
  BookingFilters as Filters,
  DoctorSession,
  PatientDetails,
  TimeSlot,
} from "../types/booking";
import { filterSessions, getDoctorsForFilters } from "../utils/bookingFilters";
import "../styles/booking.css";

const initialFilters: Filters = {
  centerId: "",
  specializationId: "",
  date: defaultBookingDate,
  doctorId: "",
};

const initialPatient: PatientDetails = {
  fullName: "",
  nic: "",
  phone: "",
  email: "",
  notes: "",
};

function AppointmentBookingPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters | null>(null);
  const [selection, setSelection] = useState<AppointmentSelection>({
    session: null,
    slot: null,
  });
  const [patient, setPatient] = useState<PatientDetails>(initialPatient);
  const [submitted, setSubmitted] = useState(false);

  const filteredDoctors = useMemo(
    () => getDoctorsForFilters(filters.centerId, filters.specializationId),
    [filters.centerId, filters.specializationId],
  );

  const visibleSessions = useMemo(() => {
    if (!appliedFilters) return [];
    return filterSessions(doctorSessions, appliedFilters);
  }, [appliedFilters]);

  const currentSlots: TimeSlot[] = useMemo(() => {
    if (!selection.session) return [];
    return timeSlotsBySession[selection.session.id] ?? [];
  }, [selection.session]);

  const handleFilterChange = (patch: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleSearch = () => {
    setAppliedFilters({ ...filters });
    setSelection({ session: null, slot: null });
    setSubmitted(false);
  };

  const handleSelectSession = (session: DoctorSession) => {
    setSelection({ session, slot: null });
    setSubmitted(false);
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelection((prev) => ({ ...prev, slot }));
    setSubmitted(false);
  };

  const canSubmit =
    Boolean(selection.session && selection.slot) &&
    patient.fullName.trim() !== "" &&
    patient.nic.trim() !== "" &&
    patient.phone.trim() !== "";

  const handleConfirm = () => {
    if (canSubmit) {
      setSubmitted(true);
    }
  };

  return (
    <div className="booking-page">
      <Navbar />

      <header className="booking-hero">
        <div className="booking-hero__content">
          <span className="booking-hero__eyebrow">Online Channeling</span>
          <h1>Book Your Appointment</h1>
          <p>
            Search doctor sessions, choose an available time slot, and confirm your
            visit in minutes.
          </p>
        </div>
        <div className="booking-hero__steps" aria-label="Booking steps">
          <span className="booking-step booking-step--active">1. Search</span>
          <span className="booking-step">2. Select Session</span>
          <span className="booking-step">3. Confirm</span>
        </div>
      </header>

      <div className="booking-layout">
        <BookingFilters
          filters={filters}
          centers={medicalCenters}
          specializations={specializations}
          doctors={filteredDoctors}
          onChange={handleFilterChange}
          onSearch={handleSearch}
        />

        <div className="booking-main">
          <DoctorSessionList
            sessions={visibleSessions}
            selectedSessionId={selection.session?.id ?? null}
            onSelectSession={handleSelectSession}
            hasSearched={appliedFilters !== null}
          />
          <TimeSlotGrid
            slots={currentSlots}
            selectedSlotId={selection.slot?.id ?? null}
            onSelectSlot={handleSelectSlot}
            sessionSelected={selection.session !== null}
          />
        </div>

        <div className="booking-sidebar">
          <AppointmentSummary selection={selection} />
          <PatientDetailsForm
            patient={patient}
            onChange={(patch) => setPatient((prev) => ({ ...prev, ...patch }))}
            onSubmit={handleConfirm}
            canSubmit={canSubmit}
            submitted={submitted}
          />
        </div>
      </div>
    </div>
  );
}

export default AppointmentBookingPage;
