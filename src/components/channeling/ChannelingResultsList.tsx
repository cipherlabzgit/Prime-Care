import { useMemo } from "react";
import type { ChannelingSession } from "../../services/channelingService";
import ChannelingSessionResultRow from "./ChannelingSessionResultRow";

interface ChannelingResultsListProps {
  sessions: ChannelingSession[];
  activeSessionId?: number | null;
  onSelect: (session: ChannelingSession) => void;
}

/** One card per doctor at each hospital (Doc990-style search results). */
function uniqueDoctorSessions(sessions: ChannelingSession[]) {
  const seen = new Set<string>();
  const unique: ChannelingSession[] = [];

  for (const session of sessions) {
    const key = `${session.doctorId}::${session.centerName?.trim() || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(session);
  }

  return unique;
}

function groupSessionsByCenter(sessions: ChannelingSession[]) {
  const groups = new Map<string, ChannelingSession[]>();

  for (const session of uniqueDoctorSessions(sessions)) {
    const key = session.centerName?.trim() || "Other Centers";
    const list = groups.get(key);
    if (list) {
      list.push(session);
    } else {
      groups.set(key, [session]);
    }
  }

  return Array.from(groups.entries()).map(([centerName, items]) => ({
    centerName,
    sessions: items,
  }));
}

function ChannelingResultsList({
  sessions,
  activeSessionId = null,
  onSelect,
}: ChannelingResultsListProps) {
  const groups = useMemo(() => groupSessionsByCenter(sessions), [sessions]);

  return (
    <div className="channeling-results" id="doctor-sessions">
      {groups.map((group) => {
        const headingId = `center-${group.centerName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`;

        return (
        <section
          key={group.centerName}
          className="channeling-results__group"
          aria-labelledby={headingId}
        >
          <header
            id={headingId}
            className="channeling-results__group-head"
          >
            <h2 className="channeling-results__group-title">
              {group.centerName.toUpperCase()}{" "}
              <span className="channeling-results__group-count">
                ({group.sessions.length})
              </span>
            </h2>
          </header>

          <ul className="channeling-results__list">
            {group.sessions.map((session) => (
              <li key={session.sessionId}>
                <ChannelingSessionResultRow
                  session={session}
                  isActive={activeSessionId === session.sessionId}
                  onSelect={() => onSelect(session)}
                />
              </li>
            ))}
          </ul>
        </section>
        );
      })}
    </div>
  );
}

export default ChannelingResultsList;
