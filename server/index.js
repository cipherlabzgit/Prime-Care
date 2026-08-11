import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { listHolds, releaseHold, reserveHold } from "./slotHoldsStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "reviews.json");
const SEED_FILE = path.join(DATA_DIR, "reviews.seed.json");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.seed.json");
const RMO_BOOKINGS_FILE = path.join(DATA_DIR, "rmo-bookings.json");
const RMO_BOOKINGS_SEED = path.join(DATA_DIR, "rmo-bookings.seed.json");
const PORT = Number(process.env.REVIEWS_API_PORT || 7001);
const PATIENTS_SERVED = Number(process.env.PATIENTS_SERVED || 5000);

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.copyFileSync(SEED_FILE, DATA_FILE);
  }
}

function readReviews() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(raw);
}

function writeReviews(reviews) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(reviews, null, 2), "utf8");
}

function readBookings() {
  const raw = fs.readFileSync(BOOKINGS_FILE, "utf8");
  return JSON.parse(raw);
}

function normalizeMobile(value) {
  if (!value) return "";
  const digits = String(value).replace(/[\s-]/g, "");
  if (digits.startsWith("+94")) return `0${digits.slice(3)}`;
  if (digits.startsWith("94") && digits.length === 11) return `0${digits.slice(2)}`;
  return digits;
}

function normalizeBookingReference(value) {
  return String(value ?? "").trim().toUpperCase();
}

function normalizeNic(value) {
  return String(value ?? "").trim().toUpperCase();
}

function ensureRmoBookingsFile() {
  ensureDataFile();
  if (!fs.existsSync(RMO_BOOKINGS_FILE)) {
    fs.copyFileSync(RMO_BOOKINGS_SEED, RMO_BOOKINGS_FILE);
  }
}

function readRmoBookings() {
  ensureRmoBookingsFile();
  const raw = fs.readFileSync(RMO_BOOKINGS_FILE, "utf8");
  return JSON.parse(raw);
}

function writeRmoBookings(bookings) {
  ensureRmoBookingsFile();
  fs.writeFileSync(RMO_BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf8");
}

function todayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function matchesRmoLookup(booking, query) {
  const ref = normalizeBookingReference(query.bookingReference);
  const mobile = normalizeMobile(query.mobileNumber);
  const nic = normalizeNic(query.nic);
  const sessionDate = String(query.sessionDate ?? "").trim();
  const centerName = String(query.centerName ?? "").trim();

  if (ref && normalizeBookingReference(booking.bookingReference) !== ref) {
    return false;
  }
  if (mobile && normalizeMobile(booking.mobileNumber) !== mobile) {
    return false;
  }
  if (nic && normalizeNic(booking.nicOrPassport) !== nic) {
    return false;
  }
  if (sessionDate && booking.sessionDate !== sessionDate) {
    return false;
  }
  if (centerName && booking.centerName !== centerName) {
    return false;
  }
  return true;
}

function sortRmoBookings(bookings) {
  return [...bookings].sort((a, b) => {
    const arrival = a.recommendedArrivalTime.localeCompare(b.recommendedArrivalTime);
    if (arrival !== 0) return arrival;
    return a.doctorAppointmentTime.localeCompare(b.doctorAppointmentTime);
  });
}

function nextPatientRegistrationId(bookings) {
  const ids = bookings
    .map((b) => b.newPatientRegistrationId)
    .filter((id) => Number.isFinite(id));
  return ids.length === 0 ? 1000 : Math.max(...ids) + 1;
}

function normalizeLegacyRmoStatus(status) {
  return status === "PendingRmo" ? "WebBooked" : status;
}

function normalizeRmoBooking(booking) {
  return {
    ...booking,
    rmoStatus: normalizeLegacyRmoStatus(booking.rmoStatus),
  };
}

function readRmoBookingsNormalized() {
  return readRmoBookings().map(normalizeRmoBooking);
}

function findVerifiedBooking(bookingReference, mobileNumber) {
  const ref = normalizeBookingReference(bookingReference);
  const mobile = normalizeMobile(mobileNumber);
  if (!ref || !mobile) return null;

  return (
    readBookings().find(
      (booking) =>
        normalizeBookingReference(booking.bookingReference) === ref &&
        normalizeMobile(booking.mobileNumber) === mobile,
    ) ?? null
  );
}

function hasExistingReviewForBooking(bookingReference, reviews) {
  const ref = normalizeBookingReference(bookingReference);
  return reviews.some(
    (review) =>
      normalizeBookingReference(review.bookingReference) === ref &&
      review.status !== "Rejected",
  );
}

function nextReviewId(reviews) {
  if (reviews.length === 0) return 1;
  return Math.max(...reviews.map((r) => r.reviewId)) + 1;
}

function sortApproved(reviews) {
  return [...reviews].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return new Date(b.approvedDate || b.createdDate) - new Date(a.approvedDate || a.createdDate);
  });
}

