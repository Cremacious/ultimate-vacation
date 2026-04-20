# App Structure

This document tracks the intended information architecture, route layout, and major workspace regions.

## Access Rules

All app features require an authenticated account. Non-authenticated users may only access:

- `/` — marketing landing page
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/legal`
- `/contact`
- `/pricing`

There is no anonymous or guest access to any trip feature.

## Product Surfaces

### 1. Marketing Site

Purpose:

- explain the product clearly
- establish tone and brand
- convert visitors into signed-up users

Core sections:

- hero
- product promise
- phase-based feature preview
- trip ball visual introduction
- premium feature preview
- CTA

### 2. Authenticated App

Purpose:

- serve as the organizer's command center
- list trips
- surface progress and alerts
- guide the next action

### 3. Trip Workspace

Purpose:

- central place to manage one trip
- switch between planning phases
- coordinate with participants
- surface trip ball, health, and recommended action

## Route Map

### Public routes

- `/`
- `/pricing`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/legal`
- `/contact`

### Authenticated app routes

- `/app` — dashboard (trip list and overview)
- `/app/trips` — all trips
- `/app/trips/new` — create trip flow
- `/app/trips/[tripId]` — trip overview
- `/app/trips/[tripId]/setup` — view mode: trip configuration at a glance
- `/app/trips/[tripId]/setup/edit` — edit form: all setup fields editable
- `/app/trips/[tripId]/preplanning`
- `/app/trips/[tripId]/itinerary`
- `/app/trips/[tripId]/packing`
- `/app/trips/[tripId]/travel-days`
- `/app/trips/[tripId]/vacation-days`
- `/app/trips/[tripId]/expenses`
- `/app/trips/[tripId]/polls`
- `/app/trips/[tripId]/scavenger-hunt`
- `/app/trips/[tripId]/wishlist`
- `/app/trips/[tripId]/group`
- `/app/trips/[tripId]/settings`
- `/app/trips/[tripId]/settings/members`
- `/app/account`
- `/app/account/premium` — upgrade prompt and purchase

## Workspace Layout

**Status:** Superseded 2026-04-20 — see **UX_SPEC.md § 42 Shell Layout and Navigation** for the canonical spec.

The canonical shell is the bento-grid full-viewport layout locked in the 2026-04-20 shell grill (20 sub-decisions, 3 conflicts resolved). Summary:

- **Desktop:** full-viewport bento grid with six durable named slots (`nav-column`, `trip-ball`, `context-panel`, `primary`, `quick-add`, `activity-feed`) plus `ad-banner` on the free tier. Large-scale UI (~18px body). No empty space. Container-queries-first responsive strategy.
- **Mobile:** top bar + horizontal scrollable phase pill bar + stacked content. No hamburger, no drawer, no bottom tab bar.
- **Phase nav:** flat 11-phase chronology (Overview → Setup → Preplanning → Itinerary → Packing → Travel Day → Vacation Day → Expenses → Polls → Wishlist → Members) with Memory appearing only for Stale/Vaulted trips. Vault, Scavenger Hunt, Tools, and Notes are sub-navigation inside their host phases.
- **Trip ball:** has its own bento slot on desktop; on mobile it lives in the compact top-bar area. Always visible except during Travel Day focus mode (reduced per § 9) and the five bento overrides.
- **Five bento overrides:** Travel Day focus mode, Vaulted / Memory view, Invite-landing (unauthenticated), Trip Creation ritual, Zero-trip first-run. All other pages use the bento.

All other shell details — top bar contents, trip switcher, notification bell, account avatar dropdown, global search, context panel behavior, ad placement, premium entry points, breadcrumbs, Dream Mode treatment — are specified in UX_SPEC.md § 42.

### Trip Ball in workspace

The trip ball occupies the `trip-ball` bento slot on desktop and the top-bar compact strip on mobile. Its fill, animation state, and color reflect the trip's current health and phase. Tapping opens the trip-health modal per UX_SPEC § 1. Hidden or collapsed only during the five bento overrides.

## Trip Phase Navigation

Phase order (as shown in nav):

1. Overview
2. Setup
3. Preplanning
4. Itinerary
5. Packing
6. Travel Day
7. Vacation Day
8. Expenses
9. Polls
10. Wishlist
11. Scavenger Hunt
12. Group
13. Settings

The recommended phase is visually highlighted. All phases remain accessible regardless of current recommendation.

## Trip Workspace Permissions

