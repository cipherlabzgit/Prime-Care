import { useEffect, useRef, useState } from "react";
import type {
  ExistingPatientProfile,
  PatientFormData,
  PatientFormErrors,
} from "../../types/patient";
import { searchPatients } from "../../services/patientService";
import {
  isLookupReadyMobile,
  isLookupReadyNic,
} from "../../utils/patientValidation";
import { usePatientAuth } from "../../context/PatientAuthContext";
import { useToast } from "../../context/ToastContext";
import ChannelingPatientForm from "./ChannelingPatientForm";
import PatientOtpSignIn from "./PatientOtpSignIn";
import ReturningPatientWelcomeCard from "./ReturningPatientWelcomeCard";
import SignedInPatientCard from "./SignedInPatientCard";

const LOOKUP_DEBOUNCE_MS = 650;

interface BookingPatientSectionProps {
  patient: PatientFormData;
  errors: PatientFormErrors;
  detectedPatient: ExistingPatientProfile | null;
  profileLinked: boolean;
  disabled?: boolean;
  onChange: (patch: Partial<PatientFormData>) => void;
  onDetectedPatientChange: (patient: ExistingPatientProfile | null) => void;
  onPatientLookupSettledChange?: (settled: boolean) => void;
  onUseExistingProfile: () => void;
  onSignedInProfile: (profile: ExistingPatientProfile) => void;
  onClearSignedInProfile: () => void;
}

function BookingPatientSection({
  patient,
  errors,
  detectedPatient,
  profileLinked,
  disabled = false,
  onChange,
  onDetectedPatientChange,
  onPatientLookupSettledChange,
  onUseExistingProfile,
  onSignedInProfile,
  onClearSignedInProfile,
}: BookingPatientSectionProps) {
  const lookupRequestRef = useRef(0);
  const { isSignedIn, session, signOut, requestOtp } = usePatientAuth();
  const { showToast } = useToast();
  const [otpForDetected, setOtpForDetected] = useState(false);
  const [otpBusy, setOtpBusy] = useState(false);
  const [detectedDevOtp, setDetectedDevOtp] = useState<string | null>(null);

  useEffect(() => {
    if (profileLinked || isSignedIn) return;

    const nic = patient.nic.trim();
    const canLookupNic = isLookupReadyNic(nic);
    const canLookupMobile = isLookupReadyMobile(patient.phone);

    if (!canLookupNic && !canLookupMobile) {
      onDetectedPatientChange(null);
      onPatientLookupSettledChange?.(false);
      return;
    }

    onPatientLookupSettledChange?.(false);
    const requestId = ++lookupRequestRef.current;
    const timer = window.setTimeout(async () => {
      try {
        const params = canLookupNic
          ? { nic, mobileNumber: canLookupMobile ? patient.phone : undefined }
          : { mobileNumber: patient.phone };

        const results = await searchPatients(params);
        if (lookupRequestRef.current !== requestId) return;
        onDetectedPatientChange(results[0] ?? null);
      } catch {
        if (lookupRequestRef.current !== requestId) return;
        onDetectedPatientChange(null);
      } finally {
        if (lookupRequestRef.current === requestId) {
          onPatientLookupSettledChange?.(true);
        }
      }
    }, LOOKUP_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [
    patient.nic,
    patient.phone,
    profileLinked,
    isSignedIn,
    onDetectedPatientChange,
    onPatientLookupSettledChange,
  ]);

  useEffect(() => {
    if (!isSignedIn || !session?.patient) return;
    onSignedInProfile(session.patient);
  }, [isSignedIn, session?.patient, onSignedInProfile]);

  const showWelcomeCard =
    Boolean(detectedPatient) && !profileLinked && !isSignedIn;

  const handleVerifyDetected = async () => {
    if (!detectedPatient) return;
    setOtpBusy(true);
    setOtpForDetected(false);
    setDetectedDevOtp(null);
    try {
      const result = await requestOtp(detectedPatient.mobileNumber);
      setDetectedDevOtp(result.devOtp ?? null);
      setOtpForDetected(true);
      showToast("OTP sent to your registered mobile.", "info");
    } catch {
      showToast("Unable to send OTP. Try again.", "error");
    } finally {
      setOtpBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onClearSignedInProfile();
    setOtpForDetected(false);
    showToast("Signed out. Enter details or sign in again.", "info");
  };

  return (
    <div className="booking-patient-section">
      {isSignedIn && session?.patient ? (
        <SignedInPatientCard
          profile={session.patient}
          onSignOut={() => {
            void handleSignOut();
          }}
        />
      ) : null}

      {!isSignedIn && !profileLinked ? (
        <PatientOtpSignIn
          compact
          onVerified={() => {
            showToast("Signed in. Your details are ready.", "success");
          }}
        />
      ) : null}

      {showWelcomeCard && detectedPatient && !otpForDetected ? (
        <ReturningPatientWelcomeCard
          profile={detectedPatient}
          otpBusy={otpBusy}
          onVerifyWithOtp={() => {
            void handleVerifyDetected();
          }}
          onUseOnce={onUseExistingProfile}
        />
      ) : null}

      {showWelcomeCard && detectedPatient && otpForDetected ? (
        <PatientOtpSignIn
          initialMobile={detectedPatient.mobileNumber}
          startInCodeStep
          prefilledDevOtp={detectedDevOtp}
          title="Verify it's you"
          subtitle="Enter the OTP sent to your registered mobile to save this profile for next time."
          onVerified={() => {
            setOtpForDetected(false);
            setDetectedDevOtp(null);
            showToast("Verified. Details saved for next bookings.", "success");
          }}
        />
      ) : null}

      <ChannelingPatientForm
        patient={patient}
        errors={errors}
        profileLinked={profileLinked || isSignedIn}
        onChange={onChange}
        onSubmit={() => {}}
        canSubmit={false}
        disabled={disabled}
        hideSubmit
        hideHeading
      />
    </div>
  );
}

export default BookingPatientSection;
