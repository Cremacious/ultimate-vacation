# State Model

This document turns the app logic into concrete product state rules. It defines the core trip object shape, the lifecycle and readiness model, and how the app should compute the recommended phase and next best action.

## Goal

The app should know:

- what state a trip is in
- how ready the trip is
- what phase deserves attention now
- what action best reduces risk right now
- how complete the preplanning is (drives the trip ball fill)

## 1. Core Trip Object Shape

This is a product-facing model, not a final database schema.

### Setup vs Preplanning — the core distinction

**Setup** captures the high-level skeleton of the trip. It answers: what is this trip, when, where, who, and roughly how are we getting there. Setup should take 5 minutes. Every field is broad and high-level. No booking references, no flight times, no confirmation numbers.

**Preplanning** captures all the small details that make the trip actually work. It is dynamically scaffolded by the choices made in Setup — the sections shown to the user and the questions asked are determined by what was entered in Setup. A user who selected Flying + Driving will see flight detail sections and car rental sections. A domestic trip will not be asked about visas. A solo trip skips group composition. All fields in preplanning are optional so power planners can go deep while casual planners are never overwhelmed.

---

### Trip (Setup fields only)

These are the fields collected during Setup. They define the trip identity.

- `id`
- `ownerUserId`
- `name`
- `startDate`
- `endDate`
- `status`
- `recommendedPhase`
- `tripType` (beach, city, adventure, road trip, family, romantic, group, honeymoon, etc.)
- `tripVibe` (relaxed, packed, spontaneous, structured)
- `transportModes` (array — user selects one or more: fly, drive, train, cruise. Multiple allowed e.g. fly + drive)
- `travelerCount`
- `inviteMode` (private, invite_only, public_link)
- `isPremiumTrip` (organizer has premium unlock)
- `readinessScore`
- `ballColor` (user-selected from brand palette or custom hex — core trip personalization)
- `budgetTarget` (numeric amount, optional)
- `budgetCurrency` (ISO 4217 currency code, e.g. USD, EUR, JPY)
- `budgetType` (total or per_person)
- `createdAt`
- `updatedAt`

### TripDestination (Setup)

A trip has one or more destinations. Destinations are ordered and define the route at a high level.

- `id`
- `tripId`
- `order` (integer, 1-based)
- `city`
- `country`
- `arrivalDate` (optional at setup, can be added in preplanning)
- `departureDate` (optional at setup, can be added in preplanning)

The first destination's arrival date and the last destination's departure date drive the trip start/end dates. Intermediate destinations represent a multi-city trip.

---

### Preplanning — detailed data models

All preplanning data is optional. Sections are surfaced dynamically based on Setup choices.

### TransportDetail (Preplanning — one per transport mode selected in Setup)

Each mode selected in Setup gets its own detailed section in Preplanning.

#### Flying detail

- `id`, `tripId`
- One or more `FlightLeg` entries (outbound, return, and any connections or separate flights during the trip)

Each `FlightLeg`:
- `originAirportCode` (IATA, e.g. SRQ)
- `originAirportName` (optional)
- `destinationAirportCode` (IATA, e.g. FRA)
- `destinationAirportName` (optional)
- `departureDate`, `departureTime`
- `arrivalDate`, `arrivalTime`
- `flightNumber` (optional, e.g. LH 401)
- `airline` (optional)
- `confirmationRef` (optional)
- `seatClass` (economy, premium_economy, business, first)
- `isConnection` (boolean)
- `notes` (optional)

Airport transfer notes (how getting to/from each airport) stored as free text per leg.

#### Driving detail

- `id`, `tripId`
- `isCarRental` (boolean)
- `rentalCompany` (optional)
- `rentalConfirmationRef` (optional)
- `rentalPickupLocation` (optional)
- `rentalPickupDate`, `rentalPickupTime` (optional)
- `rentalReturnLocation` (optional)
- `rentalReturnDate`, `rentalReturnTime` (optional)
- `estimatedTotalDriveHours` (optional)
- `keyStops` (array of location strings — waypoints, optional)
- `notes` (optional)

#### Train detail

- `id`, `tripId`
- One or more `TrainLeg` entries

Each `TrainLeg`:
- `originStation`, `destinationStation`
- `departureDate`, `departureTime`
- `arrivalDate`, `arrivalTime`
- `trainNumber` (optional)
- `serviceLabel` (optional, e.g. Shinkansen Nozomi)
- `confirmationRef` (optional)
- `seatClass` (optional)
- `notes` (optional)

