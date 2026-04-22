# TripWave Surface Blueprint

> **Purpose:** Product-memory document. Prevents scope amnesia as disciplined v1 slices are built.
> Answers: *"What is this surface ultimately for, and what is still owed?"*
>
> **Authority:** Direct code inspection + CORE_LOOP.md, DECISIONS.md, PITCH.md.
> Last verified: 2026-04-22.

---

## How to read this doc

Each surface entry has four fields:

- **Now** — verified current implementation state. Prefixed `[V]` (code-confirmed), `[?]` (uncertain — do not assume).
- **Contract** — the surface's long-term job in the product. What problem it ultimately solves.
- **Deferred** — planned capabilities not yet built. Still owed; not scope-cut.
- **Not owed** — things shown in old mocks or mentioned speculatively that are NOT product commitments.

Flags call out inconsistencies, launch blockers, or risks worth knowing before touching the surface.

---

## Product-contract truths

Read before building anything:

1. **Expenses is the moat.** Screenshot-worthy quality before any other surface gets polish attention. It is the reason someone switches from a group chat and the thing they screenshot to share.

2. **Preplanning is a booking-records hub.** Current v1 (Stays + Notes) is ~40% of the intended surface. Flights (confirmation records) and Transport are still owed. Do not treat v1 as the complete contract.

3. **Vacation Day / Today is the highest-frequency in-trip surface.** Members open it 3–5 times per day during a trip. Its stub status is invisible during planning-phase development and will be TripWave's most felt gap the moment a real trip starts.

4. **Premium is a one-time thank-you, not a subscription.** This governs all copy and design decisions. "Support TripWave," not "Upgrade." Warm, not urgent. The purchase button is currently dead — highest-urgency revenue gap.

5. **The organizer/member permission model is load-bearing.** TripWave is built for group trips with a designated organizer. Every surface that involves editing must respect the organizer / trusted / member gate. It cannot be simplified away in v1 slices.

---

## MVP scope-drift risks

The five places where building v1 slices could accidentally redefine the product downward:

1. **Preplanning** — "Stays + Notes" looks polished and complete. Flights + Transport sections are absent and unobvious. Next developer will treat v1 as the spec.
2. **Premium purchase** — Dead button. The longer this stays unwired, the more the product is implicitly designed as a free-only product. Ad banner also can't be justified without a working purchase flow.
3. **Overview inline budget field** — Listed in CORE_LOOP launch scope, not yet built. If overlooked, the Overview never fully fulfills its "what's actionable right now" contract.
4. **Vacation Day / Today** — Total stub for the highest-frequency in-trip surface. Missing it means TripWave is a planning tool, not a trip tool.
5. **Join landing page** — Mechanically works; has not been through conversion-design review. Every new user arrives here. Quiet leak if left unreviewed before launch traffic.

---

## Surfaces

---

### Home (`/app`)

**Now `[V]`** Full implementation. TimeGreeting, "next up" trip hero card, HomeTripList, empty state ("Every great trip starts with a name"). No ad banner — not a placeholder, simply absent.

**Contract** The between-trips command center. The screen non-organizer members return to while waiting. Also the only page where the ad appears — the thing supporters pay to remove.

**Deferred** Ad banner (AdMob/AdSense) — Home-only per CORE_LOOP; post-settlement "Plan next trip?" CTA; participant-to-organizer conversion nudge.

**Not owed** Daily activity feeds, discovery features, push notifications.

> **Flag:** Ad banner is a launch blocker. Without it, "remove ads" is meaningless and the premium value proposition collapses.

---

### Account (`/app/account`)

**Now `[V]`** Profile card (avatar initial, name, email). "Support TripWave for $7.99 one-time" link to `/account/premium`. SignOutButton.

**Contract** User identity and supporter status hub.

**Deferred** Full profile editor (name, avatar); Founder badge display post-purchase; 20 premium ball colors gated behind purchase; delete-account danger zone.

