# Ultimate Vacation - Product Plan

## Purpose

This repository will house a Next.js application for planning, organizing, and guiding users through vacations from the first idea to the last expense settlement.

This document is the living source of truth for:

- product direction
- UX principles
- monetization assumptions
- technical architecture
- phased roadmap
- naming ideas
- open questions and decisions

We will keep updating this file as the project evolves.

## Companion Docs

Supporting project docs now live alongside this plan:

- `docs/ROADMAP.md` for phased delivery
- `docs/BACKLOG.md` for active and upcoming work
- `docs/ARCHITECTURE.md` for technical direction
- `docs/LOGIC_FLOW.md` for product behavior and stage logic
- `docs/STATE_MODEL.md` for trip states, readiness, and next actions
- `docs/MONETIZATION.md` for premium and profit planning
- `docs/APP_STRUCTURE.md` for layout and route planning
- `docs/DESIGN_SYSTEM.md` for visual and UX rules
- `docs/DECISIONS.md` for decision history

## Working Product Summary

Build the most useful, personality-rich shared trip planner possible:

- easy enough for one primary organizer to run
- collaborative enough for groups to coordinate without chaos
- structured enough to guide the full trip lifecycle
- playful and sassy in tone without becoming confusing
- designed web-first, with mobile packaging later

### What This App Is NOT

This app does not search for flights, hotels, or travel services. It does not book anything. It is a shared coordination and execution tool — a place where everyone going on a trip can plan together, stay aligned, and actually get through the trip without chaos. Think of it as the group's shared brain, not a travel agent.

## Core Product Vision

The app helps one organizer create a trip (vacation, road trip, group outing, or any shared travel experience — not just traditional vacations) and invite participants using a 5 or 6-digit join code. The organizer is the admin and has the most control over trip details. All details including dates, name, and settings remain editable after creation because real trips change.

The app should guide users through distinct stages:

1. Preplanning
2. Itinerary building
3. Packing
4. Day-of-travel execution
5. On-trip coordination
6. Expense tracking and settlement
7. Post-trip wrap-up and repacking

The app is date-aware. It knows what day it is, and it automatically adjusts its focus to match the current day of the trip — whether that's a planning day, a travel day, or a vacation day in progress.

## Product Principles

- Make planning feel organized, not overwhelming.
- Reduce the chance of forgetting something important.
- Make group travel less annoying.
- Keep the UI minimal, premium, and fun.
- Write copy with personality, but never at the expense of clarity.
- Build the web app first with a strong foundation for mobile packaging and offline support.
- Keep infrastructure costs low.

## Primary User Model

### Account Structure

- One account per user
- Free tier exists with limits on active trips created
- Premium features sit behind a paywall
- The user who creates a trip is the admin/organizer and has the most control
- Other people can join a trip via invite link or 5 or 6-digit trip code
- Users can be members of multiple trips simultaneously (may require premium for more than one active trip)

### Assumption For Initial MVP

For the first version, we will treat invited users as trip participants inside a shared trip workspace, with the organizer acting as the primary admin.

We may later expand permissions into roles such as:

- owner
- co-planner
- participant
- viewer

## Key User Flows

### 1. Start a Trip

The organizer creates a trip and enters basics:

- destination
- dates
- travelers
- transport method
- lodging
- planning style
- budget target

### 2. Invite Group Members

The organizer shares a 5-digit trip code or invite link so others can join the trip workspace.

### 3. Preplanning Wizard

The app asks smart questions and suggests needs based on context:

- destination type
- climate
- travel method
- mobility needs
- bathroom-stop needs
- kids / grandparents / pets
- long-drive stop planning
- likely essentials such as sunscreen, chargers, meds, documents

### 4. Build the Itinerary

Users add:

- events
- reservations
- travel segments
- meet-up times
- notes
- calendar entries

### 5. Build Packing Lists

Each user creates their own private packing list. Lists are personal by default so people are not editing each other's packing. Context-aware suggestions are offered based on destination type, transport method, trip length, and any special needs noted (such as limited mobility).

When the trip is over and users are heading home, the app reuses the same packing list and prompts users to repack everything they originally brought. This is the repack flow — it helps prevent leaving things behind.

### 6. Set Travel Days

The organizer and participants designate which days are travel days. There can be more than two travel days — for example a departure day, a transit stop day, and a return day. Users manually choose which dates are travel days and what kind each one is.

### 7. Travel Day Mode

When a designated travel day arrives, the app shifts its focus entirely to that day's execution:

- wake up tasks
- get ready tasks
- load luggage
- document checks
- item checks
- departure checkpoints
- stopovers
- arrival steps

Travel day suggestions are informed by how the group is traveling (car, plane, boat, rail, etc.). A car trip gets different prompts than a flight. This is one of the strongest differentiators and should feel extremely polished.

### 8. On-Trip Coordination

During the trip, users can:

- view each day's calendar and schedule
- add or edit events (dinners, meetups, activities, etc.) with title, time, date, and notes
- vote on group decisions such as which restaurant to go to
- see meeting times and locations
- stay aligned even with spotty internet
- add notes at any point in the trip

### 9. Expense Tracking

Users can:

- record expenses
- scan receipts (premium only)
- track budgets
- split costs
- settle balances at the end

### 10. Vacation Timeline

After the trip, users can view a fun visual recap of the trip as a timeline — events, notes, and memories in order. This becomes a lightweight keepsake of the trip experience.

## Major Feature Areas

### Phase Guidance Engine

The app should always make clear what stage the trip is in:

- preplanning
- itinerary
- packing
- travel day
- vacation day
- wrap-up

Each stage should unlock relevant tools, prompts, and reminders.

### Calendar + Event System

Robust shared calendar features are core:

- single-day and multi-day events
- restaurant plans
- meeting locations
- ticketed activities
- reminders
- calendar views by day / agenda / trip

### Polls and Voting

To reduce group friction:

- propose options
- vote quickly
- see winner
- optionally allow organizer override

### Offline Access

Critical data should be available offline:

- itinerary
- key schedule
- travel-day checklist
- packing lists
- addresses
- reservation notes

### Expense and Settlement

Splitwise-like collaboration:

- who paid
- who owes
- budget progress
- settle up summary

## Monetization Direction

### Free Tier Ideas

- limited number of trips
- basic itinerary
- basic packing list
- limited collaborators

### Premium Tier Ideas

- unlimited trips
- advanced travel-day flows
- smart suggestions
- polls and voting
- expense splitting
- receipt scanning
- offline mode
- premium templates
- export / share features

### Revenue Principle

Optimize for low overhead and high margin:

- Vercel for app hosting
- Neon for database
- avoid unnecessary paid services early
- defer expensive AI or OCR flows until carefully scoped

## Brand and Tone

### Desired Personality

- sassy
- clever
- fun
- confident
- useful

Tone should feel like that one friend in the group who already has the itinerary printed, a snack bag packed, and a comeback ready for anyone who shows up late.

### Tone Guardrails

- witty, not cringe
- playful, not chaotic
- direct, not cold
- stylish, not cluttered
- fun throughout, including labels, empty states, tooltips, and button copy

## Visual Direction

The app has a distinct 1980s energy, inspired by the Go-Gos song Vacation. It should feel retro-pop and a little electric — like a vacation postcard that got put in a blender with a neon sign.

### Core aesthetic

- white or near-white base (the image reference is paint splatters on white — the white is just as important as the color)
- bold circles as a recurring motif: in backgrounds, accents, avatars, indicators, and decorative elements
- bright cyan-blue, hot yellow, and electric pink as the three primary colors — used confidently and often
- orange as an allowed accent but not a primary
- the color should feel energetic, not muddy — stay vivid and clean
- 1980s inspired without being a costume — no literal retro borders or pixelated fonts, but the color energy, the shapes, and the attitude should all feel era-adjacent

### Design rules

- circles and rounded forms everywhere: pill buttons, round avatars, circular decorative splashes, dot patterns
- bold typography with personality — headlines should have presence
- clean layouts that let the color do the work, not clutter
- keep app surfaces calmer and more operational than the marketing energy
- 3D ledged buttons and cards for tactile depth
- subtle glass where it helps, not everywhere
- intentional motion

We should avoid overdesigned travel cliches and generic SaaS purple.

## Platform Strategy

### Initial Platform

- Next.js web app first

### Later Platform Expansion

- package for iOS and Android after web product is stable
- likely use PWA-first thinking and evaluate Capacitor later

## Technical Direction

### Proposed Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui selectively, not blindly
- Vercel hosting
- Neon Postgres
- Prisma or Drizzle for database access
- NextAuth or Clerk-style auth alternative later
- Stripe for subscriptions later

### Initial Recommendation

Start simple with:

- Next.js
- TypeScript
- Tailwind
- ESLint
- app directory

Then add:

- database layer
- auth
- subscriptions
- offline support

in controlled phases.

### Recommended Data Domains

- users
- trips
- trip_members
- destinations
- itinerary_items
- travel_days
- checklists
- checklist_items
- packing_lists
- packing_items
- polls
- poll_options
- votes
- expenses
- expense_splits
- settlements

## Architecture Priorities

### MVP Priorities

The first build should emphasize:

1. clean app architecture
2. strong design foundation
3. trip creation flow
4. stage-based dashboard
5. itinerary basics
6. packing list basics
7. travel-day checklist basics

### Features To Delay Slightly

- receipt OCR
- advanced offline sync conflict handling
- native mobile packaging
- real-time collaboration polish
- complex permissions matrix

## Suggested Initial MVP Scope

### MVP v1

- landing page
- auth shell
- create trip flow
- trip dashboard
- phase-based navigation
- itinerary CRUD
- packing list CRUD
- travel-day checklist CRUD
- invite code model placeholder
- premium feature placeholders

### MVP v1.5

