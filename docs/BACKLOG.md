# Backlog

> **Last audited: 2026-04-22.** Code-verified against `src/` — every item below reflects actual implementation state, not doc assumptions.

This backlog tracks what's built, what's next, and what's deferred.

### "Lets work on tripwave roadmap" — session protocol

When a session starts with that phrase, follow this protocol exactly:

1. Read this file (`docs/BACKLOG.md`) before doing anything else
2. Identify the highest-priority item in the **Next Up — Public MVP Launch Queue** below that is still genuinely incomplete
3. **Verify its current implementation state in the codebase** before making any plan — do not trust doc claims alone
4. Report in this format:
   - `Selected backlog item` — which item and its ID (L3, P1, etc.)
   - `Why this is next` — why higher items were skipped (if any)
   - `What the code currently does` — based on actual file reads
   - `Gap to close` — what's missing
   - `Smallest sensible next implementation slice` — tight, ship-oriented
   - `Files I expect to inspect/change`
5. **Wait for approval before coding**

**Hard rules:**
- Do NOT pick work from memory — the answer comes from this file
- Do NOT default to redesign work or invent a new priority order
- Prefer launch blockers over polish
- Do NOT silently switch into page redesign unless the backlog item explicitly requires it
- Do NOT reopen broad product strategy unless the backlog item forces a decision
- Preserve current shipped functionality — do not break what works
- Keep scope tight and ship-oriented

**Decision rules:**
- If the top item is already done in code → move to next item, say why
- If the top item is partially done → prefer finishing/verification over jumping ahead
- If the top item requires external setup/credentials → identify what's blocked, choose next unblocked item
- If the top item requires a design pass → keep it tightly scoped to the backlog item only

---

## ✅ Beta-Tier Build Queue — COMPLETE

All 10 chunks from the 2026-04-21 build-order grill have shipped. Every feature below is real, full-stack, and wired to the Neon PostgreSQL database via Drizzle ORM.

| # | Chunk | Status | What shipped |
|---|---|---|---|
| **0** | Migration 0001 | ✅ Done | 11 migrations applied (0000–0010). 25 tables. `lifecycle` column, `settlements` ledger, `supporter_entitlements`, `expense_receipts`, preplanning tables (lodgings, flights, transport), packing, polls, proposals. |
| **1** | Helpers + analytics scaffold | ✅ Done | `computeState()` in `src/lib/trip/state.ts` (8-state enum, never stored). `computeBalance()` in `src/lib/trip/balance.ts` (settlement-aware). `computeEqualSplit()` in `src/lib/expenses/split.ts`. PostHog event emitters wired. |
| **2** | Expenses moat capstone | ✅ Done | Create expense (equal/by-share/by-amount). Multi-currency at log-time FX rate. Balances hero + ledger. Per-pair settle-up with Venmo/Zelle deep-links. Manual receipt upload (Vercel Blob, 10MB max). Notifications on expense events. Funnel events: `first_expense_logged`, `two_member_expense_threshold`. |
| **3** | Itinerary CRUD | ✅ Done | Day-by-day view, 7 categories (activity/meal/reservation/flight/transport/note/other). Soft-conflict detection (last-write-wins + updatedAt check). Trusted-role edit gate. `?date=` param. Notifications on new events. |
| **4** | Travel Day static | ✅ Done | Planning-phase checklist. "Generate from trip" button extracts transport events. Default task templates per transport mode (flight/drive/train/cruise/bus). Task CRUD + toggle. |
| **5** | Notifications bell | ✅ Done | 6 event types: `expense_added`, `invite_accepted`, `poll_created`, `proposal_created`, `itinerary_event_added`, `settlement_recorded`. Grouped by time. Mark-all-read. Unread badge. |
| **6** | Home + trip switcher | ✅ Done | Dynamic greeting (TimeGreeting). "Next Up" trip hero with countdown. Trip list sorted by relevance. Empty state → redirect to trip creation. All data from DB. |
| **7** | Invite-landing page | ✅ Done | `/join/[code]` with trip ball, trip name, inviter name, social proof, date range, permissions preview. JoinCTA with 3 states (unauth → signup, already-member → redirect, accept). |
| **8** | Beta onboarding checkpoint | ⏳ Partial | `/accessibility-review` not yet run across pages. 20 personal-network users not yet onboarded. Bug bash not started. |
| **9** | PostHog wiring | ✅ Done | PostHog client wired (server singleton + client bridge at `/api/analytics/emit`). Events emitting from expense/invite/itinerary/settlement actions. 6-metric dashboard not yet configured in PostHog UI. |

### Bonus features shipped ahead of schedule

These were on the "Later" or "Post-MVP" lists but are already built and functional:

- **Polls** — full CRUD + voting, open/closed tabs, tally display
- **Proposals / Wishlist** — CRUD with upvote, sorted by votes, `/wishlist` redirects to `/proposals`
- **Packing checklist** — group shared checklist (add, toggle, delete)
- **Preplanning** — 5 sections (Flights, Stays, Transport, Notes, Checklist) instead of the planned "budget only"
- **Marketing pages** — landing, pricing, contact stub, legal stub
- **Stripe checkout** — session creation + webhook handler exist (partially wired)
- **Receipt upload** — Vercel Blob integration, validation, DB insert
- **Trip creation** — full-stack with slug generation, analytics events
- **Trip Overview** — OverviewIdentity + OverviewRightNow (pulse widget)
- **Setup page** — read-only bento grid + edit form (organizer-only)
- **Auth** — Better Auth with email/password, sign-up, login, logout, password reset
- **Members** — organizer/trusted/member role gates active across surfaces

---

## 🚀 Next Up — Public MVP Launch Queue

These items must ship before strangers arrive. **This is what "lets work on tripwave roadmap" points to.** Work in this order.

### Launch Blockers (ship or launch fails)

| # | Item | Why it blocks | Effort |
|---|---|---|---|
| **L1** | ~~Wire Premium purchase button~~ | ✅ **Already done.** `SupporterCheckoutButton.tsx` calls `/api/stripe/checkout` and redirects to Stripe. Webhook handler at `/api/webhooks/stripe/route.ts`. Premium page shows confirmed state post-purchase. **Remaining:** verify webhook fires correctly in production and `supporterEntitledAt` gets set on purchase. | Verify only |
| **L2** | ~~Unify pricing across all surfaces~~ | ✅ **Already done.** All user-facing surfaces show $4.99 (Account page, Premium page, Marketing pricing page, checkout button). Only doc-level inconsistency: CORE_LOOP mentions $2.99 founder's pricing — decide if founder's tier is still planned or if $4.99 is universal. | Decision only |
| **L3** | **Ad banner on Home page** | AdMob or AdSense integration. Supporter exemption via `users.supporterEntitledAt`. Home-only placement per CORE_LOOP. Without ads, premium value prop ("remove ads") is hollow. | 2–3 days |
| **L4** | **Overview inline budget field** | CORE_LOOP launch scope. `trips.budget_cents` and `trips.budget_notes` exist in schema but Overview doesn't expose them. Add editable budget card to Overview page. | 1 day |
| **L5** | **First-run onboarding flow** | Sign up → trip-create (skip Home on first login). Compresses sign-up → invite-sent funnel where 80% drop-off happens. | 1–2 days |
| **L6** | **Founder's pricing counter** | Display "X of 1,000 founder spots left" on marketing site + premium sheet. Query `supporter_entitlements` where `source = 'founder'`. | Half day |
| **L7** | **404 / error pages** | Custom styled pages matching neon-on-dark brand. Next.js `not-found.tsx` + `error.tsx`. | Half day |
| **L8** | **Naming renames in code** | Memory → Afterglow, Vacation Day → Today (per NAMING.md). Update route labels, nav items, page headings. Routes can stay as-is for now. | Half day |
| **L9** | **Booking.com affiliate chip** | On lodging-type itinerary events only. One partner, one surface. Proves affiliate mechanism. | 1–2 days |
| **L10** | **Beta onboarding** | Run `/accessibility-review` on all spine pages. Recruit 20 personal-network users. Bug bash. Fix blockers. | 1–2 weeks |

### Pre-Launch Polish (ship before public traffic)

| # | Item | Why it matters | Effort |
|---|---|---|---|
| **P1** | **Post-trip prompt** | Highest-leverage conversion UI. Fires once per account after first trip vaults. Warm copy, trip stats, Supporter benefits (no ads + Founder badge + 20 ball colors), one-tap purchase. Requires Step-1 inventory + `/design-critique`. | 3–5 days |
| **P2** | **3 transactional emails (Resend)** | `invite_accepted` → organizer, `first_expense_logged_by_other` → affected members, `unsettled_balance_reminder` → affected members at T+14d. Resend already in stack. Only re-engagement mechanism at launch. | 2–3 days |
| **P3** | **Unsettled-balance reminder** | In-app banner + transactional email at T+14d post `trip_end_date`. Uses `trips.unsettled_balance_reminder_sent_at`. Without this, completed trips silently die with the entire post-trip funnel. | 1–2 days |
| **P4** | **Founder badge + 20 premium ball colors** | Zero-dev-cost identity features for Supporter bundle. Badge = CSS class on `supporter_source = 'founder'`. Ball colors = pure CSS palette gated on `supporterEntitledAt`. Gives "what do I get?" three bullets instead of one. | 1 day |
| **P5** | **Ad-impression premium prompt** | Fires once at 5th Home ad view. Honest copy ("you've seen this ad 5 times — remove for $4.99 forever?"). One-time per user; dismiss silences forever. | 1 day |
| **P6** | **"Who else is coming?" soft prompt** | Post-invite Overview card. Dismissible. Bulk paste shortcut. Beachhead is 3–5 person groups; asking once moves the ≥2-member metric. | 1 day |
| **P7** | **"Your turn? Plan your next trip" CTA** | Post-settlement screen for participants. Fires once. Converts passive participants into new organizers at zero cost. | 1 day |
| **P8** | **Invite share-sheet copy polish** | WOM-critical — must read well both inside and outside the direct invitee conversation (e.g., pasted into a broader group chat). | Half day |
| **P9** | **Join landing page conversion review** | Grill / `/design-critique` pass on highest-leverage conversion surface. Page works mechanically but was never reviewed for conversion optimization. | 1–2 days |
| **P10** | **Accessibility review** | `/accessibility-review` on every spine page. WCAG 2.1 AA. Contrast, keyboard nav, touch targets, screen reader. | 2–3 days |
| **P11** | **Prep section content** | Preplanning Prep stub needs real content: visa requirements, travel insurance notes, pre-departure logistics checklist. Requires scoping grill. | 3–5 days |
| **P12** | **Preplanning section rail** | Left nav UI for the 4-section in-page model. Structural anchors (`id="travel"` etc.) already in place. Requires `/design-critique` before implementation. | 2–3 days |

