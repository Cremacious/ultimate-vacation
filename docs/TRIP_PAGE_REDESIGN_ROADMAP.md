# Trip Page Redesign Roadmap

Last updated: 2026-04-22
Reference old design source: `C:\Code\personal\tripwave-ba87c90` at commit `ba87c90`
Primary current implementation repo: `C:\Code\personal\ultimate-vacation`

## Purpose

This document is the working bridge between:

1. the older TripWave route designs and shell patterns in `ba87c90`
2. the current route logic and data model in `ultimate-vacation`
3. the written product/design docs in `docs/` and `mockups/`
4. page-by-page redesign execution done locally or remotely through Claude

The goal is not to blindly revert to the old repo. The old repo had stronger visual personality in many places, but it also used mock data, placeholder structure, and content placement that Chris already considers provisional. The real job is to port the strongest old visual ideas forward onto the current product reality.

## Design principles locked for this redesign program

- Treat `ba87c90` as a visual source, not a product source of truth.
- Preserve current real logic and permissions where they exist.
- Use the restored Preplanning work as the baseline for the new shell language: darker chrome, stronger section identity, larger bento composition, brighter text, playful neon accents.
- Keep content text at `text-white/80` or brighter unless there is a very good reason not to.
- When old mock placement conflicts with current product logic, keep the logic and reinterpret the layout.
- When docs conflict with old mocks, use current accepted docs and current code reality, then style the page closer to the old feel.

---

## What has already been redesigned

### Completed shell-level work

- top nav restyled closer to old mocks
- trip sidebar restyled closer to old mocks
- trip switcher dropdown layering fixed
- shell darkened and neon accents pushed into iconography
- active cyan sidebar stripe removed

### Completed page-level work

- **Preplanning** has already been substantially restored toward the old design language
- inner rail/header/workspace structure rebuilt
- all preplanning sections rebuilt in a bento-box style
- current real logic retained where available
- local-state stopgaps used where backend models do not yet exist

This means **Preplanning is the reference implementation** for redesigning the remaining trip pages.

---

## Design-doc alignment summary

### Most relevant docs for this roadmap

- `docs/DESIGN_ROADMAP.md`
- `docs/UX_SPEC.md`
- `docs/SURFACE_BLUEPRINT.md`
- `docs/CORE_LOOP.md`
- `docs/DECISIONS.md`
- `mockups/preplanning-nav.html`
- `mockups/preplanning-mobile.html`

### Important alignment notes

1. **Preplanning old IA vs current docs**
   - Old repo and old mockups expressed a richer, sectioned, bento-heavy Preplanning workspace.
   - Current `SURFACE_BLUEPRINT.md` says canonical Preplanning is now 4 sections: Travel, Stays, Prep, Notes.
   - Result: keep the strong old workspace treatment, but do not reintroduce outdated IA just because it looked nice.

2. **Overview in old repo vs current product contract**
   - Old Overview was emotionally rich and dashboard-like.
   - Current Overview contract in `SURFACE_BLUEPRINT.md` is explicitly about “where we are and what needs to happen next”.
   - Result: redesign should restore the strong bento/dashboard feel without reverting to dead mock data or obsolete cards.

3. **Today / Vacation Day**
   - Current docs say this is one of the highest-frequency real surfaces and still underbuilt.
   - Old repo has a visual shell to borrow from, but current implementation is more conditional and state-driven.
   - Result: this is a high-value redesign target, but should probably follow Overview and Itinerary.

4. **Expenses is the moat**
   - `SURFACE_BLUEPRINT.md` is unambiguous here.
   - Even if another page is prettier in the old repo, Expenses deserves top-tier redesign attention because it carries the product.

---

## Route-by-route audit

Each page below records:
- **Old design intent**
- **Current logic reality**
- **Redesign goal**
- **Known gaps / risks**
- **Priority**

---

## 1. Overview

**Old route:** `src/app/app/trips/[tripId]/page.tsx` in `ba87c90`

