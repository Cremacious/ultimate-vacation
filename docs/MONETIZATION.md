# Monetization

This document defines how the app should make money while staying genuinely useful. The goal is not just to add a paywall. The goal is to build a product that people feel relieved to pay for.

## Business Goal

Build a high-margin vacation planning product with:

- low infrastructure cost
- strong perceived value
- clear free-to-paid upgrade path
- premium features that feel powerful, not petty

## Core Monetization Principle

Free should prove the product.

Premium should save the trip.

That means free users should understand the app quickly and get real utility, but the features that reduce chaos the most — and the ads that would otherwise interrupt them — sit behind the upgrade.

## 1. Discoverability and Monetization Visibility

Pricing and monetization are **never shown on the landing page or any marketing surface**. The product is presented as free. Users discover limits and premium features naturally through usage.

- Landing page: no pricing, no plan comparison, no mention of premium
- The word "free" is used prominently on marketing surfaces to attract signups
- Premium is surfaced only after account creation, through natural paywalls and a subtle "Get Premium" or "Remove Ads" entry point in the app
- Users should assume the product is fully free until they encounter a paywall organically
- The upgrade flow explains premium benefits and the $5 price only at that moment

Landing page goal: sell the idea of one app that handles all trip planning details — show off every feature, emphasize free access, drive signups.

## 1. Customer Model

Primary customer:

- one organizer who plans the trip and wants everyone else to stop being disorganized

Secondary users:

- invited participants who benefit from the trip workspace

### Recommended commercial rule

Charge the organizer, not every participant.

This is simpler, more understandable, and better aligned with the user's original intent.

## 2. Pricing Model

### One-time $5 premium unlock

Premium is a single one-time purchase per account — not a subscription.

Why this model:

- low friction for the core audience (people planning a single important trip)
- no recurring billing guilt
- strong perceived value relative to the price
- ad revenue covers operating costs; premium is additive margin

### Ad-supported free tier

The free experience is ad-supported on both web and app.

- ads are placed thoughtfully and do not interfere with core trip actions
- premium removes all ads permanently
- ad revenue is expected to cover infrastructure overhead even at low user volumes

### Revenue expectation model

Infrastructure costs (shared across two apps on the same accounts):

- Vercel: $25/month shared
- Neon: $25/month shared
- Azure: pay-per-use for receipt scanning (premium only, cost passed to premium users)
- Resend: usage-based for password reset and transactional email

TripWave requires no image hosting. User data is primarily text, keeping storage costs low.

Ad revenue should cover Vercel + Neon costs. Azure receipt scanning costs are absorbed by premium volume.

## 3. Free vs Premium Boundary

### Keep free

- create account
- 4 trip slots total (active, stale, and vaulted all count against the same limit; creating a trip and joining a trip each use one slot)
- full trip setup and preplanning wizard
- itinerary building (full CRUD, all users can contribute)
- packing lists (personal and shared visibility)
- invite participants via code or link
- polls and group voting
- expense tracking, splitting, and settlement
- budget setting and end-of-trip summary
- trip health ball and phase guidance
- basic tools (time zone info, basic planning prompts)

### Make premium (one-time $5)

- **50 trip slots** — up from 4 (active, stale, and vaulted combined)
- **Ad removal** — permanent ad-free experience
- **Offline mode** — itinerary, packing, travel-day access without internet (high priority premium)
- **Receipt scanning** — Azure-powered OCR to log expenses from photos
- **Currency converter** — live conversion tool built into expense and budget flows
- **Smart suggestions** — destination-aware and vibe-aware planning recommendations
- **Advanced travel-day templates** — pre-built departure day structures
- **Trip export** — export itinerary as shareable or printable format
- **Trip templates** — save and reuse a trip structure for future trips

### Intentionally kept free

These were previously considered premium candidates but are now free:

- polls and voting (group coordination should not be paywalled)
- expense splitting and settlement (basic financial fairness is a core feature)

## 4. Strongest Premium Features

### A. Offline Confidence (highest priority)

Why it converts:

- credible travel-specific value — planes, remote areas, bad signal
- solves a real fear users have before a trip

Includes:

- offline itinerary read access
- offline travel-day checklist
- offline packing lists
- offline addresses and reservation notes

### B. Ad Removal

Why it converts:

- instant and visible benefit
- low-cost to deliver, high perceived value
- natural motivation before departure when users are in the app daily

### C. Receipt Scanning

Why it converts:

- adds real convenience during the trip
- justifies the premium tier on its own during expense-heavy group trips

Implementation:

- uses Azure Computer Vision or Azure Form Recognizer
- premium-only feature — cost is absorbed by premium revenue
- free users see the feature UI with an upgrade prompt

