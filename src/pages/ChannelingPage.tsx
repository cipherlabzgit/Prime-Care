import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usePatientAuth } from "../context/PatientAuthContext";
import { useToast } from "../context/ToastContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { USER_MESSAGES } from "../utils/userMessages";
import {
  formatDoctorDisplayName,
  getSessionDoctorName,
} from "../utils/doctorDisplayUtils";
import "../styles/about.css";
import ChannelingBookingFormView from "../components/channeling/ChannelingBookingFormView";
import ChannelingDoctorSessionsView from "../components/channeling/ChannelingDoctorSessionsView";
import ChannelingFilters from "../components/channeling/ChannelingFilters";
import ChannelingPageLayout from "../components/channeling/ChannelingPageLayout";
import ChannelingPaymentView from "../components/channeling/ChannelingPaymentView";
import ChannelingResultsList from "../components/channeling/ChannelingResultsList";
import ChannelingReviewView from "../components/channeling/ChannelingReviewView";
import PageState from "../components/ui/PageState";
import { FilterPanelSkeleton } from "../components/ui/Skeleton";
import { useBookingCountdown } from "../hooks/useBookingCountdown";
import { useDiscoverSessions } from "../hooks/useDiscoverSessions";
import type { ChannelingPaymentMethod, SessionTimeSlot } from "../types/channeling";
import { existingPatientToFormData } from "../services/patientService";
import type {
  ExistingPatientProfile,
  PatientFormData,
} from "../types/patient";
import { getPatientFullName } from "../types/patient";
import {
  checkoutChannelingBooking,
  fetchSessionSlots,
  getCheckoutErrorMessage,
  getPaymentRedirectUrl,
  type ChannelingSession,
} from "../services/channelingService";
import {
  buildChannelingDoctorFilterOptions,
  fetchPublicDoctors,
} from "../services/doctorService";
import {
  fetchActiveHolds,
  getHoldErrorMessage,
  getSlotHoldFailureKind,
  releaseSlotHold,
  releaseSlotHoldBeacon,
  reserveSlotHold,
  SLOT_HOLD_SECONDS,
  type SlotHold,
} from "../services/slotHoldService";
import {
  filterSessions,
  getDatesForFilters,
  type ChannelingFilters as Filters,
  uniqueCenters,
  uniqueSpecializations,
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
import { mapApiSlotsToUi, normalizeSlotTime } from "../utils/slotUtils";

const emptyFilters: Filters = {
  centerName: "",
  specialization: "",
  date: "",
  doctorId: "",
};

const emptyPatient: PatientFormData = {
  title: "Mr.",
  firstName: "",
  lastName: "",
  nic: "",
  phone: "",
  email: "",
  notes: "",
};

type CheckoutStep = "details" | "review" | "payment";

interface ActiveSlotHold {
  channelSlotId: number;
  sessionId: number;
  holdToken: string;
  expiresAt: string;
  slotTime?: string;
}

function createProvisionalRef(): string {
  return `PC-${Date.now().toString(36).toUpperCase()}`;
}

function applyHoldsToSlots(
  slots: SessionTimeSlot[],
  holds: SlotHold[],
  ownChannelSlotId?: number | null,
  ownSlotTime?: string | null,
): SessionTimeSlot[] {
  const ownTime = ownSlotTime ? normalizeSlotTime(ownSlotTime) : "";
  const foreignHolds = holds.filter((hold) => {
    if (ownChannelSlotId != null && hold.channelSlotId === ownChannelSlotId) {
      return false;
    }
    if (ownTime && hold.slotTime && normalizeSlotTime(hold.slotTime) === ownTime) {
      return false;
    }
    return true;
  });

  const heldIds = new Set(foreignHolds.map((hold) => hold.channelSlotId));
  const heldTimes = new Set(
    foreignHolds
      .map((hold) => (hold.slotTime ? normalizeSlotTime(hold.slotTime) : ""))
      .filter(Boolean),
  );

  return slots.map((slot) => {
    const slotTime = normalizeSlotTime(slot.time);
    const blockedById = heldIds.has(slot.channelSlotId);
    const blockedByTime = Boolean(slotTime && heldTimes.has(slotTime));
    return blockedById || blockedByTime ? { ...slot, available: false } : slot;
  });
}

function ChannelingPage() {
  usePageTitle("Book Appointment");
  const { showToast } = useToast();
  const { session: patientSession } = usePatientAuth();
  const [searchParams] = useSearchParams();
  const { sessions: allSessions, loading, error, reload } = useDiscoverSessions();
  const [apiDoctors, setApiDoctors] = useState<
    Awaited<ReturnType<typeof fetchPublicDoctors>>
  >([]);

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [hasSearched, setHasSearched] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(emptyFilters);

  const [focusedSession, setFocusedSession] = useState<ChannelingSession | null>(
    null,
  );
  const [bookingSession, setBookingSession] = useState<ChannelingSession | null>(
    null,
  );
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("details");
  const [provisionalRef, setProvisionalRef] = useState("");
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
  const [slotHold, setSlotHold] = useState<ActiveSlotHold | null>(null);
  const [holdBusy, setHoldBusy] = useState(false);
  /** When hold API is down, allow booking without a server-side lock. */
  const [holdDegraded, setHoldDegraded] = useState(false);
  const [scrolledToSessions, setScrolledToSessions] = useState(false);
  const sessionsSectionRef = useRef<HTMLDivElement>(null);
  const bookingSectionRef = useRef<HTMLDivElement>(null);
  const bookingPanelRef = useRef<HTMLDivElement>(null);
  const appliedDeepLinkRef = useRef<string | null>(null);
  const hasScrolledToBookingSectionRef = useRef(false);
  const slotHoldRef = useRef<ActiveSlotHold | null>(null);
  const expiredHoldTokenRef = useRef<string | null>(null);

  useEffect(() => {
    slotHoldRef.current = slotHold;
  }, [slotHold]);

  useEffect(() => {
    let cancelled = false;

    void fetchPublicDoctors()
      .then((data) => {
        if (!cancelled) setApiDoctors(data);
      })
      .catch((err) => {
        console.warn(
          "[ChannelingPage] Public doctors API unavailable — using discover sessions.",
          err,
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

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

    hasScrolledToBookingSectionRef.current = true;
  }, [loading, doctorIdParam]);

  useEffect(() => {
    if (!bookingSession && !focusedSession) return;

    const timer = window.setTimeout(() => {
      bookingPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [bookingSession, focusedSession]);

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
    () => buildChannelingDoctorFilterOptions(allSessions, apiDoctors),
    [allSessions, apiDoctors],
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

  const syncSlotsWithHolds = async (
    sessionId: number,
    ownChannelSlotId?: number | null,
    ownSlotTime?: string | null,
  ) => {
    const [slots, holds] = await Promise.all([
      fetchSessionSlots(sessionId),
      fetchActiveHolds(sessionId).catch(() => [] as SlotHold[]),
    ]);
    return applyHoldsToSlots(
      mapApiSlotsToUi(slots, sessionId),
      holds,
      ownChannelSlotId,
      ownSlotTime,
    );
  };

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
        const nextSlots = await syncSlotsWithHolds(
          bookingSession.sessionId,
          slotHoldRef.current?.channelSlotId,
          slotHoldRef.current?.slotTime,
        );
        if (!cancelled) {
          setBookingSlots(nextSlots);
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

  /** Keep slot availability fresh so held slots disappear for other patients. */
  useEffect(() => {
    if (!bookingSession || bookingReference) return;

    const poll = window.setInterval(() => {
      void syncSlotsWithHolds(
        bookingSession.sessionId,
        slotHoldRef.current?.channelSlotId,
        slotHoldRef.current?.slotTime,
      )
        .then((nextSlots) => setBookingSlots(nextSlots))
        .catch(() => undefined);
    }, 8000);

    return () => window.clearInterval(poll);
  }, [bookingSession, bookingReference]);

  const releaseCurrentHold = async () => {
    const current = slotHoldRef.current;
    if (!current) return;
    slotHoldRef.current = null;
    setSlotHold(null);
    try {
      await releaseSlotHold({
        channelSlotId: current.channelSlotId,
        holdToken: current.holdToken,
        slotTime: current.slotTime,
        sessionId: current.sessionId,
      });
    } catch {
      // Ignore release failures; hold will expire server-side.
    }
  };

  useEffect(() => {
    const onPageHide = () => {
      const current = slotHoldRef.current;
      if (!current) return;
      releaseSlotHoldBeacon({
        channelSlotId: current.channelSlotId,
        holdToken: current.holdToken,
        slotTime: current.slotTime,
        sessionId: current.sessionId,
      });
    };
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      const current = slotHoldRef.current;
      if (current) {
        releaseSlotHoldBeacon({
          channelSlotId: current.channelSlotId,
          holdToken: current.holdToken,
          slotTime: current.slotTime,
          sessionId: current.sessionId,
        });
        slotHoldRef.current = null;
      }
    };
  }, []);

  const handleFilterChange = (patch: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleSearch = () => {
    setAppliedFilters({ ...filters });
    setHasSearched(true);
    setFocusedSession(null);
    resetBooking();
    window.setTimeout(() => {
      sessionsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  const resetPatientBookingState = () => {
    setPatient(emptyPatient);
    setDetectedPatient(null);
    setProfileLinked(false);
    setPatientLookupSettled(false);
  };

  const resetBooking = () => {
    void releaseCurrentHold();
    setBookingSession(null);
    setCheckoutStep("details");
    setProvisionalRef("");
    setSelectedSlot(null);
    resetPatientBookingState();
    setBookingReference(null);
    setPaymentMethod(null);
    setConfirmedRmoInfo(null);
    setSubmitError(null);
    setIsSubmitting(false);
    setHoldBusy(false);
    setHoldDegraded(false);
    setBookingSlots([]);
  };

  /** Channel → open doctor sessions list */
  const handleChannelDoctor = (session: ChannelingSession) => {
    setFocusedSession(session);
    resetBooking();
  };

  /** Book → open booking form for a session */
  const handleBookSession = (session: ChannelingSession) => {
    void releaseCurrentHold();
    expiredHoldTokenRef.current = null;
    setBookingSession(session);
    setCheckoutStep("details");
    setProvisionalRef("");
    setSelectedSlot(null);
    resetPatientBookingState();
    setPaymentMethod(null);
    setBookingReference(null);
    setConfirmedRmoInfo(null);
    setSubmitError(null);
    setHoldDegraded(false);
    setBookingSlots([]);
  };

  const handleBackToResults = () => {
    setFocusedSession(null);
    resetBooking();
  };

  const handleBackToDoctorSessions = () => {
    resetBooking();
  };

  const handleCloseBooking = () => {
    setFocusedSession(null);
    resetBooking();
  };

  const isOwnHeldSlot = (slot: SessionTimeSlot, hold?: ActiveSlotHold | null) => {
    if (!hold) return false;
    if (hold.channelSlotId === slot.channelSlotId) return true;
    if (
      hold.slotTime &&
      normalizeSlotTime(hold.slotTime) === normalizeSlotTime(slot.time)
    ) {
      return true;
    }
    return false;
  };

  const handleSelectSlot = async (slot: SessionTimeSlot) => {
    if (!bookingSession || holdBusy) return;
    if (!slot.available && !isOwnHeldSlot(slot, slotHold)) {
      setSubmitError(
        "This time slot is currently reserved by another patient. Please choose another slot.",
      );
      return;
    }

    if (isOwnHeldSlot(slot, slotHold)) {
      setSelectedSlot(slot);
      return;
    }

    setHoldBusy(true);
    setSubmitError(null);

    try {
      if (slotHold) {
        await releaseSlotHold({
          channelSlotId: slotHold.channelSlotId,
          holdToken: slotHold.holdToken,
          slotTime: slotHold.slotTime,
          sessionId: slotHold.sessionId,
        }).catch(() => undefined);
        slotHoldRef.current = null;
        setSlotHold(null);
      }

      const reserved = await reserveSlotHold({
        channelSlotId: slot.channelSlotId,
        sessionId: bookingSession.sessionId,
        durationSeconds: SLOT_HOLD_SECONDS,
        slotTime: slot.time,
      });

      const nextHold: ActiveSlotHold = {
        channelSlotId: reserved.channelSlotId,
        sessionId: reserved.sessionId,
        holdToken: reserved.holdToken,
        expiresAt: reserved.expiresAt,
        slotTime: reserved.slotTime || normalizeSlotTime(slot.time),
      };
      expiredHoldTokenRef.current = null;
      slotHoldRef.current = nextHold;
      setSlotHold(nextHold);
      setHoldDegraded(false);
      setSelectedSlot(slot);
      setSubmitError(null);

      const refreshed = await syncSlotsWithHolds(
        bookingSession.sessionId,
        nextHold.channelSlotId,
        nextHold.slotTime,
      );
      setBookingSlots(refreshed);
    } catch (err) {
      const kind = getSlotHoldFailureKind(err);

      if (kind === "unavailable") {
        // Hold server down — still allow selection so booking is not blocked.
        expiredHoldTokenRef.current = null;
        slotHoldRef.current = null;
        setSlotHold(null);
        setHoldDegraded(true);
        setSelectedSlot(slot);
        setSubmitError(getHoldErrorMessage(err, "Slot hold service unavailable."));
        return;
      }

      setSelectedSlot(null);
      setSubmitError(
        getHoldErrorMessage(
          err,
          "Could not reserve this time slot. Please try another slot.",
        ),
      );
      if (bookingSession) {
        const refreshed = await syncSlotsWithHolds(bookingSession.sessionId, null);
        setBookingSlots(refreshed);
      }
    } finally {
      setHoldBusy(false);
    }
  };

  const handleContinueToReview = async () => {
    if (
      !bookingSession ||
      !selectedSlot ||
      !isPatientFormValid(validationErrors) ||
      pendingProfileAcceptance
    ) {
      return;
    }

    setSubmitError(null);
    setHoldBusy(true);

    try {
      const reserved = await reserveSlotHold({
        channelSlotId: selectedSlot.channelSlotId,
        sessionId: bookingSession.sessionId,
        holdToken: slotHold?.holdToken,
        durationSeconds: SLOT_HOLD_SECONDS,
        slotTime: selectedSlot.time,
      });
      const nextHold: ActiveSlotHold = {
        channelSlotId: reserved.channelSlotId,
        sessionId: reserved.sessionId,
        holdToken: reserved.holdToken,
        expiresAt: reserved.expiresAt,
        slotTime: reserved.slotTime || normalizeSlotTime(selectedSlot.time),
      };
      slotHoldRef.current = nextHold;
      setSlotHold(nextHold);
      setHoldDegraded(false);
      setProvisionalRef((prev) => prev || createProvisionalRef());
      setCheckoutStep("review");
    } catch (err) {
      const kind = getSlotHoldFailureKind(err);

      if (kind === "unavailable") {
        setHoldDegraded(true);
        setProvisionalRef((prev) => prev || createProvisionalRef());
        setCheckoutStep("review");
        setSubmitError(null);
        return;
      }

      if (kind === "conflict") {
        setSelectedSlot(null);
        slotHoldRef.current = null;
        setSlotHold(null);
        setSubmitError(getHoldErrorMessage(err, "Slot is reserved."));
        const refreshed = await syncSlotsWithHolds(bookingSession.sessionId, null);
        setBookingSlots(refreshed);
        return;
      }

      setSubmitError(
        getHoldErrorMessage(err, "Could not reserve this time slot. Please try again."),
      );
    } finally {
      setHoldBusy(false);
    }
  };

  const handleContinueToPayment = () => {
    setCheckoutStep("payment");
  };

  const handleEditDetails = () => {
    setCheckoutStep("details");
    setSubmitError(null);
  };

  const doctorSessions = useMemo(() => {
    if (!focusedSession) return [];
    return allSessions.filter(
      (s) =>
        s.doctorId === focusedSession.doctorId &&
        s.centerName === focusedSession.centerName,
    );
  }, [allSessions, focusedSession]);

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

  const detailsReady =
    bookingSession !== null &&
    selectedSlot !== null &&
    isPatientFormValid(validationErrors) &&
    !pendingProfileAcceptance;

  const canSubmit =
    detailsReady && paymentMethod !== null;

  const countdownActive =
    Boolean(slotHold) &&
    !bookingReference &&
    (checkoutStep === "details" ||
      checkoutStep === "review" ||
      checkoutStep === "payment");

  const { label: timerLabel, expired: timerExpired } = useBookingCountdown(
    countdownActive,
    slotHold?.expiresAt ?? null,
  );

  useEffect(() => {
    if (!timerExpired || !slotHold) return;
    // Prevent re-entry / immediate clear of a freshly reserved slot.
    if (expiredHoldTokenRef.current === slotHold.holdToken) return;
    expiredHoldTokenRef.current = slotHold.holdToken;

    void (async () => {
      await releaseCurrentHold();
      setSelectedSlot(null);
      setCheckoutStep("details");
      setSubmitError(
        "Your slot hold expired. The time slot was released — please select a slot again.",
      );
      if (bookingSession) {
        const refreshed = await syncSlotsWithHolds(bookingSession.sessionId, null);
        setBookingSlots(refreshed);
      }
    })();
  }, [timerExpired, slotHold, bookingSession]);

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
      const channelSlotId = Number(
        selectedSlot.checkoutSlotId ?? selectedSlot.channelSlotId,
      );
      if (!Number.isFinite(channelSlotId) || channelSlotId <= 0) {
        throw new Error("Invalid slot id. Please reselect a time slot.");
      }

      const checkoutOrigin = window.location.origin;
      const response = await checkoutChannelingBooking({
        channelSlotId,
        fullName: getPatientFullName(patient),
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
      // Slot is booked — clear local hold without releasing (server hold can expire).
      slotHoldRef.current = null;
      setSlotHold(null);
      showToast(USER_MESSAGES.bookingSuccess);
      await reload();
      const refreshedSlots = await syncSlotsWithHolds(bookingSession.sessionId, null);
      setBookingSlots(refreshedSlots);
    } catch (err) {
      console.warn("[ChannelingPage] Booking failed.", err);
      setSubmitError(getCheckoutErrorMessage(err, USER_MESSAGES.bookingFailed));
    } finally {
      setIsSubmitting(false);
    }
  };

  const showResults = !loading && !error && hasSearched;

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

  const handleSignedInProfile = useCallback(
    (profile: ExistingPatientProfile) => {
      setDetectedPatient(profile);
      setProfileLinked(true);
      setPatientLookupSettled(true);
      setPatient((prev) => existingPatientToFormData(profile, prev.notes));
    },
    [],
  );

  const handleClearSignedInProfile = useCallback(() => {
    setProfileLinked(false);
    setDetectedPatient(null);
    setPatientLookupSettled(false);
    setPatient((prev) => ({
      ...emptyPatient,
      notes: prev.notes,
    }));
  }, []);

  useEffect(() => {
    if (!patientSession?.patient || profileLinked) return;
    handleSignedInProfile(patientSession.patient);
  }, [patientSession, profileLinked, handleSignedInProfile]);

  const showDoctorStep = Boolean(focusedSession) && !bookingSession;
  const showBookingStep = Boolean(bookingSession);
  const showDetailsStep =
    showBookingStep && (checkoutStep === "details" || Boolean(bookingReference));
  const showReviewStep =
    showBookingStep && checkoutStep === "review" && !bookingReference;
  const showPaymentStep =
    showBookingStep && checkoutStep === "payment" && !bookingReference;
  const showResultsList = showResults && !focusedSession && !bookingSession;
  const pageMode =
    hasSearched || focusedSession || bookingSession ? "results" : "landing";
  const showSearchBar = pageMode === "results" && !focusedSession && !bookingSession;

  const filterProps = {
    filters,
    centers,
    specializations,
    doctors: filterDoctors,
    availableDates,
    onChange: handleFilterChange,
    onSearch: handleSearch,
    highlightedDoctorId: doctorIdParam,
  } as const;

  const searchCard =
    loading || error ? (
      loading ? <FilterPanelSkeleton /> : null
    ) : (
      <ChannelingFilters {...filterProps} variant="card" />
    );

  const searchBar =
    !loading && !error ? (
      <ChannelingFilters {...filterProps} variant="bar" />
    ) : null;

  return (
    <ChannelingPageLayout
      mode={pageMode}
      searchCard={!hasSearched ? searchCard : undefined}
      searchBar={showSearchBar ? searchBar : undefined}
    >
      {loading && !hasSearched && (
        <p className="text-center text-sm font-medium text-slate-500">
          Loading available sessions…
        </p>
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

      {!loading && !error && !hasSearched && (
        <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-brand-200/70 bg-white/80 px-5 py-8 text-center shadow-sm">
          <p className="text-base font-bold text-slate-800">Find your specialist</p>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Search by doctor, specialization, hospital, or date to view available
            sessions.
          </p>
        </div>
      )}

      <div
        ref={bookingSectionRef}
        id="channeling-booking"
        className="scroll-mt-24"
      >
        {showResultsList ? (
          <div ref={sessionsSectionRef} className="min-w-0 animate-fade-in-up">
            {visibleSessions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center">
                <p className="font-bold text-slate-800">
                  {selectedDoctorName
                    ? `No available sessions for ${formatDoctorDisplayName(selectedDoctorName)}`
                    : "No sessions found"}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  {selectedDoctorName
                    ? "This doctor has no upcoming channeling sessions. Try another specialist or check back later."
                    : "Adjust your search and try again."}
                </p>
              </div>
            ) : (
              <ChannelingResultsList
                sessions={visibleSessions}
                onSelect={handleChannelDoctor}
              />
            )}
          </div>
        ) : null}

        {showDoctorStep && focusedSession ? (
          <div ref={bookingPanelRef} id="channeling-doctor-sessions">
            <ChannelingDoctorSessionsView
              anchorSession={focusedSession}
              sessions={doctorSessions}
              onBook={handleBookSession}
              onBack={handleBackToResults}
            />
          </div>
        ) : null}

        {showDetailsStep && bookingSession ? (
          <div ref={bookingPanelRef} id="channeling-booking-panel">
            <ChannelingBookingFormView
              session={bookingSession}
              slots={bookingSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={handleSelectSlot}
              patient={patient}
              errors={validationErrors}
              pendingProfileAcceptance={pendingProfileAcceptance}
              canContinue={detailsReady && (Boolean(slotHold) || holdDegraded)}
              isSubmitting={isSubmitting}
              submitError={submitError}
              slotsLoading={slotsLoading}
              bookingReference={bookingReference}
              rmoCaseTakingInfo={rmoCaseTakingInfo}
              detectedPatient={detectedPatient}
              profileLinked={profileLinked}
              paymentMethod={paymentMethod}
              timerLabel={slotHold ? timerLabel : null}
              holdBusy={holdBusy}
              holdDegraded={holdDegraded}
              onChange={handlePatientChange}
              onDetectedPatientChange={setDetectedPatient}
              onPatientLookupSettledChange={setPatientLookupSettled}
              onUseExistingProfile={handleUseExistingProfile}
              onSignedInProfile={handleSignedInProfile}
              onClearSignedInProfile={handleClearSignedInProfile}
              onContinue={() => {
                void handleContinueToReview();
              }}
              onBack={handleBackToDoctorSessions}
              onDone={handleCloseBooking}
            />
          </div>
        ) : null}

        {showReviewStep && bookingSession && selectedSlot ? (
          <div ref={bookingPanelRef} id="channeling-review">
            <ChannelingReviewView
              session={bookingSession}
              selectedSlot={selectedSlot}
              patient={patient}
              provisionalRef={provisionalRef}
              timerLabel={timerLabel}
              rmoCaseTakingInfo={rmoCaseTakingInfo}
              onBack={handleEditDetails}
              onContinue={handleContinueToPayment}
            />
          </div>
        ) : null}

        {showPaymentStep && bookingSession ? (
          <div ref={bookingPanelRef} id="channeling-payment">
            <ChannelingPaymentView
              session={bookingSession}
              requiresRmoFee={rmoCaseTakingInfo !== null}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              timerLabel={timerLabel}
              isSubmitting={isSubmitting}
              submitError={submitError}
              onEdit={handleEditDetails}
              onPay={handleConfirmBooking}
            />
          </div>
        ) : null}
      </div>
    </ChannelingPageLayout>
  );
}

export default ChannelingPage;
