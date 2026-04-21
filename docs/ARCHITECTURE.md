# Architecture

> **2026-04-21 Retention loop grill — transactional email scope + bell classification**
>
> - **Transactional email scope expanded from password-reset-only to a minimal event set.** Resend is already in the stack; no new infrastructure. Launch scope includes three transactional events: `invite_accepted` (to organizer), `first_expense_logged_by_other` (to affected members), `unsettled_balance_reminder` (to affected members at T+14d post `trip_end_date_reached` if balance open). Per-trip opt-out. No marketing content in any template. See MONETIZATION.md for copy patterns.
> - **The "no email except password reset" rule is narrowed to "no marketing email."** User-requested state-change emails are accepted as user-serving transactional messages, not marketing.
> - **In-app bell is intra-session awareness, not a retention tool.** A notification the user never sees can't re-engage them. Any doc section implying the bell is a re-engagement mechanism is a framing error; the bell only informs users already in the app.
> - **Unsettled-balance reminder scheduler:** one daily cron (Vercel scheduled function) scans trips where `trip_end_date < now - 14 days` AND `lifecycle = 'active'` AND open balance exists AND no `unsettled_balance_reminder_sent_at` set. Fires in-app banner state + transactional email once per trip. Fields: `unsettled_balance_reminder_sent_at timestamptz nullable` on `trips`. Add to migration 0001.
>
> Full rationale: DECISIONS.md entry *2026-04-21 — Retention loop grill: 12 decisions locked.*

> **2026-04-21 Architecture & schema sanity grill (supersedes portions below)**
>
> This block is authoritative; sections below are historical context where they conflict.
>
> - **Trip state model: stored `lifecycle` vs computed 8-state.** Only `trips.lifecycle` (`active | vaulted | dreaming`) is persisted. The 8-state enum from STATE_MODEL.md is the return value of `computeState(trip, now)` in `src/lib/trip/state.ts` — never a stored column. Storing derived state is the #1 staleness trap.
> - **Permissions model: role-only at launch.** `trip_members.role` enum (`organizer | trusted | member`) is the only permission primitive. The `permissions` JSONB override column is dropped. Per-user capability toggles return post-launch only if real configuration need emerges.
> - **Offline is deferred — not a launch architecture concern.** The "design with it in mind from the start" stance below is struck. Offline premium feature moves to post-launch month 3+; revisit architecture decisions (service workers, cache strategy, write queueing, conflict resolution) when that feature is actually scoped. Designing for offline now would lock data shapes into unvalidated constraints.
> - **Expense receipts: Vercel Blob + `expense_receipts` table.** Manual receipt upload is in launch scope. Clarifies the "no image hosting" stance below: *no user photo hosting; expense receipts are functional attachments on Vercel Blob with signed URLs.* User-generated photo uploads (profile avatars uploaded as images, trip photos, etc.) remain deferred.
> - **Premium audit ledger: `supporter_entitlements` table added.** `users.supporter_entitled_at` is the hot-path lookup; ledger stores source, external_id, amount, purchased_at, refunded_at for refund/dispute trails.
> - **Settlement data shape: per-pair via `settlements` ledger, not per-split.** `expense_splits.settled_at` is dropped. Balance formula: `sum(splits owed) - sum(splits paid) - sum(settlements from user) + sum(settlements to user)`.
> - **Affiliate click attribution: PostHog events, no bespoke `affiliate_clicks` table.** Partner dashboards handle revenue attribution; PostHog logs chip taps.
> - **Owner-deletion cascade: `ON DELETE restrict` retained on `trips.owner_id`.** Transfer-before-delete handled in `deleteUserAccount(userId)` app service. Restrict is the safety net against accidental orphaning.
>
> See SCHEMA_DRAFT.md for the 12-table launch canonical list and migration 0001 scope.
> Full rationale: DECISIONS.md entry *2026-04-21 — Architecture & schema sanity grill: 12 decisions locked.*

> **2026-04-20 Roadmap Grill Revision (supersedes portions below)**
>
> - **Real-time group collaboration:** optimistic UI + last-write-wins at the field level. When two members edit the same field within 10 seconds, show a soft conflict toast to the losing writer (*"Sara also edited this — your change was saved. Refresh to see the latest."*). CRDT-based collab (Yjs or similar) is explicitly **Post-MVP** — not in beta, not in Public MVP. Beta groups (~20 users) will hit edge cases here; document them, don't pre-solve them.
> - **Native wrap:** Expo or React Native. **Scoped during Public MVP (weeks 13–24)**, ships Month 3–6 post-launch. Travel Day is meaningfully worse in mobile browsers (no lock-screen info, no reliable push, no offline-by-default). Web-first stays for planning phase; native becomes the Travel/Vacation Day surface.
> - **Stack confirmed:** Next.js · Drizzle ORM · Better Auth. No changes from prior decisions.
> - **Beta uses mock affiliate/Stripe links.** UI surfaces exist (to validate layout) but point at non-affiliate URLs; Stripe replaced with a placeholder sheet. Live integrations wire up at Public MVP.
>
> Full rationale: DECISIONS.md entry *2026-04-20 — Roadmap grill: 11 decisions locked (re-grill corrected).*