**Old design intent**
- Strong dashboard feel
- Large hero identity card for the trip
- Separate bento tiles for countdown, members, progress, next action, activity, must-dos, upcoming, quick actions
- Felt like the trip command center
- Highly visual, emotionally sticky, good at making the trip feel alive

**Current logic reality**
- Real trip/member/expense data
- `OverviewIdentity.tsx` and `OverviewRightNow.tsx`
- Current implementation is much more product-correct, but much more minimal visually
- Right-now rows are driven by actual pulse logic and state

**Docs alignment**
- Strongly aligned with `SURFACE_BLUEPRINT.md`: Overview should answer “where we are and what needs to happen next”
- Old hero/activity/must-do layout can still support that contract if rebuilt using real data

**Redesign goal**
- Rebuild Overview into a proper bento command center again
- Keep current pulse/right-now logic as the backbone
- Reintroduce visual hierarchy from old mockups: hero, countdown, member presence, progress, next action, upcoming, quick actions
- Do not restore fake activity or fake must-dos unless backed by real data or clearly marked as deferred

**Known gaps / risks**
- old activity feed and must-do panels were mock-driven
- current app may not yet have enough real data sources for every old card
- overview inline budget field is still owed per docs

**Priority**
- **P1, first page after Preplanning**

---

## 2. Setup

**Old route:** `src/app/app/trips/[tripId]/setup/page.tsx` in `ba87c90`

**Old design intent**
- Attractive summary dashboard for core trip facts
- Bento treatment for name, dates, duration, budget, travelers, transport, type, vibe, lodging
- Read as “trip setup at a glance”, not a plain admin form

**Current logic reality**
- Real data-backed setup summary exists
- Current page is already partially inspired by the old layout, but is slimmer and omits some old tiles
- `setup/edit` is real and organizer-gated

**Docs alignment**
- Setup remains the configuration viewer/editor
- Current docs do not require every old decorative tile, but the old visual treatment is still a good fit

**Redesign goal**
- Bring Setup visually closer to old bento richness
- Expand the summary surface to include more real fields when available, without inventing data
- Make it feel like a confident overview page, not a thin summary with one edit button

**Known gaps / risks**
- some old fields may not exist in current schema or current UI fetches
- avoid overstuffing the read-only setup surface with information that belongs in Preplanning

**Priority**
- **P2**

---

## 3. Itinerary

**Old route:** `src/app/app/trips/[tripId]/itinerary/page.tsx`

**Old design intent**
- Dedicated shell-driven trip schedule experience
- More stylized and branded than the current plain server wrapper
- Intended to feel like a central planning surface, not just a list

**Current logic reality**
- Current page is mostly a real-data server wrapper around `ItineraryShell`
- Actual logic is stronger than old repo: permissions, event listing, conflict handling, date jumping, setup-date guards

**Docs alignment**
- Itinerary is a core utility surface and should feel first-class
- Affiliate/event enhancements are deferred, but the base route matters now

**Redesign goal**
- Audit `ItineraryShell` and redesign its chrome/layout to match restored Preplanning quality
- Preserve current interaction model and conflict handling
- Reintroduce the stronger visual identity of the old trip workspace

**Known gaps / risks**
- old page wrapper itself tells less than the shell implementation, so the deeper comparison needs to happen in `src/components/itinerary/ItineraryShell.tsx`
- this route likely needs shell/component-level audit, not just page file comparison

**Priority**
- **P1**

---

## 4. Expenses

**Old route:** `src/app/app/trips/[tripId]/expenses/page.tsx`

**Old design intent**
- Full dedicated shell with stronger visual treatment
- Intended to feel like a key workspace, not a generic form/list page

**Current logic reality**
- Real and important logic exists now: balances, ledger, receipts, settlements, transfers, split modes
- Current page is functional but visually much plainer than the restored shell style
- This is one of the product’s most important real surfaces

**Docs alignment**
- `SURFACE_BLUEPRINT.md` says Expenses is the moat and should reach screenshot-worthy quality
- This is one of the clearest priorities for redesign polish

