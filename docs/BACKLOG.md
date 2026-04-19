# Backlog

This backlog is meant to stay human-readable. It should help us choose the next best thing to build without needing a separate project tool yet.

## In Progress

- Setup page view + edit (UI only, mock data)
- Building phase pages one by one with mock data before wiring backend

---

## Build Workflow Audit (high priority before implementation)

Per CORE_LOOP.md → Build Workflow, every page needs a Step-1 detail inventory before code is written. Many UX_SPEC sections jumped straight to fun treatment without the detail layer. Each page below needs a detail inventory (what information, actions, states, edge cases, ordering) logged in UX_SPEC before implementation begins.

### Spine pages (MVP) -- detail inventory required before code

- [ ] Signup page -- Step-1 detail inventory
- [ ] Login page -- Step-1 detail inventory
- [ ] Dashboard (/app) -- Step-1 detail inventory (hero, trip list, action center fields)
- [ ] Trip creation flow (4 steps + Step 0 Real/Dream picker) -- per-step Step-1 inventory
- [ ] Trip overview (brand-new) -- Step-1 detail inventory
- [ ] Trip overview (established) -- Step-1 detail inventory (every stat tile, every card, every state)
- [ ] Preplanning hub -- Step-1 detail inventory (ball block, 8 section card states, CTA visibility rules)
- [ ] One preplanning section editor (to pick which one first) -- Step-1 detail inventory
- [ ] Itinerary page -- Step-1 detail inventory (day header fields, event card fields, filter states)
- [ ] Invite organizer page -- Step-1 detail inventory
- [ ] Invitee join landing -- Step-1 detail inventory
- [ ] Expenses page -- Step-1 detail inventory (balances fields, ledger row fields, budget breakdown)
- [ ] Travel Day planning-phase page -- Step-1 detail inventory
- [ ] Travel Day focus mode -- Step-1 detail inventory
- [ ] Trip ball modal -- Step-1 detail inventory

### Non-spine pages (Later) -- detail inventory required when pulled into active work

- [ ] Vacation Day page
- [ ] Packing page (My list, Group list, Suggestions)
- [ ] Polls page
- [ ] Wishlist page
- [ ] Notes page
- [ ] Vault page
- [ ] Tools hub
- [ ] Memory / Wrap-up page
- [ ] Members / permissions page
- [ ] Settings sub-routes
- [ ] Account / profile editor
- [ ] Dream Mode workspace surfaces

### Workflow discipline (ongoing)

- [ ] Before every future grill-me session on a page, confirm the Step-1 detail inventory exists or is being produced in that session
- [ ] UX_SPEC sections without a detail inventory must add one before implementation begins

---

## Monetization / retention work items (added 2026-04-17)

### Pre-launch audience building (start 6 months before launch)

- [ ] Choose platform for build-in-public (TikTok or Threads)
- [ ] Establish posting cadence: 2-3 honest-progress posts per week
- [ ] Pick ONE target niche community (r/solotravel, r/digitalnomad, etc.)
- [ ] Begin genuine participation in chosen community (answers, trip reports, help) -- no self-promotion
- [ ] Build pre-launch landing page with email capture, trip-ball demo, warm solo-dev copy
- [ ] Register on Product Hunt "upcoming" page (free)
- [ ] List in Indie Hackers showcase
- [ ] Weekly waitlist email template + content calendar
- [ ] Launch-day email template: "Founder's access opens in 2 hours. $4.99 forever, 1,000 spots."

### Pricing and launch

