# UI_RESTORE.md — Preplanning Logic Reattachment Reference

This file documents all real DB-backed logic that existed in the **current repo** before the Preplanning UI restore was performed. The UI has been replaced with the exact old-repo version (local mock state only). The logic below needs to be reattached to the restored UI in a future pass.

---

## What changed in the restore

| File | Before restore | After restore |
|------|---------------|---------------|
| `src/components/preplanning/PreplanningShell.tsx` | DB-connected (real flights, transports, lodgings, checklist, notes) | Exact old-repo copy — all local mock state |
| `src/app/app/trips/[tripId]/preplanning/page.tsx` | Full DB fetch, 11 server action props | Auth guard only, passes `transportModes: ["fly", "drive"]` |

Files **not changed** (preserved for reattachment):
- `src/app/app/trips/[tripId]/preplanning/actions.ts`
- `src/lib/preplanning/queries.ts`

---

## Current DB schema (relevant columns)

### `trips` table
| Column | Type | Purpose |
|--------|------|---------|
| `preplanChecklist` | `jsonb` | Array of `{ id, text, checked }` items — pre-departure checklist |
| `preplanNotes` | `text` | Group/trip notes freetext pad |
| `preplanNotesUpdatedBy` | `uuid` → `users.id` | Who last saved notes |
| `preplanNotesUpdatedAt` | `timestamp` | When notes were last saved |

### `tripFlights` table
Full schema via `src/lib/db/schema.ts`. Key fields:
`id, tripId, airline, flightNumber, confirmationCode, fromAirport, toAirport, departureDate, departureTime, bookingUrl, notes, addedById, deletedAt`

### `tripTransports` table
Key fields:
`id, tripId, type (rental_car|train|bus|shuttle|ferry|other), provider, confirmationCode, pickupLocation, dropoffLocation, pickupDate, pickupTime, bookingUrl, notes, addedById, deletedAt`

### `lodgings` table
Key fields:
`id, tripId, name, address, checkInDate, checkOutDate, confirmationNumber, bookingUrl, notes, addedById, deletedAt`

Note: Old UI has additional lodging fields not in DB — `city`, `checkInTime`, `checkOutTime`, `costPerNight`, `roomType`, `type (AccommodationType)`. These are local-state only in the restored UI and will need DB columns added if they need to persist.

---

## Server actions (in `actions.ts`)

All actions are in `src/app/app/trips/[tripId]/preplanning/actions.ts`.
All require `requireUser()` + `isTripMember()` + `!isTripVaulted()` guards.

### Flights
| Action | Signature | What it does |
|--------|-----------|-------------|
| `createFlightAction(tripId, prev, formData)` | `FlightFormState` | Inserts into `tripFlights` |
| `updateFlightAction(tripId, prev, formData)` | `FlightFormState` | Updates by id in `tripFlights` |
| `deleteFlightAction(tripId, formData)` | `void` | Soft-deletes (`deletedAt`) in `tripFlights` |

FormData fields: `airline, flightNumber, confirmationCode, fromAirport, toAirport, departureDate, departureTime, bookingUrl, notes`

**Note:** Old UI Flight model has `fromCity, toCity, arriveDate, arriveTime, seatClass` — these fields do **not** exist in DB. They are local-state only.

### Transport
| Action | Signature | What it does |
|--------|-----------|-------------|
| `createTransportAction(tripId, prev, formData)` | `TransportFormState` | Inserts into `tripTransports` |
| `updateTransportAction(tripId, prev, formData)` | `TransportFormState` | Updates by id in `tripTransports` |
| `deleteTransportAction(tripId, formData)` | `void` | Soft-deletes in `tripTransports` |

FormData fields: `type, provider, confirmationCode, pickupLocation, dropoffLocation, pickupDate, pickupTime, bookingUrl, notes`

Valid `type` values: `rental_car | train | bus | shuttle | ferry | other`

**Note:** Old UI Driving model has rich fields (`fromCity, toCity, estimatedHours, stops[], rentalCar bool, carDetails, rentalCost, rentalDays`) not in DB. DB transport is more generic.

