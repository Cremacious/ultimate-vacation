# TripWave -- Instructions for Claude Code

Any Claude Code session working on this repo MUST follow the rules in this file before making product, UX, or code decisions.

---

## Read these first, in order

1. **docs/PITCH.md** -- what TripWave is, in plain English
2. **docs/CORE_LOOP.md** -- the must-prove spine and the Build Workflow (Details → Mockups → Code)
3. **docs/GRILL_PROTOCOL.md** -- the canonical rulebook for every grill-me session about UI or product
4. **docs/DECISIONS.md** -- the decision log, top entries are most recent
5. **docs/UI_COLOR_REFERENCE.md** -- the exact color values, button/input patterns, and never-use list. Read this before writing any JSX or CSS, no exceptions.

Only after these five are read should the agent engage with UX_SPEC, MONETIZATION, DESIGN_SYSTEM, ARCHITECTURE, or other detail docs.

---

## Hard rules

### Scope discipline

- The 7-step spine in CORE_LOOP.md is what ships first. Everything beyond the spine is Later or Speculative
- Before doing any design or implementation work on a feature, confirm it's on the spine
- If a user asks to grill on a deferred feature, route to ROADMAP.md → Future Grill-Me Topics and flag it politely, but honor the user's explicit override

### Build workflow

- Every new page (and every significant page rebuild) follows Details → Mockups → Code in order
- Tiny tweaks (typos, color adjustments, bug fixes) are exempt
- Page detail inventories (Step 1) are OWED for any page being implemented -- see BACKLOG.md "Build Workflow Audit" for the list

### Grill-me session protocol (MANDATORY)

The grill-me protocol in docs/GRILL_PROTOCOL.md is the canonical workflow for every grill-me session on UI. Any agent picking up grill-me work:

- Reads GRILL_PROTOCOL.md before the first question
- Actively prompts the user to invoke Anthropic Design plugin skills at the correct moments using the exact inline prompts defined in the protocol
- Annotates every UI decision log entry with a "Design skills" line noting which skills were run or skipped

### Anthropic Design plugin (installed, MUST be used)

Six skills, invoked with `/` in chat, mapped to specific workflow moments:

- `/user-research` -- Step 1 when user needs unclear
- `/design-critique` -- Step 2 after every mockup described, before locking
- `/design-system` -- Step 2 when new component or pattern introduced
- `/design-handoff` -- Step 3 before any implementation begins
- `/accessibility-review` -- Step 3 before shipping
- `/research-synthesis` -- post-launch, for user feedback

Skipping these is allowed ONLY for tiny tweaks / bug fixes. New pages and significant rebuilds must go through the relevant skills.

### Doc discipline

- Every meaningful product or UX decision gets a DECISIONS.md entry (Status / Context / Decision / Why / Follow-up / Design skills)
- docs/PITCH.md is kept in sync with every doc change. If PITCH drifts from reality, the product is drifting
- README.md reflects the current state of the project -- no "Ultimate Vacation" drift, no stale priorities
- Feature specs live in UX_SPEC.md (feature-level) and MONETIZATION.md (money-level)
- Visual / brand decisions live in DESIGN_SYSTEM.md

### Premium framing

- Premium is a supporter thank-you, not a feature unlock. Tone rules in docs/MONETIZATION.md section 5
- Copy must be warm AND clear -- never vague. Users must know exactly what they're buying
- Forbidden phrases: "upgrade to premium", "unlock powerful tools", "save the trip", any scarcity language
- Always reference the one-time $7.99 nature explicitly

### Brand direction

- The shipped UI uses a charcoal dark palette -- see docs/UI_COLOR_REFERENCE.md for every exact value
- Surfaces: #404040 page background, #2E2E2E cards, #252525 nested panels, #1E1E1E inputs, #3A3A3A borders
- **Accent palette is a neon rainbow -- use all six colors freely, not just blue and purple.** Cyan #00A8CC, Pink #FF2D8B, Yellow #FFD600, Green #00C96B, Purple #A855F7, Orange #FF8C00. All six should appear regularly across the UI. Decorative uses (gradients, stripe accents, icon fills) are encouraged; semantic roles in UI_COLOR_REFERENCE.md are primary anchors, not hard limits.
- Rainbow gradient stripe pattern (banners, dividers, top borders): `linear-gradient(90deg, #00A8CC 0%, #A855F7 25%, #FF2D8B 50%, #FFD600 75%, #FF8C00 100%)`
- Primary text is #FFFFFF (`text-white`). Secondary text is `text-white/90`. Muted text is `text-white/80`. These are the ONLY three white text values permitted. Never use `text-white/50`, `text-white/40`, `text-white/30`, `text-[#9CA3AF]`, or any gray text value
- The Neon-on-Dark Brand Direction in DESIGN_SYSTEM.md describes an aspirational future state -- UI_COLOR_REFERENCE.md is the current implementation authority
- Motion follows the Liquid Motion System (wet-neon, oil-flow easing, water-wave ripples) -- DESIGN_SYSTEM.md
- Logo is ocean-ripple, not electronic/sonar

---

## What this repo is NOT

- Not a subscription product
- Not a travel content platform
- Not a photo-hosting app
- Not using email for anything except password reset
- Not collecting phone numbers

---

## If something seems wrong

- If the repo name says "ultimate-vacation" and the docs say "TripWave" -- docs win, the repo name is historical
- If a decision in DECISIONS.md conflicts with a UX_SPEC section -- the newer decision wins; update UX_SPEC if needed
- If PITCH.md drifts from the docs -- the docs win, update PITCH.md to match

---

## Always-on reminders for the agent

- **Back buttons are always a green pill** (`rounded-full border bg-[#252525] px-4 py-2`, arrow + label both `#00C96B` Fredoka, shadow `0 3px 0 rgba(0,0,0,0.5)`). Never use a bare circle with external text.
- Before grilling on UI: route through GRILL_PROTOCOL.md, actively prompt design skill invocations
- Before writing ANY JSX/HTML/CSS: re-read docs/UI_COLOR_REFERENCE.md and use only the exact values listed there. Never use gray backgrounds, white backgrounds, light-mode text, or deprecated cyan values
- **Every interactive button gets a 3D bottom shadow** (`boxShadow: "0 3px 0 ..."`) — colored buttons use a darkened accent shade, dark/neutral buttons use `rgba(0,0,0,0.5)`, outline buttons are exempt
- **Colored buttons always use dark text `#171717`**, never `text-white` — white on neon is unreadable. Only outline/ghost buttons and dark-surface buttons use white text
- **All form labels use Fredoka** (`fontFamily: "var(--font-fredoka)"`) — uppercase, tracked wide, accent color
- **All button text uses Fredoka** — applies to every button type: CTAs, outline, pill, icon-with-label, nav buttons
- Before writing JSX/HTML: confirm Step 1 detail inventory and Step 2 mockup exist for that page
- Before shipping any new page: remind the user to run `/accessibility-review`
- When a new pattern emerges: remind the user to run `/design-system`
- When a mockup is about to be locked: remind the user to run `/design-critique`
- When implementation is next: remind the user to run `/design-handoff`
- End every UI decision log entry with the Design skills line
- Update PITCH.md whenever a decision materially changes what TripWave IS
