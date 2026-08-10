import type { FormEvent } from "react";
import type { PatientFormData, PatientFormErrors } from "../../types/patient";
import Button from "../ui/Button";
import { useState } from "react";

type IdType = "nic" | "passport";

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

const TITLE_OPTIONS = ["Mr.", "Mrs.", "Ms.", "Miss", "Dr.", "Prof.", "Rev."] as const;

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
  const [idType, setIdType] = useState<IdType>("nic");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const fieldDisabled = disabled || profileLinked;
  const nameError = errors.firstName || errors.lastName;

  return (
    <form className="patient-form patient-form--doc" onSubmit={handleSubmit} noValidate>
      {!hideHeading ? (
        <div className="patient-form__head">
          <h3 id="patient-form-heading" className="patient-form__title">
            Patient details
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

      <div className="patient-form__line">
        <span className="patient-form__line-icon" aria-hidden="true">
          🌐
        </span>
        <label className="patient-form__line-label" htmlFor="pt-country">
          Country
        </label>
        <select
          id="pt-country"
          className="patient-form__line-control"
          defaultValue="Sri Lanka"
          disabled={disabled}
        >
          <option>Sri Lanka</option>
        </select>
      </div>

      <div className="patient-form__line patient-form__line--split">
        <span className="patient-form__line-icon" aria-hidden="true">
          👤
        </span>
        <label className="patient-form__line-label" htmlFor="pt-first-name">
          Name
        </label>
        <div className="patient-form__line-split patient-form__line-split--name">
          <select
            id="pt-title"
            className="patient-form__line-control patient-form__line-control--title"
            value={patient.title || "Mr."}
            disabled={fieldDisabled}
            onChange={(e) => onChange({ title: e.target.value })}
            aria-label="Title"
          >
            {TITLE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            id="pt-first-name"
            className={`patient-form__line-control${
              errors.firstName ? " patient-form__line-control--invalid" : ""
            }`}
            value={patient.firstName}
            disabled={fieldDisabled}
            readOnly={profileLinked}
            placeholder="First name"
            autoComplete="given-name"
            onChange={(e) => onChange({ firstName: e.target.value })}
          />
          <input
            id="pt-last-name"
            className={`patient-form__line-control${
              errors.lastName ? " patient-form__line-control--invalid" : ""
            }`}
            value={patient.lastName}
            disabled={fieldDisabled}
            readOnly={profileLinked}
            placeholder="Second name"
            autoComplete="family-name"
            onChange={(e) => onChange({ lastName: e.target.value })}
          />
        </div>
      </div>
      <FieldError message={nameError} />

      <div className="patient-form__line patient-form__line--split">
        <span className="patient-form__line-icon" aria-hidden="true">
          📞
        </span>
        <label className="patient-form__line-label" htmlFor="pt-phone">
          Phone
        </label>
        <div className="patient-form__line-split">
          <span className="patient-form__line-prefix" aria-hidden="true">
            +94
          </span>
          <input
            id="pt-phone"
            type="tel"
            className={`patient-form__line-control${
              errors.phone ? " patient-form__line-control--invalid" : ""
            }`}
            value={patient.phone}
            disabled={fieldDisabled}
            readOnly={profileLinked}
            placeholder="Phone - Required"
            onChange={(e) => onChange({ phone: e.target.value })}
          />
        </div>
      </div>
      <FieldError message={errors.phone} />

      <div className="patient-form__id-type" role="radiogroup" aria-label="Identification type">
        <label className="patient-form__radio">
          <input
            type="radio"
            name="id-type"
            checked={idType === "nic"}
            disabled={fieldDisabled}
            onChange={() => setIdType("nic")}
          />
          <span>NIC</span>
        </label>
        <label className="patient-form__radio">
          <input
            type="radio"
            name="id-type"
            checked={idType === "passport"}
            disabled={fieldDisabled}
            onChange={() => setIdType("passport")}
          />
          <span>PASSPORT</span>
        </label>
      </div>

      <div className="patient-form__line">
        <span className="patient-form__line-icon" aria-hidden="true">
          🪪
        </span>
        <label className="patient-form__line-label" htmlFor="pt-nic">
          {idType === "nic" ? "NIC" : "Passport"}
        </label>
        <input
          id="pt-nic"
          className={`patient-form__line-control${
            errors.nic ? " patient-form__line-control--invalid" : ""
          }`}
          value={patient.nic}
          disabled={fieldDisabled}
          readOnly={profileLinked}
          placeholder={
            idType === "nic" ? "NIC - Required" : "Passport - Required"
          }
          onChange={(e) => onChange({ nic: e.target.value })}
        />
      </div>
      <FieldError message={errors.nic} />

      <div className="patient-form__line">
        <span className="patient-form__line-icon" aria-hidden="true">
          ✉️
        </span>
        <label className="patient-form__line-label" htmlFor="pt-email">
          E-Mail
        </label>
        <input
          id="pt-email"
          type="email"
          className={`patient-form__line-control${
            errors.email ? " patient-form__line-control--invalid" : ""
          }`}
          value={patient.email}
          disabled={disabled}
          placeholder="E-Mail - Optional - if available"
          onChange={(e) => onChange({ email: e.target.value })}
        />
      </div>
      <FieldError message={errors.email} />
      <p className="patient-form__hint">
        *Please enter email address if you require to send PDF receipt to your
        email account.
      </p>

      <div className="patient-form__line">
        <span className="patient-form__line-icon" aria-hidden="true">
          📝
        </span>
        <label className="patient-form__line-label" htmlFor="pt-notes">
          Address
        </label>
        <input
          id="pt-notes"
          className="patient-form__line-control"
          value={patient.notes}
          disabled={disabled}
          placeholder="Note / Address - Optional"
          onChange={(e) => onChange({ notes: e.target.value })}
        />
      </div>

      {!hideSubmit && (
        <Button type="submit" fullWidth disabled={!canSubmit || disabled}>
          Continue
        </Button>
      )}
    </form>
  );
}

export default ChannelingPatientForm;