**Redesign goal**
- Bring the page much closer to the old mockup shell language and bento density
- Elevate balances, pay/owed clarity, add-expense affordance, and recent ledger presentation
- Make it look like the flagship feature it actually is

**Known gaps / risks**
- current expense client may already encode assumptions in a simpler layout
- redesign should start with composition and information hierarchy before touching interaction details

**Priority**
- **P1, arguably tied with Overview**

---

## 5. Packing
n
**Old route:** `src/app/app/trips/[tripId]/packing/page.tsx`

**Old design intent**
- Dedicated shell-based planning tool with more personality
- Felt like part of the trip workspace family

**Current logic reality**
- Real group packing logic exists
- Current page is a simple wrapper around a real list client and is visually plain

**Docs alignment**
- Shared packing checklist remains an important utility surface
- Per-member sections are deferred

**Redesign goal**
- Restyle Packing into the new shell language
- Emphasize group visibility, covered/not-covered state, and add-item flow
- Rebuild it to feel like a proper planning workspace, not a narrow utility page

**Known gaps / risks**
- may need additional list grouping/status states to fully capitalize on the old aesthetic

**Priority**
- **P2**

---

## 6. Polls

**Old route:** `src/app/app/trips/[tripId]/polls/page.tsx`

**Old design intent**
- Polling as a stylized group decision surface
- Consistent with the larger, softer, more playful bento system

**Current logic reality**
- Real poll creation, voting, close/delete logic exists
- The page is currently functional but comparatively bare

**Docs alignment**
- Important collaboration surface, but not as core as Expenses/Overview/Itinerary

**Redesign goal**
- Port the richer shell language onto real poll cards and create form
- Improve separation of open vs closed polls with stronger visual structure
- Keep fast decision-making obvious

**Known gaps / risks**
- old mock patterns may be more about “fun” than information density, so a bit of restraint may help

**Priority**
- **P2**

---

## 7. Wishlist / Proposals

**Old route:** `wishlist/page.tsx`

**Current route reality:** redirects to `proposals/page.tsx`

**Old design intent**
- Wishlist was a dedicated place for ideas and desirables
- Meant to feel exploratory and aspirational

**Current logic reality**
- Product has effectively evolved this into Proposals
- Real logic exists for creation, upvoting, deletion
- Current page is bare but functional

**Docs alignment**
- This is a reinterpretation case, not a one-to-one restore
- Keep the intent of wishlist energy, but adapt it to proposal logic

**Redesign goal**
- Design `Proposals` to inherit the old wishlist spirit: aspirational, idea-forward, visually playful
- Keep current proposal mechanics and naming unless docs later change that

**Known gaps / risks**
- old and new naming/function drift must be handled intentionally
- avoid trying to restore a route that no longer fits the current model

**Priority**
- **P2**

---

## 8. Travel Days

**Old route:** `travel-days/page.tsx`

**Old design intent**
- Dedicated travel-day shell with stronger situational focus
- Distinct from general itinerary

**Current logic reality**
- Real list/query path exists through `TravelDayShell`
- Has logic around transport-related itinerary presence and edit permissions

**Docs alignment**
- Travel Day is a core differentiator according to roadmap docs
- Should feel operational and high-signal

**Redesign goal**
- Audit `TravelDayShell` and redesign it closer to old branded shell language
- Highlight transport sequence, checklists, timing, and day-of readiness

**Known gaps / risks**
- like Itinerary, the page file is just a wrapper, so the real redesign scope lives in the shell component

**Priority**
- **P1**

---

## 9. Vacation Days / Today

**Old route:** `vacation-days/page.tsx`

**Old design intent**
- Dedicated daily trip experience via `VacationDayShell`
- Strong visual identity for in-trip use

**Current logic reality**
- Current route is much more stateful and product-aware
- Handles no dates, not started, active, ended states
- Uses `TodayViewContent` with real event data
- This is more advanced logically, but still likely underdesigned visually

**Docs alignment**
- Docs say this is one of the highest-frequency surfaces and still underbuilt
- Also note naming debt: likely should become “Today” eventually