Rail pass (if used):
- `railPassUsed` (boolean)
- `railPassName` (optional)
- `railPassConfirmationRef` (optional)

#### Cruise detail

- `id`, `tripId`
- `cruiseLine`
- `shipName` (optional)
- `portOfEmbarkation`, `embarkationDate`, `embarkationTime`
- `portOfDisembarkation`, `disembarkationDate`, `disembarkationTime`
- `cabinNumber` (optional)
- `cabinClass` (optional)
- `confirmationRef` (optional)
- `notes` (optional)

---

### LodgingEntry (Preplanning — one per place stayed)

Shown in Preplanning regardless of transport mode. Number of suggested entries is informed by the number of destinations in Setup.

- `id`
- `tripId`
- `order` (integer, 1-based for display)
- `propertyName`
- `type` (hotel, airbnb, hostel, resort, camping, vacation_rental, friends_family, other)
- `city`
- `address` (optional)
- `checkInDate`, `checkInTime` (optional)
- `checkOutDate`, `checkOutTime` (optional)
- `confirmationRef` (optional)
- `contactNumber` (optional)
- `notes` (optional)

---

### GroupMember (Preplanning — one per traveler)

Shown when `travelerCount > 1`. Number of entries matches `travelerCount` from Setup.

- `id`
- `tripId`
- `userId` (nullable — may not be a registered user yet)
- `displayName`
- `dietaryNeeds` (array of tags: vegetarian, vegan, gluten-free, halal, kosher, nut allergy, shellfish allergy, other)
- `mobilityNeeds` (free text, optional)
- `medicalNotes` (free text, private to organizer, optional)
- `emergencyContactName` (optional)
- `emergencyContactPhone` (optional)
- `emergencyContactRelation` (optional)

---

### DestinationDetail (Preplanning — one per TripDestination)

Shown for each destination added in Setup.

- `id`
- `tripId`
- `destinationId` (links to TripDestination)
- `timezone` (optional, IANA timezone string)
- `localCurrency` (optional, ISO 4217)
- `languageNotes` (optional)
- `visaRequired` (boolean, nullable — null means not yet checked)
- `visaNotes` (optional)
- `healthEntryRequirements` (optional — vaccinations, tests, etc.)
- `powerAdapterNeeded` (boolean, nullable)
- `adapterType` (optional)
- `drivingRules` (optional — road side, speed units, IDP required)
- `emergencyNumbers` (optional — local police, hospital, embassy)
- `seasonalWarnings` (optional — weather risks, closures, peak season notes)
- `localHolidayNotes` (optional)

Shown only for international trips: visa, health entry, adapter, emergency numbers, embassy.
Shown only for driving trips: driving rules, IDP.

---

### DocumentEntry (Preplanning — one per traveler per document type)

- `id`
- `tripId`
- `travelerId` (links to GroupMember)
- `type` (passport, visa, travel_insurance, vaccination_record, international_driving_permit, other)
- `expiryDate` (optional)
- `notes` (optional — reference numbers, issuing country, etc.)

---

### PreDepartureItem (Preplanning — checklist of home logistics)

Shown when trip is more than a few days and/or trip type suggests it (family trips, longer trips).

Examples of items surfaced:
- Airport parking or transport to airport arranged
- House sitter / key left with neighbour
- Pet care arranged
- Mail hold requested
- Plants watered / arranged
- Out-of-office set
- Medication supply checked (shown when medical needs flagged)
- School absence arranged (shown when children flagged in group)
- Car maintenance checked (shown when driving mode selected)

### Preplanning completeness fields

These track section-level completion and drive the trip ball fill percentage.

- `preplanningTransportComplete` (only counted if transport modes were selected in Setup)
- `preplanningAccommodationComplete`
- `preplanningGroupCompositionComplete` (only counted if travelerCount > 1)
- `preplanningBudgetComplete`
- `preplanningDestinationInfoComplete`
- `preplanningDocumentsComplete` (only counted for international trips)
- `preplanningPreDepartureComplete`
- `preplanningCompletionPct` (computed 0–100)

### Dynamic preplanning section rules

Sections are shown or hidden based on Setup choices. Hidden sections are excluded from the completion denominator entirely.