---

This document describes the intended technical shape of the product before the backend is fully implemented.

## Architecture Goals

- keep the stack lean and cost-aware
- make the web app stable before packaging for mobile
- support collaboration without overengineering too early
- leave room for offline-capable reads later
- keep premium gating easy to reason about
- build features without paid third-party APIs wherever possible

## Confirmed Stack

- **Next.js App Router** — web framework
- **React + TypeScript** — UI layer
- **Tailwind CSS** — styling
- **Neon Postgres** — primary database (shared $25/month plan)
- **Vercel** — hosting and deployment (shared $25/month plan)
- **Resend** — password reset email only. TripWave does not send invite emails or notification emails.
- **Azure** — receipt scanning OCR (premium feature only, pay-per-use)
- **Drizzle ORM** — TypeScript-native, SQL-first, lightweight runtime (locked 2026-04-20, see DECISIONS.md). Schema at `src/lib/db/schema.ts`. Initial schema draft at docs/SCHEMA_DRAFT.md.
- **Auth provider to be decided** — Better Auth confirmed direction, configuration TBD
- **Payment processor to be decided** — needed for one-time $7.99 premium purchase (Stripe likely)

### What we are NOT using

- Image hosting — TripWave is a text-first product with no photo uploads
- Subscription billing infrastructure — premium is a one-time payment, not recurring
- Paid planning or suggestion APIs — smart suggestions are deterministic rule-based logic initially
- Real-time infrastructure — not needed at MVP, collaboration through standard request-response

### Cost model

TripWave shares Vercel and Neon subscriptions with another app, making marginal infrastructure cost low. Azure receipt scanning is pay-per-use and only triggered for premium users. Resend is usage-based and low-volume initially.

## Application Layers

### Presentation Layer

- marketing routes (public)
- auth routes (login, signup, password reset)
- authenticated app shell
- trip workspace routes (phase-based)
- reusable UI components
- ad slots (free tier only)

### Product Logic Layer

- next best action engine
- trip lifecycle state rules
- trip phase recommendation rules
- planning suggestion logic (vibe-aware, destination-aware)
- checklist progression
- permission checks (per-user, per-trip)
- premium entitlement checks
- trip health / readiness score computation
- trip ball fill computation (preplanning completeness → fill percentage)

### Data Layer

- users
- trips
- trip members and per-user permission toggles
- itinerary items
- travel days
- checklists
- packing lists and items (with visibility and privacy flags)
- polls and votes
- expenses and splits
- settlements
- premium entitlements

## Initial Data Domains

> **Scope banner (2026-04-21):** The domain lists below describe the long-term data shape across every post-launch feature. **Only the 12 launch tables in SCHEMA_DRAFT.md exist at Public MVP launch.** Every table mentioned below that is not in that 12 is post-launch and will be added when its feature moves into active work. Do not create tables on this page's prompting alone — SCHEMA_DRAFT.md is the source of truth for what's live.

### User domain

- user
- profile
- premium_entitlement (one-time purchase record, not subscription)

### Trip domain

- trip
- trip_member (with per-feature permission flags)
- invite_code
- destination
- trip_status_history (later if useful)

### Planning domain

- itinerary_item
- trip_day
- travel_day_plan
- checklist
- checklist_item
- packing_list (with is_visible_to_group flag)
- packing_item (with is_private flag)
- preplanning_field (structured fields for the preplanning wizard)

### Collaboration domain

- poll
- poll_option
- vote
- note (later if needed)

### Finance domain

- expense (with include_in_report flag per report context)
- expense_split
- settlement
- budget (per trip, with optional per-category budgets)

### Tools domain

- currency_rate_snapshot (daily snapshot for currency converter, offline-capable)
- phrasebook_entry (language, category, phrase, translation, pronunciation -- static seed data)
- destination_reference (country/region lookup: plug type, voltage, road side, tipping norms, transit notes)
- destination_holiday (country, date, name, type: closure or festival)
- destination_seasonal_risk (country/region, date range, risk type, severity, description)
- confirmation_entry (trip-scoped, label, code, provider, date, notes -- text only, no images)
- scavenger_hunt_item (trip-scoped, description, point value, completed_by, completed_at)
- meetup_broadcast (trip-scoped, user, message, created_at -- clears daily)
- medication_reminder (user-scoped, private, label, time, timezone_adjust flag)
- trip_statistic (auto-generated at wrap-up, key-value pairs of computed trip facts)
- post_trip_poll (built on existing poll infrastructure, tagged as post_trip type)
- shopping_list_item (trip-scoped, label, assignee, is_complete, optional expense link)

## Route Strategy

All app features require authentication. Public routes are limited to marketing and auth.

### Public routes

