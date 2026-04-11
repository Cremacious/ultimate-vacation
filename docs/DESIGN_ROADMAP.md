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

- how recommended phase is shown
- how next best action is shown
- how blockers are shown
- how readiness is shown
- how trip state is shown

### Why this matters

- this is where the product becomes meaningfully different from a generic planner

### Output

- trip workspace header model
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

- exact free vs premium boundaries
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

### Why this matters

- motion should reinforce confidence and delight without making the app noisy

### Output

- motion rules
- interaction behavior guidance

## Decision Checklist

Here are the major unresolved choices we still need to answer:

- final app name
- final brand personality balance
- final font direction
- iconography style
- desktop nav model
- mobile nav model
- readiness visualization
- trip overview structure
- travel day page structure
- premium lock style
- upgrade prompt tone

## Recommended Working Order For Our Next Chats

### Round 1

- name
- tone
- font direction
- icon style

### Round 2

- shell layout
- nav behavior
- readiness / next-action UI

### Round 3

- setup page
- overview page
- travel day page

### Round 4

- itinerary
- packing
- vacation day
- expenses

### Round 5

- premium UX
- pricing
- upsells

### Round 6

- motion
- polish
- final consistency pass
