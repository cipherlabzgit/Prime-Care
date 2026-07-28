import { useEffect, useRef } from "react";
import type { ExistingPatientProfile, PatientFormData, PatientFormErrors } from "../../types/patient";
import { searchPatients } from "../../services/patientService";
import {
  isLookupReadyMobile,
  isLookupReadyNic,
} from "../../utils/patientValidation";
import ChannelingPatientForm from "./ChannelingPatientForm";
import ReturningPatientWelcomeCard from "./ReturningPatientWelcomeCard";

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
}: BookingPatientSectionProps) {
  const lookupRequestRef = useRef(0);

  useEffect(() => {
    if (profileLinked) return;

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
    onDetectedPatientChange,
    onPatientLookupSettledChange,
  ]);

  const showWelcomeCard = Boolean(detectedPatient) && !profileLinked;

  return (
    <div className="booking-patient-section">
      {showWelcomeCard && detectedPatient ? (
        <ReturningPatientWelcomeCard
          profile={detectedPatient}
          onUseExisting={onUseExistingProfile}
        />
      ) : null}

      <ChannelingPatientForm
        patient={patient}
        errors={errors}
        profileLinked={profileLinked}
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
