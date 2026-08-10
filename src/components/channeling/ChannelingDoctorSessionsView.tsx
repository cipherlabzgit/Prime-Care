import { useMemo } from "react";
import type { ChannelingSession } from "../../services/channelingService";
import {
  formatTime,
  sessionDateKey,
} from "../../utils/channelingUtils";
import ChannelingDoctorHeader from "./ChannelingDoctorHeader";

interface ChannelingDoctorSessionsViewProps {
  anchorSession: ChannelingSession;
  sessions: ChannelingSession[];
  onBook: (session: ChannelingSession) => void;
  onBack: () => void;
}

function formatMonthDay(isoDate: string): string {
  const key = sessionDateKey(isoDate);
  return new Date(`${key}T12:00:00`)
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

function formatDayTime(isoDate: string, startTime: string): string {
  const key = sessionDateKey(isoDate);
  const day = new Date(`${key}T12:00:00`)
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  return `${day} ${formatTime(startTime)}`;
}

function getActiveCount(session: ChannelingSession): number {
  if (
    typeof session.totalSlotCount === "number" &&
    session.totalSlotCount >= session.availableSlotCount
  ) {
    return Math.max(0, session.totalSlotCount - session.availableSlotCount);
  }
  return Math.max(0, session.availableSlotCount);
}

function ChannelingDoctorSessionsView({
  anchorSession,
  sessions,
  onBook,
  onBack,
}: ChannelingDoctorSessionsViewProps) {
  const sorted = useMemo(
    () =>
      [...sessions].sort((a, b) => {
        const dateCmp = sessionDateKey(a.sessionDate).localeCompare(
          sessionDateKey(b.sessionDate),
        );
        if (dateCmp !== 0) return dateCmp;
        return a.startTime.localeCompare(b.startTime);
      }),
    [sessions],
  );

  return (
    <div className="channeling-doctor-sessions animate-fade-in-up">
      <button
        type="button"
        className="channeling-step-back"
        onClick={onBack}
      >
        ← Back to search results
      </button>

      <ChannelingDoctorHeader session={anchorSession} />

      <div className="channeling-doctor-sessions__center-bar">
        <span className="channeling-doctor-sessions__center-icon" aria-hidden="true">
          🕒
        </span>
        <h2 className="channeling-doctor-sessions__center-title">
          {anchorSession.centerName.toUpperCase()} SESSIONS
        </h2>
      </div>

      <div className="channeling-doctor-sessions__spec-bar">
        <div className="channeling-doctor-sessions__spec-left">
          <span aria-hidden="true">🩺</span>
          <div>
            <p className="channeling-doctor-sessions__spec-name">
              {anchorSession.specialization.toUpperCase()}
            </p>
            <p className="channeling-doctor-sessions__spec-count">
              {sorted.length} SESSION{sorted.length === 1 ? "" : "S"}
            </p>
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="channeling-doctor-sessions__empty">
          No upcoming sessions available for this doctor at this hospital.
        </div>
      ) : (
        <ul className="channeling-session-rows">
          {sorted.map((session) => {
            const full = session.availableSlotCount <= 0;
            const activeCount = getActiveCount(session);

            return (
              <li key={session.sessionId} className="channeling-session-row">
                <div className="channeling-session-row__when">
                  <span className="channeling-session-row__date">
                    {formatMonthDay(session.sessionDate)}
                  </span>
                  <span className="channeling-session-row__daytime">
                    {formatDayTime(session.sessionDate, session.startTime)}
                  </span>
                </div>

                <div className="channeling-session-row__active">
                  <span className="channeling-session-row__active-label">
                    {typeof session.totalSlotCount === "number"
                      ? "Active appointments"
                      : "Open slots"}
                  </span>
                  <span className="channeling-session-row__active-value">
                    {String(activeCount).padStart(2, "0")}
                  </span>
                </div>

                <button
                  type="button"
                  className={`channeling-session-row__book${
                    full ? " channeling-session-row__book--full" : ""
                  }`}
                  disabled={full}
                  onClick={() => onBook(session)}
                >
                  {full ? (
                    <span aria-hidden="true">🔒</span>
                  ) : (
                    <span aria-hidden="true">🔖</span>
                  )}
                  Book
                </button>

                <span
                  className={`channeling-session-row__status${
                    full ? " channeling-session-row__status--full" : ""
                  }`}
                >
                  {full ? "SESSION FULL" : "AVAILABLE"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default ChannelingDoctorSessionsView;
