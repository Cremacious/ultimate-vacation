# TripWave — Fun Ideas

> **Sandbox rule.** This is a brainstorming surface, not authoritative spec. Ideas start `brainstormed`, get critiqued, and either lock into `UX_SPEC.md` (with status `locked` → `shipped`) or retire to the graveyard at the bottom. `UX_SPEC.md` stays the source of truth for shipping decisions.

---

## What this doc is

A living catalog of fun ideas — micro-interactions, motion flourishes, copy moments, easter eggs, sensory details — attached to each feature in `FEATURES.md`. Organized by the same 14 functional-area sections so you can flip through "what delightful moments exist in Trip Creation?" at a glance.

## What this doc is NOT

- Not authoritative spec. Ideas here are speculative until `locked`.
- Not a replacement for `UX_SPEC.md` — locked ideas get promoted there with provenance.
- Not a replacement for `DESIGN_SYSTEM.md` — motion/palette patterns, once locked, move there.
- Not a commitment to ship. Ideas can stay `brainstormed` forever without anyone building them.

This doc answers: **what fun moments could we add, and which ones are marketing-ammunition?**

---

## How to read each idea

Each feature gets a sub-heading with a bulleted list of idea cards:

```
- **Idea title.** One- or two-sentence description.
  Tags: `<status>` · `<marketing-hook>` · effort `<tiny|small|medium|large>`
  Design skills: not yet critiqued | /design-critique run 2026-04-21 | etc.
  Notes: (optional — trade-offs, open questions, dependencies)
```

### Status vocabulary

- `brainstormed` — newly captured, not yet critiqued
- `under-critique` — `/design-critique` or `/design-system` has been run; we're iterating
- `locked` — decision made, promoted to `UX_SPEC.md` or `DESIGN_SYSTEM.md`, awaiting implementation
- `shipped` — live in the product
- `rejected` — critiqued and declined; retires to the graveyard below

### Marketing-hook vocabulary

How this idea serves marketing if implemented:

- `Film-for-TikTok` — the micro-interaction is visual enough for a 10–15s build-in-public reel
- `ASO-screenshot` — the visual is strong enough for an App Store screenshot caption
- `Press-demo` — a journalist or podcaster can point at this as the "oh that's neat" moment
- `Easter-egg` — hidden delight, word-of-mouth material (*"dude tap the ball three times"*)
- `Onboarding-ritual` — sets tone during signup / first trip creation / first invite
- `Micro-polish` — not individually marketable, but contributes to the overall "this feels good" gestalt
- `Brand-reinforcement` — reinforces neon-on-dark, liquid motion, ocean-ripple logo, or solo-dev ♥ moments

### Effort vocabulary

- `tiny` — under an hour; one-line CSS tweak, copy change, or emoji addition
- `small` — half-day or less; single-component animation or interaction polish
- `medium` — 1–3 days; new motion pattern, multi-component coordination, or audio asset
- `large` — 3+ days; system-level change, new component, or infrastructure dependency

### Design-skills integration (per `GRILL_PROTOCOL.md`)

- Before an idea moves from `brainstormed` → `locked`, run `/design-critique` on it.
- If the idea introduces a *new* motion / palette / interaction pattern not already in `DESIGN_SYSTEM.md`, also run `/design-system`.
- Note the skill invocation and date under **Design skills** on the card.

---

## Table of contents

