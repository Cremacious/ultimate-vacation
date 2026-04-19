# Logic Flow

This document describes how the app should think. It is not just the screen order. It is the product logic behind who can do what, when a trip changes state, which tools become important in each phase, and how the app should guide people without overwhelming them.

## Design Goal

The app should feel like a smart trip conductor:

- always clear about what stage the trip is in
- always suggesting the most useful next step
- collaborative without becoming messy
- playful in tone but serious about keeping the trip on track

## Core Product Logic Model

There are four main layers of app logic:

1. Account logic
2. Trip lifecycle logic
3. Phase guidance logic
4. Collaboration and accountability logic

## 1. Account Logic

### User types

- visitor (unauthenticated)
- signed-up user (organizer or participant)
- premium organizer

### Basic logic

- a visitor can only access marketing pages, login, signup, legal, and contact — no app features
- a signed-up user can create trips and join trips
- an invited participant must create an account before accessing any trip features
- a premium organizer has purchased the one-time $5 upgrade and unlocked premium features

### Auth rule

Account creation is required for all app interactions. There is no lightweight guest or anonymous join mode.

## 2. Trip Lifecycle Logic

Each trip should have a lifecycle status and a current planning phase.

### Trip statuses

- draft
- planning
- ready
- in_progress
- completed
- archived

### Status meanings

#### Draft

The trip exists but core setup is incomplete.

Examples:

- missing dates
- destination not chosen
- no travelers added

#### Planning

The trip basics exist and the organizer is actively preparing.

This is the main pre-trip working state.

#### Ready

The trip is close enough to departure that the app should shift from loose planning to execution-oriented guidance.

Suggested criteria:

- at least one itinerary item or reservation exists
- at least one packing list exists
- at least one travel-day plan exists for departure

#### In Progress

The trip date has arrived and the app should prioritize what is happening now.

#### Completed

The trip dates are over, but expenses, wrap-up items, and settlement may still remain.

#### Archived

The trip is hidden from the active workspace but remains stored for history.

## 3. Phase Guidance Logic

The app should have a primary phase and secondary suggested tasks.

### Proposed phases

1. Setup
2. Preplanning
3. Itinerary
4. Packing
5. Travel Day
6. Vacation Day
7. Expenses
8. Wrap-Up

### Why this phase model is better

It separates "setting up the trip" from "planning the trip" and separates "travel day" from the actual "vacation day" experience.

### Phase selection logic

The app should determine a recommended active phase using:

- current date relative to trip
- completeness of required planning data
- whether a travel day is happening today
- whether the trip is currently in progress
- whether there are unresolved expenses after the trip

### Recommended phase logic

#### Setup phase when:

- trip basics are incomplete

#### Preplanning phase when:

- setup is complete
- the trip is more than a few days away
- preplanning questions or suggestions are still unresolved

#### Itinerary phase when:

- core trip details exist
- the trip needs event planning, reservations, or schedule shaping

#### Packing phase when:

- departure is approaching
- lists are still incomplete
- packing-sensitive suggestions matter

#### Travel Day phase when:

- there is a travel day today or tomorrow
- the app should emphasize ordered checklists and timing

#### Vacation Day phase when:

- the trip is in progress but no travel day is active right now
- the app should emphasize today's schedule, meetup times, and quick changes

#### Expenses phase when:

- there are unresolved expenses or budget concerns
- user intent is finance-oriented even if another phase is active

#### Wrap-Up phase when:

- the trip is complete
- settlement, recap, and archive actions remain

## 4. Preplanning Logic

Preplanning is a comprehensive wizard that captures everything the app might need to guide the trip. The more fields completed, the higher the preplanning fill on the trip ball.

### Preplanning field categories

#### Group composition

- traveler list (names, roles)
- ages or generational mix (kids, teens, adults, elderly)
- dietary restrictions and allergies per traveler
- mobility or accessibility needs
- medical considerations relevant to the trip
- emergency contacts per traveler

#### Transportation

- primary transport mode (flying, driving, train, bus, cruise, mixed)
- if flying: departure airport, arrival airport, airline, flight numbers, ticket costs, layovers, baggage allowance, seat preferences
- if driving: cars, drivers, estimated fuel cost, tolls, planned rest stops, preferred route
- if train or bus: stations, routes, class of service
- rental cars or local transport at destination
- airport transfers (how getting from airport to lodging)

