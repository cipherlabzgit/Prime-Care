import type { PatientDetails } from "../../types/booking";

interface PatientDetailsFormProps {
  patient: PatientDetails;
  onChange: (patch: Partial<PatientDetails>) => void;
  onSubmit: () => void;
  canSubmit: boolean;
  submitted: boolean;
}

function PatientDetailsForm({
  patient,
  onChange,
  onSubmit,
  canSubmit,
  submitted,
}: PatientDetailsFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      onSubmit();
    }
  };

  return (
    <section className="booking-panel booking-panel--patient">
      <div className="booking-panel__header">
        <span className="booking-panel__icon" aria-hidden="true">
          <UserIcon />
        </span>
        <h2 className="booking-panel__title">Patient Details</h2>
      </div>

      {submitted ? (
        <div className="booking-success" role="status">
          <div className="booking-success__icon" aria-hidden="true">
            <CheckIcon />
          </div>
          <h3>Booking Successfully Confirmed</h3>
          <p>
            Please save your booking reference number for future use.
          </p>
          <button
            type="button"
            className="booking-btn booking-btn--secondary booking-btn--block"
            onClick={() => window.location.reload()}
          >
            Book Another Appointment
          </button>
        </div>
      ) : (
        <form className="patient-form" onSubmit={handleSubmit}>
          <div className="booking-field">
            <label htmlFor="fullName">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              required
              placeholder="Enter patient full name"
              value={patient.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
            />
          </div>

          <div className="booking-field">
            <label htmlFor="nic">
              NIC / Passport <span className="required">*</span>
            </label>
            <input
              id="nic"
              type="text"
              required
              placeholder="e.g. 199012345678"
              value={patient.nic}
              onChange={(e) => onChange({ nic: e.target.value })}
            />
          </div>

          <div className="booking-field">
            <label htmlFor="phone">
              Mobile Number <span className="required">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              required
              placeholder="07X XXX XXXX"
              value={patient.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
            />
          </div>

          <div className="booking-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="patient@email.com"
              value={patient.email}
              onChange={(e) => onChange({ email: e.target.value })}
            />
          </div>

          <div className="booking-field">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Symptoms, allergies, or special requirements"
              value={patient.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="booking-btn booking-btn--accent booking-btn--block"
            disabled={!canSubmit}
          >
            Confirm Appointment
          </button>

          {!canSubmit && (
            <p className="patient-form__hint">
              Select a session, time slot, and complete required fields to confirm.
            </p>
          )}
        </form>
      )}
    </section>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default PatientDetailsForm;
