# Roadmap

This roadmap is intentionally phased so we can build a stable, differentiated web product before chasing every advanced feature at once.

## Phase 0 - Foundation

Goal: create a clear product direction, repo structure, and front-end foundation.

- establish planning docs and decision log
- scaffold Next.js app and initial routes
- define brand direction and naming candidates
- create app shell and layout strategy
- identify MVP and premium boundaries
- define trip state and next-action model

Status: in progress

## Phase 1 - Product Skeleton

Goal: create a usable app shell that demonstrates the full trip lifecycle.

- landing page with clear product positioning
- dashboard shell
- trip workspace shell
- stage navigation for preplanning, itinerary, packing, and travel day
- placeholder states that explain what each area will do

Exit criteria:

- a user can understand the full app structure from the UI alone
- routes and layout support future authenticated flows

## Phase 2 - Core Planning MVP

Goal: ship the first truly useful planning version.

- auth and account setup
- create trip flow
- trip overview dashboard
- itinerary CRUD
- packing list CRUD
- travel-day checklist CRUD
- invite code model
- basic premium placeholders and upgrade hooks

Exit criteria:

- a trip organizer can create and manage a trip
- the app supports the core planning loop before departure

## Phase 3 - Group Coordination

Goal: make the app collaborative enough for real group travel.

- trip membership and roles
- shared schedule improvements
- group events and meetup coordination
- polls and voting
- notifications strategy

Exit criteria:

- multiple travelers can coordinate inside one trip workspace
- group planning feels better than a shared notes doc and group chat

## Phase 4 - Money and Accountability

Goal: reduce the pain of shared travel expenses.

- budget tracking
- expense entry
- split logic
- settle-up summary
- receipt capture strategy

Exit criteria:

- users can track shared expenses and understand who owes what

## Phase 5 - Reliability and Mobility

Goal: make the app dependable in real travel conditions.

- offline access for critical trip data
- sync strategy for reconnect
- installable web experience
- evaluate iOS and Android packaging path

Exit criteria:

- trip schedule and checklist data remain useful with spotty connectivity

## Phase 6 - Premium Expansion

Goal: increase product depth and monetization without bloating the core.

- smart contextual suggestions
- travel templates
- advanced reminders
- richer collaboration controls
- premium polish and conversion experiments
- pricing experiments and retention refinement

## Open Sequencing Questions

- Should expense tracking land before polls, or vice versa?
- How early should offline support appear in the build plan?
- Is lightweight participant access needed before full auth complexity?