**Not owed** Subscription management, billing portal, complex notification preferences.

> **Flag:** Account page says "$7.99." Premium page says "$5." CORE_LOOP says "$2.99 founder's → $4.99 standard." Three different prices — one is authoritative; resolve before launch.

---

### Premium (`/app/account/premium`)

**Now `[V]`** Offer page listing 7 perks. "Unlock Premium — $5" button is a **completely inert styled element** — no onClick, no href, no form. No Stripe API calls anywhere in the codebase. Schema has `payments` table and `users.supporterSource` field — unconnected to any checkout flow.

**Contract** One-time purchase that converts a free user to a supporter. Launch features: ad removal + Founder badge + premium ball colors. Month 2+: receipt scanning (OCR). Tone: warm thank-you, not feature paywall.

**Deferred** Stripe Checkout wiring (launch blocker); post-trip prompt (highest-leverage conversion surface — warm copy + trip stats + one-tap purchase); ad-impression prompt at 5th Home ad view; post-settlement prompt.

**Not owed** Subscriptions. "Upgrade" framing. Scarcity copy. The 7 listed perks include "offline mode" and "smart packing" `[?]` — unconfirmed whether these represent actual planned features or aspirational copy. Do not treat them as commitments until verified.

> **Flag:** Premium purchase is inert. This is the highest-urgency gap in the entire product.

---

### Overview (`/app/trips/[tripId]`)

**Now `[V]`** OverviewIdentity (trip name, phase chip — Planning / In Progress / Completed / Settled, countdown, member avatars) + OverviewRightNow (severity-ranked contextual rows from `buildRightNowRows`). **No inline budget field present.**

**Contract** The one screen that tells any member "where we are and what needs to happen next." Adapts across the full planning → active → settled lifecycle. Surfaces what's actionable, not what's configurable (Setup handles configuration).

**Deferred** Inline budget field — `[DOCS SAY]` CORE_LOOP lists this as launch scope, not yet built. Brand-new state (first 24h, zero members, zero events — warm onboarding prompt). Established state (all members in, dates set, ready to depart).

**Not owed** Old HERO card, COUNTDOWN card, MEMBERS card, WHO'S IN card as separate components — these were replaced by OverviewIdentity. Do not restore them.

---

### Setup (`/app/trips/[tripId]/setup` + `/setup/edit`)

**Now `[V]`** Read-only bento grid (trip name with ball-color gradient, duration, budget in green, traveler count in yellow). "Edit Setup" links to `/setup/edit`. Edit page **exists and is fully implemented** — form with trip name, dates, budget, ball color; organizer-only gate.

**Contract** Trip configuration viewer + editor. The place to change basics before departure.

**Deferred** Danger Zone (delete trip, transfer ownership) — explicitly deferred to post-launch.

**Not owed** Multi-step setup wizard; complex duplication flows here.

---

### Preplanning / Basics (`/app/trips/[tripId]/preplanning`)

**Now `[V]`** Stays section (lodging cards: name, address, check-in/check-out, confirmation number, booking URL, notes; inline add/edit/delete) + Trip Notes (shared freeform textarea, explicit Save, "last edited by" attribution). `isTripVaulted` guard on all mutations.

**Contract** Structured pre-departure booking-records hub. The group's answer to: "how are we getting there, where are we staying, and what confirmations do we have?" Current v1 covers lodging and notes — approximately 40% of the intended surface.

**Deferred**
- **Flights section:** Booking records (airline, flight number, confirmation code, from/to airports, seat class, departure date). Distinct from Itinerary's time-based flight events — the Preplanning entry is the confirmation record; the Itinerary entry is the schedule block.
- **Transport section:** Rental car, train, bus booking confirmations (ref number, pickup/drop-off, link).
- Budget section placement `[?]` — CORE_LOOP mentions "budget only at launch" for Preplanning, but current Setup has the budget form. Verify whether budget lives here or on Overview before building.

