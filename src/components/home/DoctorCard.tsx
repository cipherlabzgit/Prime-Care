import { useState } from "react";
import { Link } from "react-router-dom";
import { getBookDoctorUrl } from "../../utils/bookingNavigation";
import {
  formatExperienceDisplay,
  resolveDoctorPhotoUrl,
} from "../../utils/doctorDisplayUtils";
import { getInitials } from "../../utils/channelingUtils";

export interface DoctorCardProps {
  doctorId: number;
  name: string;
  specialization: string;
  qualifications?: string;
  designation?: string;
  experienceYears?: number;
  profileImage?: string | null;
}

function DoctorCard({
  doctorId,
  name,
  specialization,
  designation,
  experienceYears,
  profileImage,
}: DoctorCardProps) {
  const [imgError, setImgError] = useState(false);
  const photoUrl = resolveDoctorPhotoUrl(profileImage);
  const showPhoto = Boolean(photoUrl) && !imgError;
  const experienceLabel = formatExperienceDisplay(experienceYears);

  return (
    <article className="doctor-card doctor-card--modern">
      <div className="doctor-card__media">
        {showPhoto ? (
          <img
            className="doctor-card__photo"
            src={photoUrl}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="doctor-card__photo-fallback" aria-hidden="true">
            <span className="doctor-card__photo-fallback-initials">
              {getInitials(name)}
            </span>
          </div>
        )}
        <div
          className="doctor-card__media-shade doctor-card__media-shade--light"
          aria-hidden="true"
        />
        <span className="doctor-card__badge">Available</span>
      </div>

      <div className="doctor-card__body">
        <h3 className="doctor-card__name">{name}</h3>
        <div className="doctor-card__meta">
          <span className="doctor-card__spec">{specialization}</span>
          {experienceLabel ? (
            <span className="doctor-card__experience">{experienceLabel}</span>
          ) : null}
        </div>
        {designation ? (
          <p className="doctor-card__qual">{designation}</p>
        ) : null}
        <Link to={getBookDoctorUrl(doctorId)} className="doctor-card__cta">
          <span>Book Session</span>
          <span className="doctor-card__cta-icon" aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default DoctorCard;