**Redesign goal**
- Rebuild the active-trip daily view into something that feels special and highly glanceable
- Keep all current branch logic, but restyle each state and the active day layout
- Make this feel like a native “use it during the trip” surface, not just a conditional page

**Known gaps / risks**
- naming may change during or after redesign
- old page shell may not directly map to current much smarter route states

**Priority**
- **P1**

---

## 10. Tools

**Old route:** `tools/page.tsx`

**Old design intent**
- Catalog of planning/on-trip utility tools
- Color-coded categories, premium marker, browseable utility hub

**Current logic reality**
- Current page is almost identical in structure to the old page, but restyled to dark mode and no longer links in exactly the same way as before in the old version
- Most tools still remain conceptual or unimplemented

**Docs alignment**
- Tools is largely roadmap-shaped, not a set of owed near-term implementations
- Only a small number of tools are likely real near-term targets

**Redesign goal**
- Low urgency visually, because it already preserves much of the old information architecture
- At most, align it better with the new shell chrome and typography if needed

**Known gaps / risks**
- easy place to waste time polishing a low-value surface

**Priority**
- **P4**

---

## 11. Settings

**Old route:** `settings/page.tsx`

**Old design intent**
- Dedicated settings shell for trip admin/management

**Current logic reality**
- Real organizer/member aware settings page exists now
- Includes edit trip, members, and deferred danger-zone copy
- More product-correct than old shell wrapper

**Docs alignment**
- Settings is useful, but not a core visual differentiator

**Redesign goal**
- Bring settings cards into the shared redesign language
- Improve the page’s visual confidence and grouping
- Keep it simple, administrative, and calm

**Known gaps / risks**
- low leverage compared with Overview/Expenses/Today

**Priority**
- **P3**

---

## 12. Members

**Old route:** `settings/members/page.tsx`

**Old design intent**
- Dedicated member management shell

**Current logic reality**
- Real member listing exists, organizer can invite more people
- Page is clean but visually basic

**Docs alignment**
- Important for management, but not a hero product surface

**Redesign goal**
- Bring member cards and invite affordance into the shell language
- Make role/status more legible and more visually on-brand

**Known gaps / risks**
- avoid overdesigning a relatively straightforward list

**Priority**
- **P3**

---

## 13. Notes

**Old route:** `notes/page.tsx`

**Old design intent**
- Placeholder for a future shared note space

**Current logic reality**
- Still a stub page in current repo
- Preplanning Notes currently partially fill the real use case

**Docs alignment**
- Notes surface is still deferred and the Preplanning notes pad is the stopgap

**Redesign goal**
- Do not prioritize full redesign yet
- When touched, style the stub to match the modern shell and future intention

**Known gaps / risks**
- building this too early duplicates Preplanning Notes

**Priority**
- **P4**

---

## 14. Memory / Afterglow

**Old route:** `memory/page.tsx`

**Old design intent**
- Post-trip highlights/recap surface

**Current logic reality**
- Still a stub
- Docs indicate naming debt and future likely rename to Afterglow

**Docs alignment**
- Entire surface remains largely deferred until real completed trips exist

**Redesign goal**
- Minimal for now
- Track for post-launch or post-real-trip usage

**Priority**
- **P4**

---

## 15. Scavenger Hunt

**Old route:** `scavenger-hunt/page.tsx`

**Old design intent**
- Playful trip activity surface, shell-driven

**Current logic reality**
- Page file currently mirrors old shell wrapper shape closely
- not a primary launch-critical surface

**Docs alignment**
- More of a secondary/fun surface than a core utility page

**Redesign goal**
- Low immediate priority unless it becomes strategically important for the launch vibe

**Priority**
- **P4**

---

## Recommended redesign order

### Tier 1: highest-value pages

1. **Overview**
2. **Expenses**
3. **Itinerary**
4. **Travel Days**
5. **Vacation Days / Today**

Why:
- these are the most important product surfaces after Preplanning
- they define whether the app feels premium, focused, and distinctive
- several of them are explicitly important in docs, not just visually desirable

### Tier 2: important support pages

6. **Setup**
7. **Packing**
8. **Polls**
9. **Proposals**

