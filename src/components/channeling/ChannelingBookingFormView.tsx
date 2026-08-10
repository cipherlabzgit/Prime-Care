import type { ChannelingSession } from "../../services/channelingService";
import type { ChannelingPaymentMethod, SessionTimeSlot } from "../../types/channeling";
import { PAYMENT_METHOD_LABELS } from "../../types/channeling";
import type {
  ExistingPatientProfile,
  PatientFormData,
  PatientFormErrors,
} from "../../types/patient";
import type { RmoCaseTakingInfo } from "../../utils/rmoCaseTaking";
import { getBookingBlockMessage } from "../../utils/patientValidation";
import Button from "../ui/Button";
import BookingFeeBreakdown from "./BookingFeeBreakdown";
import BookingPatientSection from "./BookingPatientSection";
import ChannelingBookingStatusBar from "./ChannelingBookingStatusBar";
import ChannelingDoctorHeader from "./ChannelingDoctorHeader";
import NewPatientRmoNotice from "./NewPatientRmoNotice";
import SlotPicker from "./SlotPicker";

interface ChannelingBookingFormViewProps {
  session: ChannelingSession;
  slots: SessionTimeSlot[];
  selectedSlot: SessionTimeSlot | null;
  onSelectSlot: (slot: SessionTimeSlot) => void;
  patient: PatientFormData;
  errors: PatientFormErrors;
  canContinue: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  slotsLoading?: boolean;
  bookingReference: string | null;
  rmoCaseTakingInfo: RmoCaseTakingInfo | null;
  detectedPatient: ExistingPatientProfile | null;
  profileLinked: boolean;
  pendingProfileAcceptance?: boolean;
  paymentMethod: ChannelingPaymentMethod | null;
  timerLabel?: string | null;
  holdBusy?: boolean;
  holdDegraded?: boolean;
  onChange: (patch: Partial<PatientFormData>) => void;
  onDetectedPatientChange: (patient: ExistingPatientProfile | null) => void;
  onPatientLookupSettledChange?: (settled: boolean) => void;
  onUseExistingProfile: () => void;
  onSignedInProfile: (profile: ExistingPatientProfile) => void;
  onClearSignedInProfile: () => void;
  onContinue: () => void;
  onBack: () => void;
  onDone: () => void;
}

function ChannelingBookingFormView({
  session,
  slots,
  selectedSlot,
  onSelectSlot,
  patient,
  errors,
  canContinue,
  isSubmitting,
  submitError,
  slotsLoading = false,
  bookingReference,
  rmoCaseTakingInfo,
  detectedPatient,
  profileLinked,
  pendingProfileAcceptance = false,
  paymentMethod,
  timerLabel = null,
  holdBusy = false,
  holdDegraded = false,
  onChange,
  onDetectedPatientChange,
  onPatientLookupSettledChange,
  onUseExistingProfile,
  onSignedInProfile,
  onClearSignedInProfile,
  onContinue,
  onBack,
  onDone,
}: ChannelingBookingFormViewProps) {
  const confirmed = bookingReference !== null;
  const requiresRmoFee = rmoCaseTakingInfo !== null;
  const appointmentTime = selectedSlot?.time || session.startTime;

  const blockMessage =
    !confirmed && !canContinue && !isSubmitting
      ? getBookingBlockMessage({
          hasSelectedSlot: selectedSlot !== null,
          errors,
          pendingProfileAcceptance,
        })
      : null;

  if (confirmed) {
    return (
      <div className="channeling-booking-form animate-fade-in-up">
        <div className="booking-confirmation">
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
          {paymentMethod ? (
            <div className="booking-confirmation__payment">
              <span>Payment</span>
              <strong>{PAYMENT_METHOD_LABELS[paymentMethod]}</strong>
            </div>
          ) : null}
          <BookingFeeBreakdown
            consultationFee={session.consultationFee}
            requiresRmoFee={requiresRmoFee}
            variant="confirmation"
          />
          {rmoCaseTakingInfo ? (
            <div className="booking-confirmation__notice">
              <NewPatientRmoNotice info={rmoCaseTakingInfo} variant="confirmation" compact />
            </div>
          ) : null}
          <Button className="mt-5 py-3" variant="accent" fullWidth onClick={onDone}>
            Done
          </Button>
          {!profileLinked ? (
            <p className="booking-confirmation__save-hint">
              Tip: sign in with mobile OTP on My Bookings so your next visit
              autofills.
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="channeling-booking-form animate-fade-in-up">
      <button type="button" className="channeling-step-back" onClick={onBack}>
        ← Back to sessions
      </button>

      <ChannelingDoctorHeader session={session} />

      <ChannelingBookingStatusBar
        sessionDate={session.sessionDate}
        time={appointmentTime}
        centerName={session.centerName}
        timerLabel={selectedSlot && timerLabel ? timerLabel : null}
      />

      <section className="channeling-booking-form__section" aria-labelledby="slot-heading">
        <h2 id="slot-heading" className="channeling-booking-form__section-title">
          Choose time slot
        </h2>
        {selectedSlot && !holdDegraded ? (
          <p className="channeling-booking-form__hold-note" role="status">
            Slot held for you while you complete booking. Other patients cannot
            take this time until your hold expires.
          </p>
        ) : null}
        {selectedSlot && holdDegraded ? (
          <p className="channeling-booking-form__hold-note channeling-booking-form__hold-note--warn" role="status">
            Slot selected, but locking failed. Restart Vite (<code>npm run dev</code>)
            so the slot can be blocked for other patients during your booking timer.
          </p>
        ) : null}
        <SlotPicker
          slots={slots}
          selectedSlotId={selectedSlot?.id ?? null}
          onSelect={onSelectSlot}
          loading={slotsLoading}
          compact
        />
      </section>

      <section className="channeling-booking-form__section" aria-labelledby="details-heading">
        <h2 id="details-heading" className="channeling-booking-form__section-title">
          Patient details
        </h2>
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
          onSignedInProfile={onSignedInProfile}
          onClearSignedInProfile={onClearSignedInProfile}
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

      <div className="channeling-booking-form__footer">
        {blockMessage ? (
          <p className="booking-panel__footer-hint" role="status">
            {blockMessage}
          </p>
        ) : null}
        <p className="channeling-booking-form__terms">
          By clicking Continue, I agree to the terms &amp; conditions for this booking.
        </p>
        <Button
          type="button"
          disabled={!canContinue || isSubmitting || holdBusy}
          onClick={onContinue}
          className="channeling-booking-form__continue"
        >
          {holdBusy ? "Reserving slot…" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

export default ChannelingBookingFormView;