| Section | Shown when |
|---|---|
| Transport — Flying details | fly selected in transportModes |
| Transport — Driving details | drive selected in transportModes |
| Transport — Train details | train selected in transportModes |
| Transport — Cruise details | cruise selected in transportModes |
| Lodging | always shown |
| Group composition | travelerCount > 1 |
| Budget breakdown | budgetTarget set in Setup |
| Destination info | always shown |
| Visa and health entry | destination country is international (not home country) |
| Power adapter | destination country uses different plug/voltage |
| Driving rules and IDP | drive selected in transportModes |
| Documents | always shown |
| Pre-departure logistics | always shown |
| Medication reminder | medical needs flagged in group composition |
| Pet/house logistics | trip length >= 3 days (suggested, not forced) |
| School absence | children flagged in group composition |

### Trip readiness support fields

- `setupComplete`
- `preplanningComplete`
- `itineraryCoverageLevel`
- `packingCoverageLevel`
- `travelDayCoverageLevel`
- `expenseTrackingEnabled`
- `hasOutstandingSettlement`

### Suggested supporting enums

#### Trip status

- `draft`
- `planning`
- `ready`
- `in_progress`
- `completed`
- `archived`

#### Recommended phase

- `setup`
- `preplanning`
- `itinerary`
- `packing`
- `travel_day`
- `vacation_day`
- `expenses`
- `wrap_up`

#### Coverage level

- `none`
- `partial`
- `good`
- `complete`

## 2. Minimum Setup Requirements

The trip should count as setup-complete only when these fields exist:

- trip name
- at least one destination (city required)
- start date and end date
- travelerCount >= 1
- at least one transport mode selected

Optional but shown in Setup form and encouraged:

- additional destinations (for multi-city trips)
- trip type and vibe
- ball color (defaults to brand cyan if not set)
- budget target, currency, and type

Everything else (flight numbers, lodging details, group member info, documents, etc.) belongs in Preplanning and is never required for setup-complete status.

## 3. Trip Status Rules

### Draft

Stay in `draft` when setup is incomplete.

### Planning

Move to `planning` when setup is complete but the trip is not yet ready for execution.

### Ready

Move to `ready` when:

- setup is complete
- departure is near enough to require execution focus, or planning essentials are adequately covered
- the trip has at least partial itinerary
- the trip has at least partial packing support
- the departure travel day is at least partially modeled

### In Progress

Move to `in_progress` when:

- today is between trip start and trip end inclusive

### Completed

Move to `completed` when:

- trip end date has passed
- but the trip is still visible for settlement and wrap-up

### Archived

Move to `archived` only by explicit user action or later automation.

## 4. Readiness Model

Readiness should not be all-or-nothing. It should be a composited measure used for UX guidance.

## Readiness dimensions

- setup readiness
- itinerary readiness
- packing readiness
- travel-day readiness
- collaboration readiness
- financial readiness

### Suggested scoring model

Not final, but good enough for MVP logic planning:

- setup: 0 to 25 points
- itinerary: 0 to 20 points
- packing: 0 to 15 points
- travel day: 0 to 20 points
- collaboration: 0 to 10 points
- finance: 0 to 10 points

Total:

- `0-34`: fragile
- `35-64`: getting there
- `65-84`: ready-ish
- `85-100`: locked in

### Why a score matters

The score should not become a vanity number. It should support:

- trip ball fill and animation state
- health/status cards
- blocker highlighting
- smart nudges
- premium upsell moments later

## 5. Trip Ball State Model

The trip ball is the visual representation of the trip's health and progress. Its state should be computed from the trip object.

### Ball fill rules

Ball fill (0–100%) is driven by `preplanningCompletionPct` until preplanning is complete, then by overall readiness score.

| Preplanning pct | Ball state |
|---|---|
| 0% | Empty — dotted outline only |
| 1–49% | Partial fill — preplanning in progress |
| 50–89% | Mostly filled — strong progress |
| 90–100% | Full — preplanning complete |

### Ball animation state rules

| Trip state | Ball animation |
|---|---|
| new trip, no data | Calm, expectant, dotted outline |
| preplanning in progress | Slow ocean-wave pulse |
| preplanning complete | Bouncy, confident, full fill |
| blocker present | Subtle agitation micro-animation |
| milestone hit | Brief celebration burst |
| travel day active | Alert, faster pulse rhythm |
| on vacation | Slow, warm, relaxed pulse |
| trip completed | Soft nostalgic fade |
| archived | Dimmed, still |

### Ball color

`ballColor` is user-set per trip. Default colors are drawn from the brand palette. Users can recolor at any time from trip settings.

## 6. Recommended Phase Rules

The app should compute one recommended phase for the workspace header and the main call to action.

### Phase priority order

When multiple phases could apply, use this priority:

