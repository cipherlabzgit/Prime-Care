import { useState } from "react";
import type { ChannelingSession } from "../../services/channelingService";
import {
  formatDisplayDate,
  formatTime,
  getInitials,
} from "../../utils/channelingUtils";
import {
  getQualificationDisplay,
  getSessionDoctorName,
  resolveDoctorPhotoUrl,
} from "../../utils/doctorDisplayUtils";

interface ChannelingSessionResultRowProps {
  session: ChannelingSession;
  isActive: boolean;
  onSelect: () => void;
}

function ChannelingSessionResultRow({
  session,
  isActive,
  onSelect,
}: ChannelingSessionResultRowProps) {
  const [imgError, setImgError] = useState(false);
  const doctorName = getSessionDoctorName(session);
  const qualification = getQualificationDisplay(session.qualification);
  const photoUrl = resolveDoctorPhotoUrl(
    session.profileImage ?? session.profilePhoto,
  );
  const showPhoto = Boolean(photoUrl) && !imgError;
  const noSlots = session.availableSlotCount <= 0;
  const sessionWhen = `${formatDisplayDate(session.sessionDate)} · ${formatTime(session.startTime)} – ${formatTime(session.endTime)}`;
  const roomLabel = session.roomCode ? `Room ${session.roomCode}` : null;

  return (
    <article
      className={`channeling-result-card${
        isActive ? " channeling-result-card--active" : ""
      }${noSlots ? " channeling-result-card--full" : ""}`}
    >
      <div className="channeling-result-card__photo-shell">
        <div className="channeling-result-card__photo-frame">
          {showPhoto ? (
            <img
              src={photoUrl}
              alt=""
              className="channeling-result-card__photo"
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="channeling-result-card__photo-fallback" aria-hidden="true">
              <span>{getInitials(doctorName)}</span>
            </div>
          )}
        </div>
        {!noSlots ? (
          <span className="channeling-result-card__slots">
            {session.availableSlotCount} slot
            {session.availableSlotCount === 1 ? "" : "s"} left
          </span>
        ) : (
          <span className="channeling-result-card__slots channeling-result-card__slots--muted">
            No slots
          </span>
        )}
      </div>

      <div className="channeling-result-card__body">
        <h3 className="channeling-result-card__name">{doctorName}</h3>

        {session.experienceYears != null &&
        Number.isFinite(session.experienceYears) ? (
          <p className="channeling-result-card__experience">
            <strong>{session.experienceYears}</strong> years experience
          </p>
        ) : null}

        <div className="channeling-result-card__detail">
          <span className="channeling-result-card__detail-label">
            Specialization
          </span>
          <p className="channeling-result-card__detail-text">
            {session.specialization}
          </p>
          {session.designation ? (
            <p
              className="channeling-result-card__detail-text channeling-result-card__detail-text--muted"
            >
              {session.designation}
            </p>
          ) : null}
        </div>

        <div className="channeling-result-card__detail">
          <span className="channeling-result-card__detail-label">
            Qualifications
          </span>
          <p
            className="channeling-result-card__detail-text channeling-result-card__detail-text--qual"
          >
            {qualification ?? "Available at the clinic."}
          </p>
        </div>

        <div className="channeling-result-card__session">
          <span className="channeling-result-card__detail-label">Session</span>
          <p className="channeling-result-card__session-when">{sessionWhen}</p>
          {roomLabel ? (
            <p className="channeling-result-card__session-room">{roomLabel}</p>
          ) : null}
          <p className="channeling-result-card__session-center">
            {session.centerName}
          </p>
        </div>

        <button
          type="button"
          className="channeling-result-card__cta"
          disabled={noSlots}
          onClick={onSelect}
        >
          {isActive ? "Selected" : "Channel doctor"}
        </button>
      </div>
    </article>
  );
}

export default ChannelingSessionResultRow;
