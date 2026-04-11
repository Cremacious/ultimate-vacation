# Ultimate Vacation - Product Plan

## Purpose

This repository will house a Next.js application for planning, organizing, and guiding users through vacations from the first idea to the last expense settlement.

This document is the living source of truth for:

- product direction
- UX principles
- monetization assumptions
- technical architecture
- phased roadmap
- naming ideas
- open questions and decisions

We will keep updating this file as the project evolves.

## Working Product Summary

Build the most useful, personality-rich vacation planning app possible:

- easy enough for one primary organizer to run
- collaborative enough for groups to coordinate without chaos
- structured enough to guide the full trip lifecycle
- playful and sassy in tone without becoming confusing
- designed web-first, with mobile packaging later

## Core Product Vision

The app helps one paid account owner plan a vacation and invite other participants using a vacation code. The owner manages the trip, itinerary, packing, travel-day checklists, group events, votes, expenses, and settlement.

The app should guide users through distinct stages:

1. Preplanning
2. Itinerary building
3. Packing
4. Day-of-travel execution
5. On-trip coordination
6. Expense tracking and settlement
7. Post-trip wrap-up

## Product Principles

- Make planning feel organized, not overwhelming.
- Reduce the chance of forgetting something important.
- Make group travel less annoying.
- Keep the UI minimal, premium, and fun.
- Write copy with personality, but never at the expense of clarity.
- Build the web app first with a strong foundation for mobile packaging and offline support.
- Keep infrastructure costs low.

## Primary User Model

### Account Structure

- One account per paid user
- Free tier exists
- Premium features sit behind a paywall
- Paid user is the trip owner / organizer
- Other people can join a trip via invite or vacation code

### Assumption For Initial MVP

For the first version, we will treat invited users as trip participants inside a shared trip workspace, with the paid organizer acting as the primary admin.

We may later expand permissions into roles such as:

- owner
- co-planner
- participant
- viewer

## Key User Flows

### 1. Start a Trip

The organizer creates a trip and enters basics:

- destination
- dates
- travelers
- transport method
- lodging
- planning style
- budget target

### 2. Invite Group Members

The organizer shares a vacation code or invite link so others can join the trip workspace.

### 3. Preplanning Wizard

The app asks smart questions and suggests needs based on context:

- destination type
- climate
- travel method
- mobility needs
- bathroom-stop needs
- kids / grandparents / pets
- long-drive stop planning
- likely essentials such as sunscreen, chargers, meds, documents

### 4. Build the Itinerary

Users add:

- events
- reservations
- travel segments
- meet-up times
- notes
- calendar entries

### 5. Build Packing Lists

Users create shared and personal lists with context-aware suggestions.

### 6. Travel Day Mode

The app becomes a step-by-step execution checklist for each travel day:

- wake up tasks
- get ready tasks
- load luggage
- document checks
- item checks
- departure checkpoints
- stopovers
- arrival steps

This is one of the strongest differentiators and should feel extremely polished.

### 7. On-Trip Coordination

During the trip, users can:

- view the day schedule
- edit or add events
- vote on what to do next
- see meeting times and locations
- stay aligned even with spotty internet

### 8. Expense Tracking

Users can:

- record expenses
- scan receipts
- track budgets
- split costs
- settle balances at the end

## Major Feature Areas

### Phase Guidance Engine

The app should always make clear what stage the trip is in:

- preplanning
- itinerary
- packing
- travel day
- vacation day
- wrap-up

Each stage should unlock relevant tools, prompts, and reminders.

### Calendar + Event System

Robust shared calendar features are core:

- single-day and multi-day events
- restaurant plans
- meeting locations
- ticketed activities
- reminders
- calendar views by day / agenda / trip

### Polls and Voting

To reduce group friction:

- propose options
- vote quickly
- see winner
- optionally allow organizer override

### Offline Access

Critical data should be available offline:

- itinerary
- key schedule
- travel-day checklist
- packing lists
- addresses
- reservation notes

### Expense and Settlement

Splitwise-like collaboration:

- who paid
- who owes
- budget progress
- settle up summary

## Monetization Direction

### Free Tier Ideas

- limited number of trips
- basic itinerary
- basic packing list
- limited collaborators

### Premium Tier Ideas

- unlimited trips
- advanced travel-day flows
- smart suggestions
- polls and voting
- expense splitting
- receipt scanning
- offline mode
- premium templates
- export / share features

### Revenue Principle

Optimize for low overhead and high margin:

- Vercel for app hosting
- Neon for database
- avoid unnecessary paid services early
- defer expensive AI or OCR flows until carefully scoped

## Brand and Tone

### Desired Personality

- sassy
- clever
- confident
- useful
- premium

Tone should feel like a smart travel-savvy friend who keeps everyone on track.

