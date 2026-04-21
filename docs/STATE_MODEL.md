# State Model

> **2026-04-21 Retention loop grill — 4-phase retention model + canonical dashboard + vanity quarantine**
>
> TripWave's retention is **four-phase episodic** for organizers, with participant retention dependent on the participant-to-organizer conversion rate (without which invitees are effectively single-session users).
>
> **Four phases and what "retained" means at each:**
>
> | Phase | Return trigger | "Retained" definition (per trip) | Primary mechanism |
> |---|---|---|---|
> | **Pre-trip** (creation → departure, ~1–12 weeks) | Dependency pressure — item to log / add / invite | Organizer opens app ≥3 times pre-departure AND ≥1 invitee opens pre-departure | Transactional emails on key state changes + in-app bell (intra-session only) |
> | **During-trip** (start date → end date) | In-moment expense logging + Travel Day checklist | ≥2 members log ≥1 expense each during the trip window | One-tap Add-Expense affordance on every in-trip surface; static Travel Day checklist |
> | **Post-trip** (end date → +30 days) | Settle balances | `trip_settled` within 30 days of `trip_end_date_reached` | Post-trip prompt + "Your turn?" CTA + unsettled-balance reminder |
> | **Next-trip** (+30 days → +12 months) | Organizer plans another trip, or participant creates their first | 90-day second-trip rate (organizer) + participant-to-organizer conversion rate (participant) | Muscle memory + "Duplicate past trip" CTA on Home |
>
> **Re-engagement constraint:** no push notifications, no marketing email. Re-engagement depends on (a) user remembering TripWave on their own, (b) transactional emails on user-requested state changes (see MONETIZATION.md § transactional email scope), and (c) the invite mechanism itself bringing dormant users back into trips.
>
> **The in-app bell is intra-session awareness, not a retention tool.** A notification the user never sees can't re-engage them. Docs referring to the bell as "retention" are corrected by this block.
>
> ---
>
> ### Canonical retention dashboard (6 metrics, PostHog primary view)
>
> | # | Metric | Definition | Year-1 target range |
> |---|---|---|---|
> | 1 | **Activation rate** | Weekly: `first_invite_accepted` / `signup_completed` | 40–60% |
> | 2 | **Trip completion rate** | Cohort: `trip_settled` / `first_invite_accepted`, activation-month cohorted | 50–70% |
> | 3 | **90-day second-trip rate** | Of users whose first trip settled, % who created a second trip within 90 days | 25–40% |
> | 4 | **Participant-to-organizer conversion rate** | Of users who participated in ≥1 settled trip, % who then created their own | **5–10% (committed launch target)** |
> | 5 | **Supporter conversion rate** | `supporter_purchased` within 30 days of post-trip prompt | 3–8% |
> | 6 | **Unsettled-trip rate** | Of trips past `trip_end_date_reached`, % NOT `trip_settled` within 30 days | <20% |
>
> **Cohort by launch month.** All six together tell the truth about retention. Any one alone can lie.
>
> ---
>
> ### Vanity metrics quarantined (not in primary dashboard view)
>
> The following metrics are **not retention signals** and must not drive decisions alone. Quarantined from the primary PostHog view:
>
> - **Sign-ups per week** — flatters acquisition; hides activation failure.
> - **Trips created** — counts solo-user trips that may never receive an invite.
> - **DAU / WAU / MAU** — structurally wrong for an episodic product.
> - **Expense count across all trips** — counts solo-logger trips that fail the moat threshold.
>
> These can appear on secondary activity pages for context only. **No retention decision is made on vanity metrics alone.**
>
> Full rationale: DECISIONS.md entry *2026-04-21 — Retention loop grill: 12 decisions locked.*

---

