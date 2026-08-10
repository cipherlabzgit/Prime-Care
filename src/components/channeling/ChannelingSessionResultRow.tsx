import type { ChannelingSession } from "../../services/channelingService";
import {
  formatDisplayDate,
  formatTime,
} from "../../utils/channelingUtils";
import { getSessionDoctorName } from "../../utils/doctorDisplayUtils";
import DoctorAvatar from "../ui/DoctorAvatar";

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
  const doctorName = getSessionDoctorName(session);
  const noSlots = session.availableSlotCount <= 0;

  return (
    <article
      className={`channeling-result-row${
        isActive ? " channeling-result-row--active" : ""
      }`}
    >
      <div className="channeling-result-row__profile">
        <DoctorAvatar
          name={doctorName}
          photo={session.profileImage ?? session.profilePhoto}
          size="md"
        />
        <span className="channeling-result-row__profile-label">Profile</span>
      </div>

      <div className="channeling-result-row__info">
        <h3 className="channeling-result-row__name">{doctorName}</h3>
        <p className="channeling-result-row__spec">{session.specialization}</p>
        <p className="channeling-result-row__meta">
          {formatDisplayDate(session.sessionDate)} · {formatTime(session.startTime)} –{" "}
          {formatTime(session.endTime)}
          {session.roomCode ? ` · Room ${session.roomCode}` : ""}
        </p>
      </div>

      <button
        type="button"
        className="channeling-result-row__channel"
        disabled={noSlots}
        onClick={onSelect}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 3.75 9-9.75M12 3.75c-2.4 2.1-4.2 4.35-5.25 6.75-.75 1.8-1.05 3.45-.9 4.95 2.1.45 4.2.3 6.3-.45 2.55-.9 4.8-2.55 6.6-4.8"
          />
        </svg>
        {isActive ? "Selected" : "Channel"}
      </button>
    </article>
  );
}

export default ChannelingSessionResultRow;
