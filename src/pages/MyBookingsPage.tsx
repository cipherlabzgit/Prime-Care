import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { isAxiosError } from "axios";
import PortalShell from "../components/layout/PortalShell";
import PatientOtpSignIn from "../components/channeling/PatientOtpSignIn";
import SignedInPatientCard from "../components/channeling/SignedInPatientCard";
import Button from "../components/ui/Button";
import PageState from "../components/ui/PageState";
import { usePageTitle } from "../hooks/usePageTitle";
import { usePatientAuth } from "../context/PatientAuthContext";
import { useToast } from "../context/ToastContext";
import {
  lookupMyBooking,
  resendBookingSms,
} from "../services/myBookingService";
import type {
  MyBookingSearchPurpose,
  PublicBooking,
} from "../types/myBooking";
import { USER_MESSAGES } from "../utils/userMessages";
import "../styles/my-bookings.css";

const PURPOSES: {
  id: MyBookingSearchPurpose;
  title: string;
  description: string;
}[] = [
  {
    id: "ongoing",
    title: "Check Ongoing Number",
    description: "See your appointment number and clinic queue progress.",
  },
  {
    id: "receipt",
    title: "Download Booking Receipt",
    description: "View and print your booking confirmation details.",
  },
  {
    id: "resend-sms",
    title: "Resend Last Booking SMS",
    description: "Send the confirmation SMS again to your registered phone.",
  },
];

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1L6.6 10.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function formatFee(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return "—";
  return `${amount.toLocaleString("en-LK")} LKR`;
}

function formatDate(value: string): string {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-LK", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
    if (!error.response) return USER_MESSAGES.networkError;
  }
  return fallback;
}

