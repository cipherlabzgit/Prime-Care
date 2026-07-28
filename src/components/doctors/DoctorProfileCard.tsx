import { Link } from "react-router-dom";
import { getBookDoctorUrl } from "../../utils/bookingNavigation";
import {
  formatExperienceDisplay,
  getDoctorProfileImagePath,
  getQualificationDisplay,
  getSessionDoctorName,
} from "../../utils/doctorDisplayUtils";
import { getDoctorAvailabilityMeta } from "../../utils/doctorAvailability";
import type { DoctorProfile } from "../../types/doctor";
import Button from "../ui/Button";
import Card from "../ui/Card";
import DoctorAvatar from "../ui/DoctorAvatar";
import DoctorAvailabilityBadge from "./DoctorAvailabilityBadge";

interface DoctorProfileCardProps {
  doctor: DoctorProfile;
}

function DoctorProfileCard({ doctor }: DoctorProfileCardProps) {
  const doctorName = getSessionDoctorName(doctor);
  const qualification = getQualificationDisplay(doctor.qualification);
  const experienceLabel = formatExperienceDisplay(doctor.experienceYears);
  const centersLabel =
    doctor.centers.length > 0 ? doctor.centers.join(", ") : null;
  const profileImagePath = getDoctorProfileImagePath(doctor);
  const availability = getDoctorAvailabilityMeta(doctor);

  return (
    <Card
      hover
      padding="md"
      className="doctor-profile-card group flex h-full min-h-[420px] flex-col text-center"
    >
      <div className="relative mx-auto mb-4 flex flex-col items-center">
        <DoctorAvatar
          name={doctorName}
          photo={profileImagePath}
          size="lg"
          className="doctor-profile-card__avatar"
        />
        <div className="mt-4 w-full">
          <DoctorAvailabilityBadge
            status={availability.status}
            label={availability.label}
            className="mx-auto"
          />
        </div>
      </div>

      <h2 className="doctor-profile-card__name">{doctorName}</h2>

      <p className="doctor-profile-card__spec">{doctor.specialization}</p>

      <div className="doctor-profile-card__details mt-4 flex-1 space-y-2 text-left">
        {qualification ? (
          <p className="doctor-profile-card__detail-row">
            <span className="doctor-profile-card__detail-label">Qualification</span>
            <span className="doctor-profile-card__detail-value">{qualification}</span>
          </p>
        ) : null}

        {experienceLabel ? (
          <p className="doctor-profile-card__detail-row">
            <span className="doctor-profile-card__detail-label">Experience</span>
            <span className="doctor-profile-card__detail-value">{experienceLabel}</span>
          </p>
        ) : null}

        {centersLabel ? (
          <p className="doctor-profile-card__detail-row">
            <span className="doctor-profile-card__detail-label">Centers</span>
            <span className="doctor-profile-card__detail-value">{centersLabel}</span>
          </p>
        ) : null}
      </div>

      {availability.status === "unavailable" ? (
        <Button fullWidth variant="accent" disabled className="mt-5">
          Book Session
        </Button>
      ) : (
        <Link to={getBookDoctorUrl(doctor.doctorId)} className="mt-5 block w-full">
          <Button fullWidth variant="accent">
            Book Session
          </Button>
        </Link>
      )}
    </Card>
  );
}

export default DoctorProfileCard;
