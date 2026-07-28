import type { AppointmentSelection } from "../../types/booking";
import {
  formatCurrency,
  formatDisplayDate,
  getCenterById,
  getDoctorById,
  getSpecializationById,
} from "../../data/bookingData";

interface AppointmentSummaryProps {
  selection: AppointmentSelection;
}

function AppointmentSummary({ selection }: AppointmentSummaryProps) {
  const { session, slot } = selection;
  const doctor = session ? getDoctorById(session.doctorId) : undefined;
  const center = session ? getCenterById(session.centerId) : undefined;
  const spec = doctor ? getSpecializationById(doctor.specializationId) : undefined;

  const isComplete = Boolean(session && slot);

  return (
    <aside className="booking-panel booking-panel--summary">
      <div className="booking-panel__header">
        <span className="booking-panel__icon" aria-hidden="true">
          <ReceiptIcon />
        </span>
        <h2 className="booking-panel__title">Appointment Summary</h2>
      </div>

      <div className={`summary-card${isComplete ? " summary-card--ready" : ""}`}>
        {!session && (
          <p className="summary-card__placeholder">
            Your booking details will appear here once you select a session and time
            slot.
          </p>
        )}

        {session && (
          <dl className="summary-list">
            <div className="summary-list__row">
              <dt>Doctor</dt>
              <dd>{doctor?.name}</dd>
            </div>
            <div className="summary-list__row">
              <dt>Specialization</dt>
              <dd>{spec?.name}</dd>
            </div>
            <div className="summary-list__row">
              <dt>Center</dt>
              <dd>{center?.name}</dd>
            </div>
            <div className="summary-list__row">
              <dt>Date</dt>
              <dd>{formatDisplayDate(session.date)}</dd>
            </div>
            <div className="summary-list__row">
              <dt>Session</dt>
              <dd>
                {session.startTime} – {session.endTime}
              </dd>
            </div>
            <div className="summary-list__row">
              <dt>Room</dt>
              <dd>{session.room}</dd>
            </div>
            <div className="summary-list__row summary-list__row--highlight">
              <dt>Time Slot</dt>
              <dd>{slot ? slot.time : "— Select a slot —"}</dd>
            </div>
          </dl>
        )}

        {session && (
          <div className="summary-total">
            <span>Consultation Fee</span>
            <strong>{formatCurrency(session.consultationFee)}</strong>
          </div>
        )}

        {isComplete && (
          <div className="summary-status">
            <CheckIcon />
            Ready to confirm booking
          </div>
        )}
      </div>
    </aside>
  );
}

function ReceiptIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2z" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default AppointmentSummary;
