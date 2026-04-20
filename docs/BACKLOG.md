# Backlog

This backlog tracks active and next-up work only. **Spine = the CORE_LOOP.md 7-step must-prove loop + monetization.** Post-MVP features live in ROADMAP.md → Post-MVP Feature Backlog.

Implementation sequencing rule (locked 2026-04-20): foundation first (ORM → DB schema → auth → shell), then each spine page full-stack one at a time. Step-1 detail inventory written immediately before coding that page — not in advance, not after.

---

## In Progress

- App shell and navigation (desktop bento-grid + mobile pill-bar)
- Setup page view + edit (UI only, mock data — needs real backend wired after schema lands)

---

## Build Workflow Audit — Step-1 inventories owed (spine pages only)

Write the inventory immediately before coding that page. Do not batch ahead.

- [ ] Signup page
- [ ] Login page
- [ ] Dashboard (`/app`)
- [ ] Trip creation flow (per-step: Real/Dream picker + 4 setup steps)
- [ ] Trip overview — brand-new state
- [ ] Trip overview — established state
- [ ] Preplanning hub
- [ ] Lodging preplanning section editor (first section, locked 2026-04-20)
- [ ] Itinerary page
- [ ] Invite organizer page
- [ ] Invitee join landing
- [ ] Expenses page
- [ ] Travel Day planning-phase page
- [ ] Travel Day focus mode
- [ ] Trip ball modal

---

## P0 — Active Foundation Work

### Immediate technical blockers (must land before any feature page is real)

- [ ] Install drizzle-orm + drizzle-kit + postgres; create `src/lib/db/schema.ts` and `drizzle.config.ts`
- [ ] Define initial DB schema: users, trips, trip_members, itinerary_items, expenses, splits, settlements, packing_items, travel_day_tasks, polls, votes, premium_entitlements
- [ ] Model trip status, readiness, and next-action fields (per STATE_MODEL.md)
- [ ] Model preplanning fields and completion tracking
- [ ] Add environment variable strategy (`.env.local` + Vercel env config)
- [ ] Set up Better Auth (configure sessions, user model, password reset — auth provider confirmed)
- [ ] Set up Resend for password reset email only (no invite or notification emails)

### Frontend foundation

- [ ] Define Tailwind color tokens for the dark surface system (base, raised, elevated, border)
- [ ] Build shared app shell layout (desktop bento-grid per § 42, mobile pill-bar)
- [ ] Build mobile collapsible sidebar (slide-in from left, hamburger toggle, overlay)
- [ ] Build desktop left-rail phase navigation
- [ ] Add reusable section and panel primitives (cards on raised surface, elevated modals)
- [ ] Verify all surface color contrast ratios meet WCAG 2.1 AA

---

## P0 — UX Pass (spine-critical cross-page integrations)

- [ ] Unified Proposal data model (status: Must Do / Proposed / Approved / Scheduled)
- [ ] Itinerary ↔ Vacation Days shared event data model (single source of truth)
- [ ] Quick-action toolbar spec: Log Expense, Create Poll — opens modal/sheet from any trip workspace page
- [ ] Scavenger Hunt route and sidebar tab (`/app/trips/[tripId]/scavenger-hunt`)
- [ ] Per-page first-visit tooltip (brief popup, dismissed once per user, stored in user prefs)

---

## P1 — MVP Spine Build

Build in this order. One page fully working before the next begins.

### 1. Auth

- [ ] Signup page (full-stack: UI + Better Auth route)
- [ ] Login page (full-stack)
- [ ] Password reset flow (full-stack, Resend email)
- [ ] Session persistence and auth guard on all app routes

### 2. App shell