> **2026-04-21 Conversion loop grill — activation event + funnel events + retention framing**
>
> **Activation event:** `first_invite_accepted` — fires the moment a second authenticated member appears on a trip created by the organizer. Earliest event impossible to fake solo; proves the one thing TripWave cannot do for the user. **This is the leading indicator; the north-star metric below is unchanged.**
>
> **North-star metric (unchanged):** settled trips with ≥2 expense-logging members. Year-1 target: 1,000.
>
> **Retention framing — MAU/WAU is the wrong frame for this product.** TripWave is episodic. 22–28 friend-group organizers trip 2–4 times/year; between-trip gaps of 2–6 months are the product rhythm, not churn. Any doc section that measures success as MAU/WAU is a framing error and must be corrected at next revision. Success is settled trips per year per organizer.
>
> **PostHog funnel events (Public MVP canonical list):**
>
> | # | Event | Actor | Notes |
> |---|---|---|---|
> | 1 | `landing_page_visit` | anonymous | top-of-funnel |
> | 2 | `signup_completed` | new user | |
> | 3 | `trip_created` | organizer | |
> | 4 | `first_invite_sent` | organizer | |
> | 5 | **`first_invite_accepted`** | joining member | **activation event** |
> | 6 | `first_expense_logged` | any member | |
> | 7 | `two_member_expense_threshold` | derived | ≥2 unique members have logged at least one expense |
> | 8 | `trip_end_date_reached` | system | |
> | 9 | **`trip_settled`** | organizer | **north-star metric event** |
> | 10 | `post_trip_prompt_shown` | system | next app open after `trip_settled` |
> | 11 | `supporter_purchased` | converting user | |
> | 12 | `participant_becomes_organizer` | ex-participant | one-time per user, when a member creates their first own trip |
>
> **Supplementary events (not linear):**
>
> - `ad_impression_prompt_shown` — fires at 5th Home ad view, once per user
> - `affiliate_click` — Booking.com hotel chip tap on lodging itinerary items
> - `supporter_prompt_dismissed` — fires from any prompt surface; silences that surface only
>
> **Dashboard watch-points (funnel chasms to instrument):**
>
> - 2 → 5 — the activation chasm (sign-up to invite-accepted)
> - 5 → 7 — the moat-lock-in transition (one member → two loggers)
> - 7 → 9 — the completion chasm (locked-in trip → settled)
> - 9 → 11 — the conversion moment (settled → Supporter purchase)
>
> Full rationale: DECISIONS.md entry *2026-04-21 — Conversion loop grill: 12 decisions locked.*

---

This document defines the canonical trip lifecycle, state transitions, readiness computation, blocker taxonomy, and next-best-action algorithm for TripWave. Locked 2026-04-20 via the lifecycle grill (18 decisions). Any conflict with APP_STRUCTURE.md or UX_SPEC.md is resolved in favor of this document.

## Goal

The app should know:

- what state a trip is in (deterministic, computable from trip data + now)
- how ready the trip is (6-dimension composite score, 0-100)
- what phase deserves attention now (auto-computed)
- what action best reduces risk right now (one primary + up to three secondary)
- what blockers exist (exactly 7 defined types, no ad-hoc blockers)
- how complete preplanning is (drives the trip ball fill)

---

## 1. Canonical Lifecycle States

> **2026-04-21 Architecture & schema clarification — stored vs computed**
>
> The 8-state enum below (Draft/Planning/Ready/TravelDay/InProgress/Stale/Vaulted/Dreaming) is **computed at read time**, not persisted. Only a coarse `trips.lifecycle` column is stored, with three values (`active | vaulted | dreaming`) representing the user-durable transitions — the decisions a human action commits to.
>
> The full 8-state value is the return of `computeState(trip, now): TripState` in `src/lib/trip/state.ts`. Inputs: `trips.lifecycle`, `start_date`, `end_date`, itinerary event counts per day, preplan completeness, travel-leg dates derived from itinerary, `now()`. Every UI surface that renders trip state reads this function. **Nothing writes the 8-state enum to the database.**
>
> | Lifecycle (stored) | Possible computed states |
> |---|---|
> | `active` | Draft · Planning · Ready · TravelDay · InProgress · Stale |
> | `vaulted` | Vaulted |
> | `dreaming` | Dreaming |
>
> Indexing: `trips_lifecycle_idx` supports the one query that needs persisted state — *"give me all my active trips"* for the Home dashboard. The 8-state filter is applied in application code over the returned set.
>
> Why: an 8-state enum driven by `now()` can never be kept in sync by cron, user action, or DB trigger alone — they race, and a "trip shows as Ready at 6am on departure day" bug is unavoidable if any derived state is stored. Splitting the enum into durable-core + computed-detail eliminates the staleness class entirely while preserving the one index query that needs stored state.
>
> See DECISIONS.md entry *2026-04-21 — Architecture & schema sanity grill: 12 decisions locked* (Q2).

TripWave has **7 primary lifecycle states** for real trips plus **1 terminal state** for Dream Mode trips.

| State | Meaning |
|---|---|
| `Draft` | Trip created, setup incomplete |
| `Planning` | Setup complete, trip is not yet ready for execution |
| `Ready` | Trip meets the Ready threshold (preplanning + itinerary + travel-day or near departure) |
| `TravelDay` | A travel-leg date is active (departure day, accommodation change, or return day) |
| `InProgress` | Trip is live between travel legs (vacation days) |
| `Stale` | Trip end date has passed, not yet closed out by organizer |
| `Vaulted` | Trip closed out; rendered as Memory vault |
| `Dreaming` | Dream Mode trips only; terminal state, does not progress |