#### Accommodations

- lodging type (hotel, Airbnb, camping, hostel, family, cruise ship)
- name and address
- check-in and check-out times
- confirmation numbers and booking references
- nightly cost (links to expense tracking)
- multiple stays within the trip if applicable

#### Budget

- total trip budget
- per-person budget target
- category budgets (transport, lodging, food, activities, shopping, misc)
- currency if traveling internationally

#### Destination info

- country, city, region
- time zone difference from home
- local currency
- language or languages spoken
- visa or entry requirements
- vaccination or health entry requirements
- power adapter needed
- seasonal or weather considerations (hurricane season, monsoon, extreme heat)

#### Documents and logistics

- passport required and expiration dates checked
- driver's license valid at destination
- travel insurance (yes or no, provider, policy number, coverage type)
- loyalty programs or rewards to apply (airline miles, hotel points)
- local emergency numbers at destination
- home country embassy or consulate contact for international trips

#### Trip character

- trip type (beach, city, adventure, road trip, family, romantic, group friends, honeymoon, etc.)
- trip vibe / pace (relaxed, packed schedule, spontaneous, structured)
- activity interests and wishlist (feeds itinerary suggestions)
- must-do anchors (non-negotiables for the group)
- known exclusions (things to avoid)

#### Pre-departure logistics

- parking at airport or departure point
- house or mail arrangements while away
- pet boarding or house-sitting arrangements
- kids' school notification if applicable

### Preplanning completeness rules

Preplanning completion is measured as a percentage and drives the trip ball fill level.

The app should weight fields by importance:

- transport mode: high weight
- dates and destination: high weight (required for setup)
- group composition: medium weight
- accommodation details: medium weight
- budget: medium weight
- destination info: medium weight
- documents checklist: medium weight
- trip vibe and wishlist: lower weight but feeds suggestions

Fields that are not applicable (e.g., "visa requirements" for a domestic trip) should be excluded from the completion denominator.

### Preplanning expense linking

Pre-trip expenses entered during preplanning (flights, hotels, tickets) are automatically added to the expense ledger with the appropriate payer and amounts. This avoids double-entry.

## 5. Next Best Action Logic

One of the most important product behaviors should be a clear next best action.

Every trip should compute:

- primary next action
- secondary suggestions
- blockers

### Example primary next actions

- add trip dates
- invite travelers
- add your first reservation
- create departure checklist
- finish packing list
- settle shared expenses

### Rule for the primary action

The app should show the action that most reduces trip risk, not just the chronologically next task.

Example:

- if the trip is tomorrow and there is no travel-day plan, that should outrank polishing the itinerary

## 6. Organizer vs Participant Logic

### Organizer responsibilities

- create and own the trip
- edit trip settings
- manage invite codes
- set phase defaults
- control per-user permissions
- resolve poll ties if needed

### Participant responsibilities

- join a trip
- view relevant plans
- contribute to itinerary, packing, votes, and expenses as permitted

### Permission model

Organizer sets per-user permissions at trip creation (simplified presets) and in full trip settings at any time.

Trip settings allows the organizer to click any user and toggle individual capabilities:

- can add itinerary items
- can edit itinerary items
- can delete itinerary items
- can view group packing lists
- can add expenses
- can start polls
- can vote on polls
- can invite others

Default at trip creation: all participants can add and edit itinerary items, log expenses, vote on polls. Organizer can tighten or expand from there.

Trip creation form offers a simplified permission preset with a note pointing users to trip settings for full control.

## 7. Invite and Join Logic

### Organizer flow

1. create trip
2. generate invite code or link
3. share invite

### Participant join flow

1. open invite link or enter code
2. create account if they do not have one (required — no anonymous joining)
3. join trip workspace
4. choose trip-relevant profile details if needed (dietary needs, emergency contact, etc.)

## 8. Travel Day Logic

Travel day is one of the strongest differentiators, so it deserves explicit rules.

### Core UI: vertical timeline

The travel day page is a single vertical timeline. Tasks run top to bottom in the order they should be done. The user works through the list by tapping to check off each item. As each task is completed, the view auto-scrolls with a smooth animation to bring the next incomplete task near the top of the screen.

This is a mobile-first interface. Users will be on their phones while physically moving through the day. The design must prioritize large tap targets, a clean single-column layout, and no unnecessary chrome.

