import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { RmoBooking } from "../../types/rmo";
import { saveCaseTaking } from "../../services/rmoService";
import { rmoBookingDisplayFields } from "../../utils/rmoDisplayUtils";
import { isCaseTakingEditable } from "../../utils/rmoStatusUtils";
import Button from "../ui/Button";

interface RmoCaseTakingPanelProps {
  booking: RmoBooking;
  onUpdated: (booking: RmoBooking) => void;
  onComplete: (booking: RmoBooking, newPatientRegistrationId?: number) => void;
}

function RmoCaseTakingPanel({
  booking,
  onUpdated,
  onComplete,
}: RmoCaseTakingPanelProps) {
  const editable = isCaseTakingEditable(booking.rmoStatus);

  const [fullName, setFullName] = useState(booking.fullName);
  const [mobileNumber, setMobileNumber] = useState(booking.mobileNumber);
  const [nicOrPassport, setNicOrPassport] = useState(booking.nicOrPassport ?? "");
  const [email, setEmail] = useState(booking.email ?? "");
  const [caseTakingNotes, setCaseTakingNotes] = useState(
    booking.caseTakingNotes ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFullName(booking.fullName);
    setMobileNumber(booking.mobileNumber);
    setNicOrPassport(booking.nicOrPassport ?? "");
    setEmail(booking.email ?? "");
    setCaseTakingNotes(booking.caseTakingNotes ?? "");
    setError(null);
  }, [booking]);

  const buildPayload = (complete: boolean) => ({
    fullName: fullName.trim(),
    mobileNumber: mobileNumber.trim(),
    nicOrPassport: nicOrPassport.trim() || undefined,
    email: email.trim() || undefined,
    caseTakingNotes: caseTakingNotes.trim() || undefined,
    complete,
  });

  const handleSave = async (complete: boolean) => {
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!mobileNumber.trim()) {
      setError("Mobile number is required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const response = await saveCaseTaking(booking.bookingId, buildPayload(complete));
      if (complete) {
        onComplete(response.booking, response.newPatientRegistrationId);
      } else {
        onUpdated(response.booking);
      }
    } catch {
      setError("Could not save case taking. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void handleSave(false);
  };

  const displayFields = rmoBookingDisplayFields(booking);

  return (
    <section className="rmo-panel" aria-labelledby="rmo-case-taking-heading">
      <header className="rmo-panel__header">
        <h2 id="rmo-case-taking-heading" className="rmo-panel__title">
          Case Taking
        </h2>
        <p className="rmo-panel__subtitle">
          Verify patient details, record intake notes, then complete case taking
          before the doctor appointment.
        </p>
      </header>

      <dl className="rmo-panel__meta">
        {displayFields.slice(0, 4).map((field) => (
          <div key={field.label}>
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>

      <dl className="rmo-panel__meta rmo-panel__meta--compact">
        {displayFields.slice(4).map((field) => (
          <div key={field.label}>
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>

      {editable ? (
        <form className="rmo-panel__form" onSubmit={handleSubmit}>
          <div className="rmo-panel__grid">
            <label className="rmo-field">
              <span>Full name</span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={saving}
              />
            </label>
            <label className="rmo-field">
              <span>Mobile number</span>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                disabled={saving}
              />
            </label>
            <label className="rmo-field">
              <span>NIC / Passport</span>
              <input
                type="text"
                value={nicOrPassport}
                onChange={(e) => setNicOrPassport(e.target.value)}
                disabled={saving}
              />
            </label>
            <label className="rmo-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={saving}
              />
            </label>
          </div>

          <label className="rmo-field">
            <span>Case taking notes</span>
            <textarea
              rows={4}
              value={caseTakingNotes}
              onChange={(e) => setCaseTakingNotes(e.target.value)}
              placeholder="Vitals, history, allergies, observations…"
              disabled={saving}
            />
          </label>

          {error ? (
            <p className="rmo-panel__error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="rmo-panel__actions">
            <Button
              type="submit"
              variant="secondary"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save progress"}
            </Button>
            <Button
              type="button"
              disabled={saving}
              onClick={() => void handleSave(true)}
            >
              {saving ? "Completing…" : "Complete case taking"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="rmo-panel__done">
          <p>
            Case taking is complete
            {booking.newPatientRegistrationId
              ? ` — patient registration #${booking.newPatientRegistrationId} created.`
              : "."}
          </p>
          {booking.caseTakingNotes ? (
            <p className="rmo-panel__done-notes">{booking.caseTakingNotes}</p>
          ) : null}
        </div>
      )}
    </section>
  );
}

export default RmoCaseTakingPanel;
