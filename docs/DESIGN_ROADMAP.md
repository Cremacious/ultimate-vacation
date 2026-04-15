# Design Roadmap

This document breaks the design process into a decision order. The goal is to avoid designing screens before we decide the rules that should shape them.

## How We Will Work

We will lock design decisions in this order:

1. Brand and naming
2. Core visual system
3. App shell and navigation
4. Workspace logic surfaces
5. Phase-by-phase product screens
6. Monetization and premium UX
7. Motion and polish

Each section below lists:

- what we need to decide
- why it matters
- what output we want

## Phase 1 - Brand and Naming

### Decisions to make

- final product name
- short tagline
- how sassy vs polished the brand voice should be
- whether the brand feels more premium, playful, or balanced

### Why this matters

- it affects headlines, landing page tone, onboarding copy, and pricing voice

### Output

- approved name
- approved tone description
- 3 to 5 example brand lines

## Phase 2 - Core Visual System

### Decisions to make

- final palette
- typography direction
- icon style
- 3D surface rules
- glass usage rules
- border, shadow, and spacing rules

### Why this matters

- it becomes the house style for every page and component

### Output

- updated design system
- color tokens
- component material rules

## Phase 3 - App Shell and Navigation

### Decisions to make

- top-level app shell structure
- trip switcher behavior
- nav style on desktop
- nav style on mobile
- where premium and account live
- whether the context panel is always visible or conditional

### Why this matters

- this structure shapes every authenticated screen

### Output

- app shell layout spec
- desktop and mobile nav rules

## Phase 4 - Workspace Logic Surfaces

### Decisions to make

- how recommended phase is shown
- how next best action is shown
- how blockers are shown
- how readiness is shown
- how trip state is shown

### Why this matters

- this is where the product becomes meaningfully different from a generic planner

### Output

- trip workspace header model
- readiness / blocker / primary action UI rules

## Phase 5 - Phase-by-Phase Screens

We should design these in this order:

1. Setup
2. Overview
3. Travel Day
4. Itinerary
5. Packing
6. Vacation Day
7. Expenses
8. Group
9. Settings

### Why this order

- setup defines the trip object
- overview defines the command center
- travel day is the core differentiator
- itinerary and packing are core utility
- the rest can follow after the foundation is clear

## Phase 6 - Monetization and Premium UX

### Decisions to make

- exact free vs premium boundaries
- premium lock style
- upgrade prompt timing
- pricing page structure
- how aggressive or subtle upsells should feel

### Why this matters

- premium UX must feel integrated, not bolted on

### Output

- premium UX rules
- paywall style direction
- pricing screen requirements

## Phase 7 - Motion and Polish

### Decisions to make

- hero motion style
- page transition style
- hover behavior
- loading and skeleton style
- checklist completion feedback

### Why this matters

- motion should reinforce confidence and delight without making the app noisy

### Output

- motion rules
- interaction behavior guidance

## Decision Checklist

### Round 1 — Brand and Naming ✅ COMPLETE

- [x] Working app name — **TripWave** (prototype name, final name TBD before brand lock-in)
- [x] Tone — sassy, bubbly, fun, 1980s Go-Gos Vacation energy
- [x] Font direction — **Fredoka** (600 for large display, 400 for section headings) + **Nunito** (UI and body)
- [x] Icon style — **Phosphor Icons** fill weight, icons in colored circle containers
- [x] Visual aesthetic — white base, bold circles motif, cyan-blue / yellow / pink palette, 80s-inspired

### Round 2 — App Shell and Navigation ⬅️ NEXT

- [ ] Desktop nav model (top nav? left rail? hybrid?)
- [ ] Mobile nav model (bottom tabs? hamburger? collapsible?)
- [ ] Where premium and account controls live
- [ ] Whether the right context panel is always visible or conditional
- [ ] Trip switcher behavior

### Round 3 — Workspace Logic Surfaces

- [ ] How recommended phase is surfaced in the shell
- [ ] How next best action is displayed
- [ ] How blockers are shown
- [ ] How readiness score or tier is visualized
- [ ] How trip state is communicated

### Round 4 — Phase Screens (in this order)

- [ ] Setup page
- [ ] Overview / dashboard page
- [ ] Travel Day page (highest priority — core differentiator)
- [ ] Itinerary page
- [ ] Packing page
- [ ] Vacation Day page
- [ ] Expenses page
- [ ] Group page
- [ ] Settings page

### Round 5 — Monetization and Premium UX

- [ ] Exact free vs premium boundaries (some still open)
- [ ] Premium lock visual style
- [ ] Upgrade prompt timing and tone
- [ ] Pricing page structure

### Round 6 — Motion and Polish

- [ ] Page transition style
- [ ] Hover and interaction behaviors
- [ ] Loading and skeleton style
- [ ] Checklist completion feedback

## Recommended Working Order For Our Next Chats

### Round 1 ✅ Done

- [x] name
- [x] tone
- [x] font direction
- [x] icon style

### Round 2 ⬅️ Start here next session

- shell layout
- desktop nav model
- mobile nav model
- context panel behavior
- trip switcher

### Round 3

- readiness visualization
- next-action UI
- trip state display

### Round 4

- setup page
- overview page
- travel day page (do this one early — it is the key differentiator)

### Round 5

- itinerary
- packing
- vacation day
- expenses

### Round 6

- premium UX
- pricing
- upsells

### Round 7

- motion
- polish
- final consistency pass