**Naming notes:** `Stale` is preferred over `Completed` because it captures the "you haven't closed this out" nuance. `Vaulted` is preferred over `Archived` because it matches the Memory Vault brand metaphor.

---

## 2. State Transitions

All transitions are deterministic: given a trip object and the current timestamp, the correct state is a pure function.

### Transition triggers

| From | To | Trigger | Classification |
|---|---|---|---|
| `Draft` | `Planning` | Setup complete: `name` + >=1 destination with city + `startDate` + `endDate` + `travelerCount >= 1` + >=1 `transportMode` | Auto-forward |
| `Planning` | `Draft` | Any required setup field is cleared | Auto-backward |
| `Planning` | `Ready` | **(preplanningCompletionPct >= 60 AND itinerary has >=1 anchor event AND travel-day has partial plan AND daysToDeparture <= 14)** OR **(daysToDeparture <= 2 AND setup complete)** | Auto-forward |
| `Ready` | `Planning` | **Not allowed.** If Ready conditions are broken, show warning banner but do not regress | — |
| `Ready` | `TravelDay` | Auto at **04:00 local time** on any travel-leg date. OR manual organizer "We're off early" | Auto-forward + manual |
| `TravelDay` | `InProgress` | Auto at **23:59 local time** end of the travel-leg day. OR manual user "We've arrived" | Auto-forward + manual |
| `InProgress` | `TravelDay` | Re-fires Ready to TravelDay rule for any subsequent travel-leg date | Auto-forward (cycle) |
| `InProgress` | `Stale` | Auto at **midnight local of `endDate` + 1 day** (24-hour grace) | Auto-forward |
| `Stale` | `Vaulted` | Manual via organizer "Close out trip". OR auto at **day 90 past `endDate`** if not closed | Manual + auto fallback |
| `Vaulted` | `Stale` | Manual via user "Reopen trip" (supports late-arriving receipts, etc.) | Manual only |
| `Planning` | `Dreaming` | Only if trip is flagged as Dream Mode at creation; one-way | Auto-forward |
| `Dreaming` | `Planning` | Manual via "Make it real" — converts to a regular trip, new dates required | Manual only |

### Anchor event definition

An **anchor event** (referenced in the Planning → Ready transition) is any itinerary item that meets all of the following:

- Category is **not** Note / Free time
- Has a **specific start time** set (not all-day, not time-unset)
- Belongs to a real calendar day (not a date-less numbered day)

In practice: a booked dinner at 7pm, a flight at 6am, a museum visit at 10am. A *"chill morning"* note or an all-day *"beach day"* placeholder does not count. At least one such item anywhere in the trip's itinerary satisfies the anchor requirement.

### Travel-leg date definition

A **travel-leg date** is any date that triggers TravelDay state:

- Trip `startDate` (depart home)
- Any overnight-accommodation-change date derived from the itinerary
- Trip `endDate` (return home)

Between travel-leg dates (during a stay), the trip returns to `InProgress`.

### Regression rules

Only `Draft` to `Planning` is fully bidirectional. All other states enforce forward-only progression, with these exceptions:

- Date-driven regressions are blocked (you cannot un-start a trip).
- If trip data changes break a forward condition (e.g., preplanning data deleted), show a **warning banner**, not a state regression. Example: *"You removed 3 itinerary events. This trip is Ready but approaching the Planning threshold."*
- `Vaulted` to `Stale` is the only manual reverse transition — deliberate user action.

### Date slip handling

If `startDate` or `endDate` changes:

1. State recomputes from scratch against the new dates.
2. If the change causes a **backward transition** (e.g., trip pushed 3 months out, no longer Ready), show a confirmation modal: *"You've moved this trip. It's now X days out — switch back to Planning?"* User chooses.
3. If the change causes a **forward transition** (trip moved up, now hits Ready threshold), auto-promote without prompt.
4. The 90-day Stale to Vaulted auto-transition always honors the current `endDate` — moving the end date forward extends the Stale window.

---

## 3. Core Trip Object Shape

This is a product-facing model, not a final database schema.

### Setup vs Preplanning — the core distinction

**Setup** captures the high-level skeleton of the trip. It answers: what is this trip, when, where, who, and roughly how are we getting there. Setup should take 5 minutes. Every field is broad and high-level. No booking references, no flight times, no confirmation numbers.

**Preplanning** captures all the small details that make the trip actually work. It is dynamically scaffolded by the choices made in Setup — the sections shown to the user and the questions asked are determined by what was entered in Setup. A user who selected Flying + Driving will see flight detail sections and car rental sections. A domestic trip will not be asked about visas. A solo trip skips group composition. All fields in preplanning are optional so power planners can go deep while casual planners are never overwhelmed.