Why:
- these benefit strongly from the bento/shell language
- they are real product surfaces with real logic
- they matter, but are less central than the tier-1 command surfaces

### Tier 3: administrative pages

10. **Settings**
11. **Members**

### Tier 4: low urgency / deferred / mostly conceptual

12. **Tools**
13. **Notes**
14. **Memory / Afterglow**
15. **Scavenger Hunt**

---

## Execution pattern for each page

For each redesign page, use this sequence:

1. inspect old route page and related shell/component files in `tripwave-ba87c90`
2. inspect current route page and current shell/component files in `ultimate-vacation`
3. list what is visual only vs what is real logic/data/permissions
4. identify which old sections still make sense, which need reinterpretation, and which should be dropped
5. redesign the page to feel much closer to the old mockup language while preserving current logic
6. run targeted lint on changed files
7. commit locally with a focused message
8. update this roadmap doc with status notes if scope or priorities changed

---

## Page-by-page Claude prompts

These are written to be reusable remote prompts for Claude Code. Each assumes work is happening against the main TripWave repo and that changes may only be seen via GitHub after commit.

### Prompt template rules

- tell Claude exactly which old file(s) to inspect
- tell it exactly which current file(s) to preserve logic from
- tell it not to invent backend models or fake persistence unless explicitly asked
- tell it to keep text brightness at `text-white/80` minimum for content
- tell it to commit after targeted lint

---

## Claude prompt: Overview redesign

```text
Work in the TripWave repo.

Task: redesign the trip Overview page to feel much closer to the old design from commit ba87c90, while preserving the current real logic and data model.

Reference old files:
- src/app/app/trips/[tripId]/page.tsx from the old ba87c90 worktree/repo

Current files to inspect and preserve logic from:
- src/app/app/trips/[tripId]/page.tsx
- src/app/app/trips/[tripId]/OverviewIdentity.tsx
- src/app/app/trips/[tripId]/OverviewRightNow.tsx
- any helper(s) used by current trip pulse / right-now rows

Goals:
- restore a richer bento-style command-center layout similar to the old Overview
- keep current real trip/member/pulse/right-now logic intact
- do not reintroduce fake mock data
- if an old card has no real backing data yet, either reinterpret it using existing data or omit it cleanly
- make the page feel emotionally rich and highly visual again
- use the restored Preplanning aesthetic as the shell-quality bar
- keep content text no dimmer than text-white/80 unless there is a specific reason

Deliverables:
- implement the redesign
- run targeted lint on changed files
- commit with a focused message
- in your final summary, list:
  1. what old design ideas were restored
  2. what current logic was preserved
  3. what old sections were intentionally not brought forward yet
```

## Claude prompt: Expenses redesign

```text
Work in the TripWave repo.

Task: redesign the trip Expenses page so it feels much closer to the older TripWave visual style from ba87c90, but preserve all current real expense, balance, settlement, and receipt logic.

Reference old files:
- src/app/app/trips/[tripId]/expenses/page.tsx from ba87c90
- any related old expenses shell/component files if needed

Current files to inspect and preserve logic from:
- src/app/app/trips/[tripId]/expenses/page.tsx
- src/app/app/trips/[tripId]/expenses/ExpensesClient.tsx
- any expense UI components it uses

Constraints:
- do not break any real logic for balances, transfers, settlements, receipts, or split modes
- the redesign should make Expenses feel like a flagship TripWave surface
- prioritize information hierarchy, visual clarity, and screenshot-worthiness
- use darker chrome and playful neon accents, consistent with the new shell and restored Preplanning
- keep content text at text-white/80 minimum where appropriate
- do not invent backend capabilities that do not exist

Deliverables:
- redesign the page/client components as needed
- run targeted lint on changed files
- commit changes
- final summary should clearly separate visual changes from logic-preserving decisions
```

## Claude prompt: Itinerary redesign

