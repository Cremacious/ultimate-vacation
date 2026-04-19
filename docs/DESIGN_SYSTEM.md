# Design System Direction

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

## Visual Thesis

Trip planning should feel like stepping into a neon-lit venue on the first night of a trip -- rich, alive, and full of personality. Dark surfaces give every color element room to breathe and pop. Inspired by the Go-Gos song Vacation -- upbeat, confident, a little cheeky, and ready to go. The energy comes from vivid color on depth, not from white space.

This is not a dark mode. It is a rich, layered surface system where dark backgrounds make the brand palette sing. Cyan labels, yellow badges, pink accents, and green expense data all exist simultaneously on dark surfaces without competing -- because the dark base is the neutral, not white.

## Aesthetic Rules

- deep rich surfaces are the base -- color pops because of the depth, not despite it
- this is not a flat dark theme -- surfaces layer (base, card, panel, modal) with clear depth hierarchy
- brand colors (cyan, yellow, pink, green, orange) are used freely on dark backgrounds as text, labels, icons, and borders
- white is a high-contrast accent, used for primary body text, active states, and maximum-emphasis moments -- not as fill
- circles are the primary decorative motif: decorative splashes, background dots, pill shapes, round avatars, circular indicators
- let vibrant typography and icon color do the work -- do not over-detail surfaces

## Color Direction

### Surface palette (new)

- **deep base** -- the dominant background of the app shell, nav, and inactive areas. Deep slate-navy, not pure black. Something with warmth and personality. Working value: #0F1724 range.
- **raised surface** -- cards, panels, and content containers sit one step lighter than the base. Working value: #1A2333 range.
- **elevated surface** -- modals, popovers, and top-layer panels sit another step lighter. Working value: #243044 range.
- **subtle border** -- thin dividers and card outlines. Barely lighter than the surface they sit on. Working value: #2E3D52 range.

These are working values. Finalize exact hex values when building the component library.

### Accent palette (unchanged brand colors, new usage role)

- **cyan-blue** -- primary action color, active state, links, key labels. (#00AADD range, vivid and clean)
- **hot yellow** -- energy accent, badges, highlights, celebration moments. (#FFD600 range)
- **electric pink** -- secondary accent, invitation moments, personality touches. (#FF2D8B range)
- **green** -- exclusive to financial and expense contexts. (#00C96B range)
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
- default purple SaaS dark themes
- sandy, tropical, or beachy styling
- flat dark surfaces with no layering or depth hierarchy
- pure black (#000) -- the base should feel rich and warm, not void
- going so neon that the palette feels chaotic -- dark base keeps it grounded

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

- circles sit behind all content -- never in front of readable text or interactive elements
- the dark base keeps circles from overwhelming the UI -- they glow softly, not loudly
- use a maximum of two or three circles per surface zone
- circles can overlap each other but not overlap primary content areas
- on app (non-marketing) surfaces, keep circles subtle -- tier 1 only, or restrained tier 2

## Page Background Treatment

The authenticated app uses a radial gradient background, not a flat color. White or near-white at the center fades outward to a medium-dark gray at the edges. This creates a natural focal center that draws the eye inward toward the content area while the dark cards sit against a surface that has depth and character.

### Rules

- the center of the page background is white or very light
- edges and corners fade to a medium-dark gray (around #787878 or darker)
- the gradient is radial, centered on the viewport, not directional
- this background sits beneath dark cards, so it provides contrast and separation without competing with card content
- never use a flat solid color for the page background in authenticated views
- marketing surfaces follow their own background rules

### Why this works

Dark cards against a light-center gradient feel grounded and intentional. The card surfaces are clearly the content layer, and the background is clearly the floor. The radial fade adds depth without requiring any decorative elements.

## Bento Grid Layout

Data-rich pages use a bento grid layout instead of a vertical list of cards. Bento grids place different-sized cells in a CSS grid, letting important data occupy more space and secondary data occupy less.

### When to use bento grid

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

Dark bento cells use 24px (p-6) padding on all sides. Do not use 16px or 20px cell padding as this makes cells feel cramped relative to their content.

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

TripWave's visual direction is **neon rainbow accents against near-black backgrounds with pure-white text**. This is the primary brand treatment, not a dark-mode toggle or marketing-only variant. The whole product reads as fun, premium, and distinctive against a sea of white-and-cyan travel apps.

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

## Liquid Motion System -- Wet Neon, Oil Flow, Water Waves

The neon in TripWave should feel like **wet paint** -- rich, glossy, capable of dripping. Motion is **oil-slick fluid** -- slippery, never mechanical. Interactions ripple like **water surfaces**. This motion system is foundational: every animation, transition, and state change honors these rules. The name is "TripWave" -- the whole product should move like a wave.

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

### Mobile sidebar navigation

On mobile, the desktop left-rail phase navigation is replaced by a collapsible sidebar. There is no bottom tab bar.

**Toggle behavior:**
- a hamburger menu button sits in the top-left of the mobile header bar at all times
- tapping the button opens the sidebar with a slide-in animation from the left
- tapping the button again, tapping the overlay behind the sidebar, or swiping the sidebar left closes it
- the sidebar state (open or closed) does not persist between page navigations -- it starts closed on each new route

**Sidebar layout:**
- slides in from the left edge of the viewport
- width is approximately 80% of the viewport, capped at 300px
- full viewport height, scrollable if the phase list is long
- sits above the page content with a semi-transparent dark overlay behind it
- the overlay uses the deep base color at around 70% opacity

**Sidebar contents (top to bottom):**
1. trip name and ball indicator (compact, at the top)
2. phase navigation list -- same items and order as the desktop left rail
3. each phase item shows its colored circle icon and phase label
4. active phase is highlighted in cyan with a filled background indicator
5. recommended phase has a subtle badge or dot
6. a divider, then: trip settings and account links at the bottom

**Visual treatment:**
- sidebar background uses the elevated surface tone (one step above the raised surface)
- phase labels use white text; active phase label uses cyan
- colored phase icons use the same assignments as desktop
- the sidebar feels continuous with the rest of the dark UI -- not a bright panel interrupting a dark app

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
- trip phase iconography (finalize color per phase)
- circle decoration density rules per surface type
- notification panel layout (inline panel vs full page)
- favorites list placement in the UI

## Approved Reference Direction

The current reference style is:

- deep rich dark surfaces (slate-navy base, not pure black) with vibrant multi-color elements as the foreground energy
- 1980s Go-Gos Vacation aesthetic -- upbeat, electric, a little cheeky -- now with the lights turned down and the neon turned up
- circles and pill forms as the dominant shape language
- cyan-blue primary CTA and active states, hot yellow highlights, electric pink accents, green for finance, white for primary body text
- brand accent colors used freely as text, labels, borders, and icon colors against the dark base
- sassy copy everywhere in the product
- ledged 3D buttons and card bottoms (ledge color darkened to match button hue)
- layered dark surfaces (base, raised, elevated) creating clear depth hierarchy
- **Fredoka 600** for large display, **Fredoka 400** for section headings
- **Nunito** across all UI, labels, and body copy
- Phosphor Icons (fill) in colored circle containers
- action circles animated into the trip ball on meaningful user actions
- mobile navigation uses a collapsible left sidebar toggled by a hamburger button -- no bottom tab bar
- slogan: "Get everyone on the same wave."
