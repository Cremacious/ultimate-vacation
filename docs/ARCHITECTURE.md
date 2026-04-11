# Architecture

This document describes the intended technical shape of the product before the backend is fully implemented.

## Architecture Goals

- keep the stack lean and cost-aware
- make the web app stable before packaging for mobile
- support collaboration without overengineering too early
- leave room for offline-capable reads later
- keep premium gating easy to reason about

## Proposed Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Neon Postgres
- ORM to be decided: Prisma or Drizzle
- auth provider to be decided
- Stripe for subscriptions later

## Application Layers

### Presentation Layer

- marketing routes
- authenticated app shell
- trip workspace routes
- reusable UI components

### Product Logic Layer

- next best action engine
- trip lifecycle state rules
- trip stage rules
- planning suggestion logic
- checklist progression
- permission checks
- premium entitlement checks

### Data Layer

- users
- trips
- trip members
- itinerary items
- travel days
- checklists
- packing lists
- polls
- expenses
- subscriptions

## Initial Data Domains

### User domain

- user
- profile
- subscription

### Trip domain

- trip
- trip_member
- invite_code
- destination
- trip_status_history later if useful

### Planning domain

- itinerary_item
- trip_day
- travel_day_plan
- checklist
- checklist_item
- packing_list
- packing_item

### Collaboration domain

- poll
- poll_option
- vote
- comment or note later if needed

### Finance domain

- expense
- expense_split
- settlement

## Route Strategy

High-level direction:

- `/` marketing landing page
- `/workspace` temporary shell
- `/app` authenticated entry later
- `/app/trips`
- `/app/trips/[tripId]`
- `/app/trips/[tripId]/setup`
- `/app/trips/[tripId]/preplanning`
- `/app/trips/[tripId]/itinerary`
- `/app/trips/[tripId]/packing`
- `/app/trips/[tripId]/travel-days`
- `/app/trips/[tripId]/vacation-days`
- `/app/trips/[tripId]/expenses`

## Logic Services To Expect

These do not need to exist immediately as separate code modules, but the app should eventually have clear logic ownership for:

- trip status calculation
- recommended phase calculation
- next best action calculation
- permission checks
- premium entitlement checks
- readiness / blocker evaluation

## State-Driven Product Logic

The docs now assume the app will compute and expose:

- trip status
- readiness score or readiness tier
- recommended phase
- primary next action
- blockers

This should influence both backend modeling and app-shell UI.

## Offline Strategy

Not for immediate implementation, but we should design with it in mind:

- critical trip data should be cacheable
- read-heavy surfaces should degrade gracefully
- offline writes may need queueing later

Initial offline target:

- itinerary read access
- travel-day checklist visibility
- packing list visibility

## Security and Permissions

Current assumption:

- one paid organizer owns the trip
- invited members participate within a trip
- permissions begin simple and expand later

Early roles under consideration:

- owner
- co-planner
- participant
- viewer

## Cost Principles

- prefer Vercel-native-friendly patterns
- avoid expensive background systems early
- avoid premature real-time infrastructure
- defer OCR and heavy AI features until ROI is clear

## Open Architecture Questions

- Which ORM better fits our pace and deployment preferences?
- Should participant join flow require a full account immediately?
- How much app state should live server-side vs client-side?
- When should we introduce background jobs or notifications?