1. `travel_day`
2. `setup`
3. `wrap_up`
4. `expenses`
5. `vacation_day`
6. `packing`
7. `preplanning`
8. `itinerary`

### Rules

#### Recommend `travel_day` when:

- there is an active travel day today
- or departure is tomorrow and travel-day setup is weak

#### Recommend `setup` when:

- minimum setup is incomplete

#### Recommend `wrap_up` when:

- trip is completed
- and there are wrap-up tasks or unresolved settlement

#### Recommend `expenses` when:

- there are unresolved balances
- budget overages
- or the user is explicitly working in finance tasks

#### Recommend `vacation_day` when:

- trip is in progress
- and there is no current travel-day flow active

#### Recommend `packing` when:

- departure is close
- and packing coverage is still partial or none

#### Recommend `preplanning` when:

- preplanning questions remain unresolved
- especially for transport, mobility, special needs, or long-drive logistics

#### Recommend `itinerary` when:

- the trip still lacks meaningful schedule structure

## 7. Next Best Action Model

Each trip should surface:

- one `primaryAction`
- up to three `secondaryActions`
- a list of `blockers`

## Action categories

- setup
- invite
- preplanning
- itinerary
- packing
- travel_day
- vacation_day
- expenses
- premium_upgrade

## Risk-first action ranking

The app should prioritize tasks by consequence.

### Example ranking logic

#### Highest urgency

- no travel-day plan and departure is tomorrow
- no required travel docs captured and departure is imminent
- unresolved active-day tasks during travel day

#### High urgency

- trip setup incomplete
- no itinerary anchor events close to departure
- no packing list close to departure

#### Medium urgency

- no invite sent yet
- no group schedule refinement
- unresolved poll tied to important event choice

#### Lower urgency

- optional optimization tasks
- polish actions
- upsell prompts

## 8. MVP Blocker Rules

Blockers should be explicit and scary in a helpful way.

### Candidate blockers

- missing dates
- no destination set
- no departure travel day
- no itinerary anchor for a multi-day trip
- unresolved settlement after trip

## 9. Example Logic Scenarios

### Scenario A: newly created trip

- status: `draft`
- recommended phase: `setup`
- primary action: `Add dates and destination`
- ball: empty dotted outline

### Scenario B: trip is three weeks away with no travel details

- status: `planning`
- recommended phase: `preplanning`
- primary action: `Answer travel planning questions`
- ball: partial fill, slow pulse

### Scenario C: trip is five days away, itinerary exists, no packing list

- status: `planning`
- recommended phase: `packing`
- primary action: `Create packing list`
- ball: mostly full, slightly faster pulse

### Scenario D: departure is tomorrow, no travel-day checklist

- status: `ready`
- recommended phase: `travel_day`
- primary action: `Build departure checklist`
- ball: full, alert state

### Scenario E: trip is live

- status: `in_progress`
- recommended phase: `vacation_day` or `travel_day`
- primary action: `Review today's schedule`
- ball: warm relaxed pulse

### Scenario F: trip ended yesterday with unresolved expenses

- status: `completed`
- recommended phase: `wrap_up`
- primary action: `Settle shared expenses`
- ball: soft nostalgic fade

## 10. Suggested MVP Defaults

- compute status automatically when possible
- allow manual navigation across phases
- visually emphasize only one recommended phase
- allow organizer override later, not necessarily in v1
- preplanning completion percentage drives ball fill
- ball color defaults to brand palette, user can change anytime

## 11. Expense State Model

Expenses are tracked from day 0 (preplanning) through trip end and into wrap-up.

### Expense object shape

- `id`
- `tripId`
- `description`
- `amount`
- `currency`
- `date`
- `category`
- `payerUserId`
- `relatedEventId` (nullable — links to calendar event if entered from there)
- `includeInDefaultReport` (default true)
- `splits` (array of user IDs and amounts)
- `settlementStatus` per split (pending, payer_marked, payee_marked, settled)
- `createdAt`

### Settlement status rules

A split is settled when:

- the user who owes has marked their side as paid
- AND the user who is owed has marked they received payment

Marking is independent — both parties confirm in the app. Settlement happens outside the app.

## 12. Open State Model Questions

- Should `ready` be time-based, completeness-based, or both?
- Should readiness score be user-visible from day one?
- Should a trip ever regress from `ready` to `planning` if critical data is removed?
- How many unresolved blockers should appear before the UI feels scolding?
- Should the trip ball be visible only to the organizer or all participants?
- Should preplanning completion be visible as a number, a label, or only through the ball?