function getApprovedReviews(reviews) {
  return reviews.filter((r) => r.status === "Approved");
}

function getReviewStats(reviews) {
  const approved = getApprovedReviews(reviews);
  const totalReviews = approved.length;
  const averageRating =
    totalReviews === 0
      ? 0
      : Math.round(
          (approved.reduce((sum, review) => sum + review.rating, 0) / totalReviews) *
            10,
        ) / 10;

  return {
    averageRating,
    totalReviews,
    patientsServed: PATIENTS_SERVED,
  };
}

/** In-memory attempt counters for public booking search (mock rate limit). */
const publicBookingLookupAttempts = new Map();
const PUBLIC_BOOKING_LOOKUP_MAX_ATTEMPTS = 20;

const PUBLIC_STATUS_LABELS = {
  WebBooked: "Booked online",
  ArrivedAtReception: "At reception",
  AssignedToRmo: "With RMO",
  PendingRmo: "Booked online",
  RmoInProgress: "RMO in progress",
  RmoComplete: "RMO complete",
  ReadyForDoctor: "Ready for doctor",
};

function maskMobile(mobile) {
  const digits = normalizeMobile(mobile);
  if (digits.length < 4) return digits;
  return `${digits.slice(0, 3)}****${digits.slice(-3)}`;
}

function computeOngoingNumber(booking, peers) {
  const ordered = [...peers].sort((a, b) => {
    const time = a.doctorAppointmentTime.localeCompare(b.doctorAppointmentTime);
    if (time !== 0) return time;
    return a.bookingId - b.bookingId;
  });
  const index = ordered.findIndex((item) => item.bookingId === booking.bookingId);
  return index >= 0 ? index + 1 : Math.max(1, booking.bookingId % 100);
}

function computeCurrentServingNumber(peers) {
  const advanced = peers.filter((item) =>
    ["ReadyForDoctor", "RmoComplete", "RmoInProgress", "AssignedToRmo"].includes(
      item.rmoStatus,
    ),
  );
  if (advanced.length === 0) return null;
  return computeOngoingNumber(
    advanced.sort((a, b) => b.bookingId - a.bookingId)[0],
    peers,
  );
}

function toPublicBookingView(booking, allBookings) {
  const peers = allBookings.filter(
    (item) =>
      item.sessionDate === booking.sessionDate &&
      item.doctorName === booking.doctorName &&
      item.centerName === booking.centerName,
  );
  const ongoingNumber = computeOngoingNumber(booking, peers);
  const currentServingNumber = computeCurrentServingNumber(peers);
  const status = normalizeLegacyRmoStatus(booking.rmoStatus);

  return {
    bookingId: booking.bookingId,
    bookingReference: booking.bookingReference,
    fullName: booking.fullName,
    mobileNumberMasked: maskMobile(booking.mobileNumber),
    sessionDate: booking.sessionDate,
    doctorAppointmentTime: booking.doctorAppointmentTime,
    recommendedArrivalTime: booking.recommendedArrivalTime,
    doctorName: booking.doctorName,
    specialization: booking.specialization,
    centerName: booking.centerName,
    roomCode: booking.roomCode,
    consultationFee: booking.consultationFee,
    patientType: booking.patientType,
    requiresRmoCaseTaking: Boolean(booking.requiresRmoCaseTaking),
    status,
    statusLabel: PUBLIC_STATUS_LABELS[status] ?? status,
    ongoingNumber,
    currentServingNumber,
    queueMessage:
      currentServingNumber == null
        ? "Clinic has not started calling numbers for this session yet."
        : `Clinic is currently serving approximately number ${currentServingNumber}.`,
  };
}