### Default task structure (flight example)

A first travel day with a flight departure would default to something like:

1. Wake up
2. Eat breakfast
3. Double check you have your tickets and ID
4. Double check you have your chargers and essentials
5. Turn off all appliances and electronics
6. Lock up and leave the house
7. Arrive at the airport
8. Check in and get through security
9. Find your gate
10. Board the plane

The exact defaults depend on the transport mode entered during preplanning. A drive day has different defaults than a flight day or a train day.

### Task customization

Users can customize the task list for any travel day. Customization is available:

- during the planning phase, when building out the trip
- on the day itself, if something needs to be added or removed in the moment

Customization actions:

- add a new task at any position
- remove a task
- reorder tasks by dragging
- rename a task

Task edits on the day do not affect the planning-phase template. Future travel days on the same trip keep their own separate lists.

### Auto-scroll behavior

When a task is checked off:

1. The task animates into a completed visual state (subtle strike-through or dim)
2. The view smoothly scrolls down to bring the next incomplete task near the top of the viewport
3. The scroll uses an eased animation -- not instant, not slow -- just enough to feel intentional
4. If the user is mid-scroll when they tap a task, the auto-scroll waits until their scroll settles before running

Completed tasks remain visible below the current position so users can reference or undo them. They do not disappear.

### Travel day objects

Each travel day should include:

- target date
- transport mode (flight, drive, train, cruise, etc.)
- departure window
- ordered task list (customizable)
- required items (linked from packing)
- stopover checkpoints if applicable
- arrival steps

### Travel day page behavior

When a travel day is active, the app:

- shows the vertical timeline as the primary view
- collapses non-essential planning UI and phase nav
- highlights overdue tasks prominently if the user is behind schedule
- keeps the most immediate next task visually in focus at all times
- allows one-tap check-off with no confirmation required

### Smart behaviors to build later

- surface a "you should leave in X minutes" prompt based on departure time
- emphasize must-bring items before the "leave the house" step
- connect departure day brief (the night-before card) to the first task in the timeline

## 9. Vacation Day Logic

Once the trip is underway, the app should stop behaving like a planner and start behaving like a daily coordination tool.

### Priority order during vacation days

1. today's schedule
2. next meetup
3. active reservations
4. quick add event
5. group vote or group update
6. expenses from today

### Features during vacation days

- daily briefing card each morning
- "what changed today" summary
- one-tap vote prompts when plans are uncertain
- quick expense logging from within events
- weather-aware reminders (later)

## 10. Expense Logic

Expense tracking starts at day 0 — the moment users begin entering pre-trip costs during preplanning.

### Expense lifecycle

1. pre-trip: enter flights, hotels, tickets, deposits during preplanning
2. in-trip: add expenses anytime — freestanding or attached to a calendar event
3. post-trip: settle balances and close the ledger in wrap-up

### Core actions

- log expense (amount, description, date, category)
- assign payer (who paid out of pocket)
- split across travelers (even split, custom amounts, or exclude certain travelers)
- mark individual user portions as settled (user marks their side, payee marks receiving)
- expense closes when all splits are marked settled by both sides

### Settlement behavior

Users settle money outside the app (cash, Venmo, etc.). The app tracks settlement state:

- user who owes marks their side paid
- user who is owed marks they received payment
- when both sides are marked, expense is considered settled and closed

### Expense reports and budgets

- full expense ledger per trip (day 0 through end of trip)
- budget tracking per category
- end-of-trip summary showing total from day 0 through return
- users can mark specific expenses as excluded from specific reports
- budget overage warnings as costs accumulate

### Receipt scanning (premium)

- premium users can scan receipts to auto-populate expense fields
- uses Azure OCR
- free users see the feature with an upgrade prompt

## 11. Poll and Decision Logic

Polls are free for all users.

### Good poll triggers

- choosing between activities
- choosing restaurant options
- picking meetup times

### Suggested guardrails

- polls should expire
- organizer can close a poll manually
- winning poll options should be easy to convert into itinerary items later

## 12. Tools Logic

### Currency converter (premium)

- built into the expense and budget flows
- also available as a standalone tool within the trip
- converts between home currency and destination currency
- exchange rates updated from a free or self-managed source (daily snapshot)
- premium users only — free users see upgrade prompt

