# Roadmap

> **Last audited: 2026-04-22.** Code-verified against `src/`. Status reflects actual implementation, not prior doc assumptions.

---

## 🟢 Current Status: Beta-Tier COMPLETE — Public MVP gaps remain

The entire 10-chunk beta build queue has shipped. All spine features are real, full-stack, and wired to PostgreSQL. TripWave is a functional group trip planner today.

**What's next:** Close the Public MVP launch gaps (BACKLOG.md → Next Up queue), then ship to strangers.

**Immediate priority:** Add the Home ad banner (L3) — the Premium purchase button (L1) and pricing (L2) are already wired and consistent at $4.99. The ad banner is the remaining blocker for the monetization layer.

---

> **2026-04-21 Retention loop grill — primary metrics + committed targets**
>
> **Year-1 primary retention metrics (added to success-metric suite):**
>
> | Metric | Year-1 target |
> |---|---|
> | Activation rate (signup → first_invite_accepted) | 40–60% |
> | Trip completion rate (invite_accepted → trip_settled) | 50–70% |
> | **90-day second-trip rate** (settled organizer → creates new trip) | 25–40% |
> | **Participant-to-organizer conversion rate** | **5–10% (committed)** |
> | Supporter conversion rate (post-trip prompt → purchase, within 30d) | 3–8% |
> | Unsettled-trip rate (past end date → settled within 30 days) | <20% |
>
> **North-star success metric unchanged:** 1,000 settled trips with ≥2 expense-logging members in Year 1.
>
> **Vanity metrics quarantined:** sign-ups/week, trips created, DAU/WAU/MAU, expense count across trips. Not used for retention decisions. See STATE_MODEL.md for full list.
>
> **Launch scope additions from this grill (retention-critical, not feature-expansion):**
>
> - Unsettled-balance reminder (in-app banner + transactional email, T+14d post end-date)
> - Three transactional emails accepted into launch: `invite_accepted`, `first_expense_logged_by_other`, `unsettled_balance_reminder` (see MONETIZATION.md)
> - Expense-entry one-tap affordance audit across all in-trip surfaces
> - Invite share-sheet copy treated as WOM-critical (not just activation)
> - "Duplicate past trip" flow scope verification on Home (shell + members + budget + itinerary skeleton, not shell-only)
>
> Full rationale: DECISIONS.md entry *2026-04-21 — Retention loop grill: 12 decisions locked.*

> **2026-04-21 Conversion loop grill annotations**
>
> **Year-1 affiliate reality check:** the $500k lifetime affiliate projection in MONETIZATION.md is honest but Year-3+ weighted. At Year-1 target of 1,000 settled trips, realistic affiliate revenue is **~$300 (best case ~$3k)**. Affiliate at launch is infrastructure, not revenue. Do not plan Year-1 runway assuming meaningful affiliate income.
>
> **Activation event added:** `first_invite_accepted` is the activation leading indicator; north-star success metric (settled trips with ≥2 expense-logging members) unchanged.
>
> **Retention framing:** episodic, measured in settled trips per year per organizer. MAU/WAU is the wrong frame for this product; any section using that language is a framing error.
>
> **Additional Public MVP UX surfaces (not new features — conversion plumbing):** invite-landing page, first-run "Log your deposit" CTA, "Who else is coming?" soft prompt, post-trip prompt (full spec), "Your turn?" participant CTA, ad-impression-triggered premium prompt. See UX_SPEC.md for the owed Step-1 inventories.
>
> **Supporter bundle expanded** (still within locked scope — zero-dev-cost additions): ad removal + Founder badge + 20 premium trip-ball colors. Receipt scanning stays cut from launch.
>
> Full rationale: DECISIONS.md entry *2026-04-21 — Conversion loop grill: 12 decisions locked.*

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
> Full rationale: DECISIONS.md entry *2026-04-21 — Launch-scope grill: 11 decisions locked (Public MVP = v1 launch).*

> **2026-04-20 Naming Audit — see docs/NAMING.md**
>
> Forward-work renames: Vacation Day → **Today** · Preplan → **Basics** · Tools Hub → **Tools** · Memory recap → **Afterglow** · Dashboard → **Home** · Premium (user-facing) → **Supporter**. Post-MVP list items below reference these new names going forward.

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

## ✅ 90-Day Private Beta — COMPLETE

All spine features shipped full-stack. Summary of what's live:

| Area | What shipped |
|---|---|
| **Auth** | Better Auth — sign-up, login, logout, password reset. Session persistence. |
| **Trip creation** | 4-step flow, slug generation, analytics events. Real DB. |
| **Trip Overview** | OverviewIdentity + OverviewRightNow (pulse widget, countdown, member avatars). |
| **Invite flow** | Create link/code/QR, accept, join. nanoid(10) codes. Usage tracking. Join landing page at `/join/[code]`. |
| **Expenses (moat)** | Create (equal/by-share/by-amount), multi-currency, settle-up with Venmo/Zelle deep-links, manual receipt upload, balances hero, ledger. Settlement-aware balance computation. |
| **Itinerary** | Day-by-day CRUD, 7 categories, soft-conflict detection, Trusted-role gate. |
| **Preplanning** | 5 sections: Flights, Stays, Transport, Notes, Before-You-Leave checklist. 4-section model (Travel, Stays, Prep stub, Notes). |
| **Travel Day** | Static planning checklist + "Generate from trip" button. Default task templates per transport mode. |
| **Notifications** | In-app bell, 6 event types, grouped by time, mark-all-read. |
| **Home** | Dynamic greeting, "Next Up" hero, trip list, empty state. |
| **Analytics** | PostHog wired, events emitting from key actions. |
| **Bonus** | Polls, Proposals/Wishlist, Packing, Marketing pages, Stripe checkout (partial), Setup page. |