The workspace respects per-user permissions set by the organizer. Participants see a view of the workspace shaped by their allowed capabilities:

- if a user cannot add itinerary items, the add button is hidden or disabled with an explanation
- if a user cannot view group packing lists, those are not shown
- organizer sees full controls at all times

Permissions are managed in: `/app/trips/[tripId]/settings/members`

## Logic-Aware Workspace Behavior

The workspace should not act like a flat folder of pages. It should respond to trip state.

### Workspace priorities by state

- draft trip: push the user into setup completion
- planning trip: emphasize next best planning action and preplanning progress (ball filling)
- ready trip: emphasize travel-day readiness and unresolved blockers (ball full, alert if blockers)
- in-progress trip: emphasize today's schedule and live coordination (ball in vacation state)
- completed trip: emphasize settlement and wrap-up (ball in nostalgic fade)

### Persistent UI elements that should become state-aware

- trip ball (fill, animation, color)
- recommended phase highlight in nav
- primary action button or card
- blocker list
- context panel or alert area
- daily status card (vacation days)

## Trip Lifecycle States

**Status:** Canonical rules live in **STATE_MODEL.md** (rewritten 2026-04-20 via the lifecycle grill, 18 decisions locked). This section summarizes; STATE_MODEL is the source of truth.

Trips have **7 primary states** plus **1 terminal state** for Dream Mode trips. State transitions are deterministic functions of trip data + current timestamp.

| State | Meaning | Primary dashboard focus |
|---|---|---|
| **Draft** | Created, setup incomplete | Push to complete setup |
| **Planning** | Setup complete, not yet Ready | Preplanning progress, next-best-action, unscheduled Must Dos |
| **Ready** | Meets Ready threshold (composite rule — see STATE_MODEL § 2) | Travel-day readiness, itinerary summary, blockers |
| **TravelDay** | A travel-leg date is active | Travel-day timeline (shell override — UX_SPEC § 42.13) |
| **InProgress** | Trip live between travel legs (vacation days) | Today's highlights, coming up today, recent polls, activity feed |
| **Stale** | `endDate` has passed + 24h grace, not yet closed out | Wrap-up summary, unsettled expenses, close-out CTA |
| **Vaulted** | Closed out (manual or 90-day auto) | Memory vault — read-only, browsable, shareable (shell override) |
| **Dreaming** | Dream Mode trips only; terminal state | Dream workspace + "Make it real" upsell surface |

**Transitions:** mostly auto-forward (Draft to Planning, Planning to Ready, time-driven progression). TravelDay is auto at 04:00 local on any travel-leg date, with a manual "We're off early" option. Stale to Vaulted is manual primary with a 90-day auto fallback. Full transition triggers in STATE_MODEL § 2.

**Multi-leg cycling:** A trip cycles between TravelDay and InProgress across its duration — each travel-leg date (start, any accommodation change, end) triggers TravelDay; between legs the state is InProgress.

**Stale trips remain fully editable** (add forgotten expenses, update notes). No repeated nudges — a single banner fires at T+14 days if unsettled balances remain; otherwise silent. The slot limit creates natural pressure for free users to eventually close out.

**Dream Mode trips** go Draft → Planning → Dreaming and never progress further. "Make it real" converts a Dream back to Planning with new dates.

## Trip Creation Flow

**Status:** Canonical flow lives in UX_SPEC.md § 3 (rewritten 2026-04-20 via the creation grill, 18 decisions locked). This section summarizes; UX_SPEC is the source of truth.

Trip creation is a two-phase flow:

1. **The ritual** — a 5-step full-screen emotional commitment moment (Step 0 Real/Dream → Step 1 Name → Step 2 Dates → Step 3 Color → Step 4 Reveal). Captures 4 fields only: type, name, dates, color. Ball color defaults to neon cyan if skipped; dates are skippable.
2. **The Setup page** — `/app/trips/[tripId]/setup` in the bento shell. Captures the remaining 3 required fields (destinations, traveler count, transport modes) plus 4 optional fields (trip type + vibe, ball color editable, budget, invite mode).

**State transitions:**
- Trip row is created on ritual Step 1 submit (name). Trip state is `Draft`.
- Ritual Step 4 *"Let's go"* CTA routes to Setup page, **not** the trip overview.
- Trip exits Draft and enters Planning when all 5 required fields exist (per STATE_MODEL § Minimum Setup Requirements).
- If `travelerCount > 1`, invite prompt fires right after Setup completes — NOT during the ritual.
- If `travelerCount = 1` (solo), invite prompt is skipped entirely.

