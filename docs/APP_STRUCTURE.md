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

## Proposed Workspace Layout

This is a working model — shell design decisions come before implementation.

### Global app shell

- top navigation bar
- trip switcher
- account and premium entry point

### Trip workspace shell

- trip ball visible in workspace header (always present, compact during travel day active mode)
- phase navigation: left rail on desktop, collapsible sidebar on mobile (toggled via hamburger button in header)
- main content area for active phase
- context panel for recommended action, blockers, and alerts (integrated into workspace header or top of main content area)

### Trip Ball in workspace

The trip ball sits prominently in the trip workspace header area. Its fill, animation state, and color reflect the trip's current health and phase. Clicking or tapping the ball opens trip health details. It is always visible during active trip planning.

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

Trips move through a defined set of states. The workspace UI, trip ball behavior, and overview page content all respond to the current state automatically — with one manual exception.

| State | Condition | Overview page focus |
|---|---|---|
| **Draft** | Created, setup incomplete | Push to complete setup |
| **Planning** | Setup done, pre-departure | Preplanning progress, next best action, unscheduled Must Dos |
| **Ready** | Preplanning complete, departure approaching | Travel day readiness, unresolved blockers |
| **Travel Day** | Manually triggered by organizer on departure day | Group checklist status, everyone's progress, departure tasks |
| **In Progress** | Trip active (between departure and return dates) | Today's highlights, coming up today, recent polls, activity feed |
| **Stale** | Return date passed, not closed out | Wrap-up summary, unsettled expenses, close-out CTA |
| **Vaulted** | Closed out by organizer | Memory vault — read-only, browsable, shareable |

Phase transitions are date-driven and automatic. The Travel Day state is the only manually triggered transition — organizers tap "We're off" because real-world departures can be delayed and the app shouldn't assume.

Stale trips can still be edited (add forgotten expenses, update notes). No nudge is sent for stale trips — the slot limit creates natural pressure. Users who want to create a new trip eventually have to close one out.

## Trip Creation Flow

Trip creation follows an invite-first, async-collaborative flow:

1. **Create blank trip** — organizer enters the trip name and at least one destination to create the shell
2. **Invite participants** — organizer adds friends immediately, before setup is complete; all participants can begin contributing their Must Dos and reacting to proposals from the start
3. **Async collaborative setup** — organizer and participants fill in preplanning details at their own pace; changes appear when others refresh or re-open the app; no real-time sync required
4. **Trip workspace** — everyone lands in the full workspace; preplanning remains editable at any time

Participants join before the plan solidifies so they can add their Must Dos and vote on early proposals. The invite step is the second screen after trip creation — not an afterthought.

**Participant first action:** When a participant joins (via invite link or code), their first screen is a focused prompt — "What are your Must Dos for this trip?" — before they reach the full workspace. This seeds the Proposed queue with input from everyone on day one and immediately makes them a contributor rather than a viewer.

Setup captures only the high-level skeleton of the trip. All granular details (flight numbers, lodging confirmations, group member info, documents, etc.) live in Preplanning.

### Setup form fields

- trip name
- one or more destinations (city + country, with rough arrival/departure dates)
- start date and end date
- transport mode multi-select (fly, drive, train, cruise — multiple allowed)
- traveler count
- trip type and vibe
- ball color picker
- budget target, currency, type (total or per-person)
- invite mode

After completing setup, the user lands on the Setup view page. A prompt guides them to continue into Preplanning to fill in the details.

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

On mobile, the left-rail sidebar is hidden by default and revealed via a toggle. This is the locked navigation pattern -- there is no bottom tab bar.

### Header bar on mobile

- hamburger toggle button on the left of the header
- trip name or logo in the center
- account avatar or notification bell on the right
- trip ball appears below the header bar in a compact strip, always visible

### Sidebar open state

- slides in from the left with a smooth animation
- covers approximately 80% of the viewport width (max 300px)
- a semi-transparent overlay covers the content behind it
- tapping the overlay or swiping the sidebar left closes it
- sidebar uses the elevated surface color from the dark UI palette

### Sidebar contents

1. trip name and compact trip ball indicator at the top
2. full phase navigation list with colored icons (same as desktop)
3. active phase highlighted, recommended phase badged
4. trip settings and account at the bottom

## Open Layout Questions

- Should the workspace overview be a separate page or integrated into the trip home?
- How visible should premium locks be inside the main trip flow?
- Should the trip ball click/tap open a health detail modal or expand inline?
- Should ad placement be above or below the main content area on mobile?
- Should the context panel (blockers, next action) be always visible or collapsible?