### Trip (Setup fields only)

These are the fields collected during Setup. They define the trip identity.

- `id`
- `ownerUserId`
- `name`
- `startDate`
- `endDate`
- `status` (enum: `Draft` | `Planning` | `Ready` | `TravelDay` | `InProgress` | `Stale` | `Vaulted` | `Dreaming`)
- `recommendedPhase`
- `tripType` (beach, city, adventure, road trip, family, romantic, group, honeymoon, etc.)
- `tripVibe` (relaxed, packed, spontaneous, structured)
- `transportModes` (array — user selects one or more: fly, drive, train, cruise. Multiple allowed e.g. fly + drive)
- `travelerCount`
- `inviteMode` (private, invite_only, public_link)
- `isDreamMode` (boolean)
- `isPremiumTrip` (organizer has premium unlock)
- `readinessScore` (computed 0-100, never shown to user as a number)
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

### Preplanning — detailed data models

All preplanning data is optional. Sections are surfaced dynamically based on Setup choices.

#### TransportDetail (Preplanning — one per transport mode selected in Setup)

##### Flying detail

- `id`, `tripId`
- One or more `FlightLeg` entries

Each `FlightLeg`:
- `originAirportCode` (IATA), `originAirportName` (optional)
- `destinationAirportCode` (IATA), `destinationAirportName` (optional)
- `departureDate`, `departureTime`
- `arrivalDate`, `arrivalTime`
- `flightNumber` (optional), `airline` (optional), `confirmationRef` (optional)
- `seatClass`, `isConnection` (boolean), `notes` (optional)

##### Driving detail

- `id`, `tripId`
- `isCarRental` (boolean), `rentalCompany`, `rentalConfirmationRef` (optional)
- `rentalPickupLocation`, `rentalPickupDate`, `rentalPickupTime` (optional)
- `rentalReturnLocation`, `rentalReturnDate`, `rentalReturnTime` (optional)
- `estimatedTotalDriveHours`, `keyStops` (array of waypoints), `notes`

##### Train detail

- `id`, `tripId`
- One or more `TrainLeg` entries with origin/destination stations, times, service label, confirmation ref, seat class
- Rail pass (if used): `railPassUsed`, `railPassName`, `railPassConfirmationRef`

##### Cruise detail

- `id`, `tripId`
- `cruiseLine`, `shipName`, ports of embarkation/disembarkation, dates, times, cabin, confirmation ref

#### LodgingEntry (Preplanning — one per place stayed)

Shown in Preplanning regardless of transport mode.

- `id`, `tripId`, `order`
- `propertyName`, `type` (hotel, airbnb, hostel, resort, camping, vacation_rental, friends_family, other)
- `city`, `address`
- `checkInDate`, `checkInTime`, `checkOutDate`, `checkOutTime`
- `confirmationRef`, `contactNumber`, `notes`

#### GroupMember (Preplanning — one per traveler)

Shown when `travelerCount > 1`.

- `id`, `tripId`, `userId` (nullable)
- `displayName`, dietary/mobility/medical notes, emergency contact

#### DestinationDetail (Preplanning — one per TripDestination)

- `id`, `tripId`, `destinationId`
- `timezone`, `localCurrency`, `languageNotes`
- `visaRequired`, `visaNotes`, `healthEntryRequirements`
- `powerAdapterNeeded`, `adapterType`, `drivingRules`
- `emergencyNumbers`, `seasonalWarnings`, `localHolidayNotes`

#### DocumentEntry, PreDepartureItem (details per sections above)

### Preplanning completeness fields

- `preplanningTransportComplete` (only counted if transport modes were selected in Setup)
- `preplanningAccommodationComplete`
- `preplanningGroupCompositionComplete` (only counted if travelerCount > 1)
- `preplanningBudgetComplete`
- `preplanningDestinationInfoComplete`
- `preplanningDocumentsComplete` (only counted for international trips)
- `preplanningPreDepartureComplete`
- `preplanningCompletionPct` (computed 0-100)

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
| Visa and health entry | destination country is international |
| Power adapter | destination country uses different plug/voltage |
| Driving rules and IDP | drive selected in transportModes |
| Documents | always shown |
| Pre-departure logistics | always shown |
| Medication reminder | medical needs flagged in group composition |
| Pet/house logistics | trip length >= 3 days |
| School absence | children flagged in group composition |

### Trip readiness support fields