function MyBookingsPage() {
  usePageTitle("My Bookings");
  const { showToast } = useToast();
  const { isSignedIn, session, signOut } = usePatientAuth();

  const [purpose, setPurpose] = useState<MyBookingSearchPurpose>("ongoing");
  const [bookingReference, setBookingReference] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [booking, setBooking] = useState<PublicBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [smsSending, setSmsSending] = useState(false);
  const [smsMessage, setSmsMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (session?.patient.mobileNumber && !mobileNumber.trim()) {
      setMobileNumber(session.patient.mobileNumber);
    }
  }, [session, mobileNumber]);

  const runSearch = async () => {
    setError(null);
    setSmsMessage(null);
    setBooking(null);

    const ref = bookingReference.trim();
    const phone = mobileNumber.trim();

    if (!ref) {
      setError("Reference number is required.");
      return;
    }
    if (!phone) {
      setError("Phone number is required.");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      if (purpose === "resend-sms") {
        const result = await resendBookingSms({
          bookingReference: ref,
          mobileNumber: phone,
        });
        setSmsMessage(result.message);
        const lookup = await lookupMyBooking({
          bookingReference: ref,
          mobileNumber: phone,
        });
        setBooking(lookup.booking);
        setAttemptsRemaining(lookup.attemptsRemaining ?? null);
        showToast(result.message);
        return;
      }

      const result = await lookupMyBooking({
        bookingReference: ref,
        mobileNumber: phone,
      });
      setBooking(result.booking);
      setAttemptsRemaining(result.attemptsRemaining ?? null);
    } catch (err) {
      setError(getErrorMessage(err, USER_MESSAGES.bookingLookupFailed));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void runSearch();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PortalShell
      badge="Patient Services"
      title="My Bookings"
      subtitle="Look up your appointment with the booking reference and phone number used when you booked."
    >
      <div className="my-bookings">
        <div className="my-bookings__auth">
          {isSignedIn && session ? (
            <SignedInPatientCard
              profile={session.patient}
              onSignOut={() => {
                void signOut().then(() => {
                  showToast("Signed out.", "info");
                });
              }}
            />
          ) : (
            <PatientOtpSignIn
              title="Sign in for faster rebooking"
              subtitle="Verify your mobile once. Next time you channel a doctor, your details autofill."
              onVerified={() => {
                showToast("Signed in. Your next booking will autofill.", "success");
              }}
            />
          )}
        </div>

        <section className="my-bookings__card" aria-labelledby="search-booking-heading">
          <h2 id="search-booking-heading" className="my-bookings__card-tab">
            Search Booking
          </h2>

          <div className="my-bookings__card-body">
            <fieldset className="my-bookings__purpose">
              <legend className="sr-only">What do you want to do?</legend>
              {PURPOSES.map((item) => {
                const active = purpose === item.id;
                return (
                  <label
                    key={item.id}
                    className={`my-bookings__purpose-option${
                      active ? " my-bookings__purpose-option--active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="booking-purpose"
                      value={item.id}
                      checked={active}
                      onChange={() => {
                        setPurpose(item.id);
                        setError(null);
                        setSmsMessage(null);
                      }}
                    />
                    <span>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </span>
                  </label>
                );
              })}
            </fieldset>

            <form className="my-bookings__form" onSubmit={handleSubmit}>
              <div className="my-bookings__field">
                <label htmlFor="my-booking-reference">Reference Number — Required</label>
                <div className="my-bookings__input-wrap">
                  <PersonIcon />
                  <input
                    id="my-booking-reference"
                    value={bookingReference}
                    onChange={(e) => setBookingReference(e.target.value)}
                    placeholder="e.g. CH-2026-000130"
                    autoComplete="off"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="my-bookings__field">
                <label htmlFor="my-booking-phone">Phone — Required</label>
                <div className="my-bookings__input-wrap">
                  <PhoneIcon />
                  <input
                    id="my-booking-phone"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="e.g. 0771234567"
                    autoComplete="tel"
                    disabled={loading}
                  />
                </div>
              </div>

              {error ? (
                <p className="my-bookings__error" role="alert">
                  {error}
                </p>
              ) : null}

              <Button type="submit" disabled={loading} fullWidth>
                {loading
                  ? purpose === "resend-sms"
                    ? "Sending…"
                    : "Searching…"
                  : purpose === "resend-sms"
                    ? "Resend SMS"
                    : "Search"}
              </Button>

              <ul className="my-bookings__hints">
                <li>
                  *Only 20 attempts are allowed per booking
                  {attemptsRemaining != null
                    ? ` (${attemptsRemaining} remaining)`
                    : ""}
                </li>
                <li>
                  *Please use the local phone number entered under patient&apos;s
                  details. This feature is not available for foreign numbers.
                </li>
              </ul>
            </form>
          </div>
        </section>

        {loading ? (
          <div className="my-bookings__result" aria-busy="true">
            <PageState
              variant="empty"
              icon="search"
              title="Looking up your booking"
              message="Please wait while we find your appointment details."
            />
          </div>
        ) : null}

        {!loading && searched && !booking && error ? (
          <div className="my-bookings__result">
            <PageState
              variant="empty"
              icon="search"
              title="Booking not found"
              message={error}
              onRetry={() => void runSearch()}
              retryLabel="Try Again"
              action={{ label: "Book an appointment", href: "/channeling" }}
            />
          </div>
        ) : null}

        {!loading && booking ? (
          <article className="my-bookings__result" aria-live="polite">
            <div className="my-bookings__print-only">
              <h2>PremierCare Booking Receipt</h2>
            </div>

            <div className="my-bookings__result-header">
              <div>
                <h2>{booking.fullName}</h2>
                <p>
                  {booking.bookingReference} · {booking.mobileNumberMasked}
                </p>
              </div>
              <span className="my-bookings__badge">{booking.statusLabel}</span>
            </div>

            {smsMessage ? (
              <p className="my-bookings__sms-success" role="status">
                {smsMessage}
              </p>
            ) : null}

            {(purpose === "ongoing" || purpose === "resend-sms") && (
              <>
                <dl className="my-bookings__ongoing">
                  <div>
                    <dt>Your number</dt>
                    <dd>{booking.ongoingNumber}</dd>
                  </div>
                  <div>
                    <dt>Now serving</dt>
                    <dd>
                      {booking.currentServingNumber != null
                        ? booking.currentServingNumber
                        : "—"}
                    </dd>
                  </div>
                </dl>
                {booking.queueMessage ? (
                  <p className="my-bookings__queue-note">{booking.queueMessage}</p>
                ) : null}
              </>
            )}

            <dl className="my-bookings__details">
              <Detail label="Doctor" value={booking.doctorName} />
              <Detail label="Specialization" value={booking.specialization} />
              <Detail label="Date" value={formatDate(booking.sessionDate)} />
              <Detail label="Appointment time" value={booking.doctorAppointmentTime} />
              <Detail
                label="Arrive by"
                value={booking.recommendedArrivalTime || "—"}
              />
              <Detail label="Center" value={booking.centerName} />
              <Detail label="Room" value={booking.roomCode || "—"} />
              <Detail label="Consultation fee" value={formatFee(booking.consultationFee)} />
              <Detail
                label="Patient type"
                value={booking.patientType === "NEW" ? "New patient" : "Existing patient"}
              />
              <Detail
                label="RMO case taking"
                value={booking.requiresRmoCaseTaking ? "Required" : "Not required"}
              />
            </dl>

            <div className="my-bookings__actions">
              {(purpose === "receipt" || purpose === "ongoing") && (
                <Button type="button" variant="secondary" onClick={handlePrint}>
                  Print / Save Receipt
                </Button>
              )}
              {purpose !== "resend-sms" ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={smsSending}
                  onClick={() => {
                    setSmsSending(true);
                    void resendBookingSms({
                      bookingReference: booking.bookingReference,
                      mobileNumber: mobileNumber.trim(),
                    })
                      .then((result) => {
                        setSmsMessage(result.message);
                        showToast(result.message);
                      })
                      .catch((err) => {
                        showToast(
                          getErrorMessage(err, "Unable to resend SMS right now."),
                        );
                      })
                      .finally(() => setSmsSending(false));
                  }}
                >
                  {smsSending ? "Sending…" : "Resend SMS"}
                </Button>
              ) : null}
            </div>
          </article>
        ) : null}
      </div>
    </PortalShell>
  );
}

export default MyBookingsPage;
