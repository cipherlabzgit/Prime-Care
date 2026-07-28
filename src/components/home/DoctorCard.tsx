import { Link } from "react-router-dom";
import { getBookDoctorUrl } from "../../utils/bookingNavigation";
import { getInitials } from "../../utils/channelingUtils";

export interface DoctorCardProps {
  doctorId: number;
  name: string;
  specialization: string;
  qualifications?: string;
  initials?: string;
}

function DoctorCard({
  doctorId,
  name,
  specialization,
  qualifications,
  initials,
}: DoctorCardProps) {
  const avatarInitials = initials ?? getInitials(name);

  return (
    <article className="doctor-card doctor-card--premium">
      <div className="doctor-card__header">
        <div className="doctor-card__avatar" aria-hidden="true">
          {avatarInitials}
        </div>
        <span className="doctor-card__badge">Available</span>
      </div>
      <h3 className="doctor-card__name">{name}</h3>
      <p className="doctor-card__spec">{specialization}</p>
      {qualifications ? (
        <p className="doctor-card__qual">{qualifications}</p>
      ) : null}
      <Link to={getBookDoctorUrl(doctorId)} className="doctor-card__cta">
        Book Session
      </Link>
    </article>
  );
}

export default DoctorCard;
