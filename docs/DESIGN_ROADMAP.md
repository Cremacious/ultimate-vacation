# Design Roadmap

This document breaks the design process into a decision order. The goal is to avoid designing screens before we decide the rules that should shape them.

## How We Will Work

We will lock design decisions in this order:

1. Brand and naming
2. Core visual system
3. App shell and navigation
4. Workspace logic surfaces
5. Phase-by-phase product screens
6. Monetization and premium UX
7. Motion and polish

Each section below lists:

- what we need to decide
- why it matters
- what output we want

## Phase 1 - Brand and Naming

### Decisions to make

- final product name
- short tagline
- how sassy vs polished the brand voice should be
- whether the brand feels more premium, playful, or balanced

### Why this matters

- it affects headlines, landing page tone, onboarding copy, and pricing voice

### Output

- approved name
- approved tone description
- 3 to 5 example brand lines

## Phase 2 - Core Visual System

### Decisions to make

- final palette
- typography direction
- icon style
- 3D surface rules
- glass usage rules
- border, shadow, and spacing rules

### Why this matters

- it becomes the house style for every page and component

### Output

- updated design system
- color tokens
- component material rules

## Phase 3 - App Shell and Navigation

### Decisions to make

- top-level app shell structure
- trip switcher behavior
- nav style on desktop
- nav style on mobile
- where premium and account live
- whether the context panel is always visible or conditional

### Why this matters

- this structure shapes every authenticated screen

### Output

- app shell layout spec
- desktop and mobile nav rules

## Phase 4 - Workspace Logic Surfaces

### Decisions to make

- how the trip ball is rendered in the workspace header
- how recommended phase is shown
- how next best action is shown
- how blockers are shown
- how readiness is shown
- how trip state is shown

### Why this matters

- this is where the product becomes meaningfully different from a generic planner

### Output

- trip workspace header model
- trip ball spec (states, fill, animations, face expression rules)
- readiness / blocker / primary action UI rules

## Phase 5 - Phase-by-Phase Screens

We should design these in this order:

1. Setup
2. Overview
3. Travel Day
4. Itinerary
5. Packing
6. Vacation Day
7. Expenses
8. Group
9. Settings

### Why this order

- setup defines the trip object
- overview defines the command center
- travel day is the core differentiator
- itinerary and packing are core utility
- the rest can follow after the foundation is clear

## Phase 6 - Monetization and Premium UX

### Decisions to make

- exact free vs premium boundaries (resolved — see MONETIZATION.md)
- premium lock style
- upgrade prompt timing
- pricing page structure
- how aggressive or subtle upsells should feel

### Why this matters

- premium UX must feel integrated, not bolted on

### Output

- premium UX rules
- paywall style direction
- pricing screen requirements

## Phase 7 - Motion and Polish

### Decisions to make

- hero motion style
- page transition style
- hover behavior
- loading and skeleton style
- checklist completion feedback
- trip ball animation system (see below)

### Why this matters

- motion should reinforce confidence and delight without making the app noisy

### Output

- motion rules
- interaction behavior guidance

---

## The Trip Ball — Visual Identity System

The trip ball is a core visual element and brand character. It should be designed with care and used consistently.

### Concept

The ball represents the user's trip as a living thing. It is not an abstract progress meter — it is the trip personified. Users should feel like the ball is their trip companion, growing more solid and ready as planning progresses.

### Shape and fill

- The ball appears as a dotted/outlined circle when the trip is new
- As preplanning fields are completed, the ball fills from the center outward with a solid color
- Full fill signals preplanning complete and readiness to roll to the next phase
- The fill is smooth, not stepped — it reflects continuous progress

### Color

- Users can choose a color for their ball — this is trip personalization
- Default colors should be drawn from the brand palette
- Color choice should feel meaningful, not arbitrary — consider letting users pick a "trip vibe" color

### Personality

- The ball should feel like a subtle character, not a cartoon mascot
- Personality is expressed through micro-animations and implied expression
- A very subtle eye-like element (shadow, gradient asymmetry, or simple arc) can suggest a face without becoming a smiley face
- Expression changes with trip state:
  - new / empty trip: calm, expectant
  - preplanning active: gently pulsing, engaged
  - planning complete: bouncy, confident
  - travel day active: alert, focused
  - on vacation: relaxed, glowing
  - wrap-up / completed: soft, nostalgic

### Pulse animation

- The pulse should feel like an ocean wave, not an electronic heartbeat
- Slow, organic, fluid — not tight or mechanical
- The pulse rhythm should change slightly with urgency:
  - far from departure: slow and calm
  - close to departure: slightly faster, more alive
  - travel day active: attentive, shorter pulse cycle

### Rolling animation

- When the app moves between phases, the ball rolls
- The rolling motion is the physical metaphor for trip progression
- Roll direction should feel intentional (forward = left to right or into the next stage)
- Roll speed should match the significance of the transition

### Ball states to design

- empty (new trip, dotted outline only)
- filling (preplanning in progress, partial fill)
- full (preplanning complete)
- rolling (phase transition animation)
- pulsing (idle active state)
- alert (blocker present — subtle agitation)
- celebrating (milestone hit — brief burst animation)
- sleeping (archived trip — faded, still)

### Technical notes

- ball should be implemented in SVG or Canvas for smooth animation control
- CSS animation for pulse is likely sufficient
- rolling transition may benefit from a JS animation library
- keep the ball performant — it is always visible in the workspace

---

## Decision Checklist

Here are the major unresolved choices we still need to answer:

- final app name
- final brand personality balance
- final font direction
- iconography style
- desktop nav model
- mobile nav model
- trip ball color picker UX
- trip ball face expression rules
- workspace overview structure
- travel day page structure
- premium lock style
- upgrade prompt tone
- ad placement zones

## Recommended Working Order For Our Next Chats

### Round 1 (complete)

- name (TripWave working)
- tone (sassy, confident, ocean-wave personality)
- font direction (Fredoka + Nunito — working direction)
- icon style (Phosphor Icons — working direction)

### Round 2

- feature set review and planning (in progress)
- shell layout
- nav behavior
- readiness / next-action UI
- trip ball placement in shell

### Round 3

- setup page
- overview page
- travel day page

### Round 4

- itinerary
- packing
- vacation day
- expenses
- polls
- wishlist
- scavenger hunt (new sidebar tab)
- bento-box layout parity — preplanning is the visual baseline; every other page in this round should be redesigned to match its large-scale bento grid treatment
- quick-action toolbar pattern (Log Expense / Create Poll / Create Scavenger Hunt) applied consistently across trip workspace pages

### Round 5

- premium UX
- pricing
- upsells
- ad placement

### Round 6

- motion
- trip ball animation system
- polish
- final consistency pass
