# TripWave - Product Plan

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

Supporting project docs live alongside this plan:

- `docs/ROADMAP.md` for phased delivery
- `docs/BACKLOG.md` for active and upcoming work
- `docs/ARCHITECTURE.md` for technical direction
- `docs/LOGIC_FLOW.md` for product behavior and stage logic
- `docs/STATE_MODEL.md` for trip states, readiness, and next actions
- `docs/MONETIZATION.md` for premium and profit planning
- `docs/APP_STRUCTURE.md` for layout and route planning
- `docs/DESIGN_SYSTEM.md` for visual and UX rules
- `docs/DESIGN_ROADMAP.md` for design decision ordering
- `docs/DECISIONS.md` for decision history

## Working Product Summary

Build the most useful, personality-rich vacation planning app possible:

- easy enough for one primary organizer to run
- collaborative enough for groups to coordinate without chaos
- structured enough to guide the full trip lifecycle
- playful and sassy in tone without becoming confusing
- designed web-first, with mobile packaging later

## Core Product Vision

TripWave helps one organizer plan a vacation and invite other participants using a join code. The organizer manages the trip, itinerary, packing, travel-day checklists, group events, votes, expenses, and settlement.

The app guides users through distinct stages:

1. Setup
2. Preplanning
3. Itinerary building
4. Packing
5. Travel Day execution
6. On-trip coordination (Vacation Day)
7. Expense tracking and settlement
8. Post-trip wrap-up

At every stage, the app knows what phase the trip is in, what the most important next action is, and how ready the trip is. This intelligence is surfaced through the workspace header and the trip ball — the app's core visual identity.

## Product Principles

- Make planning feel organized, not overwhelming.
- Reduce the chance of forgetting something important.
- Make group travel less annoying.
- Keep the UI minimal, premium, and fun.
- Write copy with personality, but never at the expense of clarity.
- Build the web app first with a strong foundation for mobile packaging and offline support.
- Keep infrastructure costs low — build without paid APIs wherever possible.
- Free should prove the product. Premium should save the trip.

## Primary User Model

### Account Structure

- One account per user
- All app features require an account — no anonymous or guest access
- Free tier is ad-supported
- Premium is a one-time $5 purchase per account
- The paid user is the trip owner and organizer
- Other people join a trip via invite code or link and must create an account

### Organizer vs Participant

- Organizer: full control over the trip — creates, owns, manages settings, manages permissions
- Participants: join a trip, contribute based on permissions the organizer has set

### Permission Model

Organizer sets per-user permissions at trip creation (simple presets) and in trip settings (full toggle control per user). Granular features can be toggled on or off per user:

- add / edit / delete itinerary items
- view group packing lists
- add expenses
- start or vote on polls
- invite others

## The Trip Ball

The trip ball is the app's visual character and a core UX element. It represents the trip as a living thing.

- It appears as a dotted outline when a trip is new
- It fills from the center outward as preplanning is completed
- Users can choose its color (trip personalization)
- It has subtle implied personality through micro-animations — not a cartoon face
- It pulses with an ocean wave rhythm, not an electronic bounce
- It rolls between phases as the trip progresses
- It changes animation state to reflect trip health and urgency

The ball is always visible in the trip workspace.

## Key Features

### Preplanning Wizard

A comprehensive multi-section wizard capturing everything the app needs to guide the trip:

- group composition (travelers, ages, dietary, mobility, medical, emergency contacts)
- transportation (flying, driving, train — all relevant details, links to expense tracking)
- accommodations (lodging type, confirmation numbers, costs — links to expense tracking)
- budget (total, per-person, per-category)
- destination info (time zone, currency, visa, health entry, seasonal warnings)
- documents and logistics (passport, insurance, loyalty programs, embassy info)
- trip character (type, vibe, wishlist, must-dos, exclusions)
- pre-departure logistics (parking, house/pet arrangements)

Completion percentage drives the trip ball fill. Inapplicable fields are excluded from the denominator.

### Itinerary

- all participants can add itinerary items by default (organizer can restrict per user)
- supports events, reservations, notes, times, locations
- calendar event view and agenda view
- expenses can be logged from within events
- winning poll options can be promoted to itinerary items