### Time zone info (free)

- shows home time zone vs destination time zone
- shown during preplanning and during the trip
- no external API required — computed from destination data entered during setup

### Smart suggestions engine (premium)

- vibe-aware: beach trips suggest different packing and activities than city or adventure trips
- destination-aware: international trips trigger document checklists, currency info, language notes
- season-aware: warns about common seasonal hazards (hurricane season, monsoon, extreme heat)
- group-aware: kids trigger mobility and stop-frequency considerations, elderly trigger accessibility notes
- deterministic rule-based logic in v1, no AI inference cost initially
- feeds packing suggestions, itinerary ideas, preplanning prompts

## 13. Notification and Reminder Logic

We should not overbuild notifications early, but the logic should be designed for them. TripWave delivers notifications only through in-app surfaces (bell panel, real-time toasts, dashboard action center) and, once the native app ships, push notifications. Resend is used for the password reset email only. No other email or SMS is sent.

### Highest-value reminder candidates

- trip basics incomplete (in-app nudge only)
- departure is near and packing is incomplete
- travel day begins tomorrow
- active travel day task overdue
- unresolved post-trip settlement
- invited participant has not joined yet (surfaced on the invite screen, not via email)

## 14. Empty State Logic

Empty states should behave like guided onboarding for each phase.

### Every phase empty state should answer

- what belongs here
- why it matters
- what the first action should be
- whether this is collaborative or personal

## 15. Trip Ball Logic

The trip ball is a visual character representing the trip's health and progress.

### Fill computation

The ball fills from center outward based on preplanning completion percentage.

- 0% fill: dotted outline, empty center — new trip
- 1–49% fill: partial center fill — preplanning in progress
- 50–89% fill: mostly filled — good progress
- 90–100% fill: fully filled — preplanning complete, ready to advance

### Ball states

- new: calm, expectant, dotted outline
- filling: gently pulsing, ocean wave rhythm
- full: bouncy, confident, ready to roll
- travel day active: alert, faster pulse, focused
- on vacation: relaxed, slow pulse, glowing warmth
- blocker present: subtle agitation animation
- milestone hit: brief celebration burst
- completed: soft, nostalgic fade state
- archived: dimmed, still

### Color

Users can recolor their trip ball. This is trip personalization and should feel like a meaningful choice.

## 16. Premium Logic

Premium is a one-time $5 purchase per account. It removes ads and unlocks:

- offline mode (high priority)
- receipt scanning via Azure OCR
- currency converter
- smart suggestions
- advanced travel-day templates
- trip export
- trip templates (save and reuse structure)

Free users see premium features with tasteful upgrade prompts. The free experience remains genuinely useful.

## 17. Activity Wishlist Logic

The activity wishlist is a running inspiration board. It is not a poll -- no expiry, no forced decision. It is a place for ideas to live until the group acts on them.

### Who can add

All participants can add wishlist items by default. The organizer can restrict per user via the per-user permission toggle system in trip settings.

### Wishlist item fields

- title
- description (optional)
- category (activity, restaurant, place, experience, etc.)
- added by (author)
- created at
- reactions (likes)
- comments

### Reactions and social

- any user can like a wishlist item
- any user can comment on a wishlist item
- reaction counts are visible to all group members
- high reaction counts signal group enthusiasm without requiring a formal poll

### Promotion to itinerary

- organizer can promote any wishlist item to an itinerary event with one action
- once promoted, the item is removed from the wishlist
- an undo action is immediately available after promotion
- if undone, the item returns to the wishlist in its original state

### Poll escalation

- a wishlist item can be escalated into a poll when the group needs a structured vote
- "Start a poll from this" is a one-tap action on any wishlist item

### Wishlist and preplanning

- the wishlist is accessible during preplanning and persists throughout the trip
- items added during preplanning can be promoted to itinerary once dates and planning allow

## 18. Trip Notes Logic

Notes are a lightweight freeform communication layer for the group.

### Two types of notes

**Shared notes posts:** visible to all group members, structured as individual posts
**Personal notes:** private to the author, never visible to others (not even the organizer)

### Shared notes structure

- each note is its own post, not a shared editable document
- posts have: author, timestamp, content (plain text), and optional event attachment
- newest posts appear first in the All tab
- posts support likes and comments from other group members