- `setupComplete` (boolean)
- `preplanningComplete` (boolean)
- `itineraryCoverageLevel` (none | partial | good | complete)
- `packingCoverageLevel`
- `travelDayCoverageLevel`
- `expenseTrackingEnabled`
- `hasOutstandingSettlement`

### Minimum Setup Requirements

The trip counts as setup-complete only when these fields exist:

- `name`
- At least one destination (city required)
- `startDate` and `endDate`
- `travelerCount >= 1`
- At least one transport mode selected

Optional but shown in Setup form: additional destinations, trip type and vibe, ball color, budget target/currency/type.

Everything else (flight numbers, lodging details, group info, documents) belongs in Preplanning and is never required for setup-complete status.

---

## 4. Readiness Score

The readiness score is a composite 0-100 number computed deterministically from trip data. **Users never see the raw number** — it is exposed only as the trip ball fill, a status chip label, and blocker visibility.

### Dimensions and weights

| Dimension | Weight | Computation |
|---|---|---|
| **Setup** | 25 | Binary — 25 if setup complete (all required fields), 0 otherwise |
| **Itinerary** | 20 | 4 per day of trip that has >=1 scheduled event, capped at 20 |
| **Packing** | 15 | 5 for personal list exists, 5 for group list exists (if travelerCount > 1), 5 for personal list has >=80% of suggested items |
| **Travel Day** | 20 | 10 for departure travel-day has a plan, 10 for return travel-day has a plan. Partial plan (>=1 task) counts |
| **Collaboration** | 10 | 5 for any invite sent, 5 for all invitees joined (or 5 automatically if travelerCount = 1) |
| **Finance** | 10 | 5 if budget set in Setup, 5 for >=1 expense logged OR expense tracking is explicitly opted out |

Total is clamped 0-100.

### Status bands

| Score | Band label (shown to user as status chip) |
|---|---|
| 0-34 | Fragile |
| 35-64 | Getting there |
| 65-84 | Ready-ish |
| 85-100 | Locked in |

### Readiness visibility to user

The raw score is **never displayed as a number**. Three derived signals surface the readiness:

1. **Trip ball fill %** — visual representation (see Section 5).
2. **Status chip** on trip cards in the dashboard nav column (*"Fragile" / "Getting there" / "Ready-ish" / "Locked in"*). Uses the band label, never the number.
3. **Blocker list** in the context panel — the actionable surface.

### Preplanning completion visibility

The preplanning completion percentage IS shown, but only in specific places:

- **Inside the Preplanning phase header** (*"Preplanning — 40% complete"*)
- **In the nav-column phase card mini-status** for Preplanning (*"40%"*)
- **Visualized on the trip ball** (fill percentage)

It is explicitly NOT shown on the dashboard hero, trip cards, or any other surface.

### Why a score matters

The score drives:

- Trip ball fill and animation state
- Status chips on trip cards
- Blocker highlighting
- Recommended-phase computation
- Next-best-action ranking

It is never a vanity number for the user.

---

## 5. Trip Ball State Model

The trip ball is the visual representation of the trip's health and progress. Its state is computed from the trip object.

### Ball fill rules

Ball fill (0-100%) is driven by `preplanningCompletionPct` until preplanning is complete, then by overall readiness score.

| Preplanning pct | Ball state |
|---|---|
| 0% | Empty — dotted outline only |
| 1-49% | Partial fill — preplanning in progress |
| 50-89% | Mostly filled — strong progress |
| 90-100% | Full — preplanning complete |

### Ball animation state rules

| Trip state | Ball animation |
|---|---|
| Draft, no data | Calm, expectant, dotted outline |
| Planning | Slow ocean-wave pulse |
| Ready | Bouncy, confident, full fill |
| TravelDay | Alert, faster pulse rhythm |
| InProgress | Warm, relaxed pulse |
| Stale | Soft nostalgic fade |
| Vaulted | Dimmed, still |
| Dreaming | Sparkle overlay on Dream-color ball |

A blocker-present override can apply to Planning and Ready states: subtle agitation micro-animation on top of the state's default animation.

### Ball color

`ballColor` is user-set per trip. Default colors are drawn from the brand palette. Users (organizer only) can recolor at any time from trip settings.

### Trip ball visibility

All participants see the ball — in the shell, nav column, and dashboard. Ball fill % and animation state are the same for everyone (trip readiness is a shared fact, not per-user progress). Ball color is set by organizer; participants see the chosen color but cannot change it.

---

## 6. Recommended Phase

The app computes one recommended phase for the workspace header and the primary call-to-action.

### Phase priority order

When multiple phases could apply, use this priority (highest-priority wins):

