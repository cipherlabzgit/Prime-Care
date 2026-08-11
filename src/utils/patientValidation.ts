import type { PatientFormData, PatientFormErrors } from "../types/patient";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sri Lankan mobile: 07XXXXXXXX or +947XXXXXXXX */
const SL_MOBILE_PATTERN = /^(?:0?7[0-9]{8}|(?:\+94|94)7[0-9]{8})$/;

const NIC_MIN_LENGTH = 5;

/** Common typo: +047… instead of +947… (missing country digit 9). */
export function fixSriLankanMobileTypo(value: string): string {
  const normalized = value.replace(/[\s-]/g, "");
  if (/^\+?047[0-9]{8}$/.test(normalized)) {
    return normalized.replace(/^\+?047/, "+947");
  }
  return normalized;
}

function normalizeMobile(value: string): string {
  return fixSriLankanMobileTypo(value);
}

/** Normalize Sri Lankan mobile to `07XXXXXXXX` for ERP API payloads. */
export function formatMobileForApi(value: string): string {
  const digits = normalizeMobile(value).replace(/\D/g, "");
  if (digits.startsWith("94") && digits.length >= 11) return `0${digits.slice(2)}`;
  if (digits.startsWith("7") && digits.length === 9) return `0${digits}`;
  if (digits.startsWith("0")) return digits;
  return digits;
}

/** Digits in `94XXXXXXXXX` form for public patient lookup (matches ERP stored numbers). */
export function formatPhoneForLookup(value: string): string {
  const digits = normalizeMobile(value).replace(/\D/g, "");
  if (digits.startsWith("94") && digits.length >= 11) return digits;
  if (digits.startsWith("0") && digits.length >= 10) return `94${digits.slice(1)}`;
  if (digits.startsWith("7") && digits.length === 9) return `94${digits}`;
  return digits;
}

export function isLookupReadyNic(nic: string): boolean {
  return nic.trim().length >= NIC_MIN_LENGTH;
}

export function isLookupReadyMobile(phone: string): boolean {
  return SL_MOBILE_PATTERN.test(normalizeMobile(phone));
}

export function validatePatientForm(
  patient: PatientFormData,
  options?: {
    profileLinked?: boolean;
    pendingProfileAcceptance?: boolean;
  },
): PatientFormErrors {
  if (options?.pendingProfileAcceptance) {
    return {
      firstName:
        "Use your existing profile to continue, or update NIC/mobile if this is not you.",
    };
  }

  if (options?.profileLinked || patient.existingPatientRegistrationId) {
    const errors: PatientFormErrors = {};
    if (patient.email.trim() && !EMAIL_PATTERN.test(patient.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    return errors;
  }

  const errors: PatientFormErrors = {};

  if (!patient.firstName.trim()) {
    errors.firstName = "First name is required.";
  } else if (patient.firstName.trim().length < 2) {
    errors.firstName = "Enter a valid first name.";
  }

  if (!patient.lastName.trim()) {
    errors.lastName = "Last name is required.";
  } else if (patient.lastName.trim().length < 2) {
    errors.lastName = "Enter a valid last name.";
  }

  if (!patient.nic.trim()) {
    errors.nic = "NIC or passport is required.";
  } else if (patient.nic.trim().length < NIC_MIN_LENGTH) {
    errors.nic = "Enter a valid NIC or passport number.";
  }

  const phone = normalizeMobile(patient.phone);
  if (!phone) {
    errors.phone = "Mobile number is required.";
  } else if (!SL_MOBILE_PATTERN.test(phone)) {
    errors.phone = "Enter a valid Sri Lankan mobile (e.g. 0771234567).";
  }

  if (patient.email.trim() && !EMAIL_PATTERN.test(patient.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

export function isPatientFormValid(errors: PatientFormErrors): boolean {
  return Object.keys(errors).length === 0;
}

/** Human-readable reason the confirm button stays disabled. */
export function getBookingBlockMessage(options: {
  hasSelectedSlot: boolean;
  hasPaymentMethod?: boolean;
  errors: PatientFormErrors;
  pendingProfileAcceptance?: boolean;
}): string | null {
  if (!options.hasSelectedSlot) {
    return "Select a time slot to continue.";
  }
  if (options.pendingProfileAcceptance) {
    return 'We found your profile — tap "Use existing profile" above to continue.';
  }
  const messages = Object.values(options.errors).filter(
    (message): message is string => Boolean(message),
  );
  if (messages[0]) {
    return messages[0];
  }
  if (options.hasPaymentMethod === false) {
    return "Select a payment method to continue.";
  }
  return null;
}

export { normalizeMobile, SL_MOBILE_PATTERN };