Setup captures only the high-level skeleton of the trip. All granular details (flight numbers, lodging confirmations, group member info, documents, etc.) live in Preplanning.

### Setup fields (9 total — 5 required, 4 optional)

**Required (block Draft → Planning transition):**
- trip name
- one or more destinations (city + country, optional arrival/departure)
- start date and end date
- traveler count (stepper, default 1)
- transport mode multi-select (fly, drive, train, cruise — >= 1 required)

**Optional:**
- trip type and vibe (two dropdowns)
- ball color (editable post-ritual)
- budget target, currency, type (total or per-person)
- invite mode (private / invite-only / public-link, default invite-only)

### Invitee first action (joining an existing trip)

Invitees skip the ritual entirely. When they join (via invite link or code), their first screen is a full-screen Must Dos prompt with contextual copy (*"The things you can't miss on this trip. [Organizer] and [N-1] others will see these."*). This seeds the Proposed queue with input from everyone on day one and immediately makes them a contributor rather than a viewer. Submit or skip lands them in the trip workspace at the current recommended phase.

### Persistence and edge cases

- Trip row persists in Draft if ritual is abandoned mid-flow. User resumes from the step they left via a *"Finish creating [Trip Name]"* CTA in the nav column.
- Draft trips with no activity for 30 days are silently soft-deleted.
- Ritual is online-only; blocks with a warm retry modal if user is offline.
- Editing required Setup fields post-completion can regress `Planning` → `Draft` (the one allowed regression per STATE_MODEL § 2), with a warning banner.

### Preplanning is dynamically shaped by Setup

The Preplanning page reads the user's Setup choices and shows only the relevant sections. A user who selected Flying + Driving sees flight detail sections and car rental sections but not train or cruise sections. A domestic trip does not see visa or health entry sections. All preplanning fields are optional — power planners can go as deep as they want, casual planners are never blocked.

Preplanning completion drives the trip ball fill percentage. Sections that are not applicable (because of Setup choices) are excluded from the completion denominator.

## Quick-Action Toolbar

Every trip workspace page shows a quick-action toolbar at the top of the content area. It exposes high-frequency actions that would otherwise require navigating to another page.

Default actions:

- Log Expense
- Create Poll
- Create Scavenger Hunt challenge

Rules:

- each action opens a small modal or sheet in place — no full page navigation
- writes go to the same underlying models used by the dedicated Expenses, Polls, and Scavenger Hunt pages
- the toolbar is the fastest path to the three most commonly-created objects during an active trip; dedicated pages remain the place for review and management

## Cross-Surface Integrations

Certain data objects are intentionally shared between pages. These pages read from and write to the same source — they do not duplicate state.

### Unified Proposal Layer (Must Do's, Wishlist, and Suggestions)

There is no separate wishlist entity. All proposals share one data model with a status field.

**Proposal lifecycle:**
- **Must Do** — high-priority desire, attributed by person ("Alex's Must Do"). Shared with the whole group. A fairness mechanism: signals what someone really needs from the trip. Visually highlighted above other proposals. The app tracks unscheduled Must Dos and surfaces reminders on the Itinerary page.
- **Proposed** — idea under group consideration. Reactions, up/down votes, and one-liner opinions attach here.
- **Approved** — vote threshold met or organizer approved. Stays in queue with an Approved badge. Not auto-moved to Itinerary.
- **Scheduled** — promoted deliberately to the Itinerary with a selected date and time.

**Collaboration emphasis:** "Get everyone on the same wave" is the guiding principle. Text, empty states, and prompts throughout the app encourage users to invite friends early, share their Must Dos, and react to proposals. Must Dos specifically prevent any one person's wishes from being ignored in group planning.

### Itinerary ↔ Vacation Days

Itinerary and Vacation Days read and write the same schedule model.

- "Today's schedule" on Vacation Days pulls directly from the Itinerary data model
- edits made on Vacation Days flow back to the Itinerary and vice versa
- the event detail view (attach expense, attach note, like, comment) is the same surface regardless of which page opened it
- open question: does Itinerary remain a separate sidebar tab during trip-in-progress, or collapse into Vacation Days?

### Scavenger Hunt in Vacation Days

Scavenger Hunt has its own sidebar tab and route (`/app/trips/[tripId]/scavenger-hunt`). Active challenges and progress are also surfaced inside the Vacation Days page while the trip is in progress, so travelers do not need to navigate away to see or check off challenges during the day.