### Filtering

- All tab: all shared notes posts, newest first
- Event notes tab: notes that are attached to specific itinerary events

### Event-attached notes

- a note can be attached to a specific itinerary event at the time of writing
- event notes appear in both the All tab and the Event notes tab
- within an event detail view, attached notes appear inline below the event

### Personal notes

- personal notes live in the user account area, not in the shared trip space
- personal notes cannot accidentally be made public
- no reactions or comments on personal notes

## 19. Countdown Widget Logic

The countdown widget shows days remaining until the trip starts.

### Display states

- 60 or more days: calm and excited ("Your adventure starts in 61 days")
- 30 days: friendly nudge ("One month out. Getting real.")
- 14 days: energized ("Two weeks. Are you ready?")
- 7 days: urgent copy with a slightly more alive visual state ("One week. Let's go.")
- 1 day: "Tomorrow. Let's go."
- departure day: switches to travel-day mode language
- trip in progress: shows "Day X of Y" instead of a countdown
- trip complete: shows a nostalgic completed state

### Relationship to the ball

The countdown influences the ball pulse rhythm. Far from departure: slow and calm. Approaching departure: slightly faster and more alive. This is part of the ball state model.

### Multiple travel days

If the trip has multiple travel legs, the countdown shows time to the first departure.

### Placement

The countdown lives in the trip overview header near the ball. It is always visible in the authenticated trip workspace.

## 20. Read-Only Share Link Logic

Organizers can share a public view of the itinerary with people who are not joining the trip.

### Who can generate

Organizer only.

### What is included

- trip name and destination
- itinerary events (dates, times, names, locations)
- traveler names (organizer can toggle this off for privacy)

### What is always excluded

- expenses and financial data
- packing lists
- private notes
- internal polls
- any content marked private

### Public view behavior

- no account required to view
- read-only -- no interactions
- TripWave branding is present throughout the public view
- a subtle "Plan your trip with TripWave" CTA appears at the bottom
- the link is revocable by the organizer at any time from trip settings
- revoked links return a not-found state

### Acquisition value

Every shared link exposes TripWave to people who have not used it. The public view is designed to be clean enough to be shareable but clearly branded.

## 21. Memory Vault Logic

The memory vault is the final state of a completed trip. It is generated at wrap-up.

### Contents

- trip name, destination, dates
- who came (participant list)
- total expenses from day 0 through return
- expense breakdown by category
- trip type and vibe label
- promoted wishlist items that became real itinerary events
- free-text recap field (any user can write, shown with author attribution)
- reactions and comments on the recap

### Circle breakdown

The memory vault features the end-of-trip circle breakdown: the ball opens and all accumulated action circles expand outward into a visual composition showing:

- green cluster: financial summary (total spent, per-category)
- blue cluster: itinerary coverage (events completed)
- yellow cluster: packing completion
- pink cluster: who was part of the trip
- orange cluster: travel day execution summary

This breakdown is the most shareable visual the app produces. It should be designed to be screenshot-worthy and emotionally resonant.

### Shareable

The organizer can share the memory vault via a public link. Same rules as the itinerary share link: no account required to view, TripWave branded, revocable.

### Read-only after grace period

The memory vault becomes read-only 30 days after trip completion. The recap field and comments remain accessible.

### Access

Available from the past trips list in the user's dashboard. Never deleted. Stored indefinitely.

## 22. Trip Duplication Logic

Trip duplication lets organizers copy the structure of a past trip as a starting point for a new one.

### Who can duplicate

Organizer only. Premium feature.

### What is copied

- trip name (prefixed as "Copy of" -- editable immediately)
- trip type and vibe
- preplanning field structure (field categories, not specific values like confirmation numbers)
- packing list item structure (items without check states)
- travel day task group structure (task groups and checklist items)
- permission presets

### What is not copied

- dates (required re-entry for the new trip)
- participants (must be re-invited)
- expenses and settlements (start fresh)
- itinerary events (too specific to original dates)
- confirmation numbers and booking references
- preplanning specific values (accommodation names, flight numbers, etc.)

### User expectation

The duplication flow clearly shows what will and will not be copied before confirming. No surprises.

## 23. Social Layer Logic

The social layer keeps group communication inside the app.

### Supported on