### D. Currency Converter

Why it converts:

- immediately useful for international trips
- a tool users will reach for repeatedly

Implementation:

- uses a free or self-managed currency rate source where possible
- updated on a reasonable schedule (daily or on-demand)
- built into expense entry and budget views

### E. Smart Suggestions

Why it converts:

- feels personalized and elevated
- vibe-aware planning helps users feel understood

Includes:

- packing suggestions based on destination climate and trip type
- itinerary ideas based on trip vibe (beach, city, adventure, family, etc.)
- seasonal warnings (hurricane season, monsoon, extreme heat)
- document checklists based on destination (visa, passport expiry, vaccinations)

## 5. Conversion Moments

Premium prompts should show up where the user already feels the need.

### High-intent upgrade moments

- user is on a plane or heading to a low-signal area and wants offline access
- user tries to scan a receipt
- user is planning an international trip and wants currency conversion
- user wants smart packing suggestions tuned to their destination
- user wants to export the itinerary before departure
- user sees an ad during active trip planning

### Good paywall style

- informative
- stylish
- lightly cheeky
- never punishing

Example tone:

- "You can absolutely wing this. Or you can unlock the tools that save the trip."
- "$5 once. No subscriptions. No guilt."

## 6. Profit Strategy

Profit comes from disciplined scope as much as revenue.

### Low-cost product strategy

- keep hosting on Vercel (shared with existing subscription)
- keep primary data in Neon (shared with existing subscription)
- no image hosting — TripWave is text-first
- use Azure only for receipt scanning (premium-gated)
- use Resend only for transactional email (password reset, invite notifications)
- build tools without paid APIs wherever possible
- avoid speculative AI infrastructure early

### Margin protection rules

- favor deterministic product logic before AI features
- use premium to fund the one expensive external service (Azure OCR)
- avoid giving away the most support-heavy features for free

## 7. Feature Cost Awareness

### Low-cost features with strong value

- phase guidance
- next best action
- travel-day checklist logic
- packing workflows
- invite code flows
- polls and voting
- expense tracking and settlement

### Medium-cost features

- collaborative editing polish
- offline sync
- advanced notifications via Resend

### High-cost features to gate behind premium

- receipt OCR via Azure
- currency conversion (rate data source TBD — prefer free/self-managed)
- smart suggestions (deterministic rules first, no AI cost initially)

## 8. Ad Integration Notes

- ads are shown in the free tier on web and app
- ad placement should not interrupt core trip actions (itinerary editing, travel-day mode, expense entry)
- good ad placements: dashboard idle states, between sections, transition screens
- bad ad placements: during travel-day execution, mid-checklist, mid-expense entry
- premium permanently removes all ads

## 9. Engagement Model and Ad Revenue Case

### Why multi-day trips are structurally good for ad revenue

Ad networks typically consider a user "active" at roughly 25 sessions × 4 minutes each per month. A single multi-day group trip can clear this threshold on its own:

- A 7-day trip with 20 min/day average usage = 140 min for that trip alone
- Multiple users per trip multiply this: a 4-person group trip = 4× the session count
- Users return to the app naturally each morning to check Today's Schedule on Vacation Days — this is the daily anchor screen and the primary re-engagement hook during a live trip

### Re-engagement strategy

**During the trip (highest engagement window):**
- Vacation Days page is the daily pull — users open it to see the day's schedule, check off scavenger hunt items, post meetup locations, and log expenses
- This creates natural multi-session days without requiring any push from the organizer

**Push notifications (iOS/Android — deferred to native build):**
- Poll created → notify group to vote
- New itinerary event added → notify participants
- Expense logged → notify split members
- Travel day starting → morning brief notification
- These are the primary reason non-organizer participants reopen the app

**Viral / referral loop:**
- Every organizer pulls in multiple participants (typically 2–8 per trip)
- Participants experience the app as users, not just as invited viewers
- Future trips: participants become organizers, bringing new groups
- One active user is likely to generate one or more additional accounts

### Ad placement timing

The highest-value ad slots are:
- pre-trip preplanning (user is engaged but not time-pressured)
- between vacation day sections (natural scroll pause points)
- post-trip wrap-up and memory vault (nostalgic, relaxed browsing)

The worst ad timing (never place here):
- during travel-day execution checklist
- mid-expense entry
- during active meetup coordination

## 10. Open Monetization Questions

- Which ad network to use (Google AdSense, Carbon, other)?
- Should there be a per-trip premium option for organizers who only travel once?
- Should currency converter use a free rate API (Open Exchange Rates free tier, Frankfurter) or a self-managed daily snapshot?
- Should receipt scanning have a usage cap even for premium users, or unlimited?