---

## 📦 Post-Launch Queue (priority-ordered)

Ship after Public MVP is live and stable. Pull into active work one at a time.

| # | Item | Timeline | Notes |
|---|---|---|---|
| 1 | Skyscanner flight affiliate chip | Weeks 2–3 | On flight-type itinerary events |
| 2 | Viator activity affiliate chip | Weeks 2–3 | On activity-type itinerary events |
| 3 | Dream Mode (stripped) | Weeks 4–6 | Create dream trip, hero image (Unsplash), public URL, vibe tag, 3–5 placeholders. No reactions/comments/saves |
| 4 | Receipt scanning OCR | Month 2 | Azure AI Document Intelligence. Premium feature. |
| 5 | Travel Day focus mode | Month 2 | Full-screen simplified view + per-member briefing + skip semantics |
| 6 | Full ad banner rollout | Month 2 | Extend beyond Home to Basics cards, vault, permitted zones |
| 7 | Basics hub (full) | Month 2+ | Returns when 3+ sections are genuinely ready |
| 8 | Vacation Day / Today | Month 2 | Highest-frequency in-trip surface. Today's events, one-tap expense, member status |
| 9 | Afterglow (memory recap) | Month 3 | Trip stats, highlights, shareable card, "Plan next trip?" CTA. Needs real completed trips |
| 10 | Trip-ball modal + motion | Month 3 | Color picker, fill breakdown, phase summary. Ocean-wave pulse animation |
| 11 | Native iOS + Android | Months 3–6 | Expo / React Native wrap |
| 12 | Remaining premium features | Months 3–6 | Offline mode, currency converter, smart suggestions, templates, export, trip duplication |
| 13 | Scavenger Hunt | Months 3–6 | Text-prompt challenges, photo submission, scoring |
| 14 | Notes (full) | Months 3–6 | Per-note structure with attribution (Preplanning notes textarea is stopgap) |
| 15 | Vault | Months 3–6 | Post-trip archival storage, locked/settled-state documents |
| 16 | Tools hub | Months 3–6 | Individual tool implementations (currency converter first) |
| 17 | Advanced permission toggles | Post-launch | Per-user capability overrides beyond role presets |
| 18 | CRDTs / Yjs | Only if needed | Replace last-write-wins if it breaks under real load |

---

## 🚫 Explicit Bans (still in force)

These remain banned until their scheduled time regardless of temptation:

1. **Trip ball motion / animation / modal polish** — static SVG until post-launch month 3
2. **Afterglow / memory recap** — month 3 post-launch (no trips have finished yet at launch)
3. **Dream Mode** — weeks 4–6 post-launch (no audience to go viral to yet)
4. **Travel Day focus mode** — month 2 (a bug at the airport is catastrophic; static is shippable)
5. **CRDTs** — only if last-write-wins breaks under real load
6. **OAuth / 2FA / email verification** — post-launch
7. **Vacation Day / Today full build** — month 2 (invisible during planning-phase dev)

---

## 📊 Success Metrics

**North star:** 1,000 settled trips with ≥2 expense-logging members in Year 1.

| Metric | Year-1 Target |
|---|---|
| Activation rate (signup → first_invite_accepted) | 40–60% |
| Trip completion rate (invite_accepted → trip_settled) | 50–70% |
| 90-day second-trip rate | 25–40% |
| Participant-to-organizer conversion | 5–10% |
| Supporter conversion rate | 3–8% |
| Unsettled-trip rate | <20% |

**Vanity metrics quarantined:** sign-ups/week, trips created, DAU/WAU/MAU, expense count.

---

*Post-MVP feature details → ROADMAP.md → Post-MVP Feature Backlog*
