# Backlog

This backlog is meant to stay human-readable. It should help us choose the next best thing to build without needing a separate project tool yet.

## In Progress

- Setup page view + edit (UI only, mock data)
- Building phase pages one by one with mock data before wiring backend

---

## P0 - Active Foundation Work

### Product and planning

- [x] Create living product plan
- [x] Create roadmap, backlog, architecture, and design docs
- [x] Design and document app logic flow
- [x] Draft state model and monetization strategy docs
- [x] Decide free vs premium boundary for core collaboration
- [x] Lock monetization model (one-time $5, ad-supported free tier)
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

- [ ] Create trip onboarding flow (lands in setup edit form)
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
  - [ ] Per leg: origin/destination airport (IATA), departure/arrival date+time, flight number, airline, confirmation ref, seat class, connection flag
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
  - [ ] Multiple entries: property name, type, city, address, check-in/out dates+times, confirmation ref, contact number, notes
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

## P2 - Collaboration

- [ ] Add invite code workflow
- [ ] Add per-user permission management UI (trip settings → click user → toggle features)
- [ ] Add simplified permission presets on trip creation form with link to full settings
- [ ] Add QR code for invite sharing

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

- [ ] Add wishlist item model (title, description, category, author, created at)
- [ ] Build wishlist UI within preplanning and trip workspace
- [ ] Support likes and comments on wishlist items
- [ ] One-tap promotion from wishlist to itinerary (with undo)
- [ ] One-tap poll escalation from wishlist item
- [ ] Organizer can restrict wishlist posting per user via existing permission toggles
- [ ] Wishlist item removed from list on promotion, restored on undo

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

- [ ] Implement premium entitlement (one-time $5 purchase, permanent unlock)
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
- [ ] Build scavenger hunt (organizer creates challenges, participants check off, optional points)
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
- [ ] Decide payment processor for one-time $5 premium (Stripe likely)
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