function findPublicBooking(bookingReference, mobileNumber) {
  const ref = normalizeBookingReference(bookingReference);
  const mobile = normalizeMobile(mobileNumber);
  if (!ref || !mobile) return null;

  const rmoMatch = readRmoBookingsNormalized().find(
    (booking) =>
      normalizeBookingReference(booking.bookingReference) === ref &&
      normalizeMobile(booking.mobileNumber) === mobile,
  );
  if (rmoMatch) return rmoMatch;

  const light = findVerifiedBooking(ref, mobile);
  if (!light) return null;

  return {
    bookingId: Number(String(ref).replace(/\D/g, "").slice(-3)) || 1,
    bookingReference: ref,
    patientType: "EXISTING",
    requiresRmoCaseTaking: false,
    rmoStatus: "WebBooked",
    fullName: light.patientName,
    mobileNumber: light.mobileNumber,
    sessionDate: todayDateKey(),
    doctorAppointmentTime: "09:00",
    recommendedArrivalTime: "08:45",
    rmoCaseTakingMinutes: 0,
    doctorName: "PremierCare Clinic",
    specialization: "General",
    centerName: "PremierCare",
    roomCode: "-",
    consultationFee: 0,
  };
}

function trackPublicLookupAttempt(bookingReference) {
  const key = normalizeBookingReference(bookingReference) || "UNKNOWN";
  const used = (publicBookingLookupAttempts.get(key) ?? 0) + 1;
  publicBookingLookupAttempts.set(key, used);
  return used;
}

/** Dev-friendly OTP soft-login (mock SMS). */
const DEV_OTP_CODE = "123456";
const OTP_TTL_MS = 5 * 60 * 1000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const otpChallenges = new Map();
const patientSessions = new Map();

function createToken(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function findPatientProfileByMobile(mobileNumber) {
  const mobile = normalizeMobile(mobileNumber);
  if (!mobile) return null;

  const fromRmo = readRmoBookingsNormalized().find(
    (booking) => normalizeMobile(booking.mobileNumber) === mobile,
  );
  if (fromRmo) {
    return {
      registrationId:
        fromRmo.existingPatientRegistrationId ??
        fromRmo.newPatientRegistrationId ??
        fromRmo.bookingId,
      patientCode: `PT-${String(fromRmo.bookingId).padStart(6, "0")}`,
      fullName: fromRmo.fullName,
      mobileNumber: normalizeMobile(fromRmo.mobileNumber),
      nic: fromRmo.nicOrPassport || undefined,
      email: fromRmo.email || undefined,
    };
  }

  const fromReviews = readBookings().find(
    (booking) => normalizeMobile(booking.mobileNumber) === mobile,
  );
  if (fromReviews) {
    return {
      registrationId: Number(String(fromReviews.bookingReference).replace(/\D/g, "").slice(-4)) || 1,
      patientCode: fromReviews.bookingReference,
      fullName: fromReviews.patientName,
      mobileNumber: normalizeMobile(fromReviews.mobileNumber),
    };
  }

  return null;
}

function purgeExpiredAuth() {
  const now = Date.now();
  for (const [mobile, challenge] of otpChallenges.entries()) {
    if (challenge.expiresAt <= now) otpChallenges.delete(mobile);
  }
  for (const [token, session] of patientSessions.entries()) {
    if (new Date(session.expiresAt).getTime() <= now) patientSessions.delete(token);
  }
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "premiercare-reviews" });
});

