import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { USER_MESSAGES } from "../utils/userMessages";
import {
  formatDoctorDisplayName,
  getSessionDoctorName,
} from "../utils/doctorDisplayUtils";
import "../styles/about.css";
import ChannelingBookingPanel from "../components/channeling/ChannelingBookingPanel";
import ChannelingBookingPlaceholder from "../components/channeling/ChannelingBookingPlaceholder";
import ChannelingFilters from "../components/channeling/ChannelingFilters";
import ChannelingPageLayout from "../components/channeling/ChannelingPageLayout";
import ChannelingSessionCard from "../components/channeling/ChannelingSessionCard";
import ChannelingSectionHeader from "../components/channeling/ChannelingSectionHeader";
import Button from "../components/ui/Button";
import PageState from "../components/ui/PageState";
import {
  FilterPanelSkeleton,
  SessionCardSkeleton,
} from "../components/ui/Skeleton";
import { useDiscoverSessions } from "../hooks/useDiscoverSessions";
import { useIncrementalReveal } from "../hooks/useIncrementalReveal";
import type { ChannelingPaymentMethod, SessionTimeSlot } from "../types/channeling";
import { existingPatientToFormData } from "../services/patientService";
import type {
  ExistingPatientProfile,
  PatientFormData,
} from "../types/patient";
import {
  checkoutChannelingBooking,
  fetchSessionSlots,
  getCheckoutErrorMessage,
  getPaymentRedirectUrl,
  type ChannelingSessionSlot,
  type ChannelingSession,
} from "../services/channelingService";
import {
  filterSessions,
  getDatesForFilters,
  type ChannelingFilters as Filters,
  uniqueDoctors,
  uniqueCenters,
  uniqueSpecializations,
  formatTime,
} from "../utils/channelingUtils";
import {
  isPatientFormValid,
  validatePatientForm,
  isLookupReadyNic,
  isLookupReadyMobile,
  formatMobileForApi,
} from "../utils/patientValidation";
import {
  isNewPatientBooking,
  resolveRmoCaseTakingInfo,
  shouldShowNewPatientRmoNotice,
  type RmoCaseTakingInfo,
} from "../utils/rmoCaseTaking";

const emptyFilters: Filters = {
  centerName: "",
  specialization: "",
  date: "",
  doctorId: "",
};

const emptyPatient: PatientFormData = {
  fullName: "",
  nic: "",
  phone: "",
  email: "",
  notes: "",
};

const gridClass =
  "grid items-start gap-6 lg:grid-cols-[272px_minmax(0,1fr)_380px] lg:gap-7";

function toDisplayTime(slot: ChannelingSessionSlot): string {
  if (slot.slotTime) return slot.slotTime;
  if (slot.time) return slot.time;
  if (slot.startTime) return slot.startTime;
  return "";
}

function mapApiSlotToUi(slot: ChannelingSessionSlot): SessionTimeSlot {
  const slotId = slot.slotId ?? slot.id;
  if (slotId == null) {
    throw new Error("Slot id missing in API response");
  }
  const rawTime = toDisplayTime(slot);
  const normalized = rawTime.length >= 5 ? `${rawTime.slice(0, 5)}:00` : rawTime;
  const available =
    typeof slot.isAvailable === "boolean"
      ? slot.isAvailable
      : typeof slot.available === "boolean"
        ? slot.available
        : slot.slotStatus
          ? slot.slotStatus.toLowerCase() === "available"
          : slot.status
            ? slot.status.toLowerCase() === "available"
          : true;
  return {
    id: slotId,
    channelSlotId: slotId,
    time: normalized,
    label: normalized ? formatTime(normalized) : `Slot ${slotId}`,
    available,
  };
}

