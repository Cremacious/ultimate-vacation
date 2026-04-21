# Roadmap

> **2026-04-21 Launch-scope grill (supersedes Public MVP scope + Post-MVP ordering below)**
>
> Launch scope narrowed. Public MVP ships with:
> - Full spine (auth · trip create · invite · expenses · itinerary · Home · notifications bell · static trip ball · marketing landing)
> - Stripe Supporter sheet — **1 premium feature at launch: ad removal only** (receipt scanning moves to post-launch month 2)
> - **Ad banner on Home page only** (not itinerary, expenses, Basics, Travel Day, or any moat-adjacent surface)
> - **Booking.com hotel affiliate chip on lodging itinerary items only** (Skyscanner + Viator defer to post-launch weeks 2–3)
> - **Travel Day: static planning checklist + "Generate from trip" button only** (focus mode, per-member view, skip semantics defer to month 2)
> - Founder's pricing tier live, analytics funnel wired, legal/privacy/terms/contact stubs, 404/error pages
>
> **Cut from Public MVP:**
> - **Dream Mode** (even the stripped version) — moves to post-launch weeks 4–6
> - **Basics hub entirely** — budget becomes an inline field on the trip Overview; hub returns at v1.1 when 3+ sections are ready
> - **Receipt scanning** — month 2
> - **Travel Day focus mode + per-member view** — month 2
> - Second/third affiliate partners (Skyscanner, Viator)
>
> **Post-MVP priority order (updated):**
> 1. Stripped Dream Mode (weeks 4–6)
> 2. Skyscanner affiliate chip (week 2–3)
> 3. Receipt scanning premium feature (month 2)
> 4. Travel Day focus mode + per-member view + skip semantics (month 2)
> 5. Viator affiliate chip (month 2)
> 6. Full ad banner rollout — Basics cards, vault, additional permitted zones (month 2)
> 7. Basics hub full (3+ sections) (month 2+)
> 8. Afterglow / memory recap (month 3)
> 9. Native iOS + Android ship (month 3–6)
> 10. Today (Vacation Day) full build
> 11. Trip-ball modal + color picker + motion polish
> 12. Remaining 5 premium features (offline, currency converter, smart suggestions, templates, export, trip duplication)
> 13. Wishlist, Polls, Notes, Vault, Scavenger Hunt (months 3–6)
> 14. Advanced permission toggles, traveler profile editor
> 15. CRDTs / Yjs if last-write-wins breaks
>
> **First-run onboarding at launch:** sign up → trip-create first-run → invite step featured. Skip Home on first login.
>
> **Launch tagline: "The group trip app that actually splits the bill."** Brand tagline *"Plan the trip. Not the group chat."* preserved for post-launch.
>
> **Non-organizer member permissions at launch:** view + log expenses + check packing; itinerary edits gated to Trusted+. (Degrades to view+expenses-only if role UI isn't ready.)
>
> Full rationale: DECISIONS.md entry *2026-04-21 — Launch-scope grill: 11 decisions locked (Public MVP = v1 launch).*

> **2026-04-20 Naming Audit — see docs/NAMING.md**
>
> Forward-work renames: Vacation Day → **Today** · Preplan → **Basics** · Tools Hub → **Tools** · Memory recap → **Afterglow** · Dashboard → **Home** · Premium (user-facing) → **Supporter**. Post-MVP list items below reference these new names going forward.

> **2026-04-20 Roadmap Grill — Canonical Doctrine (supersedes all prior phasing)**
>
> This block is the authoritative scope hierarchy. Prior sections of this file describe the decision history and remain as context, but when any conflict arises, this doctrine wins.

---

## 🎯 Beachhead user

22–28-year-old friend-group organizers planning bachelorette / birthday / ski / girls-trip / Tulum-style group vacations. The product's copy, defaults, example flows, and aesthetic all assume this archetype.

## 🪝 Acquisition vector

**One vector only: the organizer.** Members arrive via invite link. There is no cold "Splitwise-style" entry. Every non-spine feature is evaluated against: *does this make the organizer more likely to send the invite?*

## 🛡 Moat

**Integrated expenses.** Once two members log against each other inside TripWave, the ledger is sticky and the group can't leave. Expenses ships polished to screenshot-worthy quality — it is not bolted on last.

## 🔁 Retention philosophy

**Episodic, not daily.** 2–4 trips/year per organizer. No streaks, no daily pushes, no feed. Dream Mode serves as *ambient availability* between trips — available if the user opens the app, never pushed to pull them back.

## 📏 Success metric

**Settled trips with ≥2 expense-logging members.** One metric. One funnel (sign-up → trip created → invite accepted → first expense → second expense by second member → trip end date passed → marked settled).

Targets:
- **Beta (Month 3):** 10 settled trips
- **Public launch (Month 6):** 100 settled trips
- **Year 1:** 1,000 settled trips

---

## 🏗 90-Day Private Beta Scope (weeks 1–12, ~20 personal-network users)

*Goal: prove the spine loop works end-to-end with a real group. Acquisition and revenue are out of scope here.*

> **Canonical build order: see BACKLOG.md → "12-step build order."** Locked 2026-04-20. **Chunk 4 (invite flow) is the beta pivot** — the first moment TripWave is testable by real users. Anything that delays Chunk 4 does not ship in beta.

| Weeks | Scope |
|---|---|
| 1–2 | **Foundation** — ORM install (Drizzle) · DB schema applied · Better Auth wired · app shell connected to real data |
| 3–4 | **Trip creation** (real trips only; dream toggle stubbed) · trip overview · **invite flow** (create link, accept, join) |
| 5–6 | **Expenses polished to moat-quality** — balances hero · add expense · split (equal / by-share / by-amount) · multi-currency · settle via Venmo/Zelle deep-links · manual receipt attachment |
| 7–8 | **Itinerary day-by-day CRUD** · one preplan section (budget only) · soft-conflict toast on field-level concurrent edits within 10s |
| 9–10 | **Travel Day checklist** (no focus mode) · notifications bell (in-app only) · trip ball (static, no modal) · **between-trips home state** (minimal: "Start a new trip" / "Duplicate past trip") |
| 11–12 | Beta onboarding of ~20 personal-network users · analytics funnel implementation · bug-bash · observability |

**Explicitly NOT in beta:** Dream Mode, affiliate, Stripe, premium sheet, ads, Vacation Day, Memory recap, Vault, Tools hub, polls, wishlist, scavenger hunt, notes, trip-ball modal, Travel Day focus mode, additional preplan sections.

---

## 🚀 Public MVP Scope (weeks 13–24 — public launch window)

*Goal: acquisition engine + revenue online. Everything in beta, polished with beta feedback, plus:*

- **Stripped Dream Mode** — create dream trip (real-trip creation flow with one toggle) · hero image (Unsplash picker) · public shareable URL (`/d/{slug}`) · title · destination · vibe tag · 3–5 placeholder itinerary items. **No** reactions, comments, save-to-dreams, mood boards, vibe themes.
- **Affiliate chips in itinerary** — Booking.com, Skyscanner, Viator. Live affiliate IDs. This is the primary revenue lever.
- **Stripe premium purchase sheet** — 2 features only at v1: **ad removal** + **receipt scanning**. Framed as supporter thank-you per MONETIZATION.md.
- **Ad banner** (AdMob or AdSense) — permitted zones only (dashboard idle, vault, 3rd-4th preplan section). Never in Travel Day, expense entry, onboarding, invite flow, modals.
- **Founder's pricing tier** — $2.99 for first 1,000 buyers; $4.99 standard thereafter.
- **Legal · contact · App Store assets** — privacy policy, terms, contact stub, App Store copy, story-arc screenshots.
- **Native wrap scoped** — Expo / React Native decision made; may not ship at launch but is actively in progress.

---

## 📦 Post-MVP Scope (priority-ordered, post-launch)

1. **Native iOS + Android ship** (target Month 3–6 post-launch)
2. Vacation Day (full: morning briefing, ambient polish)
3. Travel Day focus mode (airport phases, calm layout)
4. Memory / wrap-up recap
5. Trip-ball modal (breakdown + color picker)
6. Remaining preplan sections (travel, stay, vibe, who's coming)
7. Dream Mode full (reactions · comments · save-to-dreams · mood boards · vibe themes)
8. Polls
9. Wishlist
10. Notes feed
11. Tools hub
12. Vault
13. Remaining 6 premium features (offline mode · smart suggestions · trip templates · export · duplication · currency converter)
14. Advanced permission toggles
15. CRDT-based real-time collab (replace last-write-wins)
16. Scavenger Hunt

---

## 🧭 Net changes this doctrine locks

- "MVP" split into **Beta (90d)** + **Public MVP (wk 13–24)**. Prior 16-item MVP list collapses into these tiers.
- Expenses moves ahead of itinerary in sequence (weeks 5–6 vs 7–8).
- Dream Mode reclassified Speculative → stripped in Public MVP.
- Premium feature count reduced 8 → 2 at v1; other 6 move Post-MVP.
- Affiliate promoted to spine-tier (ships at Public MVP, not post-launch polish).
- "Pay-arena-as-cold-wedge" framing killed. One acquisition vector: organizer.
- "Between-trips engagement" reworded to "ambient availability." No pushes.
- Between-trips home state added to beta scope (new).
- Success metric locked: settled trips with ≥2 expense-logging members.
- Real-time collab: last-write-wins + conflict toast; CRDTs Post-MVP.
- Native wrap: scoped in Public MVP, ships Month 3–6 post-launch.

Full rationale: DECISIONS.md entry *2026-04-20 — Roadmap grill: 11 decisions locked (re-grill corrected).*

---

## Legacy phasing (pre-grill context; superseded by doctrine above)

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
- [x] lock monetization model (one-time $4.99, ad-supported free, confirmed tech stack)
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

- one-time $4.99 premium purchase flow (Stripe)
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
- Founder pricing transition logic ($2.99 → $4.99 cap trigger)
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

---

## Post-MVP Feature Backlog

Items moved from BACKLOG.md (2026-04-20). These are Later or Speculative per CORE_LOOP.md. Pull into active backlog only after the spine is live and stable.

### Social Layer

- Add likes/reactions to itinerary events, wishlist items, notes posts, expenses, poll options
- Add comments to itinerary events, wishlist items, notes posts, expenses
- Add favorites to itinerary events, wishlist items, notes posts; favorites list view in account area
- Notification triggers for comments, likes, reactions
- Push notifications (deferred to native app build)

### Collaboration (beyond spine invite/permissions)

- QR code version of active invite link
- Per-user permission management UI (trip settings → click user → role selector + individual toggles)
- Notification settings: per-type push toggle in account settings (all on by default)

### Vacation Day

- Vacation Day page (full build per UX_SPEC § 10 and § 39)
- Activity strip: horizontal scroll of today's events
- Scavenger Hunt pill strip embedded in Vacation Day
- Long-press action sheet on events; swipe-right minimal capture
- Auto-completion: events drift away when end time passes; long-press override

### Packing Page

- Packing page (full build per UX_SPEC § 8 and § 37)
- My list + Group list tabs with category behavior
- Drag-to-reorder categories; inline item edit
- Cross-member visibility rules

### Polls Page

- Polls page (full build per UX_SPEC § 12)
- Animated voting pill cards; anonymous mode; blocking flag badge
- Convert-to-itinerary action on closed polls

### Wishlist Page

- Wishlist page (full build per UX_SPEC § 13)
- "The group is into" hot section; self-like exclusion
- Promote to itinerary with undo toast; Vaulted persistence

### Notes

- Notes feed (shared + personal per UX_SPEC § 14)
- Event-attached notes inline in event detail
- Likes and comments on shared notes

### Scavenger Hunt (full build)

- Scavenger Hunt page (full build per UX_SPEC § 43)
- Member-suggest pending queue; organizer approve/reject
- Competitive mode; group vs individual completion; photo evidence
- Vacation Day pill strip; pre-trip teaser; points 1–10; leaderboard

### Vault / Memory

- Vault page (confirmation number storage, document shelf per UX_SPEC § 15)
- Auto-generate memory artifact at trip wrap-up
- Shareable public link; read-only after 30-day grace period

### Tools Hub

- Tools hub page (smart card surfacing + catalog per UX_SPEC § 16)
- Time zone info (no API); currency converter (premium); unit converter
- Quick bill splitter; departure day brief card; meetup point broadcaster

### Premium Features (post-spine implementation)

- Offline mode: service worker + write queue + conflict resolution (premium)
- Receipt scanning: Azure OCR wired end-to-end (premium stub exists from spine build)
- Currency converter: live conversion in expense entry and budget views (premium)
- Smart suggestions engine: vibe-aware + destination-aware deterministic rules (premium)
- Trip export: itinerary as printable/shareable format (premium)
- Trip templates: save and reuse a trip structure (premium; speculative per CORE_LOOP)
- Advanced travel-day templates (premium)

### Dream Mode (slim version — speculative)

- Real vs Dream picker wired in creation flow
- Shimmer / sparkle ball variant for dreams
- "This is a dream" persistent chip on every dream workspace page
- Public share link on by default; reactions + save-to-my-dreams
- Hide Travel Day / Vacation Day / Memory phases in dream workspaces
- Dream-slot pool separate from real-trip slots (free: 1, premium: unlimited)
- Private-dream toggle (premium supporter bonus)

### Trip Duplication (premium — speculative)

- Duplicate trip action (organizer only, premium)
- Copy: trip type, vibe, packing structure, travel day task groups, permission presets
- Exclude: dates, participants, expenses, itinerary events, confirmation numbers

### Planning Tools

- Open-Meteo weather integration (free API, ships with Vacation Day)
- Jet lag calculator (time zone difference, sleep strategy)
- Packing calculator (trip length + climate + activities → suggested list)
- Group availability checker (manual date entry, overlap view)
- Pre-trip shared shopping list (collaborative, assignable, optional expense link)

### Destination Reference Tools

- Language phrasebook (static, curated, offline download for premium)
- Allergy and medical card generator (pre-built translations, printable)
- Tipping guide (country-by-country, static lookup)
- Voltage and adapter guide (plug type, local voltage, converter needed)
- Driving and transit basics (road side, speed units, IDP requirement)
- Emergency contacts card (auto-generated per destination, always free + offline)
- Unit converter (temperature, distance, weight, liquid, speed — no API)

### During-Trip Coordination

- Quick thumbs vote (single yes/no, closes on full vote or organizer close)
- Departure day brief card (surfaces night before any travel day)

### Memory and Documentation

- Confirmation number vault (label, code, provider, date, notes — per UX_SPEC § 15)
- Trip statistics generator (auto at wrap-up: days, total spend, events, participants)
- Post-trip poll (organizer creates or auto-generated)

### Smart and Proactive Tools

- Seasonal warning system (hurricane, monsoon, extreme heat, jellyfish, polar night — deterministic rules)
- Local public holiday alerts (closure + festival alerts by country and date)
- Document checklist generator (deterministic rules by destination + trip type)
- Visa and health entry requirements (deterministic lookup)

### Accessibility and Comfort

- Accessibility needs flags in user profile (mobility, dietary, sensory, service animal)
- Group-level accessibility summary for organizer
- Medication reminder (time-based, time zone aware, private to user)
- Kids and family mode prompts (trigger when children flagged)

### Countdown Widget

- Countdown component (days until departure)
- Display state changes by threshold (60, 30, 14, 7, 1 days, departure day)
- "Day X of Y" during trip; nostalgic completed state after

### Read-Only Share Link (always free)

- Organizer generates public read-only itinerary link (no account required to view)
- Always excludes expenses, packing, private notes, polls
- TripWave branding + "Plan your trip" CTA; revoke action in settings

### Contingency Levers (build only when behind-target triggers activate)

Tier 2 (25%+ behind by year 2):
- Family plan SKU ($14.99 one-time: primary + 3 household accounts, all premium)
- Curated public Dream Mode landing pages as SEO bait
- Editorial pitch template for travel publications

Tier 3 (40%+ behind by year 3):
- Price-raise infrastructure ($4.99 → $9.99 for new purchases; grandfather existing)
- Free-tier slot-count reduction (4 → 3 slots with in-app communication)
- Rewarded video ad for bonus slot earning (30-second video, capped at +1/year)

### Research Queue

- Evaluate PWA-first mobile strategy vs Capacitor later
- Explore map and place integrations for itinerary events
- Explore calendar import and export needs
- Finalize product name (TripWave is working, not locked)
- Ad network selection (Google AdSense, Carbon, mediation) and unit ID setup
- Affiliate program onboarding (Booking.com and Skyscanner as first two)
- Affiliate legal compliance and disclosure copy
- Evaluate Azure OCR pricing at expected premium user volume
- Evaluate whether smart suggestions can be built entirely with deterministic rules