- itinerary events (comments, likes, favorites)
- wishlist items (comments, likes, favorites)
- shared notes posts (comments, likes)
- expenses (comments, likes)
- poll options (likes)

### Comments

- plain text only, no formatting
- any group member can comment on shared content
- comment author and timestamp shown
- comments support a like of their own
- long threads collapse with a "show more" control
- newest comments appear first in global views, oldest first in item detail

### Likes

- simple one-tap reaction
- tapping toggles on and off
- count always visible
- brief pop animation on tap

### Favorites

- personal to the user, not shared with the group
- available on itinerary events, wishlist items, notes posts
- favorited items are visually marked (filled icon)
- a favorites list is accessible from the user account area and from within the trip sidebar

## 24. Notification Logic

### In-app notifications (all versions)

- bell icon in the top nav with unread count badge
- tapping opens a notification list
- notifications grouped by trip for users with multiple trips
- unread notifications have a subtle highlight; read ones are plain

### Notification triggers

- someone commented on an item you posted or commented on
- someone liked your item or comment
- a new participant joined your trip
- a poll you voted in was closed
- an expense split you are part of was marked settled by the other party
- someone added an itinerary item (optional, may be too noisy -- to decide)
- travel day reminder the day before departure
- you were invited to a trip

### Push notifications (native app only)

- same triggers as in-app notifications
- opt-in at the OS level, requested only after meaningful first trip activity
- no email notifications for any event (social, activity, urgency)
- Resend sends the password reset email only -- no invite emails, no notification emails

### Web version

- in-app notification bell and list only
- no push, no email alerts for activity
- invites are shared via link, code, or QR (copied to clipboard, texted, etc.) -- TripWave does not send invite emails

## 25. Planning Tools Logic

Tools available during the preplanning and planning phases to help the group prepare.

### Weather preview

- uses Open-Meteo (free, no API key required)
- shows a forecast or historical weather summary for the destination around the trip dates
- displayed during preplanning to inform packing decisions and activity planning
- feeds into smart suggestions ("your trip overlaps with rainy season -- pack accordingly")
- shown as a simple card: expected temperature range, precipitation likelihood, notable conditions

### Document checklist generator

- deterministic rule-based logic, no API required
- based on destination and trip type, generates a personalized checklist
- domestic trips: short list (valid ID, insurance card, any required tickets)
- international trips: full list (passport validity, visa requirements, travel insurance, vaccination records, international driving permit, local currency)
- items in the checklist can be marked complete and link to the documents section of preplanning
- integrates with the preplanning completion score

### Jet lag calculator

- pure logic, no API
- based on origin and destination time zones, shows: hours of time difference, recommended sleep strategy on the flight, suggested first-day arrival schedule to reset the clock
- shown when an international flight is entered in preplanning
- displayed again in the departure day brief

### Packing calculator

- given trip length, destination climate (from weather data or destination type), and planned activities (from wishlist and itinerary), generates a suggested packing checklist
- suggestions are vibe-aware and group-aware (kids traveling adds relevant items, beach trip adds sunscreen and swimwear, etc.)
- output feeds directly into the packing list feature -- user can accept all, pick individually, or dismiss
- free for basic suggestions, premium smart suggestions add more depth

### Group availability checker

- each participant marks date ranges they cannot travel
- organizer sees a simple overlap view highlighting when everyone is free
- used during preplanning before dates are locked
- does not require a third-party calendar integration -- manual entry only

### Pre-trip shared shopping list

- a collaborative checklist for shared supplies the group needs to acquire before leaving
- separate from personal packing lists
- examples: group sunscreen, road trip snacks, cash from ATM, shared power bank
- any participant can add items (subject to permission toggles)
- items can be assigned to a specific person to buy
- not connected to the expense ledger by default, but can optionally log the cost when checked off

## 26. Destination Reference Tools Logic

Static reference tools available throughout the trip. Most are built from lookup data with no API cost.

### Language phrasebook

- a curated set of essential phrases per destination language
- categories: greetings, directions, restaurant ordering, emergencies, numbers and money, shopping, transportation
- includes rough pronunciation guides for each phrase
- available in-app at all times
- offline access is a premium feature (phrases downloaded for offline use)
- no translation API -- static data per language for common destinations

### Allergy and medical card

