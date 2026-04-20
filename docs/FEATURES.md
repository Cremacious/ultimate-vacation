# TripWave — Feature Index

> **Sync rule.** Editing this doc requires checking `PITCH.md` in the same commit. Both tell TripWave's user-facing story — both must agree. When a feature is added, renamed, removed, or re-classified, update this doc and update `PITCH.md` if the change affects what TripWave *is* at the layman-pitch level.

---

## What this doc is

The canonical list of every feature TripWave offers — organized by the product surface it lives in, tagged by release phase, free/premium tier, revenue role, and marketing surface.

Written to be the single reference you open when drafting:

- landing-page copy
- a waitlist email
- an ASO screenshot caption
- a press pitch
- a Product Hunt launch post
- a TikTok / Threads build-in-public post
- a Reddit comment where someone asks *"so what does your app do?"*

## What this doc is NOT

- Not a replacement for `UX_SPEC.md` — UX_SPEC remains the authoritative source for feature-level UX detail, interaction behavior, and grilled design decisions.
- Not a replacement for `MONETIZATION.md` — MONETIZATION remains the authoritative source for premium framing copy, revenue math, and monetization rationale.
- Not a replacement for `CORE_LOOP.md` — CORE_LOOP remains the authoritative source for MVP-vs-Later-vs-Speculative priority reasoning and the 16-item build order.
- Not the place for implementation status, design tokens, code references, or grill-me history — those live in their existing homes.

This doc answers one question: **what features exist, and where do they show up externally?**

---

## How to read each section

Each functional area has:

- A short intro — what lives here and a pointer to the source doc(s) for depth
- A feature table with 6 columns

### Column definitions

| Column | Meaning |
|---|---|
| **Feature** | Short name. Parent features are **bold**; child features use `Parent: child` form. |
| **Phase** | `MVP` (ships in v1) / `Later` (post-MVP but specced) / `Speculative` (vision, not committed) |
| **Tier** | `Free` / `Premium` / `Free+Premium` (free version exists, premium gets a bonus) |
| **Revenue role** | `free-utility` / `premium-gift` / `affiliate-driver` / `ad-supported` / `retention-hook` / `viral-loop` / `none` |
| **Marketing surface** | `landing-hero` / `ASO-1`…`ASO-8` / `waitlist-email` / `press-angle` / `in-product-only` / `none` |
| **What it is** | One sentence, ≤150 chars, active voice |

---

## Table of contents

