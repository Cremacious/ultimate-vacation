# State Model

This document turns the app logic into concrete product state rules. It defines the core trip object shape, the lifecycle and readiness model, and how the app should compute the recommended phase and next best action.

## Goal

The app should know:

- what state a trip is in
- how ready the trip is
- what phase deserves attention now
- what action best reduces risk right now

## 1. Core Trip Object Shape

This is a product-facing model, not a final database schema.

### Trip

- `id`
- `ownerUserId`
- `name`
- `destinationSummary`
- `startDate`
- `endDate`
- `status`
- `recommendedPhase`
- `tripType`
- `transportMode`
- `lodgingSummary`
- `travelerCount`
- `inviteMode`
- `isPremiumTrip`
- `readinessScore`
- `createdAt`
- `updatedAt`

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
- destination summary
- start date
- end date
- at least one traveler
- transport mode

Optional but useful:

- budget target
- lodging summary
- notes

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

- health/status cards
- blocker highlighting
- smart nudges
- premium upsell moments later

## 5. Recommended Phase Rules

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

## 6. Next Best Action Model

Each trip should surface:

- one `primaryAction`
- up to three `secondaryActions`
- a list of `blockers`

## Action categories

- setup
- invite
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

## 7. MVP Blocker Rules

Blockers should be explicit and scary in a helpful way.

### Candidate blockers

- missing dates
- no destination set
- no departure travel day
- no itinerary anchor for a multi-day trip
- unresolved settlement after trip

## 8. Example Logic Scenarios

### Scenario A: newly created trip

- status: `draft`
- recommended phase: `setup`
- primary action: `Add dates and destination`

### Scenario B: trip is three weeks away with no travel details

- status: `planning`
- recommended phase: `preplanning`
- primary action: `Answer travel planning questions`

### Scenario C: trip is five days away, itinerary exists, no packing list

- status: `planning`
- recommended phase: `packing`
- primary action: `Create packing list`

### Scenario D: departure is tomorrow, no travel-day checklist

- status: `ready`
- recommended phase: `travel_day`
- primary action: `Build departure checklist`

### Scenario E: trip is live

- status: `in_progress`
- recommended phase: `vacation_day` or `travel_day`
- primary action: `Review today's schedule`

### Scenario F: trip ended yesterday with unresolved expenses

- status: `completed`
- recommended phase: `wrap_up`
- primary action: `Settle shared expenses`

## 9. Suggested MVP Defaults

- compute status automatically when possible
- allow manual navigation across phases
- visually emphasize only one recommended phase
- allow organizer override later, not necessarily in v1

## 10. Open State Model Questions

- Should `ready` be time-based, completeness-based, or both?
- Should readiness score be user-visible from day one?
- Should a trip ever regress from `ready` to `planning` if critical data is removed?
- How many unresolved blockers should appear before the UI feels scolding?
