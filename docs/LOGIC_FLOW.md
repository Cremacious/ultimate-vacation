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

- visitor
- signed-up organizer
- invited participant
- premium organizer

### Basic logic

- a visitor can browse marketing pages
- a signed-up organizer can create trips
- an invited participant can join a trip through a code or invite link
- a premium organizer unlocks premium features for trips they own

### Early recommended rule

For MVP, premium status should belong to the trip owner and control feature access for that trip workspace. This is simpler than trying to evaluate premium access per participant immediately.

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

## 4. Next Best Action Logic

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

## 5. Organizer vs Participant Logic

We should start with a clear default:

### Organizer responsibilities

- create and own the trip
- edit trip settings
- manage invite codes
- set phase defaults
- control premium features
- resolve poll rules if needed

### Participant responsibilities

- join a trip
- view relevant plans
- contribute to itinerary, packing, votes, and expenses based on permissions

### Suggested MVP permission model

- organizer: full control
- participant: can add or edit collaborative content, but cannot change billing or core trip ownership

This is intentionally simpler than a full roles matrix.

## 6. Invite and Join Logic

### Organizer flow

1. create trip
2. generate invite code or link
3. share invite

### Participant join flow

1. open invite link or enter code
2. authenticate or create lightweight account
3. join trip workspace
4. choose profile details relevant to that trip if needed

### Suggested early product decision

Allow lightweight joining, but require account creation before meaningful edits. This avoids too much friction without creating anonymous editing chaos.

## 7. Travel Day Logic

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

## 8. Vacation Day Logic

Once the trip is underway, the app should stop behaving like a planner and start behaving like a daily coordination tool.

### Priority order during vacation days

1. today's schedule
2. next meetup
3. active reservations
4. quick add event
5. group vote or group update
6. expenses from today

### Brainstorm ideas

- a daily briefing card each morning
- "what changed today" summary
- one-tap vote prompts when plans are uncertain
- weather-aware reminders later

## 9. Expense Logic

Expense features should stay grounded in real trip behavior.

### Core actions

- log expense
- assign payer
- split across travelers
- mark who owes what
- show settlement summary

### Suggested logic rules

- every expense belongs to a trip
- every expense has a payer
- split defaults should be easy to change
- expenses can remain unresolved after the trip ends
- wrap-up should point users toward settlement completion

## 10. Poll and Decision Logic

Polls should solve decision fatigue, not create extra UI noise.

### Good poll triggers

- choosing between activities
- choosing restaurant options
- picking meetup times

### Suggested guardrails

- polls should expire
- organizer can close a poll manually
- winning poll options should be easy to convert into itinerary items later

## 11. Notification and Reminder Logic

We should not overbuild notifications early, but the logic should be designed for them.

### Highest-value reminder candidates

- trip basics incomplete
- departure is near and packing is incomplete
- travel day begins tomorrow
- active travel day task overdue
- unresolved post-trip settlement

## 12. Empty State Logic

Empty states should behave like guided onboarding for each phase.

### Every phase empty state should answer

- what belongs here
- why it matters
- what the first action should be
- whether this is collaborative or personal

## 13. Premium Logic Ideas

Premium should feel like unlocking power, not removing the product's usefulness.

### Candidate premium logic

- advanced travel-day templates
- polls and group decision tools
- expense splitting and settlement
- offline mode
- smart suggestions

### Free experience should still allow

- creating a trip
- basic itinerary
- basic packing support
- understanding the core value of the app

## 14. Brainstorm Ideas Worth Exploring Later

- trip health score based on readiness
- countdown states that change the interface mood as departure gets close
- "chaos radar" warnings for high-risk missing items
- a post-trip memory vault for notes, photos, and recap links
- reusable trip templates by trip type
- family mode with special support for kids, elders, accessibility, and frequent stops

## 15. Recommended MVP Logic Decisions

To reduce complexity, the MVP should assume:

- one trip owner with full control
- participants join with accounts before editing
- one recommended phase at a time
- one primary next action at a time
- travel day overrides normal planning UI when active
- unresolved expenses can continue after trip completion

These MVP assumptions are further concretized in `docs/STATE_MODEL.md`.

## 16. Open Logic Questions

- When should a trip automatically move from planning to ready?
- Should participants be able to create itinerary items by default?
- Should packing lists be partly personal and partly shared from day one?
- How strongly should the app steer users into the current phase versus allowing free navigation?
- Should expense tracking appear during the trip or mostly after each day?
- Which premium features should be hard-gated first for the cleanest business model?