### Lodging
| Action | Signature | What it does |
|--------|-----------|-------------|
| `createLodgingAction(tripId, prev, formData)` | `LodgingFormState` | Inserts into `lodgings` |
| `updateLodgingAction(tripId, prev, formData)` | `LodgingFormState` | Updates by id |
| `deleteLodgingAction(tripId, formData)` | `void` | Soft-deletes |

FormData fields: `name (required), address, checkInDate, checkOutDate, confirmationNumber, bookingUrl, notes`

### Checklist
| Action | Signature | What it does |
|--------|-----------|-------------|
| `updateChecklistAction(tripId, items)` | `ChecklistFormState` | Writes full `ChecklistItem[]` to `trips.preplanChecklist` JSONB |

`ChecklistItem` type: `{ id: string; text: string; checked: boolean }`

**Note:** Old UI pre-departure has `category` field per task. DB stores plain `{ id, text, checked }` with no category. Category needs to be added to the JSONB type or stored separately.

### Trip Notes
| Action | Signature | What it does |
|--------|-----------|-------------|
| `updateTripNotesAction(tripId, prev, formData)` | `TripNotesFormState` | Saves to `trips.preplanNotes`, records `preplanNotesUpdatedBy/At` |

FormData field: `notes`

**Note:** Old UI has Group Notes in the Vibe section — a simple textarea wired to local state. This is the field that maps to `preplanNotes`.

---

## Queries (in `queries.ts`)

File: `src/lib/preplanning/queries.ts`

| Function | Returns | Used for |
|----------|---------|---------|
| `listFlights(tripId)` | `TripFlight[]` | All non-deleted flights for trip |
| `listTransports(tripId)` | `TripTransport[]` | All non-deleted transports for trip |
| `listLodgings(tripId)` | `Lodging[]` | All non-deleted lodgings for trip |

---

## Old page.tsx — what it fetched

Before restore, `page.tsx` fetched and passed:

```
members        — from tripMembers JOIN users (userId, name, role, joinedAt)
isOrganizer    — from isTripOrganizer()
inviteCount    — count of non-revoked/non-deleted invites
flights        — listFlights(tripId)
transports     — listTransports(tripId)
lodgings       — listLodgings(tripId)
tripNotes      — trip.preplanNotes ?? ""
notesMeta      — { updatedAt, updatedByName }
initialChecklist — trip.preplanChecklist as ChecklistItem[]
```

Plus 11 bound server actions:
`createFlightAction, updateFlightAction, deleteFlightAction`
`createTransportAction, updateTransportAction, deleteTransportAction`
`createStayAction, updateStayAction, deleteStayAction`
`updateNotesAction, updateChecklistAction`

---

## Reattachment priority order (suggested)

When logic is reattached to the restored UI, suggested order:

1. **Group section** — wire `members`, `isOrganizer`, `inviteCount` (replaces mock traveler array)
2. **Pre-departure checklist** — wire `initialChecklist` + `updateChecklistAction` (most complete DB overlap; just needs category added to JSONB)
3. **Trip Notes / Group Notes (Vibe section)** — wire `tripNotes` + `updateTripNotesAction` (direct 1:1 mapping)
4. **Flights** — wire `flights` + flight CRUD actions (note: missing `fromCity, toCity, arriveDate, arriveTime, seatClass` from DB)
5. **Lodging** — wire `lodgings` + lodging CRUD actions (note: missing `city, checkInTime, checkOutTime, costPerNight, roomType, type`)
6. **Transport/Driving** — wire `transports` + transport CRUD actions (note: major model mismatch — old UI has rich driving model, DB has generic transport)
7. **Budget** — needs JSONB column or separate table; currently no DB backing
8. **Destinations** — needs DB table; currently no DB backing
9. **Documents** — needs DB table; currently no DB backing
10. **Vibe** — needs DB column (JSONB on trips or separate table); currently no DB backing