### Scavenger Hunt Feature Design

Scavenger Hunt is intentionally feature-rich — complexity drives re-opens, and re-opens drive ad time. Each challenge completion is a reason to open the app. A family of 5 doing a 10-challenge hunt is 50+ app sessions.

**Challenge types:**
- Photo submission (participant uploads a photo to complete)
- Location check-in (arrive at a specific spot)
- Trivia question (text answer, organizer sets correct answer)
- QR code scan (organizer generates, placed at a real-world location)
- Text answer (open-ended or exact match)

**Engagement mechanics:**
- **Sequential unlocking** — challenges reveal one at a time after each completion; forces repeated re-opens
- **Point system + live leaderboard** — visible to all participants; competition drives check-ins
- **Hint system** — organizer sets optional hints per challenge; participants unlock hints at a point penalty
- **Timed challenges** — "complete before 6pm" adds urgency
- **Team vs individual mode** — organizer chooses at hunt creation
- **Push notification on unlock** — "Your next challenge is ready" guarantees a re-open
- **Organizer live dashboard** — real-time view of everyone's progress
- **Completion celebration** — water-themed animation burst on challenge completion

## TripWave as Single Source of Truth

TripWave does not search for or book flights or hotels. Users book externally (Delta, Booking.com, Airbnb, etc.) and then enter every detail into TripWave. After that, they never need to reopen those apps or dig through confirmation emails — TripWave has everything.

**The goal:** a user who has finished preplanning should be able to leave their house with only TripWave open and have every piece of trip information they need — gate, seat, hotel address, check-in time, confirmation numbers, emergency contacts, visa requirements, everything.

This philosophy drives the preplanning fields to be exhaustive. Every field a user would otherwise look up in a third-party app should be capturable here. The more complete TripWave is, the stickier it becomes.

## Approval Modes

Every trip has an approval mode controlling who can change shared content. Organizer sets this during trip creation and can change it in trip settings.

- **Open** — any participant can add, edit, or remove items without approval
- **Vote** — changes require majority support (threshold configurable by organizer, default 60%)
- **Gated** — all additions and changes require organizer approval before they land

**How votes close (Vote mode only):**
- All eligible participants have voted
- An end date and time is reached (optional, set when the vote is created)
- The organizer or the vote's creator manually closes it

Approved items receive an Approved badge in the Proposed queue. They do not auto-move to the Itinerary. Promotion is a deliberate action that requires selecting a date and time.

## Communication Tools

TripWave does not have group chat. Communication is structured, async, and purpose-built for trip coordination.

| Tool | Purpose | Storage |
|---|---|---|
| Activity feed | State-change log per trip (item added, voted, approved, promoted) — no free text | One row per action |
| Reactions | Emoji signal on proposals and events | One row per user per item |
| One-liner opinion | Short user take on a proposed item | One string per user per item |
| Nudge | Push notification to non-voters on a pending vote | Zero — fires and forgets |

**One-liner UX:** Quick-response chips ("I'm in", "Too expensive", "Love it") plus a text input (not textarea). One opinion per user per item — not a thread. 100 character cap enforces signal over debate.

**Activity feed:** Shows what changed, not what people said. Example entries: "Alex added Ramen at Ichiran", "Sam voted yes on teamLab Planets", "Jordan closed the vote." No free-form text. Replaces the "did you see the update?" message that would otherwise happen in group chat.

**Per-page onboarding tooltips:** The first time a user visits any trip workspace page, a brief popup explains the page's purpose with examples. Dismissed with "Got it" — stored in user preferences and never shown again for that page.

## Invite System

Invites use a general link (not per-person). Anyone with the link can join. The organizer controls entry via an approval setting chosen when generating the link.

**Invite link modes:**
- **Open** — anyone with the link joins instantly, no approval required
- **Approval required** — joiners are held in a pending state until the organizer accepts or declines; prevents unauthorized access if a link is forwarded

**Who can generate invite links:**
- Organizer always can
- Non-admin members can by default — organizer can disable this in trip settings

**Invite landing page (unauthenticated):** Shows the trip name, destination, dates, and organizer name. A brief line explains TripWave. CTA: "Join this trip — it's free." Signing up through an invite link skips the empty dashboard and drops the new user directly into the trip workspace, where the Must Dos prompt appears immediately.

QR code is always available as an alternative share method for the active invite link.

## Trip Overview Page

The trip overview (`/app/trips/[tripId]`) is a dynamic dashboard — its content changes based on the trip's current lifecycle state.

