# App Structure

This document tracks the intended information architecture, route layout, and major workspace regions.

## Product Surfaces

### 1. Marketing Site

Purpose:

- explain the product clearly
- establish tone and brand
- convert visitors into trial users

Core sections:

- hero
- product promise
- phase-based feature preview
- premium feature preview
- CTA

### 2. Authenticated App

Purpose:

- serve as the organizer's command center
- list trips
- surface progress and alerts
- guide the next action

### 3. Trip Workspace

Purpose:

- central place to manage one trip
- switch between planning phases
- coordinate with participants

## Proposed Workspace Layout

### Global app shell

- top navigation
- workspace title and trip switcher
- account and billing entry

### Trip workspace shell

- left rail for trip phases
- main content area for active phase
- right-side context panel for alerts, reminders, and activity later

## Trip Phase Navigation

Initial phase order:

1. Overview
2. Preplanning
3. Itinerary
4. Packing
5. Travel Day
6. Expenses
7. Group
8. Settings

## Key Pages We Expect To Build

### Marketing and onboarding

- `/`
- `/pricing`
- `/login`
- `/signup`

### App and trip management

- `/app`
- `/app/trips`
- `/app/trips/new`
- `/app/trips/[tripId]`

### Trip phase pages

- `/app/trips/[tripId]/preplanning`
- `/app/trips/[tripId]/itinerary`
- `/app/trips/[tripId]/packing`
- `/app/trips/[tripId]/travel-days`
- `/app/trips/[tripId]/expenses`
- `/app/trips/[tripId]/group`
- `/app/trips/[tripId]/settings`

## UX Rules For Structure

- every page should make the current trip and current phase obvious
- every phase page should show the next recommended action
- empty states must teach, not just inform
- travel day pages should prioritize focus and checklist completion
- information density should increase inside the app, but remain calm

## Placeholder Content Strategy

Until backend work lands, placeholder UI should explain:

- what this page will eventually do
- who it is for
- what actions belong here
- whether the feature is free, premium, or later

## Open Layout Questions

- Should the trip phase nav be vertical only, or adaptable to mobile tabs?
- Should the workspace overview be a separate page or integrated into the trip home?
- How visible should premium locks be inside the main trip flow?