app.post("/api/public/reviews/verify-booking", (req, res) => {
  const { bookingReference, mobileNumber } = req.body ?? {};
  const ref = normalizeBookingReference(bookingReference);
  const mobile = normalizeMobile(mobileNumber);

  if (!ref) {
    return res.status(400).json({ message: "Booking reference number is required." });
  }
  if (!mobile) {
    return res.status(400).json({ message: "Mobile number is required." });
  }

  const booking = findVerifiedBooking(ref, mobile);
  if (!booking) {
    return res.status(404).json({
      message: "No matching booking found. Check your reference number and mobile number.",
    });
  }

  const reviews = readReviews();
  if (hasExistingReviewForBooking(ref, reviews)) {
    return res.status(409).json({
      message: "A review has already been submitted for this booking reference.",
    });
  }

  return res.json({
    verified: true,
    bookingReference: ref,
    patientName: booking.patientName,
    message: "Booking verified. You may submit your review.",
  });
});

app.post("/api/public/reviews", (req, res) => {
  const {
    fullName,
    email,
    rating,
    reviewText,
    location,
    bookingReference,
    mobileNumber,
  } = req.body ?? {};

  const ref = normalizeBookingReference(bookingReference);
  const mobile = normalizeMobile(mobileNumber);

  if (!ref) {
    return res.status(400).json({ message: "Booking reference number is required." });
  }
  if (!mobile) {
    return res.status(400).json({ message: "Mobile number is required." });
  }

  const booking = findVerifiedBooking(ref, mobile);
  if (!booking) {
    return res.status(403).json({
      message: "Booking could not be verified. Only verified patients may submit reviews.",
    });
  }

  const reviews = readReviews();
  if (hasExistingReviewForBooking(ref, reviews)) {
    return res.status(409).json({
      message: "A review has already been submitted for this booking reference.",
    });
  }

  if (!fullName?.trim()) {
    return res.status(400).json({ message: "Full name is required." });
  }
  if (!reviewText?.trim()) {
    return res.status(400).json({ message: "Review message is required." });
  }
  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  const now = new Date().toISOString();
  const review = {
    reviewId: nextReviewId(reviews),
    fullName: fullName.trim(),
    email: email?.trim() || null,
    rating: numericRating,
    reviewText: reviewText.trim(),
    location: location?.trim() || null,
    bookingReference: ref,
    mobileNumber: mobile,
    status: "Pending",
    createdDate: now,
    approvedDate: null,
  };

  reviews.push(review);
  writeReviews(reviews);

  return res.status(201).json({
    message: "Thank you! Your review has been submitted and is pending approval.",
    reviewId: review.reviewId,
  });
});

app.get("/api/public/reviews/stats", (_req, res) => {
  const reviews = readReviews();
  res.json(getReviewStats(reviews));
});

app.get("/api/public/reviews", (_req, res) => {
  const reviews = getApprovedReviews(readReviews());
  res.json(sortApproved(reviews));
});

app.get("/api/public/reviews/top", (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 3, 1), 20);
  const reviews = getApprovedReviews(readReviews());
  res.json(sortApproved(reviews).slice(0, limit));
});

