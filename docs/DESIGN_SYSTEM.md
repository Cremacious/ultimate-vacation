# Design System Direction

> **2026-04-24 — Charcoal palette is the final state**
>
> The charcoal dark palette is the shipped, canonical look for TripWave. It is not transitional. `/app` and `/app/trips/new` are the reference pages. All future pages follow this palette and layout system exactly.
>
> **Canonical surface values (what ships today and going forward):**
> - Page background: `#404040`
> - Primary cards: `#2E2E2E`
> - Nested panels: `#252525`
> - Inputs: `#1E1E1E`
> - Borders: `#3A3A3A`
> - Accent palette: cyan, pink, yellow, green, purple, orange (all six, used freely — see UI_COLOR_REFERENCE.md)
>
> Any references to a navy-tinted neon direction, `#15162A`, `#2A2B45`, or "restoration target" in this doc are **superseded**. Disregard them. The charcoal palette is the product.

> **2026-04-20 Naming Audit — see docs/NAMING.md**
>
> **"Trip ball" is internal docs vocabulary only.** It does not appear in user-facing copy. Color picker label: simply "Color." First-run poetic framing may reference *"glow"* (*"every trip has its own glow"*) but never *"ball"*. The ball is a visual, not a named thing, from the user's perspective. See NAMING.md for the full rename table.

This is not a final visual spec. It is the set of early design rules that keep the product coherent while we build.

## Design Goals

- retro-pop and electric without being a costume
- fun and functional in equal measure
- rich dark surfaces with vibrant multi-color elements as foreground energy
- circles and rounded forms as a recurring design language
- sassy in copy everywhere -- not just headlines

## Brand Slogan

**"Get everyone on the same wave."**

This is the official tagline. It lives near the logo, in marketing materials, and in onboarding. It speaks to the group coordination core of the product and ties directly to the TripWave name and ocean wave personality.

The primary marketing headline (used in the hero section) is separate from the slogan:

**"Plan the trip. Not the group chat."**

These two lines serve different purposes. The headline creates instant recognition of the pain. The slogan anchors the brand identity.

## Voice & Tone

TripWave's copy voice is a **chill surfer who's genuinely hyped for you.** Not a productivity app. Not a hype machine. That friend in the group chat who gets everyone excited, keeps it light when logistics get stressful, and never makes you feel behind or guilty.

### Core rules

- **Encouraging, never pushy.** Frame everything as possibility, not obligation. "Go somewhere" not "you haven't booked yet."
- **Short and punchy.** One or two lines max for empty states and helper text. Surfers don't ramble.
- **Casual grammar is fine.** Fragments, ellipses, starting with "and" or "but" — all good.
- **Enthusiasm through word choice, not punctuation.** Exclamation points sparingly. Let the words do the work.
- **Zero guilt framing.** Never "you haven't added anything yet." Just a nudge and good vibes.
- **No em dashes in copy.** Never use "--" or "—" in any user-facing text. Use a period, a comma, or restructure the sentence.

### Voice samples by surface

| Surface | Copy |
|---|---|
| No trips yet | "Nowhere to be yet. That's about to change." |
| Empty expense list | "No spending tracked. Either you're being real disciplined or the trip hasn't started yet. Either way, nice." |
| Empty packing list | "Nothing packed. Totally fine, you've got time." |
| Date not set | "Dates TBD. The best trips start with a vibe, not a calendar." |
| Trip just created | "Trip's live. Now let's fill it in." |
| Settled up / vaulted | "All settled. That one's in the books forever." |

### What this voice is NOT

- Not snarky or passive-aggressive (no Duolingo guilt trips)
- Not corporate ("Your dashboard is currently empty")
- Not over-the-top ("OMG you haven't added a trip yet!!!")
- Not using em dashes anywhere

---

## Visual Thesis

Trip planning should feel upbeat, confident, a little cheeky, and ready to go — inspired by the Go-Gos song Vacation energy applied to a dark-first product. The current app achieves this through a dark-gray shell (a transitional starting point, not the final look), a rainbow of accent colors across the phase nav, and warm copy throughout. Newer components like MetricCard and the Home page have already moved to the navy-tinted neon palette — intentional progress toward the intended look.

The **restoration target** (see Neon-on-Dark Brand Direction and Restoration Target) is richer: a navy-dark base, brighter neon accents, and a layered depth hierarchy that makes every color element pop. That is the direction TripWave is still actively moving toward.

**What is true now and should stay true:** this is a dark-first product. It is not a dark mode. The dark base is the neutral — white is the accent, not the background. Accent colors (cyan, yellow, pink, green, orange) do the personality work against the dark surfaces. That is the current UI and it should remain dark-first as the product evolves.

## Aesthetic Rules

- deep rich surfaces are the base -- color pops because of the depth, not despite it
- this is not a flat dark theme -- surfaces layer (base, card, panel, modal) with clear depth hierarchy
- brand colors (cyan, yellow, pink, green, orange) are used freely on dark backgrounds as text, labels, icons, and borders
- white is a high-contrast accent, used for primary body text, active states, and maximum-emphasis moments -- not as fill
- circles are the primary decorative motif: decorative splashes, background dots, pill shapes, round avatars, circular indicators
- let vibrant typography and icon color do the work -- do not over-detail surfaces

## Color Direction

### Surface palette [CURRENT TRANSITIONAL VALUES]

The current transitional surface hierarchy (what ships today — not the final target):

- **Shell/page background**: `#444444` / `#4a4a4a` — dark gray. Transitional value, not the intended end state.
- **Top nav**: `#171717` — very dark, near-black. Creates clear separation from the page background.
- **Sidebar**: `#202020` — dark gray, one step lighter than the nav.
- **Content cards (Overview, action panels)**: `#2e2e2e`–`#333333` — raised above the page background.
- **Newer nav-adjacent components** (MetricCard, trip list, Home page): `#15162A` / `#1D1E36` — these already use a navy-tinted dark that is closer to the aspirational direction.
- **Borders (older components)**: `#3a3a3a`–`#404040` — neutral dark.
- **Borders (newer components)**: `#2A2B45` — subtle, slightly blue-tinted.

The surface hierarchy (nav darker than page, sidebar slightly lighter than nav, cards raised above page) is implemented and working. The specific values are dark gray–dominant, not the navy-tinted direction described in the Neon-on-Dark section below.

**Restoration target:** surface passes should move toward a navy-tinted dark (`#0F1724` shell, `#15162A` cards, `#2A2B45` borders). Some components are already there. This is an active restoration target — restore surface-by-surface using specific component references, not global token rewrites.

### Accent palette [CURRENT + FORWARD DIRECTION]

**Currently implemented values:**
- **cyan-blue**: `#12b8e8` / `#00b8e6` — mid-tone cyan used for the logo wordmark, account avatar, active links. Not neon; designed for legibility on dark gray.
- **phase colors (nav)**: diverse rainbow implemented in TripSideNav — Overview `#12b8e8`, Setup `#8e7cff`, Preplanning `#00d4ff`, Itinerary `#7eb6ff`, Packing `#ffd400`, Travel Day `#ff4fa3`, Vacation Day `#00c96b`, Expenses `#00d26a`, with orange/purple/pink variants for extra phases.
- **newer component accents**: MetricCard, HomeTripList, and Home page already use brighter variants (`#00E5FF`, `#FFEB00`, `#FF3DA7`, `#39FF6B`) — these components were built closer to the aspirational neon palette.

**Role rules (apply across both current and forward values):**
- **cyan-blue** -- primary action color, active state, links, key labels
- **hot yellow** -- energy accent, badges, highlights, celebration moments (`#FFD600` / `#ffd400`)
- **electric pink** -- secondary accent, invitation moments, personality touches (`#FF2D8B` / `#ff4fa3`)
- **green** -- exclusive to financial and expense contexts (`#00C96B` / `#00d26a`). Nowhere else.
- **orange** -- travel day actions, secondary accents. Not a primary color.
- **white / near-white** -- primary body text, active item labels, maximum contrast moments. Not a background fill.

