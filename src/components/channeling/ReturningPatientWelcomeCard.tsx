import type { ExistingPatientProfile } from "../../types/patient";

import Button from "../ui/Button";



interface ReturningPatientWelcomeCardProps {

  profile: ExistingPatientProfile;

  onUseExisting: () => void;

}



function ReturningPatientWelcomeCard({

  profile,

  onUseExisting,

}: ReturningPatientWelcomeCardProps) {

  return (

    <div className="returning-patient-card" role="status">

      <div className="returning-patient-card__header">

        <span className="returning-patient-card__icon" aria-hidden="true">

          ✓

        </span>

        <div>

          <h3 className="returning-patient-card__title">Welcome back</h3>

          <p className="returning-patient-card__subtitle">

            We found your profile in our system.

          </p>

        </div>

      </div>



      <dl className="returning-patient-card__identity">

        <div>

          <dt>Patient code</dt>

          <dd>{profile.patientCode}</dd>

        </div>

        <div>

          <dt>Name</dt>

          <dd>{profile.fullName}</dd>

        </div>

      </dl>



      <Button

        type="button"

        variant="primary"

        fullWidth

        className="returning-patient-card__cta"

        onClick={onUseExisting}

      >

        Use existing profile

      </Button>

    </div>

  );

}



export default ReturningPatientWelcomeCard;