**Not owed** Adventure-theme icon decorators from old shell (Mountains, Waves, Moon, Heart, Camera, Compass, Sun, Leaf — these were visual mood decorators, not data sections). Medical/vaccination tracker. Business travel section. Shopping list (belongs in Tools or Packing).

> **Flag:** "Stays + Notes" looks complete and polished. It is not the full contract. The Flights and Transport sections are the next required additions before this surface fulfills its stated purpose.

> **Flag:** False "trip is settled" error reported when adding a stay on a non-vaulted trip. Most likely cause: test trip has `lifecycle = 'vaulted'` from a prior settle-up test. Verify by creating a fresh trip and attempting add-stay. If error appears on a genuinely new trip, investigate `.bind(null, tripId)` serialization.

---

### Itinerary (`/app/trips/[tripId]/itinerary`)

**Now `[V]`** Day-by-day event CRUD. Soft-conflict toast on concurrent edits. `?date=` param for jumping to a specific day. "Set dates" guard if trip has no dates. Trusted-role edit gate.

**Contract** The group's shared schedule — single source of what's happening when. Day-by-day during planning; day-of reference during the trip.

**Deferred** Drag-to-reorder events within a day. Booking.com affiliate chip on lodging-type events (CORE_LOOP launch scope). Skyscanner chip on flight-type events (weeks 2–3 post-launch). Viator chip on activity-type events (weeks 2–3 post-launch).

**Not owed** Map view, route-planning overlay, real-time GPS tracking.

---

### Expenses (`/app/trips/[tripId]/expenses`)

**Now `[V]`** Balances hero, ledger, create expense (equal / by-share / by-amount splits), multi-currency logged at entry time, settle-up with Venmo/Zelle deep-link, manual receipt upload (one per expense).

**Contract** The product moat. The reason a group uses TripWave instead of a shared note. Screenshot-worthy quality is an explicit product requirement — this is TripWave's primary acquisition surface.

**Deferred** Receipt scanning via Azure AI Document Intelligence (OCR) — premium, month 2 post-launch. 14-day unsettled balance in-app banner + transactional email post-trip-end.

**Not owed** Split types beyond equal / by-share / by-amount. Real-time ledger sync via CRDTs (deferred unless last-write-wins breaks under load).

---

### Packing (`/app/trips/[tripId]/packing`)

**Now `[V]`** Group packing checklist — add, toggle checked, delete. Any member can check/uncheck.

**Contract** Shared group packing list. Ensures critical items are covered before departure.

**Deferred** Per-member sections (each person manages their own sub-list within the shared list).

**Not owed** Packing calculator (belongs in Tools). Category system with icons. Templates/presets.

---

### Travel Day (`/app/trips/[tripId]/travel-days`)

**Now `[V]`** Static planning checklist + "Generate from trip" button (extracts transport events from itinerary). Day-granular view.

**Contract** Pre-departure coordination surface. Ensures the group has everything handled before travel begins. Eventually: the "morning of" screen during transit days.

**Deferred** Focus mode (full-screen simplified view for day-of use). Per-member departure briefing. Skip semantics (N/A vs unchecked).

**Not owed** Live transit tracking, GPS integration, complex per-leg checklists.

---

### Vacation Day / Today (`/app/trips/[tripId]/vacation-days`)

**Now `[V]`** Stub. "Day-by-day view coming soon." circle placeholder.

**Contract** The **highest-frequency touchpoint during an active trip.** Morning briefing, today's itinerary at a glance, quick expense logging, member check-in status. The screen members open 3–5 times per day while traveling. Its absence is invisible during planning-phase development; it will be TripWave's most felt gap the moment a real trip starts.

**Deferred** Everything. Core must-haves when built: today's events from Itinerary, one-tap "split this" expense entry, member status.

