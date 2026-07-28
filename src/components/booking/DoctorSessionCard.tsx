import type { DoctorSession } from "../../types/booking";
import {
  formatCurrency,
  formatDisplayDate,
  getCenterById,
  getDoctorById,
  getSpecializationById,
} from "../../data/bookingData";

interface DoctorSessionCardProps {
  session: DoctorSession;
  selected: boolean;
  onSelect: () => void;
}

function DoctorSessionCard({ session, selected, onSelect }: DoctorSessionCardProps) {
  const doctor = getDoctorById(session.doctorId);
  const center = getCenterById(session.centerId);
  const spec = doctor ? getSpecializationById(doctor.specializationId) : undefined;
  const available = session.maxPatients - session.bookedCount;
  const fillPercent = Math.round((session.bookedCount / session.maxPatients) * 100);

  return (
    <button
      type="button"
      className={`session-card${selected ? " session-card--selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <div className="session-card__top">
        <div className="session-card__avatar" aria-hidden="true">
          {doctor?.imageInitials ?? "DR"}
        </div>
        <div className="session-card__info">
          <h3 className="session-card__name">{doctor?.name ?? "Unknown Doctor"}</h3>
          <p className="session-card__title">{doctor?.title}</p>
          <span className="session-card__badge">{spec?.name}</span>
        </div>
        <div className="session-card__fee">
          <span className="session-card__fee-label">Fee</span>
          <strong>{formatCurrency(session.consultationFee)}</strong>
        </div>
      </div>

      <ul className="session-card__meta">
        <li>
          <CalendarIcon />
          {formatDisplayDate(session.date)}
        </li>
        <li>
          <ClockIcon />
          {session.startTime} – {session.endTime}
        </li>
        <li>
          <LocationIcon />
          {center?.name} · {session.room}
        </li>
      </ul>

      <div className="session-card__availability">
        <div className="session-card__bar">
          <span
            className="session-card__bar-fill"
            style={{ width: `${fillPercent}%` }}
          />
        </div>
        <span className="session-card__slots-text">
          {available > 0 ? (
            <>
              <strong>{available}</strong> slots remaining
            </>
          ) : (
            <span className="session-card__full">Session full</span>
          )}
        </span>
      </div>
    </button>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default DoctorSessionCard;
