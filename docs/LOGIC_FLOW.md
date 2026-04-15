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

### Travel day objects

Each travel day should include:

- target date
- departure window
- ordered task groups
- required items
- stopover checkpoints
- travel segments
- arrival steps

### Travel day page priorities

When a travel day is active, the app should reorder itself around:

1. what happens next
2. what is overdue
3. what is required before departure
4. what each person is responsible for

### Smart behaviors to consider

- surface "leave in X minutes" guidance later
- emphasize must-bring items
- collapse non-essential planning UI during active travel-day mode
- allow quick checkoff with minimal friction

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

We should not overbuild notifications early, but the logic should be designed for them. Resend handles email delivery.

### Highest-value reminder candidates

- trip basics incomplete (email nudge)
- departure is near and packing is incomplete
- travel day begins tomorrow
- active travel day task overdue
- unresolved post-trip settlement
- invited participant has not joined yet

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
- no email notifications for social or activity events
- Resend handles transactional email only: password reset and invite delivery

### Web version

- in-app notification bell and list only
- no push, no email alerts for activity

## 25. Brainstorm Ideas Worth Exploring Later

- trip health score visible to users as a readable label or tier
- chaos radar warnings for high-risk missing items
- QR code for invite
- calendar import and export
- map and place integrations for events
- restaurant wishlist per destination
- per-day private journal entries
- reusable trip templates by trip type
- family mode with special support for kids, elders, accessibility, and frequent stops

## 18. Recommended MVP Logic Decisions

To reduce complexity, the MVP should assume:

- one trip owner with full control
- participants join with accounts before editing
- one recommended phase at a time
- one primary next action at a time
- travel day overrides normal planning UI when active
- unresolved expenses can continue after trip completion
- preplanning completion drives the trip ball fill
- premium is a one-time unlock, not session-based

## 19. Open Logic Questions

- When should a trip automatically move from planning to ready?
- Should participants be able to start polls by default, or is that organizer-controlled per trip?
- Should the trip ball be visible to all participants or only the organizer?
- How many unresolved blockers should appear before the UI feels scolding?
- Should expense tracking appear as a persistent tab or only when relevant?
- Which premium features should be hard-gated first for the cleanest business model?
- Should smart suggestions be opt-in or shown by default?
