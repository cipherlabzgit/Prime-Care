import { useState } from "react";
import type { FormEvent } from "react";
import PortalShell from "../components/layout/PortalShell";
import Button from "../components/ui/Button";
import { usePageTitle } from "../hooks/usePageTitle";
import { useToast } from "../context/ToastContext";
import {
  assignReceptionBookingToRmo,
  checkInReceptionBooking,
  lookupReceptionBookings,
} from "../services/receptionService";
import type { RmoBooking } from "../types/rmo";
import { formatDisplayDate, formatFee, formatTime } from "../utils/channelingUtils";
import {
  canAssignToRmo,
  canCheckIn,
  getRmoStatusLabel,
} from "../utils/rmoStatusUtils";
import "../styles/rmo-desk.css";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function ReceptionDeskPage() {
  usePageTitle("Reception Desk");
  const { showToast } = useToast();

  const [sessionDate, setSessionDate] = useState(todayIsoDate);
  const [bookingReference, setBookingReference] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [nic, setNic] = useState("");

  const [results, setResults] = useState<RmoBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<RmoBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    const ref = bookingReference.trim();
    const mobile = mobileNumber.trim();
    const nicValue = nic.trim();

    if (!ref && !mobile && !nicValue) {
      setError("Enter a booking reference, mobile number, or NIC.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setSelectedBooking(null);

    try {
      const bookings = await lookupReceptionBookings({
        bookingReference: ref || undefined,
        mobileNumber: mobile || undefined,
        nic: nicValue || undefined,
        sessionDate: sessionDate || undefined,
      });
      setResults(bookings);
      if (bookings.length === 1) {
        setSelectedBooking(bookings[0]);
      }
    } catch {
      setError("No matching booking found. Check the details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setBookingReference("");
    setMobileNumber("");
    setNic("");
    setResults([]);
    setSelectedBooking(null);
    setError(null);
  };

  const syncBooking = (booking: RmoBooking) => {
    setSelectedBooking(booking);
    setResults((prev) =>
      prev.map((item) => (item.bookingId === booking.bookingId ? booking : item)),
    );
  };

  const handleCheckIn = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      const response = await checkInReceptionBooking(selectedBooking.bookingId);
      syncBooking(response.booking);
      showToast(response.message);
    } catch {
      showToast("Could not check in patient. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignRmo = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      const response = await assignReceptionBookingToRmo(selectedBooking.bookingId);
      syncBooking(response.booking);
      showToast(response.message);
    } catch {
      showToast("Could not assign to RMO. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <PortalShell
      title="Reception Desk"
      subtitle="Search web bookings, check patients in on arrival, and assign new patients to RMO for case taking."
      badge="Staff Portal"
    >
      <div className="rmo-desk">
        <div className="rmo-desk__layout">
          <div className="rmo-desk__sidebar">
            <section className="rmo-search" aria-labelledby="reception-search-heading">
              <h2 id="reception-search-heading" className="rmo-search__title">
                Find booking
              </h2>
              <p className="rmo-search__hint">
                When the patient arrives, search by reference, mobile, or NIC.
              </p>

              <form className="rmo-search__form" onSubmit={handleSearch}>
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
                    placeholder="CH-2026-000134"
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

                {error ? (
                  <p className="rmo-search__error" role="alert">
                    {error}
                  </p>
                ) : null}

                <div className="rmo-search__actions">
                  <Button type="submit" disabled={loading} fullWidth>
                    {loading ? "Searching…" : "Search"}
                  </Button>
                  <Button type="button" variant="secondary" fullWidth onClick={handleClear}>
                    Clear
                  </Button>
                </div>
              </form>

              {results.length > 0 ? (
                <div className="rmo-search__results">
                  <h3 className="rmo-search__results-title">Search results</h3>
                  <div className="rmo-queue-list">
                    {results.map((booking) => (
                      <button
                        key={booking.bookingId}
                        type="button"
                        className={`rmo-queue-card${
                          selectedBooking?.bookingId === booking.bookingId
                            ? " rmo-queue-card--active"
                            : ""
                        }`}
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <div className="rmo-queue-card__top">
                          <span className="rmo-queue-card__ref">
                            {booking.bookingReference}
                          </span>
                          <span className="rmo-queue-card__status">
                            {getRmoStatusLabel(booking.rmoStatus)}
                          </span>
                        </div>
                        <p className="rmo-queue-card__name">{booking.fullName}</p>
                        <p className="rmo-queue-card__meta">
                          Doctor {formatTime(booking.doctorAppointmentTime)} ·{" "}
                          {booking.centerName}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          </div>

          <div className="rmo-desk__main">
            {selectedBooking ? (
              <section className="rmo-panel" aria-labelledby="reception-booking-heading">
                <header className="rmo-panel__header">
                  <h2 id="reception-booking-heading" className="rmo-panel__title">
                    Booking profile
                  </h2>
                  <p className="rmo-panel__subtitle">
                    Verify details, check the patient in, then assign to RMO when ready.
                  </p>
                </header>

                <dl className="rmo-panel__meta">
                  <div>
                    <dt>Reference</dt>
                    <dd>{selectedBooking.bookingReference}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{getRmoStatusLabel(selectedBooking.rmoStatus)}</dd>
                  </div>
                  <div>
                    <dt>Patient</dt>
                    <dd>{selectedBooking.fullName}</dd>
                  </div>
                  <div>
                    <dt>Mobile</dt>
                    <dd>{selectedBooking.mobileNumber}</dd>
                  </div>
                  <div>
                    <dt>NIC / Passport</dt>
                    <dd>{selectedBooking.nicOrPassport || "—"}</dd>
                  </div>
                  <div>
                    <dt>Date</dt>
                    <dd>{formatDisplayDate(selectedBooking.sessionDate)}</dd>
                  </div>
                  <div>
                    <dt>Arrive by</dt>
                    <dd>{formatTime(selectedBooking.recommendedArrivalTime)}</dd>
                  </div>
                  <div>
                    <dt>Doctor appointment</dt>
                    <dd>{formatTime(selectedBooking.doctorAppointmentTime)}</dd>
                  </div>
                  <div>
                    <dt>Doctor</dt>
                    <dd>{selectedBooking.doctorName}</dd>
                  </div>
                  <div>
                    <dt>Center / Room</dt>
                    <dd>
                      {selectedBooking.centerName} · {selectedBooking.roomCode}
                    </dd>
                  </div>
                  <div>
                    <dt>Fee</dt>
                    <dd>{formatFee(selectedBooking.consultationFee)}</dd>
                  </div>
                </dl>

                {selectedBooking.requiresRmoCaseTaking ? (
                  <p className="rmo-panel__reception-note">
                    New patient — assign to RMO after check-in for ~{" "}
                    {selectedBooking.rmoCaseTakingMinutes} minutes of case taking.
                  </p>
                ) : null}

                <div className="rmo-panel__actions">
                  {canCheckIn(selectedBooking.rmoStatus) ? (
                    <Button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => void handleCheckIn()}
                    >
                      Mark arrived (check-in)
                    </Button>
                  ) : null}
                  {canAssignToRmo(selectedBooking.rmoStatus) ? (
                    <Button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => void handleAssignRmo()}
                    >
                      Assign to RMO
                    </Button>
                  ) : null}
                  {selectedBooking.rmoStatus === "AssignedToRmo" ||
                  selectedBooking.rmoStatus === "RmoInProgress" ? (
                    <p className="rmo-panel__done-inline">
                      Patient sent to RMO queue. Continue in RMO Intake.
                    </p>
                  ) : null}
                  {selectedBooking.rmoStatus === "ReadyForDoctor" ? (
                    <p className="rmo-panel__done-inline">
                      Case taking complete — patient is ready for the doctor.
                    </p>
                  ) : null}
                </div>
              </section>
            ) : (
              <div className="rmo-desk__placeholder">
                <h2>Search for a patient booking</h2>
                <p>
                  Patients should report here first on arrival. Search their web
                  booking, check them in, then assign new patients to RMO.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

export default ReceptionDeskPage;