- `/` — marketing landing page
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/legal`
- `/contact`

### Authenticated routes

- `/app` — authenticated entry / dashboard
- `/app/trips` — trip list
- `/app/trips/[tripId]` — trip overview
- `/app/trips/[tripId]/setup`
- `/app/trips/[tripId]/preplanning`
- `/app/trips/[tripId]/itinerary`
- `/app/trips/[tripId]/packing`
- `/app/trips/[tripId]/travel-days`
- `/app/trips/[tripId]/vacation-days`
- `/app/trips/[tripId]/expenses`
- `/app/trips/[tripId]/polls`
- `/app/trips/[tripId]/wishlist`
- `/app/trips/[tripId]/notes`
- `/app/trips/[tripId]/tools`
- `/app/trips/[tripId]/tools/weather`
- `/app/trips/[tripId]/tools/phrasebook`
- `/app/trips/[tripId]/tools/currency`
- `/app/trips/[tripId]/tools/documents`
- `/app/trips/[tripId]/tools/emergency`
- `/app/trips/[tripId]/tools/converter`
- `/app/trips/[tripId]/tools/tipping`
- `/app/trips/[tripId]/tools/adapter`
- `/app/trips/[tripId]/tools/jetlag`
- `/app/trips/[tripId]/tools/splitter`
- `/app/trips/[tripId]/tools/meetup`
- `/app/trips/[tripId]/tools/scavenger`
- `/app/trips/[tripId]/tools/shopping`
- `/app/trips/[tripId]/tools/availability`
- `/app/trips/[tripId]/vault`
- `/app/trips/[tripId]/memory`
- `/app/trips/[tripId]/settings`
- `/app/trips/[tripId]/settings/members`
- `/app/account`
- `/app/account/premium`

## Logic Services To Expect

These do not need to exist immediately as separate code modules, but the app should eventually have clear logic ownership for:

- trip status calculation
- recommended phase calculation
- next best action calculation
- preplanning completeness calculation (feeds trip ball fill %)
- readiness score computation (6 dimensions)
- permission checks (per user, per feature, per trip)
- premium entitlement checks
- vibe-aware suggestion engine (deterministic rules)
- currency rate management (fetch, store, serve)

## Offline Strategy

**Deferred. Revisit when the offline premium feature is scoped, month 3+ post-launch.**

Offline is not a launch architecture concern. Premium at launch = ad removal only. Designing data shapes, cache strategies, service workers, or write-queueing now would lock the codebase into unvalidated constraints — offline conflict resolution in particular cannot be designed correctly without knowing what users actually do offline. When the feature moves into active scope, re-open this section with a fresh grill.

Historical planning notes (pre-2026-04-21) preserved for when offline work resumes:

- critical trip data should be cacheable
- read-heavy surfaces should degrade gracefully
- offline writes may need queueing later
- initial target surfaces: itinerary read access, travel-day checklist, packing list visibility, addresses and reservation notes

## Security and Permissions

**Launch model (locked 2026-04-21 architecture grill): role-only, three roles.**

- `organizer` — trip creator; full access including delete, settings, member management.
- `trusted` — promoted member; can edit itinerary events, add/edit/delete their own and others' itinerary items.
- `member` (default on invite accept) — can view everything, log expenses, check packing items; cannot edit itinerary events.

The `trip_members.permissions` JSONB override column was considered but dropped — no launch surface configures per-user capability overrides, and a write-never column is capability-debt. Post-launch, if real per-user overrides emerge, re-adding a JSONB column is a trivial additive migration.

Universal rules:

- account required for all app features — no anonymous or guest access
- one paid organizer owns each trip; ownership transfers via `deleteUserAccount(userId)` service before hard-delete (never via FK cascade — `ON DELETE restrict` is the safety net)
- authorization checks live in app services (`src/lib/trip/auth.ts` or similar), not in DB triggers

**Role capability matrix (launch):**

| Capability | organizer | trusted | member |
|---|---|---|---|
| View trip | ✓ | ✓ | ✓ |
| Log expenses | ✓ | ✓ | ✓ |
| Split/settle expenses | ✓ | ✓ | ✓ |
| Check packing items | ✓ | ✓ | ✓ |
| Add/edit/delete itinerary events | ✓ | ✓ | — |
| Edit budget | ✓ | ✓ | — |
| Invite members | ✓ | — | — |
| Manage members / promote to trusted | ✓ | — | — |
| Trip settings · delete trip | ✓ | — | — |

## Ad Integration

- ads are rendered in the free tier on web and app
- premium entitlement check hides all ad slots
- ad placements are defined at the component level with a isPremium guard
- good placements: dashboard idle states, between sections, transition screens
- protected from ads: travel-day execution, mid-checklist, expense entry, active forms

## Cost Principles

- prefer Vercel-native-friendly patterns
- avoid expensive background systems early
- avoid premature real-time infrastructure
- defer OCR and AI features until ROI is clear
- no image hosting — text-first product
- build tools (currency converter, timezone info) without paid API subscriptions where possible

## Open Architecture Questions

- How much app state should live server-side vs client-side?
- When should we introduce background jobs (departure reminders, expense nudges)?
- Should currency rates be fetched server-side on a schedule or on-demand client-side?
- How should offline sync conflicts be resolved when a user edits offline and reconnects?