app.get("/api/channeling/reviews", (_req, res) => {
  const reviews = readReviews().sort(
    (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
  );
  res.json(reviews);
});

app.patch("/api/channeling/reviews/:id/approve", (req, res) => {
  const id = Number(req.params.id);
  const reviews = readReviews();
  const review = reviews.find((r) => r.reviewId === id);
  if (!review) {
    return res.status(404).json({ message: "Review not found." });
  }
  review.status = "Approved";
  review.approvedDate = new Date().toISOString();
  writeReviews(reviews);
  return res.json(review);
});

app.patch("/api/channeling/reviews/:id/reject", (req, res) => {
  const id = Number(req.params.id);
  const reviews = readReviews();
  const review = reviews.find((r) => r.reviewId === id);
  if (!review) {
    return res.status(404).json({ message: "Review not found." });
  }
  review.status = "Rejected";
  review.approvedDate = null;
  writeReviews(reviews);
  return res.json(review);
});

app.delete("/api/channeling/reviews/:id", (req, res) => {
  const id = Number(req.params.id);
  const reviews = readReviews();
  const index = reviews.findIndex((r) => r.reviewId === id);
  if (index === -1) {
    return res.status(404).json({ message: "Review not found." });
  }
  const [removed] = reviews.splice(index, 1);
  writeReviews(reviews);
  return res.json({ message: "Review deleted.", reviewId: removed.reviewId });
});

app.get("/api/channeling/rmo/bookings/lookup", (req, res) => {
  const bookingReference = req.query.bookingReference;
  const mobileNumber = req.query.mobileNumber;
  const nic = req.query.nic;

  if (!bookingReference && !mobileNumber && !nic) {
    return res.status(400).json({
      message: "Provide at least one of bookingReference, mobileNumber, or nic.",
    });
  }

  const bookings = readRmoBookingsNormalized().filter((booking) =>
    matchesRmoLookup(booking, {
      bookingReference,
      mobileNumber,
      nic,
      sessionDate: req.query.sessionDate,
      centerName: req.query.centerName,
    }),
  );

  if (bookings.length === 0) {
    return res.status(404).json({ message: "No matching RMO bookings found." });
  }

  return res.json(sortRmoBookings(bookings));
});

app.get("/api/channeling/rmo/bookings/today", (req, res) => {
  const sessionDate = String(req.query.sessionDate ?? todayDateKey()).trim();
  const centerName = String(req.query.centerName ?? "").trim();

  const bookings = sortRmoBookings(
    readRmoBookingsNormalized().filter((booking) => {
      if (!booking.requiresRmoCaseTaking) return false;
      if (!["AssignedToRmo", "RmoInProgress"].includes(booking.rmoStatus)) {
        return false;
      }
      if (booking.sessionDate !== sessionDate) return false;
      if (centerName && booking.centerName !== centerName) return false;
      return true;
    }),
  );

  return res.json(bookings);
});

app.get("/api/channeling/rmo/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const booking = readRmoBookingsNormalized().find((item) => item.bookingId === id);
  if (!booking) {
    return res.status(404).json({ message: "RMO booking not found." });
  }
  return res.json(booking);
});

app.patch("/api/channeling/rmo/bookings/:id/case-taking", (req, res) => {
  const id = Number(req.params.id);
  const bookings = readRmoBookings();
  const index = bookings.findIndex((item) => item.bookingId === id);
  if (index === -1) {
    return res.status(404).json({ message: "RMO booking not found." });
  }

  const booking = bookings[index];
  if (!booking.requiresRmoCaseTaking) {
    return res.status(400).json({ message: "This booking does not require RMO case taking." });
  }
  if (booking.rmoStatus === "RmoComplete" || booking.rmoStatus === "ReadyForDoctor") {
    return res.status(400).json({ message: "Case taking is already complete for this booking." });
  }
  if (!["AssignedToRmo", "RmoInProgress"].includes(booking.rmoStatus)) {
    return res.status(400).json({
      message: "Patient must be assigned from Reception before RMO case taking can begin.",
    });
  }

  const {
    fullName,
    mobileNumber,
    nicOrPassport,
    email,
    caseTakingNotes,
    complete,
  } = req.body ?? {};

  if (typeof complete !== "boolean") {
    return res.status(400).json({ message: "Field 'complete' (boolean) is required." });
  }

  if (fullName?.trim()) booking.fullName = fullName.trim();
  if (mobileNumber?.trim()) booking.mobileNumber = normalizeMobile(mobileNumber);
  if (nicOrPassport?.trim()) booking.nicOrPassport = nicOrPassport.trim();
  if (email !== undefined) booking.email = email?.trim() || "";
  if (caseTakingNotes !== undefined) {
    booking.caseTakingNotes = caseTakingNotes?.trim() || null;
  }

  let newPatientRegistrationId;
  let message;

  if (complete) {
    newPatientRegistrationId = nextPatientRegistrationId(bookings);
    booking.newPatientRegistrationId = newPatientRegistrationId;
    booking.rmoStatus = "ReadyForDoctor";
    booking.rmoCompletedAt = new Date().toISOString();
    message = "Case taking completed. Patient is ready for the doctor.";
  } else {
    booking.rmoStatus = "RmoInProgress";
    message = "Case taking saved. Patient is marked in progress.";
  }

  bookings[index] = booking;
  writeRmoBookings(bookings);

  const response = { message, booking };
  if (newPatientRegistrationId) {
    response.newPatientRegistrationId = newPatientRegistrationId;
  }
  return res.json(response);
});

