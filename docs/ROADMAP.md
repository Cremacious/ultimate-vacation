# Roadmap

This roadmap is intentionally phased so we can build a stable, differentiated web product before chasing every advanced feature at once.

## Branching Strategy

All work happens directly on master until the foundation is complete. Foundation means: app shell, navigation, auth scaffold, trip workspace skeleton, and core component primitives. Once the foundation is stable, each feature gets its own branch.

Branch-per-feature workflow begins after foundation is done. Each feature branch maps to a discrete backlog item. This keeps early structural changes from causing conflicts in feature branches that diverge from moving ground.

## Phase 0 - Foundation

Goal: create a clear product direction, repo structure, and front-end foundation.

- [x] establish planning docs and decision log
- [x] scaffold Next.js app and initial routes
- [x] define brand direction and naming candidates (TripWave working)
- [x] identify MVP and premium boundaries
- [x] define trip state and next-action model
- [x] lock monetization model (one-time $7.99, ad-supported free, confirmed tech stack)
- [x] lock account requirement (full account required for all app features)
- [x] define trip ball concept as core visual identity
- [x] lock travel day UI as vertical timeline with auto-scroll (mobile-first)
- [ ] finalize product name
- [ ] define shell and navigation layout (next)
- [ ] lock trip lifecycle state and auto-phase rules (in progress)

Status: in progress

## Phase 1 - Design Lock

Goal: finalize all UX and visual decisions before any significant implementation begins.

- shell layout and nav model (desktop and mobile)
- trip ball design and animation system
- workspace logic surface layout (health, next action, blockers)
- phase-by-phase screen designs
- premium UX and paywall style
- ad placement zones
- motion and polish rules

Exit criteria:

- every major screen has a clear design direction
- no structural decisions remain that would cause rework after build starts

## Phase 2 - Product Skeleton

Goal: create a usable app shell that demonstrates the full trip lifecycle.

- landing page with clear product positioning
- auth shell (login, signup, password reset via Resend)
- dashboard shell
- trip workspace shell
- stage navigation for all phases
- trip ball component (static, then animated)
- placeholder states that explain what each area will do

Exit criteria:

- a user can understand the full app structure from the UI alone
- routes and layout support future authenticated flows

## Phase 3 - Core Planning MVP

Goal: ship the first truly useful planning version.

- full auth and account setup (Better Auth)
- create trip flow with simplified permission presets
- preplanning wizard (all field categories)
- preplanning completion tracking (drives ball fill)
- trip overview dashboard
- itinerary CRUD (all users can contribute by default)
- packing list CRUD (personal by default, optional visibility, per-item privacy)
- travel-day checklist CRUD
- expense tracking from day 0 (pre-trip costs, full ledger, splits, settlement)
- polls (free, all users)
- invite code model
- per-user permission management in trip settings
- basic premium entitlement check
- ad slot components with isPremium guard

Exit criteria:

- a trip organizer can create and manage a trip from preplanning through wrap-up
- the app supports the core planning loop before and during departure

## Phase 4 - Premium and Monetization

Goal: fully implement the monetization layer.

- one-time $7.99 premium purchase flow (Stripe)
- premium entitlement permanently unlocks ad removal and premium features
- offline mode for premium users (itinerary, travel-day, packing lists)
- receipt scanning via Azure OCR (premium)
- currency converter (premium, free or self-managed exchange rate source)
- smart suggestions engine (vibe-aware, destination-aware, group-aware — deterministic rules)
- advanced travel-day templates (premium)
- trip export (premium)
- ad network integration (free tier)
- upgrade prompts at high-intent moments

Exit criteria:

- premium purchase works end-to-end
- all premium features are gated correctly
- free tier is genuinely useful and ad-supported
- business model is operational

## Phase 5 - Group Coordination Polish

Goal: make collaboration feel smooth and intentional.

- shared schedule refinements
- group event and meetup coordination improvements
- richer poll UX
- notification strategy (Resend email)
- trip settings member management UI

Exit criteria:

- multiple travelers can coordinate inside one trip workspace
- group planning feels better than a shared notes doc and group chat

## Phase 6 - Reliability and Mobility

Goal: make the app dependable in real travel conditions.

- offline sync conflict resolution
- installable web experience (PWA)
- evaluate iOS and Android packaging path (Capacitor or PWA)

Exit criteria:

- trip schedule and checklist data remain useful with spotty connectivity

## Phase 7 - Premium Expansion

Goal: increase product depth and monetization without bloating the core.

- trip templates (save and reuse structure)
- reusable packing templates
- richer smart suggestions
- premium polish and conversion experiments
- pricing experiments and retention refinement
- explore: post-trip memory vault
- explore: trip health score as visible label
- explore: calendar import and export
- explore: family mode

## Open Sequencing Questions

- Should offline support appear earlier than Phase 6?
- Should trip export land in Phase 3 or Phase 4?
- Is Capacitor packaging viable before a full PWA pass?
