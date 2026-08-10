import type { ChannelingSession } from "../../services/channelingService";
import { getSessionDoctorName } from "../../utils/doctorDisplayUtils";
import DoctorAvatar from "../ui/DoctorAvatar";

interface ChannelingDoctorHeaderProps {
  session: ChannelingSession;
  notes?: string | null;
}

function ChannelingDoctorHeader({ session, notes }: ChannelingDoctorHeaderProps) {
  const doctorName = getSessionDoctorName(session);
  const summary = notes?.trim() || session.profileSummary?.trim() || "";

  return (
    <header className="channeling-doctor-header">
      <div className="channeling-doctor-header__profile">
        <DoctorAvatar
          name={doctorName}
          photo={session.profileImage ?? session.profilePhoto}
          size="lg"
        />
        <span className="channeling-doctor-header__profile-label">Profile</span>
      </div>

      <div className="channeling-doctor-header__info">
        <h1 className="channeling-doctor-header__name">{doctorName}</h1>
        <p className="channeling-doctor-header__spec">{session.specialization}</p>
        {summary ? (
          <p className="channeling-doctor-header__notes">{summary}</p>
        ) : null}
      </div>
    </header>
  );
}

export default ChannelingDoctorHeader;
