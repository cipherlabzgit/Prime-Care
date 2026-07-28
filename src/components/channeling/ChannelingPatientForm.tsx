import { useState } from "react";
import type { PatientFormData, PatientFormErrors } from "../../types/patient";
import Button from "../ui/Button";

interface ChannelingPatientFormProps {
  patient: PatientFormData;
  errors: PatientFormErrors;
  profileLinked?: boolean;
  onChange: (patch: Partial<PatientFormData>) => void;
  onSubmit: () => void;
  canSubmit: boolean;
  disabled?: boolean;
  hideSubmit?: boolean;
  hideHeading?: boolean;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="patient-form__error">{message}</span>;
}

function ChannelingPatientForm({
  patient,
  errors,
  profileLinked = false,
  onChange,
  onSubmit,
  canSubmit,
  disabled = false,
  hideSubmit = false,
  hideHeading = false,
}: ChannelingPatientFormProps) {
  const [showNotes, setShowNotes] = useState(Boolean(patient.notes.trim()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const fieldDisabled = disabled || profileLinked;
  const inputClass = profileLinked ? "patient-form__input patient-form__input--locked" : "patient-form__input";

  return (
    <form className="patient-form" onSubmit={handleSubmit} noValidate>
      {!hideHeading ? (
        <div className="patient-form__head">
          <h3 id="patient-form-heading" className="patient-form__title">
            Patient Details
          </h3>
          {profileLinked ? (
            <span className="patient-linked-badge" role="status">
              Profile linked
            </span>
          ) : null}
        </div>
      ) : profileLinked ? (
        <span className="patient-linked-badge patient-form__linked-only" role="status">
          Profile linked
        </span>
      ) : null}

      <div className="patient-form__field">
        <label htmlFor="pt-name">
          Full name <span className="patient-form__required">*</span>
        </label>
        <input
          id="pt-name"
          className={`${inputClass}${errors.fullName ? " patient-form__input--invalid" : ""}`}
          value={patient.fullName}
          disabled={fieldDisabled}
          readOnly={profileLinked}
          placeholder="As on your NIC or passport"
          onChange={(e) => onChange({ fullName: e.target.value })}
        />
        <FieldError message={errors.fullName} />
      </div>

      <div className="patient-form__row">
        <div className="patient-form__field">
          <label htmlFor="pt-nic">
            NIC / Passport <span className="patient-form__required">*</span>
          </label>
          <input
            id="pt-nic"
            className={`${inputClass}${errors.nic ? " patient-form__input--invalid" : ""}`}
            value={patient.nic}
            disabled={fieldDisabled}
            readOnly={profileLinked}
            placeholder="200012345678"
            onChange={(e) => onChange({ nic: e.target.value })}
          />
          <FieldError message={errors.nic} />
        </div>

        <div className="patient-form__field">
          <label htmlFor="pt-phone">
            Mobile <span className="patient-form__required">*</span>
          </label>
          <input
            id="pt-phone"
            type="tel"
            placeholder="0771234567"
            className={`${inputClass}${errors.phone ? " patient-form__input--invalid" : ""}`}
            value={patient.phone}
            disabled={fieldDisabled}
            readOnly={profileLinked}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
          <FieldError message={errors.phone} />
        </div>
      </div>

      <div className="patient-form__field">
        <label htmlFor="pt-email">Email (optional)</label>
        <input
          id="pt-email"
          type="email"
          placeholder="you@email.com"
          className={`patient-form__input${errors.email ? " patient-form__input--invalid" : ""}`}
          value={patient.email}
          disabled={disabled}
          onChange={(e) => onChange({ email: e.target.value })}
        />
        <FieldError message={errors.email} />
      </div>

      {!showNotes ? (
        <button
          type="button"
          className="patient-form__notes-toggle"
          onClick={() => setShowNotes(true)}
        >
          + Add notes for the doctor
        </button>
      ) : (
        <div className="patient-form__field">
          <label htmlFor="pt-notes">Notes (optional)</label>
          <textarea
            id="pt-notes"
            rows={2}
            className="patient-form__input patient-form__textarea"
            value={patient.notes}
            disabled={disabled}
            placeholder="Symptoms, allergies, or special requests"
            onChange={(e) => onChange({ notes: e.target.value })}
          />
        </div>
      )}

      {!hideSubmit && (
        <Button type="submit" fullWidth disabled={!canSubmit || disabled}>
          Confirm Booking
        </Button>
      )}
    </form>
  );
}

export default ChannelingPatientForm;
