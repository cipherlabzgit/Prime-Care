import type { ChannelingSession } from "../../services/channelingService";
import type { SessionTimeSlot } from "../../types/channeling";
import type {
  ExistingPatientProfile,
  PatientFormData,
  PatientFormErrors,
} from "../../types/patient";
import {
  formatDisplayDate,
  formatFee,
  formatTime,
} from "../../utils/channelingUtils";
import { getSessionDoctorName } from "../../utils/doctorDisplayUtils";
import type { RmoCaseTakingInfo } from "../../utils/rmoCaseTaking";
import { getBookingBlockMessage } from "../../utils/patientValidation";
import Button from "../ui/Button";
import BookingPatientSection from "./BookingPatientSection";
import NewPatientRmoNotice from "./NewPatientRmoNotice";
import SlotPicker from "./SlotPicker";

interface ChannelingBookingPanelProps {
  session: ChannelingSession;
  slots: SessionTimeSlot[];
  selectedSlot: SessionTimeSlot | null;
  onSelectSlot: (slot: SessionTimeSlot) => void;
  patient: PatientFormData;
  errors: PatientFormErrors;
  canSubmit: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  slotsLoading?: boolean;
  bookingReference: string | null;
  rmoCaseTakingInfo: RmoCaseTakingInfo | null;
  detectedPatient: ExistingPatientProfile | null;
  profileLinked: boolean;
  pendingProfileAcceptance?: boolean;
  onChange: (patch: Partial<PatientFormData>) => void;
  onDetectedPatientChange: (patient: ExistingPatientProfile | null) => void;
  onPatientLookupSettledChange?: (settled: boolean) => void;
  onUseExistingProfile: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

const STEPS = [
  { id: 1, label: "Session" },
  { id: 2, label: "Time" },
  { id: 3, label: "Details" },
  { id: 4, label: "Confirm" },
] as const;

function BookingStepper({
  activeStep,
  isStepDone,
}: {
  activeStep: number;
  isStepDone: (stepId: number) => boolean;
}) {
  return (
    <ol className="booking-stepper" aria-label="Booking progress">
      {STEPS.map((step, index) => {
        const done = isStepDone(step.id);
        const active = activeStep === step.id && !done;

        let circleClass = "booking-stepper__circle";
        if (done) circleClass += " booking-stepper__circle--done";
        else if (active) circleClass += " booking-stepper__circle--active";
        else circleClass += " booking-stepper__circle--pending";

        let labelClass = "booking-stepper__label";
        if (done) labelClass += " booking-stepper__label--done";
        else if (active) labelClass += " booking-stepper__label--active";

        return (
          <li
            key={step.id}
            className="booking-stepper__item"
            aria-current={active ? "step" : undefined}
          >
            <div className="booking-stepper__track">
              {index > 0 ? (
                <span
                  className={`booking-stepper__connector${
                    isStepDone(STEPS[index - 1].id)
                      ? " booking-stepper__connector--done"
                      : ""
                  }`}
                  aria-hidden="true"
                />
              ) : (
                <span className="booking-stepper__connector booking-stepper__connector--spacer" aria-hidden="true" />
              )}
              <span className={circleClass} aria-hidden="true">
                {done ? "✓" : step.id}
              </span>
              {index < STEPS.length - 1 ? (
                <span
                  className={`booking-stepper__connector${
                    done ? " booking-stepper__connector--done" : ""
                  }`}
                  aria-hidden="true"
                />
              ) : (
                <span className="booking-stepper__connector booking-stepper__connector--spacer" aria-hidden="true" />
              )}
            </div>
            <span className={labelClass}>{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function BookingSummaryStrip({
  session,
  selectedSlot,
}: {
  session: ChannelingSession;
  selectedSlot: SessionTimeSlot | null;
}) {
  const doctorName = getSessionDoctorName(session);
  const initials = doctorName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const timeLabel = selectedSlot
    ? selectedSlot.label
    : `${formatTime(session.startTime)} – ${formatTime(session.endTime)}`;

  return (
    <div className="booking-summary-strip">
      <div className="booking-summary-strip__avatar" aria-hidden="true">
        {initials || "DR"}
      </div>
      <div className="booking-summary-strip__info">
        <p className="booking-summary-strip__doctor">{doctorName}</p>
        <p className="booking-summary-strip__meta">
          {session.specialization}
          <span aria-hidden="true"> · </span>
          {session.centerName}
        </p>
        <div className="booking-summary-strip__chips">
          <span className="booking-summary-strip__chip">
            {formatDisplayDate(session.sessionDate)}
          </span>
          <span
            className={`booking-summary-strip__chip${
              selectedSlot ? " booking-summary-strip__chip--active" : ""
            }`}
          >
            {timeLabel}
          </span>
        </div>
      </div>
      <div className="booking-summary-strip__fee">
        <span>Fee</span>
        <strong>{formatFee(session.consultationFee)}</strong>
      </div>
    </div>
  );
}

function ChannelingBookingPanel({
  session,
  slots,
  selectedSlot,
  onSelectSlot,
  patient,
  errors,
  canSubmit,
  isSubmitting,
  submitError,
  slotsLoading = false,
  bookingReference,
  rmoCaseTakingInfo,
  detectedPatient,
  profileLinked,
  pendingProfileAcceptance = false,
  onChange,
  onDetectedPatientChange,
  onPatientLookupSettledChange,
  onUseExistingProfile,
  onSubmit,
  onClose,
}: ChannelingBookingPanelProps) {
  const confirmed = bookingReference !== null;

  const blockMessage =
    !confirmed && !canSubmit && !isSubmitting
      ? getBookingBlockMessage({
          hasSelectedSlot: selectedSlot !== null,
          errors,
          pendingProfileAcceptance,
        })
      : null;

  const activeStep = confirmed
    ? 4
    : canSubmit
      ? 4
      : selectedSlot
        ? 3
        : 2;

  const isStepDone = (stepId: number) => {
    if (confirmed) return true;
    if (stepId === 1) return true;
    if (stepId === 2) return selectedSlot !== null;
    if (stepId === 3) return canSubmit;
    return false;
  };

  return (
    <aside className="booking-panel channeling-glass channeling-sticky" aria-label="Booking panel">
      <header className="booking-panel__header">
        <div className="booking-panel__header-text">
          <span className="booking-panel__eyebrow">Step 3</span>
          <h2 className="booking-panel__title">
            {confirmed ? "Booking Confirmed" : "Complete Booking"}
          </h2>
          {!confirmed ? (
            <p className="booking-panel__subtitle">Choose a time and enter your details</p>
          ) : null}
        </div>
        {!confirmed ? (
          <button
            type="button"
            onClick={onClose}
            className="booking-panel__close"
            aria-label="Close booking panel"
          >
            ×
          </button>
        ) : null}
      </header>

      {!confirmed ? (
        <div className="booking-panel__stepper-wrap">
          <BookingStepper activeStep={activeStep} isStepDone={isStepDone} />
        </div>
      ) : null}

      <div className="booking-panel__body">
        {confirmed ? (
          <div className="booking-confirmation animate-fade-in-up">
            <div className="booking-confirmation__icon" aria-hidden="true">
              ✓
            </div>
            <h3 className="booking-confirmation__title">You&apos;re all set!</h3>
            <p className="booking-confirmation__text">
              Your appointment has been booked successfully.
            </p>
            <div className="booking-confirmation__ref">
              <span>Reference</span>
              <strong>{bookingReference}</strong>
            </div>
            {rmoCaseTakingInfo ? (
              <div className="booking-confirmation__notice">
                <NewPatientRmoNotice info={rmoCaseTakingInfo} variant="confirmation" compact />
              </div>
            ) : null}
            <p className="booking-confirmation__hint">
              Save your reference number for check-in at the hospital.
            </p>
            <Button className="mt-5 py-3" variant="accent" fullWidth onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <BookingSummaryStrip session={session} selectedSlot={selectedSlot} />

            <section className="booking-section-card" aria-labelledby="slot-picker-heading">
              <div className="booking-section-card__head">
                <span className="booking-section-card__step" aria-hidden="true">
                  2
                </span>
                <div>
                  <h3 id="slot-picker-heading" className="booking-section-card__title">
                    Choose time slot
                  </h3>
                  <p className="booking-section-card__hint">
                    {selectedSlot
                      ? `Selected: ${selectedSlot.label}`
                      : "Pick an available time below"}
                  </p>
                </div>
              </div>
              <SlotPicker
                slots={slots}
                selectedSlotId={selectedSlot?.id ?? null}
                onSelect={onSelectSlot}
                loading={slotsLoading}
                compact
              />
            </section>

            <section className="booking-section-card" aria-labelledby="patient-form-heading">
              <div className="booking-section-card__head">
                <span className="booking-section-card__step" aria-hidden="true">
                  3
                </span>
                <div>
                  <h3 id="patient-form-heading" className="booking-section-card__title">
                    Patient details
                  </h3>
                  <p className="booking-section-card__hint">
                    Enter NIC or mobile to find your existing profile
                  </p>
                </div>
              </div>
              <BookingPatientSection
                patient={patient}
                errors={errors}
                detectedPatient={detectedPatient}
                profileLinked={profileLinked}
                disabled={isSubmitting}
                onChange={onChange}
                onDetectedPatientChange={onDetectedPatientChange}
                onPatientLookupSettledChange={onPatientLookupSettledChange}
                onUseExistingProfile={onUseExistingProfile}
              />
            </section>

            {rmoCaseTakingInfo ? (
              <NewPatientRmoNotice info={rmoCaseTakingInfo} variant="warning" compact />
            ) : null}

            {submitError ? (
              <p className="booking-panel__error" role="alert">
                {submitError}
              </p>
            ) : null}
          </>
        )}
      </div>

      {!confirmed ? (
        <footer className="booking-panel__footer">
          <div className="booking-panel__footer-total">
            <span>Consultation fee</span>
            <strong>{formatFee(session.consultationFee)}</strong>
          </div>
          {blockMessage ? (
            <p className="booking-panel__footer-hint" role="status">
              {blockMessage}
            </p>
          ) : null}
          <Button
            type="button"
            fullWidth
            disabled={!canSubmit || isSubmitting}
            onClick={onSubmit}
            className="booking-panel__submit"
          >
            {isSubmitting ? "Processing…" : "Confirm Booking"}
          </Button>
        </footer>
      ) : null}
    </aside>
  );
}

export default ChannelingBookingPanel;
