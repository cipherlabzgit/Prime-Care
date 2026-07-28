# ERP RMO Case Taking API

RMO Intake endpoints after Reception assigns a new patient.

Base URL: `{CHANNELING_API_ORIGIN}` (e.g. `http://localhost:7000`)

All times use 24-hour `HH:mm` format. Dates use ISO `YYYY-MM-DD`.

See also: [Reception Desk API](./erp-reception-api.md)

---

## Booking lifecycle

```text
Web checkout (new patient)
  → rmoStatus: WebBooked

Reception check-in
  → ArrivedAtReception

Reception assign to RMO
  → AssignedToRmo

RMO intake queue
  → RmoInProgress (optional save)

Case taking PATCH (complete: true)
  → ReadyForDoctor
  → new patient registration created
```

Existing patients (`existingPatientRegistrationId` present) skip RMO.

RMO staff should only intake patients with status `AssignedToRmo` or `RmoInProgress`.

---

## GET `/api/channeling/rmo/bookings/lookup`

Optional fallback search for RMO staff. Prefer the assigned queue (`/today`).

Find bookings by reference, mobile, or NIC.

### Query parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `bookingReference` | No* | e.g. `CH-2026-000133` |
| `mobileNumber` | No* | Sri Lankan mobile |
| `nic` | No* | NIC or passport |
| `sessionDate` | No | Filter by appointment date (`YYYY-MM-DD`) |
| `centerName` | No | Filter by medical center |

\* At least one of `bookingReference`, `mobileNumber`, or `nic` is required.

### Response `200`

```json
[
  {
    "bookingId": 133,
    "bookingReference": "CH-2026-000133",
    "patientType": "NEW",
    "requiresRmoCaseTaking": true,
    "rmoStatus": "PendingRmo",
    "fullName": "John Doe",
    "mobileNumber": "0771234567",
    "nicOrPassport": "200012345678",
    "email": "john@example.com",
    "notes": "",
    "sessionDate": "2026-07-25",
    "doctorAppointmentTime": "20:15",
    "recommendedArrivalTime": "19:55",
    "rmoCaseTakingMinutes": 15,
    "doctorName": "Ms. Nihara Savindi",
    "specialization": "Internal Medicine",
    "centerName": "Center Q",
    "roomCode": "q001",
    "consultationFee": 5000,
    "existingPatientRegistrationId": null,
    "newPatientRegistrationId": null,
    "rmoCompletedAt": null,
    "caseTakingNotes": null
  }
]
```

### Errors

| Status | When |
|--------|------|
| `400` | No lookup parameter provided |
| `404` | No matching bookings |

---

## GET `/api/channeling/rmo/bookings/today`

List patients **assigned from Reception** awaiting RMO intake for a given date (default: today).

### Query parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `sessionDate` | No | Defaults to server local date |
| `centerName` | No | Filter by center |

### Response `200`

Same array shape as lookup. Only bookings with:

- `requiresRmoCaseTaking: true`
- `rmoStatus` in `AssignedToRmo` or `RmoInProgress`

Ordered by `recommendedArrivalTime`, then `doctorAppointmentTime`.

---

## GET `/api/channeling/rmo/bookings/:bookingId`

Fetch a single booking for the case-taking form.

### Response `200`

Single `RmoBooking` object.

### Errors

| Status | When |
|--------|------|
| `404` | Booking not found |

---

## PATCH `/api/channeling/rmo/bookings/:bookingId/case-taking`

Update patient details during case taking and optionally mark complete.

### Request body

```json
{
  "fullName": "John Doe",
  "mobileNumber": "0771234567",
  "nicOrPassport": "200012345678",
  "email": "john@example.com",
  "caseTakingNotes": "BP 120/80. No allergies reported.",
  "complete": true
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `fullName` | No | Corrected legal name |
| `mobileNumber` | No | Corrected mobile |
| `nicOrPassport` | No | Corrected NIC/passport |
| `email` | No | Patient email |
| `caseTakingNotes` | No | RMO clinical / intake notes |
| `complete` | Yes | `false` = save draft / in progress; `true` = finish case taking |

### Response `200`

```json
{
  "message": "Case taking completed. Patient is ready for the doctor.",
  "newPatientRegistrationId": 1042,
  "booking": { }
}
```

When `complete: true`:

1. Set `rmoStatus` to `RmoComplete` (or `ReadyForDoctor`)
2. Set `rmoCompletedAt` to current timestamp
3. Create ERP patient registration for new patients; return `newPatientRegistrationId`
4. Doctor queue must only accept the patient after this step

When `complete: false`:

1. Set `rmoStatus` to `RmoInProgress` if currently `PendingRmo`
2. Persist editable fields and notes

### Errors

| Status | When |
|--------|------|
| `400` | Booking does not require RMO, or already completed |
| `404` | Booking not found |

---

## Web checkout integration

`POST /api/channeling/public/bookings/checkout` should persist and return:

```json
{
  "bookingReference": "CH-2026-000133",
  "requiresRmoCaseTaking": true,
  "rmoCaseTakingMinutes": 15,
  "doctorAppointmentTime": "20:15",
  "recommendedArrivalTime": "19:55"
}
```

Rules:

- `requiresRmoCaseTaking: true` when `existingPatientRegistrationId` is absent
- `recommendedArrivalTime = doctorAppointmentTime - rmoCaseTakingMinutes - buffer`

---

## Local development mock

PremierCare-Web includes a dev mock on the reviews server (`http://localhost:7001`) proxied at `/api/channeling/rmo` when `VITE_RMO_API_BASE` is unset.

Seed data: `server/data/rmo-bookings.seed.json`

Run:

```bash
npm run dev:reviews-api
npm run dev
```

Open: `/channeling/reception` (Reception) and `/channeling/rmo` (RMO Intake)