- shared calendar improvements
- polls / voting
- basic budgeting
- simple expense tracking

### MVP v2

- settle up flow
- offline support
- smarter suggestions
- receipt scanning
- mobile packaging

## Naming Ideas

We want something fast, memorable, and a little sassy. Early options:

- TripSnap
- VacayBoss
- Jetsetta
- PackUp
- TripSauce
- GoSnappy
- Plan the Damn Trip
- Vacay IQ
- TripFlex
- Bestie Trip
- TripFox
- Pack Sass

Current note: keep exploring names before brand lock-in. We should test names for domain and app-store friendliness later, but the in-product language should increasingly emphasize "shared trip planner" over "vacation-only tool."

## UX Opportunities That Feel Special

- A "travel day mode" that acts like a mission checklist — different per transport type.
- Smart suggestions based on destination, traveler needs, and special considerations like limited mobility.
- Group votes tied directly to calendar events to resolve disputes before they start.
- Private packing lists that flip into a repack checklist on the way home.
- A date-aware interface that shifts automatically to match where in the trip you are right now.
- A fun vacation timeline that becomes a passive keepsake as the trip unfolds.
- Empty states that teach the user exactly what to do next.
- A phase timeline that shows progress toward departure.

## Risks and Constraints

- Collaboration can become complex quickly.
- Offline support is valuable but technically non-trivial.
- Receipt scanning can introduce third-party cost.
- Multi-user trip permissions need careful product design.
- Premium gating must feel enticing, not hostile.

## Open Product Decisions

- Should invited users create full accounts immediately or join lightly first?
- Should one trip support multiple lodging locations?
- How opinionated should the planning wizard be?
- Is expense splitting free or premium?
- Will group members edit everything or only selected areas?
- Should travel-day mode support notifications in early versions?
- Should polls be tied to itinerary suggestions automatically?

## Immediate Build Plan

### Step 1

Create a beautiful but simple Next.js foundation with:

- app router
- TypeScript
- Tailwind
- initial landing page
- product direction baked into content and placeholder UI

### Step 2

Create a basic information architecture:

- marketing landing page
- app dashboard shell
- trip workspace shell
- placeholder cards for each trip stage

### Step 3

Prepare the app for backend integration:

- environment structure
- database folder
- future auth and billing placeholders

## Decisions We Are Making Right Now

- Build web-first in Next.js
- Keep infrastructure lean around Vercel + Neon
- Prioritize stable UX before mobile packaging
- Capture planning in-repo from day one
- Start with a strong product skeleton instead of rushing into backend complexity

## Session Notes

### 2026-04-11

Initial user vision captured:

- collaborative vacation planning app
- code-based invites
- free + premium model
- itinerary, packing, travel-day guidance, events, polls, expenses
- offline support goal
- sassy tone
- minimal 3D / glass UI
- web-first using Next.js
- low-cost infra using Vercel and Neon

### 2026-04-15

Major vision and design session. Full product rant captured and written into docs. Key decisions made:

**Product clarifications:**
- App is a coordination and execution tool — it does NOT search or book travel
- Supports trips of all kinds, not just vacations
- Invite code is 5 or 6 digits
- All trip details editable after creation
- Multiple travel days supported, manually designated by organizer
- App is date-aware and auto-shifts focus to match current day of trip
- Packing lists are private per user with a repack mode on the return leg
- Calendar events support optional group voting to resolve disputes
- Notes and a passive vacation timeline are features
- Transport mode (car, plane, rail, boat) drives travel day suggestions
- Accessibility and mobility-aware suggestions planned
- Receipt scanning confirmed as premium only

**Tech stack additions:**
- Better Auth confirmed for authentication
- Resend confirmed for transactional email
- iOS confirmed as Phase 2 mobile target (not Android first)

**Design locked:**
- Working name: **TripWave** (prototype — final name TBD)
- Aesthetic: 1980s Go-Gos Vacation energy, paint-pop color on white base
- Shape motif: circles everywhere — backgrounds, containers, avatars, icons
- Palette: cyan-blue (primary), hot yellow (energy), electric pink (accent), white (base)
- Display font: **Fredoka** — weight 600 for large display, weight 400 for section headings
- UI and body font: **Nunito**
- Icons: **Phosphor Icons** fill weight, icons inside colored circle containers
- Background circles: three tiers (large atmospheric, medium accent, small dots)

**Design roadmap status:**
- Round 1 (brand, name, tone, fonts, icons) — COMPLETE
- Round 2 (shell layout, nav) — NEXT

## Next Recommended Actions

1. Resume on desktop with Round 2 of the design roadmap — app shell layout, desktop nav model, mobile nav model, context panel behavior, trip switcher.
2. After shell is decided, move to Round 3 — readiness visualization and next-action UI.
3. Do not begin building until at least Round 2 is resolved so the shell structure does not need to be rebuilt.
4. When ready to code: install Fredoka and Nunito via next/font/google, install @phosphor-icons/react, install Better Auth, configure Resend.
