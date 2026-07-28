import type { RmoCaseTakingInfo } from "../../utils/rmoCaseTaking";
import { formatTime } from "../../utils/channelingUtils";

interface NewPatientRmoNoticeProps {
  info: RmoCaseTakingInfo;
  variant?: "warning" | "confirmation";
  compact?: boolean;
}

function NewPatientRmoNotice({
  info,
  variant = "warning",
  compact = false,
}: NewPatientRmoNoticeProps) {
  const isConfirmation = variant === "confirmation";
  const arrivalLabel = formatTime(info.recommendedArrivalTime);
  const doctorLabel = formatTime(info.doctorAppointmentTime);

  if (compact) {
    return (
      <section
        className={`rmo-notice rmo-notice--compact${
          isConfirmation ? " rmo-notice--confirmation" : ""
        }`}
        aria-labelledby={isConfirmation ? "rmo-confirmed-heading" : "rmo-warning-heading"}
      >
        <div className="rmo-notice__icon" aria-hidden="true">
          {isConfirmation ? "ℹ" : "!"}
        </div>
        <div className="rmo-notice__body">
          <h4
            id={isConfirmation ? "rmo-confirmed-heading" : "rmo-warning-heading"}
            className="rmo-notice__title"
          >
            {isConfirmation ? "Report to Reception first" : "First visit — arrive early"}
          </h4>
          <p className="rmo-notice__text">
            {isConfirmation
              ? "Show your reference at Reception. RMO case taking (~15 min) before your doctor."
              : "New patients visit Reception first, then RMO (~15 min) before the doctor."}
          </p>
          <ul className="rmo-notice__timeline">
            <li>
              <span>Reception</span>
              <strong>By {arrivalLabel}</strong>
            </li>
            <li>
              <span>RMO</span>
              <strong>~{info.rmoCaseTakingMinutes} min</strong>
            </li>
            <li>
              <span>Doctor</span>
              <strong>{doctorLabel}</strong>
            </li>
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`rmo-notice${isConfirmation ? " rmo-notice--confirmation" : ""}`}
      aria-labelledby={isConfirmation ? "rmo-confirmed-heading" : "rmo-warning-heading"}
    >
      <div className="rmo-notice__icon" aria-hidden="true">
        {isConfirmation ? "ℹ" : "!"}
      </div>
      <div className="rmo-notice__body">
        <h4
          id={isConfirmation ? "rmo-confirmed-heading" : "rmo-warning-heading"}
          className="rmo-notice__title"
        >
          {isConfirmation
            ? "New patient — report to Reception first"
            : "New patient appointment"}
        </h4>
        <p className="rmo-notice__text">
          {isConfirmation
            ? "On arrival, go to the Reception desk with your booking reference. Reception will verify your booking and direct you to RMO for case taking before your doctor appointment."
            : "As a new patient, report to Reception on arrival. Reception will assign you to RMO for case taking (~15 minutes) before your doctor visit."}
        </p>
        <ol className="rmo-notice__steps">
          <li>
            <span>1. Reception desk</span>
            <strong>Arrive by {arrivalLabel}</strong>
          </li>
          <li>
            <span>2. RMO case taking</span>
            <strong>~{info.rmoCaseTakingMinutes} minutes</strong>
          </li>
          <li>
            <span>3. Doctor appointment</span>
            <strong>{doctorLabel}</strong>
          </li>
        </ol>
      </div>
    </section>
  );
}

export default NewPatientRmoNotice;
