import { formatFee } from "../../utils/channelingUtils";
import {
  calculateBookingFees,
  type BookingFeeBreakdown as BookingFees,
} from "../../utils/rmoCaseTaking";

interface BookingFeeBreakdownProps {
  consultationFee: number;
  requiresRmoFee: boolean;
  variant?: "footer" | "confirmation";
}

function BookingFeeBreakdown({
  consultationFee,
  requiresRmoFee,
  variant = "footer",
}: BookingFeeBreakdownProps) {
  const fees: BookingFees = calculateBookingFees(consultationFee, requiresRmoFee);
  const className =
    variant === "confirmation"
      ? "booking-fee-breakdown booking-fee-breakdown--confirmation"
      : "booking-fee-breakdown";

  if (fees.rmoFee === 0) {
    return (
      <dl className={className}>
        <div className="booking-fee-breakdown__row booking-fee-breakdown__row--total">
          <dt>Consultation fee</dt>
          <dd>{formatFee(fees.consultationFee)}</dd>
        </div>
      </dl>
    );
  }

  return (
    <dl className={className}>
      <div className="booking-fee-breakdown__row">
        <dt>Consultation fee</dt>
        <dd>{formatFee(fees.consultationFee)}</dd>
      </div>
      {fees.rmoFee > 0 ? (
        <div className="booking-fee-breakdown__row">
          <dt>RMO fee</dt>
          <dd>{formatFee(fees.rmoFee)}</dd>
        </div>
      ) : null}
      <div className="booking-fee-breakdown__row booking-fee-breakdown__row--total">
        <dt>Total</dt>
        <dd>{formatFee(fees.total)}</dd>
      </div>
    </dl>
  );
}

export default BookingFeeBreakdown;
