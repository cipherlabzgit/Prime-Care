# ERP Reception Desk API

Reception-facing endpoints for the first step after a patient books online.

Base URL: `{CHANNELING_API_ORIGIN}` (e.g. `http://localhost:7000`)

---

## End-to-end workflow

```text
Patient books on web (new patient)
  → rmoStatus: WebBooked

Patient arrives at center → Reception desk
  → search booking (ref / mobile / NIC)
  → PATCH check-in → ArrivedAtReception

Reception verifies profile → assigns to RMO
  → PATCH assign-rmo → AssignedToRmo

RMO Intake queue (see erp-rmo-api.md)
  → case taking → ReadyForDoctor
```

Existing patients skip RMO. Reception may still search their booking for directions, but no RMO assignment is required.

---

## GET `/api/channeling/reception/bookings/lookup`

Search bookings when the patient arrives at Reception.

### Query parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `bookingReference` | No* | e.g. `CH-2026-000134` |
| `mobileNumber` | No* | Sri Lankan mobile |
| `nic` | No* | NIC or passport |
| `sessionDate` | No | Filter by appointment date |
| `centerName` | No | Filter by center |

\* At least one of `bookingReference`, `mobileNumber`, or `nic` is required.

### Response `200`

Array of booking objects (same shape as RMO booking). Includes bookings in any active status.

### Errors

| Status | When |
|--------|------|
| `400` | No lookup parameter provided |
| `404` | No matching bookings |

---

## GET `/api/channeling/reception/bookings/:bookingId`

Fetch a single booking for the Reception profile view.

---

## PATCH `/api/channeling/reception/bookings/:bookingId/check-in`

Mark the patient as arrived at Reception.

### Preconditions

- `rmoStatus` must be `WebBooked`

### Response `200`

```json
{
  "message": "Patient checked in at Reception.",
  "booking": {
    "rmoStatus": "ArrivedAtReception",
    "arrivedAt": "2026-07-23T14:10:00.000Z"
  }
}
```

### Errors

| Status | When |
|--------|------|
| `400` | Booking is not awaiting check-in |
| `404` | Booking not found |

---

## PATCH `/api/channeling/reception/bookings/:bookingId/assign-rmo`

Send a new patient to the RMO intake queue.

### Preconditions

- `requiresRmoCaseTaking: true`
- `rmoStatus` must be `ArrivedAtReception`

### Response `200`

```json
{
  "message": "Patient assigned to RMO. They will appear in the RMO intake queue.",
  "booking": {
    "rmoStatus": "AssignedToRmo",
    "assignedToRmoAt": "2026-07-23T14:12:00.000Z"
  }
}
```

### Errors

| Status | When |
|--------|------|
| `400` | Patient not checked in, or booking does not require RMO |
| `404` | Booking not found |

---

## Booking status reference

| Status | Meaning |
|--------|---------|
| `WebBooked` | Online booking confirmed; patient not yet at center |
| `ArrivedAtReception` | Reception checked patient in |
| `AssignedToRmo` | Reception sent patient to RMO queue |
| `RmoInProgress` | RMO case taking underway |
| `ReadyForDoctor` | Case taking complete; doctor queue |

---

## Web patient instructions

PremierCare-Web shows new patients:

1. **Report to Reception desk** — arrive by `recommendedArrivalTime`
2. **RMO case taking** — ~15 minutes (after Reception assigns)
3. **Doctor appointment** — booked slot time

---

## Local development mock

Proxied at `/api/channeling/reception` → reviews server (`http://localhost:7001`).

Staff UI: `/channeling/reception`

Seed data: `server/data/rmo-bookings.seed.json`

If you already have `server/data/rmo-bookings.json`, delete it to reload the seed.