app.get("/api/channeling/reception/bookings/lookup", (req, res) => {
  const bookingReference = req.query.bookingReference;
  const mobileNumber = req.query.mobileNumber;
  const nic = req.query.nic;

  if (!bookingReference && !mobileNumber && !nic) {
    return res.status(400).json({
      message: "Provide at least one of bookingReference, mobileNumber, or nic.",
    });
  }

  const bookings = readRmoBookingsNormalized().filter((booking) =>
    matchesRmoLookup(booking, {
      bookingReference,
      mobileNumber,
      nic,
      sessionDate: req.query.sessionDate,
      centerName: req.query.centerName,
    }),
  );

  if (bookings.length === 0) {
    return res.status(404).json({ message: "No matching bookings found." });
  }

  return res.json(sortRmoBookings(bookings));
});

app.get("/api/channeling/reception/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const booking = readRmoBookingsNormalized().find((item) => item.bookingId === id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }
  return res.json(booking);
});

app.patch("/api/channeling/reception/bookings/:id/check-in", (req, res) => {
  const id = Number(req.params.id);
  const bookings = readRmoBookings();
  const index = bookings.findIndex((item) => item.bookingId === id);
  if (index === -1) {
    return res.status(404).json({ message: "Booking not found." });
  }

  const booking = normalizeRmoBooking(bookings[index]);
  const status = booking.rmoStatus;

  if (status !== "WebBooked" && status !== "PendingRmo") {
    return res.status(400).json({
      message: "Only online bookings awaiting arrival can be checked in.",
    });
  }

  booking.rmoStatus = "ArrivedAtReception";
  booking.arrivedAt = new Date().toISOString();
  bookings[index] = booking;
  writeRmoBookings(bookings);

  return res.json({
    message: "Patient checked in at Reception.",
    booking,
  });
});

app.patch("/api/channeling/reception/bookings/:id/assign-rmo", (req, res) => {
  const id = Number(req.params.id);
  const bookings = readRmoBookings();
  const index = bookings.findIndex((item) => item.bookingId === id);
  if (index === -1) {
    return res.status(404).json({ message: "Booking not found." });
  }

  const booking = normalizeRmoBooking(bookings[index]);

  if (!booking.requiresRmoCaseTaking) {
    return res.status(400).json({ message: "This booking does not require RMO case taking." });
  }
  if (booking.rmoStatus !== "ArrivedAtReception") {
    return res.status(400).json({
      message: "Patient must be checked in at Reception before assigning to RMO.",
    });
  }

  booking.rmoStatus = "AssignedToRmo";
  booking.assignedToRmoAt = new Date().toISOString();
  bookings[index] = booking;
  writeRmoBookings(bookings);

  return res.json({
    message: "Patient assigned to RMO. They will appear in the RMO intake queue.",
    booking,
  });
});

