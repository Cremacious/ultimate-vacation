# Monetization

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

That means free users should understand the app quickly and get real utility, but the features that reduce chaos the most should push toward paid.

## 1. Customer Model

Primary customer:

- one organizer who plans the trip and wants everyone else to stop being disorganized

Secondary users:

- invited participants who benefit from the trip workspace without paying

### Recommended commercial rule

Charge the organizer, not every participant.

This is simpler, more understandable, and better aligned with the user’s original intent.

### Multiple trip membership

Users can be participants in multiple trips at once (someone else’s trips, not their own). Whether being an active member in more than one trip simultaneously requires premium on the participant side is an open question — but creating multiple trips as an organizer is clearly a premium trigger.

## 2. Proposed Pricing Structure

### Free

Purpose:

- let users experience the planning system
- create habit and trust
- show the value of guided planning

Includes:

- one active trip
- basic trip setup
- basic itinerary building
- basic packing lists
- invite participants
- limited collaborator features

### Premium

Purpose:

- unlock the features that most reduce risk, stress, and group friction

Candidate price point to test later:

- monthly subscription for active planners
- possibly annual option later

Premium includes:

- unlimited active trips
- advanced travel-day flows
- group polls and voting
- expense splitting and settlement
- offline access
- smart suggestions
- premium templates
- richer planning insights and readiness guidance

### Possible later add-on ideas

- trip templates packs
- family or accessibility planning toolkit
- concierge-style planning suggestions

## 3. Strongest Premium Features

These feel like real upgrade levers:

### A. Travel Day Pro

Why it converts:

- this is the signature differentiator
- it solves a painful and immediate problem

Candidate premium features:

- advanced travel-day templates
- grouped responsibilities
- richer checklist logic
- trip-day timing nudges

### B. Group Harmony Tools

Why it converts:

- group conflict is a major pain point

Candidate premium features:

- polls and voting
- organizer override tools
- richer coordination summaries

### C. Money Tools

Why it converts:

- shared expenses are universally annoying

Candidate premium features:

- expense splitting
- settle-up summary
- budget tracking

### D. Offline Confidence

Why it converts:

- very credible travel-specific value

Candidate premium features:

- offline itinerary access
- offline travel-day access
- offline packing access

### E. Smart Suggestions

Why it converts:

- feels premium and personalized

Candidate premium features:

- destination-aware suggestions
- transport-aware planning prompts
- special-needs and family-aware prompts

## 4. Free vs Premium Boundary Draft

### Keep free

- create account
- create one active trip as organizer
- trip setup (name, dates, invite code)
- basic itinerary
- basic packing list (personal, private)
- invite others via code
- basic trip dashboard
- be a participant in other people's trips

### Make premium

- multiple active trips as organizer
- advanced travel-day flows with transport-aware checklists
- polls and voting (including polls tied to calendar events)
- expense tracking and settlement
- receipt scanning
- offline mode
- smart context-aware suggestions (mobility, transport, trip type)
- premium templates
- vacation timeline feature (may be free or premium — to decide)

### Confirmed premium-only

- receipt scanning (confirmed — OCR cost and complexity justifies gate)
- creating more than one active trip as the organizer

## 5. Conversion Moments

Premium prompts should show up where the user already feels the need.

### High-intent upgrade moments

- user tries to create a second active trip
- user enters travel-day mode and wants advanced checklist power
- user tries to start a poll
- user tries to split an expense
- user wants offline access before departure
- readiness is weak and smart suggestions would help

### Good paywall style

- informative
- stylish
- lightly cheeky
- never punishing

Example tone:

- "You can absolutely wing this. Or you can unlock the tools that save the trip."

## 6. Profit Strategy

Profit comes from disciplined scope as much as revenue.

### Low-cost product strategy

- keep hosting on Vercel
- keep primary data in Neon
- avoid costly third-party AI dependencies at first
- delay receipt OCR until economics are proven
- avoid real-time infra unless collaboration truly demands it

### Margin protection rules

- favor deterministic product logic before AI features
- use premium to fund expensive features later
- avoid giving away the most support-heavy features for free

## 7. Feature Cost Awareness

### Low-cost features with strong value

- phase guidance
- next best action
- travel-day checklist logic
- packing workflows
- invite code flows

### Medium-cost features

- collaborative editing polish
- offline sync
- advanced notifications

### High-cost features to gate carefully

- OCR receipt scanning
- AI-heavy personalized planning
- complex background processing

## 8. Potential Pricing Experiments Later

- monthly only at first
- monthly + annual after retention is clearer
- limited-time trip pass for one premium trip
- premium trial starting near departure date

## 9. Brainstorm Ideas For Revenue Expansion

- premium trip templates
- honeymoon or family travel packs
- destination planning guides
- partner affiliate revenue later for travel services, only if tasteful

## 10. Recommended Monetization Decisions For MVP

- one organizer pays
- free tier proves the value
- premium gates chaos-reducing features
- no per-seat pricing at launch
- no complex enterprise-style billing
- no expensive AI-first promise in the first version

## 11. Open Monetization Questions

- Should expenses be fully premium or partially free?
- Should polls be fully premium or limited-use free?
- Should there be a one-time trip pass in addition to subscription?
- Should offline mode be fully premium or partially available?