### Packing

- personal by default
- users can optionally make their list visible to the group
- individual items can be marked private (hidden from all other users)
- destination-aware packing suggestions (premium — vibe and climate based)

### Travel Day

- checklist-driven execution mode
- ordered task groups with departure window, stopovers, and arrival steps
- when a travel day is active, the UI reorders around: what's next, what's overdue, required before departure
- non-essential planning UI collapses during active travel day

### Vacation Day

- daily briefing card
- today's schedule, next meetup, active reservations
- quick-add event and one-tap expense logging
- group vote prompts

### Expenses

- starts at day 0 — pre-trip costs logged during preplanning
- accommodations and transport costs from preplanning link automatically to the ledger
- add expenses anytime, including from within calendar events
- assign payer, split amounts per traveler (even or custom)
- settlement tracking: both parties mark independently; expense closes when both confirm
- full expense ledger with budget tracking and overage warnings
- end-of-trip summary from day 0 through return
- users can exclude specific expenses from specific reports
- receipt scanning via Azure OCR (premium)

### Polls

- free for all users
- polls expire, organizer can close manually
- winning options can become itinerary items

### Tools

- time zone info: home vs destination (free, no external API)
- currency converter: built into expense and budget flows (premium, free or self-managed rate source)

### Smart Suggestions (premium)

- vibe-aware: beach, city, adventure, family, etc. shape what is suggested
- destination-aware: international trips trigger document checklists, currency notes
- season-aware: warns about hurricane season, monsoon, extreme heat
- group-aware: kids and elderly trigger mobility and accessibility prompts
- deterministic rule-based logic in v1

## Monetization

### Free tier (ad-supported)

- full access to all core planning features
- ads shown on web and app
- polls, expense splitting, and settlement free for all users

### Premium — one-time $5

- removes all ads permanently
- offline mode (itinerary, travel-day, packing lists — high priority)
- receipt scanning (Azure OCR)
- currency converter
- smart suggestions
- advanced travel-day templates
- trip export
- trip templates (save and reuse structure)

### Infrastructure

- Vercel: hosting (shared $25/month plan)
- Neon: database (shared $25/month plan)
- Azure: receipt OCR (premium-gated, pay-per-use)
- Resend: transactional email (password reset, invite notifications)
- Payment processor: Stripe or equivalent for one-time $5 purchase

TripWave has no image hosting requirement. Data is primarily text, keeping storage costs minimal. Ad revenue is expected to cover Vercel and Neon costs.

## Marketing

### Slogan

**"Get everyone on the same wave."**

This is the official tagline. It speaks to the collaborative core of the product and ties directly to the TripWave name and ocean wave personality.

### Hero headline

**"Plan the trip. Not the group chat."**

Creates instant recognition of the core pain point. Used in the landing page hero section.

### Landing page structure

1. Hero -- trip ball animating. Short punchy headline. One CTA.
2. The problem -- group trip chaos. Relatable. Short.
3. The journey -- full trip lifecycle shown as a visual arc with the ball rolling through it.
4. Feature highlights -- travel day mode, expense tracking, wishlist, countdown. Each with a short visual.
5. The memory vault moment -- emotional close. "Every trip tells a story."
6. Pricing -- simple. Free gets you going. Five dollars and you are set for life.
7. Final CTA.

### Per-feature marketing angles

- **The Trip Ball** -- "Meet your trip." This is the marketing hero. Show it empty, filling, rolling, celebrating.
- **Travel Day Mode** -- "Game day has a playbook. So does your departure."
- **Activity Wishlist** -- "All those 'we should go here' ideas? They live here now."
- **Expense Tracking** -- "Every dollar tracked. Every debt settled. No awkward texts."
- **Countdown Widget** -- "The whole team can feel it coming."
- **Memory Vault** -- "Every trip tells a story. TripWave keeps it."
- **Read-Only Share Link** -- "Share the plan. Not the chaos."
- **Polls** -- "Stop the group chat spiral."
- **Offline Mode** -- "Your plan works even when the wifi does not."
- **Trip Duplication** -- "Your annual lake house trip. Pre-packed."