**Still owed from beta scope:** accessibility review across all pages, 20-user onboarding + bug bash.

---

## 🚀 Public MVP Scope — What Remains

The spine is built. These gaps must close before strangers arrive. **See BACKLOG.md → Next Up queue for the ordered work list.**

### Launch Blockers (10 items)
1. ~~Wire Premium purchase button~~ ✅ Done (verify webhook in production)
2. ~~Unify pricing~~ ✅ Done ($4.99 everywhere; decide if $2.99 founder's tier is still planned)
3. Ad banner on Home (AdMob/AdSense + supporter exemption)
4. Overview inline budget field
5. First-run onboarding (skip Home on first login)
6. Founder's pricing counter
7. 404 / error pages
8. Naming renames (Memory → Afterglow, Vacation Day → Today)
9. Booking.com affiliate chip on lodging itinerary events
10. Beta onboarding (20 users, accessibility review, bug bash)

### Pre-Launch Polish (12 items)
11. Post-trip prompt (highest-leverage conversion surface)
12. 3 transactional emails (Resend)
13. Unsettled-balance reminder (T+14d banner + email)
14. Founder badge + 20 premium ball colors
15. Ad-impression premium prompt (5th view)
16. "Who else is coming?" soft prompt
17. "Your turn?" participant CTA
18. Invite share-sheet copy polish
19. Join landing page conversion review
20. Accessibility review on all spine pages
21. Prep section content (visa, insurance, logistics)
22. Preplanning section rail UI

---

## 📦 Post-MVP Scope (priority-ordered, post-launch)

| # | Item | Timeline | Notes |
|---|---|---|---|
| 1 | Skyscanner flight affiliate chip | Weeks 2–3 | Flight-type itinerary events |
| 2 | Viator activity affiliate chip | Weeks 2–3 | Activity-type itinerary events |
| 3 | Dream Mode (stripped) | Weeks 4–6 | Create, hero image, public URL, vibe tag, placeholders |
| 4 | Receipt scanning OCR | Month 2 | Azure AI. Premium. |
| 5 | Travel Day focus mode | Month 2 | + per-member view + skip semantics |
| 6 | Full ad banner rollout | Month 2 | Beyond Home to permitted zones |
| 7 | Basics hub (full) | Month 2+ | When 3+ sections ready |
| 8 | Today (Vacation Day) | Month 2 | Highest-frequency in-trip surface |
| 9 | Afterglow (memory recap) | Month 3 | Needs real completed trips |
| 10 | Trip-ball modal + motion | Month 3 | Color picker, animation, phase summary |
| 11 | Native iOS + Android | Months 3–6 | Expo / React Native |
| 12 | Remaining premium features | Months 3–6 | Offline, currency converter, suggestions, templates, export, duplication |
| 13 | Scavenger Hunt | Months 3–6 | Text challenges, photo submission, scoring |
| 14 | Notes (full) | Months 3–6 | Per-note with attribution |
| 15 | Vault | Months 3–6 | Post-trip archival |
| 16 | Tools hub | Months 3–6 | Individual tool implementations |
| 17 | Advanced permissions | Post-launch | Per-user toggles |
| 18 | CRDTs | If needed | Replace last-write-wins |

---

## Future Grill-Me Topics (deferred until core spine is proven)

The following UX, design, and monetization topics have been intentionally deferred. Do NOT grill on these until the Public MVP launch gaps are closed and the product is live. Revisit one at a time in future grill-me sessions.

### Before any grill-me session on a page, apply the build workflow

Every grill-me session on a page must produce outputs in this order (per CORE_LOOP.md → Build Workflow):

1. **Step 1 -- Page detail definition**: inventory of what information, actions, states, edge cases, and ordering the page contains
2. **Step 2 -- UI mockup**: ASCII wireframe, Figma, or inline description matching those details
3. **Step 3 -- Code**: only after Steps 1 and 2 are locked

If a future grill-me session starts with visual decisions (palette, animation, micro-interactions) on a page that has NO detail inventory yet, stop and route back to Step 1 first.

### Anthropic Design plugin skills as mandatory quality gates

- Step 1 ambiguity → `/user-research`
- Step 2 mockup locked but not critiqued → `/design-critique`
- Step 2 introduces new component or pattern → `/design-system`
- Step 3 ready to implement → `/design-handoff`
- Step 3 ready to ship → `/accessibility-review`
- Post-launch feedback pile → `/research-synthesis`

### Grill-Me Session Protocol

Every grill-me session on TripWave UI begins by reading docs/GRILL_PROTOCOL.md. That doc is the canonical rulebook.

### Page-level UX fun treatments (deferred)

- Polls page — neon fun treatment and animated voting cards
- Wishlist page — hot-section visual emphasis, promote-to-itinerary animation
- Notes page — social feed polish, reaction animations
- Vault page — category sections visual design
- Tools hub — phase-surfaced card treatment
- Memory / Afterglow — recap hero animation, shareable recap page
- Trip overview — state-aware layout polish
- Invite organizer page — share card visual
- Members / permissions page — preset dropdown polish
- Settings pages — sub-route navigation
- Account page — profile editor, solo-dev About section
- Notification bell panel — real-time toast, dashboard action-center shimmer
- Trip switcher dropdown — ball-mini visuals

### Feature-level UX (deferred)

- Settlement state transitions (partial settlements, disputes)
- Traveler profile editor (dietary/medical/emergency)
- Poll creation sheet + quick-vote mode
- Reality Check flow (dropped from Dream Mode)
- Mood board component

### Architecture / platform (deferred)

- Full permissions engine (per-user toggles)
- Notification system (real-time delivery, toast dedup)
- Offline mode (service worker, write queue, conflict resolution)
- Premium entitlement engine (Apple/Google/Stripe reconciliation)
- Push notification infrastructure (native app phase)

### Monetization refinements (deferred)

- Ad network selection and unit IDs
- Ad fill-rate monitoring
- Affiliate legal compliance
- Founder's badge visual treatment
- Founder pricing transition ($4.99 cap trigger)
- Pre-launch landing page waitlist iteration

### Brand and visual (deferred)

- Illustration assets for empty states
- App Store screenshot design
- Marketing site content polish
- Vibe theme catalog for Dream Mode

---

## 📦 Post-MVP Feature Backlog

Items below are Later or Speculative per CORE_LOOP.md. Pull into active work only after Public MVP is live and stable.

### Social Layer

- Likes/reactions on itinerary events, wishlist items, notes, expenses, poll options
- Comments on itinerary events, wishlist items, notes, expenses
- Favorites list view in account area
- Notification triggers for comments, likes
- Push notifications (deferred to native app)

### Collaboration (beyond spine)

- QR code version of invite link (UI exists; verify generation)
- Per-user permission management UI
- Notification settings per-type toggle

### Vacation Day / Today

- Full build per UX_SPEC § 10 and § 39
- Activity strip: horizontal scroll of today's events
- Scavenger Hunt pill strip
- Auto-completion: events drift away when end time passes

### Packing Page

- My lists + Shared tabs
- Named personal lists with per-list visibility
- Drag-to-reorder categories
- Cross-member visibility rules

### Polls Page (already built — polish items)

- Animated voting pill cards
- Anonymous mode
- Convert-to-itinerary action

### Wishlist / Proposals (already built — polish items)

- "The group is into" hot section
- Promote to itinerary with undo toast

### Notes

- Per-note structure with attribution
- Event-attached notes
- Likes and comments

### Scavenger Hunt

- Text-prompt challenges + photo submission + scoring
- Member-suggest queue; organizer approve/reject
- Vacation Day pill strip; leaderboard

### Vault / Memory

- Confirmation number vault
- Auto-generated memory artifact at wrap-up
- Shareable public link

### Tools Hub

- Currency converter (premium), packing calculator, group availability
- Time zone info, unit converter
- Departure day brief card, meetup broadcaster

### Premium Features

- Offline mode (service worker + write queue)
- Receipt scanning (Azure OCR)
- Currency converter
- Smart suggestions (deterministic rules)
- Trip export
- Trip templates
- Advanced travel-day templates

### Dream Mode (full)

- Shimmer/sparkle ball variant
- Public share + reactions + save-to-my-dreams
- Dream-slot pool (free: 1, premium: unlimited)
- Private-dream toggle (premium)

### Planning Tools

- Weather integration (Open-Meteo)
- Jet lag calculator
- Packing calculator
- Group availability checker
- Pre-trip shared shopping list

### Destination Reference Tools

- Language phrasebook, allergy/medical card generator, tipping guide
- Voltage/adapter guide, driving/transit basics
- Emergency contacts card, unit converter

### Smart and Proactive Tools

- Seasonal warning system
- Local public holiday alerts
- Document checklist generator
- Visa and health requirements lookup

### Accessibility and Comfort

- Accessibility needs flags in user profile
- Group-level accessibility summary
- Medication reminder
- Kids and family mode

### Contingency Levers

**Tier 2** (25%+ behind by year 2): Family plan SKU, curated Dream Mode SEO pages, editorial pitch template.

**Tier 3** (40%+ behind by year 3): Price raise infrastructure, free-tier slot reduction, rewarded video ads.

### Research Queue

- PWA-first vs Capacitor mobile strategy
- Map/place integrations for itinerary
- Calendar import/export
- Ad network selection
- Affiliate onboarding (Booking.com, Skyscanner)
- Azure OCR pricing at expected volume
- Deterministic smart suggestions feasibility