```text
Work in the TripWave repo.

Task: audit the old and current Itinerary implementations, then redesign the current Itinerary experience to feel much closer to the old TripWave design language while preserving current real behavior.

Reference old files:
- src/app/app/trips/[tripId]/itinerary/page.tsx from ba87c90
- src/components/itinerary/ItineraryShell.tsx from ba87c90 if present

Current files to inspect and preserve logic from:
- src/app/app/trips/[tripId]/itinerary/page.tsx
- src/components/itinerary/ItineraryShell.tsx
- any subordinate itinerary UI pieces used by the shell

Goals:
- restore the stronger branded workspace feel
- preserve current permissions, event loading, conflict handling, date jumping, and missing-dates guard behavior
- redesign layout/composition/chrome first, not product rules
- make the page feel like a first-class trip planning surface in the same family as restored Preplanning
- keep text bright enough for readability on the dark shell

Deliverables:
- redesign implementation
- targeted lint
- commit
- final summary with old inspirations used, logic preserved, and any deferred ideas
```

## Claude prompt: Travel Days redesign

```text
Work in the TripWave repo.

Task: redesign Travel Days to feel much closer to the older TripWave visual language, while preserving the current real route logic and any current shell behavior.

Reference old files:
- src/app/app/trips/[tripId]/travel-days/page.tsx from ba87c90
- src/components/travel-days/TravelDayShell.tsx from ba87c90

Current files to inspect:
- src/app/app/trips/[tripId]/travel-days/page.tsx
- src/components/travel-days/TravelDayShell.tsx
- related travel-day helpers/components if any

Goals:
- keep current real behavior and permissions intact
- improve layout, structure, and travel-day situational clarity
- make the page feel operational, high-signal, and visually in-family with restored Preplanning
- preserve any current logic around itinerary transport events or edit gating

Deliverables:
- redesign implementation
- targeted lint
- commit
- concise summary of visual upgrades vs preserved logic
```

## Claude prompt: Today / Vacation Days redesign

```text
Work in the TripWave repo.

Task: redesign the current Vacation Days / Today experience so it feels much closer to the old TripWave design language, while preserving the current smarter route logic and state branching.

Reference old files:
- src/app/app/trips/[tripId]/vacation-days/page.tsx from ba87c90
- src/components/vacation-days/VacationDayShell.tsx from ba87c90

Current files to inspect and preserve logic from:
- src/app/app/trips/[tripId]/vacation-days/page.tsx
- src/components/vacation-days/TodayView.tsx
- src/components/vacation-days/VacationDayShell.tsx if still relevant

Important:
- preserve all current route-state branches: no dates, not started, active, ended
- do not simplify away the current product logic
- redesign each state to feel intentional and visually polished
- active-day view should feel especially glanceable and useful during the trip
- keep typography/contrast readable on the dark shell

Deliverables:
- redesign implementation
- targeted lint
- commit
- final summary including which route states were restyled and how the old look informed the result
```

## Claude prompt: Setup redesign

```text
Work in the TripWave repo.

Task: redesign the Setup summary page to feel closer to the old ba87c90 setup bento design, while preserving the current real setup data and boundaries.

Reference old files:
- src/app/app/trips/[tripId]/setup/page.tsx from ba87c90

Current files to inspect:
- src/app/app/trips/[tripId]/setup/page.tsx
- src/app/app/trips/[tripId]/setup/edit/page.tsx

Goals:
- keep Setup as a summary/configuration surface, not a replacement for Preplanning
- restore more of the old bento richness where it fits the current real data
- do not invent fields that are not actually present
- keep the current edit flow intact
- match the darker, more playful, more confident shell language used by restored Preplanning

Deliverables:
- redesign implementation
- targeted lint
- commit
- final summary with restored ideas, omitted ideas, and any data-shape limitations
```

## Claude prompt: Packing redesign

