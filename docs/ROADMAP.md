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

---

## Future Grill-Me Topics (deferred until core spine is proven)

The following UX, design, and monetization topics have been intentionally deferred. Do NOT grill on these until CORE_LOOP.md's 7-step spine is implemented in code. Revisit one at a time in future grill-me sessions after the spine is alive.

### Before any grill-me session on a page, apply the build workflow

Every grill-me session on a page must produce outputs in this order (per CORE_LOOP.md → Build Workflow):

1. **Step 1 -- Page detail definition**: inventory of what information, actions, states, edge cases, and ordering the page contains
2. **Step 2 -- UI mockup**: ASCII wireframe, Figma, or inline description matching those details
3. **Step 3 -- Code**: only after Steps 1 and 2 are locked

If a future grill-me session starts with visual decisions (palette, animation, micro-interactions) on a page that has NO detail inventory yet, stop and route back to Step 1 first. This discipline applies to every page -- even ones already specced in UX_SPEC for their fun treatment. The fun treatment is mostly Step 2-adjacent; the detail inventory (Step 1) is still owed for pages where it was skipped.

Log Step-1 detail inventories as work items in BACKLOG.md before UX_SPEC pages move to implementation.

### Anthropic Design plugin skills as mandatory quality gates

TripWave has the Anthropic Design plugin installed. Its six skills are mandatory workflow quality gates. Per CORE_LOOP.md → Build Workflow → "Anthropic Design plugin -- which skill to invoke at each step":

- Step 1 ambiguity → `/user-research`
- Step 2 mockup locked but not critiqued → `/design-critique`
- Step 2 introduces new component or pattern → `/design-system`
- Step 3 ready to implement → `/design-handoff`
- Step 3 ready to ship → `/accessibility-review`
- Post-launch feedback pile → `/research-synthesis`

Invoke via `/` in chat. Grill-me sessions on new pages MUST run `/design-critique` before locking. Pre-implementation MUST run `/design-handoff`. Pre-ship MUST run `/accessibility-review`. Skipping only allowed for tiny tweaks and bug fixes.

### Grill-Me Session Protocol (canonical, read-first for any session)

Every grill-me session on TripWave UI begins by reading docs/GRILL_PROTOCOL.md. That doc is the canonical rulebook for every Claude Code session on any machine. It defines when the agent actively prompts the user to invoke each design skill, provides the exact inline prompt copy, and requires every UI decision log entry to note which skills were run or skipped.

If you are an AI agent picking up this repo and running a grill-me session on UI, read docs/GRILL_PROTOCOL.md before beginning.

### Page-level UX fun treatments (deferred)

- Polls page -- neon fun treatment and animated voting cards
- Wishlist page -- hot-section visual emphasis, promote-to-itinerary animation
- Notes page -- social feed polish, reaction animations
- Vault page -- category sections visual design, "Needed today" pinned strip treatment
- Tools hub -- phase-surfaced card treatment, catalog browsing feel
- Memory / Wrap-up -- recap hero animation, highlights carousel, shareable recap page design
- Trip overview (brand-new) -- onboarding moment polish
- Trip overview (established) -- state-aware layout polish
- Invite organizer page -- share card visual, invited-list animation
- Invitee join landing -- branded join page visual
- Members / permissions page -- preset dropdown polish, customize panel animation
- Settings pages -- sub-route navigation feel, danger zone confirmations
- Account page -- profile editor, preferences, solo-dev About section
- Notification bell panel -- real-time toast appearance, dashboard action-center item shimmer
- Trip switcher dropdown -- ball-mini visuals, selection animation

### Feature-level UX (deferred)

- Individual preplanning section editors (8 sections -- currently only the hub is specced in depth)
- Expense split flow details (even / custom / selected / single-person split states)
- Settlement state transitions (partial settlements, disputes, mismatched marks)
- Traveler profile editor full field list + per-field privacy toggles
- Poll creation sheet + quick-vote mode details
- Reality Check flow (dropped from slim Dream Mode scope; may revisit)
- Mood board component (dropped from Dream Mode; may return as regular-trip feature)

### Architecture / platform (deferred until post-spine)

- Permissions engine -- full per-user toggle logic beyond presets
- Notification system -- real-time delivery, toast deduplication, subscription logic
- Offline mode -- service worker strategy, write queue, conflict resolution
- Premium entitlement engine -- platform reconciliation (Apple / Google / Stripe), grace periods, family-plan member tracking
- Trip state machine -- auto-phase transitions between draft / planning / ready / in_progress / completed
- Dynamic recommendation logic -- next best action engine, blocker detection
- Push notification infrastructure (native app phase)

### Monetization refinements (deferred)

- Ad network selection (AdMob vs AdSense vs mediation) and unit IDs
- Ad fill-rate monitoring and fallback behavior
- Affiliate program onboarding checklist and legal compliance
- Referral slot-reward cooldown tuning
- Founder's badge visual treatment
- Founder pricing transition logic ($4.99 → $7.99 cap trigger)
- Pre-launch landing page waitlist capture copy iteration
- Editorial pitch template for travel publications
- Post-1,000-sale review pass on conversion rate

### Brand and visual (deferred)

- Actual illustration assets for empty states (suitcase, ballot, vault door, etc.)
- Screenshot asset design for App Store story-arc
- Marketing site content beyond the landing page (pricing, legal, contact copy polish)
- Vibe theme catalog for Dream Mode -- dropped from slim scope, may return
- Printed trip recap export design (post-trip physical product, speculative)

### Scope discipline rule

Grill-me sessions resume on these topics only after the 7-step spine in CORE_LOOP.md is implemented and usable end-to-end. Until then, further design work on speculative features is recorded in this deferred queue -- not added to active UX_SPEC sections.