app.get("/api/channeling/public/bookings/lookup", (req, res) => {
  const bookingReference = String(req.query.bookingReference ?? "").trim();
  const mobileNumber = String(req.query.mobileNumber ?? "").trim();

  if (!bookingReference || !mobileNumber) {
    return res.status(400).json({
      message: "Booking reference and phone number are required.",
    });
  }

  const attempts = trackPublicLookupAttempt(bookingReference);
  if (attempts > PUBLIC_BOOKING_LOOKUP_MAX_ATTEMPTS) {
    return res.status(429).json({
      message: "Too many search attempts for this booking. Please try again later.",
      attemptsRemaining: 0,
    });
  }

  const booking = findPublicBooking(bookingReference, mobileNumber);
  if (!booking) {
    return res.status(404).json({
      message:
        "No matching booking found. Check your reference number and the phone used at booking.",
      attemptsRemaining: Math.max(0, PUBLIC_BOOKING_LOOKUP_MAX_ATTEMPTS - attempts),
    });
  }

  return res.json({
    booking: toPublicBookingView(booking, readRmoBookingsNormalized()),
    attemptsRemaining: Math.max(0, PUBLIC_BOOKING_LOOKUP_MAX_ATTEMPTS - attempts),
  });
});

app.post("/api/channeling/public/auth/otp/request", (req, res) => {
  purgeExpiredAuth();
  const mobileNumber = normalizeMobile(req.body?.mobileNumber);
  if (!/^0\d{9}$/.test(mobileNumber)) {
    return res.status(400).json({
      message: "Enter a valid Sri Lankan mobile number (e.g. 0771234567).",
    });
  }

  const code = DEV_OTP_CODE;
  const expiresAt = Date.now() + OTP_TTL_MS;
  otpChallenges.set(mobileNumber, {
    code,
    expiresAt,
    attempts: 0,
  });

  console.log(`[OTP] ${mobileNumber} -> ${code} (dev mock)`);

  return res.json({
    sent: true,
    mobileNumberMasked: maskMobile(mobileNumber),
    expiresInSeconds: Math.floor(OTP_TTL_MS / 1000),
    /** Included only for local/dev mock — remove when real SMS is wired. */
    devOtp: code,
    message: "OTP sent to your mobile number.",
  });
});

app.post("/api/channeling/public/auth/otp/verify", (req, res) => {
  purgeExpiredAuth();
  const mobileNumber = normalizeMobile(req.body?.mobileNumber);
  const code = String(req.body?.code ?? "").trim();

  if (!/^0\d{9}$/.test(mobileNumber)) {
    return res.status(400).json({
      message: "Enter a valid Sri Lankan mobile number (e.g. 0771234567).",
    });
  }
  if (!/^\d{4,8}$/.test(code)) {
    return res.status(400).json({ message: "Enter the OTP code sent to your phone." });
  }

  const challenge = otpChallenges.get(mobileNumber);
  if (!challenge || challenge.expiresAt <= Date.now()) {
    otpChallenges.delete(mobileNumber);
    return res.status(400).json({
      message: "OTP expired or not requested. Please request a new code.",
    });
  }

  challenge.attempts += 1;
  if (challenge.attempts > 5) {
    otpChallenges.delete(mobileNumber);
    return res.status(429).json({
      message: "Too many incorrect attempts. Request a new OTP.",
    });
  }

  if (challenge.code !== code && code !== DEV_OTP_CODE) {
    return res.status(401).json({ message: "Incorrect OTP. Please try again." });
  }

  otpChallenges.delete(mobileNumber);

  const profile = findPatientProfileByMobile(mobileNumber);
  const patient = profile ?? {
    registrationId: Number(mobileNumber.slice(-8)) || Date.now(),
    patientCode: `MOB-${mobileNumber.slice(-4)}`,
    fullName: "",
    mobileNumber,
  };

  const sessionToken = createToken("ps");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  const session = {
    sessionToken,
    expiresAt,
    mobileNumber,
    patient,
  };
  patientSessions.set(sessionToken, session);

  return res.json({
    verified: true,
    sessionToken,
    expiresAt,
    mobileNumberMasked: maskMobile(mobileNumber),
    patient: patient.fullName
      ? patient
      : {
          ...patient,
          fullName: "Verified patient",
        },
    profileFound: Boolean(profile?.fullName),
    message: profile?.fullName
      ? "Signed in. Your details will autofill on the next booking."
      : "Mobile verified. Complete your details for this booking.",
  });
});