- user enters allergies or medical conditions in their profile
- the app generates a card showing this information in the destination language
- example output: "I am allergic to peanuts and shellfish. Please do not include these in my food."
- pre-built translations for common languages, no live translation API
- card is shown during travel day and vacation day for quick access
- printable from the web version

### Tipping guide

- country-by-country tipping norms
- covers: restaurants, taxis, hotels, tour guides, spas
- shows whether tipping is expected, customary, or considered rude
- shows typical percentage or amount ranges
- static lookup data per country, no API

### Voltage and adapter guide

- based on destination country, shows: plug adapter type needed, local voltage, whether a voltage converter is required
- shown during preplanning packing section
- simple lookup table, no API

### Driving and transit basics

- what side of the road the destination uses
- speed limit units (mph vs km/h)
- major local transit options (metro, tuk-tuks, rickshaws, etc.)
- whether an international driving permit is required
- short reference card per destination, shown during preplanning

### Emergency contacts card

- auto-generated for each destination
- includes: local emergency number (not always 911), tourist police line, nearest embassy or consulate details, notes on finding local medical help
- shown prominently during travel day and vacation day
- always accessible without internet (even free tier -- this is a safety feature, not a premium lock)

### Unit converter

- multi-mode converter covering the most common travel conversions
- temperature: Fahrenheit to Celsius
- distance: miles to kilometers
- weight: pounds to kilograms
- liquid: gallons to liters
- speed: mph to km/h
- currency: ties into the currency converter (premium)
- free to use, no API

## 27. During-Trip Coordination Tools Logic

### Quick bill splitter

- a standalone calculator separate from the full expense logging system
- used at the table or in the moment when someone needs a fast answer
- inputs: total bill amount, tip percentage, number of people splitting
- output: per-person amount including tip
- optionally creates an expense record from the result, or dismisses with no logging
- free, no API

### Meetup point tool

- each user can manually broadcast a simple location message to the group
- not GPS tracking -- user types or selects where they are ("I am at the fountain near the main entrance")
- visible to all group members in a simple list sorted by most recent
- updates manually -- no background tracking
- clears at the end of each day
- useful for the classic group separation problem in busy tourist areas
- free, no API

### Quick thumbs vote

- a lighter version of the full polls feature
- single proposition, yes or no response
- example: "Beach today?" -- group taps yes or no
- closes when all members vote or the organizer closes it
- results shown immediately
- no expiry setup, no option configuration -- pure speed
- converts to a full poll if the organizer wants to add options

### Departure day brief

- the night before any departure day (travel day), the app surfaces a summary card
- contents: documents needed for this departure, transport time notes, check-in time reminders, destination weather on arrival day, one-line summary of day 1 plan
- this is not the travel day checklist itself -- it is a calm pre-departure overview
- shown as a notification and as a persistent card in the trip overview the night before

## 28. Memory and Documentation Tools Logic

### Confirmation number vault

- a central place to store all booking reference numbers and access codes for the trip
- covers: hotel confirmation codes, flight booking references, car rental codes, restaurant reservation numbers, activity booking codes, parking reservations
- text only -- no document scanning or image storage
- each entry has: label, confirmation number, provider name, date relevant, optional notes
- available offline for premium users (downloaded when trip enters ready state)
- separate from the expense system -- this is about access in the moment, not cost tracking

### Trip statistics

- auto-generated at wrap-up alongside the memory vault
- fun numbers produced from trip data:
  - total days traveled
  - total expense amount
  - highest single expense day
  - number of itinerary events completed
  - number of packing items packed
  - number of group votes run
  - number of participants
- light and fun, not analytical -- designed to be a shareable moment

### Post-trip poll

- a fun group vote created at wrap-up
- organizer creates it, all participants vote
- suggested categories: best meal, funniest moment, most unexpected thing, destination worth returning to, MVP of the trip
- results shown in the memory vault and accessible to all participants
- free, built on the same poll infrastructure already planned

### Scavenger hunt

- organizer creates a list of challenges for the group during the trip
- examples: try street food you have never heard of, find a local market, get lost on purpose, find the oldest building nearby, make a friend who speaks a different language
- participants check off items they completed
- items can have a point value if the organizer wants a competitive version
- results visible to the group in real time
- shown in the vacation day section when the trip is in progress
- free, no API required

## 29. Smart and Proactive Tools Logic

### Seasonal warning system

