# Decision Log

This file records meaningful decisions so we do not lose context as the project grows.

## Template

Use this format for new entries:

### YYYY-MM-DD - Decision title

- Status: proposed | accepted | superseded
- Context:
- Decision:
- Why:
- Follow-up:

## Entries

### 2026-04-24 - Charcoal palette and bento layout locked as canonical design

- Status: **accepted**
- Context: `/app` and `/app/trips/new` reached a state that feels right visually and tonally. The charcoal dark palette, bento grid layout, neon rainbow section labels, 3D shadow on clickable cards, pill back button, bottom-border underline on big inputs, and chill surfer copy voice are all implemented and intentional. The earlier "navy-tinted neon restoration target" direction documented in DESIGN_SYSTEM.md is superseded.
- Decision:
  - The charcoal palette (`#404040` / `#2E2E2E` / `#252525` / `#1E1E1E` / `#3A3A3A`) is the final shipped look, not a transitional state.
  - `/app` and `/app/trips/new` are the reference pages. All future pages follow the same palette, layout, and component patterns.
  - Section labels (ALL CAPS, Fredoka, tracked wide) use unique neon accent colors, not `text-white/80`. No two adjacent labels share the same color.
  - Clickable list cards use `boxShadow: "0 3px 0 rgba(0,0,0,0.5)"` with no all-around border.
  - Large Fredoka form inputs use a bottom-border underline affordance (muted at rest, accent on focus) instead of a visible input box.
  - All back buttons are green pills (`#00C96B`, arrow + label inside, `rounded-full`).
  - Copy voice is the chill surfer standard documented in DESIGN_SYSTEM.md — Voice & Tone.
- Why: The app looks and feels cohesive, energetic, and on-brand. Locking this prevents drift as more pages are built.
- Follow-up: Apply these patterns to all remaining unbuilt or partially-built pages. Any page that still uses navy colors, `text-white/80` section labels, or bordered clickable cards should be updated.
- Design skills: `/design-critique` run informally across both pages. `/design-system` — patterns documented in UI_COLOR_REFERENCE.md. `/accessibility-review` owed before shipping to production.

### 2026-04-23 - Packing contract expanded: named lists are in scope under My lists

- Status: **accepted** (UX_SPEC.md, SURFACE_BLUEPRINT.md, and packing handoff docs owed/updated)
- Context: The 2026-04-23 Packing contract decision locked the richer UX-spec direction but explicitly kept arbitrary named list containers out of scope. After implementing the first schema and read-layer slices, a clearer user need emerged: travelers want to create and name multiple personal packing lists such as a main bag, carry-on, or gift bag, and control visibility at both the list level and the item level. This is still a packing problem, not a generic list-builder feature, but it changes the underlying shape enough that the existing `packing_items`-only direction is no longer sufficient as the long-term contract.
- Decision:
  - **Packing keeps the three top tabs, but the first tab becomes `My lists`, not a single `My list`.**
  - **Named personal packing lists are now in scope.** Users can create, name, and manage multiple personal lists inside `My lists`.
  - **List-level visibility is part of the contract.** Each named list can be marked public or private by its owner.
  - **Item-level visibility is also part of the contract.** Individual items can override the list-level default and remain private even inside an otherwise public list.
  - **The shared coordination surface remains distinct.** `Shared` stays a dedicated tab for trip-visible packing items, separate from personal list containers.
  - **This change supersedes the earlier "named lists are out of scope" constraint only for Packing.** It does not create a generic multi-list pattern elsewhere in the product.
- Why:
  - Travelers naturally think in bags and contexts, not just categories. A single personal list forces too many unrelated packing decisions into one surface.
  - List-level and item-level visibility together solve the real privacy use case cleanly: a user can share most of a carry-on list while hiding a gift or medication item.
  - Keeping `Shared` as its own tab preserves TripWave's group-coordination value instead of collapsing everything into private containers.
  - This shape is a better foundation for later Travel Day repack behavior, because repacking can still derive from the user's visible personal packing universe without assuming one monolithic list.
- Follow-up: Update UX_SPEC.md Packing section to `My lists / Shared / Suggestions` with list-level and item-level visibility rules. Update SURFACE_BLUEPRINT.md and packing handoff docs. Replace the single-table packing schema proposal with a `packing_lists`-based proposal before further schema work. `/design-system`, `/design-critique`, and `/design-handoff` are owed before the list-management UI is implemented.
- Design skills: `/user-research` skipped (user need became explicit in product direction). `/design-system` owed for the named-list and visibility-pattern components. `/design-critique` owed once the Step 2 mockup for `My lists` exists. `/design-handoff` owed before coding the list-management UI. `/accessibility-review` owed before the richer Packing surface ships.

### 2026-04-23 - Packing contract resolved: richer UX-spec direction is canonical

- Status: **accepted** (SURFACE_BLUEPRINT.md and packing handoff docs updated)
- Context: Packing had drifted into a doc split. The audited current-state docs described it as a narrow shared checklist utility surface, while UX_SPEC.md and the 2026-04-20 packing grill described a richer model: **My list / Group list / Suggestions**, privacy, categories, move-to-group semantics, bringer assignment, inline edit, and persisted check behavior. This created implementation ambiguity during packing redesign and schema-planning work.
- Decision:
  - **Packing must not remain permanently defined as a plain audited shared checklist.**
  - **The richer UX-spec direction is the canonical product contract** for Packing going forward.
  - **Implementation proceeds in phased slices** so the final product shape is preserved without forcing the full feature set into one oversized build.
  - **Current live implementation remains a valid partial slice**, not the final contract. The flat checklist is now treated as an interim state on the way to the richer model.
  - **Multiple named lists are still NOT part of the confirmed contract.** The richer direction means tabs + categories + privacy + shared/group mechanics, not arbitrary `Main Bag` / `Carry-On` style user-created list containers unless later docs add them explicitly.
- Why:
  - The richer model is already the better-specified, decision-backed version of Packing and better matches TripWave's group-trip coordination value.
  - Freezing Packing at the audited current slice would permanently flatten the product below the intended shape and make later Travel Day / repack integrations weaker.
  - Phased implementation protects scope discipline while still preserving the right end-state contract.
  - Excluding arbitrary named lists keeps scope tight and prevents accidental implementation of mock-only behavior not supported by docs.
- Follow-up: Update SURFACE_BLUEPRINT.md Packing contract language to reflect the richer canonical direction. Update packing handoff docs to mark the contract decision resolved and keep the phased plan. Next implementation step remains schema-first per PACKING_PHASE1_SCHEMA_PROPOSAL.md.
- Design skills: `/user-research` skipped (contract resolution, not user-need discovery). `/design-critique` owed when the first tabbed Packing slice mockup is prepared. `/design-system` owed if Packing introduces new tab-strip or privacy-pattern components not already covered. `/design-handoff` owed before the first rich Packing implementation slice begins. `/accessibility-review` owed before the richer Packing surface ships.

### 2026-04-22 - Preplanning navigation: 4-section in-page rail supersedes 8-section hub

- Status: **accepted** (UX_SPEC.md §4 annotated as superseded; SURFACE_BLUEPRINT.md updated; structural slice shipped)
- Context: UX_SPEC.md §4 described an 8-section hub model — a grid of section cards, each navigating to a focused editor page and back. After building Flights, Transport, Stays, and Trip Notes as CRUD record lists, the content shape became clear: every implemented section is a list of bookings, not a fill-in-once form. The hub model was designed for form-style sections (fill group composition, fill budget, etc.); list-based sections (add flights, add stays) work better with in-page navigation where the user can scan all records at a glance without round-tripping to a hub.
- Decision:
  - **The 8-section hub model (UX_SPEC §4) is superseded.** The intended Preplanning navigation shape is a 4-section in-page rail (left nav) + content pane. UX_SPEC §4 is annotated accordingly.
  - **4 canonical sections:** Travel (Flights + Transport), Stays, Prep, Notes.
  - **Travel is a group, not a flat section.** Flights and Transport are sub-lists under a single "Travel" anchor — both cover moving the group from place to place.
  - **Prep is a real future section**, not mock-era filler. It covers visa requirements, travel insurance notes, and pre-departure logistics. Currently stubbed ("coming soon") as a placeholder to lock in the canonical model. Content requires a separate grill before build.
  - **Sections dropped from the original 8:** Group composition (belongs in Members/Settings), Budget (belongs in Expenses), Destination info (already exists as the Tools surface), Trip character/Vibe (belongs in Setup, not Preplanning).
  - **Structural slice shipped:** Travel `<section id="travel">` wrapper groups Flights + Transport under a single anchor. Stays and Notes receive `id` props threaded to their root elements. PrepStubSection added between Stays and Notes to establish the 4-section model visibly.
- Why:
  - Hub navigation (click section card → navigate to editor → fill → return to hub) creates unnecessary round-trip friction for a booking-reference use case. "Let me check what flights we have" should not require navigating into a section, scanning a list, and tapping back.
  - CRUD record lists and fill-in-once forms are different patterns. A stacked page with in-page section anchors (and eventually a nav rail) handles lists better. The hub was appropriate for the section shapes originally imagined; the built shapes are different.
  - Collapsing 8 sections to 4 removes sections that either don't belong in Preplanning or are mock-era product design. The remaining 4 map cleanly to what the group actually needs before departure.
  - The structural changes are cheap now. They become expensive if the stacked layout hardens further before the rail is built.
- Follow-up: Rail UI (left nav + content pane split) is deferred to a future design pass — run `/design-critique` before implementing it. Prep section content (visa, insurance, checklist items) requires its own scoping grill before build. UX_SPEC §4–5 annotated as superseded. SURFACE_BLUEPRINT.md Preplanning entry updated.
- Design skills: `/design-critique` owed before the rail layout is implemented. `/design-handoff` owed before rail code ships. `/accessibility-review` owed before the rail ships to users. No design skills run for this structural slice (structural only, no new user-facing interaction patterns).

### 2026-04-21 - Build-order grill: 10-chunk queue locked + 3 explicit bans

- Status: **accepted** (grill complete — 12 decisions locked; BACKLOG.md canonical queue updated, CORE_LOOP.md gets the "no broad grills during chunks 1–9" discipline rule)
- Context: Four prior grills today locked launch scope, architecture/schema, conversion loop, and retention loop. Execution was at risk of entering analysis-paralysis or bouncing between surfaces. This grill forced an ordered 10-chunk queue for beta-tier completion (Chunks 0–9), identified the exact next action (migration 0001), named 3 explicit bans, and set a discipline rule: no more broad grills during execution unless an implementation *discovery* demands one.
- Decision:
  - **Q1 — Before migration 0001: write schema.ts changes → `drizzle-kit generate` → manually review SQL diff → apply.** Not "just run it." The rename (`status` → `lifecycle`) with data migration is the line item most likely to generate a DROP + ADD instead of RENAME; the review is mandatory.
  - **Q2 — Immediately after 0001: land helpers (`state.ts`, `balance.ts`, `deleteUserAccount.ts`, `events.ts` stub) and port every existing read to the new schema before any new feature code.** The migration isn't "done" until the code compiles clean. Skipping helpers means every later chunk rebuilds the logic ad hoc.
  - **Q3 — Next feature chunk: finish the expenses moat (settle-up + receipt upload) as one capstone chunk before moving off.** Leaving the moat 80% done to start itinerary is the half-feature drift trap. Chunk 5's job is to ship the moat screenshot-worthy, not to approximate it.
  - **Q4 — Itinerary CRUD sequenced immediately after the moat is complete.** Second spine arena (Plan) after Pay. No parallel branches for a solo dev.
  - **Q5 — Travel Day static lands before Home.** In-trip leaves first; cross-trip shell second. Home-first creates a placeholder Travel Day tab that feels broken on first click.
  - **Q6 — Notifications bell wired immediately after Travel Day, before Home.** Bell is a global component receiving events from Chunks 2/3/4. Delay-to-Home = a queue of silent notifications on first Home render.
  - **Q7 — PostHog emission from Chunk 5 onward; client wired at Chunk 10** (re-confirming the prior implementation-order grill). Create `src/lib/analytics/events.ts` with typed emitters stubbed to `console.log` during Chunk 1; replace with PostHog client at Chunk 9/10. Emit early, wire late.
  - **Q8 — Beta onboarding happens after every beta-tier surface is complete (single wave, ~20 users).** Two-wave sounds measured, actually doubles support overhead. Wave-one bugs overlap with known gaps; skip.
  - **Q9 — Step-1 inventory required for exactly four net-new surfaces:** settle-up flow, post-trip prompt, invite-landing page, unsettled-balance reminder. Other surfaces extend locked patterns and use just-in-time inventories per CORE_LOOP.md Build Workflow.
  - **Q10 — Three explicit bans until Chunk 8 beta onboarding completes:** (1) trip ball motion / animation / modal / color picker polish; (2) Afterglow / memory recap mockups; (3) Dream Mode exploration in any form. All are high-pull, zero-leverage-at-launch. Additional hard bans remain from prior grills (Travel Day focus mode, receipt scanning OCR, Basics hub full, Vault, Tools, Wishlist, Polls, Scavenger Hunt, Notes, Skyscanner/Viator, CRDTs, OAuth, email verification, 2FA).
  - **Q11 — "Done planning, just build" checkpoint = migration 0001 applied AND `tsc --noEmit` passes.** Until both are true, planning can still be invalidated by a schema decision. After both are true: no more broad grills; execute the queue. Step-1 inventories per chunk are not planning — they're the first substep of each chunk.
  - **Q12 — Doc-update discipline:** BACKLOG.md "In Progress" updated per chunk; DECISIONS.md only for decisions that affect future decisions, not status updates; UX_SPEC.md updated per Step-1/Step-2 lock per CORE_LOOP.md; SCHEMA_DRAFT.md updated only on schema changes. Routine chunk completion does not warrant a DECISIONS.md entry.
  - **Discipline rule added to CORE_LOOP.md:** no broad grill session during Chunks 1–9 unless implementation surfaces a decision that actually changes scope. Execute the queue. Narrow, discovery-triggered grills are permitted; broad scope/architecture/retention grills are not.
- Why:
  - **The single most likely failure mode at this point is bouncing between surfaces, not picking the wrong surface.** Four prior grills already locked what; this grill locks when. Without the sequence, solo-dev attention splinters across 5 half-built features instead of 5 shipped ones.
  - **Migration 0001 as the checkpoint** is concrete and observable. Subjective readiness checkpoints ("I feel planned") don't work for solo devs; compiler-clean-on-new-schema does.
  - **The three bans are the ones most likely to steal focus**: trip ball is aesthetic pull, Afterglow is "it'd be nice," Dream Mode is the viral-engine fantasy. Each feels like a quick side-quest; each costs 2–4 days the launch schedule doesn't have.
  - **Helpers before features prevents the "three features use three slightly different state computations" problem.** One source of truth for `computeState` and `computeBalance`, ported everywhere, before anything new ships.
  - **Single-wave beta onboarding** matches solo-dev bandwidth realities. Multi-wave discipline is fine with a support team; without one, each wave triples the parallel task load.
- Follow-up: BACKLOG.md (canonical 10-chunk queue replaces prior ordering where they conflict); CORE_LOOP.md (discipline rule added). No schema changes this grill — the 9-step migration 0001 from the architecture grill remains the owed migration. **Immediate next action: Chunk 0 — migration 0001 against current `schema.ts`.**

**Design skills:** `/user-research` skipped (sequencing grill, no UI decisions). `/design-critique` scheduled for Chunks 2 and 7 mockups. `/design-system` scheduled for Chunk 2 (settle-up introduces confirmation-sheet pattern). `/design-handoff` scheduled pre-code for Chunks 2, 6, 7. `/accessibility-review` scheduled pre-Chunk 8 across every page touched since beta work began.

### 2026-04-21 - Retention loop grill: 12 decisions locked