- [ ] Top bar: trip switcher, notification bell, account avatar dropdown
- [ ] Trip switcher dropdown (with "Join a trip" footer item per § 42.6)
- [ ] Notification bell panel (in-app only)
- [ ] Desktop left-rail phase nav with active state + recommended phase badge
- [ ] Mobile pill-bar (48px height, ≥44px touch targets) + collapsible sidebar
- [ ] Context panel: blockers / next-action / healthy calm (3 states per § 42.10)
- [ ] Dashboard (`/app`): next-up card + trip list + action center + zero-trip first-run state

### 3. Trip creation flow

- [ ] Step 0: Real vs Dream picker
- [ ] Steps 1–4: name, dates, destinations, transport mode, traveler count, type, vibe, ball color, budget, invite mode
- [ ] Silent defaults at creation (per UX_SPEC § 3)
- [ ] Draft → Planning state transition on creation
- [ ] Post-creation lands on trip workspace

### 4. Trip overview

- [ ] Brand-new state: setup incomplete hero, preplanning CTA, invite CTA
- [ ] Established state: ball, health tiles, phase summary cards, next-action card
- [ ] Context panel wired (blockers + next-action)

### 5. Preplanning hub + Lodging section editor

- [ ] Preplanning hub: 8 section cards, completion %, ball fill, recommended phase badge
- [ ] Lodging section editor end-to-end (all fields per BACKLOG § Preplanning page spec, save, completion tracking)
- [ ] Preplanning completion % computation drives ball fill

### 6. Itinerary

- [ ] Day-by-day view: all-day items first, then chronological within day
- [ ] Day header with destination label
- [ ] Item card anatomy (§ 7): category stripe + icon, time, title, location, duration, badges
- [ ] Add/Edit item modal (§ 7a): shared fields + "More details" expander per category, permission constraints, pre-fill from wishlist/poll
- [ ] Conflict indicator (orange triangle) when two items overlap
- [ ] Drag-to-reorder (unscheduled items only)
- [ ] Filter: All / Day / Category

### 7. Invite flow

- [ ] Organizer invite page: generate link, copy link, QR code, expiration (end date + 7 days)
- [ ] Invite modes: private / invite-only / public-link (per UX_SPEC § 18)
- [ ] Invitee join landing: trip preview card, join CTA (unauthenticated)
- [ ] Post-join sequence: Splash → Must Dos full-screen → workspace + profile banner (§ 19)
- [ ] Members page: role preset management, demotion behavior, self-leave, removed member read-only, pending list for all (§ 21)
- [ ] Regenerate-link confirmation modal

### 8. Expenses

- [ ] Balances hero: who owes whom, net debt display
- [ ] Ledger: all expenses, sortable, per-expense detail
- [ ] Add expense: amount, description, date, category, payer, split method (even / custom / single / selected)
- [ ] Debt simplification: net balances, not raw pairs
- [ ] Mark settled: both sides mark independently; both marked = resolved
- [ ] Budget tile: target, spent, remaining, overage warning
- [ ] Multi-currency display (entry in any currency; conversion is premium, stub paywall here)
- [ ] Receipt scan button (premium paywall stub; Azure OCR deferred to post-MVP)

### 9. Travel Day

- [ ] Planning-phase task editor: segment groups, hybrid inline add + slide-up modal for full edit
- [ ] "Generate checklist from your trip" opt-in button
- [ ] Two-level drag: reorder segments + tasks within segment
- [ ] Focus mode: your-tasks-first view, skip per leg, manual add link
- [ ] "We've arrived" explicit CTA on final segment
- [ ] Offline: Travel Day always accessible offline, always free (no premium gate)

### 10. Trip ball modal

- [ ] SVG/Canvas ball with ocean-wave pulse animation
- [ ] Fill animation driven by preplanning completion %
- [ ] Per-trip ball color picker (brand palette swatches + custom hex)
- [ ] Ball states: empty, filling, full, alert, celebrating, sleeping
- [ ] Alert agitation animation for blocker states
- [ ] Modal: fill breakdown, color picker, phase status summary

### 11. Notifications bell