1. `travel_day`
2. `setup`
3. `wrap_up`
4. `expenses`
5. `vacation_day`
6. `packing`
7. `preplanning`
8. `itinerary`

### Rules

- Recommend **`travel_day`** when state is `TravelDay` OR departure is tomorrow and travel-day setup is weak.
- Recommend **`setup`** when state is `Draft`.
- Recommend **`wrap_up`** when state is `Stale` AND there are wrap-up tasks or unresolved settlement.
- Recommend **`expenses`** when there are unresolved balances, budget overages, or the user is explicitly working in finance tasks.
- Recommend **`vacation_day`** when state is `InProgress` AND no current travel-day flow is active.
- Recommend **`packing`** when departure is close AND packing coverage is still partial or none.
- Recommend **`preplanning`** when preplanning questions remain unresolved, especially for transport, mobility, special needs, or long-drive logistics.
- Recommend **`itinerary`** when the trip still lacks meaningful schedule structure.

---

## 7. Next Best Action Algorithm

Each trip surfaces exactly one `primaryAction` and up to three `secondaryActions` plus a list of `blockers`.

### Algorithm (deterministic, 3-step pipeline)

```
function computeNextAction(trip: Trip, now: Date):
  # Step 1: Severe-blocker override
  blockers = computeBlockers(trip, now)
  if blockers.length >= 5:
    primary = resolveAction(blockers[0])     # highest-urgency blocker first
    secondary = blockers.slice(1, 4).map(resolveAction)
    return { primary, secondary }

  # Step 2: State-driven candidate generation
  state = computeState(trip, now)
  candidates = stateCandidateMap[state].filter(action => action.isApplicable(trip))

  # Step 3: Urgency-weighted ranking
  candidates = candidates.sort((a, b) => urgency(b, trip) - urgency(a, trip))

  primary = candidates[0]
  secondary = candidates.slice(1, 4)
  return { primary, secondary }
```

### State candidate map

| State | Candidate actions |
|---|---|
| `Draft` | `completeSetup` |
| `Planning` | `addDestinationDetails`, `buildItinerary`, `inviteGroup`, `setBudget`, `buildTravelDayPlan` |
| `Ready` | `buildTravelDayPlan`, `confirmPacking`, `reviewItinerary`, `resolveBlockers` |
| `TravelDay` | `openTravelDayTimeline` (always primary) |
| `InProgress` | `viewTodaysSchedule`, `checkOffVacationDayTasks`, `logRecentExpense` |
| `Stale` | `settleExpenses`, `writeMemoryRecap`, `closeOutTrip` |
| `Vaulted` | `revisitMemory` |
| `Dreaming` | `invitePeopleToDream`, `setBudget`, `buildFantasyItinerary`, `makeItReal` |

### Urgency weighting

Candidate urgency is a weighted sum:

- `+10` if the action resolves a blocker (only evaluated when `blockers.length < 5` — the >=5 branch handles severe cases)
- `+5` if the action is in the current recommended phase (see Section 6)
- `+3` if days-to-action is small (e.g., *"build travel-day plan"* surges at T-48 hours)
- `+2` if the action is in a phase the user hasn't touched yet
- `+0` baseline

### Action categories (for UI color / icon mapping)

- `setup`, `invite`, `preplanning`, `itinerary`, `packing`, `travel_day`, `vacation_day`, `expenses`, `premium_upgrade`

---

## 8. Blocker Taxonomy

TripWave has **exactly 7 blocker types**. Any issue not on this list is a warning or suggestion, not a blocker.

### The 7 blocker types

| # | Type | Fires when |
|---|---|---|
| 1 | Missing setup field | Any required setup field becomes empty (`name`, destination, dates, transport, traveler count). Also auto-clears Draft state. |
| 2 | Missing travel document for international trip | `DestinationDetail.visaRequired = true` for any international destination AND no `DocumentEntry` of type `passport` or `visa` exists. Only fires at T-30 days or less. |
| 3 | No itinerary anchor for multi-day trip near departure | Trip duration >=3 days AND `daysToDeparture <= 14` AND zero scheduled itinerary events. |
| 4 | No travel-day plan near departure | `daysToDeparture <= 2` AND departure travel-day plan has zero tasks. |
| 5 | Unresolved poll blocking a scheduled event | A poll tagged as blocking an itinerary choice is still open AND `daysToDeparture <= 7`. |
| 6 | Unsettled balance past trip end | Trip is Stale AND any expense split is unsettled AND `daysPastEndDate >= 14`. |
| 7 | Expired or expiring document | Any `DocumentEntry` of type `passport` has `expiryDate` within 6 months of the trip's `endDate`. |

### Explicitly NOT blockers

These are warnings or suggestions, not blockers:

- Budget not set
- Group composition details missing (dietary, emergency contacts)
- Packing list under 80%
- Missing field for optional features (vibe, trip type, ball color)
- "You haven't done preplanning yet" when `daysToDeparture > 14`

### Blocker UI treatment

| Count | UI treatment | Context panel state |
|---|---|---|
| 0 | Healthy state | *"You're on track · No blockers · Enjoy the view."* |
| 1 | Full detail visible: icon + title + *"Tap to resolve"* CTA | Blockers |
| 2 | Both visible, compact (icon + short title) | Blockers |
| 3+ | Summary: *"3 blockers"* headline + first blocker title + *"Tap to see all"* link | Blockers |
| 5+ | Same UI + next-best-action algorithm prioritizes blocker resolution over phase priority | Blockers |

### Tone rules

- Pink accent, not red (*Red = error; Pink = needs attention*)
- Headline: *"N blockers"* not *"N errors"* or *"N problems"*
- CTA: *"Tap to resolve"* not *"Fix these"*
- Blocker row verbs: *"Add a passport"* not *"Missing passport"*

---

## 9. Per-State Behavior

### Dashboard and workspace

| State | Dashboard `Next Up` hero | Workspace overview primary content |
|---|---|---|
| `Draft` | *"Finish setting up [Trip Name]"* CTA; ball empty | Setup form with remaining fields highlighted |
| `Planning` | *"[Trip Name] · N days away · X% ready"* + recommended-phase CTA | Preplanning progress + next-best-action card + blockers (if any) |
| `Ready` | *"You leave [Trip] in N days · Check your plan"* + travel-day CTA | Travel-day readiness checklist + itinerary summary + blockers |
| `TravelDay` | Hero collapses — shell override activates (UX_SPEC § 42.13) | Full-viewport travel-day timeline (focus mode) |
| `InProgress` | *"Day N of your [Trip]"* + today's schedule CTA | Today's itinerary + scavenger hunt (if any) + expense quick-log |
| `Stale` | *"[Trip] ended N days ago · Settle up"* + expenses CTA | Wrap-up summary + unsettled balances + *"Close out trip"* action |
| `Vaulted` | *"Revisit [Trip]"* with memory-vault preview | Memory vault layout (shell override § 42.13) |
| `Dreaming` | *"[Dream] · your someday trip"* + *"Make it real"* upsell (free) or *"Continue dreaming"* (premium) | Dream workspace — itinerary + Must Dos + *"This is a dream"* chip |

### Notifications

All notifications are in-app bell only (no push, no email beyond password reset).

| State | Notifications fired |
|---|---|
| `Draft` | None |
| `Planning` | Weekly summary at 7+ days dormant. All collaboration notifications (per UX_SPEC § 25) |
| `Ready` | Departure countdown at T-14d, T-7d, T-48h. Blocker-specific nudges as they arise |
| `TravelDay` | T-24h pre-departure bell. T-6h focus-mode activation. Flight delay alerts (future) |
| `InProgress` | Morning briefing at 7 AM local each day. Scavenger hunt unlocks. Expense notifications per shell Q13 |
| `Stale` | Single nudge at T+14 days if unsettled balances remain. Nothing else |
| `Vaulted` | Anniversary nudge at +1 year (*"A year ago today you were in Kyoto."*). Opt-out in account settings |
| `Dreaming` | *"Someone reacted to your dream"* only. No countdowns, no reminders |

### Ad suppression (free tier)

| State | Ads shown |
|---|---|
| `Draft` | Yes |
| `Planning` | Yes |
| `Ready` | Yes |
| `TravelDay` | **No** (shell override + MONETIZATION § 8) |
| `InProgress` | Yes (muted treatment) |
| `Stale` | Yes, except during active expense-settlement flow |
| `Vaulted` | **No** (nostalgic moment) |
| `Dreaming` | **No** (aspirational brand moment; Dream public share links also ad-free) |

---

## 10. Edge Cases

| Edge case | Handling |
|---|---|
| Invited user joins via link before setup-complete | Skips Draft entirely; lands in Planning with read/vote permissions |
| Trip created with no `endDate` | Defaults to `startDate + 3 days`; subtle banner *"We assumed 3 days — change this anytime."* No blocker |
| Trip with past dates (created for last month) | Lands in Stale state immediately; banner *"This trip's dates are in the past — update dates to plan a future trip, or close out."* User can edit or vault |
| Trip with `startDate` in more than 5 years | No state impact; Ready threshold just never triggers naturally. No banner |
| Trip with `travelerCount = 1` (solo) | Collaboration readiness auto-scores 5/10 instead of requiring invitees. Group composition preplanning section hidden. Member page renders *"Just you."* |
| Organizer deletes account | All their trips transfer ownership to the first joined participant (alphabetical by join date). If no other participants, trips are soft-deleted for 30 days then hard-deleted |

