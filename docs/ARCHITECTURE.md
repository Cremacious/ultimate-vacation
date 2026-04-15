# Architecture

This document describes the intended technical shape of the product before the backend is fully implemented.

## Architecture Goals

- keep the stack lean and cost-aware
- make the web app stable before packaging for mobile
- support collaboration without overengineering too early
- leave room for offline-capable reads later
- keep premium gating easy to reason about
- build features without paid third-party APIs wherever possible

## Confirmed Stack

- **Next.js App Router** — web framework
- **React + TypeScript** — UI layer
- **Tailwind CSS** — styling
- **Neon Postgres** — primary database (shared $25/month plan)
- **Vercel** — hosting and deployment (shared $25/month plan)
- **Resend** — transactional email (password reset, invite notifications)
- **Azure** — receipt scanning OCR (premium feature only, pay-per-use)
- **ORM to be decided** — Prisma or Drizzle
- **Auth provider to be decided** — Better Auth confirmed direction, configuration TBD
- **Payment processor to be decided** — needed for one-time $5 premium purchase (Stripe likely)

### What we are NOT using

- Image hosting — TripWave is a text-first product with no photo uploads
- Subscription billing infrastructure — premium is a one-time payment, not recurring
- Paid planning or suggestion APIs — smart suggestions are deterministic rule-based logic initially
- Real-time infrastructure — not needed at MVP, collaboration through standard request-response

### Cost model

TripWave shares Vercel and Neon subscriptions with another app, making marginal infrastructure cost low. Azure receipt scanning is pay-per-use and only triggered for premium users. Resend is usage-based and low-volume initially.

## Application Layers

### Presentation Layer

- marketing routes (public)
- auth routes (login, signup, password reset)
- authenticated app shell
- trip workspace routes (phase-based)
- reusable UI components
- ad slots (free tier only)

### Product Logic Layer

- next best action engine
- trip lifecycle state rules
- trip phase recommendation rules
- planning suggestion logic (vibe-aware, destination-aware)
- checklist progression
- permission checks (per-user, per-trip)
- premium entitlement checks
- trip health / readiness score computation
- trip ball fill computation (preplanning completeness → fill percentage)

### Data Layer

- users
- trips
- trip members and per-user permission toggles
- itinerary items
- travel days
- checklists
- packing lists and items (with visibility and privacy flags)
- polls and votes
- expenses and splits
- settlements
- premium entitlements

## Initial Data Domains

### User domain

- user
- profile
- premium_entitlement (one-time purchase record, not subscription)

### Trip domain

- trip
- trip_member (with per-feature permission flags)
- invite_code
- destination
- trip_status_history (later if useful)

### Planning domain

- itinerary_item
- trip_day
- travel_day_plan
- checklist
- checklist_item
- packing_list (with is_visible_to_group flag)
- packing_item (with is_private flag)
- preplanning_field (structured fields for the preplanning wizard)

### Collaboration domain

- poll
- poll_option
- vote
- note (later if needed)

### Finance domain

- expense (with include_in_report flag per report context)
- expense_split
- settlement
- budget (per trip, with optional per-category budgets)

### Tools domain

- currency_rate_snapshot (for offline-capable currency converter)

## Route Strategy

All app features require authentication. Public routes are limited to marketing and auth.

### Public routes

- `/` — marketing landing page
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/legal`
- `/contact`

### Authenticated routes

- `/app` — authenticated entry / dashboard
- `/app/trips` — trip list
- `/app/trips/[tripId]` — trip overview
- `/app/trips/[tripId]/setup`
- `/app/trips/[tripId]/preplanning`
- `/app/trips/[tripId]/itinerary`
- `/app/trips/[tripId]/packing`
- `/app/trips/[tripId]/travel-days`
- `/app/trips/[tripId]/vacation-days`
- `/app/trips/[tripId]/expenses`
- `/app/trips/[tripId]/polls`
- `/app/trips/[tripId]/settings`
- `/app/trips/[tripId]/settings/members`
- `/app/account`
- `/app/account/premium` — upgrade prompt and purchase flow

## Logic Services To Expect

These do not need to exist immediately as separate code modules, but the app should eventually have clear logic ownership for:

- trip status calculation
- recommended phase calculation
- next best action calculation
- preplanning completeness calculation (feeds trip ball fill %)
- readiness score computation (6 dimensions)
- permission checks (per user, per feature, per trip)
- premium entitlement checks
- vibe-aware suggestion engine (deterministic rules)
- currency rate management (fetch, store, serve)

## Offline Strategy

Offline access is a premium feature. Design with it in mind from the start.

- critical trip data should be cacheable
- read-heavy surfaces should degrade gracefully
- offline writes may need queueing later

Initial offline target (premium only):

- itinerary read access
- travel-day checklist visibility and completion state
- packing list visibility
- addresses and reservation notes

Non-premium users gracefully see an offline-unavailable state.

## Security and Permissions

Current model:

- one paid organizer owns the trip
- organizer sets per-user permission toggles at trip creation (simplified) and in trip settings (full control)
- invited members participate within a trip subject to their permissions
- account required for all app features — no anonymous or guest access

Per-user toggleable capabilities (examples):

- can add itinerary items
- can edit itinerary items
- can delete itinerary items
- can view packing lists
- can add expenses
- can start polls
- can invite others

## Ad Integration

- ads are rendered in the free tier on web and app
- premium entitlement check hides all ad slots
- ad placements are defined at the component level with a isPremium guard
- good placements: dashboard idle states, between sections, transition screens
- protected from ads: travel-day execution, mid-checklist, expense entry, active forms

## Cost Principles

- prefer Vercel-native-friendly patterns
- avoid expensive background systems early
- avoid premature real-time infrastructure
- defer OCR and AI features until ROI is clear
- no image hosting — text-first product
- build tools (currency converter, timezone info) without paid API subscriptions where possible

## Open Architecture Questions

- Which ORM better fits our pace and deployment preferences (Prisma vs Drizzle)?
- How much app state should live server-side vs client-side?
- When should we introduce background jobs (departure reminders, expense nudges)?
- Should currency rates be fetched server-side on a schedule or on-demand client-side?
- How should offline sync conflicts be resolved when a user edits offline and reconnects?
