import { useMemo, useState, type FormEvent } from "react";
import type { LandingFormField, LandingPageConfig } from "../../types/landingPage";
import { submitLandingEnquiry } from "../../services/landingEnquiryService";
import { useToast } from "../../context/ToastContext";
import Button from "../ui/Button";

const inputClass =
  "landing-form__input w-full rounded-2xl border border-slate-300/90 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-60";

const labelClass = "landing-form__label";

function FieldControl({
  field,
  value,
  disabled,
  onChange,
}: {
  field: LandingFormField;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const id = `landing-${field.id}`;

  if (field.type === "textarea") {
    return (
      <textarea
        id={id}
        className={`${inputClass} min-h-[120px] resize-y`}
        value={value}
        disabled={disabled}
        required={field.required}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        id={id}
        className={inputClass}
        value={value}
        disabled={disabled}
        required={field.required}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select an option</option>
        {(field.options ?? []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      id={id}
      type={field.type}
      className={inputClass}
      value={value}
      disabled={disabled}
      required={field.required}
      placeholder={field.placeholder}
      autoComplete={field.autoComplete}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

interface LandingEnquiryFormProps {
  config: LandingPageConfig;
}

function LandingEnquiryForm({ config }: LandingEnquiryFormProps) {
  const { showToast } = useToast();
  const initialValues = useMemo(() => {
    const values: Record<string, string> = {};
    for (const field of config.formFields) {
      values[field.id] = "";
    }
    return values;
  }, [config.formFields]);

  const [values, setValues] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validate = (): string | null => {
    for (const field of config.formFields) {
      const value = values[field.id]?.trim() ?? "";
      if (field.required && !value) {
        return `Please complete: ${field.label}.`;
      }
      if (
        field.type === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        return "Please enter a valid email address.";
      }
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const fields: Record<string, string> = {};
      for (const field of config.formFields) {
        fields[field.id] = values[field.id]?.trim() ?? "";
      }
      await submitLandingEnquiry({ landingId: config.id, fields });
      setSuccess(true);
      showToast("Thank you — our team will contact you shortly.");
      setValues(initialValues);
    } catch {
      setError("We could not send your enquiry right now. Please call the clinic or try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="landing-form__success" role="status">
        <p className="landing-form__success-title">Enquiry received</p>
        <p className="landing-form__success-text">
          Thank you for reaching out. A member of the Premier Care team will contact you using the
          details you provided.
        </p>
        <Button type="button" variant="outline" onClick={() => setSuccess(false)}>
          Submit another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form className="landing-form" onSubmit={handleSubmit} aria-label={config.formHeader}>
      <div className="landing-form__header">
        <h2 className="landing-form__title">{config.formHeader}</h2>
        <p className="landing-form__intro">{config.formIntro}</p>
      </div>

      <div className="landing-form__fields">
        {config.formFields.map((field) => (
          <div key={field.id} className="landing-form__field">
            <label htmlFor={`landing-${field.id}`} className={labelClass}>
              {field.label}
              {field.required ? <span className="landing-form__required">*</span> : null}
            </label>
            <FieldControl
              field={field}
              value={values[field.id] ?? ""}
              disabled={submitting}
              onChange={(next) => setValues((prev) => ({ ...prev, [field.id]: next }))}
            />
          </div>
        ))}
      </div>

      {config.formPrivacyNote ? (
        <p className="landing-form__privacy">{config.formPrivacyNote}</p>
      ) : null}

      {error ? (
        <p className="landing-form__error" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="primary" fullWidth disabled={submitting}>
        {submitting ? "Sending…" : config.formSubmitLabel}
      </Button>
    </form>
  );
}

export default LandingEnquiryForm;