- [ ] In-app notification list panel
- [ ] Unread badge count on bell icon
- [ ] Triggers: poll closed, expense settled, trip invite, travel day reminder, new member joined, bonus slot earned

### 12. Premium purchase sheet (Stripe web)

- [ ] $2.99 Stripe SKU for founder's cohort (capped at 1,000 purchases)
- [ ] $4.99 Stripe SKU for standard (activates after founder's cap)
- [ ] Founder's counter visible on marketing site ("823 of 1,000 spots left")
- [ ] Price transition logic: auto-switch to $4.99 after 1,000 founder purchases
- [ ] Supporter framing copy throughout (per MONETIZATION.md § 5)
- [ ] Post-first-trip prompt: fires once per account lifetime after first trip vaults (per § 25)
- [ ] "Support TripWave ♥" entry always present in account menu
- [ ] Premium entitlement flag in user model (permanently unlocked on purchase)
- [ ] Founder badge visual on account profile

### 13. Ad banner + ad zones

- [ ] Ad slot component with `isPremium` guard (hidden for all premium users)
- [ ] Banner: bottom-fixed on dashboard idle state + vault page
- [ ] Native card: after 3rd–4th section tile in preplanning hub
- [ ] "Remove ads — $4.99" small link on ad unit
- [ ] Ad network research and integration (Google AdSense, Carbon, or other)
- [ ] Permanently ad-free zones enforced: Travel Day, Vacation Day, expense entry, polls/voting, modals, onboarding, invite flow

### 14. Mobile polish + responsive pass

- [ ] Pill-bar height 48px, all touch targets ≥ 44px
- [ ] Container-query responsive bands (per DESIGN_SYSTEM.md)
- [ ] Context panel: always-present desktop bento; collapsed mobile

### 15. Dashboard hybrid

- [ ] Next-up card (highest-priority trip: ball + phase + next action)
- [ ] Trip list (active + stale + vaulted, sorted by relevance)
- [ ] Action center (open tasks: pending polls, unsettled expenses, unread invites)
- [ ] Zero-trip first-run: ritual handoff with trip creation CTA

### 16. Settings

- [ ] Trip info: name, dates, destinations (edit in-place)
- [ ] Danger zone: archive trip, delete trip (confirmation modal)
- [ ] Account: display name, avatar, password change, premium status

---

## Launch Checklist (v1 floor = spine + monetization live)

- [ ] New user completes full spine loop without errors (sign up → trip → invite → preplan → itinerary → travel day → expenses)
- [ ] Premium purchase works end-to-end (Stripe web, $2.99 founder's + $4.99 standard)
- [ ] Founder's counter live on marketing site
- [ ] Ad banner renders on free tier; absent on premium
- [ ] Legal + contact pages live (stubs acceptable)
- [ ] `/accessibility-review` run on every spine page before merge
- [ ] No console errors in production build
- [ ] Auth session persistence verified across reload + return visit

---

## Monetization setup items (pricing locked 2026-04-20)

- [ ] All code and copy pricing references updated: $4.99 standard, $2.99 founder's (remove all stale $7.99 refs)
- [ ] Stripe SKUs configured: $2.99 founder's + $4.99 standard (web)
- [ ] Platform tier configured for iOS / Android: Tier 3 founder's, Tier 5 standard equivalent
- [ ] Private beta plan: 50–150 users, permanent free premium entitlement
- [ ] Beta entitlement flag in user model (separate from paid premium flag)
- [ ] Pre-launch landing page: email waitlist + trip-ball demo + founder's pricing copy
- [ ] Build-in-public channel chosen (TikTok or Threads); cadence: 2–3 posts/week
- [ ] ONE niche community chosen; genuine participation begins 6 months pre-launch
- [ ] Viral slot reward: +1 free slot when invitee starts own trip (cap: +3 bonus slots, max 7 total)
- [ ] Soft cross-promote banner in invitee first-session

---

*Post-MVP features → ROADMAP.md → Post-MVP Feature Backlog*