function ChannelingPage() {
  usePageTitle("Book Appointment");
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const { sessions: allSessions, loading, error, reload } = useDiscoverSessions();

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [hasSearched, setHasSearched] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(emptyFilters);

  const [bookingSession, setBookingSession] = useState<ChannelingSession | null>(
    null,
  );
  const [selectedSlot, setSelectedSlot] = useState<SessionTimeSlot | null>(null);
  const [patient, setPatient] = useState<PatientFormData>(emptyPatient);
  const [detectedPatient, setDetectedPatient] =
    useState<ExistingPatientProfile | null>(null);
  const [profileLinked, setProfileLinked] = useState(false);
  const [patientLookupSettled, setPatientLookupSettled] = useState(false);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<ChannelingPaymentMethod | null>(
    null,
  );
  const [confirmedRmoInfo, setConfirmedRmoInfo] = useState<RmoCaseTakingInfo | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSlots, setBookingSlots] = useState<SessionTimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [scrolledToSessions, setScrolledToSessions] = useState(false);
  const sessionsSectionRef = useRef<HTMLElement>(null);
  const bookingSectionRef = useRef<HTMLDivElement>(null);
  const bookingPanelRef = useRef<HTMLDivElement>(null);
  const appliedDeepLinkRef = useRef<string | null>(null);
  const hasScrolledToBookingSectionRef = useRef(false);

  const doctorIdParam = searchParams.get("doctorId");

  useEffect(() => {
    if (!doctorIdParam || loading) return;
    if (appliedDeepLinkRef.current === doctorIdParam) return;

    const next: Filters = {
      centerName: "",
      specialization: "",
      doctorId: doctorIdParam,
      date: "",
    };
    setFilters(next);
    setAppliedFilters(next);
    setHasSearched(true);
    setScrolledToSessions(false);
    appliedDeepLinkRef.current = doctorIdParam;
  }, [doctorIdParam, loading]);

  useEffect(() => {
    appliedDeepLinkRef.current = null;
    setScrolledToSessions(false);
  }, [doctorIdParam]);

  useEffect(() => {
    if (!hasSearched || !doctorIdParam || scrolledToSessions || loading) return;

    const timer = window.setTimeout(() => {
      sessionsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setScrolledToSessions(true);
    }, 200);

    return () => window.clearTimeout(timer);
  }, [hasSearched, doctorIdParam, scrolledToSessions, loading]);

  useEffect(() => {
    if (loading || hasScrolledToBookingSectionRef.current) return;

    const hash = window.location.hash.replace("#", "");

    if (hash === "doctor-sessions") {
      hasScrolledToBookingSectionRef.current = true;
      const timer = window.setTimeout(() => {
        sessionsSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
      return () => window.clearTimeout(timer);
    }

    if (hash === "channeling-booking") {
      hasScrolledToBookingSectionRef.current = true;
      const timer = window.setTimeout(() => {
        bookingSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
      return () => window.clearTimeout(timer);
    }

    if (doctorIdParam) return;

    hasScrolledToBookingSectionRef.current = true;
    const timer = window.setTimeout(() => {
      bookingSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);

    return () => window.clearTimeout(timer);
  }, [loading, doctorIdParam]);

  useEffect(() => {
    if (!bookingSession) return;

    const timer = window.setTimeout(() => {
      const isMobile = window.matchMedia("(max-width: 1023px)").matches;
      if (isMobile) {
        bookingPanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, [bookingSession]);

  useEffect(() => {
    if (!bookingSession || allSessions.length === 0) return;
    const refreshed = allSessions.find(
      (s) => s.sessionId === bookingSession.sessionId,
    );
    if (refreshed) {
      setBookingSession(refreshed);
    }
  }, [allSessions, bookingSession]);

  const centers = useMemo(() => uniqueCenters(allSessions), [allSessions]);
  const specializations = useMemo(
    () => uniqueSpecializations(allSessions),
    [allSessions],
  );
  const filterDoctors = useMemo(
    () => uniqueDoctors(allSessions),
    [allSessions],
  );
  const availableDates = useMemo(
    () =>
      getDatesForFilters(
        allSessions,
        filters.centerName,
        filters.specialization,
        filters.doctorId,
      ),
    [allSessions, filters.centerName, filters.specialization, filters.doctorId],
  );

  const visibleSessions = useMemo(() => {
    if (!hasSearched) return [];
    return filterSessions(allSessions, appliedFilters);
  }, [allSessions, appliedFilters, hasSearched]);

  const sessionsRevealResetKey = useMemo(
    () =>
      JSON.stringify(appliedFilters) +
      visibleSessions.map((session) => session.sessionId).join(","),
    [appliedFilters, visibleSessions],
  );

  const {
    displayedCount: displayedSessionCount,
    hasMore: hasMoreSessions,
    loadMore: loadMoreSessions,
    revealFromIndex: sessionRevealFromIndex,
  } = useIncrementalReveal(
    visibleSessions.length,
    sessionsRevealResetKey,
  );

  const displayedSessions = useMemo(
    () => visibleSessions.slice(0, displayedSessionCount),
    [visibleSessions, displayedSessionCount],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadSlots() {
      if (!bookingSession) {
        setBookingSlots([]);
        setSlotsLoading(false);
        return;
      }

      setSlotsLoading(true);
      try {
        const slots = await fetchSessionSlots(bookingSession.sessionId);
        if (!cancelled) {
          setBookingSlots(slots.map(mapApiSlotToUi));
        }
      } catch {
        if (!cancelled) {
          setBookingSlots([]);
        }
      } finally {
        if (!cancelled) {
          setSlotsLoading(false);
        }
      }
    }

    loadSlots();
    return () => {
      cancelled = true;
    };
  }, [bookingSession]);

  const handleFilterChange = (patch: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleSearch = () => {
    setAppliedFilters({ ...filters });
    setHasSearched(true);
    resetBooking();
  };

  const resetPatientBookingState = () => {
    setPatient(emptyPatient);
    setDetectedPatient(null);
    setProfileLinked(false);
    setPatientLookupSettled(false);
  };

  const resetBooking = () => {
    setBookingSession(null);
    setSelectedSlot(null);
    resetPatientBookingState();
    setBookingReference(null);
    setPaymentMethod(null);
    setConfirmedRmoInfo(null);
    setSubmitError(null);
    setIsSubmitting(false);
    setBookingSlots([]);
  };

  const handleSelectSession = (session: ChannelingSession) => {
    setBookingSession(session);
    setSelectedSlot(null);
    resetPatientBookingState();
    setPaymentMethod(null);
    setBookingReference(null);
    setConfirmedRmoInfo(null);
    setSubmitError(null);
    setBookingSlots([]);
  };

  const handleCloseBooking = () => {
    resetBooking();
  };

  const pendingProfileAcceptance =
    Boolean(detectedPatient) && !profileLinked;

  const validationErrors = useMemo(
    () =>
      validatePatientForm(patient, {
        profileLinked,
        pendingProfileAcceptance,
      }),
    [patient, profileLinked, pendingProfileAcceptance],
  );

  const canSubmit =
    bookingSession !== null &&
    selectedSlot !== null &&
    paymentMethod !== null &&
    isPatientFormValid(validationErrors);

  const isNewPatient = isNewPatientBooking(
    profileLinked,
    patient.existingPatientRegistrationId,
  );

  const showNewPatientNotice = shouldShowNewPatientRmoNotice({
    profileLinked,
    existingPatientRegistrationId: patient.existingPatientRegistrationId,
    detectedPatient,
  });

  const patientLookupReady =
    isLookupReadyNic(patient.nic) || isLookupReadyMobile(patient.phone);

  const previewRmoInfo = useMemo(() => {
    if (
      !selectedSlot ||
      !showNewPatientNotice ||
      !patientLookupReady ||
      !patientLookupSettled
    ) {
      return null;
    }
    const doctorTime = selectedSlot.time || bookingSession?.startTime || "";
    if (!doctorTime) return null;

    return resolveRmoCaseTakingInfo({
      isNewPatient: true,
      doctorAppointmentTime: doctorTime,
    });
  }, [
    showNewPatientNotice,
    patientLookupReady,
    patientLookupSettled,
    selectedSlot,
    bookingSession?.startTime,
  ]);

  const rmoCaseTakingInfo = bookingReference ? confirmedRmoInfo : previewRmoInfo;

  const handleConfirmBooking = async () => {
    if (!bookingSession || !selectedSlot || !paymentMethod || !canSubmit) {
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const channelSlotId = Number(selectedSlot.channelSlotId);
      if (!Number.isFinite(channelSlotId) || channelSlotId <= 0) {
        throw new Error("Invalid slot id. Please reselect a time slot.");
      }

      const checkoutOrigin = window.location.origin;
      const response = await checkoutChannelingBooking({
        channelSlotId,
        fullName: patient.fullName.trim(),
        mobileNumber: formatMobileForApi(patient.phone),
        nicOrPassport: patient.nic.trim() || undefined,
        existingPatientRegistrationId: patient.existingPatientRegistrationId,
        paymentMethod,
        ...(paymentMethod === "Card"
          ? {
              returnUrl: `${checkoutOrigin}/channeling?payment=success`,
              cancelUrl: `${checkoutOrigin}/channeling?payment=cancelled`,
            }
          : {}),
      });

      const paymentRedirectUrl =
        paymentMethod === "Card" ? getPaymentRedirectUrl(response) : null;
      if (paymentRedirectUrl) {
        window.location.assign(paymentRedirectUrl);
        return;
      }

      const doctorTime = selectedSlot.time || bookingSession.startTime;
      const rmoInfo = resolveRmoCaseTakingInfo({
        isNewPatient,
        doctorAppointmentTime: doctorTime,
        apiFields: response,
      });
      setConfirmedRmoInfo(rmoInfo);

      const reference =
        typeof response.bookingReference === "string"
          ? response.bookingReference
          : typeof response.referenceNumber === "string"
            ? response.referenceNumber
            : typeof response.bookingRef === "string"
              ? response.bookingRef
              : null;

      setBookingReference(reference ?? "Reference not provided");
      showToast(USER_MESSAGES.bookingSuccess);
      await reload();
      const refreshedSlots = await fetchSessionSlots(bookingSession.sessionId);
      setBookingSlots(refreshedSlots.map(mapApiSlotToUi));
    } catch (err) {
      console.warn("[ChannelingPage] Booking failed.", err);
      setSubmitError(getCheckoutErrorMessage(err, USER_MESSAGES.bookingFailed));
    } finally {
      setIsSubmitting(false);
    }
  };

  const showResults = !loading && !error && hasSearched;
  const totalOpenSlots = visibleSessions.reduce(
    (sum, s) => sum + s.availableSlotCount,
    0,
  );

  const selectedDoctorName = useMemo(() => {
    if (!appliedFilters.doctorId) return null;
    const fromList = filterDoctors.find(
      (d) => String(d.doctorId) === appliedFilters.doctorId,
    );
    if (fromList?.fullName) return fromList.fullName;
    const fromSession = allSessions.find(
      (s) => String(s.doctorId) === appliedFilters.doctorId,
    );
    return fromSession ? getSessionDoctorName(fromSession) : null;
  }, [appliedFilters.doctorId, filterDoctors, allSessions]);

  const sessionsSubtitle = useMemo(() => {
    if (!hasSearched) {
      return "Apply filters and search to view sessions";
    }
    if (selectedDoctorName) {
      return visibleSessions.length > 0
        ? `Showing sessions for ${selectedDoctorName}`
        : `Searching sessions for ${selectedDoctorName}`;
    }
    return `${visibleSessions.length} session${visibleSessions.length === 1 ? "" : "s"} available`;
  }, [hasSearched, selectedDoctorName, visibleSessions.length]);

  const handlePatientChange = (patch: Partial<PatientFormData>) => {
    if (profileLinked) {
      const allowed =
        patch.notes !== undefined ||
        patch.email !== undefined ||
        Object.keys(patch).length === 0;
      if (!allowed) return;
    }

    setPatient((prev) => ({ ...prev, ...patch }));

    if (!profileLinked && (patch.nic !== undefined || patch.phone !== undefined)) {
      setDetectedPatient(null);
    }
  };

  const handleUseExistingProfile = () => {
    if (!detectedPatient) return;
    setProfileLinked(true);
    setPatient(existingPatientToFormData(detectedPatient, patient.notes));
  };

  const bookingPanelProps = {
    session: bookingSession!,
    slots: bookingSlots,
    selectedSlot,
    onSelectSlot: setSelectedSlot,
    patient,
    errors: validationErrors,
    pendingProfileAcceptance,
    canSubmit,
    isSubmitting,
    submitError,
    slotsLoading,
    bookingReference,
    rmoCaseTakingInfo,
    detectedPatient,
    profileLinked,
    onChange: handlePatientChange,
    onDetectedPatientChange: setDetectedPatient,
    onPatientLookupSettledChange: setPatientLookupSettled,
    onUseExistingProfile: handleUseExistingProfile,
    paymentMethod,
    onPaymentMethodChange: setPaymentMethod,
    onSubmit: handleConfirmBooking,
    onClose: handleCloseBooking,
  };

  return (
    <ChannelingPageLayout>
      {loading && (
        <div className={gridClass}>
          <div className="lg:col-span-1">
            <FilterPanelSkeleton />
          </div>
          <div className="grid gap-4 grid-cols-1 lg:col-span-1">
            {Array.from({ length: 4 }, (_, i) => (
              <SessionCardSkeleton key={i} />
            ))}
          </div>
          <div className="hidden rounded-3xl border border-slate-200 bg-white/60 p-5 lg:col-span-1 lg:block">
            <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
      )}

      {!loading && error && (
        <PageState
          variant="error"
          icon="network"
          title="Unable to load sessions"
          message={USER_MESSAGES.loadFailed}
          onRetry={reload}
          retryLabel="Try Again"
        />
      )}

      {!loading && !error && (
        <>
        <div
          ref={bookingSectionRef}
          id="channeling-booking"
          className={`${gridClass} scroll-mt-24`}
        >
          <div className="lg:col-span-1">
            <ChannelingFilters
              filters={filters}
              centers={centers}
              specializations={specializations}
              doctors={filterDoctors}
              availableDates={availableDates}
              onChange={handleFilterChange}
              onSearch={handleSearch}
              highlightedDoctorId={doctorIdParam}
            />
          </div>

          <main
            ref={sessionsSectionRef}
            id="doctor-sessions"
            className="channeling-panel min-w-0 scroll-mt-24 animate-fade-in-up lg:col-span-1"
            style={{ animationDelay: "100ms" }}
          >
            <ChannelingSectionHeader
              step="Step 2"
              title="Doctor Sessions"
              subtitle={sessionsSubtitle}
              badge={
                hasSearched ? (
                  <span
                    className={
                      visibleSessions.length > 0
                        ? "channeling-count-badge"
                        : "channeling-count-badge channeling-count-badge--muted"
                    }
                  >
                    {visibleSessions.length} session
                    {visibleSessions.length === 1 ? "" : "s"}
                  </span>
                ) : undefined
              }
            />

            <div className="channeling-sessions-body px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
              {hasSearched && selectedDoctorName && (
                <div className="channeling-selected-doctor-banner" role="status">
                  <span aria-hidden="true">👨‍⚕️</span>
                  <strong>Selected doctor: {selectedDoctorName}</strong>
                </div>
              )}

              {hasSearched && (
                <div className="channeling-sessions-meta mb-5 flex flex-wrap items-center gap-2">
                  {visibleSessions.length > 0 && (
                    <span className="channeling-count-badge">
                      {totalOpenSlots} slots open
                    </span>
                  )}
                  {hasSearched && visibleSessions.length > 0 && (
                    <span className="channeling-meta-chip">
                      {visibleSessions.length} doctor session
                      {visibleSessions.length === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
              )}

            {!hasSearched && (
              <div className="rounded-3xl border border-dashed border-brand-200/70 bg-white/70 px-5 py-8 text-center shadow-sm backdrop-blur-sm sm:py-10">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 text-2xl">
                  🔍
                </div>
                <p className="text-base font-bold text-slate-800">Find your specialist</p>
                <p className="mx-auto mt-1 max-w-md text-sm font-medium text-slate-600">
                  Use the filters to search by center, specialization, doctor, or date.
                </p>
                {centers.length > 0 && (
                  <div className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-2">
                    {centers.slice(0, 4).map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {showResults && visibleSessions.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 px-5 py-8 text-center backdrop-blur-sm">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-2xl">
                  📅
                </div>
                <p className="font-bold text-slate-800">
                  {selectedDoctorName
                    ? `No available sessions for ${formatDoctorDisplayName(selectedDoctorName)}`
                    : "No sessions found"}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  {selectedDoctorName
                    ? "This doctor has no upcoming channeling sessions. Try another specialist or check back later."
                    : "Adjust your filters and try again."}
                </p>
              </div>
            )}

            {showResults && visibleSessions.length > 0 && (
              <div className="channeling-sessions-list">
                <p
                  className="channeling-sessions-showcount"
                  role="status"
                  aria-live="polite"
                >
                  Showing {displayedSessionCount} of {visibleSessions.length}
                </p>

                <div className="channeling-sessions-grid">
                  {displayedSessions.map((session, index) => (
                    <div
                      key={session.sessionId}
                      className={`channeling-session-card-wrap${
                        index >= sessionRevealFromIndex
                          ? " channeling-session-card-wrap--reveal"
                          : ""
                      }`}
                      style={{
                        animationDelay:
                          index >= sessionRevealFromIndex
                            ? `${(index - sessionRevealFromIndex) * 70}ms`
                            : `${Math.min(index * 60, 240)}ms`,
                      }}
                    >
                      <ChannelingSessionCard
                        session={session}
                        isActive={
                          bookingSession?.sessionId === session.sessionId
                        }
                        onSelect={() => handleSelectSession(session)}
                      />
                    </div>
                  ))}
                </div>

                {hasMoreSessions ? (
                  <div className="channeling-sessions-loadmore">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={loadMoreSessions}
                      className="channeling-sessions-loadmore__btn"
                    >
                      Load More Sessions
                    </Button>
                  </div>
                ) : null}
              </div>
              )}
            </div>
          </main>

          <div className="hidden lg:col-span-1 lg:block">
            {bookingSession ? (
              <ChannelingBookingPanel {...bookingPanelProps} />
            ) : (
              <ChannelingBookingPlaceholder />
            )}
          </div>

          {bookingSession ? (
            <div
              ref={bookingPanelRef}
              id="channeling-booking-panel"
              className="scroll-mt-24 lg:hidden"
            >
              <ChannelingBookingPanel {...bookingPanelProps} />
            </div>
          ) : null}
        </div>
        </>
      )}
    </ChannelingPageLayout>
  );
}

export default ChannelingPage;
