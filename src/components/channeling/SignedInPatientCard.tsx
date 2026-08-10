import type { ExistingPatientProfile } from "../../types/patient";
import Button from "../ui/Button";

interface SignedInPatientCardProps {
  profile: ExistingPatientProfile;
  onSignOut: () => void;
}

function SignedInPatientCard({ profile, onSignOut }: SignedInPatientCardProps) {
  return (
    <div className="signed-in-patient-card" role="status">
      <div className="signed-in-patient-card__header">
        <div>
          <p className="signed-in-patient-card__eyebrow">Signed in</p>
          <h3 className="signed-in-patient-card__title">{profile.fullName}</h3>
          <p className="signed-in-patient-card__meta">
            {profile.patientCode} · {profile.mobileNumber}
          </p>
        </div>
        <Button type="button" variant="outline" onClick={onSignOut}>
          Sign out
        </Button>
      </div>
      <p className="signed-in-patient-card__hint">
        Your details are ready. Choose a time slot and continue — no need to
        refill the form.
      </p>
    </div>
  );
}

export default SignedInPatientCard;