**Not owed** Social feed (likes, comments, photo uploads). Real-time presence ("Sarah is here"). Elaborate animations.

> **Flag:** Rename to "Today" before building — "Vacation Days" is confusing per NAMING.md.

---

### Polls (`/app/trips/[tripId]/polls`)

**Now `[V]`** Full CRUD with voting, open/closed tabs, tally display.

**Contract** Lightweight group decision tool — put a question to the vote, get a clear answer, move on.

**Deferred** Emit-side confirmation that `poll_created` notifications fire correctly `[?]` — NotificationBell handles this type, but whether actions emit it is unverified.

**Not owed** Anonymous voting. Real-time CRDT vote tally.

---

### Proposals / Wishlist (`/app/trips/[tripId]/proposals`)

**Now `[V]`** Proposal CRUD with upvote, sorted by upvotes. `/wishlist` redirects to `/proposals`.

**Contract** Async ideation board — anyone suggests an activity, restaurant, or experience; the group signals interest via upvotes.

**Deferred** "Add to itinerary" action from a winning proposal (close the loop between ideation and scheduling).

**Not owed** Comments on proposals. Complex categories/tags.

---

### Notifications (bell in TopNav)

**Now `[V]`** Fully implemented. Handles 6 types: `expense_added` (yellow), `invite_accepted` (cyan), `poll_created` (purple), `proposal_created` (orange), `itinerary_event_added` (cyan), `settlement_recorded` (green). Grouped Today / This Week / Earlier. Mark-all-read.

**Contract** In-app signal hub for collaborative events. Members are never surprised that something happened on a trip they're part of.

**Deferred** Transactional emails: `invite_accepted`, `first_expense_logged_by_other`, `unsettled_balance_reminder` (14-day post-end-date). `[DOCS SAY]` all three accepted into launch scope per ROADMAP.md retention grill.

**Not owed** Daily digest emails. Push notifications (episodic product — no daily loop by design).

---

### Invite + Join (`/app/trips/[tripId]/invite` + `/join/[code]`)

**Now `[V]`** Invite page generates link/code/QR, shows active invites. Join landing page (`/join/[code]`) is **fully implemented** — trip ball, trip name, inviter name, social proof ("X are already planning"), date range, permissions preview, JoinCTA with three states (unauth → signup, already-member → redirect, accept).

**Contract** Primary growth mechanism. The invite link IS TripWave's distribution channel — every new user arrived through one.

**Deferred** Conversion-design review of the join landing page `[?]` — the page works mechanically but has not been through the grill / design-critique pass intended for the highest-leverage conversion surface.

**Not owed** SMS invites. Email blast invites.

---

### Analytics (PostHog)

**Now `[V]`** PostHog client wired. Server-side singleton. Client→server bridge at `/api/analytics/emit`. Events tracked include `trip_settled`, `post_trip_prompt_shown`, `supporter_prompt_dismissed`, `ad_impression_prompt_shown`, `affiliate_click`, `participant_becomes_organizer`, `landing_page_visit`. Multiple action files emit events.

**Deferred** Audit `[?]` whether the specific retention metrics from ROADMAP.md are being emitted correctly: activation = `first_invite_accepted`, 90-day second-trip, organizer conversion rate.

---

### Scavenger Hunt (`/app/trips/[tripId]/scavenger-hunt`)

**Now `[?]`** Shell/stub — component exists, no data layer.

**Contract** Social/delight differentiator. Group game during the trip. The feature that makes TripWave feel like it's for *fun* trips. Do not underestimate its brand value even though it is months away.

**Deferred** Everything. Mechanics when built: text-prompt challenges + photo submission + organizer approval + scoring. Keep it simple — no GPS/AR triggers.

**Not owed** AR/GPS-triggered challenges. Real-time leaderboard sync.

---

### Memory / Afterglow (`/app/trips/[tripId]/memory`)