### Color use rules

- dark surfaces are neutral -- they do not compete with the accent palette
- cyan is the go-to for primary buttons, active nav items, links, and key UI actions
- yellow is for badges, fun callouts, and celebratory moments
- pink is for secondary accents and personality touches
- green is reserved entirely for money, expenses, and financial contexts -- nowhere else
- orange is for travel day task completion circles and secondary accents
- white text sits on dark surfaces for primary body copy -- it is crisp and readable, never washed out
- multiple accent colors can coexist on a single dark surface -- the dark base is the unifier
- never use a light or white surface as a large background fill in the app UI
- marketing surfaces (landing page, pricing) may use more light moments -- product surfaces stay deep

### Avoid

- large expanses of white or near-white in the app UI
- sandy, tropical, or beachy styling
- pure black (#000000) as the only background — pure black flattens the hierarchy; a near-black navy (`#0A0A12` / `#0F1724`) provides the correct depth
- going so neon that the palette feels chaotic — the dark base is what makes accent colors readable
- mid-tone or neutral backgrounds that erase the darkness of the product (it must always read as a dark-first app, not a washed-out gray)
- treating the current dark-gray shell (`#444444`/`#4a4a4a`) as the permanent surface color — it is transitional; restored surfaces should move toward the navy-tinted target palette, not stay on the gray values
- flat, neutral dark surfaces with no cool tint — the intended depth hierarchy uses a subtle blue-black, not plain dark gray

## Action Circle Color Language

When users take meaningful actions, small colored circles animate into the trip ball. This is the action circle system -- it ties every user action back to the trip character and makes the ball feel like a living record of everything that happened.

### Color assignments

- **Green circles** -- expense logged or updated (financial actions)
- **Cyan-blue circles** -- itinerary item added or confirmed
- **Yellow circles** -- packing item checked off
- **Pink circles** -- participant joined the trip
- **Orange circles** -- travel day task completed

### Animation behavior

1. User takes an action (e.g., logs an expense)
2. A small circle of the corresponding color appears near the point of action
3. The circle travels to the trip ball and enters it with a satisfying merge
4. The trip ball responds with a brief ocean-wave pulse
5. The ball returns to its idle state, slightly more full or alive

This system makes the ball feel earned and turns every action into a small moment of delight.

### End-of-trip circle breakdown

At trip wrap-up and in the memory vault, the ball "opens" and all the accumulated circles expand outward in a visual breakdown. Each category of circles forms its own cluster:

- green cluster shows total expenses and financial summary
- blue cluster shows itinerary coverage
- yellow cluster shows packing completion
- pink cluster shows who was part of the trip
- orange cluster shows travel day execution

This is the most shareable visual the app produces. Design it to be screenshot-worthy.

## Typography Direction

### Fonts

- **Fredoka** -- display and headline font (Google Fonts, variable weight 300--700)
- **Nunito** -- UI and body font (Google Fonts, variable weight 200--900)

### Fredoka usage rules

- **Weight 600 (SemiBold)** -- app title, hero headlines, large display moments, trip names
- **Weight 400 (Regular)** -- smaller section headings, subheadings, phase labels
- Never use Fredoka below heading level -- Nunito owns all body and UI copy

### Nunito usage rules

- **Weight 700 (Bold)** -- UI labels, button text, emphasis
- **Weight 600 (SemiBold)** -- card titles, secondary labels
- **Weight 400 (Regular)** -- body copy, descriptions, paragraph text
- **Weight 300 (Light)** -- captions, helper text, timestamps

### General type rules

- let Fredoka do the personality work at large sizes
- keep Nunito clean and readable at small sizes
- compact uppercase labels are fine in Nunito for utility moments
- no decorative or script typefaces anywhere in the product
- inside dark bento cards, text should always feel proportional to the card size -- do not use 10px or 11px text inside a card that has room for 13px or larger
- stat numbers (travelers, duration, budget) inside solid-color or dark cells should be large enough to dominate the cell -- these are the message, not an annotation

## Shape and Form Language

- circles and pill shapes are the primary recurring forms
- buttons are pill-shaped
- avatars and member indicators are always circular
- background decorative elements use circles and dots in various sizes and opacities
- sharp right angles should be rare -- almost everything should have rounding
- this is not a grid-of-squares app
- **bento tile outer corners are rounded rectangles with 16--24px border radius** (UX_SPEC § 42) -- circle primacy is preserved **inside** tiles via colored-circle icons, the trip ball, action circles, avatars, pill buttons, and tile-internal background circles

## Icon System

### Library

Use **Phosphor Icons** (`@phosphor-icons/react`) -- it has a fill variant for every icon, consistent geometry, and works well at all sizes.

### Style rules

- use the **fill** weight for navigation icons, phase indicators, and primary UI icons
- use the **regular** (stroke) weight for inline content icons and secondary UI moments
- icons should always be bold and readable -- no fine-detail icons

### Icon containers

Icons live inside **solid colored circles** in the brand palette. This is the primary icon treatment across the app:

- each trip phase gets its own assigned circle color (to be defined per phase)
- navigation items use icon-in-circle treatment
- badges, status indicators, and member avatars are all circular
- the circle container size scales with context -- small in nav, larger in feature cards

### Phase color assignments (working, not final)

- Setup -- cyan-blue circle
- Preplanning -- cyan-blue circle
- Itinerary -- cyan-blue circle
- Packing -- yellow circle
- Travel Day -- pink circle
- Vacation Day -- cyan-blue circle
- Expenses -- green circle
- Polls -- yellow circle
- Wrap-Up -- pink circle

These are starting points. Finalize when building the nav.

## Background Circle System

Circles appear as passive background decoration across the app UI. They are never interactive -- they exist purely to reinforce the design language and add warmth to dark surfaces.

### Three tiers of background circles

**Tier 1 -- Large atmospheric circles**
- Very large (300px--600px diameter or larger)
- Very low opacity (6%--12%) -- slightly more visible on dark than they were on white
- Positioned behind page sections, bleeding off screen edges
- Typical placement: top-right corner, bottom-left corner of a surface
- Colors: brand cyan, yellow, or pink depending on the page context

**Tier 2 -- Medium accent circles**
- Medium size (80px--200px diameter)
- Medium opacity (25%--45%) -- reduced from previous spec to stay tasteful on dark
- Partially cut off by screen edges -- never fully centered on screen
- Used in hero sections, onboarding screens, and empty states
- Add visual energy without competing with content

**Tier 3 -- Small dot patterns**
- Tiny dots (4px--8px)
- Arranged in scattered clusters or subtle grids
- Used in card backgrounds, section dividers, and quiet zones
- Low opacity (10%--20%)
- Provide texture without noise

### Circle placement rules

**Updated 2026-04-20 for bento-grid shell (UX_SPEC § 42).** The shell's no-empty-space rule means the page background is only visible in override states. Background circles now live at the tile level, not the page level:

- **Tier 1** (large atmospheric circles) live inside wide tiles -- primary tile on the dashboard, primary tile in large-screen Preplanning / Itinerary views. Maintain 6--12% opacity on dark; bleed off tile edges for the same atmospheric effect
- **Tier 2** (medium accent circles) appear only in override states (zero-trip first-run, Invite-landing, Trip Creation, Vaulted / Memory) where the page background is visible. Same 25--45% opacity rule
- **Tier 3** (small dot patterns) can appear in tile internals where they add texture to a quiet zone -- same 10--20% opacity

### General rules (apply in both tile-level and override-level placements)

- circles sit behind all content -- never in front of readable text or interactive elements
- the dark base keeps circles from overwhelming the UI -- they glow softly, not loudly
- use a maximum of two or three circles per tile or per override surface
- circles can overlap each other but not overlap primary content areas
- on standard bento pages, keep circles subtle -- tier 1 inside a wide tile is usually enough

## Page Background Treatment

**Scoped 2026-04-20 to four override states only.** The bento-grid shell (UX_SPEC § 42) follows a no-empty-space rule -- tiles fill the viewport, so the page background is never visible on standard authenticated pages. The radial gradient applies **only to four of the five bento override states**: Travel Day focus mode, Vaulted / Memory view, Invite-landing (unauthenticated), and Trip Creation ritual. **Zero-trip first-run uses the deep base `#0A0A12` dark background** -- it is the user's first brand impression, and the brand is neon-on-dark.

On standard bento pages, the shell root uses the deep base (`#0A0A12`) as the only visible "background" -- seen only in the thin gaps between tiles -- and the radial gradient does not apply.

### Override-state rules

When the page background is visible (the five override states above):

- the center of the page background is white or very light
- edges and corners fade to a medium-dark gray (around #787878 or darker)
- the gradient is radial, centered on the viewport, not directional
- this background sits beneath dark cards / content, providing contrast without competing
- marketing surfaces follow their own background rules

### Why this works in override states

The override states are visually different from the bento by design -- collapsing the shell lets the page background become a legible "floor" where the override's single focused content sits on top. On standard bento pages, the tiles themselves form the floor, and the gradient is not needed.

## Bento Grid System

The bento grid is TripWave's canonical layout language at two scales: the **shell-level bento** (the full-viewport desktop shell locked in UX_SPEC § 42) and the **page-level bento** (data-rich views and edit forms inside a tile's primary slot).

### Shell-level bento (UX_SPEC § 42)

The desktop shell is a full-viewport bento grid with six durable named slots (seven on the free tier). Applies to all authenticated trip workspace and non-trip pages except the five overrides (Travel Day focus mode, Vaulted / Memory, Invite-landing, Trip Creation, Zero-trip first-run).

**Outer slots (fixed geometry, never changes across phases):**

| Slot | Purpose |
|---|---|
| `nav-column` | Stacked phase cards (trip workspace) or trip cards (non-trip pages), left full height |
| `trip-ball` | Prominent ball card at current fill % |
| `context-panel` | Next best action + blockers, always present, never disappears |
| `primary` | Largest tile, phase-specific content |
| `quick-add` | Log Expense / Create Poll / Scavenger Hunt challenge toolbar |
| `activity-feed` | Recent state-change log |
| `ad-banner` *(free tier only)* | Native sponsored card; premium users see this reclaimed for breathing room |

**Rules:**

- the outer grid geometry never changes when switching phases -- only the `primary` tile's inner sub-layout reshapes
- no empty space -- tiles fill the viewport at every desktop size via CSS Grid + container queries
- large-scale UI throughout (see Large-Scale UI Type Scale section)
- tile outer corners use 16--24px border radius (preserves circle / roundness vocabulary)
- interactive tiles use the existing 3D ledge treatment; passive tiles (trip-ball, activity-feed, context-panel) do not
- all tile motion composes from the Liquid Motion System -- no new primitives needed

See UX_SPEC.md § 42 for full shell spec including mobile pill bar, top bar contents, trip switcher, notification bell, account avatar dropdown, global search, and override states.

### Page-level bento (inside the primary tile)

Data-rich pages use a bento grid inside the `primary` tile instead of a vertical list of cards. Bento grids place different-sized cells in a CSS grid, letting important data occupy more space and secondary data occupy less.

### When to use page-level bento

- any page that shows a summary view of structured trip data (Setup, Preplanning summary, trip overview)
- any edit form with heterogeneous field types (some fields simple, some multi-select, some numeric steppers)
- do not use bento grid for linear workflows, step-by-step wizards, or content-heavy text areas

### View page bento vs edit form bento

View and edit pages for the same data should use different bento layouts. They are not the same grid with inputs swapped in.

- the view grid is more visual: large stat cells for numbers, hero cell for the trip name and key context
- the edit grid is more functional: cells sized to match their input complexity, not their data importance
- the most important data point (trip name, key stat) gets a large cell in both layouts, but for different reasons

### Standard bento grid column pattern

For a trip data summary page (like Setup view):

- three columns: `2fr 1fr 1fr`
- hero cell spans the full left column across two rows
- stat cells (duration, travelers, budget) occupy the right two columns, one per cell
- bottom row spans all three columns and is subdivided into 2 or 3 equal sub-cells

For an edit form:

- two columns: approximately `1.4fr 1fr`
- full-width cells for the most prominent field (trip name)
- left column for destination and transport fields
- right column for dates and character fields
- full-width bottom row for stepper, numeric, and picker fields

### Cell sizing philosophy

Cells do not have fixed heights. CSS grid auto-sizes rows based on content. Short cells (stat numbers) will be shorter than tall cells (destination lists). This is correct behavior. The stat cells fill their available space using large typography, not by adding padding.

## Card UI Scale Rules

All content inside dark bento cells must be sized to fill the cell visually. The goal is that a card with only two lines of content should not look empty. Scale up the typography and UI elements until the content feels proportional to the card.

### Minimum sizes inside dark cards

These are hard floors, not starting points. Go larger when the card has room.

| Element | Minimum size |
|---|---|
| Cell label (ALL CAPS header) | 13px, font-black, tracking-widest |
| Form input text | 16px (text-base) |
| Pill text (transport, type, vibe) | 14px |
| Transport/mode pill text | 15px |
| Hint or helper text | 14px |
| Sub-labels (DEPART, RETURN, etc.) | 12px |
| Stat numbers (duration, travelers) | clamp(56px, 6vw, 88px) |
| Budget display number | clamp(44px, 4.5vw, 68px) |
| Stat unit label (Days, Travelers) | 13px, font-black, uppercase |

### clamp() for stat numbers

Stat numbers inside colored or dark cells use `clamp()` so they scale with the viewport instead of staying fixed. This keeps them filling the card at any reasonable screen width. The pattern is:

```
clamp(minimum, preferred-vw, maximum)
```

Example: `clamp(56px, 6vw, 88px)` is small enough for narrow screens, scales up on wider screens, and caps before becoming absurd.

### Pill padding scale

Pill-shaped buttons and labels inside bento cells should have generous padding relative to their font size:

- transport and mode pills: 10px top/bottom, 20px left/right
- type and vibe pills: 8px top/bottom, 16px left/right
- do not use cramped pill padding (4px/8px) inside dark cards

### Icon sizing inside cards

Icons inside pill buttons should be at least 16px. Icons inside colored circles that appear as standalone visual elements should be at least 16px, with a circle diameter of at least 36px.

### Cell padding

Dark bento cells use 24px (p-6) padding on all sides as the **standard bento band default**. This value scales with the container-query band (see Container-Query Bands section below):

- Compact mode (<900px, page-level bento inside primary tile only): 20px
- Small bento band (900--1279px): 20px
- Standard bento band (1280--1919px): 24px (matches original rule)
- Wide bento band (1920--2559px): 28px
- Ultra-wide band (2560px+): 32px

Do not use 16px cell padding -- makes cells feel cramped relative to their content.

## Large-Scale UI Type Scale

TripWave's shell uses a larger base type scale than standard productivity apps (which typically use 14--16px body text). The shell targets a **couch-group use case**: multiple people reading from across the room, laptop on a coffee table. Shoulder-readability is the baseline.

### Base shell type rules

- **Shell body text:** 18px Nunito 400 (applies to text inside bento tiles where no other rule takes precedence)
- **Tile section headers:** 20--24px Nunito 700
- **Phase card name in nav column:** 18px Fredoka 600
- **Phase icons in nav column:** 32--40px diameter (colored circle containers)
- **Trip ball in bento slot:** 140--200px diameter depending on container band
- **Touch targets everywhere:** 48px+ minimum

### Relationship to existing Card UI Scale Rules

Card UI Scale Rules still apply inside tile internals (stat numbers, pill padding, cell padding, minimum sizes inside dark cards). The shell type scale sets a higher **floor** for plain body content inside tiles -- 18px instead of 16px. Where Card UI Scale specifies 16px for form input text, that minimum still applies for inputs specifically.

### Headline moments

Large display moments (trip names on the dashboard Next Up hero, modal titles, zero-trip first-run tagline) use Fredoka 600 at much larger sizes -- `clamp(40px, 4vw, 72px)` is a good starting pattern for hero trip names, matching the existing clamp() philosophy for stat numbers.

### Why larger type at shell level

- couch-group legibility (2--3 feet viewing distance, multiple readers)
- neon-on-dark readability benefits from slightly bulkier weights and sizes
- the bento aesthetic depends on each tile feeling "full" -- small type in a large tile looks empty (reinforces the existing Card UI Scale rule that content must fill the cell)

## Container-Query Bands

TripWave uses **CSS container queries**, not media-query viewport breakpoints, to drive shell and tile layout. The shell root container's available width determines the mode; tiles reflow per band.

### Compact vs bento mode

| Mode | Trigger | Shell |
|---|---|---|
| **Compact** | Shell root <900px available width | Top bar + pill bar + stacked content (single column). Applies to phones (portrait + landscape), portrait tablets, and narrow desktop windows |
| **Bento** | Shell root >=900px available width | Full bento grid per § 42.1. Applies to landscape tablets >900px, laptops, all desktop sizes |

### Internal bento bands (tile-padding scale)

| Band | Width range | Tile padding | Notes |
|---|---|---|---|
| Small bento | 900--1279px | 20px | Compact tile heights, denser layout |
| Standard bento | 1280--1919px | 24px | Generous tile heights, slightly larger type |
| Wide bento | 1920--2559px | 28px | 7-slot grid, activity-feed expansion |
| Ultra-wide | 2560px+ | 32px | All tiles at max comfortable size; remaining space as padding, never leaves an empty band |

### Rules

- no hard viewport media queries anywhere in the shell layer
- the bento activates based on **container width**, not device type -- an iPad in landscape at 1180px gets Standard bento; a desktop user who resizes a window to 850px gets Compact mode
- page-level bento (inside a primary tile) may use its own container queries against the primary tile's width, nested inside the shell queries
- Travel Day focus mode override from UX_SPEC § 9 / § 42.13 supersedes these rules -- the override collapses the bento on both modes

## Phase Card Component [SPEC — PARTIALLY ASPIRATIONAL]

> **Current implementation note:** The current TripSideNav uses simpler nav rows (not full phase cards). The `#15162A` elevated dark surface and left-edge accent bar treatment described below is the intended design spec, not yet the shipped state. The active-state visual (colored fill, accent bar) and mini-status chip are goals for when the nav is refined. Use this spec as the implementation target when building or refining the sidebar.

Phase cards are the atomic unit of the desktop nav column's stacked-card layout. Each phase (Overview, Setup, Preplanning, Itinerary, Packing, Travel Day, Vacation Day, Expenses, Polls, Wishlist, Members, plus Memory when lifecycle state warrants) is a card, not a thin sidebar row.

### Anatomy

- **Surface:** `#15162A` elevated dark (all states -- active surface is NOT a full neon fill; see States below)
- **Corner radius:** 16px (preserves roundness vocabulary inside the bento grid)
- **Padding:** 16px (18px on the left to accommodate the active-state accent bar)
- **Contents:**
  - **Phase icon** in a colored circle, scales with container band (see Touch target and height)
  - **Phase name** in Fredoka 600, 18px -- white on default, neon phase-color on active
  - **Mini-status chip** in Nunito 600, 14px (e.g., *"Preplanning -- 40%"*, *"2 blockers"*, *"3 new"*)
  - **Recommended-phase badge** (optional) -- a small neon-yellow dot in the top-right corner, 8px diameter

### States

| State | Visual | Behavior |
|---|---|---|
| Default (inactive) | Elevated dark `#15162A` surface, white text, colored icon | Hover glow +25% over 200ms |
| **Active** | Elevated dark surface retained + **4px left-edge accent bar in the phase color** + phase name in phase-color (neon) + subtle wet-neon shimmer on the accent bar only (12s cycle) + icon's colored circle gains a faint outer glow | No hover change (already emphasized) |
| Recommended | Default + small neon-yellow dot top-right | As default |
| Focus (keyboard) | Default + 3px neon cyan focus ring with ripple from card center | Enter activates |
| Pressed | Water ripple from tap point at 30% opacity | Routes to phase |

**Rationale for left-edge accent over full neon fill:** a full neon-green/cyan/yellow fill on one card among ten dark cards reads as a "notification" rather than "you are here." The left-edge accent + phase-color label + icon glow provides equally strong navigational clarity while honoring the existing `Cards -> Neon accent strip` rule in the Neon-on-Dark section. Full neon fill remains reserved for CTA buttons and the primary-tile color-spill treatment. This change applies uniformly to all phase colors.

### Touch target and height (responsive per container band)

Entire card is tappable, no inner-only hit zones. Height scales with the container-query band so 11 phase cards + Settings icon fit without scrolling on 13" laptops (1280x720 effective):

| Band | Phase card height | Mini-status |
|---|---|---|
| Small bento (900--1279px) | **52px** | Compressed: icon + name only OR name + one-word status (e.g., "40%") |
| Standard bento (1280--1919px) | **64px** | Full: icon + name + mini-status chip |
| Wide bento (1920--2559px) | **72px** | Full + optional secondary chip |
| Ultra-wide (2560px+) | **80px** | Full + optional secondary chip |

All heights exceed the 48px accessibility floor. The Small bento compression is required because 11 cards x 64px = 704px and a 13" laptop's usable vertical space (1280x720 minus top bar and ad-banner gap) is ~660px. Scrolling the nav column would break the "map of the trip always visible" virtue of the bento.

Phase icon size also scales with band: 32px at Small, 36px Standard, 40px Wide/Ultra-wide.

### Accessibility

- ARIA role `link`, label reads *"[Phase name], [status chip content]"* -- e.g., *"Preplanning, 40 percent complete, recommended next"*
- Keyboard: Tab to focus, Enter to activate
- Active state never relies on color alone -- the filled background + shimmer + white text vs dark text are the distinguishing cues
- Phase-color icons also use the phase symbol itself (Phosphor fill) so users who can't distinguish the neon colors still parse the phase

### Do / Don't

| Do | Don't |
|---|---|
| Use the full phase color as background on active state | Use a thin outline or dot indicator only |
| Keep mini-status content genuinely informative | Show empty placeholder strings |
| Keep cards the same height as each other in the column | Vary card heights by content length |
| Route the whole card to the phase | Put multiple clickable inner zones |

## Color-Spill Tile Background

A micro-pattern used **only on the `/app` dashboard primary tile** to mark the Next Up trip with its ball color.

### Composition

- **Base layer:** `#15162A` elevated dark (standard tile surface)
- **Gradient layer:** the Next Up trip's ball color (one of the six neon accents -- cyan / yellow / pink / green / purple / orange) applied as a radial gradient at **8--15% opacity**
- **Gradient position:** radiates from the trip-ball side of the tile, typically top-left or wherever the giant trip ball sits in the layout
- **Falloff:** soft, extending ~70% across the tile before fading to the base
- **Optional living shimmer:** 12s cycle, 3--5% max opacity variation -- matches the Liquid Motion wet-neon treatment on key elements

### Rules

- **use only on the dashboard primary tile** -- do not propagate to nav-column trip cards, context-panel, or any other tile
- gradient opacity may vary per color: less-saturated colors (purple, orange) may need the lower end (8--10%) to avoid reading as "ambient haze" instead of brand moment; cyan / yellow / green can use the upper end (12--15%)
- white body text remains at 100% opacity -- color-spill never forces text color changes
- pure white body text on the spill gradient remains WCAG AAA (>=7:1) on all six neon accents at 15% opacity

### Why

The dashboard is where users re-enter the app and pick up their momentum. Marking the Next Up tile with its own trip color creates a visual bridge -- the tile *becomes* the trip the user is about to enter. Tapping the primary CTA flows visually from that color into the trip workspace, reinforcing the brand's liquid continuity.

## Shell Override States

Five override states collapse the bento into a purpose-specific layout. Overrides are exceptional, not routine -- any new page proposing a sixth override must go through GRILL_PROTOCOL.md.

| Override | When | Shell behavior |
|---|---|---|
| **Travel Day focus mode** | T-6 hrs auto-activation or manual activation (UX_SPEC § 9) | Full-viewport timeline; nav column hides; primary fills; top bar thins to ~36px but stays; ads suppressed |
| **Vaulted / Memory view** | Trip lifecycle state = Vaulted | Scrollable article-style Memory layout; top bar stays, every other slot collapses |
| **Invite-landing** | Unauthenticated visitor at `/invite/[code]` | Standalone landing-style card; no shell at all |
| **Trip Creation ritual** | `/app/trips/new` 4-step wipe flow | Full-viewport takeover; top bar collapses; dashed ball center stage |
| **Zero-trip first-run** | Brand-new user with zero trips at `/app` | Full-viewport centered empty state |

### Shared justification

Each override has a fundamentally different job than "plan a group trip inside a workspace":

- **Travel Day:** execution under real stress. Calm > chrome.
- **Vaulted:** browsing a frozen story. Nostalgic narrative > navigation.
- **Invite-landing:** converting unauthenticated visitors. Landing-page clarity > workspace chrome.
- **Trip Creation:** the ritual moment. Stage > frame.
- **Zero-trip first-run:** no data exists. Focused welcome > empty bento.

On standard bento pages, none of these overrides apply -- the full bento persists.

### Entrance and exit motion

Override transitions use the existing Liquid Motion System wave sweep (600ms) -- same primitive as route changes. On exit, the bento re-inflates with the previous page's slot contents.



## Surface Strategy

- the app shell background uses the deep base -- no content lives directly on it, it is the floor
- cards and panels rise off the base surface using the raised or elevated surface tones
- glass effects work well on dark surfaces -- a subtle blur and border on a raised card looks natural
- shadows on dark are more nuanced -- use lighter inner glows or colored border accents instead of heavy drop shadows
- key panels feel stacked and tactile, not perfectly flat
- marketing surfaces (landing page, pricing) can use more contrast between dark and light sections, but product surfaces stay consistently deep

## 3D Material Rules

- use bottom-edge ledges on important cards, panels, pills, and buttons
- 3D treatment feels like a crisp physical layer, not skeuomorphic plastic
- on dark surfaces, button ledges use a darkened version of the button color (e.g., a cyan button has a deep teal bottom lip)
- important cards use a shallow ledge plus a subtle border highlight on the top edge to simulate lifted depth
- inputs on dark surfaces use a slightly lighter background than the card they sit on, with a colored focus ring in cyan on focus
- reserve the strongest 3D effect for primary actions and key surfaces

## Motion Direction

- soft entrance motion
- small hover lift on interactive surfaces
- phase transitions should feel smooth and directional
- action circles travel to the ball with a fluid arc -- not a straight line
- ball pulse is ocean wave rhythm -- slow, organic, never mechanical
- motion should help orientation, not distract from tasks

## Neon-on-Dark Brand Direction

> **This section is the restoration reference for surface passes.** The current app's dark-gray shell (`#444444`) is a transitional state — the intended end state is the near-black navy and neon palette specified below. The color values here (`#0A0A12`, `#00E5FF`, etc.) are the active targets. Some newer components (MetricCard, Home page) have already adopted values from this palette as intentional restoration progress.
>
> **How to use this section:** when restoring a surface, look up what this section specifies for that surface type and apply those values to the specific component being worked on. Do not do broad global token rewrites. Do not change every surface at once. Match each restored surface to its nearest reference surface in this section.

TripWave's visual direction is **neon rainbow accents against near-black backgrounds with pure-white text**. This is the aspirational brand treatment. The whole product should eventually read as fun, premium, and distinctive against a sea of white-and-cyan travel apps.

### Why neon on dark

- Trip balls glow dramatically against dark backgrounds -- turns the product's central visual into a light source
- Neon accents in rainbow feel celebratory and match the "fun" emotional brief
- Dark + neon reads premium. Every high-end indie tool (Linear, Raycast, Framer, Arc) uses this direction
- White-on-dark eliminates the "accessibility-weak gray text" problem that plagues light-mode UIs
- Distinctive from direct competitors (TripIt is blue-on-white, Wanderlog is colorful-on-white, Visited is white)

### Color palette

#### Surfaces

- **Base dark**: `#0A0A12` (near-black with subtle cool tint) -- primary background for almost everything
- **Elevated dark**: `#15162A` (slightly lighter card surface)
- **Card on dark**: `#1D1E36` (for layered surfaces)
- **Border on dark**: `#2A2B45` (subtle dividers)

#### Text

- **Primary text**: `#FFFFFF` pure white, never muted to gray
- **Secondary text**: `#D1D2E8` soft cool-white (used sparingly, only for truly tertiary metadata)
- **Disabled text**: `#6C6E8A` (rare use)

#### Neon brand accents (the rainbow)

- **Neon cyan**: `#00E5FF` (replaces the previous `#00A8CC` as the brand primary)
- **Neon yellow**: `#FFEB00` (replaces `#FFD600` -- brighter under dark)
- **Neon pink**: `#FF3DA7` (replaces `#FF2D8B`)
- **Neon green**: `#39FF6B` (replaces `#00C96B`)
- **Neon purple**: `#B14DFF` (NEW -- fifth rainbow accent, used for Dream Mode and special bonus moments)
- **Neon orange**: `#FF9236` (NEW -- sixth accent, used for energy/travel-day urgency)

#### Legacy light-mode colors

The previous `#00A8CC` / `#FFD600` / `#FF2D8B` / `#00C96B` palette was designed for white backgrounds. They are deprecated as primary brand colors but may appear in reduced-saturation form inside specific contexts (e.g., printable trip export PDFs that need to work on paper).

### Text rules

- Body and UI text is pure white (`#FFFFFF`)
- Never use gray-muted body text on dark backgrounds -- readability always beats style
- Fredoka display headlines stay white with optional neon-color accent on a single key word
- Nunito body text stays white at 100% opacity; use size and weight for hierarchy instead of color fading
- Links use the appropriate neon accent color for their context (cyan for generic navigation, phase-color for phase-specific links)

### Glow and shadow behavior

- Neon elements often have a subtle outer glow (CSS `box-shadow: 0 0 24px [neon-color]40`) to suggest light emission
- Glow intensity scales with importance -- CTA buttons glow more than regular links
- No glow on body text -- only on accent elements (balls, buttons, icons, active states)
- On hover: glow strengthens ~25% for a brief 200ms, then settles

### Where neon accents apply

- Trip ball colors (all neon palette now)
- CTA buttons (neon cyan or yellow background with dark text for contrast)
- Icons in active navigation states
- Category indicators (expenses green, packing yellow, travel pink, etc.)
- Notification badges
- Ripple logo animations
- Focus rings on inputs

### What stays neutral

- Base page backgrounds
- Card surfaces (elevated dark, not neon)
- Body text
- Borders and dividers
- Inactive navigation items (white at reduced opacity, not neon)

### Specific surface treatments

#### Buttons

- Primary CTA: neon cyan background, charcoal text, subtle glow, bold Fredoka label
- Secondary CTA: transparent background with neon border, white text, glow on hover only
- Destructive: neon pink background, white text
- Disabled: charcoal gray background, muted text, no glow

#### Inputs

- Dark elevated background (`#15162A`)
- White text
- Border transitions to neon cyan on focus with a soft glow ring
- Placeholder text at `#6C6E8A`

#### Cards

- Elevated dark background
- Soft outer shadow for depth (standard `box-shadow: 0 4px 16px rgba(0,0,0,0.4)`)
- Neon accent strip (left edge, top edge, or icon tint) to signal category when relevant

### Mobile consideration

Dark backgrounds save OLED battery on modern phones. Neon colors may appear slightly more saturated on OLED than on LCD -- the palette is tuned for OLED-first, which is most of the target audience.

### Accessibility

- All white-on-dark combinations pass WCAG AAA (7:1 contrast ratio)
- All neon-on-dark combinations pass WCAG AA for large text and UI elements
- Never place neon text on neon background (low contrast, unreadable)
- Focus states remain highly visible -- neon cyan ring at ≥3px width

### Light-mode fallback

- Not offered in v1. The dark neon direction IS the brand
- May be added later purely as a user preference for those who insist, but not marketed
- If added: the neon palette desaturates ~40% and the near-black becomes an off-white (`#FAFAFA`), text becomes `#0A0A12`

---

## Liquid Motion System -- Wet Neon, Oil Flow, Water Waves [ASPIRATIONAL — NOT IMPLEMENTED]

> **This section describes a motion system that has not been built.** The current app uses basic CSS transitions (tw-animate-css) with no systematic ripple, wave, or oil-flow treatment. The easing curves, ripple effects, wave sweeps, and shimmer animations described below are a future design goal. Implement individual pieces incrementally as surfaces are built — do not treat this section as a description of the current app's behavior.

The neon in TripWave should feel like **wet paint** -- rich, glossy, capable of dripping. Motion is **oil-slick fluid** -- slippery, never mechanical. Interactions ripple like **water surfaces**. This motion system is a design aspiration: every animation, transition, and state change should eventually honor these rules. The name is "TripWave" -- the whole product should move like a wave.

### Core motion principles

1. **Nothing snaps.** No instant state changes. Every transition eases.
2. **Everything flows.** Motion follows water-like physics -- gravity subtle, settles gentle.
3. **Edges ripple.** Any contact point (tap, click, focus) produces a soft ripple outward.
4. **Neon shimmers wet.** Bright accents have the faintest living gradient or shimmer, like paint still drying.
5. **Subtlety over spectacle.** Motion is ambient. If a user notices the animation itself, it's too loud.

### Neon color treatment (wet paint look)

Neon elements are rendered with subtle depth to suggest wet, glossy paint:

- **Base**: solid neon color
- **Highlight**: a faint 1-2px inner top-light giving a "wet sheen" (very subtle -- 10-15% lighter than base, gradient from top-20% of the element)
- **Edge glow**: outer glow at 30-40% opacity of the base color, soft radius
- **Living shimmer** (on key elements only -- CTA buttons, active states, the trip ball): a slow animated linear gradient that drifts across the neon fill, 8-12 seconds per cycle, barely perceptible unless stared at

Elements that get wet-neon treatment:
- Primary CTA buttons
- The trip ball (all states)
- Active navigation states
- Focus rings on inputs
- Progress indicators

Elements that stay flat neon (no shimmer):
- Small category dot indicators (too small for shimmer to register)
- Text accents in a single word of a headline
- Icon tints
- Border strokes

### Oil-flow transitions (easing curves)

Default easing for all transitions in the app:

- **Standard ease**: `cubic-bezier(0.22, 0.68, 0.28, 1)` -- strong start, long easing tail, settles like oil spreading
- **Entrance ease** (elements appearing): `cubic-bezier(0.3, 1.5, 0.5, 1)` -- slight overshoot then settle, like a droplet landing
- **Exit ease** (elements leaving): `cubic-bezier(0.6, 0, 0.9, 0.4)` -- accelerates away, fading like ink dissolving
- **NEVER use**: linear (mechanical), ease-in-out (too symmetric, feels digital), or spring-bounce (feels toy-like)

Default transition durations:

- **Micro** (focus ring, hover lift): 200ms
- **Small state change** (checkbox toggle, tab switch): 300ms
- **Card or modal entrance**: 400-500ms
- **Page transitions / big reveals**: 600-800ms

### Ripple effect (tap / click feedback)

Every tappable element produces a water-like ripple on interaction:

- Origin: the exact tap / click point
- Shape: circular, expanding outward
- Color: the element's accent color at 30% opacity
- Scale: from 0 to ~2x the element's larger dimension
- Duration: 600ms
- Easing: ease-out (starts fast, decelerates as it spreads)
- Opacity: starts 30%, fades to 0 by end of animation

Elements that produce ripples:
- Buttons
- List items
- Cards
- Navigation items
- Checkboxes (ripple plus the particle burst already specced for packing)

Elements that do NOT ripple:
- Text links (too small, cluttered)
- Input fields (focus ring glow handles feedback)
- Disabled states

### Wave / flow transitions (between pages and states)

Page-level and section-level transitions use a **wave sweep** rather than a straight fade:

- **Direction**: left-to-right (or top-to-bottom for vertical contexts)
- **Shape**: soft diagonal leading edge, ~15-20% of the viewport width
- **Effect**: old content fades as the wave passes over it; new content fades in behind the wave
- **Duration**: 600ms
- **Feel**: like a wave crossing a beach, leaving the new scene behind it

Where wave transitions apply:
- Trip creation step-to-step wipes (already uses this -- confirmed here)
- Tab switches within a page
- Route changes where a visual-hero element persists (e.g., ball docks from landing to corner)

Where simple fade is used instead (lighter weight):
- Modal open / close
- Toast appear / dismiss
- Notification panel open

### Ball motion as the signature movement

The trip ball's motion is the archetypal example of the liquid system:

- **Wave pulse**: 3.6s ease-in-out, scale 1.0 → 1.06 → 1.0, opacity 1.0 → 0.88 → 1.0. Slow, organic, always breathing
- **Fill animation**: liquid-rising curve, ease-out, 2 seconds from 0% to 100%. Fill edge has a subtle wave shape (1-2px sine curve) as it rises, matching the "water level" metaphor
- **Roll**: ease-out with spring settle, ball rotates while translating, as if physically rolling across a surface
- **Celebration pulse**: single ease-out bloom from 1.0 → 1.12 → 1.0 over 600ms, glow doubles briefly at the peak

### Hover / focus glow behavior

All interactive elements brighten slightly on hover or focus:

- **Hover**: glow intensity +25% over 200ms, stays up until cursor leaves, then eases back down over 200ms
- **Focus** (keyboard navigation): glow intensity +35%, plus the neon cyan focus ring appears with a small ripple from the element's center
- **Active** (pressed): glow intensity +50% for the pressed moment, then settles back

### Loading states as flowing waves

When content is loading, the placeholder uses a gentle left-to-right wave shimmer:

- Background: dark elevated surface
- Shimmer: faint neon-cyan gradient (10-15% opacity) sweeps left-to-right every 1.5 seconds
- Not a pulse, not a spinner -- a flowing wave sweep
- Used in: skeleton loaders for lists, cards, and detail views

### Scroll physics

- Momentum scrolling standard (native behavior)
- At viewport edges during bounce scroll (iOS / mobile browsers): a subtle cyan ripple emanates from the scroll boundary, fading as the bounce returns
- No parallax on background elements (performance cost, and conflicts with the calm ambient direction)

### Exclusions from liquid motion

Focus mode (travel day execution) explicitly *reduces* liquid motion -- users are stressed, and too much ambient animation becomes distracting. Per section 38 of UX_SPEC:

- No background gradient drift
- Fewer per-element shimmers (static neon instead)
- Transitions shortened to ≤500ms
- No idle ambient animation

### `prefers-reduced-motion` behavior

For users who prefer reduced motion:

- Wave pulse on the ball slows to a 6s fade-only cycle (no scale change)
- Ripples on tap are disabled entirely -- replaced with a 150ms opacity pulse
- Page transitions become simple fades (no wave sweep)
- Living shimmer on neon disabled (flat color only)
- Loading shimmer waves replaced with a calm 2s opacity pulse

### Why the liquid motion system matters

- The app is called **TripWave** -- the motion literally names the brand
- Ocean / water imagery ties together the logo (ocean ripple), the slogan (*"Get everyone on the same wave"*), the ball (fills like liquid rising), and the motion system
- "Wet paint / oil flow" neon differentiates TripWave visually from competitors who use flat neon (Linear, Framer) or hard-edged digital glow (Raycast)
- Subtle liquid motion makes the app feel **alive** without feeling **busy** -- the target emotional register

### Implementation notes

- CSS custom properties for the easing curves and durations (centralized, easy to tune)
- Pseudo-elements for ripple effects (no extra DOM nodes)
- `will-change` sparingly -- only during active animations to avoid GPU memory bloat
- All animations respect `prefers-reduced-motion` via a single media query wrap
- Performance budget: no page should exceed 16ms per frame during idle ambient animation

---

## Logo -- Ocean-Ripple Animation

The TripWave logo is a **filled cyan circle with soft ripples radiating outward**. The ripples are ocean-feel, not electronic/radar/sonar. Animation fidelity matters here because the logo IS the brand identity.

### Animation spec

- Filled cyan (`#00A8CC`) circle at the center, static (no pulse on the core)
- 2 concentric ripple rings expanding outward from the center
- Each ripple scales from 1.0x to 3.0x while fading opacity from 0.5 to 0
- Ripple duration: 2.2 seconds (slow and calm)
- Rings are staggered by 0.8 to 1.1 seconds so a new ring begins as the previous one is mid-expansion
- Easing: `ease-out` (starts with energy, slows at the edges -- like a water ripple dissipating)
- Ripple color inherits from the core circle color

### What makes it feel ocean, not electronic

- **Slow timing** (2.2s) -- electronic/sonar pulses are 0.5-1s. Ocean ripples take their time
- **Soft easing** (ease-out) -- electronic ripples use linear or ease-in-out, which feels mechanical
- **Soft opacity fade** -- not a hard edge crossing a threshold. The ripple dissolves into the surface
- **Slight stagger (not perfect metronome)** -- optionally vary delay by ±0.1s for natural rhythm. Electronic ripples fire on exact beat
- **Cyan + white** color palette matches water; avoid green or high-saturation colors
- **No glow/bloom** -- clean edges, no electric shimmer

### Where the animated logo appears

- Top navigation (small, next to *TripWave* wordmark)
- Auth pages (medium, centered above login/signup cards)
- Marketing footer (small, next to wordmark)
- Splash screen on app launch (large, full animation cycle)
- Landing page hero (medium, paired with the trip ball)

### Where the STATIC logo appears

- App Store / Play Store icon (platforms require static)
- Favicon
- Social share metadata images
- Print / email / external contexts where animation is impossible

### Accessibility

- `prefers-reduced-motion`: reduces ripple frequency to one ring every 4 seconds, maintains visibility but minimizes motion
- Never auto-plays without a subtle loop (no sudden start/stop)

## Social Layer Visual Rules

The app has a lightweight social layer throughout: comments, likes, and favorites on most content items.

### Reactions and likes

- a simple heart or thumbs-up reaction is shown inline on items that support it
- reaction count is always visible
- tapping your own reaction toggles it off
- reactions animate with a brief pop -- small, satisfying, not overdone

### Comments

- comments appear below the item they belong to
- newest comments shown first in global views, oldest first in item detail view
- commenting supports plain text only -- no formatting in comments
- comment author, timestamp, and a like on the comment itself are shown
- long comment threads collapse with a "show more" control

### Favorites

- a bookmark or star icon appears on items that support favoriting
- favorites are personal -- not shared with the group
- a favorites list is accessible from the user account area and from within the trip
- favorited items are visually marked with the icon filled in
- good candidates for favoriting: itinerary events, wishlist items, notes posts

## Notification System Visual Rules

### In-app notifications

- a bell icon lives in the top nav on all versions (web and native app)
- unread count shown as a badge on the bell
- tapping opens a notification list panel or page
- notifications are grouped by trip when the user has multiple trips

### Notification list item anatomy

- trip name (if multi-trip context)
- actor name and action ("Sam commented on Museum Day")
- timestamp
- a tap navigates to the relevant item
- unread notifications have a subtle highlight; read ones are plain

### Push notifications (native app only)

- push notifications use the same triggers as in-app notifications
- web version has no push or email notifications for social actions
- Resend handles transactional email only: password reset and invite delivery

## Copy Direction

### Brand tone

- fun first
- sassy but never mean
- cheeky and confident
- capable and reassuring underneath the attitude
- a little bossy in a way that makes you laugh and then do the thing

### Copy rules

- sassy copy lives everywhere -- not just headlines but labels, tooltips, button text, empty states, and confirmation messages
- headlines can have big attitude
- product instructions must stay genuinely clear -- wit never beats clarity
- empty states should feel helpful and lightly witty, not just clever
- avoid trying too hard to sound funny -- the best lines feel effortless
- copy can gently roast disorganization, never the user
- the product should sound like the friend who already has the itinerary memorized and is still somehow fun to travel with
- example empty state energy: "Nothing packed yet. Your future self is disappointed but still rooting for you."
- example button energy: "Let's go." not "Submit"

### Hard grammar rules

- **Never use an em dash (--) anywhere in the app.** Not in UI copy, tooltips, notifications, error messages, empty states, button text, marketing copy, or documentation. Use a comma, a period, or rewrite the sentence. This rule has no exceptions.
- Use plain conversational language -- no corporate jargon
- Contractions are encouraged -- they feel human
- Sentence case for everything except brand proper nouns

## UX Rules

- show what matters now
- keep primary actions obvious
- reduce decision fatigue
- expose advanced features progressively
- make collaboration feel guided, not overwhelming
- keep organizer-owned controls visually separate from collaborative areas
- keep the join code highly visible in the trip shell
- the trip ball is always visible in the authenticated trip workspace
- action circle animations should never block the user from continuing their task
- notification badge should update in real time without a full page refresh

## Established Interaction Patterns

Patterns locked through design critique and handoff on the Packing page redesign (2026-04-23). Apply these consistently across all surfaces.

### Glow-ring scale convention

Two distinct glow-ring sizes serve different semantic roles. Never swap them.

| Ring width | Role | CSS | Example |
|---|---|---|---|
| `1px` | Interactive selection state — "this thing is selected or active" | `box-shadow: 0 0 0 1px [color]` | Active list selector chip |
| `3px` | Completion / success state — "this action is done" | `box-shadow: 0 0 0 3px [color]AA` (use ~67% opacity) | Packed toggle on a packing item |

Use `transition-shadow duration-150` on elements that transition between these states.

### Touch-padding for small visual pills

Small action pills (10px text, `py-0.5 px-2`) are visually compact by design but must meet the 44px touch-target minimum. Do not increase the visual pill size — wrap the pill's containing element instead.

**Pattern:** give the containing rail or wrapper `min-h-[44px] flex items-center` so the invisible tap area extends above and below the visible pill.

```html
<!-- Correct: small visual pill inside a tall invisible touch area -->
<div class="flex min-h-[44px] items-center gap-1.5">
  <button class="rounded-full border px-2 py-0.5 text-[10px] ...">Label</button>
</div>

<!-- Wrong: pill is the only tap target -->
<button class="rounded-full border px-2 py-0.5 text-[10px] ...">Label</button>
```

This applies to all action pill rails in the product — packing item actions, inline controls, and any sub-row utility buttons.

### Pill resting-state affordance

Action pills must be visually discoverable without hover, because hover does not exist on touch. Pills must always render with a faint fill in resting state, not just a border.

**Resting state:** `background: rgba(color, 0.07)` + `border: 1px solid rgba(color, 0.3)` + colored text  
**Hover/focus state:** full `background: color` + white or dark-on-neon text  
**Never:** outline-only pills with no fill in resting state (invisible on touch)

---

## Accessibility Principles

- maintain strong contrast even with translucent surfaces
- avoid using glass effects as a replacement for structure
- touch targets must be generous
- motion should remain subtle and tolerable -- provide a reduced motion option
- important checklist states should never depend on color alone
- action circle colors must be distinguishable without relying on color alone (use shape or label as backup)

## Mobile Considerations

The app will be built web-first and packaged for native app second. The native app UI layout is a direct copy of the web layout -- no separate design system for mobile.

- touch targets must be generously sized from day one -- do not design for mouse-only
- round shapes and pill buttons are naturally touch-friendly
- the circle and pill motif works well on mobile without adaptation
- avoid hover-only states for critical information -- everything must work on touch

### Mobile navigation

**Superseded 2026-04-20 by UX_SPEC.md § 42.2.** The previous hamburger-toggled slide-in sidebar spec is deprecated. Canonical mobile navigation is a **horizontal scrollable phase pill bar** pinned below the top bar. See UX_SPEC.md § 42.2 and § 42.3 for the full spec (pill anatomy, phase ordering, top-bar contents, active/inactive states, accessibility). No hamburger, no drawer, no bottom tab bar.

### Travel day mobile UI

Travel day is the most mobile-centric surface in the app. It gets special treatment:

- full-screen single-column vertical timeline layout
- standard workspace nav collapses when a travel day is active
- each task row has a minimum tap height of 48px with generous horizontal padding
- the check-off tap target spans the full row width, not just a small checkbox
- auto-scroll after check-off uses a smooth ease -- motion should feel purposeful, not jarring
- the trip ball stays visible but shrinks to a compact indicator in the top bar
- background circle decoration is minimal during travel day -- the list is the focus
- completed tasks use a dimmed state and subtle strike-through, staying visible below current position
- task reordering on mobile uses a drag handle on the right side of each row

## Marketing Visual Rules

The marketing surfaces (landing page, pricing page) can lean into the full energy of the brand. The product surfaces are calmer but clearly the same system.

### Landing page structure

1. Hero -- trip ball animating, filling. Short punchy headline. One CTA.
2. The problem -- group trip chaos. Relatable. Short.
3. The journey -- full trip lifecycle shown as a visual arc with the ball rolling through it.
4. Feature highlights -- travel day mode, expense tracking, wishlist, countdown. Each with a short visual.
5. The memory vault moment -- emotional close. "Every trip tells a story."
6. Pricing -- simple. Free gets you going. Five dollars and you are set for life.
7. Final CTA.

### Marketing copy principles

- lead with the pain, not the features
- show the ball early -- it is the hook
- every feature headline should make someone say "yes, that is exactly my problem"
- the memory vault is the emotional anchor -- use it near the end to close
- the share link (read-only itinerary) is a free acquisition tool -- design the public view to carry TripWave branding clearly

## Design Decisions To Lock Soon

- premium lock visual language
- **trip phase iconography and per-phase color map** -- working values in Phase color assignments section. The shell grill (UX_SPEC § 42) and Phase Card component make these decisions load-bearing. Lock as part of the shell Step-2 mockup
- circle decoration density rules per surface type
- notification panel layout -- partially resolved via UX_SPEC § 42.7 (dropdown panel pattern). Remaining: detailed notification row anatomy
- favorites list placement in the UI

## Safe Restoration Workflow

TripWave has two coexisting visual layers right now — the original dark-gray shell and the newer navy-neon components. This creates an inconsistent look, and restoration work is in progress. These rules prevent restoration work from becoming destructive:

**What "restoration" means here:** moving a specific surface from the current transitional dark-gray values toward the navy-neon target palette specified in the Neon-on-Dark Brand Direction section.

**Safe restoration rules:**
1. **One surface at a time.** Pick a specific page, component, or section. Scope the change to that surface only.
2. **Use the Neon-on-Dark section as your reference.** For each surface type (shell, nav, card, input, button), look up the target value in that section. Apply that specific value.
3. **Never change global CSS tokens across the whole app at once.** Global token rewrites affect every component simultaneously and cause visual regressions across tested surfaces.
4. **Match existing restored components first.** MetricCard, HomeTripList, and the Home page already use the target palette — check those components for precedent before introducing a new value.
5. **Verify the surface hierarchy holds after your change.** Nav should be darker than the shell; cards should be lighter than the shell; borders should be subtly lighter than cards. If the hierarchy breaks, the restoration is wrong.
6. **Keep typography untouched during surface passes.** Surface-color restoration and typography changes are separate workstreams.

**Why broad token rewrites are not acceptable:** the current codebase has deliberate differences between older and newer surfaces. A global token change would destroy the intentional values in the newer components (MetricCard, etc.) that are already at the correct target — replacing them with values that may not match their specific layering context.

## Current Transitional State

What the app currently ships (verified 2026-04-23 — transitional, not final):

- **Shell**: dark gray background (`#444444` / `#4a4a4a`), near-black nav (`#171717`), dark gray sidebar (`#202020`)
- **Card surfaces**: `#2e2e2e`–`#333333` for content cards (Overview, action panels); `#15162A` / `#2A2B45` in newer components (MetricCard, trip list, Home page)
- **Primary accent**: mid-tone cyan (`#12b8e8` / `#00b8e6`) for logo, avatar, active links
- **Phase colors**: implemented rainbow across the nav (cyan, purple, bright cyan, blue, yellow, pink, green — see TripSideNav)
- **Typography**: **Fredoka 600** for large display and trip names, **Fredoka 400** for section headings, **Nunito** across all UI, labels, and body copy
- **Icons**: Phosphor Icons (fill) in colored circle containers in the nav; regular weight for inline content
- **Shapes**: rounded-xl cards, pill buttons, circular avatars and icon containers
- **Copy tone**: sassy, warm, honest — see Copy Direction section
- **Layout**: sidebar + main content on desktop (the bento-grid shell per UX_SPEC § 42 is the structural goal but the sidebar + content model is what's currently shipped); pill bar on mobile
- **Motion**: basic CSS transitions, no systematic ripple or wave system yet

## Restoration Target

Where the style actively needs to go — the intended end state for all surface work:

- deeper surface colors — navy-tinted dark (`#0F1724` shell, `#15162A` cards) replacing the current gray
- brighter neon accents — `#00E5FF` cyan replacing `#12b8e8`, with full neon rainbow treatment
- circles and pill forms as the dominant shape language (already directionally correct)
- ledged 3D buttons and card bottoms (ledge color darkened to match button hue)
- layered dark surfaces (base, raised, elevated) with clear depth hierarchy (partially implemented; outer shell needs deepening)
- action circles animated into the trip ball on meaningful user actions
- Liquid Motion System (see that section) as the eventual motion language
- **desktop bento-grid full-viewport shell** with six durable named slots -- see UX_SPEC.md § 42
- **mobile horizontal scrollable phase pill bar** -- no hamburger, no drawer, no bottom tab bar

These are the active targets for all surface restoration work. Restore incrementally, surface-by-surface, using specific component references and the Safe Restoration Workflow rules above.
- slogan: "Get everyone on the same wave."
