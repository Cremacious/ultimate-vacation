# Core Loop -- The Must-Prove Spine

> **2026-04-20 Naming Audit — see docs/NAMING.md**
>
> Canonical renames applied forward: Vacation Day → **Today** · Preplan / Preplan Hub → **Basics** · Tools Hub → **Tools** · Memory recap → **Afterglow** · Dashboard → **Home** · Premium (user-facing) → **Supporter** · In-progress (phase) → **Active**. Kept as-is: TripWave, Overview, Itinerary, Expenses, Packing, Travel Day, Budget, Invite, Wishlist, Polls, Scavenger Hunt, Dream Mode, Vault. Historical references in this file are not retroactively rewritten — NAMING.md is the source of truth for forward work.

> **2026-04-20 Roadmap Grill Revision (supersedes portions below)**
>
> The roadmap grill split the prior monolithic "MVP" into two distinct milestones: **90-day private beta** (spine validation) and **Public MVP** (weeks 13–24, acquisition + revenue live). The 16-item MVP list from earlier grills is collapsed into these two tiers. Where revision conflicts with older sections, revision wins.
>
> **Spine reframed as 3 arenas (not a linear 7-step waterfall):**
> **Plan** (trip, invite, preplan-budget, itinerary) · **Pay** (expenses) · **Go** (travel day checklist). The arenas support non-linear *intra-app* routing — a non-organizer member invited to a trip may skip straight to the expense tab — but they are not separate cold-acquisition wedges. The only acquisition vector is the organizer.
>
> **Expenses is the moat (Splitwise-killer).** Sequenced immediately after trip creation and polished to screenshot-worthy quality. Itinerary ships after expenses.
>
> **Beta-tier spine (ship in 90 days):** auth · trip creation · invite flow · expenses (polished) · itinerary CRUD · one preplan section (budget) · Travel Day checklist · trip ball (static) · notifications bell · between-trips home state · soft-conflict toast on concurrent edits.
>
> **Public-MVP additions (weeks 13–24):** stripped Dream Mode · affiliate chips in itinerary · Stripe premium sheet (2 features: ad removal + receipt scanning) · ad banner · founder's pricing tier · legal/contact/App Store assets · native wrap scoped.
>
> **Deferred from prior MVP → Post-MVP:** Vacation Day, Memory recap, Travel Day focus mode, Tools hub, Polls, Wishlist, trip-ball modal, advanced preplan sections, 6 of 8 premium features, CRDT collab.
>
> **Success metric:** *settled trips with ≥2 expense-logging members.* Year-1 target: 1,000. Supersedes any WAU/MAU framing.
>
> **Real-time collab:** optimistic UI + last-write-wins + soft conflict toast on field-level concurrent edits within 10s. Yjs/CRDTs are Post-MVP.
>
> **Retention philosophy:** episodic, not daily. 2–4 trips/year per organizer. Dream Mode serves as *ambient availability* between trips — never pushed, never streaked, never notified.
>
> Full rationale: DECISIONS.md entry *2026-04-20 — Roadmap grill: 11 decisions locked (re-grill corrected).*

---

This is the single most important doc in the repo. It defines **what TripWave has to prove first** and what is explicitly deferred.

If the docs, code, or design decisions drift away from this spine, the product is at risk of scope-spiraling into three apps at once. Every grill-me session, every feature spec, and every implementation task should answer: *"Is this on the spine, or is it a later-phase embellishment?"*

---

## The spine (must prove first)

A new user must be able to do this full loop before we invest deeply in anything else:

1. **Sign up** (account creation)
2. **Create a trip** (trip exists, persisted)
3. **Invite people** (share link / code, others can join with account)
4. **Preplan** (hub + at least one section editor working end-to-end)
5. **Build the itinerary** (add / edit / delete events in day-by-day view)
6. **Use Travel Day** (at minimum a working checklist mode on the actual travel day)
7. **Track expenses** (log, split, show balances, mark settled)

