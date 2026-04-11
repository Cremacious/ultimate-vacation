# Backlog

This backlog is meant to stay human-readable. It should help us choose the next best thing to build without needing a separate project tool yet.

## P0 - Active Foundation Work

### Product and planning

- [x] Create living product plan
- [x] Create roadmap, backlog, architecture, and design docs
- [x] Design and document app logic flow
- [x] Draft state model and monetization strategy docs
- [ ] Finalize initial product name shortlist
- [ ] Decide free vs premium boundary for core collaboration
- [ ] Lock MVP trip lifecycle states and auto-phase rules
- [ ] Lock first premium tier and paywall boundaries

### Frontend foundation

- [x] Scaffold Next.js project
- [x] Replace starter landing page
- [x] Create workspace placeholder route
- [ ] Build shared app shell layout
- [ ] Add reusable section and panel primitives

### Technical foundation

- [ ] Choose ORM: Prisma vs Drizzle
- [ ] Define initial database schema draft
- [ ] Model trip status, readiness, and next-action fields
- [ ] Add environment variable strategy
- [ ] Decide auth provider direction

## P1 - MVP Build

### Trip creation and structure

- [ ] Create trip onboarding flow
- [ ] Model trip phases and stage progress
- [ ] Model trip lifecycle statuses and readiness logic
- [ ] Define next best action computation rules
- [ ] Add trip dashboard overview
- [ ] Add destination and travel basics capture
- [ ] Define setup-complete criteria in product and schema terms

### Itinerary

- [ ] Add itinerary item model
- [ ] Create itinerary list and day view
- [ ] Support event notes, times, and locations

### Packing

- [ ] Add packing list model
- [ ] Support personal and shared packing lists
- [ ] Add suggestion placeholders for destination-aware recommendations

### Travel day

- [ ] Add travel-day schedule model
- [ ] Create checklist-driven travel day page
- [ ] Support ordered tasks and completion state
- [ ] Define active travel-day UI override behavior

## P2 - Collaboration

- [ ] Add invite code workflow
- [ ] Define member roles and permissions
- [ ] Add polls and voting
- [ ] Add group event decision UX

## P2 - Monetization

- [ ] Define subscription tiers
- [ ] Mark premium-only capabilities in UI
- [ ] Plan billing architecture with Stripe
- [ ] Design upgrade prompts for travel day, polls, expenses, and offline mode
- [ ] Decide whether to offer one-trip premium pass later

## P3 - Expenses and Advanced Features

- [ ] Add budgets
- [ ] Add expense splitting
- [ ] Add settle-up summary
- [ ] Research receipt scanning cost and feasibility
- [ ] Plan offline storage and sync behavior

## Research Queue

- [ ] Evaluate PWA-first mobile strategy vs Capacitor later
- [ ] Explore map/place integrations for events
- [ ] Explore calendar import/export needs
- [ ] Explore domain and naming availability
- [ ] Decide lightweight join flow vs full account requirement timing

## Ready Next

The strongest next implementation items are:

1. trip state object and readiness schema draft
2. app shell layout around recommended phase and next action
3. route structure for trip phases
4. auth and trip creation direction