- [Marketing pillars](#marketing-pillars)
- [1. Auth & Account](#1-auth--account)
- [2. Dashboard & Trip Switcher](#2-dashboard--trip-switcher)
- [3. Trip Creation](#3-trip-creation)
- [4. Trip Workspace — Overview](#4-trip-workspace--overview)
- [5. Trip Workspace — Preplanning](#5-trip-workspace--preplanning)
- [6. Trip Workspace — Itinerary](#6-trip-workspace--itinerary)
- [7. Trip Workspace — Expenses](#7-trip-workspace--expenses)
- [8. Trip Workspace — Travel Day](#8-trip-workspace--travel-day)
- [9. Trip Workspace — Members & Invites](#9-trip-workspace--members--invites)
- [10. Dream Mode](#10-dream-mode)
- [11. Premium & Supporter Moments](#11-premium--supporter-moments)
- [12. Marketing Surfaces](#12-marketing-surfaces)
- [13. Retention Surfaces](#13-retention-surfaces)
- [14. Affiliate & Ads](#14-affiliate--ads)
- [Open questions](#open-questions)

---

## Marketing pillars

TripWave rolls up to three stories. Each pillar is quotable verbatim in a tweet, an ASO subtitle, a waitlist email, or a press pitch. If you're writing marketing copy and can't tie it to one of these pillars, question whether the copy belongs.

### Pillar 1 — Group-first planning

Everyone on the trip sees the same plan, in one place. The organizer isn't herding cats across 17 group chats. The invitees aren't asking *"what time are we leaving?"* at 2am the night before. Every TripWave feature exists to make group trips feel like one shared project, not seven disconnected ones.

### Pillar 2 — Calm travel-day mode

Most trip apps bail on you the moment the actual travel starts. TripWave's Travel Day focus mode is designed for the stressed, sleep-deprived airport version of you — big checkboxes, one phase at a time, ads suppressed, decisions pre-made.

### Pillar 3 — Supporter-framed premium

$7.99 once, no subscriptions. Built by one person. Premium is how you say thanks — in return you get no ads and some fun bonus gifts. Never corporate, never scarcity-pushed, never pressured. A little ♥ in the app acknowledges it's a solo dev keeping the lights on.

---

## 1. Auth & Account

User identity, sign-in, and personal preferences. TripWave requires a full account for all features — no guest mode, no email-only flows, no phone numbers. Email is used only for password reset (never for marketing or newsletters). Planned auth library: Better Auth. See `UX_SPEC.md` §§ 31 Signup, 32 Login, 28 Traveler Profile, and `MONETIZATION.md` §§ 1 Customer Model, 11 Launch Pricing, 20 Refund Policy, 21 Family Plan.

| Feature | Phase | Tier | Revenue role | Marketing surface | What it is |
|---|---|---|---|---|---|
| **Auth & Account** | MVP | Free+Premium | free-utility | in-product-only | Identity, sign-in, profile, premium status, and solo-dev About section — account required for all features. |
| Auth & Account: Signup page (`/signup`) | MVP | Free | free-utility | in-product-only | Name + email + password. Neon-on-dark, dashed cyan ball, solo-dev ♥ footer. No social auth in v1. |
| Auth & Account: Login page (`/login`) | MVP | Free | free-utility | in-product-only | Email + password. Minimal warm return, sad-shake on wrong password, Forgot-password link. |
| Auth & Account: Password reset | MVP | Free | free-utility | in-product-only | The only email TripWave ever sends. Resend-delivered reset link → new password. |
| Auth & Account: Traveler profile — basic | MVP | Free | free-utility | in-product-only | Name, avatar, read-only email. Account-level defaults that pre-fill every new trip's profile. |
| Auth & Account: Traveler profile — advanced | Later | Free | free-utility | in-product-only | Dietary, medical, emergency contact, preferred units. Per-field privacy toggles. |
| Auth & Account: Account page (`/app/account`) | MVP | Free+Premium | free-utility | in-product-only | Hub: profile summary card, About section, Premium section, settings entry points. |
| Auth & Account: About section (solo-dev ♥) | MVP | Free | none | in-product-only | *"Made with ♥ by one person."* One of three solo-dev honesty moments in the app. |
| Auth & Account: Premium section | MVP | Free+Premium | premium-gift | in-product-only | Shows premium status; purchase link if free; refund + family-plan links if premium. |
| Auth & Account: Refund link | MVP | Premium | none | in-product-only | *"Refund this purchase"* auto-fills request email. 30-day no-questions-asked policy. |
| Auth & Account: Founder badge | MVP | Premium | premium-gift | press-angle | Permanent badge for the first-1,000 founder-pricing supporters. Share-on-social status marker. |
| Auth & Account: Family plan management | Speculative | Premium | premium-gift | in-product-only | Tier-2-contingency feature. Primary adds up to 3 household members; secondaries self-leave. |

## 2. Dashboard & Trip Switcher

The dashboard (`/app`) is the signed-in home: a "Next up" hero for the soonest upcoming trip, a list of all your trips with their balls, and a "Needs your attention" action center aggregating items across trips. The trip switcher is the top-nav dropdown for jumping between trips. See `UX_SPEC.md` § 2 Dashboard and § Trip Switcher.

| Feature | Phase | Tier | Revenue role | Marketing surface | What it is |
|---|---|---|---|---|---|
| *(to populate)* | | | | | |

## 3. Trip Creation

The 4-step full-screen flow that turns an idea into a trip workspace: name → dates → color → reveal. Playful wipe transitions between steps; the trip ball is the star of the ritual. See `UX_SPEC.md` § 3 Trip Creation Flow.

| Feature | Phase | Tier | Revenue role | Marketing surface | What it is |
|---|---|---|---|---|---|
| *(to populate)* | | | | | |

## 4. Trip Workspace — Overview

The landing page inside a trip — two distinct states (brand-new trip vs established trip) that shape what users see first. Hosts the trip ball at full hero size and the next-best-action card. See `UX_SPEC.md` § Trip Overview.

| Feature | Phase | Tier | Revenue role | Marketing surface | What it is |
|---|---|---|---|---|---|
| *(to populate)* | | | | | |

## 5. Trip Workspace — Preplanning

The 8-section hub where trip details get filled in: Group, Transportation, Accommodations, Budget, Destination info, Documents & logistics, Trip character, Pre-departure logistics. Sections can be marked *Not applicable* and filled in any order. Progress fills the trip ball. See `UX_SPEC.md` § 4 Preplanning Wizard.

| Feature | Phase | Tier | Revenue role | Marketing surface | What it is |
|---|---|---|---|---|---|
| *(to populate)* | | | | | |

## 6. Trip Workspace — Itinerary

Day-by-day view of the trip's activities, meals, reservations, and flights. Full CRUD for any group member by default; organizer can adjust per-member permissions. See `UX_SPEC.md` § Itinerary.

| Feature | Phase | Tier | Revenue role | Marketing surface | What it is |
|---|---|---|---|---|---|
| *(to populate)* | | | | | |

## 7. Trip Workspace — Expenses

Log what's paid, who paid it, how it's split; show balances in one view; mark settled when paid outside the app (Venmo / cash / whatever). Expense tracking starts from day zero — pre-trip deposits count. See `UX_SPEC.md` § Expenses and `MONETIZATION.md` § 3 Free vs Premium Boundary.

| Feature | Phase | Tier | Revenue role | Marketing surface | What it is |
|---|---|---|---|---|---|
| *(to populate)* | | | | | |

## 8. Trip Workspace — Travel Day

Focus mode for the actual travel day — big checkboxes, one phase at a time (pre-departure → airport → on the plane → arrival), ads suppressed. On non-travel days the page shows a planning state. This is Pillar 2's showcase feature. See `UX_SPEC.md` § Travel Day.

| Feature | Phase | Tier | Revenue role | Marketing surface | What it is |
|---|---|---|---|---|---|
| *(to populate)* | | | | | |

## 9. Trip Workspace — Members & Invites

How people join the trip: organizer shares link / code / QR, invitees land on a branded join page, sign up if needed. Members list shows roles (organizer, contributor, viewer) with preset permissions. Also hosts the viral-loop surfaces (slot rewards, post-trip nudges). See `UX_SPEC.md` § Invite Flow and § Members, plus `MONETIZATION.md` § 10 Viral Invite Loop.

| Feature | Phase | Tier | Revenue role | Marketing surface | What it is |
|---|---|---|---|---|---|
| *(to populate)* | | | | | |

## 10. Dream Mode

A slim public-shareable variant of a regular trip. Same workspace, three differentiators: public share link, social reactions from any authenticated viewer, sparkle-ball visual. Free users get 1 dream; premium supporters get unlimited. The primary viral-acquisition surface. See `MONETIZATION.md` § 14 Dream Mode.

| Feature | Phase | Tier | Revenue role | Marketing surface | What it is |
|---|---|---|---|---|---|
| *(to populate)* | | | | | |

## 11. Premium & Supporter Moments

The $7.99 one-time purchase surface and the warm solo-dev moments that appear in three specific non-pushy places (premium purchase sheet, affiliate disclosure, account About section). Pillar 3's showcase. See `MONETIZATION.md` § 5 Premium Positioning and § 11 Launch Pricing Strategy.

| Feature | Phase | Tier | Revenue role | Marketing surface | What it is |
|---|---|---|---|---|---|
| *(to populate)* | | | | | |

## 12. Marketing Surfaces

Every external-facing surface that exists to bring users in or convert them once they're here: landing page, waitlist, Product Hunt / press angle, App Store listing, founder's pricing countdown, review prompts, ASO screenshot story arc. See `MONETIZATION.md` §§ 11, 19, 22, 23.

| Feature | Phase | Tier | Revenue role | Marketing surface | What it is |
|---|---|---|---|---|---|
| *(to populate)* | | | | | |

## 13. Retention Surfaces

Features designed to bring users back for trip 2+: Memory page as a permanent revisitable artifact, anniversary nudges, seasonal planning prompts, Dream Mode between-trips engagement. See `MONETIZATION.md` § 13 Retention Strategy.

| Feature | Phase | Tier | Revenue role | Marketing surface | What it is |
|---|---|---|---|---|---|
| *(to populate)* | | | | | |

## 14. Affiliate & Ads

The two revenue streams beyond premium. Affiliate = contextual chips during preplanning (Booking.com, Skyscanner, GetYourGuide) plus dedicated search tools in the Tools hub. Ads = banner + native cards for free users, suppressed during stressful moments. See `MONETIZATION.md` §§ 8 Ad Integration and 12 Affiliate Revenue.

| Feature | Phase | Tier | Revenue role | Marketing surface | What it is |
|---|---|---|---|---|---|
| *(to populate)* | | | | | |

---

## Open questions

*Unresolved items. Each gets a bullet here until it's decided and the decision moves into the appropriate section's table.*

- *(to populate as section tables are built out and ambiguities surface)*

---

## Provenance

- **Structure locked:** 2026-04-20 (see `DECISIONS.md` entry of same date)
- **Populated:** per section, as work progresses
- **Primary sources cross-referenced:** `PITCH.md`, `CORE_LOOP.md`, `UX_SPEC.md`, `MONETIZATION.md`, `ROADMAP.md`, `BACKLOG.md`
