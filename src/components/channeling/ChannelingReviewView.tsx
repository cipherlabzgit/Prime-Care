import type { ChannelingSession } from "../../services/channelingService";
import type { SessionTimeSlot } from "../../types/channeling";
import type { PatientFormData } from "../../types/patient";
import { formatFee, formatTime } from "../../utils/channelingUtils";
import {
  calculateBookingFees,
  type RmoCaseTakingInfo,
} from "../../utils/rmoCaseTaking";
import Button from "../ui/Button";
import ChannelingBookingStatusBar from "./ChannelingBookingStatusBar";
import ChannelingDoctorHeader from "./ChannelingDoctorHeader";
import NewPatientRmoNotice from "./NewPatientRmoNotice";

interface ChannelingReviewViewProps {
  session: ChannelingSession;
  selectedSlot: SessionTimeSlot;
  patient: PatientFormData;
  provisionalRef: string;
  timerLabel: string;
  rmoCaseTakingInfo: RmoCaseTakingInfo | null;
  onBack: () => void;
  onContinue: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="channeling-review-details__row">
      <dt>{label}</dt>
      <dd>{value || "—"}</dd>
    </div>
  );
}

function ChannelingReviewView({
  session,
  selectedSlot,
  patient,
  provisionalRef,
  timerLabel,
  rmoCaseTakingInfo,
  onBack,
  onContinue,
}: ChannelingReviewViewProps) {
  const fees = calculateBookingFees(
    session.consultationFee,
    rmoCaseTakingInfo !== null,
  );

  return (
    <div className="channeling-review animate-fade-in-up">
      <div className="channeling-review__hospital">
        {session.centerName.toUpperCase()}
      </div>

      <button type="button" className="channeling-step-back" onClick={onBack}>
        ← Edit patient details
      </button>

      <div className="channeling-review__card">
        <ChannelingDoctorHeader session={session} />

        <ChannelingBookingStatusBar
          sessionDate={session.sessionDate}
          time={selectedSlot.time || session.startTime}
          timerLabel={timerLabel}
        />

        <div className="channeling-review__alert" role="status">
          Your appointment is still <strong>NOT ACTIVE</strong>. Please click
          &lsquo;Continue&rsquo; to pay &amp; confirm.
        </div>

        <dl className="channeling-review-details">
          <DetailRow label="Reference No" value={provisionalRef} />
          <DetailRow label="Patient's Name" value={patient.fullName} />
          <DetailRow label="Phone" value={patient.phone} />
          <DetailRow label="NIC" value={patient.nic} />
          <DetailRow label="Email" value={patient.email || "—"} />
          <DetailRow label="Note / Address" value={patient.notes || "—"} />
          <DetailRow label="Hospital" value={session.centerName} />
          <DetailRow label="Room No" value={session.roomCode || "—"} />
          <DetailRow
            label="Appointment Time"
            value={`${formatTime(selectedSlot.time || session.startTime)} (Doctor may arrive later)`}
          />
          <DetailRow
            label="Doctor Charges"
            value={`${fees.consultationFee.toFixed(2)} LKR`}
          />
          {fees.rmoFee > 0 ? (
            <DetailRow
              label="RMO Charges"
              value={`${fees.rmoFee.toFixed(2)} LKR`}
            />
          ) : null}
          <div className="channeling-review-details__row channeling-review-details__row--total">
            <dt>Total Charges</dt>
            <dd>{formatFee(fees.total)}</dd>
          </div>
        </dl>

        {rmoCaseTakingInfo ? (
          <div className="channeling-review__notice">
            <NewPatientRmoNotice info={rmoCaseTakingInfo} variant="warning" compact />
          </div>
        ) : null}

        <div className="channeling-review__actions">
          <Button type="button" variant="outline" onClick={onBack}>
            Edit
          </Button>
          <Button
            type="button"
            variant="accent"
            onClick={onContinue}
            className="channeling-booking-form__continue"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChannelingReviewView;