### Acquisition strategy

- The read-only share link is a free acquisition tool -- every shared itinerary is a TripWave ad.
- The memory vault public share is a free acquisition tool -- the circle breakdown is designed to be screenshot-worthy.
- TripWave branding appears on all public-facing views.
- A subtle "Plan your trip with TripWave" CTA lives on all public pages.

## Brand and Tone

### Name

TripWave (working -- not locked)

### Desired Personality

- sassy
- clever
- confident
- useful
- ocean-wave playful (not electronic, not corporate)

Tone should feel like a smart travel-savvy friend who keeps everyone on track.

### Tone Guardrails

- witty, not cringe
- playful, not chaotic
- direct, not cold
- stylish, not cluttered

## Visual Direction

- minimal, polished, slightly glassy
- slightly 3D, card-forward, modern
- layered cards, soft depth, clean whitespace
- intentional motion — the trip ball is the primary motion anchor
- strong typography (Fredoka + Nunito — working direction)
- Phosphor Icons (working direction)
- ocean wave rhythm for all pulse and transition animations

## Platform Strategy

### Initial Platform

- Next.js web app

### Later Platform Expansion

- package for iOS and Android after web product is stable
- PWA-first thinking, evaluate Capacitor later

## Technical Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Neon Postgres (shared plan)
- Vercel hosting (shared plan)
- Resend for transactional email
- Azure for receipt OCR (premium)
- ORM: Prisma or Drizzle (decision pending)
- Auth: Better Auth (configuration pending)
- Payment: Stripe or equivalent (for one-time $5 premium purchase)

Build without paid third-party APIs wherever possible. Smart suggestions use deterministic rules. Currency converter uses a free or self-managed rate source. Time zone info is computed from user data.

## Naming Ideas

Current working name: TripWave

Earlier candidates for reference:

- TripSnap, VacayBoss, Jetsetta, PackUp, TripSauce, GoSnappy, Plan the Damn Trip, Vacay IQ, TripFlex, Bestie Trip, TripFox, Pack Sass

Name should be fast, memorable, slightly sassy, and domain-available.

## UX Opportunities That Feel Special

- The trip ball: a visual character that grows with the trip, rolls between phases, and pulses like a wave
- Travel day mode that acts like a mission checklist
- Smart suggestions based on destination, vibe, and group composition
- Polls that convert to itinerary items
- Expense tracking that starts before the trip and closes at wrap-up
- Empty states that teach the user exactly what to do next
- Premium that feels like unlocking power, not removing features

## Risks and Constraints

- Collaboration complexity grows fast — keep permission model clear and simple
- Offline support is valuable but technically non-trivial — design for it early
- Azure OCR cost must be covered by premium volume — gate aggressively
- Per-user permission granularity needs careful UX so it doesn't feel like configuration hell
- Premium gating must feel enticing, not hostile

## Open Product Decisions

- Should one trip support multiple lodging locations? (multi-hotel itineraries)
- Should polls be organizer-creatable only, or can any participant start one?
- Should the trip ball be visible to all participants or only the organizer?
- Should smart suggestions be opt-in or shown by default?
- Should currency converter pull live rates or use daily snapshots?
- Should there be a per-trip premium option (one trip, not full account)?

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

Major product decisions locked:

- monetization: one-time $5 premium, ad-supported free tier
- tech stack confirmed: Vercel, Neon, Azure (OCR), Resend (email)
- account required for all app features — no anonymous access
- expense splitting and polls moved to free
- receipt scanning, offline mode, currency converter, smart suggestions confirmed as premium
- trip ball adopted as core visual identity and brand character
- preplanning wizard scope expanded to comprehensive field set
- per-user granular permissions model confirmed
- packing lists personal by default with optional visibility and per-item privacy
- expense tracking starts day 0 and links to preplanning entries
- build features without paid APIs wherever possible
- smart suggestions are vibe-aware and destination-aware (deterministic rules first)

## Next Recommended Actions

1. Discuss and finalize app shell layout and navigation model (desktop + mobile)
2. Confirm trip ball placement in the shell
3. Lock remaining design decisions before implementation begins