### Tone Guardrails

- witty, not cringe
- playful, not chaotic
- direct, not cold
- stylish, not cluttered

## Visual Direction

The product should feel:

- minimal
- polished
- slightly glassy
- slightly 3D
- card-forward
- modern and premium

Design ideas:

- layered cards
- soft depth and shadows
- subtle glass panels
- clean whitespace
- intentional motion
- strong typography

We should avoid overdesigned travel cliches.

## Platform Strategy

### Initial Platform

- Next.js web app first

### Later Platform Expansion

- package for iOS and Android after web product is stable
- likely use PWA-first thinking and evaluate Capacitor later

## Technical Direction

### Proposed Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui selectively, not blindly
- Vercel hosting
- Neon Postgres
- Prisma or Drizzle for database access
- NextAuth or Clerk-style auth alternative later
- Stripe for subscriptions later

### Initial Recommendation

Start simple with:

- Next.js
- TypeScript
- Tailwind
- ESLint
- app directory

Then add:

- database layer
- auth
- subscriptions
- offline support

in controlled phases.

### Recommended Data Domains

- users
- trips
- trip_members
- destinations
- itinerary_items
- travel_days
- checklists
- checklist_items
- packing_lists
- packing_items
- polls
- poll_options
- votes
- expenses
- expense_splits
- settlements

## Architecture Priorities

### MVP Priorities

The first build should emphasize:

1. clean app architecture
2. strong design foundation
3. trip creation flow
4. stage-based dashboard
5. itinerary basics
6. packing list basics
7. travel-day checklist basics

### Features To Delay Slightly

- receipt OCR
- advanced offline sync conflict handling
- native mobile packaging
- real-time collaboration polish
- complex permissions matrix

## Suggested Initial MVP Scope

### MVP v1

- landing page
- auth shell
- create trip flow
- trip dashboard
- phase-based navigation
- itinerary CRUD
- packing list CRUD
- travel-day checklist CRUD
- invite code model placeholder
- premium feature placeholders

### MVP v1.5

- shared calendar improvements
- polls / voting
- basic budgeting
- simple expense tracking

### MVP v2

- settle up flow
- offline support
- smarter suggestions
- receipt scanning
- mobile packaging

## Naming Ideas

We want something fast, memorable, and a little sassy. Early options:

- TripSnap
- VacayBoss
- Jetsetta
- PackUp
- TripSauce
- GoSnappy
- Plan the Damn Trip
- Vacay IQ
- TripFlex
- Bestie Trip
- TripFox
- Pack Sass

Current note: keep exploring names before brand lock-in. We should test names for domain and app-store friendliness later.

## UX Opportunities That Feel Special

- A "travel day mode" that acts like a mission checklist.
- Smart suggestions based on destination and traveler needs.
- A group vibe system with polls and playful copy.
- Empty states that teach the user exactly what to do next.
- A phase timeline that shows progress toward departure.

## Risks and Constraints

- Collaboration can become complex quickly.
- Offline support is valuable but technically non-trivial.
- Receipt scanning can introduce third-party cost.
- Multi-user trip permissions need careful product design.
- Premium gating must feel enticing, not hostile.

## Open Product Decisions

- Should invited users create full accounts immediately or join lightly first?
- Should one trip support multiple lodging locations?
- How opinionated should the planning wizard be?
- Is expense splitting free or premium?
- Will group members edit everything or only selected areas?
- Should travel-day mode support notifications in early versions?
- Should polls be tied to itinerary suggestions automatically?

## Immediate Build Plan

### Step 1

Create a beautiful but simple Next.js foundation with:

- app router
- TypeScript
- Tailwind
- initial landing page
- product direction baked into content and placeholder UI

### Step 2

Create a basic information architecture:

- marketing landing page
- app dashboard shell
- trip workspace shell
- placeholder cards for each trip stage

### Step 3

Prepare the app for backend integration:

- environment structure
- database folder
- future auth and billing placeholders

## Decisions We Are Making Right Now

- Build web-first in Next.js
- Keep infrastructure lean around Vercel + Neon
- Prioritize stable UX before mobile packaging
- Capture planning in-repo from day one
- Start with a strong product skeleton instead of rushing into backend complexity

## Session Notes

### 2026-04-11

Initial user vision captured:

- collaborative vacation planning app
- code-based invites
- free + premium model
- itinerary, packing, travel-day guidance, events, polls, expenses
- offline support goal
- sassy tone
- minimal 3D / glass UI
- web-first using Next.js
- low-cost infra using Vercel and Neon

## Next Recommended Actions

1. Scaffold the Next.js app and git repository.
2. Turn this planning doc into a structured roadmap and backlog.
3. Create the first landing page with brand positioning and stage-based product preview.
4. Add a dashboard shell for future authenticated trip planning flows.
