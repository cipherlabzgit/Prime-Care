import { useState } from "react";
import type { ChannelingSession } from "../../services/channelingService";
import type { ChannelingPaymentMethod } from "../../types/channeling";
import { formatFee } from "../../utils/channelingUtils";
import { calculateBookingFees } from "../../utils/rmoCaseTaking";
import Button from "../ui/Button";
import ChannelingPaymentModal from "./ChannelingPaymentModal";

interface ChannelingPaymentViewProps {
  session: ChannelingSession;
  requiresRmoFee: boolean;
  paymentMethod: ChannelingPaymentMethod | null;
  onPaymentMethodChange: (method: ChannelingPaymentMethod) => void;
  timerLabel: string;
  isSubmitting: boolean;
  submitError: string | null;
  onEdit: () => void;
  onPay: () => void;
}

function ChannelingPaymentView({
  session,
  requiresRmoFee,
  paymentMethod,
  onPaymentMethodChange,
  timerLabel,
  isSubmitting,
  submitError,
  onEdit,
  onPay,
}: ChannelingPaymentViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const fees = calculateBookingFees(session.consultationFee, requiresRmoFee);

  return (
    <div className="channeling-payment animate-fade-in-up">
      <div className="channeling-payment__top">
        <dl className="channeling-payment__charges">
          <div className="channeling-payment__charge-row">
            <dt>Doctor Charges</dt>
            <dd>{fees.consultationFee.toFixed(2)} LKR</dd>
          </div>
          {fees.rmoFee > 0 ? (
            <div className="channeling-payment__charge-row">
              <dt>RMO Charges</dt>
              <dd>{fees.rmoFee.toFixed(2)} LKR</dd>
            </div>
          ) : null}
          <div className="channeling-payment__charge-row channeling-payment__charge-row--total">
            <dt>Total Charges</dt>
            <dd>{fees.total.toFixed(2)} LKR</dd>
          </div>
        </dl>

        <div className="channeling-booking-status__timer channeling-payment__timer">
          <span>COMPLETE WITHIN</span>
          <strong>{timerLabel}</strong>
        </div>
      </div>

      <div className="channeling-payment__total-bar">
        <span>TOTAL CHARGES</span>
        <strong>{formatFee(fees.total)}</strong>
      </div>

      <p className="channeling-payment__hint">
        Click Continue to choose your payment option and complete the booking.
      </p>

      {submitError && !modalOpen ? (
        <p className="booking-panel__error" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="channeling-payment__actions">
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          disabled={isSubmitting}
          className="channeling-payment__edit"
        >
          ✎ Edit
        </Button>
        <Button
          type="button"
          variant="accent"
          onClick={() => setModalOpen(true)}
          disabled={isSubmitting}
          className="channeling-booking-form__continue"
        >
          Continue
        </Button>
      </div>

      <ChannelingPaymentModal
        open={modalOpen}
        timerLabel={timerLabel}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onClose={() => {
          if (!isSubmitting) setModalOpen(false);
        }}
        onPay={onPay}
      />
    </div>
  );
}

export default ChannelingPaymentView;