| State | Primary content |
|---|---|
| Draft / Planning | Preplanning progress, next best action, unscheduled Must Dos, upcoming milestones |
| Ready | Travel day readiness checklist, unresolved blockers, departure countdown |
| Travel Day | Group checklist status (who's done what), departure task summary |
| In Progress | Coming up today, today's highlights, recent polls, activity feed |
| Stale | Wrap-up summary (total spend, days, participants), unsettled expenses list, close-out CTA |
| Vaulted | Memory vault summary — read-only, trip stats, recap |

The activity feed (state-change log) appears on the In Progress overview as a scrollable section. It is also accessible from any trip page via the bell icon in the trip header.

## Empty State (New User Dashboard)

A user with no trips sees a single focused screen:
- Large CTA: "Plan your first trip"
- Tagline: "Invite your group, build your itinerary, and get everyone on the same wave"
- Brief instructions explaining what to do first
- Feature teasers showing what awaits them in the app

No demo trip, no feature tour wizard. The per-page tooltips handle teaching once they're inside a real trip.

## Expense Surface

Expenses are accessible from multiple entry points:

- primary: `/app/trips/[tripId]/expenses` — full ledger
- secondary: from within any calendar event in itinerary (attach expense to event)
- secondary: from preplanning (enter flight costs, hotel deposits, etc.)

All expense entry points write to the same ledger.

## Preplanning Surface

The preplanning wizard is a multi-section form organized by category:

1. Group composition
2. Transportation
3. Accommodations
4. Budget
5. Destination info
6. Documents and logistics
7. Trip character (type, vibe, wishlist, must-dos)
8. Pre-departure logistics

Progress through the preplanning wizard drives the trip ball fill. Sections can be completed in any order. Skipped or not-applicable sections are handled gracefully.

The preplanning page is a long scrollable form — not a step-by-step wizard. Users can see all sections at once, jump to what they know, skip what they don't, and return later without feeling blocked. Transition animations between sections (especially on mobile) make the experience feel fluid and dynamic rather than like a static form. Animations guide users forward and create a sense of momentum. The trip ball fill percentage is the progress indicator — not a wizard progress bar.

## Travel Day UI

Travel day and vacation day pages use a dedicated full-screen vertical timeline layout that overrides the standard trip workspace shell when active.

### Timeline layout

- single column, full viewport height
- tasks listed top to bottom in chronological order
- current (next incomplete) task is visually prominent near the top
- completed tasks remain visible below, dimmed and struck through
- phase nav and non-essential planning UI collapse to maximize timeline space
- the trip ball remains visible but reduced -- it is not the focus during execution

### Travel Day Checklist

Each traveler has their own personal travel day checklist. Checklists are independent — checking off "left house" only marks it for you, not your travel partner.

**Visibility toggle:** Each user can set their checklist to public (visible to the whole group) or private. Public checklists enable passive group coordination — "mom can check the app instead of texting to ask if I packed my passport."

**Combining checklists:** Two travelers (e.g., a couple) can combine their checklists into a side-by-side view. This is a display merge, not a data merge — each person still owns and checks off their own items. Uncombining is always clean because ownership never changed. The value is seeing both lists at once without switching views.

**Group status view:** When checklists are public, the trip overview (Travel Day state) shows a summary of everyone's progress — useful for seeing at a glance that mom and dad have landed while you're still at the airport.

### Mobile behavior

Travel day is the most mobile-centric view in the app. Design and build it for phone-first from the start:

- large tap targets on every task row (minimum 48px height, generous horizontal padding)
- one-tap check-off with no confirmation dialog
- no hover states -- everything works on touch
- auto-scroll animation after check-off brings the next task near the top of the viewport
- smooth eased scroll, not instant
- the entire viewport is dedicated to the timeline -- no side panels, no drawers

### Task customization surface

Users can edit the task list from two entry points:

- during planning: via the travel day setup screen in the trip workspace
- on the day: via an edit mode toggled from the active timeline view

Edits on the day do not overwrite the planning template.

## UX Rules For Structure

- **Button 3D treatment (global rule):** Every clickable button has a bottom border that gives it a raised, 3D feel. This applies only to buttons — not links, labels, or non-interactive elements. This trains users to quickly identify what can be clicked, especially on unfamiliar pages. It is a consistent visual contract across the entire app.
- **Animation philosophy (global rule):** The whole app should feel fluid. Animation direction is water and ocean-themed — fluid fills, ripples, wave-like motion — consistent with the tagline "get everyone on the same wave." The trip ball fills like liquid rising in a container, not a mechanical progress bar. Ripple animations give the ball personality. Page transitions, state changes, and micro-interactions all carry subtle fluid motion. Rules: animations must be fast (under 300ms), must never block interaction, and must not impact performance. App performance is always the highest priority — animations are personality, not spectacle. On mobile they feel essential; on desktop they are polish.
- every page should make the current trip and current phase obvious
- every phase page should show the next recommended action
- empty states must teach, not just inform
- travel day pages use the dedicated timeline layout, not the standard workspace shell
- information density should increase inside the app, but remain calm
- trip ball is always visible in the authenticated trip workspace (reduced during travel day active mode)
- ads are shown in designated slots on free tier only
- premium locks are visible but not punishing

## Placeholder Content Strategy

Until backend work lands, placeholder UI should explain:

- what this page will eventually do
- who it is for
- what actions belong here
- whether the feature is free, premium, or coming later

## Mobile Navigation Pattern

**Status:** Superseded 2026-04-20 by UX_SPEC.md § 42 (and specifically § 42.2 and § 20).

The previous hamburger-to-slide-in-sidebar pattern was deprecated in the shell grill. Canonical mobile nav is a horizontal scrollable phase pill bar pinned below the top bar — see UX_SPEC.md § 42.2 and § 42.3. No hamburger, no drawer, no bottom tab bar.

## Dream Trip Mode

Dream Trip is a mode flag on a normal trip — not a separate feature or data model. Users can mark any trip as a Dream Trip at creation or from trip settings.

**What it is:** Aspirational trip planning for experiences the user doesn't expect to take soon. A status symbol, a vision board, a fun planning exercise. Could be a $50k Japan fantasy or a backpacking trip a user is saving toward.

**What changes in Dream Mode:**
- Trip ball gets a distinct visual state/color — clearly differentiated from real trips in the dashboard
- Budget is aspirational — no overage warnings, no expense settlement logic
- Expenses are optional and untotaled — this is fantasy, not finance
- Public share link is on by default — Dream Trips are built to be shown off
- Vault entry feels like a vision board, not a trip summary
- "Make it real" button converts Dream Trip to a live trip — natural premium upsell moment

**What stays the same:** proposals, Must Dos, itinerary building, polls, wishlist, group collaboration. Full planning experience for a trip that may never happen.

**Why it works for the business:**
- Counts against trip slots — free users hit their 4-slot limit faster, driving premium upgrades
- Increases screen time with no additional operating cost (same infrastructure)
- Shareable by default — organic marketing and social proof
- "Make it real" conversion is a premium moment that feels earned, not forced

## Memory Vault (Vaulted Trip View)

When a user opens a vaulted trip, they see a dedicated memory experience — not the trip workspace in read-only mode. It should feel like walking down memory lane, not a frozen planning tool.

Design principles:
- Nostalgic tone — the ball sits in its faded, calm state
- Sidebar nav is gone or minimal; this is not a workspace
- Sections are collapsed by default, expanded by tapping — browsable at the user's pace
- Built for showing off: users can walk friends through what they did, where they went, what they spent
- Shareable public link lets non-account users view the vault (no account required to view)

Content:
- Trip summary card: destination(s), dates, participant count, total spend
- Expense breakdown: per-category and per-person
- Itinerary highlights: events promoted from proposals, key moments
- Must Dos: which ones made it, which didn't
- Participant recap field (free text, written at close-out)
- Photo-free — no image hosting; memory is built from structured data

## Account Settings (`/app/account`)

Four sections:

- **Profile** — name, email, and avatar. Avatars are customizable colored circles — no image uploads supported. No image hosting needed; fits the app's text-first philosophy. Avatar customization (color, style options) sits at the top of this section.
- **Notifications** — per-type push notification toggles. All notifications are on by default; users opt out of specific types.
- **Premium** — current plan status, trip slot usage counter ("3 of 4 slots used"), upgrade CTA for free users, or confirmation for premium holders.
- **Account** — change password, delete account.

Personalization beyond profile (ball color, trip vibe) lives inside each trip, not in account settings.

## Open Layout Questions

- Should the workspace overview be a separate page or integrated into the trip home?
- How visible should premium locks be inside the main trip flow?
- Should the trip ball click/tap open a health detail modal or expand inline?
- Should ad placement be above or below the main content area on mobile?
- Should the context panel (blockers, next action) be always visible or collapsible?
