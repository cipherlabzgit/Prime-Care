import { useEffect, useId, useRef, useState } from "react";
import type { ChannelingPaymentMethod } from "../../types/channeling";
import { PAYMENT_METHOD_LABELS } from "../../types/channeling";
import Button from "../ui/Button";

const PAYMENT_OPTIONS: ChannelingPaymentMethod[] = ["Card", "Cash"];

interface ChannelingPaymentModalProps {
  open: boolean;
  timerLabel: string;
  paymentMethod: ChannelingPaymentMethod | null;
  onPaymentMethodChange: (method: ChannelingPaymentMethod) => void;
  isSubmitting: boolean;
  submitError: string | null;
  onClose: () => void;
  onPay: () => void;
}

function ChannelingPaymentModal({
  open,
  timerLabel,
  paymentMethod,
  onPaymentMethodChange,
  isSubmitting,
  submitError,
  onClose,
  onPay,
}: ChannelingPaymentModalProps) {
  const titleId = useId();
  const listboxId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setAcceptTerms(false);
      setAcceptPrivacy(false);
      setDropdownOpen(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (dropdownOpen) {
          setDropdownOpen(false);
          return;
        }
        if (!isSubmitting) onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, isSubmitting, onClose, dropdownOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (target && !dropdownRef.current?.contains(target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [dropdownOpen]);

  if (!open) return null;

  const canPay =
    Boolean(paymentMethod) && acceptTerms && acceptPrivacy && !isSubmitting;
  const selectedLabel = paymentMethod
    ? PAYMENT_METHOD_LABELS[paymentMethod]
    : "Please Select Payment Option";

  return (
    <div className="channeling-pay-modal" role="presentation">
      <button
        type="button"
        className="channeling-pay-modal__backdrop"
        aria-label="Close payment dialog"
        disabled={isSubmitting}
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        className="channeling-pay-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="channeling-pay-modal__header">
          <h2 id={titleId} className="channeling-pay-modal__title">
            <span aria-hidden="true">🛡️</span> Payment
          </h2>
          <button
            type="button"
            className="channeling-pay-modal__close"
            aria-label="Close"
            disabled={isSubmitting}
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="channeling-pay-modal__body">
          <div className="channeling-pay-modal__options-row">
            <span className="channeling-pay-modal__options-label">OPTIONS</span>
            <span className="channeling-pay-modal__timer">
              COMPLETE WITHIN <strong>{timerLabel}</strong>
            </span>
          </div>

          <div className="channeling-pay-modal__dropdown" ref={dropdownRef}>
            <button
              type="button"
              className={`channeling-pay-modal__select-trigger${
                dropdownOpen ? " channeling-pay-modal__select-trigger--open" : ""
              }${paymentMethod ? "" : " channeling-pay-modal__select-trigger--placeholder"}`}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              aria-controls={listboxId}
              disabled={isSubmitting}
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <span className="channeling-pay-modal__select-icon" aria-hidden="true">
                💳
              </span>
              <span className="channeling-pay-modal__select-text">{selectedLabel}</span>
              <span
                className={`channeling-pay-modal__select-caret${
                  dropdownOpen ? " channeling-pay-modal__select-caret--open" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {dropdownOpen ? (
              <ul
                id={listboxId}
                className="channeling-pay-modal__menu"
                role="listbox"
                aria-label="Payment options"
              >
                {PAYMENT_OPTIONS.map((option) => {
                  const selected = paymentMethod === option;
                  return (
                    <li key={option} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={`channeling-pay-modal__option${
                          selected ? " channeling-pay-modal__option--selected" : ""
                        }`}
                        onClick={() => {
                          onPaymentMethodChange(option);
                          setDropdownOpen(false);
                        }}
                      >
                        {PAYMENT_METHOD_LABELS[option]}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <p className="channeling-pay-modal__warning">
            Please refrain from clicking BACK button on Payment Page.
          </p>

          <label className="channeling-pay-modal__consent">
            <input
              type="checkbox"
              checked={acceptTerms}
              disabled={isSubmitting}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <span>
              I hereby consent that I have read and accepted the Digital Health{" "}
              <a href="/about" target="_blank" rel="noreferrer">
                Terms and Conditions
              </a>
              .
            </span>
          </label>

          <label className="channeling-pay-modal__consent">
            <input
              type="checkbox"
              checked={acceptPrivacy}
              disabled={isSubmitting}
              onChange={(e) => setAcceptPrivacy(e.target.checked)}
            />
            <span>
              I hereby consent that I have read and accepted the Digital Health{" "}
              <a href="/about" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>
              .
            </span>
          </label>

          <div className="channeling-pay-modal__terms" tabIndex={0}>
            <h3>Doctor Channeling</h3>
            <ul>
              <li>
                All customers agree to provide accurate information when scheduling
                an appointment with PremierCare.
              </li>
              <li>
                Appointment confirmation is subject to successful payment and slot
                availability at the time of checkout.
              </li>
              <li>
                For card payments you will be redirected to a secure payment
                gateway. Do not use the browser back button during payment.
              </li>
              <li>
                Cash payments are completed at the hospital reception before your
                consultation.
              </li>
              <li>
                Please arrive early for registration. Late arrivals may need to be
                rescheduled subject to clinic policy.
              </li>
            </ul>
          </div>

          {submitError ? (
            <p className="booking-panel__error" role="alert">
              {submitError}
            </p>
          ) : null}

          <Button
            type="button"
            fullWidth
            disabled={!canPay}
            onClick={onPay}
            className="channeling-pay-modal__pay"
          >
            {isSubmitting ? "Processing…" : "⚡ Pay"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChannelingPaymentModal;