---

## 11. Example Logic Scenarios

### Scenario A: newly created trip

- state: `Draft`
- recommended phase: `setup`
- primary action: *"Add dates and destination"*
- ball: empty dotted outline

### Scenario B: trip is three weeks away with no travel details

- state: `Planning`
- recommended phase: `preplanning`
- primary action: *"Answer travel planning questions"*
- ball: partial fill, slow pulse

### Scenario C: trip is five days away, itinerary exists, no packing list

- state: `Ready` (because `daysToDeparture <= 14` AND preplanning+itinerary+travel-day thresholds met)
- recommended phase: `packing`
- primary action: *"Create packing list"*
- ball: mostly full, slightly faster pulse

### Scenario D: departure is tomorrow, no travel-day checklist

- state: `Ready`
- recommended phase: `travel_day`
- primary action: *"Build departure checklist"* (this is also Blocker Type #4)
- ball: full, alert state

### Scenario E: it is the departure day

- state: `TravelDay` (auto-transitioned at 04:00 local)
- recommended phase: `travel_day`
- primary action: *"Open travel-day timeline"*
- ball: faster alert pulse
- Shell: focus mode override activates (UX_SPEC § 42.13)

### Scenario F: trip is live, mid-trip day (vacation day)

- state: `InProgress`
- recommended phase: `vacation_day`
- primary action: *"Review today's schedule"*
- ball: warm relaxed pulse

### Scenario G: trip ended yesterday with unresolved expenses

- state: `Stale` (auto at midnight of endDate + 1 day)
- recommended phase: `wrap_up`
- primary action: *"Settle shared expenses"*
- ball: soft nostalgic fade

### Scenario H: organizer closes out the trip

- state: `Stale` to `Vaulted` (manual)
- recommended phase: none (vault view)
- primary action: none
- Shell: Memory vault layout (override)

---

## 12. Expense State Model

Expenses are tracked from day 0 (preplanning, for deposits) through trip end and into wrap-up. See the 2026-04-20 Expenses grill entry in DECISIONS.md and UX_SPEC § 11 for the full expense spec.

### Expense object shape

- `id`, `tripId`
- `description`, `amount`, `currency`, `date`, `category`
- `payerUserId`, `relatedEventId` (nullable — links to itinerary event)
- `includeInDefaultReport` (default true)
- `splits` (array of user IDs and amounts)
- `settlementStatus` per-pair (soft settlement, reversible — see Expenses grill Q2)
- `createdAt`

### Settlement status

Per-pair, reversible. When a user marks a balance settled, the pair is resolved immediately; undoable at any time. See Expenses grill for full settlement flow.

---

## 13. Closed Questions

The following previously-open questions were resolved in the 2026-04-20 lifecycle grill:

- **Should Ready be time-based, completeness-based, or both?** Both — composite rule in § 2.
- **Should readiness score be user-visible from day one?** No, never as a raw number. Shown as ball + chip + blockers only.
- **Should trips regress from Ready to Planning if critical data is removed?** No. Show warning banner only; state stays at Ready.
- **How many unresolved blockers before the UI feels scolding?** Never scolding regardless of count. UI treatment scales by count (1-2 inline, 3+ summary, 5+ flips next-action priority). Tone rules enforced (pink not red, "tap to resolve" not "fix these").
- **Should the trip ball be visible only to organizer or all participants?** All participants. Color is organizer-only to change.
- **Should preplanning completion be visible as a number, a label, or only through the ball?** Shown as a number ONLY inside the Preplanning phase header and the nav-column phase card mini-status. Elsewhere, shown only through the ball fill and status chip band label.

---

## 14. Suggested MVP Defaults

- Compute status automatically when possible (deterministic per § 2).
- Allow manual navigation across phases regardless of recommended phase.
- Visually emphasize only one recommended phase at a time.
- Preplanning completion percentage drives ball fill.
- Ball color defaults to brand palette; user can change any time.

---

## Provenance

- **Locked:** 2026-04-20 via the lifecycle grill (see DECISIONS.md entry of same date).
- **Supersedes:** previous STATE_MODEL.md draft (6-state enum, open questions), APP_STRUCTURE.md § Trip Lifecycle States table.
- **Related:** UX_SPEC.md § 42 (shell), UX_SPEC.md § 11 (expenses), MONETIZATION.md § 8 (ad-free zones), MONETIZATION.md § 14 (Dream Mode).