- Status: **accepted** (grill complete — 12 decisions locked; STATE_MODEL.md · MONETIZATION.md · UX_SPEC.md · ARCHITECTURE.md · ROADMAP.md revision blocks added)
- Context: Conversion loop locked earlier today left a real gap: with Dream Mode, Afterglow, and memory recap all cut from launch — and with no push notifications or marketing email — TripWave had almost no retention mechanism between trips. The "episodic retention" frame from the conversion grill was correct for organizers but at risk of becoming cope for invitees. This grill pressure-tested whether the product has realistic return triggers in all four phases (pre-trip, during-trip, post-trip, next-trip), which metrics would lie, and which would tell the truth.
- Decision:
  - **Q1 — Retention is honestly episodic for organizers; uncertain for invitees.** Split the frame by role. The participant-to-organizer conversion rate (Q9) is the metric that resolves whether the episodic frame extends to invitees at all.
  - **Q2 — Between-trip silence is the single biggest retention risk at launch.** Not pre-activation drop, not activation failure — those were addressed in the conversion grill. Between-trip silence (trip completed, user never returns for trip #2) has the weakest defenses within locked scope.
  - **Q3 — Organizer pre-trip re-engagement driver = dependency pressure, not delight.** Reframes the mechanism: the organizer returns because they have an item they need to do, not because TripWave is charming. Makes *external visibility* of dependencies the retention lever.
  - **Q4 — Invitee pre-trip re-engagement = expense logging, not curiosity.** The "log your deposit expense" featured CTA is retention-critical, not just activation-critical. Without that first expense habit pre-trip, invitee passivity is default.
  - **Q5 — In-app bell is intra-session awareness, not a retention tool.** Rename it accordingly in docs. A notification the user never sees can't re-engage them.
  - **Q6 — During-trip retention mechanism = in-moment expense logging, not Travel Day.** Travel Day static ships as-is; expense-entry flow deserves the polish budget. Add-Expense affordance must be one-tap-reachable from every in-trip surface.
  - **Q7 — Unsettled-balance reminder added to launch scope.** 14-day post-`trip_end_date_reached` in-app banner + transactional email to affected members if balance un-settled. Without this, trips silently die with the entire post-trip retention loop (post-trip prompt, "Your turn?", next-trip CTA) never firing.
  - **Q8 — Next-trip organizer engine = muscle memory + data moat (B + D).** "Duplicate past trip" from Home is the highest-leverage post-launch retention feature. Verify scope of duplication flow — shell only vs shell + members + budget + itinerary skeleton. Step-1 inventory owed.
  - **Q9 — Participant-to-organizer conversion target = 5–10% at launch.** Committed as target, not stretch. At Year-1's 1,000 settled trips × ~3 participants/trip = 3,000 participants; 5% = 150 additional trips; 10% = 300 additional trips (15–30% uplift to Year-1 target from this CTA alone). CTA copy and path must be optimized for this specific target.
  - **Q10 — Word-of-mouth mechanism = the invite link itself.** Reframes invite share copy as WOM-critical, not just activation-critical. Share-sheet text must work outside the direct invitee conversation (e.g., pasted into a broader group chat).
  - **Q11 — Four vanity metrics explicitly quarantined:** sign-ups per week, trips created, DAU/WAU, expense count across all trips. None of these measure retention. No retention decision made on vanity metrics alone. Quarantined from primary dashboards.
  - **Q12 — Canonical retention dashboard = six metrics only:** activation rate, trip completion rate, 90-day second-trip rate, participant-to-organizer conversion rate, Supporter conversion rate, unsettled-trip rate. With Year-1 target ranges: 40–60% / 50–70% / 25–40% / 5–10% / 3–8% / <20%. PostHog primary view shows only these six, cohorted by launch month.
  - **Transactional email scope (resolves Q3/Q5/Q7 tension):** the "no email except password reset" rule is narrowed to "no *marketing* email." Three transactional event emails added to launch scope: (1) `invite_accepted` → organizer, (2) `first_expense_logged_by_other` → affected members, (3) `unsettled_balance_reminder` → affected members at T+14 days post end-date. Opt-out per trip in member settings. Resend already in stack; no new infrastructure. These are *user-requested state changes*, not marketing nudges.
- Why:
  - **The episodic frame only works if invitees have a reason to return.** Without the participant-to-organizer CTA hitting target, invitees are single-session users and retention math fails. Q9's target is not optional; it's the lever that makes episodic retention mathematically sustainable.
  - **With push off the table at launch and marketing email off forever, transactional emails are the only re-engagement mechanism available.** Accepting Q3/Q5/Q7's email scope is the difference between having a retention loop and pretending one exists through the bell.
  - **The unsettled-balance reminder is the cheapest retention fix with the highest leverage.** One scheduled banner + one email protects the entire downstream conversion funnel. Without it, silent-death trips take the post-trip prompt, the "Your turn?" CTA, and the Supporter conversion with them.
  - **Vanity metrics will be quoted in status updates; the dashboard must refuse to display them prominently.** Solo devs look at what's easy to look at. Primary view must show only the six honest metrics; everything else secondary or hidden.
  - **Muscle memory + "Duplicate past trip" is the simplest repeat-trip engine.** Most organizers don't create repeat trips because they loved the last one — they create them because they already know the tool. Lower the activation barrier for trip #2 and the repeat rate follows.
- Follow-up: STATE_MODEL.md (4-phase retention model + 6-metric dashboard + vanity quarantine list), MONETIZATION.md (transactional email scope accepted; unsettled-balance reminder noted as retention-critical), UX_SPEC.md (Step-1 stubs for unsettled reminder, invite share-sheet copy, "Duplicate past trip" flow verification, expense-entry one-tap affordance), ARCHITECTURE.md (bell renamed as intra-session awareness; transactional email scope documented), ROADMAP.md (participant-to-organizer 5–10% target + 90-day second-trip rate as primary Year-1 metrics). No schema changes required — all retention instrumentation uses the 12 PostHog events locked in the conversion grill.

**Design skills:** `/user-research` skipped (retention mechanics, not user-need discovery). `/design-critique` **required** on unsettled-balance reminder mockup (new persistent-state surface) and on invite share-sheet copy (WOM-critical — must read well both inside and outside the direct invitee conversation). `/design-system` **required** if the reminder banner introduces a new persistent-state pattern not already in DESIGN_SYSTEM.md. `/design-handoff` **required** per-surface before code. `/accessibility-review` **required** before Public MVP ship on all new surfaces, including the three transactional email templates.

### 2026-04-21 - Conversion loop grill: 12 decisions locked

- Status: **accepted** (grill complete — 12 decisions locked; MONETIZATION.md · UX_SPEC.md · STATE_MODEL.md · ROADMAP.md revision blocks added)
- Context: Launch scope and architecture/schema were locked earlier the same day. Open question: does TripWave's Public MVP have a realistic path from first visit → first successful trip → premium conversion? This grill pressure-tested the funnel against locked constraints (ad-removal-only premium, Home-only ad placement, one affiliate partner, post-trip prompt as sole monetization surface). Surfaced three weak points and twelve decisions that either fix them or explicitly accept them.
- Decision:
  - **Q1 — First value moment = first invite accepted (organizer sees second human in their trip).** Until a second member joins, TripWave is hypothesis, not product. Every UX decision between sign-up and invite-accepted should be optimized to shorten time-to-this-moment.
  - **Q2 — Activation event = `first_invite_accepted`.** Earliest event impossible to fake solo; proves the only thing TripWave cannot do for the user; cheapest signal to track. **North-star metric stays `trip_settled ∧ ≥2 expense-logging members`.** Two separate numbers, two different purposes: activation = leading indicator, north-star = success.
  - **Q3 — Dedicated invite-landing page (`/join/{inviteCode}`) for participants.** Shows invited-by avatar + trip preview + two featured CTAs ("Log an expense" / "Check your packing") matching the locked permission model. Silently landing participants in an organizer-shaped UI is the fastest path to participant bounce. Adds one route to the launch page list.
  - **Q4 — Ad-impression-triggered premium prompt added.** Fires once at the 5th Home ad view with honest copy ("you've seen this ad 5 times — remove for $4.99 forever?"). Complements the post-trip prompt (emotional) with a rational trigger. One-time per user; dismiss silences the surface forever but does NOT silence the post-trip prompt.
  - **Q5 — Add two zero-dev-cost identity features to the Supporter bundle: Founder badge + 20 premium trip-ball colors.** Ad removal alone is a thin value prop at Home-only ad placement. Founder badge (CSS class conditional on `supporter_source = 'founder'`) + premium ball palette (pure CSS) ship in hours. Neither competes with the moat. Gives the answer to "what do I get for $4.99" three bullets instead of one.
  - **Q6 — One affiliate partner is enough for Year 1. Reframe affiliate as infrastructure, not revenue.** Realistic math: 1,000 trips × ~0.5 lodging clicks × ~5% conversion × ~$12 commission ≈ $300 Year-1 affiliate revenue. Scaling partners before traffic scales is misallocated effort. The $500k lifetime projection is Year-3+ weighted.
  - **Q7 — Settle-Up flow itself is ad-free AND upgrade-prompt-free.** Post-trip prompt fires on the *next* screen load after settlement, never during the flow. Clarification to MONETIZATION.md § 25 locked list.
  - **Q8 — Moat-as-retention: getting to first 2-member expense is the single highest-leverage transition.** Financial lock-in is what makes organizers finish trips, not nudges or aesthetics. First-run Overview after first invite featured CTA = "Log your deposit expense" (natural first expense on most group trips).
  - **Q9 — Between-trip retention: accept episodic churn as the product rhythm.** 2–6 month gaps between trips are success, not failure. Year-1 target measures settled trips, not MAU. Every alternative (Dream Mode, Afterglow, email nudges) breaks locked scope. **MAU/WAU framing to be struck from every doc that uses it.**
  - **Q10 — Post-trip prompt is the single most important UI surface in the launch conversion story.** Warm copy, honest, trip stats in the same card, Supporter benefits explicit (no ads + Founder badge + 20 ball colors + solo-dev support), one-tap purchase, single-dismiss-forever rule. Flagged `/design-critique` required before implementation.
  - **Q11 — One-time "Who else is coming?" soft prompt after first invite sent.** Dismissible card on post-invite Overview with bulk paste shortcut. Beachhead is 3–5 person friend groups; asking the obvious question once materially moves the ≥2 metric.
  - **Q12 — "Your turn? Plan your next trip" CTA for participants after first settle-up.** Fires once per participant on the post-settlement Afterglow-lite screen. Converts passive participants into acquisition seeds at zero ad cost. The warmest moment a participant will ever be toward TripWave is the post-settle screen; capture it.
- Why:
  - **Activation vs north-star is a measurement fix, not a feature change.** The current "settled trip with ≥2 loggers" is the correct success definition but a trailing indicator. Without a leading indicator (activation), the funnel can't be instrumented until weeks after launch when completed trips accumulate. `first_invite_accepted` closes that gap.
  - **The post-trip prompt is volume-limited.** At 2–4 trips/year per organizer and 60–120 day trip cycles, most new users won't see the emotional prompt for months. Q4's ad-impression prompt and Q5's identity features offset this by giving earlier, rational conversion triggers.
  - **The three weakest points surfaced:** (1) ad-removal-only is thin at Home-only placement → fixed by Q5's identity hooks; (2) post-trip prompt is months away for new users → fixed by Q4's ad-impression prompt; (3) between-trip retention is near-zero with Dream Mode cut → accepted as episodic, docs reframed.
  - **Year-1 affiliate reality check** prevents over-estimating launch revenue and under-saving for runway. MONETIZATION.md's $500k lifetime projection is honest long-term but misleading if read as launch-year.
  - **Invite-landing page is participant onboarding.** Every participant's first 10 seconds in TripWave must answer three questions. Dropping them into an empty Home silently is an unforced error with high bounce cost.
- Follow-up: MONETIZATION.md (§ 11 ad-impression prompt, § 25 settle-up flow clarification, Supporter bundle Founder badge + premium ball colors, Year-1 affiliate annotation, dismiss-rules), UX_SPEC.md (new sections: invite-landing page, "who else?" soft prompt, "your turn?" participant CTA, post-trip prompt full spec, first-run deposit-expense CTA), STATE_MODEL.md (activation event definition + PostHog funnel event list + episodic retention framing note), ROADMAP.md (Year-1 affiliate reality-check annotation).

**Design skills:** `/user-research` skipped (beachhead locked; conversion plumbing, not user-need discovery). `/design-critique` **required** on post-trip prompt mockup before implementation — the highest-leverage UI surface in the launch conversion story. `/design-critique` **required** on invite-landing page mockup. `/design-system` **required** for Founder badge + premium ball color treatment (new identity patterns). `/design-handoff` **required** per-surface before code. `/accessibility-review` **required** before Public MVP ship on all new prompts (post-trip, ad-impression, "who else?", "your turn?").

### 2026-04-21 - Architecture & schema sanity grill: 12 decisions locked

- Status: **accepted** (grill complete — 12 decisions locked; SCHEMA_DRAFT.md · ARCHITECTURE.md · STATE_MODEL.md · BACKLOG.md revision blocks added. `src/lib/db/schema.ts` and migration SQL intentionally NOT edited in this pass — owed before more Chunk 5 code lands.)
- Context: 12-table spine schema already migrated on the dev branch (migration `0000_initial_spine.sql`). Recent launch-scope grill cut Basics hub, receipt scanning, Dream Mode, and Travel Day focus mode from Public MVP, but the migrated schema hadn't been re-sanity-checked against the narrowed launch. This grill pressure-tested ORM choice, stored-vs-computed state, permissions shape, settlement data model, unmodeled holes (receipt uploads), the offline-as-launch-concern posture, Better Auth integration, and owner-delete cascade safety.
- Decision:
  - **Q1 — ORM is settled: Drizzle stays.** SQL-first fits the balance/funnel aggregation workload; the runtime adapter is already written; switching now would be rework for no feature gain. Prisma's DX advantages (Studio, migrate-dev) do not overcome lock-in cost mid-Chunk-5.
  - **Q2 — Trip state: split stored `lifecycle` (durable) from computed 8-state (derived).** Rename `trips.status` → `trips.lifecycle`; values restricted to `active | vaulted | dreaming` (the user-durable transitions). The 8-state STATE_MODEL enum (`Draft | Planning | Ready | TravelDay | InProgress | Stale | Vaulted | Dreaming`) becomes the return value of `computeState(trip, now)` in `src/lib/trip/state.ts`, read at query time. Storing derived state is the #1 staleness trap.
  - **Q3 — Collapse `preplan_budgets` into `trips`.** Basics hub is cut; budget is one inline field on Overview. Add `trips.budget_cents integer nullable` + `trips.budget_notes text nullable`. Drop the `preplan_budgets` table entirely. When Basics returns in v1.1 with 3+ sections, a polymorphic preplan_entries pattern (or per-section tables) earns its keep then — not now.
  - **Q4 — Drop `trip_members.permissions` JSONB column.** Launch permissions are role-only: `organizer | trusted | member`. No launch surface configures per-user capability overrides; a JSONB column with zero writes is pure capability-debt. If real per-user overrides emerge post-launch, re-adding a JSONB column is a one-migration cost.
  - **Q5 — Settlement is per-pair, not per-split. Add `settlements` ledger table; drop `expense_splits.settled_at`.** The Expenses grill locked per-pair soft settlement; per-split `settled_at` can't express the user action ("Alice paid Bob $50 to clear 3 debts" is one ledger entry, not 3 toggled splits). Balances computed as `sum(splits owed) - sum(splits paid) - sum(settlements from) + sum(settlements to)`. This is a launch blocker if left as-is.
  - **Q6 — Receipt uploads: Vercel Blob + `expense_receipts` table.** Manual receipt upload is in the locked launch scope; current schema had no home for files. Vercel Blob is zero-setup on the existing Vercel account; signed URLs handle access control. Resolves the ARCHITECTURE.md contradiction ("no image hosting" → clarified as "no *user photo* hosting; expense receipts are functional attachments").
  - **Q7 — Add `supporter_entitlements` audit table.** `users.supporter_entitled_at` stays as the hot-path read; audit ledger stores source, external_id, amount, purchased_at, refunded_at. Refunds will happen; ledger prevents "I paid but never got Supporter status" being unsolvable.
  - **Q8 — Offline is NOT a launch architecture concern.** Premium at launch = ad removal only; offline is post-launch month 3+. ARCHITECTURE.md's "design with it in mind from the start" stance is struck — offline-first data shape decisions made now would constrain launch code wrongly.
  - **Q9 — Better Auth integration: working as-is; verify snake↔camel adapter mapping.** Schema matches Better Auth v1 conventions (accounts with provider_id/account_id, verifications for password reset, sessions with token + expires_at). One config check owed: confirm the Drizzle adapter maps `email_verified` ↔ `emailVerified` correctly.
  - **Q10 — Invite codes: nanoid(10) URL-safe with retry-on-collision. Trip slugs: kebab-case-name + nanoid(4) suffix.** `invites.code` and `trips.slug` both globally unique (matches `/app/trips/{slug}` URL scheme). Slug generation must not embed PII (avoid auto-including owner name).
  - **Q11 — Owner-deletion cascade: keep RESTRICT; implement transfer in app-level `deleteUserAccount(userId)` service.** Find trips → reassign owner to earliest-joined non-owner member → if none, soft-delete the trip. 30-day hard-delete cleanup job deferred to post-launch (manual cleanup fine for v1 volume).
  - **Q12 — Affiliate click tracking: PostHog event, no bespoke table.** Booking.com chip tap fires `affiliateClick` event with partner/trip_id/event_id properties. Partner dashboard handles revenue attribution. Bespoke `affiliate_clicks` table would add GDPR retention decisions for zero signal PostHog can't provide.
- Why:
  - **Stored state is the biggest solo-dev trap** at this point. An 8-state enum driven by `now()` can never be kept in sync by cron alone; computing at read time is correct even at the cost of some query shape (index on `lifecycle` handles the only query that actually needs persisted state — "my active trips").
  - **Every over-modeled table cut now compounds.** `preplan_budgets` (1 row per trip always), `trip_members.permissions` (zero writes at launch), per-split `settled_at` (wrong shape) — each one is a column/table you'd reference, populate, and defend in code reviews for months before removing. Cut now, during a migration window that's still cheap.
  - **Two under-modeled holes** (receipt uploads, supporter audit ledger) are real launch concerns discovered by pressure-testing the locked scope against the migrated schema. Adding them now is one migration; retrofitting after users have uploaded receipts or bought Supporter status is expensive.
  - **Offline is the most tempting premature optimization.** Every architectural decision "for offline" (idempotency keys, CRDTs, service workers, version columns) locks data shapes into constraints that can't be validated until real offline usage exists. Strike from architecture posture until the feature ships.
- Follow-up: SCHEMA_DRAFT.md (full revision block + 12-table canonical list), ARCHITECTURE.md (Offline Strategy struck, Data Layer scope banner, Permissions rewritten to role-only), STATE_MODEL.md (Section 1 clarification block on stored vs computed state), BACKLOG.md (migration 0001 note: the specific column/table changes owed before more Chunk 5 code lands). **Code action owed:** migration 0001 — drop `preplan_budgets`, drop `trip_members.permissions`, rename `trips.status → trips.lifecycle` (values `active | vaulted | dreaming`), add `trips.budget_cents + budget_notes`, drop `expense_splits.settled_at`, add `settlements`, add `supporter_entitlements`, add `expense_receipts`. Also owed: `computeState(trip, now)` function in `src/lib/trip/state.ts` before any page renders status.

**Design skills:** `/user-research` skipped (architecture/data-shape grill, no UI). `/design-system` skipped. `/design-critique` skipped. `/design-handoff` not applicable. `/accessibility-review` not applicable. `/research-synthesis` not applicable. All skills remain required at their respective implementation moments per GRILL_PROTOCOL.md when the affected UI surfaces (inline budget on Overview, settlement ledger UI, receipt upload affordance on expense entry) proceed to mockup and code.

### 2026-04-21 - Launch-scope grill: 11 decisions locked (Public MVP = v1 launch)

- Status: **accepted** (grill complete — 11 decisions locked; PITCH.md, CORE_LOOP.md, ROADMAP.md, MONETIZATION.md, BACKLOG.md revision blocks added)
- Context: Prior product, UX, and sequencing grills had left "launch" ambiguous between the 90-day private beta and the Public MVP at weeks 13–24. Several feature decisions accumulated at "launch-tier" scope that, under realistic solo-dev execution, would delay shipping or bloat first-impression surfaces. This grill pressure-tested every feature the roadmap called launch-critical against: (a) does a stranger need this on day 1? (b) does removing it delay launch? (c) does keeping it dilute the moat? Goal: the smallest lovable version that can realistically launch, delight users, and make money this year.
- Decision:
  - **Q1 — "v1 launch" = Public MVP (weeks 13–24), not beta.** Beta is a closed spine-validation checkpoint with 20 personal-network users. Launch is the day strangers can arrive and take money. Prior docs treated the two interchangeably in places; this entry resolves that.
  - **Q2 — Receipt scanning cut from launch.** Premium at launch = **ad removal only.** Receipt scanning moves to post-launch month 2 when Azure AI Document Intelligence integration can be done without pulling focus from the moat. At $4.99, a single honest benefit beats two half-polished ones.
  - **Q3 — Dream Mode cut from launch.** Specced as stripped (create · share URL · hero image · vibe tag · 3–5 placeholders) but deferred to weeks 4–6 post-launch. At launch volumes there is no one to go viral to; the wedge is organizers finishing real trips. Dream Mode becomes a v1.1 moment that *itself* generates a content beat.
  - **Q4 — Affiliate at launch = one partner, one surface.** Booking.com hotel chip on lodging itinerary items only. Skyscanner and Viator move to post-launch week 2–3. Proves the affiliate mechanism without two partners' worth of wiring, disclosure copy, and fallback states.
  - **Q5 — Ad banner at launch = Home page only.** Not on itinerary, expenses, Basics, vault, or any moat-adjacent surface. Ships the infra, anchors the "pay $4.99 to remove ads" value prop, and avoids first-impression pollution on the moat.
  - **Q6 — Travel Day at launch = static planning checklist + "Generate from trip" button.** Focus mode, per-member view, skip semantics, auto-arrival transition deferred to post-launch month 2. Travel Day's biggest risk is shipping rushed — a bug at the airport is catastrophic brand damage. Static is shippable; focus mode is not, yet.
  - **Q7 — First-run onboarding: sign up → trip-create first-run → invite step featured.** Skip Home on the first login. Compress the sign-up → invite-sent funnel, which is where 80% of acquisition drop-off happens. No carousel, no tour.
  - **Q8 — Non-organizer member permissions at launch: view + log expenses + check packing; itinerary edits gated to Trusted+.** Protects the moat (everyone must log expenses against each other), reduces edit-conflict rage-quits under last-write-wins, and gives Supporter upgrade a second natural moment ("make all my friends Trusted editors"). If the `trip_members.role` UI isn't built in Chunk 4, launch pick degrades to C (view + expenses only).
  - **Q9 — Launch pages/routes = spine + marketing landing + one affiliate chip + ad banner on Home.** Explicit not-in-launch: Dream Mode, Tools, Afterglow, Vault, Wishlist, Polls, Scavenger Hunt, Notes, Memory recap, receipt-scan surface. No "coming soon" placeholders — stubs are worse than absence.
  - **Q10 — Launch tagline: "The group trip app that actually splits the bill."** Leads with the moat. Current tagline ("Plan the trip. Not the group chat.") is preserved for post-launch when awareness is established; at launch, distinguishing from Wanderlog/TripIt/Roadtrippers is critical, and the bill-splitting angle is the only differentiator those apps can't copy cheaply.
  - **Q11 — Basics hub cut entirely. Budget becomes an inline field on the trip Overview.** A hub with one section is a half-empty room that signals "unfinished." Inline budget ships the data, ships the moment. Basics hub returns in v1.1 when 3+ sections are genuinely ready. This cascades back to the beta build order — step 9 of BACKLOG.md's 12-step order becomes "inline budget on Overview" rather than "Basics hub with budget section."
- Why:
  - **Narrower launch, faster ship, better first impression.** Each cut (receipt scan, Dream Mode, full Travel Day, Basics hub, second affiliate partner, full ad zones) removes 1–3 weeks of work from the critical path without breaking the spine. Aggregate time returned: approximately 4–6 weeks, reinvestable in expenses polish (the moat) or brought forward as shipped-earlier date.
  - **Three scope traps called out:** (1) polishing the trip ball before expenses is screenshot-worthy, (2) shipping Dream Mode at launch because it's "the viral engine" (there is no one to go viral to yet), (3) shipping "small stubs" of Afterglow/Vault/Tools/Wishlist for launch (stubs worse than absence).
  - **Launch promise leads with the moat, not the brand.** TripWave is not yet known; aesthetic differentiation is not yet legible. The rational buyer signal at launch is "this does the thing the other apps don't." Brand-first taglines work when awareness is built, not at wedge moment.
  - **Ad banner confined to Home** trades near-zero launch-scale revenue for first-impression integrity on moat surfaces. At hundreds of users the revenue delta is a rounding error; the retention delta from an ad-free expenses surface is large.
  - **Basics hub cut eliminates an entire sub-page from the build** without losing the one field that matters. Every simplification that removes a route without removing user value is free calories returned to the moat.
- Follow-up: PITCH.md (launch scope + tagline update), CORE_LOOP.md (launch-tier refinement + Basics collapse + Travel Day scope), ROADMAP.md (Public MVP scope narrowed + Post-MVP cut list reordered), MONETIZATION.md (ad-removal-only at launch + one affiliate partner), BACKLOG.md (step 9 revised: inline budget, not Basics hub). Next concrete action: continue current chunk work unchanged — these cuts affect Public MVP scope, not the beta 12-step order except for step 9. When Chunk 9 begins, inline-budget inventory supersedes the Basics hub inventory.

**Design skills:** `/user-research` skipped (scope-discipline grill, no new user-facing UI decided). `/design-system` skipped (no new patterns). `/design-critique` skipped (no mockups produced). `/design-handoff` **required** per-page at each launch-surface implementation — specifically note the inline-budget-on-Overview change replaces prior Basics hub layout for all future Step-2 mockups. `/accessibility-review` **required** before Public MVP ship across every launch page. `/research-synthesis` not applicable (pre-launch).

### 2026-04-20 - Implementation order: 12-step canonical build sequence locked (Chunk 4 = beta pivot)

- Status: **accepted** (grill complete — 10 chunks + 12-step canonical order + pivot moment identified; BACKLOG.md and ROADMAP.md updated)
- Context: Product scope, roadmap tiers, and naming canon were locked earlier on 2026-04-20. Current state: UI shell + setup page in mock-data mode, Drizzle selected but not installed, Better Auth selected but not wired, schema drafted but not applied, no backend routes. The implementation-planning grill on the same day established foundation-first direction but did not produce a chunk-by-chunk sequence with a named pivot moment. This grill pressure-tested execution order to avoid rework, prevent pretty-surface-before-real-loop drift, and get a testable private beta as fast as possible.
- Decision:
  - **The pivot question: what must be built first for TripWave to be testable by real users? Answer: the full invite → accept → two-users-in-one-trip loop (Chunk 4).** Auth alone isn't testable, trip creation alone is a demo not a test, expenses alone aren't the product without group members. Chunk 4 is the first moment TripWave *is* TripWave. Everything before is plumbing; everything after is the moat or polish. Build order optimizes for the shortest path to "two humans in the same trip."
  - **Chunk 1 — Full spine schema, applied once.** 10 tables (users, sessions, trips, trip_members, invites, expenses, expense_splits, itinerary_events, preplan_budgets, notifications) with timestamps, soft-delete, indices, `trip_members.role` column, integer-cents money columns. Schema drip-feed is the #1 rework source; do it once upfront.
  - **Chunk 2 — Auth end-to-end (Better Auth).** Sign-up, log-in, log-out, password reset with expiring token, session cookie with correct prod flags, account deletion endpoint. OAuth, 2FA, email verification explicitly defer.
  - **Chunk 3 — Trip creation + in-trip Overview page, wired to real DB.** First full-stack feature; proves the pipeline. Slug generation with collision handling (used by invites in Chunk 4).
  - **Chunk 4 — Invite flow (create + accept + join). ← THE PIVOT MOMENT.** Invite token with unguessable slug + expiry + revocation; accept page; join-as-existing-user and sign-up-then-join paths; default role assigned. After this chunk lands, test with a second real human in a second browser.
  - **Chunk 5 — Expenses polished (the moat).** Create + split (equal/by-share/by-amount) + multi-currency at log-time rate + balances hero + ledger + settle with Venmo/Zelle deep-link + manual receipt upload. Integer-cents storage — no floats for money. OCR, currency converter, category auto-suggest defer.
  - **Chunk 6 — Itinerary day-by-day CRUD + soft-conflict toast pattern.** Last-write-wins with 10s concurrent-edit toast (reusable pattern for every subsequent multi-editor surface). Timezones stored UTC, displayed local. Drag-reorder, recurring events, map view, affiliate chips defer.
  - **Chunk 7 — Basics hub with budget section only.** Per NAMING.md (formerly "Preplan Hub"). Other sections show "coming soon." Multi-section hub before one section works is a stalled project.
  - **Chunk 8 — Travel Day checklist + notifications bell + static trip ball.** No focus mode, no airport phases, no ambient motion. Static SVG ball — no motion, no modal, no ripples. Focus mode defers to Post-MVP.
  - **Chunk 9 — Home (app-level) + between-trips state + trip switcher.** Retention lever: "Start new trip" / "Duplicate past trip" CTAs.
  - **Chunk 10 — Beta instrumentation + onboarding + bug bash.** PostHog or Plausible wired to the canonical funnel (sign-up → trip created → invite sent → invite accepted → first expense → 2nd expense by 2nd member → trip end date passed → settled). Events emitted from Chunk 5 onward; wired at Chunk 10. 20 personal-network users onboarded.
  - **Pressure-test verdicts:** Drizzle + Neon + Better Auth stack confirmed correct. All 10 spine tables defined in Chunk 1 (stronger than the user's "define models early" framing). Expenses before itinerary correct. Spine pages are **never visually scaffolded before backend wiring** — full-stack in one pass; only non-spine "coming soon" placeholders may be visual-only. Last-write-wins for collab confirmed; no CRDTs. No motion/ripples/ball animation until Chunk 9+.
  - **Two rules that matter most:** (1) Nothing ships without being full-stack real — no mock-data spine pages. (2) Chunk 4 is the pivot — anything that delays it does not ship in beta (including branding polish, extra preplan sections, trip ball modal, Dream Mode creation toggle).
  - **Top 9 solo-dev sequencing mistakes called out:** schema drip-feed, auth-before-schema, expenses-before-invites, itinerary-before-expenses, motion-before-CRUD, full-Basics-before-one-section, building-admin-UI, deferring-analytics-emission-past-Chunk-5, skipping-soft-delete-plus-timestamps-plus-indices-in-Chunk-1.
- Why:
  - **Chunk 4 as the pivot** reframes the entire sequencing debate: "what's the shortest path to Chunk 4?" becomes the scope filter for every decision. Anything that doesn't accelerate the pivot doesn't ship in beta.
  - **Full schema in Chunk 1** — a solo dev doing migrations across 8 chunks accumulates either (a) column-addition churn when feature needs change or (b) "I'll just patch it later" schema rot. One upfront pass lets every subsequent chunk be additive on stable ground.
  - **Expenses in Chunk 5 (the moat first after the pivot)** ships the switching-cost feature while post-pivot momentum is high and before feature fatigue sets in. Also: expenses have a simpler data model than itinerary (no timezones, recurrence, or reorder), so polish energy has more leverage here.
  - **No visual scaffolding for spine pages** — the single most tempting shortcut for a solo dev and the single worst rework trap. Wiring mock UI to real data is rarely a 1:1 translation; layouts shift when real shapes land. Full-stack in one pass is faster than scaffold-then-wire.
  - **Static trip ball and no motion until Chunk 9+** — motion/animation is the biggest time sink available to a solo dev and adds zero testability signal. Brand polish lands at Public MVP when users are strangers and aesthetics matter for conversion; in private beta with personal-network users, static is enough.
  - **Analytics emission starting Chunk 5, wiring at Chunk 10** — events emitted early means by the time PostHog is wired, historical funnel data is present from the moment the first real expense was logged. Wiring analytics late but emitting early is the correct split.
- Follow-up: BACKLOG.md updated with the canonical 12-step order and pivot moment flag. ROADMAP.md beta-weeks table kept; implementation-order pointer added. Next concrete action: begin Chunk 1 — install Drizzle, connect Neon dev branch, write full 10-table spine schema with all required columns/indices, apply migration. When that lands, this DECISIONS entry's follow-up should be updated to "Chunk 1 complete — moving to Chunk 2."

**Design skills:** `/user-research` skipped (execution sequencing, not UI). `/design-system` skipped. `/design-critique` skipped. `/design-handoff` **required** before coding each spine page that has a locked mockup — enforced per-page at Step 2 lock, not session-level. `/accessibility-review` **required** before beta onboarding (Chunk 10) across every page built in Chunks 3–9.

### 2026-04-20 - Naming audit: 7 renames locked, NAMING.md canonical

- Status: **accepted** (audit complete — 7 user-facing renames locked; NAMING.md created as canonical source of truth; revision pointers added to CORE_LOOP.md, PITCH.md, ROADMAP.md, MONETIZATION.md, DESIGN_SYSTEM.md)
- Context: User-requested naming audit on nav labels, page names, features, modes, and branded concepts. Existing names had accumulated organically across prior grills, producing mixed quality: strong flagship names (TripWave, Dream Mode) coexisting with invented jargon (Preplan), redundant phrases (Vacation Day), consulting-speak (Tools Hub, Dashboard), and tone-misaligned labels (Premium vs the supporter framing locked in MONETIZATION.md). User's philosophy hypothesis: primary nav = literal, branded flavor lives in special concepts. Audit pressure-tested and validated this philosophy while exposing internal inconsistencies.
- Decision:
  - **Philosophy validated:** primary nav/page names are literal (one-second test); branded flavor rationed to 3–4 flagship moments only. Current flagship surfaces after audit: **TripWave · Dream Mode · Afterglow · Vault**.
  - **Rename 1 — Vacation Day → Today.** "Vacation Day" is redundant (every trip day is one) and reads falsely parallel to "Travel Day" despite covering a different concept. "Today" is what the user means. Tab hidden/muted until Day 1 of trip; inside shows *"Today · Day 3 of 7."*
  - **Rename 2 — Preplan / Preplan Hub → Basics.** "Preplan" is invented jargon. "Basics" is friendly, accurate (these *are* the basics), scales across real/dream/solo trips, and is distinct from Itinerary.
  - **Rename 3 — Tools Hub → Tools** (interim). "Hub" is consulting-speak. Drop now; re-audit final name Post-MVP when page content is locked.
  - **Rename 4 — Memory recap → Afterglow.** Adds flagship branded moment #3. On-brand with neon/wave vocabulary. Emotional payoff of the app deserves a distinctive name, not phone-feature wording.
  - **Rename 5 — Dashboard → Home.** "Dashboard" is generic SaaS. "Home" is what the app-level landing is.
  - **Rename 6 — Premium → Supporter** (user-facing only). Aligns with the "thank-you, not feature unlock" framing already locked in MONETIZATION.md. Purchase sheet: *"Become a Supporter · $4.99 once"*. Badge: *"♥ Supporter"*. "Premium" persists as internal/dev shorthand.
  - **Rename 7 — In-progress (trip phase) → Active.** Internal docs rename only; users rarely see this label directly. "In-progress" is project-management-coded, not travel-coded.
  - **Trip Ball rule locked:** internal docs vocabulary only. Does not appear in user-facing copy. Color picker says "Color." First-run poetic framing may use "glow" but never "ball."
  - **Watch list:** Overview (defensible but generic, re-audit when in-trip home state gets v2 polish); Tools (interim, re-audit Post-MVP).
  - **NAMING.md created** as canonical source of truth. Forward work uses new names. Historical DECISIONS.md entries and UX_SPEC sections are not retroactively rewritten — the ledger stays honest. When a doc section is materially revised, names are updated to match NAMING.md at that time.
- Why:
  - **Literal nav + rationed branded flavor** is the pattern used by Linear, Things, Notion, Stripe — products TripWave wants to sit alongside aesthetically. Fully sanitized names flatten brand; fully flavored names demand a glossary.
  - **Preplan was the single worst name in the product** — invented jargon masquerading as a feature. Renaming it was the highest-leverage change in the audit.
  - **"Vacation Day" / "Travel Day" parallel-but-different** is a naming trap that would have confused every new user. Breaking the false parallel (Travel Day · Today) is a clarity win.
  - **Supporter vs Premium was an internal inconsistency** between MONETIZATION.md's tone commitment and its label usage. Renaming aligns substance with tone.
  - **Afterglow earns the third flagship branded slot** because the post-trip recap is the emotional payoff of the entire app. Under-branding it was leaving identity equity on the table.
  - **NAMING.md as canonical, forward-only** avoids massive doc churn (337 occurrences across 18 files) while making the renames authoritative for all new work. Retroactively rewriting 65+ historical decision log entries would corrupt the ledger.
- Follow-up: NAMING.md is canonical. Revision pointers landed in CORE_LOOP.md, PITCH.md, ROADMAP.md, MONETIZATION.md, DESIGN_SYSTEM.md. When UX_SPEC.md, BACKLOG.md, APP_STRUCTURE.md, or STATE_MODEL.md next receive material updates, their names should be brought in line with NAMING.md at that time. BACKLOG.md page labels for upcoming spine work should reference new names when built (Basics page, Today page, Home dashboard, Afterglow page, Supporter purchase sheet).

**Design skills:** `/user-research` skipped (audit framed by user naming intuitions + product-taste patterns, not novel user research). `/design-system` **required** when Supporter badge, Afterglow page, Today tab, and Basics hub reach mockup — each is a new surface needing DESIGN_SYSTEM.md fit confirmation. `/design-critique` **required** on any page mockup affected by the renames. `/design-handoff` **required** before implementation of any renamed surface. `/accessibility-review` **required** before shipping any surface with the new labels (contrast of the "♥ Supporter" badge; labels must pass screen reader semantics).

### 2026-04-20 - Roadmap grill: 11 decisions locked (re-grill corrected)

- Status: **accepted** (grill complete — 11 decisions + 5 tension resolutions locked; CORE_LOOP.md, PITCH.md, ROADMAP.md, MONETIZATION.md, ARCHITECTURE.md revision blocks added)
- Context: User requested a ruthless product-strategy grill on the TripWave roadmap to pressure-test market, user, differentiation, MVP scope, monetization, acquisition, retention, technical feasibility, and sequencing. Initial grill produced 11 answers; a re-grill then surfaced 5 contradictions in the initial output which were resolved before docs were updated. Pre-grill state: CORE_LOOP.md had a 16-item MVP list and linear 7-step spine; PITCH.md had internal contradictions between Dream Mode's role as acquisition engine and its Speculative classification; MONETIZATION.md had an 8-feature premium bundle; no defined beachhead user, no success metric, no 90-day sequence.
- Decision:
  - **Q1 — Acquisition mechanism: invite pull (organizer-driven).** The only user TripWave acquires cold is the organizer; the group follows via invite link. Every non-spine feature is judged against "does this make the organizer more likely to send the invite?"
  - **Q2 — Beachhead user: 22–28 friend-group organizers.** Bachelorette / birthday / ski / Tulum-style trips. Highest planning frequency, social-media density, and willingness to try a new app. Copy, defaults, and illustrations assume this archetype.
  - **Q3 — Differentiator (the moat): integrated expenses.** The Splitwise-killer. Aesthetic is brand, expenses is switching cost. Expenses ships polished to screenshot-worthy quality, not bolted on last.
  - **Q4 — Spine reframed as 3 arenas: Plan · Pay · Go.** Non-linear intra-app routing supported, but no cold-acquisition entry through Pay. The arenas serve post-invite members, not stranger discovery.
  - **Q5 — Dream Mode: stripped version in Public MVP.** Resolves prior contradiction (acquisition engine vs Speculative). Scope: create · public share URL · hero image · vibe tag · 3–5 placeholder items. No reactions, comments, save-to-dreams, mood boards.
  - **Q6 — Premium at v1 = 2 features only:** ad removal + receipt scanning. Other 6 premium features move Post-MVP. Affiliate promoted to spine-tier — it is the larger revenue lever (~$500k gross vs ~$243k net premium over 5 years).
  - **Q7 — Acquisition channels: personal network (first 20) → one Reddit community (20→100).** No paid ads. No TikTok audience-building pre-launch. Trip-report-style posts where TripWave is organically present, not "check out my app" posts.
  - **Q8 — Retention is episodic, not daily.** 2–4 trips/year per organizer. No streaks, no daily pushes, no feed. Dream Mode is *ambient availability* in dead months — pulled, never pushed.
  - **Q9 — Tech feasibility: stack is fine; real-time collab is the underestimated hard problem.** Ship optimistic UI + last-write-wins + soft conflict toast on concurrent edits within 10s. CRDTs (Yjs) Post-MVP. Native wrap scoped during Public MVP, ships Month 3–6 post-launch.
  - **Q10 — 90-day sequence: foundation → lean spine → private beta with 20 users.** Weeks 1–2 foundation; 3–4 trip creation + invite; **5–6 expenses polished to moat-quality** (moved ahead of itinerary); 7–8 itinerary CRUD + budget preplan; 9–10 Travel Day checklist + bell + static trip ball + between-trips home state; 11–12 beta onboarding + analytics.
  - **Q11 — Success metric: settled trips with ≥2 expense-logging members.** Year-1 target: 1,000. Supersedes all WAU/MAU framing.
  - **Tension 1 — Dream Mode MVP vs excluded from 90 days:** wording issue. 90-day scope = *private beta*, not MVP. Dream Mode ships in Public MVP (weeks 13–24).
  - **Tension 2 — Affiliate importance vs excluded from 90 days:** sequencing issue. Same resolution: affiliate in Public MVP, not beta. Beta stubs the chips.
  - **Tension 3 — Expenses moat vs itinerary sequenced first:** real contradiction in Q10. Swapped: expenses weeks 5–6, itinerary 7–8.
  - **Tension 4 — Organizer-first vs expense-tag joiners:** wording issue. Only one acquisition vector (organizer). "Arenas standalone" means *intra-app routing*, not cold entry. Pay-as-a-second-wedge framing killed.
  - **Tension 5 — Episodic retention vs Dream Mode engagement:** wording issue. "Engagement" reworded to "ambient availability." No pushes ever. Dream Mode is pulled.
- Why:
  - **Invite-pull as the only mechanism** because the group is the product, and groups don't switch; organizers switch and drag the group. This reframing makes organizer delight the primary optimization target.
  - **Beachhead cohort (22–28 friend-group organizers)** because that cohort has the trip frequency, social density, and app-switching tolerance to seed both usage and organic invite virality. Families, couples, and nomads are wrong-cohort starting points.
  - **Expenses as the moat** because it's the only feature Wanderlog / TripIt / Roadtrippers cannot copy in a weekend with meaningful switching cost. Aesthetic and trip ball are brand; they are not defensible.
  - **Two milestones (beta 90d, Public MVP wk 13–24)** because collapsing them into a single "MVP" hid the real sequencing decision: what proves the spine works before monetization surfaces ship.
  - **Premium shrunk 8 → 2 features** because feature breadth at $4.99 doesn't move conversion; shipping less, polished, is the solo-dev path. Affiliate is the larger and more defensible revenue lever.
  - **Success metric (settled trips with ≥2 loggers)** because it's the only single funnel that proves the whole spine worked end-to-end. Revenue and WAU are trailing / wrong-shaped.
- Follow-up: CORE_LOOP.md, PITCH.md, ROADMAP.md, MONETIZATION.md, ARCHITECTURE.md all received revision blocks at the top. ROADMAP.md got the full canonical doctrine section (Beachhead, Acquisition, Moat, Retention, Metric, 90-Day Beta scope, Public MVP scope, Post-MVP priority). BACKLOG.md still to be aligned (next session): beta-tier items need to match the corrected weeks-1-to-12 sequence; expenses moves from week 7–8 slot to week 5–6 slot. Post-MVP ordered list in ROADMAP.md is authoritative for the backlog grooming.

**Design skills:** `/user-research` skipped (product-strategy grill, no novel user-facing UI decided). `/design-system` skipped (no new visual patterns). `/design-critique` skipped (no mockup produced). `/design-handoff` skipped (no implementation handoff). `/accessibility-review` skipped (no shipping surface). `/research-synthesis` not applicable yet (no user feedback pile). All six skills remain required at their respective implementation moments per GRILL_PROTOCOL.md when any of the newly-scoped MVP pages (between-trips home state, stripped Dream Mode, affiliate chips, premium sheet, ad banner) proceed to mockup and code.

### 2026-04-20 - Implementation planning: grill complete (sequencing + backlog restructure locked)

- Status: **accepted** (grill complete — 6 decisions locked; BACKLOG.md restructured to spine-only; ROADMAP.md updated with Post-MVP Feature Backlog + pricing fixes)
- Context: Final grill in the stated 11-item sequence. Current state entering this grill: UI shell + setup page in mock-data mode; ORM locked (Drizzle) but not installed; auth direction set (Better Auth) but not wired; DB schema drafted but not applied; 15 spine pages owe Step-1 inventories; no backend routes exist. All product and UX decisions for the spine are now locked across the prior grills.
- Decision:
  - **Q1 — True next action: pivot immediately to foundation.** Mock-data frontend accumulates rework as real data shapes land. Correct sequence: ORM install → DB schema → auth → shell wired to real data. Each spine page then gets built full-stack (backend route + frontend) in one pass. No more mock-data accumulation.
  - **Q2 — Foundation sequencing: ORM → DB schema → auth → app shell polish.** Strict dependency chain. Auth needs the user table; the user table needs the schema; the schema needs ORM. Honoring the chain eliminates "wait, I have to redo this" moments downstream.
  - **Q3 — Step-1 inventories: just-in-time.** Write the detail inventory immediately before coding that specific page — not in advance, not after. 15-inventory batch would be partly wrong by the time code starts. Enforced at the page level, not the session level.
  - **Q4 — Backlog discipline: slim to spine, move P2/P3/speculative to ROADMAP.md.** BACKLOG.md restructured to ~200 lines covering only the spine + launch checklist + monetization setup items. All 150+ post-MVP items (social layer, wishlist, notes, vault, tools hub, memory, dream mode, planning tools, destination tools, contingency levers, research queue) moved to ROADMAP.md → Post-MVP Feature Backlog.
  - **Q5 — Launch milestone: spine + monetization live (v1 floor = B; target = D).** Floor: full spine loop end-to-end + Stripe purchase sheet ($2.99 founder's + $4.99 standard) + ad banner + founder's counter live. Target: all 16 CORE_LOOP.md MVP items. Later features (Polls page, Wishlist page, Vacation Day full build) not required for v1.
  - **Q6 — Branch strategy: branch from master after first full-stack page (trip creation) is merged and stable.** Existing DECISIONS.md says "branch when foundation is stable." Operationalized: "foundation stable" = first full-stack feature (trip creation flow with real auth + DB) merged to master. After that point, every new page or feature gets its own branch.
- Why:
  - **Foundation-first** is the only path without rework. Mock-data pages look finished but are not. Data shapes always shift when the real schema lands. Building foundation first means every subsequent page is one pass: schema → route → UI wired.
  - **Just-in-time inventories** respect the reality that pages change as they're built. Pre-producing all 15 inventories would produce stale specs. The rule "inventory before code for that page" applied just-in-time is both enforceable and accurate.
  - **Slim backlog** makes the "what do I work on today?" decision fast and obvious. A 600-line backlog with P2/P3 noise next to P0 blockers is a productivity hazard for a solo dev.
  - **Spine + monetization as v1 floor** ensures the launch event (founder's pricing window, pre-launch audience campaign) has a real conversion path. Launching the spine with no purchase flow is a wasted acquisition moment.
  - **Branch after first full-stack feature** gives a concrete, observable trigger that avoids the vague "foundation is done" judgment call.
- Follow-up: BACKLOG.md restructured to spine-only (~200 lines). ROADMAP.md updated with Post-MVP Feature Backlog (all moved P2/P3 items) + pricing refs fixed ($7.99 → $4.99 throughout; founder's $4.99 → $2.99). Next step: begin foundation phase — ORM install → schema → auth.

**Design skills:** `/user-research` skipped. `/design-system` skipped. `/design-critique` skipped. `/design-handoff` skipped. `/accessibility-review` skipped. — Implementation planning session; no UI decisions made. All six skills remain required at their respective implementation moments per GRILL_PROTOCOL.md.

### 2026-04-20 - Monetization: grill complete (pricing revised downward, upgrade surfaces and ad zones locked)

- Status: **accepted** (grill complete — 6 decisions locked; MONETIZATION.md §§ 2, 11, 15, 17, 18, 19, 21, and new § 25 updated)
- Context: Tenth grill in stated order. User's stated concern entering the grill: $7.99 standard price may be too high and should be grounded in realistic conversion outcomes and comparable apps. Full monetization spec existed (§§ 1–24). Open questions: standard price validation, founder's price structure given standard price revision, premium feature set confirmation, in-app upgrade discovery surface, canonical ad zone placement, and 5-year revenue target recalibration.
- Decision:
  - **Q1 — Standard permanent price: $4.99 (down from $7.99).** Market comps for "supporter thank-you" one-time purchases cluster at $4.99 (Monument Valley 2, Reeder, Carrot Weather). The $7.99 price signals utility-tool positioning incompatible with the existing supporter framing. Emotional purchases convert ~2× better at $4.99 vs $7.99+; at realistic conversion differentials, $4.99 produces more total revenue than $7.99 at lower volume.
  - **Q2 — Founder's price: $2.99 (down from prior $4.99).** With standard at $4.99, the founder's tier needs a real gap. $2.99 creates a story-worthy $2 delta and a genuine early-adopter moment. Total discount cost: ~$2,000 for 1,000 founder spots — a trivial acquisition cost for 1,000 committed users with Founder badges.
  - **Q3 — Premium feature set: keep all 8 as-is.** At $4.99, eight features (offline, ad removal, receipt scan, currency converter, smart suggestions, templates, export, trip duplication) is an easy, generous sell. No reason to strip or tier; feature set was previously grilled and locked.
  - **Q4 — In-app upgrade discovery: one post-trip prompt + account menu.** A single, once-per-lifetime prompt fires after a user's first trip completes (highest gratitude moment in the user journey). After that, premium lives only in the account menu. No persistent dashboard card, no nudge emails, no repeated prompts. Inline paywalls remain at feature gates (offline gate, receipt scan, ad units).
  - **Q5 — Ad zones: banner + native card hybrid, no interstitials.** Bottom-fixed banner on dashboard idle state and vault; native-styled card after 3rd–4th section in preplanning hub. Permanently ad-free: Travel Day (all phases), Vacation Day, expense entry, polls/voting, all modals and sheets, onboarding, invite flow. Ad format rules: max 50px banner, native card matches tile height, dark-surface-native styling, no animation, *"Sponsored"* label in 10px small-caps.
  - **Q6 — 5-year revenue target: 70k sales at $4.99 standard.** Net premium: ~$243k (1k founders at $2.99 + 69k standard at $4.99, after Apple/Stripe cuts). Up from prior 50k target; reflects higher expected conversion at $4.99. Combined with ads (~$100k) and affiliate (~$500k gross), 5-year realistic revenue: ~$693k.
- Why:
  - **$4.99** is where emotional one-time purchases convert. The "supporter thank-you" framing the doc already commits to is built for this price tier — not for $7.99.
  - **$2.99 founder's** creates a story-worthy gap and rewards the early cohort who take a bet on an unproven product. The Founder badge plus the $2 price delta is the correct incentive structure.
  - **Post-trip prompt timing** is the strongest natural conversion moment in the user lifecycle — the gratitude from a successful group trip converts without pressure. Firing it once-ever respects the "no guilt, no pressure" brand posture.
  - **Banner + native card** balances ad revenue with product integrity. Interstitials are permanently off the table — the brand and long-term retention value of not doing interstitials exceeds any short-term CPM gain.
  - **70k sales target** is honest at $4.99 given viral invite mechanics. Revenue math still works: premium at ~$243k + ads + affiliate > infra costs by a wide margin.
- Follow-up: MONETIZATION.md fully updated — §§ 2, 11, 15, 17, 18, 19, 21 revised; § 25 (Upgrade Surfaces and Ad Zones) added. All $7.99 standard price references updated to $4.99; all founder's $4.99 references updated to $2.99. Next grill: **Implementation planning** (grill 11).

**Design skills:** `/user-research` skipped (pricing and business decisions; no novel UI). `/design-system` **required** before implementing the post-trip prompt card and native ad card — both introduce new card patterns. `/design-critique` **required** on the premium purchase sheet before implementation. `/design-handoff` **required** before coding upgrade surfaces. `/accessibility-review` **required** before shipping any paywall or ad surface.

### 2026-04-20 - Polls / Wishlist / Scavenger Hunt: grill complete

- Status: **accepted** (grill complete — 16 decisions locked; UX_SPEC §§ 12, 13, and new § 43 updated)
- Context: Eighth grill in stated order (user explicitly added Scavenger Hunt to this slot). §§ 12 (Polls) and 13 (Wishlist) were locked 2026-04-17 with layout and promotion mechanics specced. Scavenger Hunt had zero UX_SPEC presence — Step 1 inventory produced from scratch. Gaps: who-can-start-polls was unspecced; poll close notification behavior undefined; tie-breaking undefined; anonymous mode referenced but not specced; blocking flag mentioned but not implemented; self-like counting for hot-section threshold unresolved; wishlist Vaulted persistence unclear; add-permission default not stated; link preview fallback for no-OG-tags unresolved; and all Scavenger Hunt mechanics (suggestion flow, competitive mode, completion types, photo evidence, Vacation Day strip, pre-trip teaser, points system) unspecced.
- Decision:
  - **Q1 — Who can start polls: Standard+ by default; organizer can restrict to Trusted+.** Keeps the feature social and participatory. Restricted users see the button hidden with an explanatory note.
  - **Q2 — Poll close notification: group notification with winner highlighted.** *"[Question] — [Winner] won!"* fires to all members. Closed-poll row updates simultaneously.
  - **Q3 — Ties: co-winners, group decides organically.** No forced auto-break. Both options shown with equal weight in the closed row. *Convert to itinerary item* appears on each co-winner independently.
  - **Q4 — Anonymous mode: creator toggles at creation; counts shown, no avatars.** Switch at creation time. Mode locked after first vote. Creator cannot see individual attribution — anonymity is real, not partial.
  - **Q5 — Blocking flag: creator links poll to specific itinerary item at creation.** Linked item gains an orange flag badge: *"Pending poll decision"*. Badge clears when winner is chosen or organizer dismisses.
  - **Q6 — No self-likes: only other members' likes count toward hot-section threshold.** Self-expression (heart toggle) still works visually; the count excludes the adder for threshold purposes. Threshold remains 2+ non-self likes.
  - **Q7 — Wishlist persistence in Vaulted trips: all ideas persist read-only.** Ideas never promoted to itinerary are visible in the vault. No writes on a Vaulted wishlist; header note: *"Trip vaulted — this wishlist is a memory."*
  - **Q8 — Wishlist default: open (all Standard+ can add ideas).** Organizer can restrict at any time via settings. Switching modes does not remove existing ideas.
  - **Q9 — Link preview: styled card regardless of OG tag availability.** OG title + image when present. Fallback: domain name + favicon as header, idea title as body. No broken-preview state.
  - **Q10 — Scavenger Hunt challenge source: member-suggest with organizer approval.** All Standard+ can suggest; suggestions enter a pending queue. Organizer approves / rejects. Approved challenges appear on main list; rejections are silent.
  - **Q11 — Competitive mode: off by default, organizer opts in.** When off: completion tracked, no leaderboard, points shown as completion weights only. When on: leaderboard strip visible, real-time point totals.
  - **Q12 — Completion type: organizer sets group vs individual per challenge.** Group: first claim marks it done for everyone. Individual: each member tracks their own claim state.
  - **Q13 — Photo evidence: optional / required set per challenge at creation.** Required = camera sheet before claim submits. Optional = expandable photo step, skippable. None = one-tap claim. Photos stored in trip Vault.
  - **Q14 — Vacation Day strip: horizontal scroll of tappable challenge pills.** Pill = name (truncated) + status dot (grey / cyan / green). Strip header: *"Scavenger Hunt · X/Y complete."* Strip hidden when no challenges exist.
  - **Q15 — Pre-trip teaser: visible to all from Planning; claiming InProgress-only.** Challenge list shows in read-only mode with *"Claiming opens when the trip starts"* on each card. Leaderboard hidden pre-trip.
  - **Q16 — Points: 1–10 per challenge, organizer-set, default 1 if unset.** Additive totals, no multipliers. Leaderboard ranks by total; ties show co-ranked with equal treatment.
- Why:
  - **Member-suggest with approval** keeps the challenge list curated without blocking creativity — members feel ownership, organizer keeps quality control.
  - **Competitive mode off by default** makes the feature feel lightweight and optional. Groups with strong competitive energy opt in; casual groups use it as a fun checklist.
  - **Per-challenge completion type** handles both cooperative and individual challenges without a global mode toggle — both styles can coexist in the same hunt.
  - **Photo evidence per-challenge** avoids all-or-nothing: some challenges need proof, others are trust-based. Granularity at the challenge level is the right scope.
  - **No self-likes** prevents wishlist gaming where one user inflates their own idea to the hot section unilaterally.
  - **Wishlist in Vault** preserves the planning artifact as a memory, not just a to-do list. Ideas that didn't make the itinerary are still part of the trip story.
  - **Open poll creation by default** makes polls a social, participatory tool. Restriction is an escape valve for organizers who need control, not the default posture.
- Follow-up: UX_SPEC § 12 (updated: who-can-start, close notification, tie-breaking, anonymous mode, blocking flag). UX_SPEC § 13 (updated: self-like rules, Vaulted persistence, default permission, link preview fallback). UX_SPEC § 43 (NEW — full Step 1 inventory + all Scavenger Hunt mechanics). Next grill per stated order: **Monetization / upgrade surfaces / ad zones** (grill 10).

**Design skills:** `/user-research` skipped (feature patterns well-understood from established card/claim conventions and existing poll spec). `/design-system` **required** before any mockup — pill-strip component (Vacation Day), challenge card, pending queue, leaderboard strip, and blocking-flag badge are all new patterns not yet in DESIGN_SYSTEM.md. `/design-critique` **required** after mockup. `/design-handoff` **required** before implementation. `/accessibility-review` **required** before shipping.

### 2026-04-20 - Vacation Day: grill complete

- Status: **accepted** (grill complete — 9 decisions locked; UX_SPEC §§ 10 and 39 updated)
- Context: Seventh grill in stated order (Vacation Day is Later per CORE_LOOP.md but included in the user's stated grill sequence). §§ 10 and 39 locked 2026-04-17. Layout and visual treatment well-specced. Gaps: event completion had no interaction mechanism, swipe-right quick actions were unspecified, weather line had no fallback plan (weather deferred in itinerary but referenced in Vacation Day briefing), activity strip empty state unresolved, last-day peek-tomorrow unreplaced, personalization scope unclear, ad suppression scope unclear.
- Decision:
  - **Q1 — Event completion: auto on time passing + manual override.** Events auto-complete when end time passes (or start + 1 hr). Long-press → *Mark done* for early completion; long-press → *Undo complete* for reversal. Events drift away as the day passes — matches the "river" metaphor.
  - **Q2 — Completion state shared with itinerary.** One record, one state. Vacation Day and itinerary are two views of the same event data. No separate completion layer.
  - **Q3 — Swipe-right quick action: minimal one-field capture.** Add event → title only (Note, today). Log expense → amount only (current user, even split, today). Start poll → question only (2 blank options). Consistent "fast capture" pattern across all three.
  - **Q4 — Add event defaults to today.** Quick action is for right-now moments. Future-day adds go via the itinerary phase.
  - **Q5 — Activity strip hidden when empty.** No placeholder filler. Strip appears only when there is actual group activity to show.
  - **Q6 — Weather via Open-Meteo free API, ships v1.** Not deferred. One API call per day (destination + date → current conditions). Cost: free. Effort: minimal. The briefing card without weather is noticeably emptier.
  - **Q7 — Last day peek tomorrow: travel home link if return leg exists; expenses nudge otherwise.** *"Tomorrow: Travel Day home"* is the most useful context for users with a return leg. *"Last day! Settle up expenses"* is the fallback when no return leg is in the itinerary.
  - **Q8 — Personalization: greeting only.** *"Morning, Chris!"* is personalized; event list and briefing summary are shared. Group coordination requires shared data.
  - **Q9 — Ad suppression: full Vacation Day page, all users.** Same treatment as Travel Day focus mode. Highest-emotion in-trip surface. *"No ads while you're actually on your trip"* is a warm, honest free-tier differentiator that costs nothing meaningful in revenue (in-trip sessions are short and frequent — not the primary ad-impression surface).
- Why:
  - **Auto-completion** is the right default for a vacation surface — manual tick-off of every event is chore-like and breaks the river metaphor.
  - **Shared itinerary state** avoids dual-state management and keeps the itinerary's live marker accurate.
  - **Swipe-right minimal capture** gives the gesture real utility. Without a sensible default, the swipe is meaningless.
  - **Open-Meteo** costs nothing and takes one afternoon to integrate. The weather line in the briefing is referenced in two sections — shipping without it produces a visibly incomplete card.
  - **Full-page ad suppression** protects TripWave's strongest retention surface. In-trip users are the most emotionally engaged — they're the most likely to convert to premium and the most likely to invite others. Breaking that moment with an ad is the wrong trade.
- Follow-up: UX_SPEC § 10 (updated: event completion mechanics, shared state, activity strip empty state, weather API, last-day peek tomorrow, auto-activation conflict resolution, ad suppression, personalization scope, quick-action swipe). UX_SPEC § 39 (updated: status date, long-press action sheet, swipe-right minimal capture spec). Next grill per stated order: **Polls / Wishlist / Group coordination** (step 9).

**Design skills:** `/user-research` skipped. No new visual patterns introduced — all surfaces extend existing § 39 treatment. `/design-critique` pending before implementation of auto-completion animation (time-based dimming + collapse). `/design-handoff` pending before JSX. `/accessibility-review` pending before shipping — auto-completing events must announce to screen readers; reduced-motion fallback for collapse animation required.

### 2026-04-20 - Travel Day: grill complete

- Status: **accepted** (grill complete — 11 decisions locked; UX_SPEC §§ 9 and 38 updated)
- Context: Sixth grill in stated order. §§ 9 (mode behavior) and 38 (neon-on-dark focus mode) were locked 2026-04-17; § 39 (multi-leg repacking) locked 2026-04-20. Focus mode execution experience is well-specced. Gaps: planning-phase task editor had no anatomy spec ("add / edit / reorder freely" with zero detail), default task population was unspecced, per-member focus mode view was unresolved, Skip semantics were undefined, "We've arrived" trigger was ambiguous between completing the last task and a separate button, and offline behavior for Travel Day on free tier was not addressed.
- Decision:
  - **Q1 — Task add/edit: hybrid inline + modal.** Quick-add inline at bottom of each segment group (description + implied segment; *+ More* for time/traveler/notes). Three-dot → Edit opens slide-up modal / side-panel for full field editing. Fast for simple tasks; full fields available.
  - **Q2 — Default task groups: blank + "Generate checklist from your trip" button.** Opt-in generation derives tasks from transport modes + itinerary Transport events. Users who want to build their own list ignore it. Generated tasks are independently editable.
  - **Q3 — Segment assignment: user-picks via which group they add under.** Inline add implies segment from the group header. Time-based auto-classification fails on timeless tasks.
  - **Q4 — Task reorder: drag within segments + segment reorder.** Two-level drag: tasks within a segment, segments themselves. Dragging across segment boundary moves task to new segment. Same pattern as packing categories + items.
  - **Q5 — Per-member focus mode: your tasks first, everyone else collapsed.** Tasks assigned to you dominate the single-task view. Unassigned tasks appear for all. Other members' tasks visible below as read-only status chips in a collapsed "Everyone else" section.
  - **Q6 — Skip: per-leg, visual treatment.** Skip collapses task to faded "Skipped" label; can be un-skipped. On multi-leg trips, skipped task reappears fresh on next leg. Does not count toward completion.
  - **Q7 — Manual add in focus mode: small "+ Add task" link.** Opens minimal inline (description + time). Does not disrupt the single-task layout. Covers "I forgot to add 'text mom when landed'" case.
  - **Q8 — "We've arrived" trigger: two paths.** Happy path (all tasks done): last task completion triggers post-arrival screen immediately; *Open Vacation Day* tap confirms arrival + transitions state. Early-exit path: *"Mark as arrived"* CTA surfaces on trip overview. Auto-transition at 23:59 regardless.
  - **Q9 — Partial completion at 23:59: post-arrival record only.** Incomplete tasks archived into read-only Travel Day record. No morning-briefing nag, no guilt callout.
  - **Q10 — Itinerary → Travel Day connection: reference-only via Generate button.** Generated tasks are seeded from itinerary Transport events but become independent records after creation. No shared data model; no bi-directional sync.
  - **Q11 — Offline behavior: Travel Day checklist fully functional offline for all users.** Free and premium. Checklist is lightweight, always cached. Paywalling a travel-day checklist offline at the airport is a trust-destroying experience. Premium offline covers itinerary detail and vault; checklist is a safety feature unconditionally.
- Why:
  - **Hybrid inline + modal** matches established pattern from packing (inline edit) and itinerary (modal for full fields). Consistent; no new mental model.
  - **Opt-in generation** respects organizer agency while delivering a marketable magic moment — one tap to a personalized checklist derived from real trip data.
  - **Segment assignment by group** is the correct model because tasks are often timeless; time-based classification silently misfires.
  - **Two-level drag** is already established in packing; no new pattern needed.
  - **Your tasks first** gives personal execution utility without losing the group-awareness that makes Travel Day useful for group trips.
  - **Per-leg skip** is the only skip model consistent with multi-leg repacking's fresh-per-leg principle.
  - **Two-path arrival** separates the happy-path celebration from the edge case without blocking either.
  - **Post-arrival record only** for incomplete tasks avoids jetlagged guilt-trips.
  - **Travel Day offline always free** — this is a safety feature, not a monetization lever. A frustrated user stranded at the gate is a 1-star review and an uninstall. The trust cost dwarfs any conversion upside.
- Follow-up: UX_SPEC § 9 (updated: post-arrival two paths, offline behavior, per-member view reference). UX_SPEC § 38 (updated: full planning-phase editor spec — segments, task anatomy, hybrid add flow, generate button, two-level drag; focus mode updated — per-member view, skip semantics, manual add). Next grill per stated order: **Vacation Day** (step 7 of spine).

**Design skills:** `/user-research` skipped. `/design-critique` pending — planning-phase editor (task groups + inline quick-add) has no mockup; produce ASCII wireframe before implementation. `/design-system` pending — "Generate checklist" CTA treatment and two-level segment+task drag are new patterns; confirm fit with DESIGN_SYSTEM.md. `/design-handoff` pending before JSX. `/accessibility-review` pending before shipping — swipe-to-complete needs non-swipe alternative (Done button covers it per § 38); segment transition overlays need reduced-motion fallback.

### 2026-04-20 - Packing: grill complete

- Status: **accepted** (grill complete — 12 decisions locked; UX_SPEC §§ 8 and 37 updated)
- Context: Fifth grill in stated order. Three sections already locked: § 8 (three-tab structure), § 37 (neon-on-dark treatment + animations), § 39 (multi-leg repacking). No new surfaces needed — all behavioral interaction details were open. Key gaps: category lifecycle (can users delete defaults?), item ordering, move-to-group semantics (*"Share with group"* vs *"Move to group list"* was ambiguous), group item check semantics (whose check counts?), check-off persistence, cross-member My list visibility, suggestion inputs, suggestion post-add behavior, edit item flow.
- Decision:
  - **Q1 — Default categories: seeded but immediately user-owned.** Clothing / Toiletries / Electronics / Documents / Other seeded on first open. Users can rename, delete, reorder — same powers as custom categories. No sacred fixtures.
  - **Q2 — Category ordering: drag-to-reorder.** Drag handle on category headers. Persists server-side per trip per user. Reuses established drag pattern from itinerary.
  - **Q3 — Item ordering within category: creation order.** Checked items move to collapsed *Packed (N)* section via staged reveal (§ 37). Unchecked items stay in creation order.
  - **Q4 — Move to group list: cut + pre-assign mover as bringer.** Item leaves My list, appears in Group list assigned to the person who moved it. No copy, no orphaned unassigned item.
  - **Q5 — "Share with group" action removed.** Redundant with *Move to group list*. Three-dot simplifies to: Edit / Move to group list / Delete / Make private (toggle). One clear action for cross-tab sharing.
  - **Q6 — Group item check: bringer-only.** Only the assigned bringer can check a group item. Other members see a read-only filled/empty indicator on the bringer's avatar. One owner, one check — accountability model.
  - **Q7 — Unassign: bringer + organizer.** Bringer can self-unassign; organizer can override. Covers "Bob dropped out" case without over-granting.
  - **Q8 — Check persistence: trip-duration server-persisted.** Checks survive relaunches and device switches. Clear automatically at Stale state. Distinct from per-leg repack check (§ 39) which has independent binary state.
  - **Q9 — Cross-member My list: no visibility.** My list is personal-only. Organizer cannot see other members' items. Group tab is the shared surface. "Your packing list is yours" is a trust feature.
  - **Q10 — Suggestion inputs: `tripVibe` + transport modes + traveler count.** `tripVibe` (relaxed/packed/spontaneous/structured) and transport modes (flying = lighter suggestions; road trip = different) are already in STATE_MODEL and Setup — zero new data required. Traveler profile integration (dietary/medical) deferred to Later.
  - **Q11 — Suggestion post-add: slides out with undo toast.** *"Added. Undo?"* for 3 seconds. Prevents re-adding; signals progress without losing recoverability.
  - **Q12 — Edit item: inline.** Tapping Edit transforms the row into an in-place editable state (name = focused text input, quantity = stepper). Save on blur or Enter. No modal — packing items are simple.
- Why:
  - **User-owned defaults** remove the worst kind of friction — invisible arbitrary rules. No one should ask "why can't I delete Documents?" on a road trip.
  - **Drag-to-reorder categories** is the only ordering model that respects personal habit (*"I always check Electronics first"*). Alphabetical and creation-order both get it wrong for different people.
  - **Cut not copy on group move** keeps one source of truth per item. Two records for the same item diverge immediately.
  - **Removing "Share with group"** eliminates the confusion between two similar-sounding actions. Simplification is the decision.
  - **Bringer-only check** creates clear accountability without surveillance. The group can see *whether* the sunscreen is packed; only the bringer marks it.
  - **Trip-duration persistence** is essential — packing takes real work and losing check state mid-trip is the kind of bug that generates 1-star reviews.
  - **No cross-member My list** protects personal space. Medical items, personal hygiene, and anything embarrassing belong to the user alone.
  - **Inline edit** is the right weight for a checklist item — a modal would be overkill for changing "Socks" to "Socks (3 pairs)."
- Follow-up: UX_SPEC § 8 (updated: category behavior, move semantics, share-with-group removed, check persistence, cross-member visibility, suggestion inputs). UX_SPEC § 37 (updated: drag-to-reorder categories, inline edit, group check bringer-only, unassign permissions, suggestion slide-out undo). Next grill per stated order: **Travel Day** (step 6 of spine).

**Design skills:** `/user-research` skipped. `/design-critique` pending only if inline-edit row treatment or drag-handle visual requires a new pattern — otherwise existing § 37 neon treatment is sufficient. `/design-handoff` pending before implementation. `/accessibility-review` pending before shipping — check animation particle burst needs reduced-motion fallback (§ 37 already notes this; must verify in implementation).

### 2026-04-20 - Itinerary: grill complete

- Status: **accepted** (grill complete — 15 decisions locked; UX_SPEC §§ 6, 7 updated; new § 7a Add/Edit Item Modal added; § 36 updated; STATE_MODEL anchor event defined)
- Context: Fourth grill in stated order. Three sections already locked (2026-04-17): § 6 (day-by-day scroll layout), § 7 (card anatomy), § 36 (neon-on-dark treatment). The add/edit item modal was referenced 6+ times across the doc but never specced — the largest gap. C1 (quick-add day targeting) and C2 (desktop inline expansion) were conflicts between §§ 6 and 36. Anchor event was referenced in STATE_MODEL's Planning→Ready trigger but never defined. 10 interaction behaviors unresolved.
- Decision:
  - **Q1 — Bonus fields per category: shared base + "More details" expander.** Shared fields always present (title, day, time, all-day, location, notes). Expander reveals: Transport → origin, destination, carrier, confirmation; Reservation → confirmation, party size, booking platform; Activity and Note → no bonus fields. Keeps quick-add fast; details optional.
  - **Q2 — Duration: derived from end time minus start time.** User sets start + optional end time. Duration label is read-only computed. Natural input; no mental math.
  - **Q3 — Desktop: side-panel drawer (~340px, right side).** Keeps day-list visible behind drawer. Clicking a different card switches event without closing drawer. Clicking into the day-list closes drawer without saving.
  - **Q4 — Anchor event: non-Note, non-Free-time item with specific start time set on a real calendar day.** Timed flights, dinners, activities count. All-day placeholders and unscheduled notes do not.
  - **Q5 — Date-less itinerary: user sets trip duration (number of days) without actual dates.** Numbered Day 1, Day 2... in picker. Soft banner inside modal to add dates. Day numbers remap 1:1 when dates are finally set.
  - **Q6 — All-day events sort to top of day, before timed events.**
  - **Q7 — Time conflict detection: soft orange triangle warning.** Non-blocking. Tooltip names the overlapping event. Intentional overlaps (group splits) are common and allowed.
  - **Q8 — Drag-to-reorder: all-day and time-unset events only within a day.** Drag handle on those cards only. Timed events auto-sort by start time; reorder via time field edit.
  - **Q9 — Traveler tagging default: all members.** Tagging is cosmetic/social — not functional gating. Members can self-remove. Adder or Trusted+ can manage all tags.
  - **Q10 — CRUD permission: own items always editable/deletable; others' items require Trusted+.**
  - **Q11 — Self-untag: any member can remove their own tag. Members cannot self-add to events they weren't tagged on.**
  - **Q12 — Day collapse persistence: session-only.** Resets to expanded on every page load. Collapse is scroll navigation, not a preference.
  - **Q13 — Expense badge tap: mini-popover.** Shows description + total + payer + your share. No navigation away from itinerary.
  - **Q14 — Multi-destination: destination label in day header when destination transitions.** *"Day 4 · Wed — Osaka"*. Derived from Setup destinations + date ranges. Single-destination trips show destination on Day 1 only.
  - **Q15 / C1 — Quick-add default target: next upcoming day pre-trip, today during in-progress.** User changes in modal. Resolves § 6 / § 36 conflict.
- Why:
  - **Expander for bonus fields** matches expense modal's "More options" pattern — consistency over invention.
  - **Derived duration** is natural; end-time input is how people actually think.
  - **Side-panel drawer** on desktop is the right list-detail pattern — spatial context is preserved, editing is fast.
  - **Anchor event definition** needed to be precise enough to implement; all-day items are intentionally excluded because they require no real scheduling commitment.
  - **Date-less itinerary** unblocks planning before flights are booked — a real and frequent user state.
  - **Soft conflict warning** respects agency without blocking; group trip splits are routine.
  - **Drag only for unscheduled events** prevents nonsensical reordering of timed events while still giving ordering control where it's needed.
  - **Own-item CRUD** is the expected ownership model; surprises users least; protects against accidental cross-editing.
  - **Expense badge popover** keeps the user in context — mid-itinerary lookups are glances, not navigation events.
  - **Destination label in day header** is the highest-signal, lowest-clutter solution for multi-leg trips.
- Follow-up: UX_SPEC § 6 (updated: day sort order, quick-add default, day collapse clarified), § 7 (updated: expense badge tap, conflict indicator, desktop drawer, duration derived, traveler tagging), new § 7a Add/Edit Item Modal (full anatomy), § 36 (updated: drag-to-reorder, destination label, reduced-motion note). STATE_MODEL anchor event definition added. Next grill per stated order: **Packing** (step 5 of spine).

**Design skills:** `/user-research` skipped. `/design-critique` pending — add/edit modal (§ 7a) has no mockup yet; produce ASCII wireframe for mobile sheet + desktop drawer and run before implementation. `/design-system` pending — side-panel drawer and expense-badge mini-popover are new surface patterns; confirm fit with DESIGN_SYSTEM.md. `/design-handoff` pending before any JSX. `/accessibility-review` pending before shipping — live "you are here" marker uses motion; reduced-motion handling is specced but must be verified.

### 2026-04-20 - Invite & members / permissions: grill complete

- Status: **accepted** (grill complete — 18 decisions locked; UX_SPEC §§ 18 / 19 / 21 updated; MONETIZATION § 10 updated; § 42.6 trip switcher updated)
- Context: Third grill in the stated order (lifecycle → creation → invite). Going in, §§ 18 / 19 / 21 were marked locked (2026-04-17) but contained three conflicts with the 2026-04-20 Trip Creation grill and multiple open questions: inviteMode values were undefined operationally; post-join sequence had a Must Dos vs splash vs overview conflict; slot-reward trigger timing and invite-sender identity were ambiguous; member cap, self-leave, demotion behavior, removed-member experience, and pending-list visibility were unspecced.
- Decision:
  - **Q1 — inviteMode: three operationally distinct modes.** `invite_only` (default) = link + code active, join-gated. `private` = link dormant, no one can join until organizer flips on. `public_link` = anyone with link gets read-only preview + can join — the marketing/viral surface.
  - **Q2 — Link expiration: trip-bound** (`endDate + 7 days`). No reason to join a completed trip; existing expired-link state in § 19 covers it.
  - **Q3 — Regenerate: confirmation modal** warning how many pending invitees will lose access. Both link and code invalidated instantly on confirm.
  - **Q4 — "Join a trip" in trip switcher footer** (alongside *All trips* · *New trip*). Covers returning users invited to a second trip via text message rather than a tappable link.
  - **Q5 — Post-join sequence: Splash → Must Dos prompt → workspace + profile banner.** Must Dos intercepts before overview (viral-loop magnifier). Profile banner persists in workspace. Resolves conflict between § 19 (overview-first) and Trip Creation grill Q12 (Must Dos full-screen).
  - **Q6 — Must Dos skip is always available.** *"Skip for now"* link always visible — no mechanical pressure on top of the social nudge copy.
  - **Q7 — 5 presets kept as-is** (Organizer / Trusted / Standard / View-only / Custom). *Trusted* name retained (warmer than *Co-organizer*).
  - **Q8 — Demotion: future-only.** Past contributions keep full authorship after demotion; only future actions are constrained by the new preset.
  - **Q9 — Self-leave always allowed.** Any non-organizer can leave via their own member card three-dot. Open balances persist anonymized until settled.
  - **Q10 — Slot rewards are per-invite-sender, not per-organizer role.** Organizer transfer does not affect referral history or future reward eligibility. Rewards are a permanent identity tied to who sent the link.
  - **Q11 — Who can invite: Organizer + Trusted** (via *Administrative: invite others* toggle in § 21). Standard / View-only / Custom cannot unless toggle explicitly enabled.
  - **Q12 — Removed member: read-only of own contributions only.** No notification sent; trip silently disappears from their active workspace. They retain access to their own past items, expenses, and notes in a read-only view.
  - **Q13 — Pending invitees visible to all joined members** on the Members page. *Resend* / *Revoke* actions remain organizer-only.
  - **Q14 — No member cap on any tier.** Trip slots (4 / 50) are the economic lever. Member caps create bad invite moments without meaningfully driving upgrades.
  - **Q15 — Traveler count mismatch: auto-sync up + nag on shortfall.** Joined-exceeds-planned increments `travelerCount` silently. Joined-below-planned after 7 days surfaces a Collaboration-dimension nag with resend-invite link.
  - **Q16 — Slot reward fires on invitee's setup-complete** (Draft → Planning). Real commitment signal; not gameable; reward arrives within minutes of invitee finishing setup (vs weeks/months for later states).
  - **Q17 — Slot cap: lifetime 3 bonus slots** (4 base → 7 max). Matches existing MON § 10. Per-year resets would confuse returning users.
  - **Q18 — Reward goes to invite-sender** (whoever's link the invitee used). Not the current organizer. Not split. Rewards the emotional labor of the person who actually did the inviting.
- Why:
  - **Three invite modes** give organizers real control without complexity — private covers small-trust groups, public-link creates a second viral channel (shareable trip previews as social content).
  - **Trip-bound link expiration** is intuitive and closes a long-lived dormant-link surface.
  - **Regenerate modal** prevents accidental invite invalidation — the most likely mistake in the invite flow.
  - **Must Dos before overview** compounds viral engagement: every invitee seeds the Proposed queue in the first 60 seconds, across all perspectives.
  - **Invite-sender earns reward** (not organizer role) makes the Trusted preset's invite permission feel meaningful and rewards the right behavior.
  - **No member cap** keeps the free tier genuinely useful — a trip with 7 friends shouldn't feel crippled.
  - **Read-only exit for removed members** avoids the hostile "you've been cut" UX moment; bad removal experiences generate 1-star reviews.
  - **Pending list for all members** answers "is Kelly coming?" socially without routing through the organizer every time.
- Follow-up: UX_SPEC §§ 18 (updated: invite modes, link behavior, who-can-invite), 19 (updated: post-join sequence), 21 (updated: demotion, self-leave, removed member, pending list visibility, member cap, traveler count), § 42.6 (updated: Join a trip footer item). MONETIZATION § 10 (updated: slot-reward trigger, invite-sender identity). Next grill per stated order: **Itinerary** (step 4 of the Core Loop spine).

**Design skills:** `/user-research` skipped (needs well-established from existing spec and Trip Creation grill). `/design-critique` pending — Members page (§ 21) and Invitee landing (§ 19) have not been mocked with neon-on-dark bento treatment; run before implementation. `/design-system` pending — Must Dos full-screen prompt is a new pattern (shared with zero-trip first-run override); confirm fit. `/design-handoff` pending before any JSX. `/accessibility-review` pending before shipping — Invite landing is unauthenticated and must pass WCAG AA.

### 2026-04-20 - Trip creation + setup flow: grill complete

- Status: **accepted** (grill complete — 18 decisions locked; UX_SPEC § 3 rewritten; APP_STRUCTURE § Trip Creation Flow aligned)
- Context: After the lifecycle grill (18 decisions) locked the state machine, the natural next grill per the user's stated order is trip creation + setup flow — the entry point to every real trip. Going into the grill, three conflicts exist between previously "locked" docs:
  - **Conflict 1 — Ritual scope vs setup-complete.** UX_SPEC § 3/34 defines a ritual capturing name + dates + color (+ type). STATE_MODEL § Minimum Setup Requirements requires 5 fields for setup-complete (name, destination, start/end dates, travelerCount, transport mode). The ritual doesn't capture destination, travelerCount, or transport mode. Finishing the ritual currently leaves a trip in Draft.
  - **Conflict 2 — Post-ritual landing.** UX_SPEC § 3 says "drops user into trip overview." APP_STRUCTURE.md says flow continues with invite → async setup → workspace. Different destinations.
  - **Conflict 3 — Step count.** UX_SPEC § 3 is 4 steps; UX_SPEC § 34 adds Step 0 Real-vs-Dream for 5 steps. Both marked locked 2026-04-17. § 34 is the newer one.
  The grill resolves these + ~15 structural questions, then the answers ship in a single review batch for user approval.
- Decision:
  - **Q1 — Ritual scope: captures 4 fields only** (type, name, dates, color). Destination, traveler count, transport mode move to Setup page. Ritual stays emotional; Setup does the heavy structural lifting.
  - **Q2 — Step 0 Real-vs-Dream kept** per UX_SPEC § 34 — 5 total ritual steps. Real vs Dream decision must come early because it changes ball visual, workspace, and monetization funnel.
  - **Q3 — Destinations captured on Setup page.** Multi-add list with city + country + optional dates. First destination required for setup-complete.
  - **Q4 — Traveler count on Setup page, default 1.** Stepper control; organizer adjusts before setup completes.
  - **Q5 — Transport modes on Setup page as chip multi-select** (fly / drive / train / cruise). At least one required; selections drive which Preplanning sections appear.
  - **Q6 — Post-ritual lands on Setup page, not trip overview.** Trip remains in Draft until Setup completes. Supersedes UX_SPEC § 3's previous "drops user into trip overview" spec.
  - **Q7 — Invite prompt fires after Setup completes**, only if `travelerCount > 1`. Warm modal with "Send invite link" / "Add from contacts" (deferred) / "I'll do this later." Solo trips skip the modal entirely.
  - **Q8 — No quick-create path.** Every trip goes through the full 5-step ritual. Consistency > speed; the ritual IS the brand moment.
  - **Q9 — Trip row created at Step 1 submit.** Back-out / browser-close preserves Draft; next dashboard visit shows "Finish creating [Trip Name]" resume CTA at the step the user left. 30-day abandoned-Draft soft-delete.
  - **Q10 — Skippable ritual steps with defaults.** Step 0 (Type) and Step 1 (Name) required. Step 2 (Dates) skippable → fill on Setup. Step 3 (Color) skippable → defaults to neon cyan. Step 4 (Reveal) always shown.
  - **Q11 — Invitees skip the ritual entirely.** Only the original trip creator sees the ritual; invitees join via invite link or code and go to Must Dos prompt.
  - **Q12 — Must Dos prompt fires immediately after invitee joins.** Full-screen moment (pattern similar to Zero-trip first-run) with trip's ball color accent, contextual subline mentioning organizer + other members, textarea input for each Must Do as a line, submit or skip. Lands in workspace after.
  - **Q13 — Setup page anatomy:** dedicated workspace phase at `/app/trips/[tripId]/setup`. Header + progress chip + single scrollable form (required above optional) + autosave + sticky "Continue to Preplanning →" on 100%. No modal, no wizard. 9 Setup fields total (5 required + 4 optional).
  - **Q14 — Setup vs Preplanning boundary is sharp.** Setup = 9 fields (shape of the trip). Preplanning = all detailed data (flights, lodging confirmations, documents, destination specifics, pre-departure logistics). No field appears in both.
  - **Q15 — Setup fields editable anytime.** Edits autosave; removing a required field regresses Planning → Draft (the one allowed state regression per STATE_MODEL § 2). Date edits trigger state recomputation per STATE_MODEL § 2 date-slip rules.
  - **Q16 — Ritual is online-only.** Blocking modal with retry affordance if offline. Already-captured fields persist locally during mid-ritual outage; submit queues to server on reconnect.
  - **Q17 — Silent defaults on Step 1 submit:** ballColor = neon cyan (until Step 3), travelerCount = 1, inviteMode = invite_only, budgetCurrency = locale default, budgetType = total, isPremiumTrip = inherited, isDreamMode = set by Step 0. User input explicitly required for name, destinations, dates (post-skip), transport modes.
  - **Q18 — Zero-trip first-run flows directly into the ritual.** The Zero-trip shell override's "Create your first trip" CTA wave-sweeps into Step 0. Same ritual for all subsequent trips — no "power user" compression.
- Why:
  - **Ritual scope cut to 4 fields** keeps the emotional moment pure. Cramming destination pickers and transport checkboxes into the full-screen ritual would turn it from a brand moment into a form tax.
  - **Setup page picks up structural fields** because real decisions (where exactly, who's coming, how are we getting there) happen at keyboard-and-cursor pace, not in a ritual cadence.
  - **Post-ritual lands on Setup, not overview** because a Draft trip has nothing meaningful to show on overview. Setup is the natural next step; overview is where Planning trips live.
  - **Invite fires after Setup completes** because invitees need context (dates, destination) to understand what they're joining. Inviting from a Draft trip with just a name would confuse invitees.
  - **Trip row on Step 1 submit** forgives browser crashes and backs-outs. A user who types a name and picks a color shouldn't lose that work if they switch tabs.
  - **Invitees skip the ritual** because the ritual is a "this is my trip" commitment moment. Forcing invitees through it would weird — they're joining, not creating.
  - **Must Dos prompt for invitees** is the viral-loop magnifier. Every invitee becomes a contributor in the first 60 seconds, seeding the Proposed queue with ideas from all perspectives.
  - **Setup = 9 sharp fields, no overlap with Preplanning** prevents field-level confusion and makes the setup-complete logic clean.
  - **Sharp boundaries enable deterministic state transitions** — Draft → Planning fires exactly when those 5 required fields are present. No ambiguity.
  - **Silent defaults reduce friction** without being presumptuous. Color defaults to cyan because any color is better than a missing color; budget defaults are absent because guessing "$1000" would feel wrong.
  - **No quick-create path** preserves the ritual as a brand moment. Speed matters less than the 30-second emotional commitment arc.
  - **Consistent ritual for all trips** means the ASO/TikTok money shot is always available — TripWave's creation flow is one of its strongest marketing surfaces.
- Follow-up: UX_SPEC § 3 rewritten on both paths (130+ lines of spec covering ritual, Setup page anatomy, invitee flow, edit behavior, persistence, offline handling, defaults, zero-trip handoff). APP_STRUCTURE.md § Trip Creation Flow aligned to reference UX_SPEC § 3 as canonical and simplified to a summary. STATE_MODEL.md unchanged (Minimum Setup Requirements still 5 fields; ritual + Setup together fulfill them). Next natural grill per user's stated order: **Invite & Members / Permissions** (step 3 of the Core Loop spine).

**Design skills:** `/user-research` skipped (product-logic grounded in existing spec). `/design-critique` will run on the Setup-page UI mockup (new surface not yet mocked) before implementation. `/design-handoff` pending. `/accessibility-review` pending — ritual is high-emotion and the Must Dos prompt is a moment-of-commitment for invitees; both need contrast + keyboard + screen-reader verification before shipping.

### 2026-04-20 - Trip lifecycle, state model, readiness, blockers, auto-phase logic: grill complete

- Status: **accepted** (grill complete — 18 decisions locked; STATE_MODEL.md fully rewritten; APP_STRUCTURE.md Trip Lifecycle States section aligned)
- Context: Following the shell grill (20 decisions) and the `/design-handoff` output, the user pivoted to lock product behavior before any implementation. The trip lifecycle, state transitions, readiness model, blocker taxonomy, and auto-phase/next-action logic underpin every phase in the app and every shell state — locking these prevents implementation rework. Starting position:
  - **STATE_MODEL.md** exists (647 lines) with 6 states (`draft` / `planning` / `ready` / `in_progress` / `completed` / `archived`), a 6-dimension readiness score (setup 25 / itinerary 20 / packing 15 / travel-day 20 / collaboration 10 / finance 10), recommended-phase priority order, blocker candidates, and 6 explicit open questions in § 12.
  - **APP_STRUCTURE.md "Trip Lifecycle States"** table lists **7 states** (Draft / Planning / Ready / **Travel Day** / In Progress / Stale / Vaulted) — Travel Day is its own state here, and Stale/Vaulted replace Completed/Archived.
  - Three conflicts to resolve: (1) state count (6 vs 7) and whether Travel Day is a state or a phase-within-InProgress; (2) Stale vs Completed terminology; (3) Vaulted vs Archived terminology.
  - Open questions from STATE_MODEL § 12: should Ready be time-based, completeness-based, or both; should readiness score be user-visible from day one; should trips regress from Ready → Planning on data removal; blocker count before UI feels scolding; trip ball visibility across participants; preplanning completion visibility as number / label / ball-only.
  - Additional ambiguities: date slips mid-planning; Dream Mode lifecycle applicability; multi-leg behavior during In Progress; transition windows (T-24 hrs, T+1 day); next-best-action deterministic algorithm; auto-phase change of Travel Day (manual vs automatic).
  The grill must produce a state machine diagram the developer can implement directly, with deterministic transitions, enumerated blocker types, and a clear next-action ranking.
- Decision:
  - **Q1 — Canonical state list: 7 states + Dreaming terminal.** `Draft` · `Planning` · `Ready` · `TravelDay` · `InProgress` · `Stale` · `Vaulted` + `Dreaming` (Dream Mode only). Supersedes STATE_MODEL.md's 6-state enum and APP_STRUCTURE.md's conflicting 7-state list. TravelDay is first-class (distinct UI / shell override); `Stale` over `Completed` and `Vaulted` over `Archived` chosen to match brand metaphors.
  - **Q2 — Transition triggers: deterministic, computable.** 8 transitions with explicit conditions. Highlights: `Draft` → `Planning` fires auto on setup-complete (5 required fields); `Planning` → `Ready` fires on composite (preplanning >=60% + itinerary anchor + travel-day partial + daysToDeparture <=14) OR time-based bailout (daysToDeparture <=2 + setup complete); `Ready` → `TravelDay` fires auto at 04:00 local on any travel-leg date (start / accommodation change / end) OR manual "We're off early"; `TravelDay` → `InProgress` fires auto at 23:59 local OR manual "We've arrived"; `InProgress` → `TravelDay` re-fires for each subsequent travel-leg date; `InProgress` → `Stale` fires at midnight of endDate+1 (24h grace); `Stale` → `Vaulted` manual primary + 90-day auto fallback; `Vaulted` → `Stale` manual "Reopen trip" supported.
  - **Q3 — Auto vs manual classification.** Auto-forward for time/data-driven transitions; manual where user intent matters (Travel Day early, arrival confirmation, close-out, Make it real). Auto-bidirectional only for Draft ↔ Planning (pure data mirror).
  - **Q4 — Regression rules: forward-only except Draft ↔ Planning.** Ready never auto-regresses to Planning even if data is deleted — warning banner only. Date-driven states (TravelDay, InProgress, Stale) cannot regress. Vaulted → Stale is manual-only via "Reopen."
  - **Q5 — Date slip handling.** Moving `startDate` or `endDate` recomputes state from scratch. Backward transitions require confirmation modal; forward transitions auto-apply. 90-day Vaulted fallback honors current `endDate`.
  - **Q6 — Travel Day multi-leg: TravelDay cycles per leg.** Each travel-leg date (start, any accommodation change, end) triggers TravelDay; between legs state is InProgress. Matches the earlier multi-leg repacking grill's leg definition.
  - **Q7 — Readiness score: 6 dimensions, 100-point total.** Setup 25 (binary all-or-nothing), Itinerary 20 (4/day-with-event, capped), Packing 15 (5 personal + 5 group-if-applicable + 5 at-80%-suggested), Travel Day 20 (10 depart + 10 return), Collaboration 10 (5 invite sent + 5 all joined, or auto-5 for solo), Finance 10 (5 budget + 5 expense-or-opt-out). Bands: 0-34 Fragile / 35-64 Getting there / 65-84 Ready-ish / 85-100 Locked in.
  - **Q8 — Readiness score never shown as a number.** Exposed as (1) trip ball fill %, (2) status chip label on trip cards, (3) blocker list. Raw score is internal only — vanity numbers invite gaming and reward data-padding over real readiness.
  - **Q9 — Preplanning completion % shown only inside the Preplanning phase.** Displayed in the phase header (*"Preplanning — 40% complete"*) and the nav-column phase card mini-status. Not shown on dashboard hero, trip cards, or any other surface. Ball fill carries the signal everywhere else.
  - **Q10 — Blocker taxonomy: 7 types, exhaustive.** (1) Missing setup field, (2) Missing travel doc for international trip (T-30d window), (3) No itinerary anchor for multi-day trip within 14 days of departure, (4) No travel-day plan within 48 hours, (5) Unresolved poll blocking a scheduled event (T-7d window), (6) Unsettled balance past endDate+14, (7) Expired/expiring passport (<6 months of endDate). Nothing else gets the blocker treatment — budget, group details, packing <80%, etc. are warnings or suggestions.
  - **Q11 — Blocker UI scales with count, tone never scolding.** 0 blockers = healthy state; 1-2 = inline detail; 3+ = summary + "Tap to see all"; 5+ = also flips next-best-action priority to resolve blockers first. Pink (attention) not red (error). CTAs use helpful verbs ("Add a passport" not "Missing passport").
  - **Q12 — Next-best-action algorithm: 3-step deterministic pipeline.** Step 1: if blockers >=5, primary = highest-urgency blocker. Step 2: else, state-driven candidate generation (per state-candidate map). Step 3: urgency-weighted ranking (+10 resolves blocker, +5 in recommended phase, +3 near deadline, +2 untouched phase). Output: 1 primary + 0-3 secondary.
  - **Q13 — Trip ball visible to all participants; color changed only by organizer.** The ball is trip identity (shared fact, not personal progress). Hiding it from participants would make them feel like guests-not-members. Organizer controls color as personalization.
  - **Q14 — Dream Mode: Dreaming is a terminal state.** Draft → Planning → Dreaming; never progresses further. No readiness computation, no blockers, no auto-notifications beyond reactions. "Make it real" is the only exit — converts to Planning with new dates. Dreams count against free-tier slot limits (separate 1-slot pool for dreams).
  - **Q15 — Per-state dashboard + workspace behavior enumerated.** 8-state table locked; Draft shows setup CTA; Planning shows preplanning + blockers; Ready shows travel-day readiness; TravelDay activates shell override; InProgress shows today's schedule; Stale shows wrap-up + settle; Vaulted activates shell override; Dreaming shows dream workspace + Make-it-real upsell.
  - **Q16 — Per-state notifications enumerated.** Draft silent; Planning weekly-dormant summary; Ready countdown at T-14d/T-7d/T-48h; TravelDay T-24h + T-6h focus alerts; InProgress morning briefing at 7 AM; Stale T+14d single nudge; Vaulted +1yr anniversary; Dreaming reactions only. All in-app bell only.
  - **Q17 — Per-state ad suppression enumerated.** Ads shown in Draft/Planning/Ready/InProgress/Stale-except-settlement. Suppressed in TravelDay/Vaulted/Dreaming. Matches shell Q13 and MONETIZATION § 8.
  - **Q18 — Edge cases deterministically handled.** Invite-flow users skip Draft; no-endDate trips default to +3 days with banner; past-dated trips land in Stale; solo trips (travelerCount=1) get auto-5 collaboration score; organizer-account-deletion transfers ownership to first joined participant (alphabetical) or soft-deletes at 30 days.
- Why:
  - **Deterministic state machine is the foundation for everything else.** Every other product decision (recommended phase, dashboard hero, shell behavior, ad suppression, notifications) depends on knowing "what state is this trip in?" — if that isn't a pure function, the rest of the app becomes a pile of special cases.
  - **Travel Day as first-class state** keeps UI-behavior logic centralized. Instead of 12 different components asking `isTravelDayNow(trip)`, they key off `state === 'TravelDay'`. This is the shell-override-readable contract.
  - **Stale / Vaulted naming** preserves the Memory Vault brand metaphor and captures the "you haven't closed this out" nuance that Completed would erase.
  - **Composite Ready threshold** handles both planners (people who actually finish preplanning) and procrastinators (daysToDeparture ≤ 2 bailout). Neither group gets stuck in the wrong state.
  - **Forward-only regression** prevents the whack-a-mole "you broke your own trip" feel. Warning banners are friendlier than state regressions.
  - **6-dimension readiness + 100-point total** matches STATE_MODEL's existing weights but adds precise per-dimension computation rules so the app can actually calculate the score.
  - **Score never shown as a number** because scores reward gaming. Users see the ball, the chip label, and the blocker list — the parts that drive behavior.
  - **7 blocker types, nothing more** because broader definitions produce noise. Users learn to ignore a long list; they respond to a focused one.
  - **Blocker UI scales with count** instead of hiding: users always see something, but the treatment adapts. The 5+ priority flip is genuinely useful — it tells the user "stop polishing your itinerary, your passport expires next week."
  - **Deterministic next-action algorithm** with transparent weights means the recommendation is auditable and A/B-testable. No heuristic surprises.
  - **Dream Mode as terminal state** preserves Dream emotional intent (fantasy, not execution). Blockers on a dream are absurd. The "Make it real" conversion naturally supports MONETIZATION § 14's premium-upsell moment.
  - **Per-state dashboard/notification/ad enumeration** means every state has a complete UX contract. No "what do we show here?" ambiguity during implementation.
- Follow-up: STATE_MODEL.md fully rewritten on both paths. APP_STRUCTURE.md § Trip Lifecycle States aligned to reference STATE_MODEL as canonical. No UX_SPEC or DESIGN_SYSTEM changes needed — the shell already absorbs every state via § 42.13 overrides. Next natural grill: **Trip creation + setup flow** (per user's stated ordering — the logical continuation now that state-space is locked).

**Design skills:** `/user-research` skipped (product-logic grounded in existing spec). `/design-critique`, `/design-system`, `/design-handoff`, `/accessibility-review`: not applicable — this grill produced logic rules, not UI patterns. Transition animations and state-dependent UI variants already spec'd in UX_SPEC § 42 and DESIGN_SYSTEM.md Shell Override States.

### 2026-04-20 - Shell layout and navigation: grill complete (resolves conflicts between UX_SPEC §§ 20, 26 and APP_STRUCTURE.md; introduces bento-grid desktop shell)

- Status: **accepted** (grill complete — all 20 sub-decisions locked; spec promoted to UX_SPEC.md § Shell Layout and Navigation and mirrored into APP_STRUCTURE.md updates)
- Context: User requested a comprehensive grill to fully lock TripWave's shell (desktop + mobile), navigation, trip switcher, persistent-vs-conditional context panel, account/premium/settings placement, and the hybrid dashboard. Going into the grill, three hard conflicts existed between previously "locked" sections:
  - **Conflict 1 — Mobile nav pattern:** UX_SPEC.md § 20 locked a horizontal pill bar below the top nav with no hamburger; APP_STRUCTURE.md § Mobile Navigation Pattern locked a hamburger → slide-in left sidebar with no pill bar. Both dated 2026-04-17.
  - **Conflict 2 — Mobile top-bar contents:** § 20 specs logo · trip switcher pill · bell · avatar; APP_STRUCTURE.md specs hamburger · trip name · avatar-or-bell. Different anatomy.
  - **Conflict 3 — Phase nav ordering:** APP_STRUCTURE.md has 13 flat phases; UX_SPEC § 20 has Main (8) / Extras (6) / Settings (2) = 16 entries with different grouping.
  The grill must resolve these and lock every remaining ambiguity before any shell implementation begins.
- Decision (in progress):
  - **Mobile phase nav: horizontal pill bar (supersedes APP_STRUCTURE.md's hamburger pattern).** Inside a trip workspace on mobile, phase navigation is a horizontal scrollable pill bar pinned below the top nav (~44px tall, sticky during scroll). Every phase is reachable in one tap. Active phase auto-scrolls into view; a subtle gradient fade on the right edge signals more-to-scroll. Each pill carries a colored icon for the phase (cyan itinerary, yellow packing, green expenses, pink travel day, etc.) reinforcing the phase-color language by repetition. No hamburger, no bottom tab bar, no hidden phase menu. Resolves Conflict 1: UX_SPEC.md § 20's pill-bar spec wins; APP_STRUCTURE.md's hamburger-to-sidebar paragraph is deprecated and will be rewritten post-grill. Deliberately NOT done: hamburger (two-taps-per-switch and hides the map of the trip), bottom tab bar with 4 core phases + More (forces picking "winners" that don't match every lifecycle state — draft trips need Overview, in-progress trips need Vacation Day, etc.).
  - **Phase nav ordering: flat 11-phase linear arc, state-aware collapse for Memory, sub-nav for the rest.** The canonical phase order in both the desktop sidebar and the mobile pill bar is: **Overview · Setup · Preplanning · Itinerary · Packing · Travel Day · Vacation Day · Expenses · Polls · Wishlist · Members**. Settings is a gear icon pinned at the pill bar's end (not a phase pill; not counted in the 11). **Memory** appears as a 12th phase only when the trip's lifecycle state is Stale or Vaulted — never for Draft / Planning / Ready / Travel Day / In Progress trips. Phases not in the top-level 11 collapse to sub-navigation where they're actually used: **Vault** lives inside Preplanning (documents section), **Scavenger Hunt** lives inside Vacation Day (active-challenge strip), **Tools** are surfaced contextually from the phases that need them (Weather/Voltage inside Packing, Jetlag Advisor inside Preplanning, etc.), **Notes** lives inside each phase as a contextual panel rather than as a top-level phase. Resolves Conflict 3: APP_STRUCTURE.md's flat 13-phase list and UX_SPEC.md § 20's 3-group 16-entry structure are both superseded by this lean arc. Deliberately NOT done: "Extras" grouping with quick-jump dots (makes Notes/Tools/Vault feel second-class and adds UI layer most users ignore), lifecycle-filtered visibility that hides Expenses during Planning (confuses users logging pre-trip deposits — see Expenses grill Q6).
  - **Desktop shell: bento-grid full-viewport layout (not traditional sidebar + content).** The entire desktop viewport is tiled with bento-box panels — no empty space, no letterboxing, no classic "sidebar + main content" split. The layout is explicitly designed for the **couch-group use case**: multiple people gathered around a laptop discussing the trip, where every visible pixel earns its keep. Uses CSS Grid with container queries to adapt fluidly across desktop sizes (1280px small laptops · 1440px MacBook · 1920px standard external · 2560px+ large displays) without introducing a mobile-style breakpoint. **Large-scale UI throughout:** body text ~18px base (up from 14–16px standard), phase icons ~32–40px, trip ball dominant, touch targets generous (48px+) — everything shoulder-readable from across a couch. The shell has three durable regions within the bento: (1) a left **nav column** of stacked phase cards (not a thin list — each phase is a bento card with icon, name, and mini-status like preplanning fill % or unresolved blocker count), (2) a thin **top strip** (~44px) for logo, trip switcher pill, notification bell, account avatar — kept thin so the grid gets maximum real estate, (3) a **main bento grid** whose composition reflows per active phase (e.g., Itinerary = day cards + unscheduled proposals + blockers; Expenses = balances hero + ledger + budget breakdown + quick-add). The trip ball has its own prominent bento card persistently anchored near the top of the nav column region. No traditional sidebar-plus-content anywhere on desktop. Supersedes Q3 options A (permanent sidebar), B (collapsible sidebar), and C (horizontal pill on desktop). Deliberately NOT done: traditional productivity-app chrome (sacrifices the group-planning command-center feeling), static grid that leaves empty space at 2560px (violates the "no empty space" rule), mobile-parity pill-bar on desktop (wastes desktop's horizontal real estate and removes the at-a-glance phase-card map).
  - **Bento tile composition: fixed outer geometry + per-phase inner expansion of the primary tile.** The desktop bento grid has a durable outer schema with six named slots, identical across every phase: (1) `nav-column` — left column of phase cards, full height; (2) `trip-ball` — prominent card anchored top of the content area; (3) `context-panel` — next best action + blockers, always in the same position; (4) `primary` — the largest tile, phase-specific content; (5) `quick-add` — Log Expense / Create Poll / Create Scavenger Hunt challenge toolbar, consistent position; (6) `activity-feed` — recent state-change log. A seventh slot, `ad-banner`, appears on the free tier only (premium users see it replaced by additional primary-tile breathing room). The outer grid geometry **never changes** when the user switches phases — users build durable spatial memory ("blockers are always top-right, activity feed always bottom-right"). What *does* change is the internal sub-layout of the `primary` tile: Itinerary's primary reshapes into day columns; Expenses' primary becomes balances-hero + ledger stack; Preplanning's primary is the 8-section form scroll; Packing's primary is the 3-tab visibility structure; etc. Each phase's sub-layout is itself a mini-bento honoring the no-empty-space rule. Deliberately NOT done: fully fixed slot schema (too constraining for phases with genuinely different information architecture), fully per-phase layout declarations (destroys spatial memory, no two phases look alike, 3x the design work per phase).
  - **Context panel: always present, content adapts to trip state (never disappears).** The `context-panel` bento slot is populated 100% of the time — no conditional vanishing, no user-toggled collapse. Content rotates based on trip state and urgency: when blockers exist, they dominate (*"2 blockers · Tap to resolve"*); when the next best action is clear, it's the hero (*"Next: finalize flight seats"*); when the trip is fully healthy with nothing pending, it shows a warm reassurance state (*"You're on track · No blockers · Enjoy the view 🌊"*). Compact footprint when light (one-line status + small icon); expands its internal content (not its grid slot) when there's more to surface. The slot itself never resizes, never reflows the outer grid, never appears or disappears. Deliberately NOT done: conditional disappearance on healthy state (breaks Q4's spatial-memory contract — blockers always live in the same place even when absent), user-toggled expand/collapse (adds undiscoverable state; the primary-tile expansion from Q4 already solves real-estate pressure).
  - **Top bar contents: differentiated by form factor (resolves Conflict 2).** The ~44px top strip has different contents on desktop and mobile.
    - **Desktop top bar (left → right):** `[Logo mark]` · `[Trip switcher pill]` (current trip's small ball + name, opens dropdown) · `[Global search]` (icon + expandable input, Cmd/Ctrl-K keyboard shortcut — searches across itinerary items, expenses, notes, proposals, packing items for the current trip) · · · `[Premium status badge]` (subtle neon stripe — for premium users it reads *"Supporter · ♥"* in warm cyan; for free users it reads *"Upgrade"* in a soft variant that routes to `/app/account/premium`) · `[Notification bell]` · `[Account avatar]`.
    - **Mobile top bar (left → right):** `[Logo mark]` · `[Trip switcher pill]` (same component, slightly smaller) · · · `[Notification bell]` · `[Account avatar]`. No global search (the search surface appears inside each phase as a scoped filter instead); no premium badge (free-tier *Upgrade* is surfaced via the account avatar's dropdown and in phase-specific premium prompts per UX_SPEC § 22).
    - The trip switcher pill anchors identity on both form factors — it's the persistent reminder of which trip the user is inside.
    - Resolves Conflict 2 by preserving UX_SPEC.md § 20's mobile top-bar spec and superseding APP_STRUCTURE.md's hamburger-based spec.
    - Deliberately NOT done: identical desktop/mobile bars (leaves desktop search value on the table), ultra-lean mobile without logo or bell (logo is the home-click affordance; burying notifications makes the bell too hidden to be useful).
  - **Trip switcher: dropdown with conditional search + lifecycle grouping at scale.** Keeps UX_SPEC § 26's dropdown pattern as the base interaction — tapping the trip switcher pill in the top bar opens a dropdown (desktop) or auto-expands to a full-width sheet if the dropdown would overflow a narrow screen (mobile). Dropdown structure:
    - **Top row:** Current trip (grayed, labeled *(current)*) — small ball + name + phase-color accent.
    - **Search input** — appears only when the user has **4+ total trips** (any lifecycle state). Filters by trip name in real time. Hidden for 1–3 trip users to keep the simple case simple.
    - **Active section** — upcoming (Ready) + in-progress trips. Each row: small colored ball at current fill %, trip name, subtitle with countdown or dates. Tap routes to that trip's Overview (or its recommended phase per dashboard hero logic).
    - **Planning section** — Draft + Planning state trips. Same row format.
    - **Archived section** — Stale + Vaulted trips. Collapsed by default; tap the section header to expand. Row format uses muted color + faded ball.
    - **Footer links** — *All trips* (routes to `/app` dashboard) · *New trip* with a + icon (opens the trip creation flow).
    - Grouping labels match the existing lifecycle state model in APP_STRUCTURE.md so users learn state vocabulary by repetition.
    - Dismisses on outside click (desktop) / Escape key / swipe-down (mobile sheet form).
    - Deliberately NOT done: full sheet/modal for every switch (overkill for the 1-second common case; contradicts § 26's locked dropdown pattern), flat unfiltered list at 10+ trips (unusable at scale), removing the search entirely (power users with multiple trip groups need it).
  - **Account avatar dropdown: structured menu, premium always visible.** Tapping the avatar in the top-right opens a dropdown with four sections:
    - **Header:** avatar + full name + email (read-only display).
    - **Section 1 — Account:** *Account* (routes to `/app/account`), *Notifications* (routes to `/app/account#notifications`).
    - **Section 2 — Premium:** For premium users: a *"Supporter ♥"* badge with *Manage* link (routes to `/app/account/premium`). For free users: a warm *"Support the app · $7.99 once"* entry with supporter-gift framing (not *"Upgrade to premium"* — violates MONETIZATION § 5 forbidden phrases) that routes to `/app/account/premium`. This section is **the** premium entry point on mobile (replacing the missing mobile top-bar badge from Q6) and a secondary entry on desktop.
    - **Section 3 — Solo dev touch:** *Help & feedback* (mailto: chrismackall3@gmail.com — the support email; see MONETIZATION § 20 refund policy which also uses this address), *About* (routes to `/app/account#about`, the solo-dev ♥ moment per Pillar 3).
    - **Section 4 — Sign out.**
    - Dismisses on outside click / Escape / swipe-down (mobile).
    - Deliberately NOT done: lean 3-item menu (leaves premium too buried on mobile — monetization surface loss), minimal logout-only menu (loses notifications preferences discoverability), marketing copy using "Upgrade" language (MONETIZATION § 5 forbids — use supporter-framing only).
  - **Notification bell: dropdown panel, matches trip-switcher interaction pattern.** Tapping the bell in the top-right opens a dropdown panel (~380px wide on desktop; full-width bottom sheet on mobile). Structure:
    - **Header:** *"Notifications"* title + *"Mark all read"* text link.
    - **Body:** scrollable list of recent notifications, newest first. Each row: category color dot (yellow polls, green expenses/financial, pink travel/urgent, cyan itinerary, per UX_SPEC § 25 color system), notification text, relative timestamp, optional inline CTA button. Unread rows have a subtle neon-left accent; read rows are slightly dimmed.
    - **Footer:** *"See all activity"* link — when the user is inside a trip, routes to that trip's activity feed; from the dashboard, routes to a cross-trip activity view at `/app`.
    - Dismisses on outside click / Escape / swipe-down (mobile). Unread count badge on the bell icon itself, cleared as the panel opens.
    - Dropdown anatomy mirrors the trip switcher pattern (Q7) so users learn one interaction shape for every top-bar meta-nav element.
    - Deliberately NOT done: full right-side drawer (over-engineered for TripWave's bounded notification volume — ~50/trip lifecycle vs Linear's hundreds), bento-tile replacement (unusual, fights user expectation that bell = popover, costs discoverability).
  - **Non-trip shell: same bento grid, nav column inverts from phase-list to trip-list.** On non-trip pages (`/app` dashboard, `/app/account`, `/app/account/premium`, `/app/trips/new`), the bento shell from Q3/Q4 is preserved in full — same top bar, same six-slot outer geometry, same large-scale UI, same no-empty-space rule. What changes:
    - **`nav-column`** flips from stacked phase cards to stacked **trip cards** — each trip is a bento card showing ball at current fill %, name, countdown subtitle, phase-color accent. Active trips surface first; a footer *New trip* action sits at the bottom. The nav column's meaning inverts naturally: *"what can I go into from here?"* (phases inside a trip, trips outside one).
    - **`trip-ball`** slot shows a composite visual — a grid of small balls representing every trip in the user's active set (tappable, routes to each trip).
    - **`context-panel`** surfaces cross-trip urgencies: aggregated *"Needs your attention"* items (polls awaiting vote, owed expenses, approaching travel days, blockers) pulled from every trip.
    - **`primary`** tile carries page-specific content — dashboard hero on `/app`, account forms on `/app/account`, premium purchase sheet on `/app/account/premium`.
    - **`quick-add`** surfaces *New trip* on the dashboard; hidden on account pages (nothing to quick-add there).
    - **`activity-feed`** shows cross-trip activity rather than single-trip activity.
    - **`ad-banner`** (free tier) unchanged.
    - Same mobile pill-bar pattern on non-trip pages too — phases are replaced by a *Dashboard · Account · Premium · New trip* pill strip.
    - Keeps the app's visual identity rock-solid across every page; users never feel "I left TripWave" when they navigate out of a trip.
    - Deliberately NOT done: simplified top-bar + full-width layout on non-trip pages (creates a jarring "different app" moment on frequent dashboard visits, breaks bento brand identity), per-page custom bento schemas (3x mockup / spec / code for near-zero user benefit).
  - **Dashboard primary tile: single hero picker (supersedes UX_SPEC § 2's three-stack layout).** On `/app`, the `primary` bento slot is a single-purpose *Next Up hero* — the soonest upcoming trip rendered at hero scale. Contents:
    - **Giant trip ball** at current fill % in the trip's ball color (dominant visual element, centered or left-of-center in the tile).
    - **Ball color spills** into the primary tile's background as a soft neon gradient — the tile becomes the trip's color, visually tying the dashboard to the trip you're about to enter.
    - **Trip name** in Fredoka display font, large scale.
    - **Countdown strip:** *"12 days until Japan"* or *"You leave tomorrow"* or *"In progress — Day 3 of 7"* depending on lifecycle state.
    - **Dominant CTA button** — routes to the trip's *recommended* phase (not just Overview), per the existing dashboard hero logic. *"Jump in"* / *"Check your flight seats"* / *"See today's schedule"* etc., adapting to lifecycle state.
    - **Subtle preview strip** below the CTA — a one-line teaser of what's in that trip (e.g., *"3 blockers · 5 expenses to settle"*).
    - The other dashboard concerns are not duplicated inside primary — they live in the outer bento slots per Q10: `nav-column` = Your Trips list, `context-panel` = Needs Your Attention aggregate, `activity-feed` = cross-trip activity, `trip-ball` slot = composite ball-grid visual.
    - When the user has zero trips: primary becomes the *"Every great trip starts with a name"* empty state with a big *Create your first trip* CTA.
    - When the user has trips but no *Next Up* exists (all trips are Vaulted): primary becomes a *"Plan your next trip"* warm prompt linking to `/app/trips/new` + a secondary *"Revisit past trips"* link to the Memory view of the most-recent Vaulted trip.
    - UX_SPEC § 2's three-stack layout (Next Up hero / Your trips / Needs Your Attention) is superseded and will be rewritten post-grill. The three concerns still exist — they just live in separate outer bento slots now, each with more dignity than being sections-of-a-stack.
    - Deliberately NOT done: vertical-stack layout inside primary (duplicates content that Q10 already placed in outer slots), nested sub-bento of four small tiles (dilutes the Next Up hero moment, and Dream Trips / Wishlist teasers don't have enough weight to earn tiles yet).
  - **Travel Day shell override: bento collapses to full-viewport timeline.** When Travel Day focus mode activates (auto at T-6 hours of the travel-day departure time per UX_SPEC § 9, or manually by the user), the bento shell collapses to a single full-viewport timeline layout. Specifically:
    - **Nav column** — hides entirely. Users can still navigate to other phases via the Escape action or the *"Leave focus mode"* button at the bottom of the timeline.
    - **Primary tile** — expands to fill the entire grid, rendering the vertical timeline from UX_SPEC § 9 (big checkboxes, one phase at a time, current task visually prominent, completed tasks dimmed).
    - **Context panel · quick-add · activity feed · trip-ball tile** — all collapse. The trip ball reduces to a small compact indicator in the top bar (stays visible but non-dominant, per the existing § 9 rule "trip ball remains visible but reduced").
    - **Top bar** — stays in place (thinner, if possible, ~36px). Bell stays active (group coordination still matters — flight delays, group members arriving). Trip switcher and avatar dropdown remain accessible so users can bail out if needed.
    - **Pill bar (mobile)** — hides per existing § 9 rule.
    - **Ads** — suppressed entirely for the duration of focus mode (already spec'd in UX_SPEC § 9 and MONETIZATION § 8).
    - Override applies on **both desktop and mobile** — Travel Day is execution under real stress, and even the couch-group desktop use case doesn't apply at the airport.
    - Focus mode exits automatically at the end of the travel day (arrival confirmed) or manually via *"Leave focus mode"* — the bento re-inflates with the previous page's slot contents.
    - Rule of thumb for future shell grills: the bento is the default everywhere *except* Travel Day focus mode. If any future page proposes an override, route it through GRILL_PROTOCOL — overrides are exceptional, not routine.
    - Deliberately NOT done: bento persistence during travel day (sacrifices the calm-mode promise to preserve visual consistency — wrong trade), hybrid desktop/mobile treatment (even desktop users at the airport aren't in couch-group mode; adds code without real user benefit).
  - **Ad placement: hybrid mobile-banner + desktop-native, restrained treatment, many ad-free zones.** Follows what successful 2026 apps actually do — banners retained only as the mobile revenue floor (Splitwise pattern), native cards elsewhere (TripIt / Instagram / Google Maps pattern).
    - **Mobile (free tier):** a fixed 320×50 standard IAB banner pinned between the main content area and the pill bar — so the pill bar is always the bottom-most element, never ad-touching. Maximum one banner visible at a time. No auto-playing video, no expandable formats, no flashing treatments — restrained visual matching the neon-on-dark aesthetic (subtle border, muted background, never competes with brand).
    - **Desktop (free tier):** the `ad-banner` bento slot from Q4 carries a **native-style sponsored card** styled to match other content cards in the grid, with clear *"Sponsored by [brand]"* labeling in small caps (not deceptive — transparency builds trust). One card per page view, positioned after 3 real content items when embedded in a scrollable primary tile, or as its own low-profile bento slot. No banner ads on desktop.
    - **Ad-free zones (all enforced — matches MONETIZATION § 8):** Travel Day focus mode, Expense settlement flow (when actively marking settled), Premium purchase page (`/app/account/premium`), Login / Signup pages, Trip creation 4-step flow, Vault memory view (nostalgic moment).
    - **Premium users** see the ad slot reclaimed for trip content — on mobile the 50px strip gives way to taller pill bar or cleaner bottom padding; on desktop the `ad-banner` slot re-flows into the primary tile's breathing room.
    - **Ad network:** TBD (either Google AdSense as the pragmatic default, or Nativo / Playwire / a travel-vertical ad network that better matches the brand). Decision deferred until pre-launch; routes to a future grill on ad-network selection.
    - Deliberately NOT done: full banner strategy on desktop (insults the bento aesthetic, degrades brand, hurts premium conversion), pure native-only on mobile (leaves meaningful ad revenue on the table for the single biggest free-tier monetization lever), ads inside stressful moments (Travel Day, settlement, purchase flow — hard-coded exclusions per MONETIZATION § 8).
  - **Responsive strategy: container-queries-first, bento activates at ~900px available width.** No hard viewport breakpoints. The shell layout is driven by CSS container queries against the available width of the shell's root container:
    - **Below ~900px available width:** "compact mode" activates — top bar B from Q6 + pill bar + stacked single-column content. Applies to any device where the shell's container has less than ~900px to work with: phones (portrait + landscape), portrait tablets, and desktop browsers resized narrow.
    - **At or above ~900px available width:** "bento mode" activates — full bento grid per Q3/Q4, large-scale UI, no empty space. Applies to landscape tablets above 900px, laptops, and all desktop sizes.
    - **Internal tile redistribution in bento mode:** tile sizing uses further container-query bands (coarse):
      - 900–1279px (small bento) — 6-slot grid with compact tile heights
      - 1280–1919px (standard bento) — 6-slot grid with generous tile heights, slightly larger type scale
      - 1920–2559px (wide bento) — 7-slot grid adds space for an `activity-feed` expansion or a second primary-tile column
      - 2560px+ (ultra-wide) — 7-slot grid with all tiles at max comfortable size; remaining space is distributed as padding, never leaving a single empty band
    - All bands are container-driven, not media-driven — a desktop user who resizes a window to 850px sees compact mode; an iPad in landscape at 1180px sees standard bento. No tablet-specific variant to maintain.
    - Travel Day focus-mode override from Q12 supersedes this on both modes — the bento collapse + full-viewport timeline rule applies equally.
    - Deliberately NOT done: single hard breakpoint at 768px (forces iPads into cramped desktop layouts; ignores narrow-desktop users), two-breakpoint tablet variant (third shell to maintain for a device share under 10%; container queries solve this for free).
  - **Global search (desktop only): current-trip-default with expandable all-trips toggle.** The Cmd/Ctrl-K global search from Q6 opens a centered popover (~520px wide) with the following behavior:
    - **Default scope:** the current trip the user is inside. Scope chip at the top of the popover reads *"Search in [Trip name]"* with a small *"All trips"* link (or Tab keyboard shortcut) to expand.
    - **Index coverage:** itinerary items, expenses, notes, proposals (including Must Dos, Approved, Scheduled), packing items, trip members, document vault entries, polls.
    - **Result rendering:** flat list of matches, each row: phase-color dot · entity-type label (small caps, e.g., *ITINERARY · EXPENSE · NOTE*) · title · 1-line snippet with the matched query highlighted · keyboard-navigable with ↑/↓ and Enter to jump. No grouping in default mode — just newest-relevance first, matching the phase-neutral view.
    - **Expanded scope (Tab or *All trips* link):** results regroup by trip at the top level (*"Japan 2027 → ..., Maine Road Trip → ..."*), then entity type within each trip. Scope chip changes to *"All your trips"* with a link to return to current-trip scope.
    - **Keyboard model:** Cmd/Ctrl+K opens; Escape closes; ↑/↓ navigate; Enter jumps; Tab toggles scope; Shift+Enter opens in a new tab (Linear-style power-user affordance).
    - **Empty state:** *"No matches — try widening to all trips?"* with the *All trips* toggle one-tap away.
    - **Mobile:** no global search. Each phase provides scoped filters (Expenses ledger's *By day / By category / By member* chips, Itinerary's per-day search, etc.) — mobile users search narrowly within context, not globally.
    - Deliberately NOT done: current-trip-only with no scope expansion (forces users into a 2-step flow for the legit "where did I log that?" case), cross-trip-only by default (noisy for the dominant 90% use case, and requires indexing all-trips data even when most searches don't need it), search-anywhere-on-mobile (no room in the 375px top bar, and mobile users search via scoped filters anyway).
  - **Premium entry points: three categories, all supporter-framed, no dashboard sales tile.** The shell exposes premium at exactly three categories of surface — enough for genuine discoverability, not enough to feel like a sales funnel:
    - **(1) Avatar dropdown (mobile + desktop):** the Section 2 premium entry from Q8. Free users see *"Support the app · $7.99 once"*; premium users see *"Supporter ♥ · Manage"*. Always visible.
    - **(2) Desktop top-bar badge:** the subtle neon stripe from Q6 — *"Supporter · ♥"* for premium users, *"Upgrade"* (warm variant, not pushy) for free users. Desktop-only because mobile top bar can't afford the real estate; the avatar dropdown is mobile's equivalent.
    - **(3) Targeted in-phase prompts (matches UX_SPEC § 22):** warm inline cards that appear *only* on the specific features premium enhances, and only when a free user interacts with that feature. Concrete surfaces: *Scan receipt* button in Expenses (lock icon + support card on tap), currency selector in Expenses More options (lock icon + hint), Smart Suggestions tab in Packing (premium-preview label), Dream Mode slot counter when a free user hits the 1-dream cap, PDF expense report download in Expenses export, destination-aware repack prompts in Travel Day focus mode. Each prompt uses supporter-framing copy — *"Support the app to get [feature]. $7.99 once, no subscription."* or similar. MONETIZATION § 5 forbidden phrases (*"upgrade to premium"*, *"unlock powerful tools"*, *"save the trip"*, scarcity language) are hard-banned.
    - **No dashboard sales tile** — the `/app` dashboard bento does not include a dedicated premium-pitch tile. The dashboard is for trip focus, not monetization asks. Free users already see premium via (1) and (2); that's enough.
    - **No interstitials, no modals-on-load, no bouncing badges, no countdown timers, no "limited time" language.** The tone is *"if you love the app, here's how to thank the developer."*
    - Deliberately NOT done: minimal 2-entry setup (too thin — supporters who *want* to pay can't find the path), aggressive dashboard sales tile (violates MONETIZATION § 5's "warm not pushy" rule and turns every dashboard visit into a pitch), generic "upgrade" banners in any phase or empty state.
  - **Breadcrumbs and drill-down behavior: no persistent breadcrumb strip; modals for edit/create; sub-routes for shareable detail views; contextual back-link for deep settings pages.** The shell does not render a breadcrumb trail above the primary tile — the phase pill bar (mobile) and the nav column (desktop) already convey which phase the user is in, and adding breadcrumb chrome is redundant for the 1–2 level drill-downs that dominate TripWave's navigation. Specifics:
    - **Edit/create flows are always modals.** Adding an expense, editing a packing item, creating a poll, inviting a member, editing a note — every one of these opens as a modal/sheet over the current page. No new route, no back-button drift, no URL collision. Esc / outside-click / close-X dismisses.
    - **Detail views that benefit from URL sharing are sub-routes.** A specific expense detail (`/app/trips/[id]/expenses/[expenseId]`), a specific itinerary day (`/app/trips/[id]/itinerary/[date]`), a specific member's profile, a single vault document are each real routes. The phase header displays the drill-down state in-line: *"Expenses > $42 Dinner"* or *"Itinerary > Day 3 — Kyoto"*. Browser/system back exits. The URL is shareable.
    - **Deep settings pages get a small contextual back-link.** Only the 3+ level flows (e.g., `/app/trips/[id]/settings/members/[memberId]/permissions`) render an inline *"← Back to Members"* link at the top of the primary tile — not a breadcrumb trail, just a single-hop exit.
    - **No persistent breadcrumb strip anywhere.** No *"Trip > Phase > Sub-page > Detail"* ribbons.
    - **Browser / system back is the primary exit affordance** for everything. Design never assumes users will only use in-app back links; the OS gesture works everywhere.
    - Deliberately NOT done: always-on breadcrumb trail (chrome duplication of phase pill/nav column), modal-first for everything (kills shareable URLs for items worth linking to — an expense, a day, a member).
  - **Unusual-lifecycle shell states: Dream Mode inside bento; Vaulted override to Memory layout; Invite-landing is standalone.** Three shell variants for trip states that don't fit the standard workspace paradigm:
    - **Dream Mode trips:** use the full standard bento shell exactly like normal trips. The only differences are visual: sparkle-ball treatment in the `trip-ball` slot, distinct Dream-ball color state in the `nav-column` trip card (when viewed from the dashboard), and a persistent *"This is a dream"* chip pinned in the `context-panel` slot. All six bento slots otherwise behave the same. This preserves Dream Mode's planning utility (it's still a real workspace with real proposals, itinerary, budget, etc.) while clearly marking it as aspirational.
    - **Vaulted trips (Memory view):** override the bento entirely. Routing to a Vaulted trip shows a dedicated Memory vault layout — scrollable article-style page, not a workspace. Top bar stays for navigation/identity. The nav column, context panel, primary tile, quick-add, and activity feed all collapse. The page renders as a vertical narrative: trip summary card at top, expense breakdown, itinerary highlights, Must Do recap, participant contributions, followed by a large *"Share this memory"* link. Matches APP_STRUCTURE.md's existing "Memory Vault" spec verbatim: *"sidebar nav is gone or minimal; this is not a workspace."* Rationale is the same as Travel Day's override — the job is fundamentally different (browsing a story, not navigating phases), so the shell collapses to match.
    - **Invite-landing pages (`/invite/[code]`):** standalone, outside the authenticated shell entirely. These are accessed by unauthenticated visitors, who cannot see the bento (they have no account). Design: a centered card on a neon-on-dark background showing trip name, destination, dates, organizer name, with a large *"Join this trip — it's free"* CTA + a brief *"What is TripWave?"* line. Essentially a landing-page-style hybrid, not a workspace. Matches APP_STRUCTURE.md's existing Invite System spec.
    - **General rule for future edge states:** if the page's job is "execute under stress" (Travel Day), "browse a frozen story" (Vaulted), or "convert unauthenticated visitors" (Invite-landing), override the bento. If the page's job is planning (any active trip, even Dream Mode), use the bento.
    - Deliberately NOT done: pure-bento-everywhere (forces Vaulted trips into a workspace paradigm that contradicts their nostalgic purpose; forces Invite-landing into an authenticated shell for users who aren't authenticated), minimal-shell-everywhere (loses the bento brand identity on Dream Mode, which is a primary marketing surface — the sparkle-ball inside the bento is ASO/TikTok material).
  - **Trip Creation flow: full-screen override (matches Travel Day's override category).** The 4-step wipe ritual (name → dates → color → reveal) from UX_SPEC § 3 and § 34 runs as a full-viewport takeover, not inside the bento and not as a modal. Specifically:
    - **Top bar** collapses or disappears for the duration of the ritual — no distraction from the dashed cyan ball at center stage. A single unobtrusive *Cancel* affordance sits in a corner (routes back to `/app` dashboard without creating a trip).
    - **Nav column · context panel · primary tile · quick-add · activity feed · trip-ball tile · ad-banner** — all collapse. Neon-on-dark background fills the viewport.
    - **The 4-step ritual** takes the full stage: typing-sympathetic ball breathing (§ 31's dashed-ball treatment), Fredoka kerning on the revealed trip name, ball-fill liquid-pour physics (FUN_IDEAS.md Step 3 money-shot), ocean-ripple reveal (FUN_IDEAS.md Step 4 ASO screenshot 2 source).
    - **On complete,** the user lands on the newly-created trip's Overview page with the full bento shell restored.
    - **Ads suppressed** for the full duration of the creation flow (MONETIZATION § 8 already requires this).
    - **Rule consolidation:** the bento is the default on every authenticated page *except* four narrow, well-defined exceptions — Travel Day focus mode (execution under stress), Vaulted / Memory view (browsing a frozen story), Invite-landing (unauthenticated), and Trip Creation (the ritual moment). Any future page that proposes to override the bento must be routed through GRILL_PROTOCOL and justify inclusion in this list — overrides are exceptional, not routine.
    - Deliberately NOT done: bento-inline creation flow (chrome visible at the edge actively weakens the ritual's visual power and destroys the TikTok/ASO money-shot framing), modal-in-bento (frames the ritual as "just another form" — the whole point of the ritual is that it isn't).
  - **Zero-trip first-run shell: full-viewport centered empty state (bento override).** A brand-new user who has just signed up and lands at `/app` with zero trips sees a centered full-viewport empty state, **not** the bento shell with placeholder slots:
    - Dashed cyan trip ball centered vertically.
    - Warm tagline in Fredoka: *"Every great trip starts with a name."*
    - Single large *Create your first trip* button — routes to the Trip Creation 4-step ritual (Q19).
    - Small secondary link below: *"Invited to an existing trip? Paste your code"* — routes to invite-code entry.
    - Solo-dev ♥ line at the bottom: *"Made with ♥ by one person."* (Pillar 3 moment, one of the three explicit solo-dev touchpoints).
    - No top bar, no bento grid, no nav column, no ads, no notification bell — just the centered moment.
    - As soon as the user creates (or joins) their first trip, the bento shell activates permanently; the zero-trip empty state never reappears.
    - **Rule consolidation, final:** The bento is the default on every authenticated page *except* five narrow, well-defined exceptions — Travel Day focus mode, Vaulted / Memory view, Invite-landing (unauthenticated), Trip Creation ritual, and zero-trip first-run. Any future page that proposes a sixth override must go through GRILL_PROTOCOL. These five exist because each has a fundamentally different job than "plan a group trip inside a workspace."
    - Deliberately NOT done: empty bento with "no data yet" placeholders in every slot (reads as broken / intimidating for first-time users — the Notion-first-login problem), hybrid "hero on first visit, bento on return" (adds per-user state tracking for a feature most users experience exactly once).
- Why:
  - Phase list is long (13+ items) and state-dependent — no four-phase subset is right for every lifecycle state.
  - The pill bar reinforces phase-color brand identity on every page; hamburger menus hide the map of the trip.
  - The flat 11-phase arc mirrors real-world trip chronology (Setup → Preplanning → ... → Expenses), making the nav self-documenting.
  - Bento-grid shell was a user-directed pivot: desktop is used for couch-group planning (laptop on coffee table, multiple people watching), where large-scale UI and no empty space matter more than traditional productivity chrome.
  - Fixed outer bento geometry + per-phase primary-tile expansion preserves spatial memory ("blockers always top-right") without forcing phases with genuinely different information architecture into identical layouts.
  - Context panel is always present because durable spatial memory requires it — blockers can't appear out of nowhere when trouble arrives; the slot lives in the same place even when content is a warm "you're on track" state.
  - Form-factor differentiated top bar (desktop gets search + premium badge; mobile stays lean) uses each form factor for what it's good at rather than forcing identical chrome.
  - Trip switcher's conditional search + lifecycle grouping scales from 1 trip to 20+ without breaking the simple case for the 90% who only have 1–3 trips.
  - Account avatar dropdown gives premium a visible, always-on entry point — critical for mobile where the top-bar badge can't fit.
  - Notification bell matches trip-switcher dropdown pattern — one interaction shape for all top-bar meta-nav.
  - Non-trip pages invert the nav column from phases to trips (natural inversion: "what can I go into from here?") — consistent shell, contextually correct content.
  - Dashboard primary = single *Next Up* hero because Q10 already distributed the other dashboard concerns to outer bento slots; stacking them again inside primary would duplicate content.
  - Travel Day override is justified because execution under stress is fundamentally different from planning — the bento aesthetic becomes noise exactly when noise is harmful.
  - Ad strategy follows 2026 successful apps (Splitwise-style banner on mobile, native cards on desktop) with many hard ad-free zones matching MONETIZATION § 8.
  - Container-queries-first responsiveness means the app gracefully handles every screen shape without tablet-specific QA cycles.
  - Global search defaults narrow (current trip) with easy expansion to all trips — matches Linear/Notion/Slack convention.
  - Premium entry points exist in three well-defined surfaces; MONETIZATION § 5 "warm not pushy" is load-bearing.
  - No persistent breadcrumb strip; modals for edit/create, sub-routes for shareable detail views.
  - Five bento overrides form a clear category with shared justification. The rule prevents override creep.
  - Zero-trip first-run skips the bento because an empty-bento-with-placeholders reads as broken; a centered focused welcome reads as warm.
- Follow-up: Grill complete. Spec promoted to UX_SPEC.md as new § 42 Shell Layout and Navigation (consolidates and supersedes §§ 2, 20, 26 and APP_STRUCTURE.md's Mobile Navigation Pattern / Global app shell sections). APP_STRUCTURE.md updated to reflect the canonical shell. **`/design-system` must run before the Step 2 mockup** — the bento-grid shell pattern, large-scale UI type scale, 6-slot fixed grid, and container-query breakpoints are all new patterns not in DESIGN_SYSTEM.md today. After `/design-system` lands the patterns, Step 2 mockup + `/design-critique` required before any shell implementation begins. `/design-handoff` before coding. `/accessibility-review` before shipping. Bento-grid desktop preference saved as a durable project memory (`project_desktop_bento_shell.md`) so future grills apply it automatically.

**Design skills:** `/user-research` skipped (shell decisions follow established navigation patterns; user-need direction is clear). **`/design-system` run 2026-04-20** — returned a full audit (8/10 score): shell patterns largely inherit cleanly from existing system; 2 hard contradictions flagged and resolved (mobile hamburger pattern superseded; page-background radial gradient scoped to override states only); 5 new DESIGN_SYSTEM.md sections added (Bento Grid System shell-level sub-section, Large-Scale UI Type Scale, Container-Query Bands, Phase Card Component, Color-Spill Tile Background, Shell Override States); 1 clarification added to Shape and Form Language (bento tile rounded-rectangle corners preserve circle primacy inside tiles); Background Circle System updated for tile-level placement; per-phase color assignments flagged as open decision for the shell mockup. All findings integrated into DESIGN_SYSTEM.md on both worktree and main repo paths. **`/design-critique` run 2026-04-20** — returned findings on 5 ASCII-mockup views (desktop Itinerary bento, desktop Dashboard with color-spill, mobile Expenses compact mode, phase card state matrix, zero-trip first-run). Six refinements landed: (1) **phase card height made responsive** — 52px at Small bento, 64px Standard, 72px Wide, 80px Ultra-wide, so 11 cards + Settings fit on 13" laptops without scrolling; (2) **active phase card softened** from full neon-fill to 4px left-edge accent + neon label + icon glow on dark surface (matches Cards → Neon accent strip rule, avoids notification-loudness); (3) **desktop ad-banner restyled as native tile card** (20px corner radius, elevated-dark, small-caps "Sponsored by" label) — not a full-width bottom strip; (4) **zero-trip first-run background clarified** as `#0A0A12` deep base dark (neon-on-dark brand), excluded from the light radial gradient that covers the other four overrides; (5) **mobile pill-bar height raised** to 48px to meet the shell's own touch-target floor; (6) **context-panel healthy-state visual treatment** fully specified (3 states: blockers, next-action, healthy calm). One critique recommendation **rejected**: merging quick-add into context-panel — rejected because quick-add's fixed-slot spatial memory is load-bearing from Q4 and a 3-action slot at 40px/action is correctly proportioned. All refinements integrated into UX_SPEC.md § 42 and DESIGN_SYSTEM.md on both paths. **`/design-handoff` run 2026-04-20** — produced `docs/SHELL_HANDOFF.md` (~1500 lines): complete CSS custom-property token set + Tailwind theme extension, CSS container-query syntax for all 5 responsive bands, implementation-ready component specs for 10 shell components (`BentoShell`, `PhaseCard`, `TopBar`, `PillBar`, `TripSwitcher`, `NotificationBell`, `AccountAvatar`, `GlobalSearch`, `ContextPanel`, `ColorSpillTile`, plus `AdBanner` variant), concrete animation specs (ripple, hover glow, wave sweep, living shimmer, loading wave, ball pulse, ocean-ripple), a full accessibility checklist organized by concern (keyboard nav / ARIA / contrast / touch targets / focus indicators / prefers-reduced-motion / screen reader / color independence), and a flagged list of open decisions that must resolve before shipping (per-phase color map finalization, ad network selection, payment processor, auth config, analytics strategy, keyboard shortcut full map, prefers-contrast handling). Recommended 6-week implementation order included. File promoted to both worktree + main repo paths. `/accessibility-review` pending — required before shipping the shell.

### 2026-04-20 - First preplanning section to fully spec end-to-end: Lodging

- Status: accepted
- Context: CORE_LOOP.md spine requires "Preplanning hub + at least the first section editor working end-to-end." Eight preplanning sections exist (Transport, Lodging, Group composition, Budget, Destination info, Visa/health, Power adapter, Driving rules, Documents, Pre-departure logistics). BACKLOG.md P1 work is blocked on picking which section becomes the reference implementation. The choice determines which patterns get solved first, and every later section inherits the solution.
- Decision: Lodging is the first preplanning section to receive a full Step-1 detail inventory, Step-2 mockup, `/design-handoff`, and end-to-end implementation. It becomes the reference template for all other sections. Scope for the reference impl: multi-entry list, per-entry form with all fields from BACKLOG.md P1 Lodging section, auto-link from nightly rate / total cost to the expense ledger, empty state, validation, and the conversational headline pattern from UX_SPEC.md section 35. Other sections stay deferred at the stub level (shown in the hub with "Not started" state) until Lodging ships.
- Why: Lodging is the load-bearing pattern. It's always shown (no conditional logic to bikeshed), multi-entry (teaches the repeater pattern that flights, events, and expenses all reuse), and it links to the expense ledger (teaches the cross-feature integration that Transportation, Accommodation, and event-level expense logging all need). Solving this once properly means the rest of the sections are template work. Simpler picks (Destination info, Group composition) wouldn't exercise the multi-entry + expense-link combo and would force that work to be redone later. The expense link is the riskiest integration — de-risk it first.
- Follow-up: Step-1 detail inventory for Lodging is scheduled in the spine-order inventory sprint (TASKS.md). No JSX until Step 1 + Step 2 are locked and `/design-handoff` has produced implementation-ready specs. Other preplanning sections receive stubs only (hub card showing state, no editor) until Lodging is live. BACKLOG.md P1 "Preplanning wizard" remains queued behind this reference implementation.

**Design skills:** This is a scope/sequencing decision, not a UI decision. `/user-research`, `/design-critique`, `/design-system`, `/design-handoff`, `/accessibility-review` will be invoked during the Lodging Step-1 / Step-2 / implementation workflow per GRILL_PROTOCOL.md.

### 2026-04-20 - ORM locked: Drizzle over Prisma

- Status: accepted (resolves the open question in ARCHITECTURE.md)
- Context: ARCHITECTURE.md listed ORM as an open question with Prisma and Drizzle as the two candidates. Stack is Next.js App Router on Vercel (shared plan) with Neon Postgres. TripWave's schema is standard relational (users, trips, trip_members, itinerary_events, expenses, expense_splits, travel_day_tasks, preplanning_lodging, invites). No exotic requirements. Solo dev on shared hosting. The decision was blocking Step-1 detail inventory work because every field listed for a page maps to a column, and the inventory work is sharper with a schema shape in play.
- Decision: Drizzle is the ORM. Schema lives as TypeScript in the codebase (`src/lib/db/schema.ts` is the intended home). Migrations use `drizzle-kit`. Query builder is SQL-first, TypeScript-native. No separate schema language file. Prisma is rejected for TripWave.
- Why: Solo dev on Vercel shared plan benefits materially from Drizzle's lighter runtime — faster cold starts matter for marketing-page and auth-page first-contentful-paint, and shared plans have more aggressive cold-start characteristics. Drizzle is TypeScript-native, which fits the rest of the stack and removes the context switch of a separate `.prisma` schema file. Neon's own documentation leans heavily on Drizzle as the 2026 well-paved path for Next.js + Neon. TripWave's schema is not exotic enough to need Prisma's larger ecosystem — every table is standard relational. Prisma's community-size advantage is narrower than it was two years ago, and solo-dev tutorial gap for Drizzle is acceptable given the schema simplicity. The Prisma binary and its cold-start cost are unnecessary friction for a cost-conscious solo-dev app.
- Follow-up: Install `drizzle-orm`, `drizzle-kit`, `postgres` (node-postgres). Create `src/lib/db/schema.ts` and `drizzle.config.ts`. Initial schema draft lives at docs/SCHEMA_DRAFT.md for iteration during the Step-1 inventory sprint. Migrations directory at `drizzle/` (excluded from commits where auto-generated). Environment variable strategy (ARCHITECTURE.md open item) should land the same week Drizzle is installed — one `DATABASE_URL` for Neon + separate pooled URL for serverless.

**Design skills:** N/A (architecture decision, no UI or visual component involved).

### 2026-04-20 - Expenses feature: grill complete (extends UX_SPEC.md § 11)

- Status: **accepted** (grill complete — all 14 sub-decisions locked; spec promoted to UX_SPEC.md § 11 Expanded)
- Context: UX_SPEC.md § 11 locked the balances-first layout, ledger structure, and a summary add-expense spec. Four areas were explicitly deferred: full add-expense interaction, settlement flow, edit/delete, and multi-currency. This grill fleshes those out to produce a complete Step 1 page detail inventory for the Expenses phase.
- Decision (in progress):
  - **Add-expense flow friction level: minimal first, details later.** The modal opens with amount field (focused, keyboard up immediately) + description only. Defaults fire silently: category auto-detected from description keywords (e.g., "taxi" → Transport, "ramen" → Food), paid-by defaults to the current user, split defaults to even across all active trip members. A *"More options"* affordance lets users adjust any default before saving. Primary use case is real-time logging mid-trip — every hidden tap is a tap that happens outside a restaurant. The 20% of expenses needing custom splits or category corrections use *More options* — opt-in, not default.
  - **Settlement flow: soft settlement, fully reversible.** Tapping *Mark settled* / *Mark paid* flags that per-pair balance as resolved immediately — no confirmation step, no amount re-entry, no bilateral confirmation required. The per-person row moves to a collapsible *"Settled"* section in the balances hero; the net amount updates; a small timestamp chip (*"Settled · just now"*) appears on the row. Reversible: undo within the session, or long-press → *"Unsettle"* at any time later. Settlement is per-pair and independent — settling with Sarah has no effect on the balance with Mom. No settlement record appears in the main expense ledger (settlements are not expenses). Deliberately NOT done: bilateral confirmation (stalls when one person ignores the app), payment method entry (friction at the moment of relief), amount confirmation (the balance is already calculated correctly).
  - **Edit and delete permissions: logger + organizer.** The person who logged an expense can edit any field (amount, description, category, paid-by, split) and can delete it. The organizer can edit and delete any expense. All other members are read-only on existing expenses. Editing recalculates affected balances immediately. An *"edited"* chip appears on the ledger row after any edit. Deletion fires a brief *"Expense deleted by [Name]"* toast to all active members and removes the row permanently — no soft-delete, no undo. Deliberately NOT done: any-member editing (erodes ownership clarity), per-expense change log (meaningful solo-dev complexity cost for a feature groups rarely need).
  - **Multi-currency: display currency + inline conversion (premium).** Each trip has one display currency set at creation. All balances and ledger totals show in that currency. When logging an expense, a currency selector appears in *More options* — user picks the currency they actually paid in, enters the foreign amount, and the app converts to the trip's display currency using a cached exchange rate, showing *"¥4,800 ≈ $32 USD"* inline before save. Exchange rate lookup is premium (free users see the currency field with a lock icon and upgrade hint — matching the existing § 11 reference). The ledger always stores and displays in the trip's display currency. Deliberately NOT done: per-transaction rate history (retroactive rate changes are a complexity trap), full multi-currency ledger with per-currency balance breakdown (overkill for casual group trips).
  - **Budget model: single trip budget with auto-category breakdown.** The organizer sets one overall trip budget at creation (or in Preplanning § Budget). All expenses count against that single number. The trip-total strip displays *"Trip total: $X · Your share: $Y · Budget: Z% used."* Tapping the strip expands an auto-category breakdown view showing spending distribution across expense categories (Food / Transport / Accommodation / Activities / Other / custom) — e.g., *"40% Food, 30% Accommodation, 20% Transport, 10% Other."* No per-category budget limits, no over-budget warnings per category. Over-total budget triggers a soft visual (strip turns neon pink) but no modal, no nagging. Deliberately NOT done: per-category budgets (setup friction for a feature groups abandon after day 2), over-budget modal/block (guilt without behavior change).
  - **Pre-trip deposits: no UI distinction from in-trip expenses.** Pre-departure expenses (Airbnb deposits, early-booked flights, activity pre-pays) are logged the same way as any other expense and appear in the same ledger, newest first, with no visual separator or dedicated section. The existing *By day* filter chip (§ 11) already groups by date so users can visually distinguish pre-trip days from trip days without a structural separator. The trip-total strip, balances hero, and budget calculations all include pre-trip expenses by default — they are trip costs like any other. Deliberately NOT done: *"Before the trip"* / *"On the trip"* ledger sections (adds a decision to every ledger scroll without changing behavior), dedicated pre-trip tab (overkill for most trips, hides real spending).
  - **Member lifecycle: point-in-time splits; past expenses frozen.** Member changes apply prospectively only. When a user joins mid-trip, they appear in the default "even split across all members" pool for expenses logged from their join timestamp onward; prior expenses are unaffected. When a member leaves or is removed, they remain included in the splits of any expense logged before their departure — their balances persist until settled (the existing grayed-out anonymized avatar treatment from § 10 applies in the ledger). No retroactive prompts, no silent balance rewrites. The logger can still manually include or exclude any active or historical member on any expense via *More options* (the escape hatch for real edge cases — e.g., "Kevin wasn't there but I covered his share of the taxi in advance"). Deliberately NOT done: retroactive inclusion prompts on join (decision tax, group drama), silent retroactive rewrites on leave (breaks ledger trust).
  - **Debt simplification: simplified settlement with transparent math.** The balances hero displays the minimum set of person-to-person transactions needed to zero out all debts (net owed → net received, greedy match). Users see e.g. *"You owe Sarah $10 · You owe Mom $20"* rather than three or four raw per-pair balances. A small *"How was this calculated?"* affordance below the hero expands to show the raw per-pair math for transparency and dispute resolution. *Mark settled* clears the simplified transaction, which under the hood closes the relevant raw balances. If new expenses are added after partial settlements, the simplified path recomputes from the remaining open balances. Deliberately NOT done: raw-only view (unnecessary extra settlements), user-toggled Raw/Simplified view (decision tax that doesn't change outcomes — either path moves the same money).
  - **Receipt scan (premium): OCR auto-fill for amount + merchant via Azure AI Document Intelligence.** The *Scan receipt* button (premium-gated per existing § 11) opens the camera, user photographs the receipt, image is uploaded to Azure AI Document Intelligence's `prebuilt-receipt` model. The response's `Total` and `MerchantName` fields auto-fill the amount and description on the add-expense modal; category auto-detect runs on the merchant name (the existing category-detection heuristic from Q1 takes the merchant string as input). User confirms or corrects before saving. Receipt image attaches to the saved expense as a thumbnail in the ledger; tapping opens full-screen. Confidence score below ~0.7 on a field shows a subtle *"check this"* hint next to the auto-filled value. Vendor choice: **Azure AI Document Intelligence, not Google Vision** (Google Vision underperformed in a prior Chris project; Azure's receipt model returns structured fields rather than raw text — dramatically simpler extraction logic, and the `Items[]` array is available at zero extra cost if v2 wants itemized splits). Deliberately NOT done: photo-only attachment (weak premium value — users ask *"why am I paying if I still type everything?"*), line-item parsing with per-item splits (OCR accuracy on line items is unreliable, support burden too high for solo dev v1; revisit in v2).
  - **Free tier limits: none on expense core.** Free users can log unlimited expenses, settle unlimited pairs, use all split types (even / even-selected / custom amounts / single person), and see full trip history. No expense-count cap, no split-type restriction, no history truncation. Premium gates are strictly additive features that matter to users who already love the core engine: *Scan receipt* (Azure OCR auto-fill), currency conversion inline hint, Smart Suggestions / destination-aware nudges. Honors `MONETIZATION.md`'s *"free should prove the product"* principle — the moment a user hits their 50th expense is exactly when you want them grateful, not guilt-taxed. Deliberately NOT done: soft cap at N expenses (blocks the moment users are actively valuing the feature), split-type gating (cripples the balances-first value prop; custom splits are common honest group behavior).
  - **Post-trip lifecycle: never closes, quiets down naturally.** The Expenses phase stays fully editable and accessible forever — no auto-archive, no manual close action, no lock. Post-trip behavior is naturally quiet because there's nothing new to log. A single gentle nudge fires if open balances remain 14 days after the trip's end date: an in-app banner at the top of the Expenses phase reads *"Still owed $X from [Name] — nudge them?"* and tapping triggers an existing share-style invite (not a push notification, not an email). Users can dismiss the banner; it does not reappear for 14 more days if still relevant. Otherwise the phase is silent. Deliberately NOT done: auto-archive after N days (risks locking users out when the friend finally pays back in month 4), organizer-triggered close (most organizers forget; doesn't meaningfully tidy the workspace), push notifications for unsettled debts (too aggressive; relationships matter more than settlement speed).
  - **Export: CSV free for all + branded PDF report premium.** Every user (free or premium) gets a *"Export"* affordance at the bottom of the Expenses phase that downloads a plain CSV: columns for date, description, amount, currency, category, paid-by, split breakdown, and settled-status. No branding, no footer, no gating — trust signal that "your data is yours." Premium users additionally get *"Download trip expense report (PDF)"*: a formatted, neon-on-dark branded document with trip name, date range, summary totals, per-person breakdown, category distribution chart, and a clean layout suitable for submitting to an accountant, a spouse, or a work reimbursement form. The PDF uses the trip's ball color as accent. Both exports respect the display-currency choice (Q4); the CSV includes the source currency and original amount for multi-currency expenses so power users can do their own math. Deliberately NOT done: no export at all (hostile to the solo-dev warm brand), gating CSV behind premium (data portability is a trust floor, not a premium add-on).
  - **Notifications: three bell events only.** (1) *"[Name] logged [description] · your share $X"* — fires when any expense is logged that includes the recipient in the split; universal for all affected members. (2) *"[Name] marked your $X balance as settled"* — fires only on the receiving side of a settlement (the person who was owed); the settler gets no notification because the action was self-initiated. (3) *"Trip budget is 90% used"* — organizer-only, fires once per trip at the 90% threshold; does not re-fire at 100% or above. All three are in-app bell notifications only, no push, no email. Color: green (financial) per existing § 29. Deliberately NOT done: edit-notifications (the *"edited"* ledger chip from Q3 is sufficient; bell clutter), delete-notifications (toast on delete from Q3 handles immediate visibility), overdue-balance nudges (becomes passive-aggressive money-guilt — damages trip relationships), per-category budget overage alerts (no per-category budgets exist per Q5).
  - **Integration with other trip features: two-way linking.** Itinerary events, lodging entries, and transportation entries all show an optional *"Add expense for this"* affordance that pre-fills the add-expense modal (item name → description, item date → expense date, item type → suggested category). Expenses created independently can be linked to an existing itinerary event, lodging entry, or transportation entry via a *"Link to itinerary"* field inside *More options* — invisible by default, surfaced on demand. Linked expenses display the existing green coin badge on the source item; the ledger row shows a small chip indicating the linked item type. Unlinking is supported (remove the link; expense stays; badge disappears). Deliberately NOT done: auto-suggest "you're at Torikizoku right now — link this?" based on time + location (deferred to v2 — too many edge cases with overlapping events, missing timestamps, or logging from home). The auto-suggest remains an open v2 topic once the itinerary reliably has timestamps.
- Why:
  - Real-time logging is the dominant use case. Speed at the moment of payment is the primary constraint; friction is the enemy.
  - Smart defaults (category auto-detect, current-user paid-by, even split) cover the majority case with zero extra taps.
  - *More options* preserves full control without imposing it on every entry.
  - Groups using TripWave trust each other enough to be on the same trip. Soft, reversible, per-pair settlement is the lightest honest signal — it clears the mental debt without requiring forms or the other person's action.
  - Logger + organizer edit/delete matches ownership norms — clear accountability, no any-member edit chaos, no change-log overhead.
  - Display-currency + premium inline conversion via Azure hits the magic moment at paid moment without building a multi-currency ledger (complexity trap for casual trips).
  - Single budget + auto-category breakdown delivers insight at zero setup cost; per-category budgets get abandoned in practice.
  - Pre-trip expenses are trip expenses; structural UI separation creates false categories of money.
  - Point-in-time splits preserve historical truth (the foundation of ledger trust) and avoid retroactive-billing drama.
  - Simplified settlement + transparent math minimizes settlement count while preserving auditability — the best of Splitwise-style ergonomics with receipts for the skeptics.
  - Azure AI Document Intelligence `prebuilt-receipt` is the right OCR vendor (receipt-specific, structured fields, better than Google Vision in Chris's experience, and leaves `Items[]` available for v2 itemization).
  - No free-tier caps on the core engine honors `MONETIZATION.md`'s "free should prove the product"; premium gates are purely additive magic.
  - Post-trip never closes because real settlement happens on human timelines, not app timelines. The 14-day nudge banner is the calmest possible encouragement.
  - CSV-for-all is a trust floor; PDF report is a premium magic layer with real reimbursement + marketing value.
  - Three bell events cover the moments that matter; edit + overdue notifications would be clutter or passive aggression.
  - Two-way linking to itinerary/lodging/transport preserves the existing § 11 coin-badge model while enabling after-the-fact attachment for the 20% of real edge cases.
- Follow-up: Grill complete. Spec promoted to UX_SPEC.md § 11 (expanded from summary-level to full Step 1 page detail inventory). Step 2 UI mockup + `/design-critique` required before any implementation begins. `/design-system` if mockup introduces new patterns. `/design-handoff` before coding; `/accessibility-review` before shipping. Azure AI Document Intelligence integration documented in `reference_azure_ocr.md` memory for future sessions.

**Design skills:** `/user-research` offered and skipped. `/design-critique`, `/design-system`, `/design-handoff`, `/accessibility-review` to be invoked before mockup locks or implementation begins.

### 2026-04-20 - Multi-leg repacking feature: grill in progress (extends Packing + Travel Day)

- Status: **accepted** (grill complete — all sub-decisions locked; spec promoted to UX_SPEC.md § Multi-leg Repacking)
- Context: User pivoted to grilling packing features. Concrete ask: let users re-check their packing list before each travel day throughout the trip, so items brought on the trip are re-packed and tracked through every leg (including return home). Extends existing packing list spec (`UX_SPEC.md` §§ 8, 37; `ARCHITECTURE.md` packing_list + packing_item data model with `is_visible_to_group` + `is_private` flags). Multi-leg repacking is not specced in any existing doc. The extension lies beyond the Core Loop spine — basic packing list CRUD is MVP but per-leg repacking is a Later-phase enhancement. User explicitly overrode spine-first discipline via the *"flesh out existing features to make a useful app"* framing.
- Decision (in progress):
  - **Primary user need:** forgetfulness prevention — the charger-at-hotel pain point. Secondary: group accountability (layered on top of existing assigned-bringer avatars in the Group tab). **Skipped:** inventory tracking (niche, high data-entry cost), adaptive repacking (depends on premium Smart Suggestions — defer as incremental enhancement when Smart Suggestions ships).
  - **Leg definition:** auto-derived from the itinerary. A leg is any (a) overnight-accommodation change, (b) trip start (depart from home), or (c) trip end (return home). No user setup, no manual leg-creation UI. Leverages existing Preplanning § Accommodations data. Deliberately skips: day-trips that return to the same accommodation, layovers, and other travel days without a location change.
  - **Where the check UI lives:** inside the existing **Travel Day focus mode** (`UX_SPEC.md` §§ 9, 38). Not a new surface, not a modal, not a Packing-page banner, not Vacation Day's Morning Briefing. The repack check extends the existing focus-mode checklist with a "Repack essentials · N items pending" section, reusing the calm-neon big-checkbox UI + status strip vocabulary already locked. Auto-appears on leg-triggering travel days (per the leg definition above). Focus mode's existing T-6hrs auto-route and ad suppression carry over for free.
  - **Item scope + check granularity:** the repack check uses **category-level rows with expand-to-item**. The default view shows one row per category from the user's packing list (Clothing, Toiletries, Electronics, Documents, Other, plus any custom categories). Tapping a category header toggles the ✓ for the whole category AND auto-checks every item inside it. Tapping the category's expand caret reveals individual items for finer control — users can tap specific items without bulk-checking. Items marked private (per existing packing spec) stay private inside the check — only their category count contributes to the "N items pending" status strip. Group-assigned items appear inside their category with the assignee avatar next to the item. Deliberately NOT done: showing every item at top level (breaks Pillar 2's calm promise on big lists), requiring an "essentials" flag (adds setup friction), auto-flagging heuristics (silent misfires).
  - **Trigger timing:** two-stage. (1) **T-24 hrs before each leg's travel day:** an in-app notification fires through the existing bell system — *"Tomorrow you leave [location] — 5 categories to repack."* Tapping routes to a preview of the repack check inside the Travel Day page. This gives users actionable lead time to pack deliberately rather than scrambling. (2) **T-6 hrs of the travel day:** focus mode auto-activates per existing spec and the repack check appears inline as a hard checkpoint at the top of the checklist. No T-12 hrs bedtime nudge (respects `UX_SPEC.md` § 29's restrained notification philosophy). No user configuration (solo-dev scope trap for a feature most users wouldn't tune).
  - **State model across legs: binary per leg, fresh each time.** Each leg's check has its own independent ✓/✗ state per category (and per item within expanded categories). When a leg closes (the travel day ends), the next leg's check starts with everything unchecked — no cross-leg state inheritance, no "last confirmed at Tokyo" hints. A minimal **per-leg audit trail** is retained (e.g., *"Leg 2 — Tokyo → Kyoto: 5/5 categories confirmed at 10:42 AM"*) for later surfacing in the Memory recap (nostalgic moment: *"You successfully repacked 7 times across 4 cities"*). Deliberately NOT done: full per-item lifecycle state machine (`at-home` → `packed-for-leg-N` → `confirmed-at-destination-N` → `returned-home`) — that is inventory tracking, which was deferred in the primary-user-need decision; revisit in Phase 7 if real users request it. Return-home leg uses the same binary check (no punitive "items unconfirmed" callout — users may have intentionally left things behind).
  - **Free vs premium:** the **core repack check is free** — forgetfulness prevention is the whole value prop and paywalling it would break the *"free should prove the product"* principle from `MONETIZATION.md` § Core Monetization Principle and the supporter-gratitude framing in § 5. **Premium enhancements** ride the existing Smart Suggestions premium track (`MONETIZATION.md` § 3 and § 4.E): destination-aware prompts per leg (e.g., *"Kyoto is rainy — keep umbrella accessible"*, *"Osaka hotel has irons, leave yours behind"*), climate-aware reshuffles (move the down jacket to the top when heading to Hokkaido), and weather/activity context injected into category rows. No new SKU, no new paywall copy, no new tier boundary — the split cleanly uses existing monetization infrastructure. No ads in the T-24 hrs notification or inside focus mode (travel days are stressful moments, ads already suppressed per § 8).
  - **Edge cases (mid-trip additions, intentional discards, skipped legs): light-intent model.** Items added to the packing list mid-trip automatically appear in all future leg checks — no action required from the user. Items intentionally left behind, used up, or donated are handled via an extension to each item's existing three-dot menu: a new option *"Left behind / used up / donated"* removes the item from subsequent leg checks while retaining it in the audit trail (it was packed at the start, just not carried forward). Skipped legs are silent — if a user doesn't open Travel Day during a leg-triggering travel day, the next leg's check starts fresh with no nagging, no "you skipped the Osaka check" guilt callout. Deliberately NOT done: automated item-lifecycle state machine (deferred as inventory tracking); blocking prompts when items are unchecked (violates Pillar 2's calm promise).
  - **Group-item handling: owner-only responsibility.** Group packing list items (those with an assigned-bringer avatar from the Group tab) appear only in the assigned bringer's per-leg repack check — not in any other member's check. The bringer checks (or uncheck) the item exactly like a personal item. No read-only visibility for non-bringers inside the repack check. Organizers who want group-item status during Travel Day consult the existing Group tab overview, not the repack check. Deliberately NOT done: broadcasting group items to all members' checks as read-only (creates passive-aggressive "I can see you haven't packed the sunscreen" tension — violates Pillar 2's calm promise).
- Why (so far):
  - Forgetfulness prevention is the universally relatable travel pain. One-sentence marketing hook: *"Never forget your charger at the hotel again."* TikTok-friendly, ASO-friendly.
  - Auto-derived legs reuse existing preplanning data with zero user configuration, avoiding a new UI surface for leg definition. Solo-dev win.
  - Hosting the check inside Travel Day focus mode captures the app's highest-attention moment — users are already there, actively paying attention. Zero new UI surface to design, discover, or document. Extends the existing *"Leaving home by 3:30 PM · 2 items pending"* status-strip vocabulary naturally to *"Repack essentials · N items pending."*
  - Category-level rows map to how people physically scan a hotel room when packing up (*"bathroom = Toiletries, nightstand = Electronics, drawers = Clothing, safe = Documents"*). Five taps to clear the common case; item-level available when users want to be thorough. Zero new data model — the packing list already has categories.
  - Two-stage timing gives users lead time (T-24 hrs) to pack deliberately instead of scrambling at T-6 hrs, and a hard checkpoint (T-6 hrs) so nothing slips through. Rides on existing notification bell and existing focus-mode activation — zero new trigger infrastructure. Double marketing content: the notification arriving AND the focus-mode check can each anchor a TikTok reel.
  - Binary per-leg state is the minimum viable truth: users mentally reset at every hotel change (they've been USING their stuff, so everything genuinely needs re-confirmation). Per-leg audit trail feeds the Memory recap without requiring per-item lifecycle tracking. Keeping the state model dumb means offline sync, conflict resolution, and multi-device edits stay cheap.
  - Free core + premium add-ons produces both a viral acquisition hook AND a natural upgrade path from one feature. The free repack check gives every participant (not just organizer) a reason to love the app — *"this is the one that stopped me leaving my charger at the Tokyo hotel"* — feeding the invite loop. The premium destination-aware layer is a warm supporter bonus gift that fits the existing "gratitude not extraction" framing. One feature, two marketing stories.
  - Deferring inventory + adaptive repacking keeps MVP scope tight — both can be added later without rework.
- Follow-up: Grill complete. Spec promoted to UX_SPEC.md as new § Multi-leg Repacking (extends § 8 Packing List and §§ 9, 38 Travel Day). Step 2 UI mockup + `/design-critique` required before any implementation begins. If mockup introduces a new motion or layout pattern not in DESIGN_SYSTEM.md, run `/design-system`. Run `/design-handoff` before coding; `/accessibility-review` before shipping.

**Design skills:** `/user-research` offered and skipped (user-need direction was clear enough from the concrete framing). `/design-critique`, `/design-system`, `/design-handoff`, `/accessibility-review` to be invoked as the grill progresses and before any mockup locks or implementation begins. Full Design skills status logged when this entry is closed.

### 2026-04-20 - Fun-ideas sandbox locked at docs/FUN_IDEAS.md; Trip Creation section populated as first brainstorm pass

- Status: accepted
- Context: With `docs/FEATURES.md` structure locked and Section 1 (Auth & Account) populated, the user pivoted to a parallel track: brainstorming fun ideas (micro-interactions, motion flourishes, copy moments, easter eggs, sensory details) for each existing feature. Fun ideas are a solo-dev marketing asset — they're the moments that become TikTok build-in-public reels, App Store screenshots, press-demo "oh that's neat" beats, and word-of-mouth easter eggs. Many features already have partial fun treatments in `UX_SPEC.md` (signup's dashed ball, login's sad-shake, trip creation's wipe transitions, travel day's focus mode). The brainstorm extends and fills gaps rather than starting from zero. An explicit scope override was given: fun-ideas brainstorming covers MVP + Later + Speculative features, not only the CORE_LOOP spine, because the point is to have marketing ammunition ready for every feature that exists in the docs.
- Decision: Created `docs/FUN_IDEAS.md` as a dedicated brainstorming sandbox separate from `UX_SPEC.md` (authoritative spec) and `DESIGN_SYSTEM.md` (locked patterns). Structure mirrors `FEATURES.md`'s 14 functional-area sections so ideas land where they're discoverable. Each idea is a bulleted card with a title, 1–2 sentence description, and tags: status (`brainstormed` / `under-critique` / `locked` / `shipped` / `rejected`), marketing hook (`Film-for-TikTok` / `ASO-screenshot` / `Press-demo` / `Easter-egg` / `Onboarding-ritual` / `Micro-polish` / `Brand-reinforcement`), effort (`tiny` / `small` / `medium` / `large`), and a Design-skills line tracking `/design-critique` and `/design-system` invocations per `GRILL_PROTOCOL.md`. Locked ideas get promoted to `UX_SPEC.md` with provenance; rejected ideas retire to an "Idea graveyard" section at the bottom with a one-line reason. First brainstorm pass populated Section 3 (Trip Creation) with 12 ideas spanning all 4 steps of the creation flow plus overall-flow ideas — headline moments include the typing-sympathetic ball-breathing, ball-fill liquid-pour physics on color commit (tagged as the money-shot for TikTok and ASO screenshot 4), and the ocean-wave ball-ripple reveal in Step 4 (native source asset for ASO screenshot 2's "Get everyone on the same wave" visual).
- Why: Fun ideas need a sandbox that doesn't contaminate authoritative spec. Injecting 10+ speculative ideas per feature into `UX_SPEC.md` would blur the line between "what we're shipping" and "what we might play with," making UX_SPEC harder to trust as a source of truth. A separate doc with explicit status vocabulary lets brainstorms run wild without spec drift, and promotes only locked winners. Marketing-hook tagging ties every idea back to a concrete acquisition surface (TikTok, ASO, press) — so the solo dev can scan the doc for "what should I film this week?" rather than inventing content from scratch. Mirroring `FEATURES.md`'s 14-section structure means the two docs are navigable in parallel — the same mental map serves both feature reference and fun-ideas brainstorm.
- Follow-up: Before any idea moves from `brainstormed` → `locked`, run `/design-critique` on it; if the idea introduces a new motion / palette / interaction pattern not already in `DESIGN_SYSTEM.md`, also run `/design-system` per `GRILL_PROTOCOL.md`. Next brainstorm sessions extend to remaining 13 sections. The Trip Creation 12 ideas live as `brainstormed` until the user picks favorites for critique. The "Progress ghost" idea is flagged as potentially in conflict with the UX_SPEC "no per-step numbering or progress bar" rule — needs `/design-critique` to resolve. The FEATURES.md populate pass (Sections 2–14) is paused during fun-ideas brainstorming; the two tracks resume independently per user direction.

**Design skills:** this decision was doc-level (sandbox structure and idea-card format). The 12 Trip Creation ideas themselves are `brainstormed` status — `/design-critique` has not yet run on any individual idea. To be invoked before any is locked.

### 2026-04-20 - Canonical feature index locked at docs/FEATURES.md

- Status: accepted
- Context: Features are spread across 16 docs totaling ~10,450 lines (`UX_SPEC.md` 2,720 lines; `MONETIZATION.md` 1,171 lines; `LOGIC_FLOW.md` 1,156 lines; plus CORE_LOOP, ROADMAP, BACKLOG, APP_STRUCTURE, STATE_MODEL, DESIGN_SYSTEM, and others). Great for depth but terrible for marketing: there's no single place to look when drafting landing-page copy, an ASO screenshot caption, a waitlist email, a press pitch, or a Product Hunt launch post. The solo dev cannot afford to re-read 10k lines every time a feature needs to be referenced externally.
- Decision: Created `docs/FEATURES.md` as the canonical feature index. Scope of the consolidation is strictly merge-and-organize — no new features invented; existing docs remain authoritative for depth (UX_SPEC for UX detail, MONETIZATION for premium framing and revenue math, CORE_LOOP for phase priority). Structure locked via six sub-decisions: (1) relationship to old docs — new canonical doc, old docs keep depth; (2) columns — Feature / Phase / Tier / Revenue role / Marketing surface / What it is (6 columns); (3) grouping — by functional area (not by phase, not by revenue lens); (4) granularity — medium (parent feature row + 3–5 child rows where a child is individually marketing-relevant); (5) narrative scaffolding — 3 marketing pillars ("Group-first planning", "Calm travel-day mode", "Supporter-framed premium") at the top of the doc plus section intros; (6) cadence — scaffold first, populate each of 14 functional-area sections in separate turns so each section can be reviewed and committed independently. Revenue-role enum: `free-utility` / `premium-gift` / `affiliate-driver` / `ad-supported` / `retention-hook` / `viral-loop` / `none`. Marketing-surface enum: `landing-hero` / `ASO-1`…`ASO-8` / `waitlist-email` / `press-angle` / `in-product-only` / `none`. Sync rule at top of doc: editing FEATURES.md requires checking PITCH.md for drift in the same commit.
- Why: Solo-dev marketing survives on repeatable copywriting moves — landing page, ASO, waitlist, press, Product Hunt, TikTok build-in-public. All of those pull from the same feature set. One canonical list with marketing tags built in means those surfaces can be drafted in 15 minutes instead of a multi-doc excavation. Functional-area grouping beats phase or revenue-lens grouping because marketing thinks in product surfaces ("all itinerary stuff", "all travel-day stuff") — revenue is still accessible via a column, not a section. Three marketing pillars at the top give stable narrative hooks quotable verbatim across every external surface, keeping the product's story consistent under launch pressure.
- Follow-up: Populate each of the 14 functional-area tables in successive turns, one section per turn, so each section is reviewable and committable as its own diff. Primary source-doc extraction order suggestion: Auth & Account → Dashboard → Trip Creation → Overview → Preplanning → Itinerary → Expenses → Travel Day → Members & Invites → Dream Mode → Premium & Supporter Moments → Marketing Surfaces → Retention Surfaces → Affiliate & Ads. After populating, check PITCH.md for any drift (it should be fine; no new features were invented, just re-organized). Open-questions section at the bottom of FEATURES.md catches unresolved items as they surface during population.

**Design skills:** this decision was doc-level (information architecture for a reference file), no UI mockup or visual component involved. `/user-research`, `/design-critique`, `/design-system`, `/design-handoff`, `/accessibility-review`: N/A.

### 2026-04-17 - Grill-Me Session Protocol locked as canonical workflow for all sessions and machines

- Status: accepted
- Context: The Anthropic Design plugin was wired into the Build Workflow as quality gates, but "should invoke" language leaves room for the user (and future Claude Code sessions) to forget. The solo dev may be running on different computers and different sessions at different times. A canonical protocol doc is needed so every agent on every machine enforces the rules consistently.
- Decision: Created docs/GRILL_PROTOCOL.md as the canonical rulebook for all grill-me sessions on TripWave. Protocol requires active prompts from the agent at specific moments: `/user-research` if user needs are unclear, `/design-critique` after every mockup description, `/design-system` when a new pattern is introduced, `/design-handoff` when mockup is locked, `/accessibility-review` when implementation or shipping is mentioned, `/research-synthesis` when user feedback is mentioned. Exact inline prompt copy provided for consistency. Every UI decision log entry ends with a "Design skills" line noting which skills were run or skipped. Skipping is allowed only for tiny tweaks / bug fixes, not for new pages or significant rebuilds. The plugin usage language in CORE_LOOP.md upgraded from SHOULD to MUST.
- Why: Solo dev on multiple machines needs a doc that any session reads first and then enforces. Without active prompting, quality gates get skipped in the moment. The protocol doc becomes the single source of truth referenced from README, CORE_LOOP, and ROADMAP so no session misses it.
- Follow-up: Future grill-me sessions on UI must follow GRILL_PROTOCOL.md. Decision log entries for new UI work must end with the Design Skills line. README has a top-level pointer so any new agent sees the protocol before grilling. Full protocol in docs/GRILL_PROTOCOL.md.

**Design skills:** this decision was process-level, no mockup or component involved. Skills not invoked (N/A).

### 2026-04-17 - Anthropic Design plugin wired into the Build Workflow as quality gates

- Status: accepted
- Context: The official Anthropic Design plugin was installed (6 skills: /accessibility-review, /design-critique, /design-handoff, /design-system, /research-synthesis, /user-research). These map cleanly onto the Details → Mockups → Code workflow just locked in CORE_LOOP.md. Using them intentionally at the right workflow points is significant solo-dev leverage.
- Decision: Each of the 6 skills is assigned to a specific Build Workflow moment. /user-research early in Step 1 when user needs are unclear. /design-critique during Step 2 to pressure-test mockups before locking. /design-system during Step 2 when introducing new components or patterns (and for auditing DESIGN_SYSTEM.md itself). /design-handoff at the end of Step 2 / start of Step 3 to produce implementation-ready specs. /accessibility-review at end of Step 3 before shipping. /research-synthesis post-launch for distilling user feedback. These are quality gates, not optional polish -- grill-me sessions on new pages must invoke /design-critique before locking, pre-implementation must invoke /design-handoff, pre-ship must invoke /accessibility-review. Skipping only allowed for tiny tweaks and bug fixes.
- Why: Solo devs benefit disproportionately from automated design feedback because there's no team review. /design-critique replicates some of what a design partner would provide. /accessibility-review catches WCAG issues that single-person reviews miss. /design-handoff eliminates the "what did I mean by this?" mid-implementation pain. Using the plugin actively makes TripWave's design quality higher without adding team cost.
- Follow-up: Plugin usage table lives in docs/CORE_LOOP.md under "Build Workflow → Anthropic Design plugin -- which skill to invoke at each step". Grill-me sessions update to reference these skills at relevant moments.

### 2026-04-17 - Build workflow locked: Details → Mockups → Code for every page

- Status: accepted
- Context: Fun-treatment UX_SPEC sections have been written for many pages without a documented inventory of what information, actions, states, and edge cases each page contains. This creates risk at implementation time -- details get forgotten, pages drift, work duplicates, scope silently expands. The discipline of defining details before mockups, and mockups before code, is a standard product workflow that was implicit but not documented.
- Decision: Every new page (and every significant page rebuild) follows a three-step workflow in order. Step 1: Page detail definition -- a written inventory of what information, actions, states, edge cases, and ordering the page contains. Step 2: UI mockup -- ASCII wireframe, Figma, or inline description matching the detail inventory, honoring neon-on-dark palette and liquid motion rules. Step 3: Code -- only after Steps 1 and 2 are locked. Future grill-me sessions on a page must produce Step 1 output first, then Step 2. If a grill jumps straight to visual decisions without a detail inventory, stop and route back to Step 1. Tiny tweaks and bug fixes are exempt.
- Why: Jumping to code before defining what's on the page produces pages that drift, duplicate work, and leak scope. Defining mockups after details prevents "oh I forgot we needed [X]" mid-build. Solo devs especially benefit because there's no design handoff to force the pause. This also prevents grill-me sessions from producing beautiful fun treatments for pages whose underlying data model is still unwritten.
- Follow-up: Audit existing UX_SPEC sections for pages without a Step-1 detail inventory. For each, log an inventory task in BACKLOG.md before that page is implemented. Full workflow spec in docs/CORE_LOOP.md under "Build Workflow -- Details → Mockups → Code".

### 2026-04-17 - Core Loop defined as the must-prove spine, scope discipline established

- Status: accepted
- Context: Docs were expanding faster than the codebase. Fun treatments for 11 pages were specced (landing, signup, login, dashboard, creation, preplanning hub, itinerary, packing, travel day, vacation day, expenses) while auth and trip creation aren't yet wired in code. At this rate, the product risks scope-spiraling into three apps at once before the core loop is even proven.
- Decision: Defined the 7-step must-prove spine in docs/CORE_LOOP.md: (1) sign up, (2) create a trip, (3) invite people, (4) preplan, (5) build itinerary, (6) use travel day, (7) track expenses. Every feature in the repo is now classified as MVP / Later / Speculative. Dream Mode, Wishlist, Notes, Vault, Tools hub, Memory, polls, and most of the fun-page treatments beyond the spine are classified as Later or Speculative. Future grill-me sessions on deferred topics are queued in ROADMAP.md under "Future Grill-Me Topics" and are NOT revisited until the 7-step spine is implemented and usable end-to-end in code.
- Why: Design-before-build discipline is only valuable when it stays close to the build horizon. Speccing polished micro-interactions for features that may ship in year 2 creates doc drift, maintenance cost, and a false sense of progress. The spine is what the product has to prove first; everything else is embellishment.
- Follow-up: All future grill-me sessions start with "is this on the spine?" If no, route the topic to ROADMAP.md deferred queue. Every feature in UX_SPEC, MONETIZATION, and BACKLOG should be tagged MVP / Later / Speculative over time. Full rule set in docs/CORE_LOOP.md.

### 2026-04-17 - Premium framing must be warm but clear, not vague

- Status: accepted (refinement of the supporter-framing decision)
- Context: The supporter framing ("premium is how you say thanks, here are bonus features as a gift") is warm and differentiates TripWave from corporate pricing language. But "bonus fun stuff" phrasing risks becoming so vague that users don't know exactly what they're buying. Warm is good. Vague is not.
- Decision: Premium copy must always name the specific bonuses it unlocks. Good: "Premium is how you say thanks. In return: no ads, unlimited dreams, offline mode, receipt scanning. $7.99, once." Bad: "Support the app and get some bonus stuff as a thank-you." Every premium surface (purchase sheet, support cards, moment cards, pricing page) must list concrete benefits. Warmth is tone. Clarity is substance. Both must be present.
- Why: Users reading the premium sheet need to walk away knowing exactly what they are buying. Vague framing reduces conversion because users do not trust what they cannot see. The $7.99 one-time unlock has to justify itself on specific value, not on generalized goodwill alone.
- Follow-up: Audit all premium copy across UX_SPEC and MONETIZATION docs, replace any vague "bonus fun stuff" phrasing with specific benefit lists. Premium purchase sheet body text in docs/MONETIZATION.md section 5 is the canonical version.

### 2026-04-17 - Fixed README.md naming drift from "Ultimate Vacation" to "TripWave"

- Status: accepted
- Context: Repo name is "ultimate-vacation" (historical). Docs have been consistently saying "TripWave" for months. README.md still said "Ultimate Vacation" -- a drift that weakens confidence and confuses anyone arriving via the repo first.
- Decision: Rewrote README.md to consistently say TripWave throughout. Added pointers to PITCH.md (layman's intro) and CORE_LOOP.md (must-prove spine). Brand section at the bottom names the neon-on-dark direction, ocean-ripple logo, liquid motion, slogan, and supporter framing. Repo folder name (ultimate-vacation) is not renamed for now -- would require git history rewrites -- but every doc surface now reads TripWave.
- Why: Naming consistency is a confidence signal. Drift between README and docs suggests the team (or solo dev) doesn't know what they're building. Fixing is free.
- Follow-up: If a rename of the repo root folder is ever needed, handle it as a dedicated migration with git-remote update. For now, internal naming consistency across all docs is sufficient.

### 2026-04-17 - Primary brand direction shifts to neon-on-dark with pure white text

- Status: accepted (supersedes previous white-first palette as primary brand direction)
- Context: Current palette was white backgrounds with cyan/yellow/pink/green accents -- friendly but generic in the travel app category. Competitors (TripIt, Wanderlog, Visited) all ship white-first designs. A distinctive dark-with-neon direction separates TripWave visually, makes the trip balls glow dramatically, and reads premium.
- Decision: TripWave ships primarily dark-mode with neon rainbow accents and pure-white body text. Base dark #0A0A12, elevated surfaces #15162A, card on dark #1D1E36. Text stays pure white (#FFFFFF) -- never muted to gray on dark backgrounds for accessibility and style. Neon palette: cyan #00E5FF, yellow #FFEB00, pink #FF3DA7, green #39FF6B, plus new accents purple #B14DFF (Dream Mode) and orange #FF9236 (urgency). Legacy light-mode palette deprecated for primary use but may appear in specific contexts like printable PDFs. No light-mode toggle in v1 -- the dark neon direction IS the brand.
- Why: Trip balls glow against dark, turning the product's central visual into a light source. Neon rainbow feels celebratory, fun, and distinctive. White-on-dark eliminates the "accessibility-weak gray text" problem of light mode. Premium indie tools (Linear, Raycast, Framer) validate this direction commercially. Saves OLED battery on mobile.
- Follow-up: Audit every page in the app for dark-mode compliance. Update existing marketing/auth/app component styles. Retire the #00A8CC primary cyan in favor of neon #00E5FF. Full palette + text + glow spec lives in docs/DESIGN_SYSTEM.md under "Neon-on-Dark Brand Direction".

### 2026-04-17 - Expenses use warm reframe hero + precise ledger + subtle settlement celebration

- Status: accepted (structural balances-first layout locked in section 11; this adds tone + palette + celebration)
- Context: Money between friends on group trips is emotionally loaded. Standard expense-tracker language ("you owe", "debt", "collect") makes it feel accusatory. The challenge was warming the hero without losing the precision users need for actual reconciliation.
- Decision: Balances hero uses warm casual language ("Sarah's got you for $18", "You've got Mom for $42", "You and everyone are even ♥"). Ledger below stays precise and factual ("Chris paid $48 for dinner at Tsukiji · split evenly 4-way"). Settlement of a single row triggers a neon-green ripple fade, toast "Settled with Mom. ♥", and one wave-pulse on the nav ball. Whole-trip settlement shows gentle green dot sprinkle rising and fading (subtle, not fireworks). Scan receipt premium-gated with liquid-shimmer loading state. Empty state: ball on a coin, "Log the first expense. Day zero counts." Language rules forbid "debt", "collect", "due" in prose -- may appear only in structured amounts. Easter eggs: rapid-tap settled celebration cascades dots, double-tap category icon in ledger does a wiggle dance.
- Why: Warm hero language defuses the tension users feel with money. Precise ledger preserves the reconciliation data they actually need. Settlement celebration rewards the resolution moment without trivializing it. No gamification, no credit scores, no alarm states for budget overages.
- Follow-up: Implement mark-settled flow with ripple animation, whole-trip celebration state, filter-chip cross-fade. Full spec in docs/UX_SPEC.md section 40.

### 2026-04-17 - Vacation Day uses warm-scroll layout plus live "up next" pinned pill

- Status: accepted (structural layout already locked in section 10; this adds fun + palette + live-moment treatment)
- Context: Vacation Day is a daily in-trip companion. The user wants both a calm morning-coffee feel AND right-now utility when an event is minutes away.
- Decision: Keep the structural warm-scroll layout and add a live "up next" pinned pill at the top that appears when the next event is within 2 hours. Pill uses the trip color at low saturation and pulses with wet-neon shimmer as the time approaches, tap scrolls to the event, dismissible per-event. Morning briefing gets the neon treatment with a trip-color gradient at the top edge. Today's events river uses itinerary card anatomy with completed events fading to 60% opacity and currently-active events glowing brighter. Activity strip chips get category color dots. Quick action buttons use liquid ripple on tap. Peek-tomorrow link is neon purple. Ball pulses at slower 4s rhythm (vacation glow). Triple-tap greeting easter egg cycles destination-localized greetings.
- Why: Warm scroll provides stable scaffolding users can scan without surprise. Live pill adds actionable right-now utility without reordering the whole page. Vacation Day should feel like a calm travel buddy, not a live-data dashboard.
- Follow-up: Implement live "up next" logic (appears within 2h, dismisses per-event), sunrise briefing refresh, destination-language greeting rotation. Full spec in docs/UX_SPEC.md section 39.

### 2026-04-17 - Travel Day focus mode uses calm neon plus encouraging companion

- Status: accepted (structural auto-route + focus mode already locked in section 9; this adds fun-dial calibration)
- Context: Travel Day focus mode is the one place in the app where the "fun" vibe has to retreat -- users are stressed, at airports, sleep-deprived. But stripping ALL personality makes TripWave feel like a hospital waiting room. The question was how much energy to keep.
- Decision: Calm neon plus encouraging companion. Sidebar collapses to icons. Top nav becomes minimal status strip with essential info only. Base dark with NO ambient gradient drift. Ball present but small and slowly pulsing. Main view: single up-next task dominates the screen, massive Fredoka task title, two giant tap targets (Done neon green ~72px, Skip smaller). Rotating warm nudge copy above the task ("Take a breath. Next up."). Ball glows brighter for a beat when tasks complete. Segment transitions fade in a "[segment] done ♥" overlay. Swipe-right-to-complete on mobile with haptic. "Leave in X min" chip turns pink when overdue with warm wording. Exit focus mode link always visible. Post-arrival warm landing: "You made it. ♥"
- Why: Pure grayscale sterility would strip TripWave's character at the most important moment. Pure normal treatment would feel chaotic during stress. Middle path keeps the ball as a quiet companion while dialing energy way down.
- Follow-up: Implement focus-mode layout switch, swipe-to-complete gesture, segment transition overlay, auto-exit on arrival. Full spec in docs/UX_SPEC.md section 38.

### 2026-04-17 - Liquid motion system: wet neon, oil-flow, water-wave ripples throughout app

- Status: accepted (supersedes ad-hoc motion hints across earlier docs)
- Context: Neon against dark needs a motion character to feel premium and alive without being busy. The app's name is TripWave -- motion should literally feel like a wave. Previously, motion guidance was scattered across DESIGN_SYSTEM.md, UX_SPEC.md, and various decisions.
- Decision: Foundational motion system codified. Neon is rendered with "wet paint" treatment: subtle top-light sheen, outer glow, and a slow living shimmer (8-12s cycle) on key elements like CTA buttons, the trip ball, and active navigation. Transitions use oil-flow easing curves -- standard cubic-bezier(0.22, 0.68, 0.28, 1), entrance cubic-bezier(0.3, 1.5, 0.5, 1), exit cubic-bezier(0.6, 0, 0.9, 0.4). No linear or ease-in-out. No spring bounce. Tap / click produces water-ripple from contact point (circular, ease-out, 600ms, 30% opacity of accent color). Page-level transitions use a left-to-right "wave sweep" instead of straight fade (trip creation already does this). Loading states are gentle left-to-right wave shimmers, not pulses or spinners. Ball motion is the archetype: wave-pulse 3.6s, fill animation with 1-2px sine-curve water-level edge, roll with spring settle, celebration bloom 600ms. All animations respect prefers-reduced-motion with specific fallbacks. Travel Day focus mode explicitly reduces liquid motion (calm mode, fewer shimmers).
- Why: Motion is naming. TripWave literally tells you the motion language. Wet-neon differentiates from flat-neon competitors (Linear, Framer). Oil-flow easing feels premium and organic vs mechanical linear/ease-in-out. Water ripples unify tap feedback across the entire app. Living shimmer makes neon look painted-and-drying rather than static LED. Subtle is the target register -- users should feel it, not notice it.
- Follow-up: Build centralized CSS custom properties for easing / durations. Build reusable ripple pseudo-element pattern. Performance-test living shimmer to ensure 60fps idle. Full spec in docs/DESIGN_SYSTEM.md under "Liquid Motion System".

### 2026-04-17 - Created PITCH.md as layman's-terms product description, kept in sync with all docs

- Status: accepted
- Context: The docs are rich and specific, but sometimes you just need to explain the app to your aunt at Thanksgiving. PITCH.md serves that purpose -- a plain-English pitch that describes TripWave the way you'd describe it to a friend, not a stakeholder.
- Decision: Created docs/PITCH.md. Written in casual conversational voice, organized around common questions ("What kind of app ya buildin'?", "Why does the world need another trip app?", "What do you actually do with it?", etc.). Covers the product tour, what makes it different, monetization, acquisition, vibe, and deliberate non-features. Committed to keeping it in sync with every other doc -- whenever a meaningful decision is made elsewhere, PITCH.md gets updated too. If the pitch falls out of date, the product has drifted from what we meant to build.
- Why: Founder-level clarity is worth more than a stack of stakeholder docs. If the dev can't explain TripWave to a friend in 30 seconds, the product is off. PITCH.md is the gut-check doc.
- Follow-up: Every DECISIONS.md / UX_SPEC.md / MONETIZATION.md / DESIGN_SYSTEM.md change should trigger a PITCH.md review. If the new decision changes the pitch, update the pitch. If the new decision doesn't change the pitch, that's fine too -- but check every time.

### 2026-04-17 - Packing uses satisfying check animation plus staged reveal

- Status: accepted (tab structure already locked in section 8; this adds fun + palette)
- Context: Packing is a checklist, which is inherently repetitive. Users want either deep dopamine hits per check or visual relief that the list is shrinking -- ideally both.
- Decision: Neon-on-dark tab strip (My / Group / Suggestions). Custom neon-cyan checkbox. On check: glow burst (600ms fade), particle burst (6-8 tiny cyan dots), strike-through, optional haptic on mobile. Checked items collapse into a "Packed (X)" section at the bottom of their category group -- working list shrinks as packing progresses. Sound off by default with an opt-in setting. Claim-for-group uses a small ball-bounce. Complete-category triggers green header glow with "All packed ♥". All-category-complete easter egg: category icon spins and trip ball in nav wave-pulses once. No weight tracking, no streak gamification, no critical-item flagging in v1.
- Why: Satisfying animation provides per-check dopamine. Staged reveal provides visual relief as the list shortens -- together they make checklist work feel rewarding instead of tedious. Sound off by default respects users who use the app in quiet contexts. Easter egg creates a cross-component "the ball cares about your progress" moment.
- Follow-up: Custom checkbox component, particle-burst animation, packed-section collapse logic. Full spec in docs/UX_SPEC.md section 37.

### 2026-04-17 - Itinerary uses day-personality theming plus live "you are here" marker

- Status: accepted (structural day-scroll + card anatomy locked earlier; this adds fun + palette + personality)
- Context: Itinerary is long-form. Many days × many events risks feeling like a spreadsheet. Each day has a different character (travel day, beach day, food day) and the UI should telegraph that.
- Decision: Apply neon-on-dark treatment. Day header cards take on a personality color based on their dominant event category (flights = neon pink, restaurants = yellow, outdoor = cyan, expense-heavy = green, low-content = neutral dark, multi-category = subtle gradient). Sticky day jumper pills take the day's personality color when selected. During in-progress trips, a live neon-orange "you are here" marker moves through the current day above the next upcoming event with a "next up in X min" label. Between-day separators use dashed cyan with a sleeping-moon icon at midnight. Empty-day placeholder has a hammock-ball illustration with warm "some days need space" copy. Triple-tap day header easter egg bubble-ups events in sequence.
- Why: Day-personality theming gives each day its own visual moment without asking users to customize anything. Live marker is genuinely helpful mid-trip, not just decorative. Neutral days stay neutral so overbooked days don't all look the same. Gantt charts and analytics pie charts deferred -- they serve a small power-user slice and add complexity.
- Follow-up: Implement personality-color detection logic (dominant category per day), live "you are here" timing logic, sleeping-moon separator. Full spec in docs/UX_SPEC.md section 36.

### 2026-04-17 - Preplanning hub uses ball-centric layout plus conversational section headlines

- Status: accepted (structural hub layout already locked in section 4; this adds fun + palette + conversational copy)
- Context: Preplanning is the biggest single feature by time-on-task. Clean grids feel like homework. Gamified badges feel like productivity apps tricking users. The challenge is making long-form data entry feel human.
- Decision: Ball-centric hub with real-time fill at the top (~180px, glowing in trip color, X% planned label, "Each section fills a little more of your ball" tagline). 8 section cards in a grid with 4 states (empty / in progress / complete / not applicable) each with distinct glow treatment. Conversational headlines on each card ("Who's coming with you?" instead of "Group composition"). Completion feedback: green glow pulse on card + upward-wave ball fill + single warm toast. "Mark this trip as ready to go" CTA appears at 90%. 100% state shows "Look at you. Ready to roll." Double-tap ball easter egg shows translucent cross-section by section. Warm empty-state copy rotation. No badges, no sound effects, no confetti cannon, no time estimates, no scolding language.
- Why: Ball-as-progress is the core metaphor -- showing it fill in real time IS the reward. Conversational headlines make the work feel like a friend asking, not a tax form. Ball animations on completion provide visceral feedback without gamification. No badges preserves the warm supporter brand tone.
- Follow-up: Update /app/trips/[id]/preplanning route with new treatment, conversational copy, ball fill animation, section state styling. Full spec in docs/UX_SPEC.md section 35.

### 2026-04-17 - Trip creation fun treatment is calm elegance plus conversational warmth

- Status: accepted (structural 4-step layout already locked in section 3; this adds fun + palette + new Step 0)
- Context: Users create many trips over time (real trips, dream trips, multiple trips per year). Peak-moment UX needs to feel delightful on first use but not exhausting on repeat use. A dedicated Step 0 for trip type (Real vs Dream) was also needed for Dream Mode.
- Decision: Calm-elegance-plus-conversational-warmth treatment. New Step 0 asks Real vs Dream with two side-by-side ball-preview cards and auto-advance on selection. Step 1 name step has a cyan ball that pulses in typing cadence and nods on submit. Step 2 dates has sassy no-pressure copy and equally-weighted skip. Step 3 color pick has 5 neon swatches that fill the ball with rising-liquid animation. Step 4 reveal is a full-hero ball with chosen color, "Meet [Trip Name]" greeting, single CTA. Background shifts hue subtly per step. Ball is mascot through the flow. Errors trigger ball sad-shake. No progress bar, no big-fireworks reveal, no skip-all shortcut.
- Why: Calm elegance scales with repeat creation. Exuberant would exhaust users creating their 15th dream. Ball-as-co-pilot maintains character across the ritual. No-pressure dates honor the vague-intent trip creation. Color fill is the visceral emotional payoff. Meet-greeting celebrates commitment without fireworks overkill.
- Follow-up: Update /app/trips/new route with new Step 0, neon-on-dark treatment, ball reactivity. Full spec in docs/UX_SPEC.md section 34.

### 2026-04-17 - Dashboard gets neon-on-dark treatment plus three layers of fun

- Status: accepted (structural layout already locked in section 2 of UX_SPEC; this adds fun + palette treatment)
- Context: Dashboard is the daily home. Static card grids are forgettable. Returning users need small rewarding moments without dashboard clutter or gamification.
- Decision: Three layers on top of the existing structure. (1) Time-of-day greeting at the top with localized variants (morning / afternoon / evening / late night) in neon cyan Fredoka. (2) Living trip cards where each ball wave-pulses on staggered rhythm, left accent stripe glows, within-7-days countdown flips to neon pink for urgency. (3) Rotating stats flex card between trip list and action center showing daily-refresh reflections ("47 days of adventure planned", "$2,340 tracked", "3 dream trips in your head") in matching neon colors, dismissible. Subtle ambient background gradient drift. Greeting triple-tap easter egg cycles to localized joke variants.
- Why: Time-of-day greeting feels personal without being fake-personalized. Living cards reward daily return. Stats flex gives dopamine without gamification. Ambient motion adds life without distraction. Easter egg rewards curiosity. All three layers respect users who just want to get in and out.
- Follow-up: Update /app route to neon-on-dark treatment and add greeting + stats + easter egg. Ambient gradient may need performance tuning. Full spec in docs/UX_SPEC.md section 33.

### 2026-04-17 - Login page is minimal with restrained fun and consistent pattern with signup

- Status: accepted
- Context: Login is an interruption. Returning users want in quickly, not to be sold to again. A flashy login page wastes their time. But a completely generic login also misses the brand voice.
- Decision: Neon-on-dark login page with a passive ball above the form (hover wobble + triple-tap easter egg only -- no reactive-to-typing behavior since there's no name field). "Welcome back." / "Your trips are waiting." Copy. Submit button "Log in". Tiny solo-dev footer "Still just me. Still free forever. ♥". Wrong password triggers ball sad-shake and warm "Not quite. Try again." No Remember-me checkbox (remember by default), no social auth, no magic link, no countdown teasers.
- Why: Consistent pattern with signup (same ball placement, same footer, same easter egg) means users learn the visual language once. Restrained fun respects returning-user time. Privacy-sharing concerns on shared devices rule out pre-auth trip previews.
- Follow-up: Update /login route to new neon-on-dark treatment, ball placement, and copy. Full spec in docs/UX_SPEC.md section 32.

### 2026-04-17 - Signup page uses ball greeting plus warm dev note plus celebratory submit

- Status: accepted
- Context: Signup is the commit moment where a visitor becomes a user. Clean minimal forms convert but feel cold. Multi-step signups increase abandonment. The goal is a single-step signup that introduces the ball as a character and delivers the supporter brand warmth in under 30 seconds.
- Decision: Single-page signup on neon-on-dark. Above the card: an empty dashed ball hovers and reacts to form focus (wobble, rotate away for password, spin during loading, celebration burst on success). Warm italic dev note above first input: "Built by one person. Promise I'm not a corporation trying to harvest your emails. ♥ -- Chris". Form fields: Name, Email, Password with friendly placeholders. Submit button labeled "Let's go" with neon cyan glow. Post-submit: rainbow confetti burst from the ball, welcome toast "Welcome aboard. Let's plan a trip. ♥", fade to /app. No social auth in v1, no newsletter opt-in, no multi-step wizard, no aggressive password strength meter.
- Why: Ball reactivity introduces the brand character immediately. Solo-dev note defuses "another SaaS" cynicism. Single-step preserves conversion rate. Celebration moment makes completion feel like a win. Social auth deferred to manage OAuth scope for solo dev.
- Follow-up: Update existing /signup route to new neon-on-dark treatment + ball reactivity + dev note + celebration. Full spec in docs/UX_SPEC.md section 31.

### 2026-04-17 - Landing page is interactive and fun with three layers of delight

- Status: accepted
- Context: Landing page is the first impression. Static designs read as professional but forgettable. Interactivity and personality on the landing page are the difference between 2% and 6% signup conversion for indie SaaS.
- Decision: Three layers of fun on the landing page. Layer 1: interactive hero ball responds to hover/tap/drag/hold -- wobbles, rolls, fills on demand. Layer 2: scroll-driven ball storytelling where the ball docks into the corner and reacts to each section (shaking at chaos stats, orbiting feature cards with phase colors, filling in sequence during the ball showcase). Layer 3: three easter eggs (triple-tap sunglasses, double-click slogan wave, triple-scroll-bottom confetti balls). Full neon-on-dark treatment with pure white text and rainbow ball orbit backgrounds. No popups, no fake social proof, no countdown timers, no pricing shown.
- Why: Trip ball is the brand character -- it must move and play in its own marketing. Interactive layer lifts conversion materially over passive designs. Scroll storytelling rewards engagement. Easter eggs reward playful curiosity. Three-layer approach means every visitor finds some delight regardless of how much they explore.
- Follow-up: Rebuild the current landing page sections with the new neon palette and interactivity layers. ~15-25 hours solo-dev estimate. Full spec in docs/UX_SPEC.md section 30.

### 2026-04-17 - Review strategy uses native API at post-moment happiness triggers

- Status: accepted
- Context: App Store rankings are heavily influenced by star rating and review count, but reviews do not arrive without being asked. Wrong asking -- interrupting mid-task or faking a native prompt -- backfires.
- Decision: Fire the native iOS SKStoreReviewController / Android in-app review API at peak-emotion moments only: after Memory recap opens for the first time, after ball hits 100% preplanning, after premium purchase, after a successful multi-member invite. Cap at 3 prompts per year per user (Apple limit). Never twice on the same trip. 90-day cooldown after dismissal. Priming toast fires 3 seconds before the native prompt with warm solo-dev voice: "Your trip is wrapped. If you loved TripWave, an App Store review means the world. ♥" Respond personally to every review in year 1 within 72 hours. Never "did you like it?" pre-prompts, never incentivized reviews, never email asks.
- Why: Post-moment happiness triggers convert 3-5x better than generic time-based prompts. Priming toast sets the emotional frame. Personal responses to reviews improve rankings and signal a real person cares. Forbidden patterns (pre-prompts, incentives, email asks) either damage the brand or violate platform rules.
- Follow-up: Implement native review API integration in native app phase. Full spec in docs/MONETIZATION.md section 23.

### 2026-04-17 - ASO leans hard into ocean-wave brand and "same wave" slogan

- Status: accepted
- Context: On mobile the App Store drives 80%+ of organic discovery. A solo dev without ad budget needs ASO to do heavy lifting. The ocean-ripple logo and "Get everyone on the same wave" slogan are the strongest brand signatures TripWave has.
- Decision: App name "TripWave: Group Trip Planner". Subtitle is the slogan verbatim: "Get everyone on the same wave." (exactly 30 chars, fits iOS limit). 8 story-arc screenshots: pain-point hook → slogan reveal with ripple visual → dashboard → ball showcase → itinerary → expenses → dream mode → supporter close. Screenshots use brand colors and ocean-wave motifs consistently. Category Travel primary + Productivity secondary. Keywords field targets "group travel, trip planner, vacation, itinerary, expense split, packing list, travel together, family trip". App icon is the static trip ball with no text. Developer name reinforces solo-dev story (personal name or "TripWave"). Long description opens with the problem hook, closes with the solo-dev supporter framing.
- Why: Story-arc screenshots stand out against competitor apps that show plain product shots. Slogan-first subtitle attracts the right user (group organizers tired of chaos), not any user. Category Travel matches search intent. Solo-dev developer name doubles down on the supporter brand.
- Follow-up: Screenshot asset design is a work item (pre-launch). Seasonal A/B testing of subtitle starts after launch. Full spec in docs/MONETIZATION.md section 22.

### 2026-04-17 - Logo animation is ocean-feel ripple, not electronic

- Status: accepted
- Context: The logo is the brand signature most users see first. "Ocean, not electronic" is the core vibe call. The earlier implementation used generic ripple CSS; specifics needed to be written down.
- Decision: Logo is a filled cyan circle with 2 staggered concentric ripple rings. Each ripple scales 1.0x to 3.0x while fading opacity 0.5 to 0 over 2.2 seconds. Rings staggered by 0.8-1.1 seconds with optional ±0.1s natural-rhythm variation. Easing is ease-out (water dissipating, not mechanical linear). Color inherits from core. No glow, no bloom, no bounce. `prefers-reduced-motion` slows to 1 ring per 4 seconds. Static version used for App Store icon, favicon, and print.
- Why: Ocean feel is slow, soft, organic. Electronic feel is fast, hard-edged, metronome-rhythmed. The distinction is the single strongest brand differentiator from generic tech-product logo animations. Matches the "Get everyone on the same wave" tagline at a motion level.
- Follow-up: Full animation spec in docs/DESIGN_SYSTEM.md under Logo -- Ocean-Ripple Animation.

### 2026-04-17 - Family plan SKU specced for Tier 2 contingency deployment

- Status: accepted (deferred build -- do not implement until Tier 2 contingency triggers)
- Context: Family plan is already named as a Tier 2 contingency lever for year 2+ if sales are 25-40% behind target. Specifics committed now so the SKU can be deployed without design-in-panic later.
- Decision: TripWave Family Supporter at $14.99 one-time (web) / equivalent platform tier on mobile. Covers 1 primary purchaser + up to 3 additional household members = 4 accounts, each getting full premium independently. Primary adds secondaries manually by entering their TripWave account email. Secondaries can self-leave at any time (reverting to free) but primary cannot kick them. Vacated slots do not re-open for 12 months to prevent rotating-scheme abuse. Refund to primary reverts all 4 accounts. Launches only at Tier 2 contingency, not at day one, to preserve the clean $7.99 launch pricing story.
- Why: 4 is the standard household size (larger invites abuse). Full premium for all accounts is the simplest UX. Self-leave respects autonomy while primary-kick creates ugly family dynamics. Self-leave slot cooldown of 12 months prevents rotating abuse. Economics are accretive: covers families who would not have bought 4 individual premiums.
- Follow-up: Build only on Tier 2 trigger. Spec ready in docs/MONETIZATION.md section 21. Backlog items updated.

### 2026-04-17 - Refund policy is 30-day no-questions-asked, warm honest framing

- Status: accepted
- Context: One-time $7.99 premium sales will occasionally trigger refund requests. A missing or vague policy risks chargebacks ($15+ fixed fees plus the refund), bad reviews, and friction. A generous policy costs little at this price point and builds trust.
- Decision: Web (Stripe) purchases get a 30-day no-questions-asked refund. Policy copy: "Not feeling it? Email me within 30 days of your purchase and I'll refund it, no questions asked. If you're past 30 days and there's a real reason, still email me -- I'll almost always refund anyway." Past 30 days, treat requests with the same generous spirit. Mobile refunds pass through Apple/Google's automatic handling. Response is a one-sentence personal email within 24 hours. Premium entitlement revoked on refund. Founders get the same policy.
- Why: Easy refunds prevent chargebacks (financial worst case). Low volume is handleable by one person. Generous policy is itself a trust and marketing signal. Abuse risk at $7.99 is negligible.
- Follow-up: If refund rate exceeds 5% of sales, treat as a product problem (onboarding, expectations, bugs), not a policy problem. Policy language lives in ToS and in the purchase sheet footer. Full spec in docs/MONETIZATION.md section 20.

### 2026-04-17 - Pre-launch audience built via build-in-public + waitlist + one niche community

- Status: accepted
- Context: Launch day at zero audience means zero sales. Founder's pricing requires a priming audience. A solo dev with no budget must invest time in pre-launch audience building or the 50k target is unreachable.
- Decision: Three-channel pre-launch strategy starting 6 months before launch. (1) Build in public on ONE platform (TikTok or Threads) with 2-3 honest posts per week about product progress. (2) Email waitlist captured via a landing page with the solo-dev framing; one weekly update email during build period; landing page dropped on Product Hunt upcoming, Indie Hackers, and Reddit posts where the dev has genuinely participated first. (3) Deep participation in ONE niche travel community (r/solotravel, r/digitalnomad, or equivalent) for 6+ months before any self-promotion, with 50+ contributions of value to earn social capital before launching. Total time cost: ~6-7 hours/week. No paid ads, no influencers, no multi-community spam, no press outreach pre-launch.
- Why: All three channels cost only time, not money. They compound: each reinforces the others. Single-channel strategies are fragile (algorithm changes, community turns). Multi-community spam burns audiences. Pre-launch work is the difference between founder's selling out in 3-8 weeks vs 6-18 months.
- Follow-up: Landing-page mockup for waitlist capture, selection of target niche community, choice between TikTok vs Threads for build-in-public all TBD. Full spec in docs/MONETIZATION.md section 19.

### 2026-04-17 - Premium reframed as supporter thank-you, not feature unlock

- Status: accepted (supersedes earlier transactional-value framing)
- Context: Standard "upgrade to unlock powerful features" framing positions TripWave as corporate software extracting value. That's wrong for a solo-dev app. Users who would never pay a corporation $7.99 will happily pay a creator they like.
- Decision: All premium copy is reframed around supporting the app. Premium is how users say thanks to the solo dev for building a thing they like. In return they get no ads plus fun bonus features as thank-you gifts. Copy examples: "Sorry about the ads. Running apps like this costs money and I'm one person." / "Premium is how you say thanks -- no more ads, plus some bonus features as a gift." / "$7.99, once, forever. No subscriptions, no guilt, no corporate anything. Just me and you. ♥" Forbidden phrases: "unlock powerful tools", "upgrade to premium", "you'll love what you get", "save the trip", any scarcity language, any implied deficiency. The ♥ glyph is the brand signature on premium surfaces.
- Why: Emotional purchases (affection, gratitude, support) convert better than rational feature-comparison purchases. Reframes ads from "intrusive" to "understandable" once users know the why. Differentiates TripWave from corporate pricing language in a crowded category.
- Follow-up: Applies to pricing page, premium purchase sheet, all inline lock cards (renamed to "support cards"), moment cards, and the "How we earn" affiliate disclosure. Full spec in docs/MONETIZATION.md section 5 and docs/UX_SPEC.md section 22.

### 2026-04-17 - Dream Mode slimmed down and Reality Check dropped

- Status: accepted (supersedes earlier full Dream Mode scope)
- Context: Honest review showed most "Dream Mode exclusive features" could live on regular trips without a separate mode. Reality Check was a thin shortcut on top of the Find-flights / Find-hotels tools users already have access to, and charging for it felt petty under the supporter framing.
- Decision: Slim Dream Mode to its three real differentiators: public shareable read-only link, social reactions/comments from any authenticated viewer, distinct sparkle-ball visual. Drop Reality Check entirely. Vibe themes all ship free. Free users get 1 dream slot, premium supporters get unlimited. Private-dream toggle is the only other premium bonus. Hold the supporter framing throughout -- premium bonuses are thank-you gifts, not withheld value.
- Why: Slim version captures all the viral and retention benefits with dramatically less dev work. Reality Check was redundant with existing tools. Gating aesthetic cosmetics (themes) violates the "free is genuinely useful" principle and feels petty under the supporter framing.
- Follow-up: Remove Reality Check items from the backlog. Full slim spec in docs/UX_SPEC.md section 30 and docs/MONETIZATION.md section 14.

### 2026-04-17 - Regional pricing uses USD on web plus platform-native tiers on mobile

- Status: accepted
- Context: $7.99 USD is impulse-priced in the US but a day's food budget in India or parts of Latin America. Single global USD pricing would lock out emerging markets; manual PPP-adjusted web pricing is accountant-level work for a solo dev.
- Decision: Web Stripe checkout uses $7.99 USD globally. iOS and Android use Apple/Google platform price tiers (Tier 8 equivalent, ~$7.99 in US, ~₹199 in India, ~R$14 in Brazil, ~$2.99-4.99 in SEA). Founder's tier maps to platform Tier 5 on mobile. Family plan ($14.99 USD web, equivalent mobile tier) stays globally uniform without regional variants. No discount codes, no currency-symbol switching on the marketing site.
- Why: Apple, Google, and Stripe Tax already handle currency, tax, and regulatory complexity per country. A solo dev does not need to reinvent that. Web buyers skew wealthier and single USD pricing is honest for them. Mobile buyers span every tier and get pricing native to their market.
- Follow-up: Configure platform price tiers and Stripe Tax at launch. Full spec in docs/MONETIZATION.md section 18.

### 2026-04-17 - Ad revenue planned on dual-track realistic projection

- Status: accepted
- Context: Earlier ad revenue projection of $200-400k assumed near-ideal conditions (full fill rate, US eCPM, high session frequency). Real-world factors -- ad blockers, iOS ATT, international mix, vacation-app session frequency, premium pool removal -- combine to roughly 0.38x the original number.
- Decision: Plan ad revenue at the realistic range ($76-152k over 5 years, midpoint ~$100k). Build the ad infrastructure specced (banner + native cards + suppression zones) but do not over-invest in ad optimization early. Celebrate surplus if the actual number exceeds realistic. Revised full 5-year revenue model: ~$280k premium + ~$100k ads + ~$500k affiliate gross = ~$730k combined.
- Why: Optimistic planning sets expectations that will disappoint and invites over-engineering ad tech for revenue that may not materialize. Defensive "ads cover infra only" planning is too pessimistic and under-invests in a legitimate revenue stream. Dual-track lets us build appropriately while surplus is treated as bonus.
- Follow-up: Monitor actual ad CPM and fill rate once live. Prioritize affiliate tools development over ad optimization since affiliate is the larger lever. Full spec in docs/MONETIZATION.md section 17.

### 2026-04-17 - Tiered contingency plan for behind-target years, solo-dev safe

- Status: accepted
- Context: TripWave is built by one person with no startup capital. A behind-target year could trigger panicked decisions (launch paid ads, flip to subscription, drop premium price) that damage the model. Committing to a tiered response plan in advance prevents emotional pivots.
- Decision: Three tiers tied to how far behind target we are. Tier 1 (10-25% behind): iterate on product and organic content, no money spent. Tier 2 (25-40% behind): editorial email pitching, family plan SKU at $14.99, curated public Dream Mode content as SEO bait -- all zero-cost. Tier 3 (40%+ behind): raise price to $9.99 for new buyers (grandfathered exceptions), tighten free tier to 3 slots, add rewarded video ads for bonus slots. Explicitly reject (even in Tier 3): subscription pivots, ad interstitials, free premium trials, paid featuring, venture-scale paid acquisition, and B2B corporate pivots.
- Why: Safe-and-realistic levers chosen before pressure hits prevents knee-jerk decisions later. Every lever is either zero-cost or product-side. No response depends on money, a team, or partnerships the solo dev cannot execute. Preserves the "one-time, no subscriptions" brand moat through every tier.
- Follow-up: Family plan SKU implementation, rewarded ad integration, and editorial pitching list are work items in the backlog. Full spec in docs/MONETIZATION.md section 16.

### 2026-04-17 - Conversion rate baseline set at 3-4% for 50k-sale planning

- Status: accepted
- Context: The 50k-sales-in-5-years target requires a concrete conversion assumption to determine how many users must be acquired. Without a baseline, marketing, retention, and viral loops cannot be tuned to scale.
- Decision: Plan for 3-4% premium conversion among cumulative users. Blended target of 1.4M cumulative users over 5 years (3% needs 1.67M; 4% needs 1.25M). Yearly ramp expected as 30k / 130k / 300k / 450k / 490k. First 1,000 sales is the reality-check cohort -- observed conversion rate replaces this assumption for years 2-5. If observed rate is below 2.5% at the 1,000-sale mark, revise the plan (raise price to $9.99, tighten free slot count, or add premium features) rather than "market harder."
- Why: 3-4% is the honest range for one-time impulse unlocks with genuinely useful free tiers. 8-10% would require mission-critical premium features TripWave does not have. 1-2% is defensive pessimism that forces expensive volume marketing. 3-4% respects the product while being ambitious enough to force real engineering on retention and virality.
- Follow-up: Track the 6 core metrics during the founder's cohort (observed conversion, time-to-upgrade, organizer vs invitee conversion, feature attribution, dream share rate, affiliate CTR). Full spec in docs/MONETIZATION.md section 15.

### 2026-04-17 - Retention uses Memory-as-artifact plus anniversary nudges plus seasonal prompts plus Dream Mode

- Status: accepted
- Context: Vacation planning is not a daily app. Users disappear for 6-18 months between real trips. Without an active retention strategy, every cohort is a one-shot and the 50k premium sales target is unreachable.
- Decision: Four-layer retention. (1) Memory page persists as a revisitable artifact and shareable public recap link. (2) Annual anniversary nudge once per completed trip, on the trip's start-date anniversary, with a warm nostalgic message and soft "plan another" CTA. (3) Seasonal planning prompts twice a year (Feb and Sept) for users with no active trip, dismissible with 90-day snooze. (4) Dream Mode -- a full new feature for aspirational trip planning with sparkle-themed balls, mood boards, celebrity invitees, vibe themes, public share links, reactions, and a Save-to-my-dreams social loop. Dream trips sit in their own slot pool (1 free, unlimited premium), never confuse with real trips.
- Why: Layered retention compounds. Memory is passive re-engagement. Anniversaries tap nostalgia (the strongest travel emotion). Seasonal prompts tap intent at booking peaks. Dream Mode solves the between-trips quiet months by giving users a fun creative reason to open the app, while its social share mechanics drive viral acquisition in one feature.
- Follow-up: Dream Mode is a sizeable new feature scope. Individual dream UX details (mood board grid, celebrity invitee UX, vibe theme catalog, Reality Check flow) need further speccing. Full spec in docs/MONETIZATION.md section 13-14 and docs/UX_SPEC.md section 30.

### 2026-04-17 - Affiliate revenue added as third stream via hybrid contextual plus search-tool model

- Status: accepted
- Context: Premium at $7.99 plus banner ads alone caps 5-year net revenue around $280k. Travel apps naturally sit next to booking decisions. Affiliate commissions (hotels, flights, rentals, tours, insurance) offered a real third revenue stream if done without compromising trust.
- Decision: Hybrid affiliate model. Organic contextual chips during preplanning (Accommodations / Transportation fields, Wishlist activity ideas, Vault insurance empty state) appear as small optional "↗" links. Dedicated Find-flights / Find-hotels / Find-rentals / Find-tours tools in the Tools hub available to all users regardless of tier. Every affiliate surface includes a "How we earn" disclosure. Affiliate is never counted as ad inventory, never gated behind premium, never passed user data beyond search queries. Solo dev authorship surfaces in three specific places: the "How we earn" disclosure, the premium purchase sheet footer, and the Account About section -- each with a single ♥ glyph and warm honest copy. Never on landing page, never in feeds, never repeated.
- Why: Affiliate scales with trip planning activity instead of premium conversion. Projected conservative net ~$505k over the 5-year horizon -- nearly 2x premium revenue. Organic placements capture users who already decided; search tools capture users still comparing. Solo dev moments are contextual, not guilt-trip.
- Follow-up: Select initial affiliate partners (Booking.com + Skyscanner are lowest-friction starts). Decide whether Find-flights / Find-hotels tools ship for v1 or after the first 1,000 founder sales. Full spec in docs/MONETIZATION.md section 12.

### 2026-04-17 - Launch uses private beta plus founder's pricing for first 1,000 sales

- Status: accepted
- Context: The first 1,000 paying users are the hardest to win with no reviews, no press, no momentum. Early pricing moves compound across 5 years and shape the trajectory to 50k.
- Decision: Three-phase launch. Phase 1: private beta of 50-150 users receives permanent free premium in exchange for feedback and reviews. Phase 2: founder's pricing of $4.99 one-time for the first 1,000 public sales, grandfathered forever, with a live "spots remaining" counter on the marketing site and a permanent Founder badge on founders' accounts. Phase 3: standard $7.99 one-time pricing indefinitely thereafter.
- Why: Beta feedback and evangelism cost nothing. Quantity-based founder scarcity ("823 left") outperforms time-based scarcity and creates a press-worthy launch moment. Price jump from $4.99 to $7.99 is natural PR. Foregone revenue from the discount (~$2,100 of the 5-year total) is trivial compared to launch momentum. Avoids free trials, which would erode the "one-time, no subscription" positioning.
- Follow-up: Beta recruiting channel, Product Hunt launch timing, and founder badge visual treatment TBD. Full spec in docs/MONETIZATION.md section 11.

### 2026-04-17 - Viral loop uses soft cross-promote plus slot rewards

- Status: accepted
- Context: Hitting 50k lifetime premium sales requires acquiring hundreds of thousands to over a million free users. Paid ads cannot economically deliver that at a $7.99 price point. The built-in trip invite mechanic is the biggest free acquisition lever we have.
- Decision: Passive invite status quo is abandoned. Instead: (1) invitees see a soft "start your own trip free" cross-promote banner in their first trip session, plus a single post-trip nudge after their trip completes. (2) When an invitee starts their own trip, the original organizer earns a bonus free slot (growing from 4 to a max of 7 via referrals). The loop repeats as new organizers invite travelers who in turn may start their own trips.
- Why: Slot rewards cost effectively nothing (free users stay free) while tapping the real constraint users feel first. Avoids discounting premium, which would cheapen the $7.99 positioning. Avoids coercive "invite friends to unlock" gating that would violate the "free is genuinely useful" principle. Viral tail adds ~2.6 downstream organizers per initial one.
- Follow-up: Slot-reward cap (currently 3 bonus slots / 7 total) may need tuning based on actual referral conversion data. Full spec in docs/MONETIZATION.md section 10.

### 2026-04-17 - Premium price raised from $5 to $7.99 one-time

- Status: accepted (supersedes 2026-04-15 decision of $5 one-time)
- Context: Target is 50,000 lifetime premium sales within 5 years. At $5 and Apple's 30% cut, that caps lifetime net at ~$175k. Market research shows conversion rate is near-identical between $5 and $9 for impulse-buy pricing, meaning per-sale revenue is the cheapest lever to pull.
- Decision: Raise the premium unlock to $7.99 one-time. Keep the "one-time, no subscription, no guilt" positioning. Update every marketing, in-app, and doc reference from $5 to $7.99.
- Why: $7.99 is still sub-$10 psychological territory and reads as a cheap one-time unlock. Apple-net per sale goes from $3.50 to $5.59, a 60% lift for identical acquisition cost. 50k sales now nets ~$279k instead of $175k -- a meaningful margin boost without a meaningful drag on conversion.
- Follow-up: Monitor actual conversion rate vs the $5 baseline assumption once purchase data exists. Revisit after the first 1,000 sales.

### 2026-04-17 - Trip ball click opens health breakdown modal

- Status: accepted
- Context: The trip ball is the core visual identity and appears on many screens. We needed a consistent interaction for when a user clicks or taps it inside the trip workspace.
- Decision: Clicking the ball opens a modal showing the fill breakdown by preplanning category, the current next best action, blockers if any, and a color picker for the ball.
- Why: Keeps users in context (modal, not navigation), teaches the mental model that preplanning fills the ball, works identically on desktop and mobile, avoids designing another full route.
- Follow-up: Ball modal spec lives in docs/UX_SPEC.md.

### 2026-04-17 - Dashboard is a hybrid of trip list plus action center

- Status: accepted
- Context: Users planning 2 or 3 trips need to see their trips emotionally (ball, countdown, progress) but also need a cross-trip queue of things needing attention.
- Decision: Dashboard has three vertical sections -- "Next up" dark hero at top (tappable, routes to that trip's recommended phase), trip list in the middle, and "Needs your attention" action center at the bottom.
- Why: Combines emotional pull with practical utility. Single-trip smart redirect was rejected as inconsistent. Pure action center was rejected as cold.
- Follow-up: Layout spec lives in docs/UX_SPEC.md.

### 2026-04-17 - Trip creation is a 4-step playful flow

- Status: accepted
- Context: Creating a trip is the commit moment. We want the ritual to feel warm and fun rather than administrative.
- Decision: Four full-screen steps -- Name (with listening-ball animation), Dates (optional with sassy copy), Pick a Color (fills the ball for instant payoff), Reveal (ball hero moment + "Meet [name]" + CTA). Wipe transitions between steps.
- Why: Multi-step keeps each moment simple and focused. Color pick makes the trip feel personal before any work is done. Dates are optional to respect vague-intent trips like "summer 2026". The reveal step celebrates the commitment.
- Follow-up: Full creation flow spec lives in docs/UX_SPEC.md.

### 2026-04-17 - Preplanning uses a section picker hub

- Status: accepted
- Context: Preplanning has 8 sections and dozens of fields. We had to decide how the user navigates through them all.
- Decision: A section picker hub. The hub shows 8 cards (one per section) with colored icons, progress indicators, and status badges. The user picks sections in any order. Each card opens a focused editor page for that section. Not-applicable sections can be marked as such and are excluded from the ball fill denominator.
- Why: Preplanning data rarely comes in a natural order. Linear wizards get abandoned when users hit fields they cannot answer. The hub shows overall progress at a glance. Each section as a focused editor keeps cognitive load low. Matches the ball mental model (each section fills a piece).
- Follow-up: Individual section editor layouts still TBD. Full hub spec in docs/UX_SPEC.md.

### 2026-04-17 - Preplanning section editor is a single scrollable form

- Status: accepted
- Context: Each preplanning section has 3 to 20+ fields and some have conditional fields based on primary choices (e.g., flight details only appear if transport mode is "flying").
- Decision: Each section opens as a single long scrollable form with all fields visible. Conditional fields animate in and out as relevant. Sticky footer offers "Save and return to hub" plus "Save and continue to [next section]". A "Mark not applicable" toggle at the top hides the section from the fill denominator. All fields autosave.
- Why: User deliberately picked the section from the hub, so wizarding them again inside is redundant. Single scroll keeps focus without hiding work. Conditionals keep the form clean. Consistent pattern across all 8 sections simplifies the design.
- Follow-up: Full editor spec in docs/UX_SPEC.md.

### 2026-04-17 - Itinerary uses day-by-day vertical scroll as primary view

- Status: accepted
- Context: The itinerary holds events, reservations, activities, and notes across every trip day. We needed a primary layout that balances trip-wide overview with per-event legibility.
- Decision: Vertical scroll down through the whole trip, each day a distinct section with a colored header card and event cards stacked beneath sorted by time. Sticky day-pill jumper at the top. Quick-add FAB on mobile, persistent + button on desktop. Optional fold-out compact calendar panel on desktop.
- Why: Trips are mentally organized by days, not hours. Calendar grids kill legibility. Flat lists lose structure. Horizontal timelines and tab layouts hide trip flow. Vertical scroll scales gracefully and works identically on desktop and mobile.
- Follow-up: Individual item shape and category differentiation still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Itinerary items differentiated by left stripe and header icon

- Status: accepted
- Context: Itinerary items span several categories (activity, reservation, transport, note, expense-linked). We needed to decide how much visual differentiation to apply per category.
- Decision: All item cards share a uniform shape. Category is signaled by a 4px colored left stripe plus a matching filled icon in the header row. Expense-linked items add a small green coin badge on top of their base category treatment. Color mapping uses brand language: activity yellow, reservation cyan, transport pink, note gray.
- Why: Stripes read faster at a glance than icon-only differentiation. Per-category layouts would fragment visual rhythm. Background tints would compete with the day headers. Uniform shape preserves the cohesive feel of a day while the stripe still telegraphs type.
- Follow-up: Full anatomy spec in docs/UX_SPEC.md.

### 2026-04-17 - Packing uses three tabs for My / Group / Suggestions

- Status: accepted
- Context: Packing mixes personal items (each user's own), group items (shared responsibility), and smart suggestions (premium feature). We had to decide how to present all three without overwhelming users.
- Decision: Three tabs at the top of the Packing phase. Default tab is "My list". Second tab "Group list" shows items with traveler assignment. Third tab "Suggestions" is premium-gated -- free users see a preview with an upgrade card. New items default to private. Privacy toggle lives in each item's three-dot menu.
- Why: Users want a personal-first view without group items leaking in. Group packing is a separate conversation. Premium suggestions get their own tab so the free-tier upgrade prompt has room to breathe. Tabs scale identically across mobile and desktop.
- Follow-up: Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Travel Day uses auto-route plus focus mode on the day of

- Status: accepted
- Context: Travel Day is a core differentiator. Outside of the actual travel day it is a normal planning phase, but on the day itself the app should reorder itself to execute the travel plan.
- Decision: Hybrid behavior. Far from the travel day, Travel Day is a normal editable phase. T-minus 24h adds a pulse dot on the sidebar tab. T-minus 6h triggers auto-route-on-open plus focus mode: sidebar collapses to icons, top bar becomes a minimal status strip, main view becomes a single-task-at-a-time execution checklist with giant tap targets and a live "you are here" marker. Focus mode exits automatically after arrival. Users can exit manually at any time and can manually activate focus mode outside the auto window.
- Why: Planning weeks before travel should feel calm and flexible. The actual travel day needs focus and stress reduction. Full app takeover would be patronizing and hide useful info. A banner alone does not reorder UI as required.
- Follow-up: Execution-mode checklist visual details, "leave in X minutes" guidance, and segment transitions to be specced later. Full mode spec in docs/UX_SPEC.md.

### 2026-04-17 - Vacation Day uses a single "Today" feed with morning briefing

- Status: accepted
- Context: During an in-progress trip, users need daily coordination rather than full planning. The docs specify priorities in the order: today's schedule, next meetup, active reservations, quick add, group activity, today's expenses.
- Decision: Vacation Day is a single-page scroll feed. Top: warm morning briefing card that updates at local sunrise. Middle: today's events using the itinerary card anatomy. Activity strip: horizontal chips of recent group changes. Quick actions: add event / log expense / start poll. Bottom: peek-tomorrow link. Auto-route to Vacation Day on trip open during in-progress trip days. No focus mode.
- Why: Users on vacation are distracted and jetlagged -- linear scroll beats widget grids or swipe decks. The morning briefing is a warm daily ritual. Auto-route keeps the user in the right context without locking them out of other phases.
- Follow-up: Quick-log expense and quick-poll interaction details TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Expenses uses a balances-first primary view

- Status: accepted
- Context: Expenses is a dense feature with ledger, splits, settlement, budget, receipt scanning, and currency conversion. We needed the primary view to answer the question users care about most.
- Decision: Balances hero card at the top showing the user's personal net and per-person breakdown with Mark settled and Mark paid buttons. Trip total strip below. Ledger filtered by chips (All / Yours / By category / By day). FAB for Add expense plus a premium-gated Scan receipt action.
- Why: The #1 user question is "do I owe / is anyone owed" not "what did we spend on food". Balances-first answers that question immediately and doubles as social pressure to settle. Ledger-only buries the answer. Tabs force users to hunt.
- Follow-up: Add-expense flow details, split interaction, and settlement state transitions still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Polls page uses active-as-big-cards plus closed-as-compact-rows

- Status: accepted
- Context: Polls live in a dedicated phase but have two clear states -- active (needs your vote, live) and closed (historical reference, possibly convertible to an itinerary item). We needed to decide how to surface both without making users hunt.
- Decision: Active polls are large cards at the top with the full voting UI inline (one-tap vote on big option pills). Closed polls are compact rows below showing the winner and a Convert-to-itinerary pill if not yet converted. Start-a-poll is a slide-up sheet / modal with an optional "quick vote" mode for in-trip snap decisions.
- Why: Visual weight follows user action -- active polls need voting, closed ones are reference. Tabs would hide active polls behind a click. Chronological feeds mix live and dead polls awkwardly.
- Follow-up: Notifications for new polls and quick-vote UI detail in later passes. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Wishlist uses hot-section plus explicit promote actions

- Status: accepted
- Context: Wishlists tend to accumulate noise if the path from idea to reality is obscured. We needed to surface the best ideas and make promotion to the itinerary friction-free.
- Decision: Top section shows "The group is into" (most-liked ideas, horizontally scrollable cards). Below, a full vertical list of idea cards, each with Like and Add-to-itinerary buttons. Promoting an idea removes it from the wishlist with an Undo toast. Restricted mode hides the Add-idea button for non-organizers when the organizer disables participant adds.
- Why: Wishlists die when ideas get buried. Hot section doubles as social proof. Explicit promote button keeps the action one tap away. Categories and pinboards add unnecessary friction.
- Follow-up: Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Notes use a social feed with reactions and event link chips

- Status: accepted
- Context: Notes are shared posts used to communicate reminders, tips, and observations with the group. We had to decide between social-feed, tabbed, categorized, and bulletin layouts.
- Decision: Chronological social feed, newest first. Each note card shows author, body, optional photo / link, an event-link chip (when attached to an itinerary item), reactions row, and a reply thread preview. Filter chips: All / Mine / Event-linked / Pre-trip / On-trip / Post-trip. Replies are single-level threaded. Reactions are emoji toggles.
- Why: Notes are communication, not filing. Feed shape matches the mental model. Chronology is essential and would be lost in tabs. Categories over-organize. Bulletin boards get chaotic at volume.
- Follow-up: Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Vault uses category sections plus search plus "Needed today" strip

- Status: accepted
- Context: The Vault holds high-stress documents (passports, boarding passes, hotel confirmations). Speed of retrieval matters more than browsing pleasure.
- Decision: Sticky search bar at the top. Conditional "Needed today" strip surfaces date-relevant docs during in-progress trips. Below that, collapsible category sections (Passports, Flights, Lodging, Insurance, Reservations, Other) with thumbnail grids. Floating upload FAB on mobile, top-right button on desktop. Doc detail view opens full-screen with Download / Share (expiring link) / Mark as expired / Edit / Delete actions. Premium-gated OCR auto-extracts details on upload.
- Why: At border counters users cannot browse. Categories provide scannable shortcuts. Search is the escape hatch. "Needed today" automates the right-doc-right-moment behavior. Flat grids and traveler-scoped layouts both break down at volume or force premature organization.
- Follow-up: Sharing link expiration rules and OCR detection heuristics still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Tools hub uses phase-aware smart surfacing plus full library

- Status: accepted
- Context: Tools holds 20+ mini-features split across free and premium tiers. Each tool is most relevant at a specific phase or trip state. A static grid forces users to do the discovery work themselves.
- Decision: Top of the Tools page shows a "Useful right now" row of 3 to 5 larger cards adapted to the current phase and trip data. Below sits the full categorized library (Planning / Destination / On the trip / Accessibility). Smart surfacing responds to phase, destination, and group composition. Premium tools show lock icons and inline paywalls on the free tier.
- Why: Users should not have to hunt for a tool when the app knows what phase they are in. Surfacing drives discovery without forcing alphabetical or search-first interaction. Full library remains available below for browsing and power users.
- Follow-up: Per-tool surface logic refinement in a later doc pass. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Memory phase uses a two-section stacked layout

- Status: accepted
- Context: Post-trip wrap-up is simultaneously emotional (celebrate the trip) and practical (settle expenses, close loose ends). The two vibes do not mix cleanly in the same UI block.
- Decision: "Your trip in review" section on top (hero card with the nostalgic ball, auto-generated stats, highlights carousel, post-trip poll, scavenger hunt, shareable recap). "Loose ends" section below (unsettled expenses, unresolved polls, pending wishlist, archive action). Ball enters nostalgic fade on Memory entry and dimmed state on archive. Shareable recap has a TripWave watermark for free users.
- Why: The app should celebrate before asking for paperwork. Tabs would hide the celebration. Slideshows force users through an intro. Splitting across phases dilutes the purpose of Memory. Two-section stack lets users linger in the recap and see to-dos without context-switching.
- Follow-up: Highlight auto-generation heuristics, share-link permissions, and export format still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Organizer invite screen uses share-card plus invited-list hybrid

- Status: accepted
- Context: The invite experience needs to handle initial sharing, permission preset selection, seeing who has joined, resending to pending invitees, and removing people. Scattering these across separate screens adds friction.
- Decision: One page. Top: share card with invite link, human-readable invite code, QR code, and quick share actions. Middle: permission preset strip to set the default role for new joiners. Bottom: invited list split into Joined (with permission badge and three-dot menu) and Pending (with Resend and Revoke). Regenerate link action in the footer invalidates old links while keeping joined users.
- Why: Single-link modals cannot handle follow-up. Contact-based flows need phone contacts access and SMS sending infrastructure that we do not have early on. List-only separates sharing from status. A single page covers the whole lifecycle.
- Follow-up: Per-user permission toggle UI (for custom overrides beyond presets) still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Invitee lands on a trip-themed branded Join page before auth

- Status: accepted
- Context: Invitees tap a link with no prior context. We had to decide whether to route straight to auth, show marketing, or warm them up with the trip itself.
- Decision: Branded Join landing page themed to the trip's ball color, showing the trip ball, name, dates, destination, organizer name, and traveler avatars. Primary CTA "Sign up and join", secondary "Log in". Only preview fields are visible before auth -- no itinerary, no expenses. Post-auth shows a welcome splash and routes to the trip overview. First-session banner prompts them to fill their traveler profile (dietary, mobility, emergency contact). Invalid links show a warm "expired" message rather than a generic error.
- Why: The invite is an emotional moment. Cold auth pages kill it. Long marketing interstitials are the wrong timing. Anonymous preview would violate the account-required rule.
- Follow-up: Traveler profile editor layout TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Mobile phase nav uses a horizontal scrollable pill bar

- Status: accepted
- Context: The trip workspace has 14+ phases. The desktop left sidebar does not work on mobile. We needed a pattern that keeps every phase reachable in one tap without buried menus.
- Decision: On mobile, a horizontal scrollable pill bar sits below the top nav, sticky during scroll. Each pill is a colored circle icon + phase name with bright-background active state and pale inactive state. Active phase auto-scrolls into view. Colored pills match the phase-color language used in the desktop sidebar and dashboard. Desktop keeps the left sidebar unchanged.
- Why: Bottom tab bars force picking a few "winner" phases that do not match all trip states. Hamburger menus hide the trip map. Dropdowns add friction. Horizontal pills show all phases, teach colors by repetition, and scale gracefully.
- Follow-up: Pill-bar scroll feel, snapping behavior, and phase-group dots implementation still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Permissions use preset-with-override hybrid member management

- Status: accepted
- Context: Organizers need fine-grained control over what each traveler can do (add items, vote, invite, etc.) without turning the settings page into a spreadsheet.
- Decision: Member list with per-user preset dropdown (Organizer / Trusted / Standard / View-only / Custom) plus a "Customize" link that expands an inline toggle panel grouped by category (Itinerary / Expenses / Polls / Social / Administrative). Transfer ownership and Remove from trip live in the member card three-dot menu with confirmation modals. Removed members leave anonymized contributions in place.
- Why: Presets cover the common case with one tap. Customize preserves fine-grained control without exposing it to every organizer. Matrix tables feel cold. Dedicated per-user pages are too heavy for simple cases. Feature-scoped controls spread the mental model across phases.
- Follow-up: Preset exact definitions and default toggle mapping still need formal lockdown. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Premium prompts use inline lock cards plus contextual moment cards

- Status: accepted
- Context: Premium is a one-time $7.99 unlock covering ad removal, offline mode, receipt scanning, currency converter, advanced smart suggestions, travel-day templates, trip export, and trip duplication. We needed a prompt style that respects free users while converting at the right moments.
- Decision: Inline lock cards as the default, replacing the feature's normal entry point (cyan-tinted card, lock icon, feature name, one-line value, Unlock button). Moment cards escalate at context-rich triggers (offline mid-trip, tapping a currency field, 5+ expenses without scan, pre-archive). Both are inline -- never modal takeovers, never persistent banners, never scarcity language. Prompt-free zones include travel-day focus mode, vacation day quick actions, the new-trip onboarding overview, and settlement actions. Purchase flow is a slide-up sheet with Stripe (web) and Apple/Google Pay (future native).
- Why: Modal takeovers are punishing and the docs forbid them. Auto-redirects disrupt flow. Persistent banners erode trust. Inline lock cards respect in-progress work, moment cards catch genuine high-intent conversion windows.
- Follow-up: Moment-card trigger logic and post-purchase celebration animation still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Free-tier ads use a persistent bottom banner plus native cards in long feeds

- Status: accepted
- Context: The free tier is ad-supported. The docs define ad-hostile zones (travel day execution, checklists, expense entry) and ad-friendly zones (dashboards, between sections). We needed a concrete placement pattern that balances impressions with UX.
- Decision: Persistent bottom banner (Cozi-style) on most pages, 50 to 60px tall, with an AdMob adaptive unit or AdSense responsive unit. Banner has an "Ad" label, a close-for-session X, and a small "Remove ads for $7.99" upsell link on the right. Native card ads inject into long content feeds (Itinerary, Notes, Expenses ledger, Polls list) at roughly positions 4, 12, 20 with clear Ad labels. Suppression zones include travel-day focus mode, vacation day briefing view, expense entry modal, trip creation flow, invite join landing, Memory hero recap, trip ball modal, and the first minute of a new user's session.
- Why: Banner delivers baseline impressions. Native cards catch attention where banner blindness sets in. Suppression protects high-stakes UX moments. The upsell hint turns every impression into a conversion opportunity.
- Follow-up: AdMob / AdSense unit IDs, ad fetch timing, and ad-block detection behavior still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Established trip overview uses one flexible layout with state-aware content

- Status: accepted
- Context: A trip lives in Planning, Ready, In-progress, and Completed states across most of its existence. The docs require state-aware workspace behavior but building entirely separate layouts per state would be a maintenance burden.
- Decision: One overview page layout with state-aware content per region. Hero strip shows the ball (state-reactive animation), trip name, dates, destination, countdown. Stats row adapts tiles to state. Primary next-action card routes to the phase that reduces the most trip risk per state. Blockers card is conditional. Recent activity feed shows group actions. Quick jump grid links to the 6 most relevant phases per state. Bottom CTA surfaces only at transitions (ready to advance at 90%, close trip when completed).
- Why: State-specific layouts would duplicate design work. Widget grids feel corporate. Minimal link pages underserve the trip home. Feed-based overviews bury the primary next action. One flexible layout is easier to build, learn, and maintain.
- Follow-up: Blocker detection logic and next-action precedence rules still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Notifications use in-app surfaces plus future push, no notification emails

- Status: accepted
- Context: TripWave has many "look at this" moments (polls, expenses, invites, travel day, settlement). We had to decide where notifications surface and which channels we support.
- Decision: In-app notifications are delivered through three surfaces -- a bell icon in the top nav opening a grouped panel (Today / This week / Earlier), real-time toasts for live events while the user is in the app, and the dashboard action center for actionable items. Push notifications added later when the native app ships, opt-in at the OS level. Email is used only for the password reset flow. No SMS. No phone number collection. No email verification on signup. No digest emails. No invite emails (invites are shared via link, code, or QR).
- Why: Reduces external dependency scope for the MVP (no email deliverability tuning, no SMS provider contract). Users do not need to hand over a phone number. Push is the right long-term channel for urgency. Email becomes noise for most users.
- Follow-up: Push notification trigger logic and native-app permission-request timing TBD. Full spec in docs/UX_SPEC.md. MONETIZATION.md, ARCHITECTURE.md, and LOGIC_FLOW.md also updated to reflect the narrower email scope.

### 2026-04-17 - Trip switcher is a top-nav dropdown with mini-balls

- Status: accepted
- Context: Users with multiple trips need to hop between workspaces without returning to the dashboard each time. The trip-name pill in TopNav is the natural switcher entry point.
- Decision: Tapping the trip pill opens a dropdown below it. Current trip shown at top grayed out for context. Other trips listed below, each with a small colored ball, name, and subtitle (countdown or dates). Tap routes to that trip's overview or recommended phase. Dropdown footer has All-trips and New-trip links. On mobile, narrow screens expand the dropdown into a full-width sheet.
- Why: Matches the industry-standard workspace-switcher pattern (Notion, Linear, Slack). Modals and side drawers are overkill. Forcing dashboard returns doubles the taps per switch.
- Follow-up: Switcher behavior on 20+ trips (long-list scrolling and search) to be refined later. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Empty states use a unified skeleton with per-feature playful variations

- Status: accepted
- Context: Empty states appear across every feature (no trips, no events, no expenses, etc.). The docs require them to act like guided onboarding rather than placeholder text.
- Decision: One shared empty-state skeleton (centered illustration at 96-120px, Fredoka headline max 8 words, Nunito gray description max 25 words, cyan pill CTA, optional collaborative chip). Per-feature illustrations and copy give each feature its own playful variation while the skeleton teaches the pattern. Illustrations use line art and flat shapes in brand colors only with circular ball-motif composition. Tone is warm and never scolding. CTAs always spell out the first action.
- Why: Consistent skeleton teaches the pattern after 2-3 encounters. Per-feature variations preserve TripWave's warm brand personality. Free-form per feature would break visual consistency. Generic placeholders would fail the guided-onboarding requirement. Separate templates for first-time vs later-empty add complexity with no clear benefit.
- Follow-up: Actual illustration assets to be designed. Animation treatments (gentle float or pulse) deferred to a later polish pass. Full copy catalog in docs/UX_SPEC.md.

### 2026-04-17 - Traveler profile uses account-level defaults with per-trip overrides

- Status: accepted
- Context: Traveler profile data (dietary restrictions, allergies, mobility needs, emergency contact) is mostly consistent across trips but occasionally needs to differ. We had to decide whether to make it account-level, per-trip, or hybrid.
- Decision: Hybrid two-tier model. Account-level profile at /app/account/profile stores defaults. Per-trip profile editor auto-pre-fills from defaults and allows overrides. Overridden fields show labels ("Synced from account" vs "Overridden for this trip"). Reset-to-account-defaults link available. Privacy defaults restrict fields to self and organizer; opt-in per field to share with the group. Emergency contact requires explicit per-trip opt-in to share.
- Why: Most users have stable info -- single entry at account level saves effort. Per-trip overrides handle edge cases like different emergency contact or dietary changes for a specific trip. Single profile misses nuance. Per-trip only frustrates repeat users.
- Follow-up: Field-by-field privacy defaults, avatar upload flow, and passport-expiry blocker integration TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Trip settings uses sub-routes with secondary sidebar on desktop

- Status: accepted
- Context: Trip settings has distinct concerns (trip info, members, invites, preferences, advanced, danger zone). A single flat page becomes overwhelming; tabs trap the user and complicate deep linking.
- Decision: Each category is its own sub-route under /app/trips/[tripId]/settings. Mobile shows a card list as the main settings page; desktop shows a secondary sidebar once inside settings. Danger zone is pink-bordered with individual confirmation flows; Delete-trip requires typing the trip name and cannot be dismissed via outside-click.
- Why: Sub-routes enable deep linking per category, focused pages per concern, clean back-button behavior, and scale as we add more settings without cluttering tabs or creating long scrolls.
- Follow-up: Trip export format, template save fields, and ball-animation-toggle details still TBD. Full spec in docs/UX_SPEC.md.

### 2026-04-17 - Brand new trip uses a dedicated onboarding overview

- Status: accepted
- Context: A freshly-created trip has no preplanning, no itinerary, no activity. Using the same overview layout as an established trip would show empty cards and zero stats, which feels broken.
- Decision: Brand new trips get a dedicated onboarding overview -- huge dashed ball, playful greeting copy referencing the trip by name, ONE primary action card (Start preplanning) and ONE secondary (Invite your crew). Overview transforms into the established-trip layout as soon as any preplanning data is added.
- Why: Intentional empty state feels like the product cares. Keeps focus on the two things that matter at day zero. Avoids filler UI.
- Follow-up: Full overview spec lives in docs/UX_SPEC.md.

### 2026-04-11 - Build web-first before mobile packaging

- Status: accepted
- Context: The product vision includes iOS, Android, and web, but the app is still in the earliest planning and foundation phase.
- Decision: Build a stable and high-quality web product in Next.js before packaging for mobile.
- Why: This keeps scope manageable, reduces cost, and lets us validate the product with one strong codebase first.
- Follow-up: Revisit mobile packaging strategy after the web experience and offline requirements are clearer.

### 2026-04-11 - Use Vercel and Neon as core infrastructure direction

- Status: accepted
- Context: Cost control and margin are explicit business goals.
- Decision: Plan around Vercel hosting and Neon database infrastructure.
- Why: Existing subscriptions reduce overhead and keep the stack familiar.
- Follow-up: Document provider-specific constraints as backend work begins.

### 2026-04-11 - Treat travel-day execution as a core differentiator

- Status: accepted
- Context: Many trip planners handle itineraries, but fewer help travelers actually move through departure day without forgetting important tasks.
- Decision: Prioritize travel-day schedule and checklist experiences as one of the app's signature features.
- Why: It is distinctive, genuinely useful, and aligned with the user's strongest product instinct.
- Follow-up: Reflect this clearly in MVP scope, IA, and landing-page messaging.

### 2026-04-11 - Establish project docs before heavy implementation

- Status: accepted
- Context: The codebase is new, and the product surface is broad.
- Decision: Create project planning, roadmap, architecture, layout, and design docs before deeper implementation work.
- Why: This should reduce rework and keep product, UX, and engineering decisions aligned.
- Follow-up: Keep the docs updated as code lands rather than letting them drift.

### 2026-04-11 - Charge the organizer rather than every participant

- Status: accepted
- Context: The product is centered around one person acting as the trip organizer and paying user, while other travelers join through invites.
- Decision: Premium access should be purchased by the organizer and apply to the trip workspace they own.
- Why: This matches the product mental model, keeps billing simple, and lowers friction for participant adoption.
- Follow-up: Revisit only if later collaboration complexity or team-style use cases justify a different model.

### 2026-04-15 - One-time $7.99 premium pricing instead of subscription

- Status: accepted
- Context: The app targets trip planners who may only use it heavily around one trip. A recurring subscription creates ongoing billing guilt and churn risk.
- Decision: Premium is a single one-time $7.99 payment per account. No monthly or annual subscription.
- Why: Low-friction for the core user, ad revenue covers operating costs, and premium revenue is additive margin. The $7.99 price point is low enough to be an impulse buy before a trip.
- Follow-up: Monitor whether a per-trip purchase option makes sense for users who want premium for one trip without committing their account.

### 2026-04-15 - Ad-supported free tier with premium ad removal

- Status: accepted
- Context: Free users need a sustainable revenue path. Ads are the most direct mechanism without gating core features.
- Decision: Both web and app versions are ad-supported for free users. Purchasing premium removes ads permanently.
- Why: Ad revenue is expected to cover Vercel and Neon infrastructure costs. Premium is pure upside. Ads should be placed in low-interruption locations (not during travel-day execution or active expense entry).
- Follow-up: Evaluate ad network options. Avoid ad placements that degrade core trip actions.

### 2026-04-15 - Expense splitting and polls are free features

- Status: accepted
- Context: Previously considered as premium candidates.
- Decision: Expense splitting, settlement, and polls are available to all users at no cost.
- Why: Fairness tools (splitting expenses) and group coordination (polls) should not be paywalled. They are core to the collaborative value proposition, and gating them would punish the use case the app is built for.
- Follow-up: Receipt scanning (the expensive part of expense workflows) remains premium.

### 2026-04-15 - Account required for all app features

- Status: accepted
- Context: Lightweight anonymous joining was previously under consideration.
- Decision: Users must have an account to access any app feature. Non-authenticated users can only see marketing pages, login, signup, legal, and contact.
- Why: Keeps data integrity clean, simplifies permission and collaboration modeling, and avoids anonymous editing chaos from day one.
- Follow-up: Keep signup flow fast and low-friction to compensate for the hard account requirement.

### 2026-04-15 - Tech stack finalized: Vercel, Neon, Azure, Resend

- Status: accepted
- Context: Multiple provider options were under consideration.
- Decision: The confirmed infrastructure stack is Vercel (hosting), Neon (Postgres database), Azure (receipt scanning OCR, premium only), and Resend (transactional email for password reset and invite notifications).
- Why: Vercel and Neon are already on paid plans shared with another app, reducing marginal cost to near zero. Azure is pay-per-use and only activated for premium receipt scanning. Resend is lightweight and developer-friendly for transactional email.
- Follow-up: TripWave has no image hosting requirement. Stripe or equivalent still needed for processing the one-time $7.99 premium payment.

### 2026-04-15 - Build features without paid third-party APIs where possible

- Status: accepted
- Context: The business model requires low operating costs to be profitable on ad revenue alone.
- Decision: Prefer building features with self-contained logic, free data sources, or open APIs rather than paid API subscriptions.
- Why: Keeps operating costs predictable and under control. Exceptions are Azure (receipt scanning, premium-gated) and payment processing for premium.
- Follow-up: Currency converter should use a free or self-managed exchange rate source. Smart suggestions should use deterministic rules before any AI inference costs.

### 2026-04-15 - The Trip Ball as core visual identity

- Status: accepted
- Context: The product needs a distinctive visual element that represents trip health and reinforces the TripWave brand identity.
- Decision: A circular ball character serves as the persistent visual representation of each trip. It fills from the center outward as preplanning is completed. It rolls between phases as the trip progresses. Users can recolor it. It has subtle personality through micro-animations rather than a cartoon face.
- Why: Gives the app a recognizable visual identity, makes trip health tangible and fun to watch grow, and fits the ocean wave personality of the TripWave brand.
- Follow-up: Design the ball animation states for each lifecycle phase. Define pulse animation rules -- ocean wave rhythm, not electronic bounce.

### 2026-04-15 - Action circle visual language

- Status: accepted
- Context: The trip ball needed a way to show that user actions are being recorded and the trip is growing.
- Decision: Meaningful user actions trigger small colored circles that animate into the trip ball. Green for expenses, cyan-blue for itinerary, yellow for packing, pink for participants joined, orange for travel day tasks. At end of trip the ball opens into a circle breakdown of the full trip.
- Why: Makes every action feel rewarding, extends the circle design language into a dynamic system, and produces a shareable end-of-trip visual that doubles as a marketing asset.
- Follow-up: Design the end-of-trip circle breakdown for the memory vault. Ensure action circle animations never block user flow.

### 2026-04-15 - Granular per-user permissions within a trip

- Status: accepted
- Context: Previous model assumed simple organizer vs participant roles.
- Decision: Organizers can set per-user permissions at trip creation (simple defaults) and adjust them in full trip settings at any time. Trip settings allows clicking a user and toggling individual capabilities on or off.
- Why: Different trips have different group dynamics. Custom per-user toggles accommodate both tight and open collaboration without inventing a complex role hierarchy.
- Follow-up: Trip creation form should surface simplified permission presets with a note pointing users to full settings for customization.

### 2026-04-15 - Packing lists are personal by default with optional sharing

- Status: accepted
- Context: Packing is often personal. Some items are private.
- Decision: Packing lists are personal by default. Users can optionally make their list visible to the group. Individual items within any list can be marked private, hiding them from all other users including the organizer.
- Why: Respects personal packing habits. Eliminates awkward moments where users need to pack personal or embarrassing items without announcing them.
- Follow-up: UI should make the private item toggle quick and non-judgmental.

### 2026-04-15 - Expense tracking begins at day 0 (preplanning)

- Status: accepted
- Context: Pre-trip costs like flights, hotels, and tickets are real trip expenses.
- Decision: Expense logging is available starting in the preplanning phase. Preplanning accommodation and transport costs link automatically to the expense ledger.
- Why: The true cost of a trip starts the moment you book. Tracking from the start gives users a complete financial picture.
- Follow-up: Ensure preplanning cost fields link to the ledger without requiring double-entry.

### 2026-04-15 - Smart suggestions are vibe-aware

- Status: accepted
- Context: Trip type and vibe affect what the app should suggest.
- Decision: Planning suggestions, packing recommendations, and itinerary ideas factor in the trip vibe (beach, city, adventure, road trip, family, romantic, etc.) as well as destination and group composition.
- Why: Generic suggestions feel unhelpful. Vibe-aware suggestions feel like a smart travel friend who actually understands the trip.
- Follow-up: Start with deterministic rule-based suggestions tied to vibe and destination type before considering any AI-driven inference.

### 2026-04-15 - Official brand slogan locked

- Status: accepted
- Context: The product needed a tagline that captures the collaborative core and the TripWave brand personality.
- Decision: The official slogan is "Get everyone on the same wave." The hero marketing headline is "Plan the trip. Not the group chat."
- Why: The slogan is brand-aligned (wave metaphor), speaks directly to the group coordination value, and has a confident sassy energy that fits the brand voice. The hero headline creates immediate recognition of the core pain point.
- Follow-up: Apply consistently across marketing pages, onboarding, and brand assets.

### 2026-04-15 - Em dash prohibited throughout the product

- Status: accepted
- Context: A style decision to keep copy feeling clean and conversational.
- Decision: The em dash character is never used anywhere in the app. Not in UI copy, tooltips, notifications, error messages, empty states, button text, marketing copy, or documentation. Use a comma, a period, parentheses, or rewrite the sentence instead.
- Why: Em dashes can feel formal or editorial. The TripWave voice is casual and direct. Avoiding em dashes keeps the copy feeling human and consistent.
- Follow-up: Enforce during all copy review. Apply retroactively to existing docs.

### 2026-04-15 - Activity wishlist is free, open to all participants by default

- Status: accepted
- Context: Users needed a place to collect ideas before they become formal itinerary items.
- Decision: All participants can add items to the activity wishlist by default. The organizer can restrict per user via the existing per-user toggle system. Wishlist items are removed from the wishlist when promoted to the itinerary, with an immediate undo action available.
- Why: Group trip inspiration should be collaborative and low-friction. The wishlist is different from polls -- no expiry, no forced decision, just a running idea board.
- Follow-up: Design the wishlist-to-itinerary promotion flow with a clear undo path.

### 2026-04-15 - Notes are individual posts, not a shared document

- Status: accepted
- Context: Shared notes needed a structure that works for groups without turning into an edit conflict problem.
- Decision: Notes are individual posts, not a single collaborative document. All posts are visible to the group in an "All" tab sorted newest first. Event-attached notes appear in a separate tab. Users can filter between views.
- Why: Individual posts avoid edit conflicts, preserve authorship, and are easier to react to and comment on.
- Follow-up: Personal notes (private) are a separate concept from shared notes posts.

### 2026-04-15 - Social layer: comments, likes, and favorites throughout the app

- Status: accepted
- Context: Users need lightweight communication within the app to avoid constantly exiting to a group chat.
- Decision: Most content items (itinerary events, wishlist items, notes posts, expenses) support comments, likes, and favorites. Favorites are personal. Notifications surface social activity. Web has in-app notifications only; native app has push notifications.
- Why: Keeps the group coordinating inside TripWave. Reduces the check-the-group-chat behavior that fragments trip communication.
- Follow-up: Comments support plain text only. Design the social layer to feel lightweight, not like a social feed.

### 2026-04-15 - Native app UI is a direct copy of web layout

- Status: accepted
- Context: Separate mobile design systems create maintenance burden and inconsistency.
- Decision: The native app (when built) uses the same UI layout as the web. No separate mobile-only nav or layout deviations.
- Why: Design once, build twice. Keeps the design system unified and reduces long-term complexity.
- Follow-up: Ensure all web design decisions account for touch targets and mobile usability from the start.

### 2026-04-15 - Trip duplication is a premium feature

- Status: accepted
- Context: Duplication is a power-user convenience that appeals most to repeat trip planners.
- Decision: Trip duplication is premium only. It copies trip structure (packing template, travel day tasks, permission presets, type and vibe) but not dates, participants, expenses, itinerary events, or confirmation numbers.
- Why: Strong upsell moment when starting a second trip. Free users get a natural prompt to upgrade.
- Follow-up: Design the duplicate flow to clearly show what is and is not copied.

### 2026-04-15 - Read-only share link is free

- Status: accepted
- Context: Organizers need a way to share the itinerary with non-members (family, friends checking in on the trip).
- Decision: Organizers can generate a read-only public link to a clean view of their itinerary. No account required to view. Expenses, packing lists, and private notes are always excluded. The public view carries TripWave branding.
- Why: Free acquisition tool. Every shared itinerary is a TripWave ad seen by people who have never heard of us.
- Follow-up: Organizer can revoke the link at any time. Include a subtle "Plan your trip with TripWave" CTA on the public view.

### 2026-04-16 - Color scheme changed from white-dominant to rich dark surfaces with vibrant accents

- Status: accepted
- Context: The original design direction used white as the dominant background with brand colors as foreground splashes. In practice this created large areas of empty white space with insufficient visual energy.
- Decision: The app UI uses deep rich dark surfaces (slate-navy base, not pure black) as the neutral foundation. Brand accent colors (cyan, yellow, pink, green, orange) are used freely as text labels, icon colors, borders, and highlight elements against the dark base. White is used for primary body text and high-contrast moments, not as a background fill. This is not a traditional dark mode -- it is a layered depth system where dark surfaces make every color element pop.
- Why: A dark base with vibrant multi-color foreground elements creates a more energetic and visually interesting product. Empty white surfaces disappear. The brand palette becomes more expressive because every accent color reads clearly against the dark background without competing with each other.
- Follow-up: Define the exact surface hex values when building the component library. Ensure text contrast ratios meet accessibility requirements on all surface tiers. Update marketing surfaces separately -- they can use more contrast between dark and light zones.

### 2026-04-16 - Mobile navigation uses a collapsible left sidebar, no bottom tab bar

- Status: accepted
- Context: Mobile navigation pattern was previously undecided (bottom tabs or drawer noted as TBD). A decision is needed before building the shell.
- Decision: Mobile navigation uses a collapsible left sidebar that matches the desktop left-rail content and structure. A hamburger toggle button in the top-left of the header opens and closes it. The sidebar slides in from the left, covers roughly 80% of viewport width, and sits above the content with a semi-transparent overlay behind it. There is no bottom tab bar.
- Why: A sidebar keeps the mobile and desktop navigation patterns consistent in content and mental model. Bottom tab bars limit the number of nav items that can be shown and create a separate design paradigm that diverges from desktop. A sidebar can show all phases, their colored icons, active state, and recommended phase badge without truncation.
- Follow-up: Implement the sidebar as a shared component used in both the app shell and trip workspace. Confirm animation duration and easing. Ensure the hamburger button is always reachable without scrolling.

### 2026-04-16 - Travel day UI is a vertical timeline with sequential task completion

- Status: accepted
- Context: Travel days are high-stress and time-sensitive. Users need a focused interface that shows exactly what to do next and keeps them moving forward without decision fatigue.
- Decision: Travel day pages show a single vertical timeline. Tasks are listed in chronological order from top to bottom -- wake up, eat breakfast, double check you have your tickets, turn off all appliances and electronics, leave the house, arrive at the airport, and so on. As the user checks off each task, the view auto-scrolls with a smooth animation to bring the next incomplete task into focus near the top of the screen. Completed tasks remain visible but visually de-emphasized. Users can customize the task list for each travel day, both during the planning phase and on the day itself.
- Why: A sequential vertical timeline with auto-scroll eliminates all uncertainty on departure day. The user never has to wonder what comes next -- the app moves them forward automatically. The format is mobile-first by nature since users will be on their phones while physically moving through the day.
- Follow-up: Define default task presets per transport mode (flight, drive, train). Define auto-scroll animation timing and easing. Allow task customization: add, remove, reorder, and rename tasks. Same timeline UI applies to vacation days with a different default task structure.

### 2026-04-16 - Bento grid layout for data-summary and edit pages

- Status: accepted
- Context: Setup and similar pages were initially built as narrow left-aligned vertical card stacks, leaving large amounts of empty white space on wider screens and making the layout feel like a list of form fields rather than a visual dashboard.
- Decision: Data-summary pages (Setup view, trip overview) and their corresponding edit forms use a bento grid layout. View and edit pages use different grid configurations from each other. The view grid emphasizes visual hierarchy with a large hero cell and solid-color stat cells for key numbers. The edit grid is organized by field complexity. The standard view pattern is a three-column grid (2fr 1fr 1fr) with a spanning hero cell. The standard edit pattern is a two-column grid (1.4fr 1fr) with full-width cells for prominent fields.
- Why: A bento grid eliminates empty whitespace, gives important data proportional visual weight, and makes the page feel like a dashboard rather than a form. It also naturally differentiates the view experience from the edit experience without feeling like the same layout with inputs swapped in.
- Follow-up: Apply bento grid layout to Preplanning summary and trip overview pages. Establish a shared pattern library for bento cell types.

### 2026-04-16 - UI scale inside dark bento cards is large by default

- Status: accepted
- Context: Initial implementation used small text sizes inside bento cells (10-11px labels, 12px pill text, small inputs) consistent with typical UI density. Against the dark card backgrounds and with the cells occupying significant screen real estate, this scale felt mismatched: cards with a lot of space and very small content. The Travelers "4" stat card made the problem obvious -- the number was large and impactful while adjacent pill cards felt like footnotes.
- Decision: All content inside dark bento cells is scaled up permanently. Hard minimums: cell labels 13px, form inputs 16px (text-base), pill text 14-15px, hint text 14px, sub-labels 12px. Stat numbers use clamp() to fill their cells responsively. Cell padding is always 24px (p-6). Pill padding is generous (10px/20px for transport, 8px/16px for type/vibe). These are floors, not targets -- go larger when the card has more room.
- Why: Dark cards occupy significant visual real estate. If the content inside them is small, the card reads as mostly empty background. Large content fills the card and makes every cell feel intentional. The scale also improves readability and touch target sizes at no cost.
- Follow-up: Apply these scale rules to all future bento-style pages. Do not introduce smaller scales for "compact" variants without explicit justification.

### 2026-04-16 - Page background is a radial gradient from white center to dark gray edges

- Status: accepted
- Context: The page background went through several iterations: flat #F5F7FA, light blue gradient, medium blue, medium gray. Each iteration was evaluated visually against the dark card surfaces.
- Decision: The authenticated app page background is a radial gradient centered on the viewport. Center is white or near-white. Edges fade to medium-dark gray (around #787878). This applies to all authenticated app pages. The gradient direction is always radial from center, not linear.
- Why: A radial gradient creates a natural focal center that draws the eye toward the content area. Dark cards on a light-center surface feel grounded and readable. The dark edges give the overall page depth without requiring decorative elements. Flat colors feel static by comparison.
- Follow-up: Adjust the gray depth as the overall UI evolves. The current stop values are #d4d4d4 center, #a8a8a8 midpoint, #787878 edge.

### 2026-04-16 - Work on master branch until foundation is complete

- Status: accepted
- Context: The project is in early foundation phase with structure, shell, and core primitives still being established.
- Decision: All work happens directly on the master branch until the foundation is complete. Foundation includes: app shell, navigation, auth scaffold, trip workspace skeleton, and core component primitives. Once the foundation is stable, individual features get their own branches.
- Why: Branching before a stable base creates fragile, conflict-prone branches that diverge from moving ground. A stable foundation first means feature branches start from something solid and merges stay clean.
- Follow-up: When foundation work is done, move to a branch-per-feature workflow. Each feature branch should map to a discrete backlog item.