```text
Work in the TripWave repo.

Task: redesign Packing to feel much closer to the old TripWave visual language while preserving the current real packing-list logic.

Reference old files:
- src/app/app/trips/[tripId]/packing/page.tsx from ba87c90
- src/components/packing/PackingShell.tsx from ba87c90

Current files to inspect:
- src/app/app/trips/[tripId]/packing/page.tsx
- src/app/app/trips/[tripId]/packing/PackingClient.tsx
- src/components/packing/PackingShell.tsx if relevant

Goals:
- keep current add/toggle/delete behavior intact
- rebuild the layout/chrome so Packing feels like a real TripWave workspace page
- improve group visibility and state clarity
- use dark shell + brighter content text + tasteful neon accents

Deliverables:
- redesign implementation
- targeted lint
- commit
```

## Claude prompt: Polls redesign

```text
Work in the TripWave repo.

Task: redesign Polls to feel much closer to the old TripWave style while preserving the current real polling logic.

Reference old files:
- src/app/app/trips/[tripId]/polls/page.tsx from ba87c90
- src/components/polls/PollsShell.tsx from ba87c90

Current files to inspect:
- src/app/app/trips/[tripId]/polls/page.tsx
- src/app/app/trips/[tripId]/polls/CreatePollForm.tsx
- src/app/app/trips/[tripId]/polls/PollCard.tsx
- current poll-related components as needed

Goals:
- keep real create, vote, close, and delete logic intact
- improve open/closed poll separation visually
- make the page feel more playful and group-oriented, not just stacked forms/cards
- stay consistent with restored Preplanning and shell styling

Deliverables:
- redesign implementation
- targeted lint
- commit
```

## Claude prompt: Proposals redesign

```text
Work in the TripWave repo.

Task: redesign Proposals so it carries the spirit of the old Wishlist page from ba87c90, but uses the current proposal/upvote logic and current product direction.

Reference old files:
- src/app/app/trips/[tripId]/wishlist/page.tsx from ba87c90
- src/components/wishlist/WishlistShell.tsx from ba87c90 if useful

Current files to inspect:
- src/app/app/trips/[tripId]/proposals/page.tsx
- src/app/app/trips/[tripId]/proposals/CreateProposalForm.tsx
- src/app/app/trips/[tripId]/proposals/ProposalCard.tsx

Goals:
- do not try to restore the old wishlist route literally
- reinterpret the old exploratory, aspirational feeling onto the real proposals feature
- preserve current proposal creation/upvote/delete logic
- make the page feel more alive and idea-driven

Deliverables:
- redesign implementation
- targeted lint
- commit
```

## Claude prompt: Settings or Members redesign

```text
Work in the TripWave repo.

Task: restyle the trip Settings and/or Members pages to better match the older TripWave shell language, while preserving the current real role-aware logic and navigation.

Reference old files:
- src/app/app/trips/[tripId]/settings/page.tsx from ba87c90
- src/app/app/trips/[tripId]/settings/members/page.tsx from ba87c90
- related old shell components if helpful

Current files to inspect:
- src/app/app/trips/[tripId]/settings/page.tsx
- src/app/app/trips/[tripId]/settings/members/page.tsx

Goals:
- preserve current permissions and navigation behavior
- improve grouping, cards, role/status presentation, and overall polish
- keep these pages simpler and calmer than hero product surfaces
- align them visually with the modern dark shell

Deliverables:
- redesign implementation
- targeted lint
- commit
```

---

## Working status tracker

Use this section as the live checklist.

- [x] Shell restyle closer to old mockups
- [x] Preplanning redesign/restoration
- [ ] Overview redesign
- [ ] Expenses redesign
- [ ] Itinerary redesign
- [ ] Travel Days redesign
- [ ] Vacation Days / Today redesign
- [ ] Setup redesign
- [ ] Packing redesign
- [ ] Polls redesign
- [ ] Proposals redesign
- [ ] Settings redesign
- [ ] Members redesign
- [ ] Tools alignment pass if needed
- [ ] Notes stub alignment pass if needed
- [ ] Memory/Afterglow stub alignment pass if needed
- [ ] Scavenger Hunt alignment pass if needed

---

## Notes for future Doctor updates

When a page gets redesigned, add a short note here with:
- commit hash
- what changed visually
- what logic was intentionally preserved
- what remains deferred

That keeps this usable as the single redesign ledger Chris asked for.
