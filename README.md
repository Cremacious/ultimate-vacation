# TripWave

> *Plan the trip. Not the group chat.*

TripWave is a Next.js app for planning vacations with a group, from first idea to final settle-up. One organizer and their crew share a single calm workspace for preplanning, itinerary, packing, travel day, on-trip coordination, expenses, and the trip recap. No group chats, no spreadsheets, no three-people-who-still-don't-know-the-plan.

Built by one person. Free forever with ads. $7.99 one-time unlock for supporters -- no ads, plus a few fun bonus features. No subscriptions.

**Layman's pitch**: see [docs/PITCH.md](docs/PITCH.md).

---

## Current Status

- Next.js 16 App Router scaffold
- Marketing landing / auth / app shell / phase placeholders in place
- Comprehensive planning docs established
- Backend, auth, and data model work pending

The repo intentionally carries more planning than code right now. The goal is to avoid building a bunch of disconnected features before the product shape, monetization boundaries, and information architecture are clear.

---

## The Core Loop (what must ship first)

TripWave's must-prove spine, before anything else:

1. Sign up
2. Create a trip
3. Invite people
4. Preplan
5. Build the itinerary
6. Use Travel Day
7. Track expenses

Full discipline doc: [docs/CORE_LOOP.md](docs/CORE_LOOP.md).

Everything beyond the spine (Dream Mode, Wishlist, Notes, Tools, Memory, etc.) is **Later** or **Speculative**. Specced in docs, not built until the spine is proven.

---

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

---

## Project Map

- [Pitch](docs/PITCH.md) -- TripWave in layman's terms
- [Core Loop](docs/CORE_LOOP.md) -- the must-prove spine + MVP/Later/Speculative catalog
- [Product Plan](docs/PROJECT_PLAN.md)
- [Docs Index](docs/README.md)
- [Roadmap](docs/ROADMAP.md) -- phased plan + future grill-me topics
- [Backlog](docs/BACKLOG.md)
- [Architecture](docs/ARCHITECTURE.md)
- [App Structure](docs/APP_STRUCTURE.md)
- [Design System](docs/DESIGN_SYSTEM.md) -- neon-on-dark + liquid motion + logo ripple
- [UX Spec](docs/UX_SPEC.md) -- feature-level UI/UX decisions
- [Monetization](docs/MONETIZATION.md)
- [Decision Log](docs/DECISIONS.md)

---

## Working Agreements

- Product and scope decisions live in the planning docs before they become code
- New architecture choices are recorded in the decision log
- Big feature ideas land in the backlog before implementation
- UI work follows the design system and app structure docs
- We optimize for a stable web product first, then native mobile later
- The core loop defined in CORE_LOOP.md is the spine -- everything else is deferred discipline
- PITCH.md is kept in sync with every doc change -- if it's drifted, the product is drifting

## Build Workflow (mandatory for all new pages)

Every new page (and every significant page rebuild) follows three steps in order:

1. **Page details** -- write down every field, action, state, edge case, and ordering the page contains (the "what's on this page" inventory)
2. **UI mockup** -- ASCII wireframe, Figma, or inline description matching the details, honoring neon-on-dark + liquid motion
3. **Code** -- only after Steps 1 and 2 are locked

Skipping steps is allowed only for tiny tweaks and bug fixes. Full spec in [docs/CORE_LOOP.md](docs/CORE_LOOP.md) under "Build Workflow -- Details → Mockups → Code".

## Anthropic Design Plugin Integration

The [Anthropic Design plugin](https://www.anthropic.com/news/claude-design-anthropic-labs) is installed and mapped into our workflow as **mandatory quality gates**:

| When | Skill |
|---|---|
| Step 1 ambiguity about user needs | `/user-research` |
| Step 2 mockup ready to pressure-test | `/design-critique` |
| Step 2 introduces new component or pattern | `/design-system` |
| Step 3 ready to implement | `/design-handoff` |
| Step 3 ready to ship | `/accessibility-review` |
| Post-launch user feedback to distill | `/research-synthesis` |

Invoke any of these with `/` in chat. Grill-me sessions on new pages MUST run `/design-critique` before locking. Pre-implementation MUST run `/design-handoff`. Pre-ship MUST run `/accessibility-review`.

## Grill-Me Session Protocol (applies to every Claude Code session)

Any grill-me session on TripWave UI starts by reading [docs/GRILL_PROTOCOL.md](docs/GRILL_PROTOCOL.md). That doc is the canonical rulebook and applies on every machine, every session, every agent. It defines:

- When the agent actively reminds the user to invoke each design skill
- The exact inline prompts the agent uses verbatim
- The decision log annotation rule (every UI decision notes which skills were run or skipped)
- The mental checklist the agent runs before ending a session

**If you are an AI agent picking up this repo, read GRILL_PROTOCOL.md before any UI grill-me session.**

---

## Near-Term Priorities

Build in this order (from CORE_LOOP.md):

1. Auth (sign up / login / password reset)
2. App shell (top nav, sidebar desktop, pill bar mobile)
3. Trip creation flow (4-step with Real / Dream picker)
4. Trip overview (brand-new + established states)
5. Preplanning hub + one section editor end-to-end
6. Itinerary day-by-day CRUD
7. Invite flow (share link, accept join)
8. Expenses (balances + ledger + add + settle)
9. Travel Day (plan + focus mode)

Everything after that is Later.

---

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Vercel-first hosting
- Neon (Postgres) targeted database
- Better Auth (auth provider direction)
- Stripe (web payments), Apple/Google in-app (native)
- Resend (password reset email only)
- Azure Computer Vision (receipt OCR, premium only)

---

## Brand

- **Dark mode primary** -- base near-black with neon rainbow accents and pure white text
- **Trip ball** -- the product's signature visual, a glowing orb that fills as you plan
- **Ocean-ripple logo** -- slow water-like ripples, not electronic / sonar
- **Liquid motion system** -- wet-paint neon, oil-flow easing, wave transitions
- **Slogan** -- *"Get everyone on the same wave."*
- **Solo-dev supporter framing** -- premium is a thank-you, not an upgrade funnel