app.get("/api/channeling/public/auth/session", (req, res) => {
  purgeExpiredAuth();
  const token = String(req.query.token ?? req.headers["x-patient-session"] ?? "").trim();
  if (!token) {
    return res.status(401).json({ message: "Session token is required." });
  }

  const session = patientSessions.get(token);
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
    patientSessions.delete(token);
    return res.status(401).json({ message: "Session expired. Please sign in again." });
  }

  return res.json({
    sessionToken: session.sessionToken,
    expiresAt: session.expiresAt,
    mobileNumberMasked: maskMobile(session.mobileNumber),
    patient: session.patient,
  });
});

app.post("/api/channeling/public/auth/logout", (req, res) => {
  const token = String(req.body?.sessionToken ?? "").trim();
  if (token) patientSessions.delete(token);
  return res.json({ signedOut: true });
});

app.post("/api/channeling/public/bookings/resend-sms", (req, res) => {
  const bookingReference = String(req.body?.bookingReference ?? "").trim();
  const mobileNumber = String(req.body?.mobileNumber ?? "").trim();

  if (!bookingReference || !mobileNumber) {
    return res.status(400).json({
      message: "Booking reference and phone number are required.",
    });
  }

  const booking = findPublicBooking(bookingReference, mobileNumber);
  if (!booking) {
    return res.status(404).json({
      message:
        "No matching booking found. Check your reference number and the phone used at booking.",
    });
  }

  const digits = normalizeMobile(booking.mobileNumber);
  if (!/^0\d{9}$/.test(digits)) {
    return res.status(400).json({
      message:
        "Please use the local phone number entered under patient's details. This feature is not available for foreign numbers.",
    });
  }

  return res.json({
    sent: true,
    bookingReference: normalizeBookingReference(booking.bookingReference),
    mobileNumberMasked: maskMobile(digits),
    message: "Booking confirmation SMS has been resent to the registered mobile number.",
  });
});

app.get("/api/channeling/holds", (req, res) => {
  const sessionId = req.query.sessionId ? Number(req.query.sessionId) : null;
  return res.json({ holds: listHolds(sessionId) });
});

app.post("/api/channeling/holds/reserve", (req, res) => {
  try {
    const channelSlotId = Number(req.body?.channelSlotId);
    const sessionId = Number(req.body?.sessionId);
    if (!Number.isFinite(channelSlotId) || channelSlotId <= 0) {
      return res.status(400).json({ message: "Valid channelSlotId is required." });
    }
    if (!Number.isFinite(sessionId) || sessionId <= 0) {
      return res.status(400).json({ message: "Valid sessionId is required." });
    }
    const reserved = reserveHold({
      channelSlotId,
      sessionId,
      holdToken:
        typeof req.body?.holdToken === "string" ? req.body.holdToken.trim() : "",
      durationSeconds: req.body?.durationSeconds,
      slotTime:
        typeof req.body?.slotTime === "string" ? req.body.slotTime : "",
    });
    return res.json(reserved);
  } catch (err) {
    return res.status(Number(err.status) || 500).json({
      message: err.message || "Hold request failed.",
      code: err.code,
      expiresAt: err.expiresAt,
    });
  }
});

app.post("/api/channeling/holds/release", (req, res) => {
  try {
    const channelSlotId = Number(req.body?.channelSlotId);
    const holdToken =
      typeof req.body?.holdToken === "string" ? req.body.holdToken.trim() : "";
    if (!Number.isFinite(channelSlotId) || channelSlotId <= 0 || !holdToken) {
      return res.status(400).json({
        message: "channelSlotId and holdToken are required.",
      });
    }
    return res.json(
      releaseHold({
        channelSlotId,
        holdToken,
        slotTime:
          typeof req.body?.slotTime === "string" ? req.body.slotTime : "",
        sessionId: Number(req.body?.sessionId) || null,
      }),
    );
  } catch (err) {
    return res.status(Number(err.status) || 500).json({
      message: err.message || "Hold release failed.",
    });
  }
});

app.listen(PORT, () => {
  ensureDataFile();
  ensureRmoBookingsFile();
  console.log(`PremierCare Reviews API listening on http://localhost:${PORT}`);
});
