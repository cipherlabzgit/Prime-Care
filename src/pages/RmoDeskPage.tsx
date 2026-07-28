import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import PortalShell from "../components/layout/PortalShell";
import RmoCaseTakingPanel from "../components/rmo/RmoCaseTakingPanel";
import Button from "../components/ui/Button";
import PageState from "../components/ui/PageState";
import { usePageTitle } from "../hooks/usePageTitle";
import { useToast } from "../context/ToastContext";
import {
  fetchTodayRmoBookings,
  lookupRmoBookings,
} from "../services/rmoService";
import type { RmoBooking } from "../types/rmo";
import { formatTime } from "../utils/channelingUtils";
import { getRmoStatusLabel, isRmoQueueStatus } from "../utils/rmoStatusUtils";
import "../styles/rmo-desk.css";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function RmoDeskPage() {
  usePageTitle("RMO Intake");
  const { showToast } = useToast();

  const [sessionDate, setSessionDate] = useState(todayIsoDate);
  const [bookingReference, setBookingReference] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [nic, setNic] = useState("");

  const [queue, setQueue] = useState<RmoBooking[]>([]);
  const [lookupResults, setLookupResults] = useState<RmoBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<RmoBooking | null>(null);

  const [queueLoading, setQueueLoading] = useState(true);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [queueError, setQueueError] = useState<string | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const loadQueue = useCallback(async () => {
    setQueueLoading(true);
    setQueueError(null);
    try {
      const bookings = await fetchTodayRmoBookings({ sessionDate });
      setQueue(bookings);
    } catch {
      setQueue([]);
      setQueueError("Could not load today's RMO queue.");
    } finally {
      setQueueLoading(false);
    }
  }, [sessionDate]);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue]);

  const handleLookup = async (event: FormEvent) => {
    event.preventDefault();
    const ref = bookingReference.trim();
    const mobile = mobileNumber.trim();
    const nicValue = nic.trim();

    if (!ref && !mobile && !nicValue) {
      setLookupError("Enter a booking reference, mobile number, or NIC.");
      return;
    }

    setLookupLoading(true);
    setLookupError(null);
    setLookupResults([]);

    try {
      const results = await lookupRmoBookings({
        bookingReference: ref || undefined,
        mobileNumber: mobile || undefined,
        nic: nicValue || undefined,
        sessionDate: sessionDate || undefined,
      });
      setLookupResults(results);
      if (results.length === 1) {
        setSelectedBooking(results[0]);
      }
    } catch {
      setLookupError("No matching appointment found. Check the details and try again.");
      setSelectedBooking(null);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleClearLookup = () => {
    setBookingReference("");
    setMobileNumber("");
    setNic("");
    setLookupResults([]);
    setLookupError(null);
    setSelectedBooking(null);
  };

  const handleBookingUpdated = (booking: RmoBooking) => {
    setSelectedBooking(booking);
    setQueue((prev) =>
      prev.map((item) => (item.bookingId === booking.bookingId ? booking : item)),
    );
    setLookupResults((prev) =>
      prev.map((item) => (item.bookingId === booking.bookingId ? booking : item)),
    );
    showToast("Case taking progress saved.");
  };

  const handleCaseTakingComplete = (
    booking: RmoBooking,
    newPatientRegistrationId?: number,
  ) => {
    setSelectedBooking(booking);
    setQueue((prev) => prev.filter((item) => item.bookingId !== booking.bookingId));
    setLookupResults((prev) =>
      prev.map((item) => (item.bookingId === booking.bookingId ? booking : item)),
    );
    const regMsg = newPatientRegistrationId
      ? ` Registration #${newPatientRegistrationId} created.`
      : "";
    showToast(`Case taking complete.${regMsg}`);
  };

  const renderBookingButton = (booking: RmoBooking) => {
    const active = selectedBooking?.bookingId === booking.bookingId;
    return (
      <button
        key={booking.bookingId}
        type="button"
        className={`rmo-queue-card${active ? " rmo-queue-card--active" : ""}`}
        onClick={() => setSelectedBooking(booking)}
      >
        <div className="rmo-queue-card__top">
          <span className="rmo-queue-card__ref">{booking.bookingReference}</span>
          <span className="rmo-queue-card__status">
            {getRmoStatusLabel(booking.rmoStatus)}
          </span>
        </div>
        <p className="rmo-queue-card__name">{booking.fullName}</p>
        <p className="rmo-queue-card__meta">
          Arrive {formatTime(booking.recommendedArrivalTime)} · Doctor{" "}
          {formatTime(booking.doctorAppointmentTime)}
        </p>
        <p className="rmo-queue-card__doctor">{booking.doctorName}</p>
      </button>
    );
  };

  return (
    <PortalShell
      title="RMO Intake"
      subtitle="Complete case taking for new patients assigned from Reception. Patients must be assigned here before intake begins."
      badge="Staff Portal"
    >
      <div className="rmo-desk">
        <div className="rmo-desk__layout">
          <div className="rmo-desk__sidebar">
            <section className="rmo-search" aria-labelledby="rmo-search-heading">
              <h2 id="rmo-search-heading" className="rmo-search__title">
                Find appointment
              </h2>
              <p className="rmo-search__hint">
                Search by booking reference, mobile number, or NIC.
              </p>

              <form className="rmo-search__form" onSubmit={handleLookup}>
                <label className="rmo-field">
                  <span>Session date</span>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                  />
                </label>
                <label className="rmo-field">
                  <span>Booking reference</span>
                  <input
                    type="text"
                    value={bookingReference}
                    onChange={(e) => setBookingReference(e.target.value)}
                    placeholder="CH-2026-000133"
                  />
                </label>
                <label className="rmo-field">
                  <span>Mobile number</span>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="0771234567"
                  />
                </label>
                <label className="rmo-field">
                  <span>NIC / Passport</span>
                  <input
                    type="text"
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                    placeholder="200012345678"
                  />
                </label>

                {lookupError ? (
                  <p className="rmo-search__error" role="alert">
                    {lookupError}
                  </p>
                ) : null}

                <div className="rmo-search__actions">
                  <Button type="submit" disabled={lookupLoading} fullWidth>
                    {lookupLoading ? "Searching…" : "Search"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    onClick={handleClearLookup}
                  >
                    Clear
                  </Button>
                </div>
              </form>

              {lookupResults.length > 0 ? (
                <div className="rmo-search__results">
                  <h3 className="rmo-search__results-title">Search results</h3>
                  <div className="rmo-queue-list">
                    {lookupResults.map(renderBookingButton)}
                  </div>
                </div>
              ) : null}
            </section>

            <section className="rmo-queue" aria-labelledby="rmo-queue-heading">
              <div className="rmo-queue__header">
                <h2 id="rmo-queue-heading" className="rmo-queue__title">
                  Today&apos;s RMO queue
                </h2>
                <button
                  type="button"
                  className="rmo-queue__refresh"
                  onClick={() => void loadQueue()}
                  disabled={queueLoading}
                >
                  Refresh
                </button>
              </div>

              {queueLoading ? (
                <PageState variant="loading" title="Loading queue" message="Loading queue…" />
              ) : queueError ? (
                <PageState variant="error" title="Queue unavailable" message={queueError} />
              ) : queue.length === 0 ? (
                <PageState
                  variant="empty"
                  title="Queue empty"
                  message="No patients assigned from Reception for this date."
                />
              ) : (
                <div className="rmo-queue-list">
                  {queue.filter((b) => isRmoQueueStatus(b.rmoStatus)).map(renderBookingButton)}
                </div>
              )}
            </section>
          </div>

          <div className="rmo-desk__main">
            {selectedBooking ? (
              <RmoCaseTakingPanel
                booking={selectedBooking}
                onUpdated={handleBookingUpdated}
                onComplete={handleCaseTakingComplete}
              />
            ) : (
              <div className="rmo-desk__placeholder">
                <h2>Select or search for a booking</h2>
                <p>
                  Choose a patient from the queue or search by reference, mobile,
                  or NIC to start case taking.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

export default RmoDeskPage;