- [ ] Update all $5 references across code (marketing, pricing page, account premium page) to $7.99
- [ ] Private beta recruiting plan (50-150 users)
- [ ] Beta-user permanent-premium entitlement flag in the account model
- [ ] Founder's pricing infrastructure ($4.99 tier capped at first 1,000 public sales)
- [ ] Founder badge visual treatment on account
- [ ] Marketing site live "founder spots remaining" counter
- [ ] Price transition logic ($4.99 → $7.99 after founder's cap)

### Viral invite loop

- [ ] Soft cross-promote banner in invitee first-session
- [ ] Post-trip nudge for invitees who have not started their own trip
- [ ] Bonus-slot reward when an invitee starts their own trip (cap at +3 slots, max 7 total for free)
- [ ] In-app notification: "[Name] just started their first trip -- you earned a bonus free slot!"

### Retention

- [ ] Memory page permanent revisitable artifact with public share link
- [ ] Annual anniversary nudge (once per completed trip, once per year)
- [ ] Seasonal planning prompts (mid-Feb and mid-Sept, dismissible 90-day snooze)

### Dream Mode (slim version)

- [ ] Dream Mode trip-type picker in the creation flow (Real vs Dream)
- [ ] Shimmer / gradient / sparkle trip-ball variant for dreams
- [ ] "This is a dream" persistent chip on every dream page
- [ ] Public dream share link infrastructure (read-only)
- [ ] Reactions (emoji toggles) and comments (one-level threaded) on dream items for authenticated viewers
- [ ] Save-to-my-dreams cross-pollination action with warm in-app notification to original dreamer
- [ ] Hide Travel Day / Vacation Day / Memory phases for dream workspaces
- [ ] Dream-slot pool separate from the real-trip 4-slot free limit (free: 1, premium: unlimited)
- [ ] Private-dream toggle (premium supporter bonus)
- [ ] Extra sparkle ball visual variants unlocked by premium

### Dropped from Dream Mode scope (do not build)

- ~~Reality Check conversion flow~~ -- replaced by users manually using Find-flights / Find-hotels tools
- ~~Vibe theme catalog~~ -- aesthetic cosmetics stay free, not premium-gated
- ~~Mood Board component as a dream-specific feature~~ -- can be a regular trip feature if wanted later
- ~~Celebrity / character invitee treatment as a dream-specific feature~~ -- placeholder guests can work on regular trips

### Affiliate revenue

- [ ] Sign up for Booking.com and Skyscanner affiliate programs
- [ ] "How we earn" disclosure modal with solo-dev ♥ note
- [ ] Organic contextual affiliate chips in Preplanning Accommodations
- [ ] Organic contextual affiliate chips in Preplanning Transportation
- [ ] Affiliate chip in Wishlist activity ideas (destination-known trips)
- [ ] Affiliate chip in Vault Insurance empty state
- [ ] Find-flights tool (defer decision: v1 or post-1,000 sales)
- [ ] Find-hotels tool
- [ ] Find-rentals tool
- [ ] Find-tours tool

### Contingency levers (build only when behind-target triggers activate)

Tier 2 (do not build until year 2 review indicates 25%+ behind):

- [ ] Family plan SKU ($14.99 covering primary + 3 additional household accounts, full premium each)
  - [ ] $14.99 SKU in Stripe and platform stores
  - [ ] Family-member data model (primary + up to 3 secondaries with join/leave state)
  - [ ] Account → Premium → Manage family page
  - [ ] Self-leave flow for secondaries (primary cannot kick)
  - [ ] In-app notifications for add / leave events
  - [ ] 12-month slot-cooldown enforcement after self-leave
  - [ ] Refund propagation to all 4 accounts when primary refunds
- [ ] Curated public Dream Mode landing pages as SEO bait
- [ ] Editorial pitch template for cold outreach to travel publications

Tier 3 (do not build until year 3 review indicates 40%+ behind):

- [ ] Price-raise infrastructure ($7.99 → $9.99 for new purchases, grandfather existing)
- [ ] Free-tier slot-count reduction flow (4 → 3 slots with in-app communication)
- [ ] Rewarded video ad integration for bonus slot earning

### Supporter framing copy (solo-dev honesty)

- [ ] Premium purchase sheet headline + body: "Sorry about the ads. They exist because servers, databases, and one developer's rent all cost money. Premium is how you say thanks -- no more ads, plus some bonus features as a gift. $7.99, once, forever. No subscriptions, no guilt, no corporate anything. Just me and you. ♥"
- [ ] Premium purchase sheet bonus reveal: "As a thank-you: [dynamic list of bonuses]."
- [ ] Support card copy: "This one's a premium bonus. Tap to support the app and get it. $7.99 once, no strings."
- [ ] Moment card copy: "Sorry about the ads, and about this one..." with context-aware explanation and solo-dev acknowledgment
- [ ] Post-purchase confirmation toast: "You're a supporter now. Thank you ♥"
- [ ] "How we earn" affiliate disclosure copy: "TripWave is built by one person. If you book through these links, we earn a small commission -- no extra cost to you. It keeps the lights on and the trip ball rolling. ♥"
- [ ] Account page About section: "Made with ♥ by one person."

---

## P0 - UX Pass (from recent review, to tackle next)

These items came out of a review of the recent preplanning, itinerary, vacation-days, expenses, polls, and wishlist work. They describe cross-page integrations and a layout parity pass to bring every page up to the bento-box standard already set on preplanning. Each bullet is intended to become its own task.

### Unified Proposal Layer (Must Do's, Wishlist, Suggestions)

Must Do's, wishlist items, and suggestions are unified into a single Proposed layer. There is no separate wishlist page — all proposals share one data type with a status field: Must Do / Proposed / Approved / Scheduled.

- [ ] Design unified Proposed data model with status field
- [ ] Must Dos: shared across the group, attributed by person ("Alex's Must Do"), visually priority-highlighted in the queue
- [ ] App tracks unscheduled Must Dos and surfaces scheduling prompts on Itinerary
- [ ] Proposed items support reactions, up/down voting, and one-liner opinions
- [ ] Approved items stay in queue with Approved badge — not auto-moved to Itinerary
- [ ] Promote to Itinerary: deliberate action with date + time selection
- [ ] Per-page first-visit tooltip: brief popup explaining page purpose with examples, dismissed with "Got it", never shown again for that page (stored in user prefs)

### Itinerary ↔ Vacation Days unification

- [ ] "Today's schedule" on `/app/trips/[tripId]/vacation-days` pulls from the Itinerary data model (single source of truth)
- [ ] Edits made from Vacation Days flow back to Itinerary and vice versa (shared event detail, shared attach-expense/note/like surface)
- [ ] Decide: does Itinerary remain a separate sidebar tab, or collapse into Vacation Days during trip-in-progress?
- [ ] Navigation between the two feels continuous — same event detail view opens from either page

### Quick-action toolbar on trip workspace pages

- [ ] Add a top-of-page toolbar with quick actions: Log Expense, Create Poll, Create Scavenger Hunt challenge
- [ ] Toolbar is visible on every trip workspace page (minimum: Itinerary, Vacation Days, Expenses, Polls, Scavenger Hunt)
- [ ] Each action opens a small modal / sheet — no full page navigation required
- [ ] Actions write to the same underlying models as their dedicated pages

### Scavenger Hunt as its own sidebar tab

- [ ] Add `/app/trips/[tripId]/scavenger-hunt` route
- [ ] Add Scavenger Hunt to the main trip sidebar nav
- [ ] Scavenger Hunt info (active challenges, progress) is also surfaced inside the Vacation Days page during trip-in-progress
- [ ] Creating a challenge uses the same surface whether triggered from the sidebar tab or the quick-action toolbar

### Bento-box layout parity across the app

- [ ] Preplanning pages (`/app/trips/[tripId]/preplanning`) are the visual baseline — treat them as the reference for bento-box / large-scale UI layout
- [ ] Redesign Itinerary to the bento-box grid layout
- [ ] Redesign Vacation Days to the bento-box grid layout
- [ ] Redesign Expenses to the bento-box grid layout
- [ ] Redesign Polls to the bento-box grid layout
- [ ] Redesign Wishlist to the bento-box grid layout
- [ ] Redesign Travel Days to the bento-box grid layout
- [ ] Redesign Packing to the bento-box grid layout
- [ ] Redesign Group to the bento-box grid layout
- [ ] Redesign Settings to the bento-box grid layout
- [ ] Redesign Scavenger Hunt (new) to the bento-box grid layout from the start

---

## P0 - Active Foundation Work

### Product and planning

- [x] Create living product plan
- [x] Create roadmap, backlog, architecture, and design docs
- [x] Design and document app logic flow
- [x] Draft state model and monetization strategy docs
- [x] Decide free vs premium boundary for core collaboration
- [x] Lock monetization model (one-time $7.99, ad-supported free tier)
- [x] Confirm tech stack (Vercel, Neon, Azure, Resend)
- [x] Lock auth requirement (account required for all app features)
- [x] Confirm permissions model (per-user toggles set by organizer)
- [x] Confirm expense tracking starts day 0 (preplanning)
- [x] Define trip ball concept as core visual identity
- [ ] Finalize product name (TripWave is working, not locked)
- [ ] Lock MVP trip lifecycle states and auto-phase rules
- [ ] Lock first premium tier and paywall boundaries (nearly done, finalize during design)

### Frontend foundation

- [x] Scaffold Next.js project
- [x] Replace starter landing page
- [x] Create workspace placeholder route
- [ ] Define Tailwind color tokens for the dark surface system (base, raised, elevated, border)
- [ ] Build shared app shell layout using dark surface palette
- [ ] Add reusable section and panel primitives (cards on raised surface, elevated modals)
- [ ] Build mobile collapsible sidebar component (slide-in from left, hamburger toggle, overlay backdrop)
- [ ] Wire mobile sidebar to trip phase navigation (same items as desktop left rail)
- [ ] Build desktop left-rail phase navigation component (shared nav data with mobile sidebar)
- [ ] Confirm all surface color contrast ratios meet accessibility requirements

### Technical foundation

- [ ] Choose ORM: Prisma vs Drizzle
- [ ] Define initial database schema draft
- [ ] Model trip status, readiness, and next-action fields
- [ ] Model preplanning fields and completion tracking
- [ ] Add environment variable strategy
- [ ] Decide auth provider direction (Better Auth confirmed direction, config TBD)
- [ ] Set up Resend for transactional email (password reset, invite notifications)

## P1 - MVP Build

### Trip creation and structure

- [ ] Create trip onboarding flow: create blank trip → invite participants → async collaborative setup → trip workspace
- [ ] Approval mode selection in trip creation form (Open / Vote / Gated) — also editable in trip settings later
- [ ] Model trip phases and stage progress
- [ ] Model trip lifecycle statuses and readiness logic
- [ ] Define next best action computation rules
- [ ] Add trip dashboard overview
- [ ] Define setup-complete criteria in product and schema terms

### Setup page — high-level trip skeleton only

- [ ] Build setup view page (read-only display of trip configuration)
- [ ] Build setup edit form (creates or updates trip configuration)
- [ ] Trip name
- [ ] Multiple destinations — city + country per stop, ordered, with arrival/departure dates
- [ ] Start and end dates
- [ ] Transport mode multi-select (fly, drive, train, cruise — can select more than one)
- [ ] Traveler count stepper
- [ ] Trip type pills (beach, city, adventure, road trip, family, romantic, group, honeymoon)
- [ ] Trip vibe pills (relaxed, packed, spontaneous, structured)
- [ ] Ball color picker — brand palette swatches + custom hex option
- [ ] Budget target, currency (ISO 4217), and type toggle (total vs per-person)
- [ ] Invite mode selection (private, invite-only, public link)

### Preplanning page — dynamic detail driven by Setup

All sections are optional. Sections shown/hidden based on Setup choices.

- [ ] Section: Transport details — Flying (shown when fly selected in Setup)
  - [ ] Multiple flight legs (outbound, return, connections, separate mid-trip flights)
  - [ ] Per leg: origin/destination airport (IATA + full name), departure/arrival date+time (with timezone), flight number, airline, confirmation/booking ref, ticket class, connection flag
  - [ ] Per leg per traveler: seat number, boarding group, meal preference, checked bags count, baggage allowance
  - [ ] Per traveler: frequent flyer number, TSA PreCheck/Known Traveler Number, passport number (for international), Known Traveler ID
  - [ ] Check-in open time, online check-in status toggle
  - [ ] Terminal and gate fields (fillable day-of)
  - [ ] Ticket price per leg (auto-links to expense ledger)
  - [ ] Airport transfer notes per leg
- [ ] Section: Transport details — Driving (shown when drive selected in Setup)
  - [ ] Own car vs rental toggle
  - [ ] Car rental: company, pickup/return location, pickup/return date+time, confirmation ref
  - [ ] Key stops / waypoints list
  - [ ] Estimated total drive hours
- [ ] Section: Transport details — Train (shown when train selected in Setup)
  - [ ] Multiple train legs: stations, times, train number, service label, confirmation ref, seat class
  - [ ] Rail pass toggle: pass name, confirmation ref
- [ ] Section: Transport details — Cruise (shown when cruise selected in Setup)
  - [ ] Cruise line, ship name, ports, embarkation/disembarkation date+time, cabin class, confirmation ref
- [ ] Section: Lodging — always shown
  - [ ] Multiple entries: property name, type (hotel/airbnb/hostel/rental/other), city, full address, check-in/out dates+times, confirmation ref, contact number, notes
  - [ ] Per entry: room type, bed type, number of rooms, floor/unit number
  - [ ] Per entry: included amenities (breakfast, parking, wifi, pool — tag multi-select)
  - [ ] Per entry: cancellation deadline, cancellation policy notes
  - [ ] Per entry: loyalty/rewards program number, early check-in or late checkout request notes
  - [ ] Per entry: nightly rate + total cost (auto-links to expense ledger)
  - [ ] Number of suggested entries informed by destination count from Setup
- [ ] Section: Group composition (shown when travelerCount > 1)
  - [ ] Per-traveler: name, dietary needs (tag multi-select), mobility needs, medical notes (private), emergency contact
- [ ] Section: Budget breakdown (shown when budget set in Setup)
  - [ ] Category budgets: flights, accommodation, food, activities, transport, misc
  - [ ] Per-person breakdown view
- [ ] Section: Destination info — always shown
  - [ ] Per destination: timezone, local currency, language notes, seasonal warnings, local holiday notes
- [ ] Section: Visa and health entry (international destinations only)
  - [ ] Per destination: visa required toggle, visa notes, health entry requirements (vaccinations, tests)
- [ ] Section: Power adapter (international destinations only)
  - [ ] Adapter needed toggle, adapter type, voltage notes
- [ ] Section: Driving rules (shown when drive selected in Setup)
  - [ ] Road side, speed units, IDP required toggle, transit notes
- [ ] Section: Documents — always shown
  - [ ] Per traveler: passport expiry, visa docs, travel insurance ref, vaccination record, loyalty program numbers
- [ ] Section: Pre-departure logistics — always shown
  - [ ] Airport parking or transport arranged
  - [ ] House key left with someone
  - [ ] Pet care arranged (shown when trip >= 3 days)
  - [ ] Mail hold requested
  - [ ] Out-of-office set
  - [ ] Medication supply checked (shown when medical needs flagged)
  - [ ] School absence arranged (shown when children in group)
  - [ ] Car maintenance checked (shown when drive selected)

### Preplanning wizard

- [ ] Build preplanning wizard UI (multi-step or long-form)
- [ ] Implement group composition fields (travelers, ages, dietary, mobility, medical, emergency contacts)
- [ ] Implement transportation fields (mode, flight details, drive details, transfers)
- [ ] Implement accommodation fields (lodging type, confirmation numbers, costs)
- [ ] Implement budget fields (total, per-person, per-category)
- [ ] Implement destination info fields (timezone, currency, visa, health entry, adapters)
- [ ] Implement documents and logistics fields (passport, insurance, loyalty programs, embassy info)
- [ ] Implement trip character fields (type, vibe, wishlist, must-dos, exclusions)
- [ ] Implement pre-departure logistics fields (parking, house, pets, school)
- [ ] Compute preplanning completion percentage (feeds trip ball fill)
- [ ] Skip inapplicable fields from completion denominator (e.g., visa for domestic trips)
- [ ] Link preplanning costs (flights, hotels) to expense ledger automatically

### Trip ball

- [ ] Design trip ball SVG/Canvas component
- [ ] Implement center-outward fill animation driven by preplanning completion %
- [ ] Implement ocean-wave pulse animation (slow, organic, not mechanical)
- [ ] Implement rolling animation between phase transitions
- [ ] Add subtle face micro-expression (shadow or curve asymmetry — not a cartoon)
- [ ] Add per-trip ball color picker (user personalization)
- [ ] Define and implement all ball states (empty, filling, full, alert, celebrating, sleeping)
- [ ] Add alert agitation animation for blocker states
- [ ] Add milestone celebration burst animation

### Itinerary

- [ ] Add itinerary item model
- [ ] Create itinerary list and day view
- [ ] Support event notes, times, and locations
- [ ] Allow all participants to submit itinerary items (default, subject to organizer permissions)
- [ ] Allow organizer to toggle per-user itinerary permissions

### Packing

- [ ] Add packing list model
- [ ] Lists are personal by default
- [ ] Add option for user to make their list visible to the group
- [ ] Add per-item privacy toggle (hide specific items from all other users)
- [ ] Add destination-aware packing suggestions (premium — vibe and destination based)

### Travel day

- [ ] Add travel-day data model (date, transport mode, ordered task list, departure window, stopover checkpoints)
- [ ] Each traveler has their own personal checklist instance (not shared)
- [ ] Checklist public/private toggle per user (public = visible to group)
- [ ] Combine two checklists into side-by-side display view (display merge, not data merge — clean to uncombine)
- [ ] Group status summary on travel day overview: who has checked off what (public checklists only)
- [ ] Manual "We're off" trigger by organizer to enter Travel Day state (not automatic — accounts for delays)
- [ ] Build vertical timeline UI component for travel day
- [ ] Implement task check-off with completed visual state (dim and strike-through)
- [ ] Implement auto-scroll animation to next incomplete task on check-off
- [ ] Build default task preset system per transport mode (flight, drive, train, cruise)
- [ ] Allow task customization: add, remove, reorder (drag), rename
- [ ] Support task editing during planning phase and on the day itself
- [ ] Keep completed tasks visible below current position (do not remove on check-off)
- [ ] Collapse non-essential planning UI and phase nav when travel day is active
- [ ] Build mobile-optimized travel day view (full-screen timeline, large tap targets, single column)

### Expense tracking

- [ ] Add expense model (amount, description, date, category, payer, splits, include_in_report flag)
- [ ] Allow expense logging from day 0 (during preplanning)
- [ ] Link preplanning accommodation and transport costs to expense ledger
- [ ] Allow expense logging from within calendar events
- [ ] Support per-expense payer assignment
- [ ] Support split amounts per traveler (even or custom)
- [ ] Implement settlement tracking (both sides mark settled independently)
- [ ] Add full expense ledger view per trip
- [ ] Add budget setting per trip (total and per-category)
- [ ] Add budget progress tracking with overage warnings
- [ ] Add end-of-trip expense summary (day 0 through return)
- [ ] Allow excluding specific expenses from specific reports

### Polls

- [ ] Add poll model (question, options, expiry, status)
- [ ] Support group voting (all users by default)
- [ ] Allow organizer to close polls manually
- [ ] Allow winning option to be converted to an itinerary item
- [ ] Polls are free for all users

### Proposal, Approval, and Communication System

- [ ] Unified Proposed data model (status: Must Do / Proposed / Approved / Scheduled)
- [ ] Approval mode setting: Open, Vote, Gated — set in trip creation wizard and editable in trip settings
- [ ] Vote mode: vote closes on full participation, set end date, or manual close by admin or vote creator
- [ ] Approved items stay in Proposed queue with Approved badge — not auto-moved to Itinerary
- [ ] Promote to Itinerary: deliberate one-tap action with date and time selection
- [ ] Activity feed per trip: state-change log (item added, voted, approved, promoted — no free text)
- [ ] Reactions on proposed items and itinerary events (emoji, one per user per item)
- [ ] One-liner opinion per user per item: quick-response chips + text input (not textarea), 100 char cap
- [ ] Nudge: sends push notification to non-voters on a pending vote
- [ ] Must Do scheduling reminders: app prompts when Must Dos haven't landed on Itinerary

## P2 - Collaboration

- [ ] Invite link system: general link (not per-person), with optional approval gate toggle set when generating the link
- [ ] Organizer can disable non-admin invite link generation in trip settings
- [ ] QR code version of active invite link
- [ ] Invite landing page (unauthenticated): shows trip name, destination, dates, organizer — CTA "Join this trip — it's free"
- [ ] New user joining via invite link skips empty dashboard and lands in trip workspace with Must Dos prompt
- [ ] Participant first-action prompt: "What are your Must Dos for this trip?" before reaching full workspace
- [ ] Three permission roles: Viewer (read-only), Contributor (add proposals, log expenses, vote), Co-organizer (full access)
- [ ] Roles are presets — organizer can override individual permission toggles per user for precision
- [ ] Per-user permission management UI (trip settings → click user → role selector + individual toggles)
- [ ] Notification settings: per-type push notification toggle in account settings (all on by default)

## P2 - Social Layer

- [ ] Add likes/reactions to itinerary events, wishlist items, notes posts, expenses, poll options
- [ ] Add comments to itinerary events, wishlist items, notes posts, expenses
- [ ] Add favorites to itinerary events, wishlist items, notes posts
- [ ] Build favorites list view (accessible from user account area and trip sidebar)
- [ ] In-app notification bell with unread badge count (all versions)
- [ ] Notification list panel or page
- [ ] Notification triggers: comments, likes, new participant joined, poll closed, expense settled, trip invite, travel day reminder
- [ ] Push notifications for native app version (deferred until native build)

## P2 - Activity Wishlist

> Design note: The wishlist is now part of the Unified Proposal Layer (see P1 Proposal, Approval, and Communication System). The `/wishlist` route and sidebar tab still exist as a view into the Proposed queue filtered to non-Must-Do items. The separate wishlist data model is replaced by the shared Proposed model.

- [ ] Build wishlist/proposal UI (filter view of Proposed queue — Proposed and Approved status items, excluding Must Dos)
- [ ] Support reactions and one-liner opinions on proposed items (shared with proposal system)
- [ ] One-tap promotion from proposed to itinerary with date + time selection (shared with proposal system)
- [ ] One-tap poll escalation from a proposed item
- [ ] Organizer can restrict proposal posting per user via existing permission toggles

## P2 - Trip Notes

- [ ] Add notes post model (author, content, timestamp, event attachment, visibility)
- [ ] Build shared notes "All" tab (newest first)
- [ ] Build event notes tab (notes attached to specific itinerary events)
- [ ] Allow filtering between All and Event tabs
- [ ] Support likes and comments on shared notes posts
- [ ] Build personal notes (private, author-only, no social layer)
- [ ] Allow notes to be attached to itinerary events at write time
- [ ] Show event-attached notes inline in event detail view

## P2 - Countdown Widget

- [ ] Build countdown widget component (days until departure)
- [ ] Implement display state changes by time threshold (60 days, 30, 14, 7, 1, departure day)
- [ ] Show "Day X of Y" when trip is in progress
- [ ] Show nostalgic completed state after trip ends
- [ ] Connect countdown urgency to ball pulse rhythm

## P2 - Read-Only Share Link

- [ ] Add share link generation to trip settings
- [ ] Build public read-only itinerary view (no account required)
- [ ] Organizer toggle for showing or hiding traveler names in public view
- [ ] Always exclude: expenses, packing lists, private notes, polls
- [ ] TripWave branding and "Plan your trip" CTA on public view
- [ ] Revoke link action in trip settings

## P2 - Memory Vault

- [ ] Auto-generate memory vault at trip wrap-up
- [ ] Display: trip summary, participant list, expense totals, vibe, promoted wishlist items
- [ ] Free-text recap field with author attribution
- [ ] Likes and comments on the recap
- [ ] Build end-of-trip circle breakdown visual (green, blue, yellow, pink, orange clusters)
- [ ] Make vault read-only after 30-day grace period
- [ ] Shareable public link for memory vault (same rules as itinerary share link)
- [ ] Surface past vaults from user dashboard past trips list

## P2 - Dream Trip Mode

- [ ] Add Dream Trip flag to trip data model (toggle at creation or in trip settings)
- [ ] Dream Trip ball: distinct color/animation state in dashboard and workspace
- [ ] Budget and expenses optional and untotaled in Dream Mode (no overage warnings, no settlement)
- [ ] Public share link on by default for Dream Trips
- [ ] "Make it real" CTA in trip settings — converts Dream Trip to live trip (premium upsell moment)
- [ ] Dream Trips count against trip slots (same as real trips)
- [ ] Vault entry for Dream Trips displays as vision board rather than trip summary
- [ ] Dashboard distinguishes Dream Trips visually from active and vaulted real trips

## P3 - Trip Duplication (Premium)

- [ ] Build duplicate trip action (organizer only, premium)
- [ ] Define and copy: trip type, vibe, packing structure, travel day task groups, permission presets
- [ ] Exclude: dates, participants, expenses, itinerary events, confirmation numbers
- [ ] Show clear pre-confirmation screen of what will and will not be copied
- [ ] Prompt upgrade for free users attempting to duplicate


## P2 - Tools

- [ ] Build time zone info display (home vs destination — no external API)
- [ ] Build currency converter (premium — free or self-managed exchange rate source)
- [ ] Research free exchange rate APIs (Frankfurter, Open Exchange Rates free tier, ECB)

## P2 - Monetization

- [ ] Implement premium entitlement (one-time $7.99 purchase, permanent unlock)
- [ ] Implement ad slot components with isPremium guard
- [ ] Define ad placement zones (acceptable and protected locations)
- [ ] Research ad network options (Google AdSense, Carbon, other)
- [ ] Design upgrade prompts for offline mode, receipt scanning, currency converter, smart suggestions
- [ ] Build premium purchase flow (Stripe one-time payment)
- [ ] Build pricing and upgrade page at /app/account/premium

## P3 - Premium Features

- [ ] Offline mode: cache itinerary, travel-day checklists, packing lists for offline access
- [ ] Receipt scanning: Azure OCR integration for expense photo capture (premium)
- [ ] Smart suggestions engine: vibe-aware, destination-aware, season-aware, group-aware
- [ ] Advanced travel-day templates
- [ ] Trip export (itinerary as shareable or printable format)
- [ ] Trip templates (save and reuse a trip structure)
- [ ] Set up Resend transactional email (password reset, invite notifications)
- [ ] Set up Azure for receipt OCR (premium receipt scanning)

## P3 - Expenses and Advanced Features

- [ ] Research and evaluate offline sync conflict resolution approaches
- [ ] Plan offline storage and sync behavior

## P2 - Planning Tools

- [ ] Integrate Open-Meteo weather API (free) for destination weather preview
- [ ] Build weather preview card in preplanning (temperature range, precipitation, notable conditions)
- [ ] Feed weather data into smart suggestions engine (packing and activity prompts)
- [ ] Build document checklist generator (deterministic rules by destination and trip type)
- [ ] Link document checklist items to preplanning completion score
- [ ] Build jet lag calculator (time zone difference, sleep strategy, first-day schedule)
- [ ] Show jet lag calculator when international flight is entered
- [ ] Build packing calculator (trip length + climate + activities = suggested list)
- [ ] Feed packing calculator output into packing list (accept all, pick, or dismiss)
- [ ] Build group availability checker (manual date entry, overlap view for organizer)
- [ ] Build pre-trip shared shopping list (collaborative, assignable items, optional expense link)

## P2 - Destination Reference Tools

- [ ] Build language phrasebook (curated static phrase sets per language, key categories)
- [ ] Add offline phrasebook download for premium users
- [ ] Build allergy and medical card generator (pre-built translations per language, printable)
- [ ] Surface allergy card during travel day and vacation day for quick access
- [ ] Build tipping guide (country-by-country norms, static lookup)
- [ ] Build voltage and adapter guide (plug type, local voltage, converter needed, static lookup)
- [ ] Build driving and transit basics card (road side, speed units, transit options, IDP requirement)
- [ ] Build emergency contacts card (auto-generated per destination, always free, always offline-accessible)
- [ ] Build unit converter (temperature, distance, weight, liquid, speed -- no API)

## P2 - During-Trip Coordination Tools

- [ ] Build quick bill splitter (total, tip %, people -- optional expense log)
- [ ] Build meetup point broadcaster (manual location message, visible to group, clears daily)
- [ ] Build quick thumbs vote (single yes/no proposition, closes on full vote or organizer close)
- [ ] Build departure day brief card (surfaces night before any travel day, summary of docs, weather, day 1 plan)

## P2 - Memory and Documentation Tools

- [ ] Build confirmation number vault (label, code, provider, date, notes -- text only)
- [ ] Add offline confirmation vault access for premium users
- [ ] Build trip statistics generator (auto at wrap-up: days, total spend, events, participants, etc.)
- [ ] Build post-trip poll (organizer creates or auto-generated with suggested categories)
- [ ] Build scavenger hunt (organizer creates challenges, participants check off, point system)
- [ ] Challenge types: photo submission, location check-in, trivia question, QR code scan, text answer
- [ ] Sequential challenge unlocking (challenges reveal one at a time after completion)
- [ ] Point system with live leaderboard visible to all participants
- [ ] Hint system: organizer sets hints per challenge, participants unlock at point penalty
- [ ] Timed challenges: organizer sets a completion deadline per challenge
- [ ] Team vs individual mode (set at hunt creation)
- [ ] Push notification on challenge unlock ("Your next challenge is ready")
- [ ] Organizer live progress dashboard (see everyone's status in real time)
- [ ] Completion celebration animation (water-themed burst)
- [ ] Collaborative hunt creation: non-organizer participants can suggest challenges (subject to approval mode); complicates planning in a fun way and drives more screen time for all involved
- [ ] Show scavenger hunt in vacation day section when trip is in progress

## P2 - Smart and Proactive Tools

- [ ] Build seasonal warning system (deterministic rules by destination region and date range)
- [ ] Cover: hurricane, monsoon, extreme heat, wildfires, jellyfish, polar night, peak tourist season
- [ ] Surface seasonal warnings during preplanning destination info section
- [ ] Build local public holiday alerts (closure warnings and festival alerts by country and date)
- [ ] Show holiday alerts during preplanning
- [ ] Connect all smart tool outputs into single suggestion engine (vibe, destination, group, weather, season)
- [ ] Safety-critical outputs (emergency contacts, allergy card, seasonal warnings) always free regardless of premium

## P2 - Accessibility and Comfort Tools

- [ ] Add accessibility needs flags to user profile (mobility, dietary, sensory, service animal, hearing, vision)
- [ ] Surface accessibility prompts throughout planning (preplanning, itinerary, packing, travel day)
- [ ] Show group-level accessibility summary to organizer (not individual medical detail)
- [ ] Build medication reminder (time-based, time zone aware, private to user, push on native / in-app on web)
- [ ] Build kids and family mode prompts (trigger when children flagged in group composition)
- [ ] Kids prompts cover: packing suggestions, nap schedule in itinerary, travel day items, accommodation reminders, kid-friendly wishlist filter

## Research Queue

- [ ] Evaluate PWA-first mobile strategy vs Capacitor later
- [ ] Explore map and place integrations for events
- [ ] Explore calendar import and export needs
- [ ] Explore domain and naming availability
- [ ] Decide payment processor for one-time $7.99 premium (Stripe likely)
- [ ] Evaluate free exchange rate data sources for currency converter
- [ ] Evaluate Azure OCR pricing at expected premium user volume
- [ ] Explore whether smart suggestions can be built entirely with deterministic rules

## Ready Next

The strongest next implementation items are:

1. shell layout and navigation design decisions
2. trip ball visual design and animation spec
3. preplanning wizard field structure and completion model
4. trip state object and readiness schema draft
5. auth and trip creation direction
