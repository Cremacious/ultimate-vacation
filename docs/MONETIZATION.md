# Monetization

> **2026-04-20 Naming Audit — see docs/NAMING.md**
>
> **"Premium" is a dev shorthand only.** All user-facing surfaces use **"Supporter"**: purchase sheet CTA *"Become a Supporter · $4.99 once"*, account menu *"Supporter status"*, badge *"♥ Supporter"*. Older sections of this doc still say "Premium" — those are historical context; copy-ready user strings use Supporter.

> **2026-04-20 Roadmap Grill Revision (supersedes portions below)**
>
> - **Premium at v1 = 2 features only:** ad removal + receipt scanning. The prior 8-feature premium bundle was over-scoped for a solo dev. Remaining 6 features (offline · smart suggestions · templates · export · duplication · currency converter) move to Post-MVP and may re-enter premium as they ship.
> - **Affiliate is the primary revenue lever, not premium.** ~$500k gross projected over 5 years vs ~$243k net from premium. Affiliate chips (Booking.com, Skyscanner, Viator) ship at **Public MVP (weeks 13–24)** as a spine-tier feature — they are not a post-launch add-on.
> - **Beta ships with no monetization surfaces.** No Stripe, no premium sheet, no ads. Beta is spine validation with ~20 personal-network users; monetization arrives at public launch.
> - **Pricing locked from prior grill holds:** $2.99 founder's (first 1,000 buyers) → $4.99 standard thereafter.
> - **Post-trip upgrade prompt locked from prior grill holds:** one-time after first completed trip, plus account-menu entry point. No persistent nudge.
>
> Full rationale: DECISIONS.md entry *2026-04-20 — Roadmap grill: 11 decisions locked (re-grill corrected).*

---

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

## Discoverability and Monetization Visibility

Pricing and monetization are **never shown on the landing page or any marketing surface**. The product is presented as free. Users discover limits and premium features naturally through usage.

- Landing page: no pricing, no plan comparison, no mention of premium
- The word "free" is used prominently on marketing surfaces to attract signups
- Premium is surfaced only after account creation, through natural paywalls and a subtle "Get Premium" or "Remove Ads" entry point in the app
- Users should assume the product is fully free until they encounter a paywall organically
- The upgrade flow explains premium benefits and the $4.99 price only at that moment

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

### One-time $4.99 premium unlock

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
- Resend: usage-based, password reset only. No notification emails are sent by TripWave -- the app uses in-app notifications and (later) push notifications only.

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

### Make premium (one-time $4.99)

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

## 5. Premium Positioning -- "Support the App, Get a Thank-You"

TripWave's premium framing is deliberately **not** transactional-value-capture. Users do not "unlock features they need." Users **support the app** and in return **receive a warm thank-you**: no more ads, plus some fun bonus features as a gift.

This framing is chosen because:

- The app is built by one person with no VC funding
- Ads exist because servers cost money, not because they are the ideal UX
- Most users will stay free forever, and that's fine -- the free tier is genuinely useful
- Users who upgrade should feel they are supporting a creator they like, not extracting discounted value from a corporation
- Framed this way, premium becomes an emotional purchase (affection, gratitude, support) rather than a rational purchase (feature comparison). Emotional purchases convert better and churn less (well, "churn" doesn't apply to one-time purchases, but the principle holds)

### Tone and copy principles

- Open about why ads exist: *"Sorry about the ads. Running apps like this costs money, and I'm one person."*
- Open about the solo-dev reality: *"TripWave is built by one person."*
- Reframe premium as gratitude, not commerce: *"Premium is how you say thanks. In return: no ads, some bonus fun, and you help keep the lights on."*
- Treat bonus features as gifts to supporters: *"As a thank-you for supporting me, here are some fun extras to play with."*
- Never scold, never pressure, never use scarcity beyond the founder's window

### Example copy across the app

**Premium purchase sheet (headline + body)**:
> *"Sorry about the ads."*
>
> *"They exist because servers, databases, and one developer's rent all cost money. Premium is how you say thanks -- no more ads, plus some bonus features as a gift for supporting the app. $4.99, once, forever. No subscriptions, no guilt, no corporate anything. Just me and you. ♥"*

**Premium purchase sheet (bonus feature reveal)**:
> *"As a thank-you: unlimited dreams, Dream Mode pastel themes, and a little Founder-style glow on your trip ball. Not essential. Just fun."*

**Inline lock card (on a premium-only feature)**:
> *"This one's a premium bonus. Tap to support the app and get it. $4.99 once, no strings."*

**Moment card (context-aware)**:
> *"You're offline, 30 minutes from the airport. For $4.99 you'll never get locked out again, and you'll help the app stay alive. Worth a thought."*

### What we stop saying

These kinds of phrases are now forbidden in premium copy:

- *"Unlock powerful tools"* (too corporate-software)
- *"Upgrade to premium"* (implies the user is currently deficient)
- *"You'll love what you get"* (sales-y)
- *"Save the trip"* (too salesy, too dramatic)
- Any implied "you're missing out" language

### Conversion moments

Premium prompts still appear where a user already feels a need -- but framed as gratitude opportunities, not value extraction.

Natural moments:
- User is on a plane and notices the app doesn't work offline -- opportunity to explain ads + server costs + offer premium gift
- User tries to scan a receipt -- inline card: *"Receipt scanning is a bonus thank-you for premium supporters."*
- User sees an ad during planning -- the ad itself has the small *"Remove ads for $4.99"* link which opens the supporter pitch
- User browses Dream Mode hits the 1-dream cap -- gentle card: *"Want unlimited dreams? It's one of the bonus gifts for premium supporters."*

## 6. Profit Strategy

Profit comes from disciplined scope as much as revenue.

### Low-cost product strategy

- keep hosting on Vercel (shared with existing subscription)
- keep primary data in Neon (shared with existing subscription)
- no image hosting — TripWave is text-first
- use Azure only for receipt scanning (premium-gated)
- use Resend only for the password reset email. No invite-email, no notification-email, no digest-email will be sent.
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
- advanced push notifications via native app push infrastructure (no Resend for notifications)

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

## 10. Viral Invite Loop -- Acquisition via Existing Users

TripWave's single largest acquisition lever is built into the product: every organizer invites 3 to 5 travelers per trip. The invite loop is the primary non-paid channel and the only path that scales to the 5-year 50k sales target without significant ad spend.

### Loop design

1. Organizer (or any Trusted member with invite permission) sends invite via link, code, or QR
2. Invitees join. During their first session in the trip, a **soft cross-promote banner** appears: *"Loving TripWave? Start your own trip free."*
3. After the trip completes (weeks or months later), invitees receive a single in-app nudge: *"Plan your next trip? You already know how this works."*
4. When an invitee completes setup on their own trip (Draft → Planning), **whoever sent the specific invite link** earns a **bonus free slot reward**:
   - Toast and in-app notification: *"Sarah just started her first trip -- you earned a bonus free slot!"*
   - Reward fires on invitee's setup-complete (not bare Draft creation, not trip completion) — real commitment signal, not gameable.
   - Reward goes to the invite-sender, not necessarily the trip organizer. If Alice (Trusted) sent the link and Alice is later demoted or the organizer role transfers, Alice still earns the reward.
   - Free tier bonus slot cap: invite-sender can grow from 4 base slots to a maximum of 7 via referrals (3 bonus slots total, lifetime).
5. Invitees-turned-organizers trigger the same slot reward for whoever invited their own invitees

### Why slots as the referral reward (not premium or cash)

- Free users hit the 4-slot cap faster than any other constraint -- slots are the genuinely useful perk they want next
- Costs the business effectively nothing -- a free user with 7 slots is still a free user
- Once a user hits 7 slots and needs more, premium (50 slots) becomes the natural next step
- Does not train users to expect discounts on the $4.99 premium itself, preserving pricing integrity
- Clean messaging: *"Every friend who plans their own trip gives you an extra free slot."*

### Why soft cross-promote instead of aggressive gating

- Invitees are already experiencing the product in the best possible way -- through a real trip with real friends
- Aggressive "invite X friends to unlock Y" mechanics feel coercive and violate the principle that free should remain genuinely useful
- Subtle banners plus one well-timed post-trip nudge convert without pressure

### Viral math reference

Assumptions: 30% of invitees start their own trip within 2 years (typical for travel apps), 4 invitees per organizer on average.

- One organizer creates 1.2 new organizers (first-degree)
- Each of those creates ~1.4 more (second-degree)
- Per initial organizer, the viral tail is ~2.6 downstream organizers total
- At 5% premium conversion among organizers, one $4.99 sale produces ~0.13 additional sales from the tail -- real but not magical
- The tighter engagement from slot rewards (more multi-trip usage) is the compounding win over time

## 11. Launch Pricing Strategy

TripWave launches with a **beta free-premium cohort** followed by **founder's pricing for the first 1,000 public sales**. Price settles to $4.99 permanently after the founder's cap is hit.

### Phase 1 -- Private beta (pre-launch)

- 50 to 150 beta users invited personally or via small-audience signup
- Beta users receive **permanent free premium** in exchange for:
  - Real trip usage
  - Written feedback or bug reports
  - Optional App Store or marketing review once available
- Beta premium does not expire -- these users keep premium forever at $0

### Phase 2 -- Founder's pricing (first 1,000 public sales)

- Premium priced at **$2.99 one-time** during this phase
- Priced as *"Founder's pricing: lifetime, forever, capped at 1,000 spots"*
- Live countdown visible on the marketing site: *"823 of 1,000 founder's spots left"*
- Founders are grandfathered permanently at $2.99 -- the lifetime unlock never raises in price for them
- Founders receive a permanent *Founder* badge on their account as a status marker
- Marketing angle: launch-day press, Product Hunt hook, Reddit / travel community hook

### Phase 3 -- Standard pricing (post-1,000 sales)

- Price is $4.99 one-time (locked 2026-04-20)
- Pre-existing founders keep their $2.99 lifetime pricing (already paid)
- Standard pricing continues indefinitely thereafter

### Why this phased launch

- Beta users generate real feedback and early evangelism at zero revenue cost
- Founder's cap creates genuine urgency (quantity-based, not time-based -- more effective)
- Status of being a "founder" is a durable non-monetary perk that encourages share-on-social behavior
- Price jump from $2.99 to $4.99 is a natural press-worthy moment; the $2 gap is real and story-worthy
- Total cost of the founder's discount: ~$2,000 vs full-price -- a rounding error vs the launch momentum gained from 1,000 committed early users
- Avoids a free trial, which would erode the "one-time, no subscription, no guilt" positioning
- Quantity-based scarcity ("823 left") outperforms time-based scarcity ("30 days left") for converting the urgency-sensitive early cohort

### Revenue model across the 70k-sale target (locked 2026-04-20)

- Founder's sales: 1,000 × $2.99 × 0.70 (after Apple cut) = ~$2,093 net
- Post-founder sales: 69,000 × $4.99 × 0.70 = ~$241,101 net
- Total 5-year premium net: ~$243,194
- Note: 70k target (up from prior 50k) reflects higher expected conversion at $4.99 vs prior $4.99 standard; viral invite mechanics at scale support the revision

### Launch promotion copy examples

- *"1,000 founders. $2.99 lifetime. Everyone else pays $4.99."*
- *"Get in early: TripWave founder's pricing ends when we hit 1,000 unlocks."*
- *"A one-time $2.99 to own TripWave forever. No subscriptions. No renewals. Limited to the first 1,000 users."*

## 12. Affiliate Revenue -- The Third Revenue Stream

TripWave earns affiliate commissions through a **hybrid model**: organic contextual affiliate chips during preplanning (where users are already making decisions) plus dedicated search-and-book tools in the Tools hub (for users still comparing options). Both channels are free for all users -- affiliate is not a paywall.

### Rationale

Travel apps live next to the booking decision. A single $2,000 hotel booking at 5% commission yields $100 -- roughly equivalent to ~18 premium sales of net revenue from one user booking one thing. Even at low click-through rates, affiliate revenue scales with trip planning activity, not with premium conversion, and becomes the dominant revenue stream at higher user counts.

### Organic contextual placements

Small, subtle, optional. Never auto-redirected, never pop-up, never blocking.

- **Preplanning → Accommodations**: when a user types a hotel name in the lodging field, a chip appears below: *"Need to book it? Check Booking.com ↗"*. Chip is hidden once the user fills in a confirmation number
- **Preplanning → Transportation**: when flight details are being entered without flight numbers, chip: *"Compare flights on Skyscanner ↗"*
- **Wishlist → Activity ideas**: for destination-known trips, each activity idea gets a small button: *"Find tours on GetYourGuide ↗"*
- **Vault → Insurance empty state**: *"No travel insurance yet? Compare options ↗"*

### Dedicated search-and-book tools

Available to all users in the Tools hub:

- *Find flights* (Skyscanner or Kiwi affiliate)
- *Find hotels* (Booking.com affiliate)
- *Find rental cars* (Discover Cars or similar)
- *Find tours and activities* (GetYourGuide or Viator affiliate)

Each tool runs a search based on trip data (destination, dates) and presents results. Clicking any result opens the partner site with an affiliate tag.

### Design rules

- Affiliate links always use the ↗ external-link icon
- The word *"Ad"* is never applied to affiliate links -- they are contextual recommendations, not advertising inventory
- Every affiliate surface includes a small *"How we earn"* link opening a short honest disclosure
- Affiliate is available to free and premium users equally
- No user data beyond the search query (destination, dates) is passed to partners
- Show the best result even if it is on a non-partner site; brand trust compounds faster than a 5% commission

### Solo dev honesty moments

TripWave is built and maintained by one person. That context appears in three specific places -- never tacky, never persistent, never interrupting.

1. **Affiliate "How we earn" disclosure**
   > *"TripWave is built by one person. If you book through these links, we earn a small commission -- no extra cost to you. It keeps the lights on and the trip ball rolling. ♥"*

2. **Premium purchase sheet footer**
   > *"Built by a solo dev. Every $4.99 helps keep TripWave alive. ♥"*

3. **Account page -- About section (small, inline)**
   > *"Made with ♥ by one person."*

Tone rules:
- Never appears on the landing page, in any feed, or during trip planning flow
- Never implies scarcity or guilt
- Never asks for tips, donations, or reviews in the same breath
- The ♥ glyph is the only stylistic flourish

### Revenue model projection

Assumptions (conservative):
- Average trip books ~$1,500 in affiliate-eligible services (flights + hotel + 1 tour)
- Click-through rate on contextual chips: 15%
- Click-to-book conversion: 30%
- Blended commission: 5%
- Affiliate revenue per trip planned: $1,500 × 15% × 30% × 5% = ~$3.37

Scaling:
- At 1M cumulative users × 1.5 trips lifetime average: **~$5.05M lifetime affiliate gross**
- At 10% of that conservative estimate: **$505k** -- nearly 2x the premium revenue from 50k sales

Affiliate is not a substitute for premium. Premium funds feature development and quality. Affiliate funds operating margin and growth headroom.

### What we explicitly do NOT do

- Do not sell user data
- Do not pass emails or phone numbers to partners
- Do not share preplanning contents or itinerary details with partners
- Do not prioritize higher-commission partners over better options for the user
- Do not apply affiliate links to every text mention of a brand -- only the contextual placement spots described above

## 13. Retention Strategy -- Bringing Users Back for Trip #2 and Beyond

Most users plan a trip and disappear for 6 to 18 months. TripWave is not a daily app. Without active retention, every cohort is a one-shot and the 50k sales target is unreachable. Retention is the biggest overlooked lever.

Retention uses **three layered surfaces** plus **Dream Mode** as a dedicated between-trips engagement surface.

### 1. Memory as a returnable artifact

The Memory phase (already specced) becomes a permanent revisitable asset:

- Users can return to past trips and re-read their recap, stats, and highlights at any time
- Shareable public recap links bring outside traffic into TripWave -- any friend viewing *"Chris's Tokyo recap"* is a latent user
- Memory never expires, never paginates out, never dims beyond its nostalgic-fade visual treatment

### 2. Annual anniversary nudges

Once per year per completed trip, on the trip's start-date anniversary, users get a single in-app notification:

- *"A year ago today, you kicked off Tokyo Spring 2025."*
- Tapping routes to that trip's Memory page
- Secondary soft CTA below the nostalgic content: *"Ready for your next one? Start a new trip."*
- Capped at once per year per trip, never repeated within the same year
- Tone is warm, not salesy -- think Facebook "On this day" dialed way back

### 3. Seasonal planning prompts

Twice per year, users with no active trip receive a soft in-app banner:

- **Mid-February banner**: *"Planning a spring or summer trip? Now's the moment."*
- **Mid-September banner**: *"Holiday trip on the horizon? Get a head start."*
- Dismissible with a 90-day snooze per banner
- Timed to natural booking windows when hotel and flight prices are most motivating

### Retention leverage math

A conservative 30% lift in per-user lifetime effective value means needing ~770k cumulative users instead of 1M to hit 50k premium sales. That is a 230k-user saving in acquisition effort over the 5-year horizon.

### What retention does NOT include

- No email newsletters, digests, or promotional emails (password reset is the only email TripWave sends)
- No push for irrelevant app news, feature launches, or upsells
- No notifications to users with zero trips
- No gamified streaks, levels, or login-day badges

## 14. Dream Mode -- Slim Public Shareable Trip Variant

Dream Mode is a **shareable public variant of a regular trip** designed for aspirational play and viral sharing. After honest review, Dream Mode ships as the slim version -- reusing the regular trip workspace with three real differentiators rather than building a separate full product.

### What actually differentiates a dream from a regular trip

Only three things:

1. **Public shareable read-only link** -- regular trips contain private data and cannot be shared. Dreams have no real data and are safe to show the internet
2. **Social reactions and comments from any authenticated viewer** -- regular trips restrict interaction to invited members
3. **Visual identity** -- sparkle-ball variant and *"This is a dream"* chip give users psychological permission to play

Everything else (fantasy activities, placeholder guests, themes, mood boards) can live on regular trips without a separate mode. Dream Mode is not a full separate product.

### Dream trip limits

- **Free users**: 1 active dream at a time
- **Premium supporters**: unlimited dreams (framed as a supporter thank-you)
- Dream slots do NOT count against the 4 free real-trip slots

### Premium supporter bonuses in Dream Mode

Framed as gifts for supporters, not as withheld value:

- **Unlimited dreams** (free users hit 1-dream cap, see an inline support card)
- **Private dreams** toggle (free dreams always shareable)
- **Extra sparkle ball effects** (more pastel gradients and sparkle styles for supporter dreams)

### What is NOT gated behind premium

- Vibe themes (all ship free) -- gating aesthetic cosmetics feels petty under the supporter framing
- Reality Check -- dropped from scope. Users can use Find-flights / Find-hotels tools manually
- Mood boards (if built) -- free feature, not a premium gate
- Public sharing (every dream is shareable regardless of tier)

### Sharing and social

- Every dream has a public read-only share link
- Non-authenticated viewers see the full dream
- Warm signup nudge for viewers: *"Sign up free to react and plan your own."*
- Reactions and comments require an account per the account-required rule
- Reactions: emoji toggles per dream item (❤️ 🌴 🥂 ✨ 😍 🤩)
- Native share sheet on mobile (WhatsApp, iMessage, Instagram DM)

### "Save to my dreams" cross-pollination

- Any authenticated viewer can tap *Save to my dreams* on a public dream
- Creates a new dream in their own account, pre-populated from the source
- Original dreamer gets a warm in-app notification: *"[Name] saved your dream!"*

### Dream-specific ball visual

- Shimmer / gradient / sparkle variant (distinct from real-trip balls)
- Never hits 100%; pulses and glows perpetually
- Color picker includes pastels and gradients not available to real trips

### Why slim Dream Mode helps the business

- **Viral acquisition**: public share links bring new users (*"omg wouldn't this be so fun?"* texted to a friend)
- **Low dev cost**: reuses existing workspace, no duplicate product to maintain
- **Between-trips engagement**: low-commitment, encourages casual opens when no real trip exists
- **Supporter conversion**: unlimited dreams and sparkle bonuses are small warm thank-you gifts that match the supporter framing

### Guardrails

- Dreams are clearly labeled *"This is a dream"* at the top of every view -- users never confuse them with real trips
- Dreams do not appear on the main dashboard's "Next up" hero (reserved for real upcoming trips)
- Dream notifications never appear (no travel day, no countdown, no anniversary for dreams)
- Dream ball color never matches real trip ball color exactly -- visual distinction is enforced at the color-picker level

## 15. Conversion Rate Baseline and 70k-Sale Math (updated 2026-04-20)

TripWave plans for a **3-4% premium conversion rate** among cumulative users. This is the honest mid-market assumption for a "one-time impulse unlock" consumer app where the free tier is genuinely useful. The 70k target (up from prior 50k) reflects the higher expected conversion at the final $4.99 price point vs the originally planned $4.99; market data for emotional supporter purchases clusters strongly at $4.99 with conversion ~2× vs $9.99+ utility-tier pricing.

### The math at 3-4%

- **3% conversion**: ~2.33M cumulative users needed to hit 70k sales
- **4% conversion**: ~1.75M cumulative users needed
- **Blended planning target**: ~2M cumulative users over 5 years

### Ramp estimate (S-curve)

- Year 1: ~30k users (founder cohort + early organic + Dream Mode virality)
- Year 2: ~130k users (word-of-mouth, dream shares compound)
- Year 3: ~300k users (App Store algorithm pickup, "hit app" status)
- Year 4: ~450k users (multi-trip users returning, maturity)
- Year 5: ~490k users (approaching saturation)
- Cumulative by end of year 5: ~1.4M

### What this ramp requires

- Dream Mode delivers on virality: each dream share seeds ~0.5 new users
- Invite loop delivers: ~2.6 downstream organizers per one initial organizer
- App Store discoverability: top 50 in Travel category by year 3
- At least one meaningful organic moment (press, TikTok virality, niche community adoption) in year 1 or 2
- No serious competitor eats the niche before year 3

### Risk case at 1.5% conversion

If actual conversion is 1.5% rather than 3-4%, 50k sales requires ~3.3M cumulative users. That is nearly unreachable without paid ads. This is why retention surfaces (Memory, anniversary, seasonal prompts, Dream Mode) are not optional decorations -- they are the only path to the volume required at realistic conversion rates.

### What we measure in the first 1,000 sales

The founder's cohort is the reality-check cohort. The rates observed here become the planning numbers for years 2 through 5.

- Observed premium conversion rate
- Time-from-signup-to-upgrade
- Percentage of organizers vs invitees who convert
- Which premium feature drove each conversion (OCR, offline, currency, ad removal, dream slots, etc.)
- Share rate of Dream Mode content
- Affiliate click-through rate on contextual chips

If observed conversion is below 2.5% at the 1,000-sale mark, the plan is revised -- either raise the price to $9.99, tighten the free tier slot count, or add more compelling premium features. Do not rely on "marketing harder" to close that gap.

## 16. Contingency Plan -- Behind-Target Response Tiers

TripWave is built by one person with no startup capital. The contingency plan is designed for solo-dev reality: **no paid ads, no expensive partnerships, no team-dependent levers**. Responses escalate by how far behind target we are, not by how panicked we feel.

### Tier 1 -- Behind by 10 to 25%

Indicator: end of year 1 around 20-25k users, or end of year 2 around 100-115k users.

Response: **No drastic changes. Iterate on conversion and retention. Cost: $0, time only.**

- Ship 1-2 more premium features users request in feedback
- Audit where users drop off pre-purchase (are moment cards firing at the wrong times?)
- Double down on Dream Mode virality -- feature it more prominently in marketing copy
- Publish organic content on TikTok and Instagram showing real user trips (no ad spend, no influencer payments -- just the developer posting short videos on personal channels)
- Engage travel communities (r/travel, r/solotravel, r/travelnopics, travel Discord servers) organically -- genuine participation, no "check out my app" spam

### Tier 2 -- Behind by 25 to 40%

Indicator: end of year 2 around 80k users with ~2k premium sales vs ~4k target.

Response: **Low-risk levers that cost near nothing. Still no paid ads. Still no expensive partnerships.**

- **Editorial pitching**: personal email outreach to 5-10 travel publications (Condé Nast Traveler, AFAR, The Points Guy, Thrillist, travel Substack writers). Cost: $0. Time: one afternoon. Worst case: no replies. Best case: one feature drives 10-50k users
- **Family plan ($14.99)**: one-time dev work, then self-sustaining revenue stream. $14.99 covers one primary account plus 3 secondary household accounts, all premium. Introduces a second SKU without displacing the $4.99 individual unlock. Likely captures ~15-20% of buyers who would otherwise not buy at all
- **Dream Mode content push**: create curated public dreams on the TripWave marketing site (*"Dream: a week in Tulum"*, *"Dream: family reunion at Lake Tahoe"*) as SEO and social sharing bait. Each public dream is a landing page that can rank in Google and get screenshot-shared
- **NOT in Tier 2**: paid ads. The $2k test budget was attractive in a funded scenario but the solo-dev no-cash reality means we do not spend money on acquisition. Paid ads get deferred until revenue exists to fund them

### Tier 3 -- Behind by 40% or more

Indicator: end of year 3 with fewer than 200k total users.

Response: **Structural product changes. Still no paid ads. Cost: dev time only.**

- **Raise price to $9.99 for new purchases** -- grandfathered founders keep $2.99, prior $4.99 standard buyers keep their lifetime unlock. The price-raise moment itself becomes marketing (*"Prices going up Friday. Grab $4.99 while it lasts."*)
- **Tighten free tier to 3 slots** -- requires a polite in-app communication banner explaining: *"Free tier updated: 3 slots now, up to 4 bonus via referrals. Premium unlimited as always."*
- **Rewarded ads for bonus slots** -- users can watch a 30-second video ad to earn a bonus free slot (capped at +1/year regardless of referrals). 5-10x the eCPM of banners. Only triggers under Tier 3 conditions because building rewarded ad infrastructure is non-trivial
- **Honest reality-check**: if Tier 3 is reached and the levers do not close the gap within 12 months, the solo-dev economics of TripWave may not support the 70k target. Options at that point: (1) continue as a lifestyle product at whatever scale it finds, accepting lower total revenue, (2) open-source the project and pivot, (3) explore acquisition interest from a larger travel company

### What the tiered plan explicitly rejects (even in Tier 3)

- **Subscription pivot** -- violates the "one-time, no subscriptions" positioning that is TripWave's moat
- **Aggressive ad interstitials** -- short-term revenue, long-term brand damage
- **Free premium trials** -- trains users to expect premium as gettable for free
- **Paying for App Store featuring** -- expensive, rarely pays back
- **Paid acquisition with venture-scale budgets** -- not available in the solo-dev economic reality
- **Pivot to B2B corporate travel** -- entirely different product; out of scope for a solo dev

### Commit in advance

This plan is chosen now so that when pressure hits later, the response is already written down. The levers are sequenced from safest to most structural. Emotional pressure at month 24 should never produce a knee-jerk subscription launch or paid ads blitz that burns cash.

## 17. Ad Revenue -- Realistic Projection

TripWave plans ad revenue on a **dual-track model**: build for the realistic number, celebrate if we exceed it. The earlier $200-400k projection does not survive contact with the real world and should not be the planning number.

### Haircuts applied

Starting from a $0.72 effective eCPM assumption:

- **Ad blockers**: -20% (blend of iOS Safari default content blocking and desktop blockers)
- **iOS App Tracking Transparency**: -12.5% overall (most iOS users do not opt in, lowering eCPM on ~50% of impressions)
- **Non-US audience mix**: -20% (international eCPM is 20-35% of US eCPM)
- **Session frequency reality**: -30% (users average ~15 sessions per month during active planning, not the 25 originally modeled)
- **Premium users exiting the ad pool**: -3 to -4%

Combined multiplicative haircut: ~0.38

### Realistic 5-year ad revenue

- Original projection: $200-400k
- Realistic range after haircuts: **$76k to $152k**
- Planning number: the midpoint, **~$100k over 5 years**

### Revised full revenue model (updated 2026-04-20)

- Premium sales: ~$243k net (70k sales at $4.99 standard / $2.99 founder's; see § 11)
- Ad revenue (realistic): **~$100k net**
- Affiliate (conservative 10% of aspirational model): ~$500k gross
- **Combined realistic 5-year revenue: ~$693k**, back-loaded toward years 3 through 5

Affiliate remains the largest revenue stream by a wide margin. Premium is second. Ads are third and primarily serve as baseline cover for infrastructure plus a thin margin.

### Implications for build priorities

- Do NOT over-invest in ad optimization early -- basic banner + native cards is enough for the first 12-18 months
- Do NOT count on ad revenue to fund development -- treat it as infra cover + thin margin
- DO prioritize affiliate tools development (Find-flights, Find-hotels) -- they are the bigger lever
- Free-tier viability does not hinge on ad revenue performing at the original projection

### What this does NOT change

- Ad placement rules already specced (banner + native cards + suppression zones) remain correct
- Premium ad-removal remains a legitimate perk -- users still prefer no ads regardless of revenue impact
- The docs' core principle (ads cover infrastructure, premium is margin) still holds, just at a smaller absolute number than previously modeled

## 18. Regional Pricing

TripWave uses **USD pricing on the web** (via Stripe) and **platform-native pricing tiers on iOS and Android** (via Apple / Google). Users encounter the pricing model native to where they are buying from.

### Pricing matrix

| Platform | US / CA / UK / EU / AU | India | Brazil | Southeast Asia | Rest of world |
|---|---|---|---|---|---|
| Web (Stripe) | $4.99 USD | $4.99 USD | $4.99 USD | $4.99 USD | $4.99 USD |
| iOS / Android | $4.99 (Tier 5 equivalent) | ~₹199 (~$2.40) | ~R$14 (~$2.80) | ~$2.99-4.99 | platform tier |

### Rationale

- Web buyers skew wealthier and higher-intent (credit cards, laptops, stable connections). Single USD pricing is honest and simple
- Mobile buyers span every economic tier globally. Platform pricing lets Apple and Google handle currency, tax, and regional legal compliance
- A user in any country can choose either -- web at $4.99 or mobile at their local tier. No one is locked out

### Founder's pricing applied

- Web: $2.99 USD for the first 1,000 founders
- Mobile: Tier 3 equivalent for the first 1,000 founders
  - India: ~₹99 (~$1.20)
  - Brazil: ~R$9 (~$1.80)
  - US: $2.99
- Emerging-market founders are strategically valuable for reviews, word-of-mouth, and downstream referrals even at deeper local discounts

### What we explicitly do NOT do

- No regional discount codes (maintenance overhead, leak risk, feels cheap)
- No variable family-plan pricing by region (family plan stays simple: $14.99 USD web, platform Tier 12-ish on mobile)
- No currency-symbol switching on the marketing site -- the .com stays USD throughout

### Tax and compliance

- **Apple and Google** collect and remit VAT/GST/sales tax on all mobile purchases globally -- zero work for the dev
- **Stripe web** uses Stripe Tax (0.5% of processed volume) to handle US state sales tax, EU/UK VAT, and similar regimes automatically. Saves weeks of accounting

### Why this split works for a solo dev

- The complex work (currency conversion, local tax, regulatory filings) happens inside Apple, Google, and Stripe Tax
- The developer only needs to configure the correct price tier in each platform's dashboard once
- Pricing doesn't need to be negotiated per country or re-evaluated as exchange rates shift -- the platforms track that

## 19. Pre-Launch Audience Building

Launch day at zero audience = zero sales. The founder's $2.99 pricing only works if someone sees it. Every successful indie app accumulates an audience over 3 to 12 months before launch. TripWave plans a **three-channel pre-launch strategy** that costs only time, not money.

### The three channels (all three run simultaneously for 6 months pre-launch)

#### Channel 1 -- Build in public

Goal: 500 to 2,000 followers who are rooting for the solo dev.

- Pick ONE platform (not three). Recommendation: **TikTok or Threads** (better match for TripWave's aesthetic-adjacent audience than X/Twitter)
- Post 2 to 3 times per week showing:
  - The trip ball animation in progress
  - A real trip the dev is planning using the app
  - A design decision with the two options considered
  - A bug being fixed in real time
  - A feature a user suggested
- Use the supporter framing consistently -- the dev's vibe is the product's vibe
- No ads, no promotions, no countdowns. Honest progress only
- Time cost: ~4 hours/week

#### Channel 2 -- Email waitlist

Goal: 1,500 to 5,000 addresses by launch day.

- Landing page at the TripWave domain during pre-launch
- Shows the product design, the slogan, a demo of the trip ball, a single email capture
- Headline: *"TripWave is coming. Plan the trip. Not the group chat."*
- Below the fold: a warm honest paragraph about why the app is being built, the solo-dev reality, and the $2.99 founder pricing
- One weekly email during build period -- short, warm, not marketing-speak
- Landing page URL dropped in:
  - Product Hunt "upcoming" page (free)
  - Indie Hackers showcase
  - Relevant Reddit posts where the dev has first participated genuinely
  - Social bios on the build-in-public channel
- Time cost: ~2 hours/week once the landing page exists

#### Channel 3 -- One niche community

Goal: become a recognized, trusted member of ONE specific travel community.

- Pick ONE community: r/solotravel, r/digitalnomad, r/TravelHacks, Nomad List Discord, or a specific travel Facebook group
- Six months of genuine participation **before** mentioning the app. Post answers, share trip reports, help others. Do not self-promote until 50+ contributions of value exist
- When earned: a single *"I've been building a tool to help with this -- beta?"* post converts 50 to 100 beta signups overnight
- **One community only.** Multi-community posting is spam, gets accounts banned, and burns audiences

### Timeline assumption

- **T-minus 6 months**: start all three channels
- **T-minus 3 months**: waitlist ~500, build-in-public ~300 followers, community trust established
- **Launch week**: waitlist ~1,500-2,000, community primed for beta, build-in-public audience ~1,000-2,000
- **Launch day**: single email to waitlist, *"Founder's access opens in 2 hours. $2.99 forever, 1,000 spots."*

With this plan, founder's 1,000 spots realistically sell out in 3 to 8 weeks. Without it, sell-out takes 6 to 18 months or never.

### Solo-dev time budget

Total pre-launch marketing time: ~6-7 hours per week.

That is half a day per week of marketing while building the product. **Non-negotiable.** Skipping marketing is the single biggest reason indie apps die on launch week.

### What this plan explicitly avoids

- Paid ads (no budget)
- Influencer outreach (time-heavy, low-ROI for indie)
- Hiring a marketer (no budget)
- Press outreach pre-launch (reserve for launch week)
- Gamified waitlists ("share to move up") -- gimmicky, converts poorly
- Multi-community spam
- Posting on three platforms (too thin to get traction on any)

### Nurturing the waitlist

Weekly waitlist emails are short (150-400 words) and follow a consistent template:

1. One sentence status update (*"Here's what I'm working on this week."*)
2. A small screenshot, mockup, or design snippet
3. One honest solo-dev note (a question the dev is wrestling with, a small bug story, a user request)
4. A tiny CTA at the end -- usually a single link to the TikTok/Threads/community post of the week

No *"10 tips for your next vacation"* listicles. No travel blogging. Just one solo dev, building in public, inviting the waitlist into the process.

## 20. Refund and Support Policy

TripWave uses a **generous 30-day no-questions-asked refund policy** on web purchases, with a warm honest note explaining it. Mobile refunds pass through Apple/Google's automatic handling.

### The policy (as written for users)

> **Refunds**
>
> *Not feeling it? Email me within 30 days of your purchase and I'll refund it, no questions asked.*
>
> *If you're past 30 days and there's a real reason (app not working, hit a bug that spoiled the trip), still email me -- I'll almost always refund anyway. I built this to make people happy, not to win on fine print.*
>
> *-- Chris ♥*

### Placement

- **Terms of Service page**: full refund language
- **Premium purchase sheet footer**: small link *"30-day no-questions refund ♥"*
- **Account → Premium section**: if the user is premium, a small *"Refund this purchase"* link that auto-fills a refund request email

### Processing

- **Web (Stripe)**: dashboard refund, 3 clicks, ~30 seconds
- **Mobile (Apple/Google)**: platforms handle automatically; the refund appears in payout
- **Response**: one-sentence personal email, *"Done. Sorry it wasn't the right fit -- if you ever want to try again, let me know. ♥"*
- **Premium entitlement**: revoked on refund (obvious)
- **No forms, no ticket numbers, no justification required**
- **Response time target**: within 24 hours of request

### Why this policy works for a solo dev

- **Chargeback prevention**: easy refunds mean users email rather than call their bank. One refund costs $0 operational; one chargeback costs $15 + the refunded amount
- **Low support volume**: at 2-3% refund rate among 1,000 buyers, that is 20-30 emails total per cohort -- handleable as one short email every few days
- **Trust signal**: generous refund policy is itself marketing. Users screenshot it, share it, trust the brand more. Reinforces the supporter framing
- **Abuse risk is negligible at $4.99**: gaming a refund policy for a cheap one-time purchase is not economically rational for bad actors

### Refund policy checks and balances

- If refund rate exceeds 5% of sales, the problem is the product (onboarding, expectations, bugs), not the policy. The response is to fix the product, not tighten the policy
- No abuse-detection heuristics built early -- not worth the dev time at solo-dev scale

### What we explicitly do NOT do

- Do not ask users to justify refund requests
- Do not counter-offer or try to "save" the sale
- Do not require forms or tickets
- Do not delay refund processing beyond 24 hours
- Do not build automated abuse detection at this scale
- Do not exclude founder-pricing buyers from the refund policy (founders get the same generous treatment)

## 21. Family Plan -- Tier 2 Contingency SKU

Specced now so it is ready to deploy if Tier 2 contingency triggers. Not launched at day one because it would fragment the *"$4.99 one-time"* pricing story.

### Product

**TripWave Family Supporter** -- $14.99 one-time (web) / equivalent platform tier on mobile

### Coverage

- 1 primary account (the purchaser) + up to 3 additional household members = 4 accounts total
- Each account receives full premium: no ads, unlimited dreams, private dreams toggle, extra sparkle ball effects, offline mode, receipt scanning, currency converter, advanced smart suggestions, all supporter thank-you bonuses
- All 4 accounts remain independent -- separate trips, separate friends, separate data. Premium is simply covered by one purchase

### Adding secondaries

- Primary goes to Account → Premium → *Manage family*
- Adds a secondary by entering the secondary's TripWave account email
- Secondary must already have a free account
- Secondary receives an in-app notification: *"[Primary name] added you to TripWave Family. You're a supporter now. Thank you both ♥"*
- Secondaries can be added gradually -- no need to claim all 3 slots at purchase

### Removing secondaries

- **Secondaries can self-leave** at any time via Account → Premium → *Leave family plan* (reverts to free)
- **Primary cannot kick secondaries** -- respects family autonomy and avoids ugly dynamics
- Vacated slots do not re-open within the first 12 months of the purchase (prevents rotating-scheme abuse)
- After 12 months, vacated slots re-open for new additions

### Refund handling

- Standard 30-day no-questions policy applies to the primary purchaser only
- On refund: all 4 accounts revert to free simultaneously
- Past 30 days, refunds only for bugs or service issues

### Copy

**Headline**: *TripWave Family Supporter*

**Body**: *"One purchase. Four people. Full premium for your whole crew. Because planning trips together is the whole point. $14.99 once, forever."*

**Solo-dev note**: *"Still just me building this. Thanks for the extra support. ♥"*

### What the family plan is NOT

- Not a subscription (one-time only)
- Not monthly/yearly pricing
- Not tiered (no "family basic" vs "family pro")
- Not a team/corporate SKU
- Not automatic -- primary must manually add members

### Economic rationale

- $14.99 covers 4 people = $3.75 per premium seat (~47% of the individual price)
- Expected to capture 15-20% of buyers who would otherwise not buy at all (net-positive revenue)
- Loss case: families where all 4 would have bought individually anyway ($19.96 → $14.99 = $4.97 left on table)
- Expected blended impact: accretive to total revenue at typical family purchase behavior

### Why ship only at Tier 2 contingency

- Launching with one clean price ($4.99 standard one-time) is the strongest pricing story
- Introducing Family Plan later can double as a "we listened, more value" marketing moment
- If the solo plan alone hits 50k target, the family plan may never be needed -- saves dev work

### Implementation readiness checklist (deferred build)

- [ ] $14.99 SKU configured in Stripe and platform stores
- [ ] Family-member data model (primary + up to 3 secondaries with join / leave state tracking)
- [ ] Account → Premium → Manage family page
- [ ] Self-leave flow for secondaries
- [ ] In-app notifications for add / leave events
- [ ] 12-month slot-cooldown enforcement
- [ ] Refund propagation to all 4 accounts

## 22. App Store Optimization (ASO)

ASO is where 80%+ of organic mobile discovery happens. For a solo dev with no ad budget, a well-tuned App Store listing is the single most important acquisition asset. TripWave's ASO leans hard into the **"Get everyone on the same wave"** slogan and the **ocean-ripple logo** as the central brand signature.

### App name (iOS and Google Play)

**TripWave: Group Trip Planner**

- Balances brand + primary keyword without feeling spammy
- "Group Trip Planner" captures the highest-intent search term

### Subtitle / short description

**"Get everyone on the same wave."**

Outcome-driven, slogan-first, ocean-themed. Does not list features -- features are the screenshots' job. Attracts the right user (group organizer tired of chaos) rather than any user.

### Screenshots -- story arc emphasizing the "same wave" theme

Eight screenshots in narrative order. Each has a bold caption in the top third and a product shot below.

1. **"17 group chats. 4 spreadsheets. 3 people who still don't know the plan."**
   - Dark background, colored text stack (yellow / pink / white), no product shown yet
   - Hooks the scroller with the pain point
2. **"Get everyone on the same wave."**
   - The ripple-wave logo animation visualized -- circle with gentle ocean ripples radiating outward
   - Light cyan background, warm feel
3. **"One place for everyone in the group."**
   - Dashboard showing 3 trips with colored balls
4. **"Watch your trip come to life."**
   - Trip ball at various fill percentages (8%, 35%, 68%, 95%)
5. **"Build the plan together."**
   - Itinerary day-by-day scroll
6. **"Every dollar tracked. Every debt settled."**
   - Expenses balances hero
7. **"Dream trips too. Share them with your crew."**
   - Dream Mode with sparkle ball and shareable feel
8. **"$4.99 once. No subscriptions. Built by one person. ♥"**
   - Warm supporter close; ocean-color background; solo-dev signature

Visual consistency across all screenshots:
- TripWave brand colors only (cyan, yellow, pink, green, charcoal)
- Ocean-wave motifs (gentle ripples, soft gradients) in backgrounds
- Fredoka for caption headlines, Nunito for body
- Ball appears on most screens as a unifying visual thread

### App icon

Just the **animated trip ball** with ocean-ripple feel. No text. Cyan fill with subtle gradient. Icon is small -- one colored circle reads better than any text at 120×120.

Animation note for the icon: iOS and Google Play icons are static images. The ripple animation lives inside the app and on marketing surfaces. The static icon is the ball at rest, waiting to ripple.

### Category

- **Primary**: Travel
- **Secondary** (iOS allows 2): Productivity

Travel matches actual search intent. Productivity as secondary captures organizer-minded users browsing that category.

### Keywords (iOS keyword field, 100 characters)

```
group travel,trip planner,vacation,itinerary,expense split,packing list,travel together,family trip
```

Do not repeat words already in the app name or subtitle -- those are indexed automatically.

### Long description

Opens with the problem hook, transitions to the solution, closes with the solo-dev supporter framing. Something like:

> *17 group chats. 4 spreadsheets. 3 people who still don't know the plan.*
>
> *Group trips are chaotic. TripWave is the one place that keeps everyone on the same wave -- from the first idea to the last receipt.*
>
> *Plan itineraries together. Split expenses fairly. Build packing lists. Vote on dinner. Share dream trips with your best friend. All in one calm place.*
>
> *Ad-supported free forever. $4.99 one-time unlocks no ads, offline mode, and bonus features as a thank-you. Built by one person. No subscriptions, no guilt, no corporate anything. ♥*

### Developer name

Use a personal or TripWave-branded name that reinforces the solo-dev story: *Chris Mackall* or *TripWave*, not a corporate-sounding LLC unless required for payment processing.

### ASO maintenance

- Update screenshots seasonally (spring/summer focus vs holiday focus)
- A/B test subtitle variants every 3 months via App Store Connect
- Monitor keyword rankings monthly
- Respond to every review in year 1 -- reviews affect ranking and future reviewers read responses

### What NOT to do

- Do not buy ASO consulting services at this scale
- Do not use traffic-bot services (banned)
- Do not stuff keywords into the app name (Apple may reject; looks spammy)
- Do not copy TripIt/competitor keywords blindly -- TripWave's positioning is different
- Do not neglect the first screenshot -- 70% of conversions happen on that single image

### Pre-submission checklist

- [ ] App name fits 30 chars (iOS) / 50 chars (Google)
- [ ] Subtitle fits 30 chars (iOS): "Get everyone on the same wave." = 30 chars exactly ✓
- [ ] 8 screenshots in story order
- [ ] Long description opens with the problem hook
- [ ] Keywords field filled (iOS)
- [ ] Category primary + secondary set
- [ ] Developer name reinforces solo-dev story
- [ ] Icon is the static trip ball, no text
- [ ] Privacy policy URL live
- [ ] Support URL pointing to a simple contact page

## 23. Review and Rating Strategy

App Store rankings correlate strongly with star rating and review count. TripWave uses the **native iOS / Android review API fired at post-moment high-happiness triggers**, with a warm priming toast and personal solo-dev response to every review.

### Trigger strategy

Native review prompt fires at these peak-emotion moments, in priority order:

1. **After a trip completes and the user opens the Memory recap for the first time** -- emotional peak
2. **After a user marks preplanning complete (ball hits 100%)** -- satisfaction peak
3. **After premium purchase and return to the app** -- gratitude peak
4. **After a successful group invite (3+ members joined)** -- social validation peak

### Rules

- Maximum 3 prompts per year per user (Apple's hard cap)
- Never prompt twice on the same trip
- Never prompt within 7 days of a previous prompt
- Never prompt during onboarding, travel day focus mode, or any stress moment
- If the user dismisses without rating, do not prompt again for 90 days
- Use only the native OS prompt -- no custom "rate us" UI

### Priming toast

Fires approximately 3 seconds before the native review prompt, giving the user a moment of warm context:

> *"Your trip is wrapped. If you loved TripWave, an App Store review means the world. ♥"*

Non-blocking, dismissible. The solo-dev voice priming personally converts better than a cold corporate prompt.

### Review response strategy

- Read every review in year 1
- Respond publicly to every 4-5 star review with a warm personal note (example: *"Thank you so much! I'm solo on this -- means a lot that you're along for the ride. ♥"*)
- Respond to every 1-3 star review calmly and helpfully. Never defensive. Offer the refund policy if the complaint is serious
- Response time target: 72 hours

### What we explicitly DO NOT do

- No "did you like it?" pre-prompts (manipulation, brand damage, Apple disfavors)
- No email follow-up asking for reviews (violates our no-notification-email rule)
- No incentivizing reviews with premium perks (banned by Apple/Google, account suspension risk)
- No prompting during onboarding (users have no feelings yet about the product)
- No ignoring negative reviews (unresponded 1-stars hurt rankings more than responded-to ones)

### Metrics to track monthly

- Total reviews count
- Average star rating
- Ratio: prompt fires → new reviews within 7 days (conversion of the moment)
- Category ranking for target keywords

## 24. Open Monetization Questions

- Which ad network to use (Google AdSense, Carbon, other)?
- Should there be a per-trip premium option for organizers who only travel once?
- Should currency converter use a free rate API (Open Exchange Rates free tier, Frankfurter) or a self-managed daily snapshot?
- Should receipt scanning have a usage cap even for premium users, or unlimited?
- Which affiliate programs to sign up with first (Booking.com and Skyscanner are the easiest / highest-volume starts)?
- Should the Find-flights / Find-hotels tools be built as a priority for v1 launch, or deferred until after the first 1,000 founder sales?

## 25. Upgrade Surfaces and Ad Zones (locked 2026-04-20)

### In-app premium discovery

Premium is not pushed at the user. It is surfaced once at maximum emotional resonance, then rests in a low-key account setting. No persistent dashboard card, no banner nudges, no repeated prompts.

**Surface 1 — Post-first-trip prompt (fires once per account, lifetime)**

Trigger: the organizer's first trip moves to Vaulted (trip completed) OR the InProgress → Stale transition fires 30 days post-end-date.

- A card appears on the dashboard idle state (not a modal, not a blocker)
- Copy: *"You just pulled off a whole trip. That's no small thing. Want to support TripWave and get some bonus features as a thank-you?"*
- CTA: *"Support the app — $4.99 once"*
- Secondary link: *"Maybe next time"* (card dismisses permanently)
- Fires once, never again regardless of future trips completed

**Surface 2 — Account menu ("Support the app" entry)**

- A single line in the account / profile dropdown: *"Support TripWave ♥"*
- Always present, always quiet
- Taps into the premium purchase sheet

**Surface 3 — Natural inline paywalls (at premium feature gates)**

- Offline access: inline card at the moment a user loses connectivity mid-trip
- Receipt scan: inline card below the "Scan receipt" button
- Ad removal: small *"Remove ads — $4.99"* link on the ad unit itself
- All inline cards use the supporter framing (warm, not salesy)

**What we explicitly do NOT do:**

- Persistent "Get Premium" banner on the dashboard
- Upgrade nudge emails (we send no marketing emails)
- Exit-intent or timed popups
- Any prompt in Travel Day focus mode or Vacation Day (protected surfaces)

### Ad zones — canonical placement (locked 2026-04-20)

**Format: banner + native card hybrid**

**Permitted ad placements (free tier only):**

| Surface | Format | Notes |
|---|---|---|
| Dashboard idle state | Bottom-fixed banner | Below the trip card list; hidden when a trip card is actively focused |
| Preplanning hub | Native card | Inserted after the 3rd or 4th section tile; styled as a section card with small *"Sponsored"* label in the corner |
| Vault / Memory page | Bottom-fixed banner | User is in a nostalgic, relaxed browsing mode |
| Between preplanning sections (scrolled past) | Native card | Inserted once per section list when user scrolls past completed sections |

**Permanently ad-free surfaces (all users):**

- Entire Travel Day (all phases — planning editor and focus mode)
- Entire Vacation Day (all views)
- Mid-expense entry or expense list
- Polls, active voting cards
- Any modal, sheet, or full-screen overlay
- Onboarding and setup flows
- Invite flow

**Format rules:**

- No interstitials — ever
- Banner max height: 50px fixed at bottom (does not scroll)
- Native card max height: same as a standard section tile; rounded corners matching tile style; *"Sponsored"* label in 10px small-caps in upper right corner
- Ads never animate (respects Liquid Motion System — only TripWave elements animate)
- Ad unit background matches the dark surface system; no white-background ad cards

**Premium behavior:** all ad placements permanently hidden on premium accounts. No ads appear anywhere for premium users.
