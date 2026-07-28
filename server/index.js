import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

app.listen(PORT, () => {
  ensureDataFile();
  ensureRmoBookingsFile();
  console.log(`PremierCare Reviews API listening on http://localhost:${PORT}`);
});