- [1. Auth & Account](#1-auth--account)
- [2. Dashboard & Trip Switcher](#2-dashboard--trip-switcher)
- [3. Trip Creation](#3-trip-creation)
- [4. Trip Workspace — Overview](#4-trip-workspace--overview)
- [5. Trip Workspace — Preplanning](#5-trip-workspace--preplanning)
- [6. Trip Workspace — Itinerary](#6-trip-workspace--itinerary)
- [7. Trip Workspace — Expenses](#7-trip-workspace--expenses)
- [8. Trip Workspace — Travel Day](#8-trip-workspace--travel-day)
- [9. Trip Workspace — Members & Invites](#9-trip-workspace--members--invites)
- [10. Dream Mode](#10-dream-mode)
- [11. Premium & Supporter Moments](#11-premium--supporter-moments)
- [12. Marketing Surfaces](#12-marketing-surfaces)
- [13. Retention Surfaces](#13-retention-surfaces)
- [14. Affiliate & Ads](#14-affiliate--ads)
- [Idea graveyard](#idea-graveyard)

---

## 1. Auth & Account

*(to populate)*

## 2. Dashboard & Trip Switcher

*(to populate)*

## 3. Trip Creation

Trip Creation is the 4-step full-screen flow (name → dates → color → reveal). The existing fun treatment is specced in `UX_SPEC.md` § 3. Ideas below extend that treatment with additional moments — typing-sympathetic ball physics, sensory payoffs on the reveal, copy personality, and a progress ghost. High TikTok / ASO leverage.

### Feature: Step 1 — Name

- **Typing-sympathetic breathing.** The dashed cyan ball's idle breathing rhythm shifts to match typing cadence — faster when the user types quickly, slows during pauses, pauses entirely when the cursor is idle 2+ seconds. Creates the feeling the ball is *listening*, not just reacting to submit.
  Tags: `brainstormed` · `Film-for-TikTok` · effort `small`
  Design skills: not yet critiqued
  Notes: extends the existing "ball pulses as user types" spec. Gentler, more alive.

- **Placeholder whimsy.** The name-input placeholder rotates through playful examples on each page load: *"Bachelor Weekend"*, *"Dad's 60th"*, *"Iceland 2027"*, *"The One Where We Lost Kevin"*, *"Maine Road Trip"*. Fresh every visit. Stays sassy, never generic.
  Tags: `brainstormed` · `Onboarding-ritual` · effort `tiny`
  Design skills: not yet critiqued

- **No-name backup droop.** If user types something and then deletes it all, the ball does a brief sad-but-cute droop (1.5s) before returning to ready-state. Signals the ball wants a name but isn't going to nag.
  Tags: `brainstormed` · `Micro-polish` · effort `tiny`
  Design skills: not yet critiqued
  Notes: relies on the same sad-shake motion vocabulary as the login wrong-password moment — reusable pattern.

### Feature: Step 2 — Dates

- **Calendar that breathes.** The date-range picker has a subtle parallax — dates drift lazily like the calendar itself is on vacation. Hover on a date ripples outward (ocean-wave motif).
  Tags: `brainstormed` · `Brand-reinforcement` · effort `small`
  Design skills: not yet critiqued
  Notes: *new pattern* — would need `/design-system` run to confirm fit with Liquid Motion System.

- **Skip-button microcopy.** The Skip button keeps its existing equal-weight visual treatment (per UX_SPEC spec) but adds tiny italicized microcopy underneath: *"(totally valid)"*. Reinforces the "no pressure" tone without adding a new primary message.
  Tags: `brainstormed` · `Micro-polish` · effort `tiny`
  Design skills: not yet critiqued

### Feature: Step 3 — Pick a Color

- **Color-wash swatch preview.** On swatch tap-and-hold (or hover on desktop), the swatch color briefly washes the full background as a preview before the ball fills on commit. Users feel the "vibe" before locking a choice.
  Tags: `brainstormed` · `Film-for-TikTok` · effort `small`
  Design skills: not yet critiqued
  Notes: TikTok-worthy because the full-screen wash is visually dramatic in a 15s reel.

- **Ball-fill liquid-pour physics.** When the color is picked, the fill animates as a liquid pour from the top of the ball — not a crossfade, not a radial wipe. Matches the Liquid Motion System; makes the ball feel wet and alive.
  Tags: `brainstormed` · `Film-for-TikTok` · `Brand-reinforcement` · effort `medium`
  Design skills: not yet critiqued
  Notes: probably the single biggest fun-moment of the trip creation flow. *This is the money shot for TikTok and ASO screenshot 4.*

- **"Change this later" easter egg.** Triple-tap the "You can change this later" hint → the text briefly transforms into *"You can change this whenever you feel like it. I promise."* in the solo-dev warm voice. Then reverts.
  Tags: `brainstormed` · `Easter-egg` · effort `tiny`
  Design skills: not yet critiqued
  Notes: low marketing leverage individually, but easter eggs compound into "TripWave has these hidden little things" word-of-mouth.

### Feature: Step 4 — Reveal

- **Ball ripple ocean-wave reveal.** When the ball animates to center at hero size, three concentric ocean-ripple waves emanate outward — matching the logo and Pillar 1 ("Get everyone on the same wave") visualized *literally* at the user's first trip moment.
  Tags: `brainstormed` · `ASO-screenshot` · `Film-for-TikTok` · `Brand-reinforcement` · effort `medium`
  Design skills: not yet critiqued
  Notes: this IS ASO screenshot 2's visual content. Ship this and the ASO story arc has a native source asset.

- **Custom Fredoka kerning on the name.** The revealed "Meet [Trip Name]. Let's plan it." copy uses Fredoka display font specifically for the *trip name* — the surrounding "Meet" and "Let's plan it." stay in Nunito. Makes the name feel like it was lovingly hand-set, not injected.
  Tags: `brainstormed` · `Brand-reinforcement` · effort `tiny`
  Design skills: not yet critiqued

### Feature: Overall trip creation flow

- **Sassy first-time copy.** On a user's first-ever trip creation (account with zero prior trips), the Step 1 prompt becomes *"Let's name your first trip!"* — with "first" getting a subtle bounce animation as the page loads. Celebrates the commit moment without a modal.
  Tags: `brainstormed` · `Onboarding-ritual` · effort `tiny`
  Design skills: not yet critiqued
  Notes: cheap, high-retention. First-trip users are the ones who need the warmest welcome.

- **Progress ghost.** Behind the main flow, a very faint ghost-ball sits in the page margin — 0% fill during Step 1, 25% after, 50%, 100% by Step 4. Gives subconscious progress feedback without violating the UX_SPEC "no per-step numbering or progress bar" rule.
  Tags: `brainstormed` · `Micro-polish` · effort `small`
  Design skills: not yet critiqued
  Notes: check with `/design-critique` — might conflict with the intended "fun ritual, not a process" framing.

---

## 4. Trip Workspace — Overview

*(to populate)*

## 5. Trip Workspace — Preplanning

*(to populate)*

## 6. Trip Workspace — Itinerary

*(to populate)*

## 7. Trip Workspace — Expenses

*(to populate)*

## 8. Trip Workspace — Travel Day

*(to populate)*

## 9. Trip Workspace — Members & Invites

*(to populate)*

## 10. Dream Mode

*(to populate)*

## 11. Premium & Supporter Moments

*(to populate)*

## 12. Marketing Surfaces

*(to populate)*

## 13. Retention Surfaces

*(to populate)*

## 14. Affiliate & Ads

*(to populate)*

---

## Idea graveyard

*Rejected ideas go here with a one-line reason. Kept so we don't re-propose them and so "why didn't we do this?" has a paper trail.*

- *(none yet)*

---

## Provenance

- **Structure locked:** 2026-04-20 (see `DECISIONS.md` entry of same date)
- **Populated:** per section, as brainstorming passes progress
- **Related docs:** `FEATURES.md` (canonical feature list, same section structure), `UX_SPEC.md` (where locked ideas get promoted), `DESIGN_SYSTEM.md` (where new motion / palette / interaction patterns graduate after `/design-system`)