- during preplanning, checks the destination and trip dates against a lookup of known seasonal hazards
- covers: hurricane season, monsoon season, extreme heat periods, wildfire risk seasons, jellyfish season, polar night periods, peak tourist congestion
- if a risk applies, surfaces a clear warning with context: what the risk is, how severe it typically is, what to do about it
- deterministic rule-based lookup by destination country/region and date range
- feeds into smart suggestions (premium) for packing and activity adjustments
- the warning itself is free -- it is safety-relevant

### Local public holiday alerts

- checks trip dates against a lookup of major local public holidays and observances by country
- surfaces two types of alerts:
  - closure alert: "National holiday on June 15 -- many shops and restaurants may be closed"
  - festival alert: "Diwali falls during your trip -- expect celebrations, crowds, and special events"
- static lookup data, no API
- shown during preplanning destination info section

### Departure day brief logic (see section 27)

Already defined above. This is the smart pre-departure card the night before any travel day.

### Smart suggestions coordination

All smart suggestion tools feed from the same underlying logic engine:

- trip vibe and type (beach, city, adventure, road trip, family, romantic, etc.)
- destination country and region
- group composition (ages, mobility needs, dietary restrictions)
- trip dates and season
- weather data (from Open-Meteo)
- holiday and event data
- preplanning completeness gaps

The engine produces: packing suggestions, activity ideas, itinerary recommendations, document reminders, seasonal warnings, and accessibility prompts. Premium users get the full output. Free users get the most safety-critical suggestions.

## 30. Accessibility and Comfort Tools Logic

### Accessibility needs planner

- users can flag personal accessibility needs in their profile: wheelchair or mobility aid, dietary restrictions, sensory sensitivities, service animal, hearing or vision considerations
- these flags appear as planning prompts throughout the app:
  - preplanning: "Confirm hotel has wheelchair accessible rooms"
  - itinerary: flag if an activity is likely inaccessible
  - packing: suggest relevant items (portable ramp, earplugs, etc.)
  - travel day: surface accessibility-relevant tasks early in the checklist
- organizer can see group-level accessibility needs (not individual medical detail) for planning purposes
- no medical advice given -- only practical planning prompts

### Medication reminder

- simple scheduled reminders for medications that need to be taken at specific times during the trip
- user sets: medication name (optional), time of day, whether to adjust for time zone change
- adjusts reminder time to local destination time zone when the trip is in progress
- no medical data stored or processed -- just a reminder schedule
- push notification on native app; in-app notification on web
- private to the individual user -- not visible to the group or organizer

### Kids and family mode notes

- during preplanning, if children are flagged in the group composition, relevant prompts appear throughout planning
- packing suggestions: formula, diapers, snacks, entertainment, car seat considerations
- itinerary: suggests noting nap schedule windows, kid-friendly activity filters on wishlist
- travel day: adds child-specific checklist items (entertainment, snacks, documents)
- accommodation: reminder to confirm crib or rollaway bed availability
- activity wishlist: can filter by kid-friendly tag when browsing
- not a separate mode -- just a layer of additional prompts when children are present

## 31. Recommended MVP Logic Decisions

To reduce complexity, the MVP should assume:

- one trip owner with full control
- participants join with accounts before editing
- one recommended phase at a time
- one primary next action at a time
- travel day overrides normal planning UI when active
- unresolved expenses can continue after trip completion
- preplanning completion drives the trip ball fill
- premium is a one-time unlock, not session-based
- tools are grouped in a dedicated tools section accessible from the trip sidebar
- safety-critical tools (emergency contacts, allergy card, weather warning) are always free regardless of premium status

## 32. Open Logic Questions

- When should a trip automatically move from planning to ready?
- Should participants be able to start polls by default, or is that organizer-controlled per trip?
- Should the trip ball be visible to all participants or only the organizer?
- How many unresolved blockers should appear before the UI feels scolding?
- Should expense tracking appear as a persistent tab or only when relevant?
- Which premium features should be hard-gated first for the cleanest business model?
- Should smart suggestions be opt-in or shown by default?
- Should the scavenger hunt be organizer-only to create, or can participants suggest items?
- Should the meetup point tool update via a live feed or only on page refresh?
- Should the post-trip poll be organizer-created only or auto-generated with suggested questions?
- Should medication reminders be visible as a category in the notification list or kept entirely separate?
