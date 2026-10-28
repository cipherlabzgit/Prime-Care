import { useState } from "react";
import { Link } from "react-router-dom";
import { getBookDoctorUrl } from "../../utils/bookingNavigation";
import { getInitials } from "../../utils/channelingUtils";
import {
  getDoctorProfileImagePath,
  getQualificationDisplay,
  getSessionDoctorName,
  resolveDoctorPhotoUrl,
} from "../../utils/doctorDisplayUtils";
import { getDoctorAvailabilityMeta } from "../../utils/doctorAvailability";
import type { DoctorProfile } from "../../types/doctor";

interface DoctorProfileCardProps {
  doctor: DoctorProfile;
  cardIndex?: number;
}

function DoctorProfileCard({ doctor, cardIndex = 0 }: DoctorProfileCardProps) {
  const [imgError, setImgError] = useState(false);
  const doctorName = getSessionDoctorName(doctor);
  const qualification = getQualificationDisplay(doctor.qualification);
  const centersLabel =
    doctor.centers.length > 0 ? doctor.centers.join(", ") : null;
  const profileImagePath = getDoctorProfileImagePath(doctor);
  const photoUrl = resolveDoctorPhotoUrl(profileImagePath);
  const showPhoto = Boolean(photoUrl) && !imgError;
  const availability = getDoctorAvailabilityMeta(doctor);
  const canBook = availability.status !== "unavailable";
  const indexLabel = String(cardIndex + 1).padStart(2, "0");
  return (
    <article
      className="unorthodox-leader-card unorthodox-leader-card--full-photo doctor-directory-card"
      data-index={indexLabel}
    >
      <span
        className={`doctor-directory-card__status doctor-directory-card__badge--${availability.status}`}
      >
        {availability.label}
      </span>

      <div className="unorthodox-leader-card__hero">
        <div className="unorthodox-leader-card__portrait-shell">
          <div className="unorthodox-leader-card__portrait">
            {showPhoto ? (
              <img
                className="unorthodox-leader-card__photo doctor-directory-card__photo"
                src={photoUrl}
                alt={doctorName}
                loading="lazy"
                decoding="async"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="doctor-directory-card__photo-fallback"
                aria-hidden="true"
              >
                <span>{getInitials(doctorName)}</span>
              </div>
            )}
          </div>
        </div>

        {doctor.experienceYears != null &&
        Number.isFinite(doctor.experienceYears) ? (
          <p
            className="unorthodox-leader-card__experience"
            aria-label={`${doctor.experienceYears} years experience`}
          >
            <span className="unorthodox-leader-card__experience-value">
              {doctor.experienceYears}
            </span>
            <span className="unorthodox-leader-card__experience-label">
              Years experience
            </span>
          </p>
        ) : null}
      </div>

      <div className="unorthodox-leader-card__content doctor-directory-card__content">
        <h2 className="unorthodox-leader-card__name">{doctorName}</h2>

        <div className="unorthodox-leader-card__detail-block">
          <span className="unorthodox-leader-card__detail-label">
            Specialization
          </span>
          <p className="unorthodox-leader-card__detail-text">
            {doctor.specialization}
          </p>
          {doctor.designation ? (
            <p
              className="unorthodox-leader-card__detail-text unorthodox-leader-card__detail-text--secondary"
            >
              {doctor.designation}
            </p>
          ) : null}
        </div>

        <div className="unorthodox-leader-card__detail-block">
          <span className="unorthodox-leader-card__detail-label">
            Qualifications
          </span>
          <p className="unorthodox-leader-card__detail-text">
            {qualification ?? "Contact clinic for qualification details."}
          </p>
          {centersLabel ? (
            <p className="doctor-directory-card__centers">{centersLabel}</p>
          ) : null}
        </div>

        {canBook ? (
          <Link
            to={getBookDoctorUrl(doctor.doctorId)}
            className="home-btn home-btn--accent doctor-directory-card__cta"
          >
            Book Session
          </Link>
        ) : (
          <span
            className="home-btn home-btn--accent doctor-directory-card__cta doctor-directory-card__cta--disabled"
            aria-disabled="true"
          >
            Unavailable
          </span>
        )}
      </div>
    </article>
  );
}

export default DoctorProfileCard;
