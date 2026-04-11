# Ultimate Vacation

Ultimate Vacation is a Next.js app for planning vacations from first idea to final settle-up. The product is designed to help one organizer guide a group through preplanning, itinerary building, packing, travel days, on-trip coordination, and expense tracking without turning the whole experience into chaos.

The codebase is early, but the project now includes a real documentation system so product, UX, and engineering decisions have a stable home from the start.

## Current Status

- Next.js App Router project scaffolded
- initial landing page and workspace placeholder created
- living planning docs established
- repo ready for backend, auth, and data-model work

## Run Locally

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run lint
npm run build
```

## Project Map

- [Product Plan](C:\Code\personal\ultimate-vacation\docs\PROJECT_PLAN.md)
- [Docs Index](C:\Code\personal\ultimate-vacation\docs\README.md)
- [Roadmap](C:\Code\personal\ultimate-vacation\docs\ROADMAP.md)
- [Backlog](C:\Code\personal\ultimate-vacation\docs\BACKLOG.md)
- [Architecture](C:\Code\personal\ultimate-vacation\docs\ARCHITECTURE.md)
- [App Structure](C:\Code\personal\ultimate-vacation\docs\APP_STRUCTURE.md)
- [Design System](C:\Code\personal\ultimate-vacation\docs\DESIGN_SYSTEM.md)
- [Decision Log](C:\Code\personal\ultimate-vacation\docs\DECISIONS.md)

## Working Agreements

- Product and scope decisions go in the planning docs before they become code.
- New architecture choices should be recorded in the decision log.
- Big feature ideas should land in the backlog before implementation.
- UI work should follow the design system and app structure docs.
- We are optimizing for a stable web product first, then mobile packaging later.

## Near-Term Priorities

1. Lock the initial product name and brand direction.
2. Build the app shell and route structure for the trip workspace.
3. Define the first database schema for trips, members, itinerary, and checklists.
4. Add auth, trip creation flow, and phase-based dashboard foundations.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Vercel-first hosting strategy
- Neon-targeted database strategy

## Notes

This repo intentionally carries more planning than code right now. That is on purpose. The goal is to avoid building a bunch of disconnected features before the product shape, monetization boundaries, and information architecture are clear.