**Now `[V]`** Stub. "Memory" heading, description "Trip stats, highlights, and the post-trip wrap-up." Circle placeholder. Not yet renamed to "Afterglow" in code.

**Contract** Post-trip re-engagement surface. Trip stats, highlights (most upvoted proposal that made it, most expensive meal), shareable card, "Plan next trip?" CTA. Converts completed trips into re-acquisition.

**Deferred** Everything. Cannot meaningfully build until real trips complete in production.

**Not owed** Photo collage. Social feed. Elaborate animations at launch.

> **Flag:** Rename to "Afterglow" before building — per NAMING.md and brand tone.

---

### Vault (`/app/trips/[tripId]/vault`)

**Now `[V]`** Stub. "Store confirmations, tickets, important documents." Circle placeholder.

**Contract** Archival storage of a completed trip's records — the locked, settled-state document archive. Distinct from Preplanning (Preplanning = pre-trip planning records; Vault = post-trip archival).

**Not owed** Real-time document collaboration. This is read-only archival.

---

### Tools (`/app/trips/[tripId]/tools`)

**Now `[V]`** Catalog grid, 21 tool cards across 4 categories (Planning, Destination, On the trip, Accessibility). One premium marker: Currency converter. All cards are read-only — opacity-60, no interactive state. Zero tool implementations behind the cards.

**Contract** Smart utility hub for supplementary planning tools. Affiliate chips on Itinerary items are the only Tools-adjacent thing at launch (not in this route).

**Deferred** First tools to actually wire when this surface is built: currency converter (premium gate), packing calculator, group availability.

**Not owed** The 21-card catalog is a **roadmap sketch, not 21 owed implementations.** Several entries (Kids mode, Medication reminder, Allergy card, Accessibility planner) are niche enough to be speculative. Treat each tool as a net-new scoped feature when built.

---

### Notes (`/app/trips/[tripId]/notes`)

**Now `[V]`** Stub. Yellow placeholder circle.

**Contract** Shared trip document surface — freeform notes, reminders, anything that doesn't fit a structured section. Note: the Trip Notes textarea in Preplanning currently partially fulfills this role at launch.

**Deferred** When built: per-note structure with attribution, not just a single shared textarea. The Preplanning notes pad is a stopgap, not the long-term Notes surface.

**Not owed** Real-time collaborative editing (Notion-style). Rich text formatting at v1.

---

### Settings — Trip (`/app/trips/[tripId]/settings`)

**Now `[?]`** Not directly verified. Setup/edit form is fully implemented; settings surface state is uncertain.

**Deferred** Danger Zone (delete trip, transfer ownership) — explicitly post-launch.

---

### Settings — Members (`/app/trips/[tripId]/settings/members`)

**Now `[?]`** Not directly verified. Organizer/trusted/member gates are active across Itinerary and Packing, implying member role assignment works; the members list UI state is unconfirmed.

**Deferred** Advanced permission toggles — post-launch.

---

## Open flags summary

| Flag | Severity | Surface |
|---|---|---|
| Premium button is inert — no Stripe wiring | Launch blocker | Premium |
| Ad banner missing from Home | Launch blocker | Home |
| Three conflicting prices ($5 / $7.99 / $4.99) | Launch blocker | Account / Premium |
| Overview inline budget field not built (CORE_LOOP launch scope) | Launch gap | Overview |
| Preplanning: Flights + Transport sections not built | Surface incomplete | Preplanning |
| False "trip is settled" error on add-stay — likely vaulted test trip | Bug (likely data) | Preplanning |
| Vacation Day / Today — total stub for highest-frequency in-trip surface | Post-launch critical | Vacation Day |
| Join landing page — not through conversion-design review | Pre-launch review needed | Invite / Join |
| Memory/Afterglow rename not applied in code | Naming debt | Memory |
| Vacation Day rename to "Today" not applied | Naming debt | Vacation Day |
| PostHog retention-metric emit coverage unverified | Audit needed | Analytics |
