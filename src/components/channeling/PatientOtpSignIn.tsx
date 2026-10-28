import { useState } from "react";
import type { FormEvent } from "react";
import { isAxiosError } from "axios";
import Button from "../ui/Button";
import { usePatientAuth } from "../../context/PatientAuthContext";
import { isLookupReadyMobile } from "../../utils/patientValidation";
import { USER_MESSAGES } from "../../utils/userMessages";

type OtpStep = "idle" | "code";

interface PatientOtpSignInProps {
  initialMobile?: string;
  compact?: boolean;
  title?: string;
  subtitle?: string;
  /** When true, skip straight to OTP entry (caller already requested OTP). */
  startInCodeStep?: boolean;
  prefilledDevOtp?: string | null;
  onVerified?: () => void;
}

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
    if (!error.response) return USER_MESSAGES.networkError;
  }
  return USER_MESSAGES.otpFailed;
}

function PatientOtpSignIn({
  initialMobile = "",
  compact = false,
  title = "Sign in with mobile OTP",
  subtitle = "Verify once and we will autofill your details on the next booking.",
  startInCodeStep = false,
  prefilledDevOtp = null,
  onVerified,
}: PatientOtpSignInProps) {
  const { requestOtp, verifyOtp } = usePatientAuth();
  const [step, setStep] = useState<OtpStep>(startInCodeStep ? "code" : "idle");
  const [mobile, setMobile] = useState(initialMobile);
  const [code, setCode] = useState(prefilledDevOtp ?? "");
  const [devOtp, setDevOtp] = useState<string | null>(prefilledDevOtp);
  const [masked, setMasked] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(
    Boolean(initialMobile) || startInCodeStep || !compact,
  );

  const sendOtp = async () => {
    setError(null);
    if (!isLookupReadyMobile(mobile)) {
      setError("Enter a valid Sri Lankan mobile number.");
      return;
    }
    setBusy(true);
    try {
      const result = await requestOtp(mobile);
      setMasked(result.mobileNumberMasked);
      setDevOtp(result.devOtp ?? null);
      setStep("code");
      setCode(result.devOtp ?? "");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const confirmOtp = async () => {
    setError(null);
    if (!code.trim()) {
      setError("Enter the OTP code.");
      return;
    }
    setBusy(true);
    try {
      await verifyOtp({ mobileNumber: mobile, code });
      onVerified?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (step === "code") {
      void confirmOtp();
    } else {
      void sendOtp();
    }
  };

  if (compact && !expanded) {
    return (
      <button
        type="button"
        className="patient-otp__launch"
        onClick={() => setExpanded(true)}
      >
        Already a patient? Sign in with OTP
      </button>
    );
  }

  return (
    <div className={`patient-otp${compact ? " patient-otp--compact" : ""}`}>
      <div className="patient-otp__header">
        <div>
          <h3 className="patient-otp__title">{title}</h3>
          <p className="patient-otp__subtitle">{subtitle}</p>
        </div>
        {compact ? (
          <button
            type="button"
            className="patient-otp__close"
            onClick={() => {
              setExpanded(false);
              setError(null);
            }}
          >
            Close
          </button>
        ) : null}
      </div>

      <form className="patient-otp__form" onSubmit={handleSubmit}>
        <label className="patient-otp__label" htmlFor="patient-otp-mobile">
          Mobile number
        </label>
        <input
          id="patient-otp-mobile"
          className="patient-otp__input"
          type="tel"
          value={mobile}
          disabled={busy || step === "code"}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="0771234567"
          autoComplete="tel"
        />

        {step === "code" ? (
          <>
            <label className="patient-otp__label" htmlFor="patient-otp-code">
              OTP code {masked ? `(sent to ${masked})` : ""}
            </label>
            <input
              id="patient-otp-code"
              className="patient-otp__input"
              inputMode="numeric"
              value={code}
              disabled={busy}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit code"
              autoComplete="one-time-code"
            />
            {devOtp ? (
              <p className="patient-otp__dev" role="note">
                Dev OTP: <strong>{devOtp}</strong>
              </p>
            ) : null}
          </>
        ) : null}

        {error ? (
          <p className="patient-otp__error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="patient-otp__actions">
          <Button type="submit" disabled={busy} fullWidth>
            {busy
              ? step === "code"
                ? "Verifying…"
                : "Sending…"
              : step === "code"
                ? "Verify & sign in"
                : "Send OTP"}
          </Button>
          {step === "code" ? (
            <button
              type="button"
              className="patient-otp__link"
              disabled={busy}
              onClick={() => {
                setStep("idle");
                setCode("");
                setDevOtp(null);
              }}
            >
              Change number
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export default PatientOtpSignIn;
