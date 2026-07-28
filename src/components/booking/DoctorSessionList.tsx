import type { DoctorSession } from "../../types/booking";
import DoctorSessionCard from "./DoctorSessionCard";

interface DoctorSessionListProps {
  sessions: DoctorSession[];
  selectedSessionId: string | null;
  onSelectSession: (session: DoctorSession) => void;
  hasSearched: boolean;
}

function DoctorSessionList({
  sessions,
  selectedSessionId,
  onSelectSession,
  hasSearched,
}: DoctorSessionListProps) {
  return (
    <section className="booking-sessions" aria-labelledby="sessions-heading">
      <div className="booking-panel__header booking-panel__header--inline">
        <span className="booking-panel__icon" aria-hidden="true">
          <StethoscopeIcon />
        </span>
        <div>
          <h2 id="sessions-heading" className="booking-panel__title">
            Doctor Sessions
          </h2>
          <p className="booking-panel__subtitle">
            {hasSearched
              ? `${sessions.length} session${sessions.length === 1 ? "" : "s"} found`
              : "Use filters and search to view available sessions"}
          </p>
        </div>
      </div>

      <div className="session-list">
        {!hasSearched && (
          <div className="booking-empty">
            <p>Select your preferences and click Search Sessions to begin.</p>
          </div>
        )}

        {hasSearched && sessions.length === 0 && (
          <div className="booking-empty booking-empty--warn">
            <p>No sessions match your criteria. Try another date or center.</p>
          </div>
        )}

        {sessions.map((session) => (
          <DoctorSessionCard
            key={session.id}
            session={session}
            selected={selectedSessionId === session.id}
            onSelect={() => onSelectSession(session)}
          />
        ))}
      </div>
    </section>
  );
}

function StethoscopeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 4v6a6 6 0 0 0 12 0V4M6 4H4M18 4h-2" strokeLinecap="round" />
      <path d="M12 16v4M9 22h6" strokeLinecap="round" />
    </svg>
  );
}

export default DoctorSessionList;