Everything beyond this loop is secondary until the loop feels excellent.

The pitch is:

> *"You and your crew can plan a real trip, take it, and settle up -- all in TripWave, and it felt good."*

If any user cannot do that in one seamless flow, the product is not alive yet.

---

## Feature priority -- MVP vs Later vs Speculative

### MVP (ship with v1 launch, must be real and polished)

These features exist in the spine or are tightly adjacent:

- Account creation / login / password reset
- App shell with navigation (sidebar desktop, pill bar mobile)
- Trip creation flow (4-step, Real vs Dream picker)
- Trip overview (both brand-new and established states)
- Preplanning hub + at least the first section editor fully working
- Itinerary day-by-day view with event CRUD
- Invite flow (link / code / QR) and join flow
- Members list with preset permissions (custom toggles can defer)
- Expenses phase: balances hero, ledger, add expense, mark settled
- Travel Day page: planning state + focus mode on the actual day
- Trip ball modal (click for breakdown + color picker)
- Notifications bell (in-app only, no push yet)
- Trip switcher in top nav
- Basic empty states per phase
- Settings: Trip info + Danger zone (others can defer)
- Pricing / premium purchase sheet (Stripe web)
- Ad banner (AdMob or AdSense, free tier)
- Legal + contact pages (stubs acceptable at launch)

### Later (ship after MVP is alive and stable, but specced)

These are specced in UX_SPEC / MONETIZATION but are NOT required for the spine to prove itself:

- Vacation Day page (only matters during active trips -- low priority until a user is mid-trip)
- Wishlist (nice to have, not spine)
- Notes feed (nice to have, not spine)
- Polls (nice to have, not spine -- even though it's free)
- Vault (matters but not on day-one spine path; users can store docs in phones / email initially)
- Tools hub (smart surfacing + catalog -- defer until MVP is shipping)
- Memory / Wrap-up (only matters after a trip ends -- no users will hit this for months post-launch)
- Receipt scanning (premium, needs Azure setup)
- Offline mode (premium, complex to implement)
- Advanced permission toggles (per-user custom overrides beyond presets)
- Family plan SKU (Tier 2 contingency -- don't build unless behind target)
- Affiliate Find-flights / Find-hotels search tools (contextual chips fine to ship with MVP; full search tools can follow)
- Multi-section preplanning editor (only one or two sections need to work end-to-end for MVP)
- Traveler profile editor (basic name/avatar in MVP; dietary/medical/emergency contact can follow)

### Speculative (documented as vision, not committed to a phase)

These are fun ideas documented in UX_SPEC / MONETIZATION but may never ship:

- Dream Mode (slim version) -- yes, we specced it, but it's a viral and retention play. Defer until spine is proven
- Dream Mode sharing / reactions / save-to-my-dreams -- all speculative
- Landing-page interactive hero with drag-to-fill ball + scroll storytelling + easter eggs -- speculative polish
- Story-arc App Store screenshots -- speculative polish
- Mood boards for dreams -- speculative
- Vibe themes for dreams -- speculative
- Scavenger hunt items -- speculative
- Advanced smart suggestions (beyond deterministic) -- speculative
- Rewarded video ads for bonus slots (Tier 3 contingency) -- speculative
- Trip templates -- speculative
- Trip export -- speculative

---

## What this means for grill-me sessions

- **Grill MVP features first.** Before locking further fun details for Wishlist / Polls / Notes / Memory, finish the spine's user flows in code
- **Defer embellishments.** If a decision is "nice polish but doesn't affect whether a user can complete the spine loop," it goes into ROADMAP.md as a future grill topic
- **Flag scope drift.** If a grill-me question starts designing a speculative feature, pause and route the question to a future session

---

## What this means for implementation

Build in this order:

1. Auth (sign up / login / password reset)
2. App shell (top nav, sidebar desktop, pill bar mobile)
3. Trip creation flow
4. Trip overview (brand-new + established)
5. Preplanning hub + one section editor end-to-end
6. Itinerary day-by-day CRUD
7. Invite flow (create trip, share link, accept join)
8. Expenses (balances + ledger + add + settle)
9. Travel Day (plan + focus mode)
10. Trip ball modal
11. Notifications (bell panel + dashboard action center)
12. Premium purchase sheet (Stripe + supporter framing)
13. Ad banner
14. Mobile phase pill bar polish
15. Dashboard Hybrid (Next-up + trip list + action center)
16. Settings (Trip info + Danger zone)

Everything else is Later or Speculative.

---

## Scope discipline rules

1. **One feature, fully alive, before the next begins.** Half-built features accumulate technical debt and user confusion
2. **Design-before-build still applies, but only for the spine.** Do not keep specifying speculative features until the spine works in code
3. **If grill-me sessions keep producing Later / Speculative decisions, the backlog grows faster than the codebase.** That is a red flag
4. **When in doubt, ask: "Is this on the spine?"** If no, it goes to the future-grill queue

---

## Premium framing discipline

The supporter framing is warm. But warm should not become vague. Premium buyers need to know clearly what they get.

**Warm but clear:**

> *"Premium is how you say thanks. In return: no ads, unlimited dreams, offline mode, receipt scanning. $7.99, once."*

**Warm but vague (don't do this):**

> *"Support the app and get some bonus stuff as a thank-you."*

Users reading the premium sheet should walk away knowing exactly what they are buying. Warmth is tone. Clarity is substance. Both must be present.

---

## Build Workflow -- Details → Mockups → Code

Before writing any JSX or HTML for a page, follow this three-step sequence in order. Do not skip steps. Do not combine them. This discipline applies to **every page** going forward.

### Step 1 -- Page detail definition

Before any visual work, write down what the page actually contains. Answer these questions on paper (or in a scratch doc, or a UX_SPEC section draft):

- **What information does this page display?** List every field, every label, every piece of data shown to the user
- **What actions can the user take on this page?** List every button, every input, every tap target and what it does
- **What state does this page depend on?** What does the user's account, trip, phase, membership, or device have to be for the page to make sense?
- **What edge cases exist?** Empty state, loading state, error state, permission-denied state, premium-locked state
- **What's the order of importance?** Rank the information from "must see first" to "hide behind a tap"
- **What's the mobile vs desktop difference?** If any. Most pages should behave consistently across both

Output: a brief, human-readable list. Not polished prose. Just the raw inventory of what lives on the page. This can go into the UX_SPEC section for that page or into a scratch note.

### Step 2 -- UI mockup

Only after Step 1 is complete. Do one of these (whichever fits the complexity of the page):

- **ASCII wireframe** for simple pages (one or two regions, a form, a list)
- **Figma / drawing tool mockup** for complex pages (dashboards, multi-column layouts, novel interactions)
- **Inline description in UX_SPEC** ("Top: hero card. Middle: trip list. Bottom: action center.") works for pages where the structure is simple and the text spec is enough

The mockup must:

- Honor the neon-on-dark palette and liquid motion rules from DESIGN_SYSTEM.md
- Match the page details from Step 1 (nothing new added, nothing silently dropped)
- Specify spacing, hierarchy, and component reuse (e.g., *"reuse the itinerary item card anatomy"*)
- Cover the main state plus at least the empty state

Output: a visual reference good enough to implement from. Can be rough -- this is a solo-dev product, not a Figma showcase -- but must be concrete enough that building from it doesn't require guessing.

### Step 3 -- Code

Only after Steps 1 and 2 are locked.

- Write the JSX / HTML / CSS
- Use existing components where the mockup reuses them
- Stay faithful to the mockup -- if the implementation forces a deviation, pause and update Step 2 first, don't just freestyle

### Why this sequence

- Jumping to code before defining what's on the page produces pages that drift, duplicate work, and leak scope
- Designing the mockup after details prevents "oh I forgot we needed a [X] here" mid-implementation
- Solo devs especially benefit from this discipline because there's no design handoff to force the pause

### When this workflow applies

- Every new page
- Every page being rebuilt (e.g., the signup page getting the neon refresh)
- Every significantly new page state or section (e.g., the brand-new trip overview vs the established overview)

### When this workflow does NOT apply

- Tiny isolated component tweaks (a color change, a font-size bump, a typo fix)
- Copy-only edits
- Bug fixes that don't change layout or information architecture

### Grill-me session rule

When grilling on a page, the session must produce **Step 1 (details)** output first, then **Step 2 (mockup)** output second, then -- only if time and scope allow -- hand off to implementation. If a grill-me session jumps straight to visual decisions without listing the page's details, stop and route back to Step 1.

For every page currently specced in UX_SPEC sections without a detail inventory, that inventory is owed before any JSX is written. Log it as a work item in BACKLOG.md.

### Anthropic Design plugin -- which skill to invoke at each step

TripWave has the official Anthropic Design plugin installed (six skills). Each maps to a specific point in the workflow. Use them actively -- they're leverage for a solo dev.

| Workflow moment | Skill | When to invoke |
|---|---|---|
| Step 1 -- Page details | `/user-research` | When the question *"what do users actually need on this page?"* is unclear. Early in grill-me sessions. Especially useful for pages where the information architecture is ambiguous |
| Step 2 -- UI mockup (during grill) | `/design-critique` | After a mockup is sketched or described. Pressure-tests hierarchy, usability, consistency before we lock the decision |
| Step 2 -- UI mockup | `/design-system` | When a new component or pattern is introduced. Ensures it fits TripWave's DESIGN_SYSTEM.md conventions (neon-on-dark, liquid motion, ocean ripple). Also useful for auditing DESIGN_SYSTEM.md itself for naming inconsistencies |
| Step 3 -- Pre-code | `/design-handoff` | Once Steps 1 and 2 are locked, this generates implementation-ready spec (tokens, states, breakpoints, animations). Turns a mockup into code-ready instructions |
| Step 3 -- Pre-ship | `/accessibility-review` | After implementation, run WCAG 2.1 AA audit before merging / shipping. Catches contrast issues, keyboard nav, touch target sizes, screen reader behavior |
| Post-launch / ongoing | `/research-synthesis` | Once users exist and feedback / interviews / support tickets come in, use this to distill into patterns, user segments, and prioritized next steps |

Invoke the skills by typing `/` in chat and picking the right one, or let Claude invoke them automatically when a relevant task is underway (e.g., writing a mockup triggers `/design-critique` naturally).

### Plugin discipline rule

- A grill-me session on a page MUST invoke `/design-critique` on the resulting mockup before locking the decision
- A grill-me session introducing a new component or pattern MUST invoke `/design-system` to confirm fit
- Before ANY implementation of a page, `/design-handoff` MUST produce the implementation spec
- Before shipping ANY new page or major rework, `/accessibility-review` MUST run

Skipping these is allowed only for tiny tweaks and bug fixes but not for new pages or significant rebuilds. The plugin is a quality gate, not optional polish.

### Grill-me enforcement protocol

Active prompting of these skills during grill-me sessions is governed by the **Grill-Me Session Protocol** in docs/GRILL_PROTOCOL.md. That protocol is canonical and applies to every Claude Code session on any machine working on TripWave. The agent running a grill-me session is responsible for reminding the user at the correct moments, not for silently assuming the user will remember. See GRILL_PROTOCOL.md for the exact inline prompts.

---

## Verification questions

Before shipping a feature as "done," ask:

- Can a new user do this without a support email?
- Does this feature connect to the spine loop, or does it dead-end?
- If I ship this today and nothing else changes, does it materially improve the spine?
- If this feature is broken tomorrow, can users still complete the spine loop?

If the answer to the last question is "no," the feature is part of the spine and needs full polish. If "yes," the feature is secondary and can be shipped with rougher edges.
