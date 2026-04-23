# Packing Named Lists Mockup

> Last drafted: 2026-04-23
>
> Purpose: Step 2 mockup for the Packing page after the `My lists / Shared / Suggestions` contract update.
>
> Scope: layout, hierarchy, interaction model, and visual treatment. This is a mockup description, not implementation code.

---

## Mockup goal

Restore the old dashboard-like Packing rhythm while adapting it to the new contract:

- multiple named personal lists
- list-level visibility
- item-level privacy overrides
- distinct Shared coordination surface
- Suggestions as a third tab

This mockup assumes the current TripWave neon-on-dark direction and the existing Packing page shell.

---

## Page structure

### Top header band

- Page title: `Packing`
- Subtitle: `Pack privately, share what matters, and keep group gear coordinated.`
- Right-side progress cluster:
  - overall packed count
  - progress bar
  - completion percent

### Stat row

Three large stat tiles, same rhythm as the restored dashboard shell:

1. `Packed`
2. `My lists`
3. `Shared`

Optional fourth tile later if Suggestions needs a badge worth surfacing.

---

## Top tabs

Three primary tabs:

1. `My lists`
2. `Shared`
3. `Suggestions`

### Tab treatment

- Active tab: cyan glow underline, white label, bright badge
- Inactive tab: white text, lower emphasis
- Suggestions on free tier: lock icon instead of count

The tab strip sits above the main content column, not buried inside a card.

---

## Desktop composition

Two-column dashboard layout:

- **Left / primary column**: active tab body
- **Right / secondary column**: summary + visibility help + shared-state modules

### Left column rhythm

1. tab strip
2. tab-specific toolbar
3. optional visibility/status banner
4. stacked category/list cards

### Right column rhythm

1. overall trip packing progress
2. active-list summary
3. visibility explainer card
4. shared ownership / bringer summary when relevant

---

## My Lists Tab

### Toolbar row

Top row inside `My lists`:

- horizontal named-list strip on the left
- `+ New list` button at the right edge

### Named-list strip

Each list appears as a rounded pill/card:

- list name
- tiny visibility chip: `Private` or `Public`
- unchecked-count badge

Example row:

```text
[ Main Bag • Private • 7 ] [ Carry-on • Public • 3 ] [ Gift Bag • Private • 1 ] [ + New list ]
```

### Selected-list card header

Below the strip, the selected list opens into a large card header:

- list name in bold/Fredoka
- visibility toggle chip group:
  - `Private`
  - `Public`
- small secondary actions:
  - rename
  - delete

Important visual rule:

- list-level visibility is prominent but calm
- item-level privacy is smaller and more local

### Visibility banner

Directly below the selected-list header:

- If list is private:
  - pink-tinted banner
  - copy: `Only you can see this list unless an item is explicitly made public.`
- If list is public:
  - cyan-tinted banner
  - copy: `Trip members can see this list. Private items stay hidden.`

This banner is important because the inheritance model is not self-evident.

### Category cards

Within the selected list, items are grouped into stacked category cards:

- Clothing
- Toiletries
- Electronics
- Documents
- Other
- custom categories below or interleaved by user order

Each category card header shows:

- category icon
- category name
- count/progress
- drag handle placeholder for future reorder

### Item rows

Each item row includes:

- checkbox
- item label
- optional quantity chip
- privacy chip when overridden from the list default
- three-dot menu

#### Privacy chip behavior

- if list is public and item is private:
  - show pink `Private` chip
- if list is private and item is public:
  - show cyan `Public` chip
- if item inherits the list default:
  - show no chip to reduce noise

### Quick-add per category

Bottom of each category card:

- inline input
- placeholder: `Add to Clothing...`
- input inherits the selected list context automatically

### Packed subsection

Checked items collapse into a `Packed (N)` subsection at the bottom of each category card.

---

## Shared Tab

Shared keeps the current dashboard/card feel but is visually distinct from `My lists`.

### Toolbar row

- `Shared` title chip
- `Add shared item` button

Optional later:

- filter by assignee

### Shared category cards

Same stacked-card rhythm as `My lists`, but each item row shows:

- checkbox
- item label
- assigned bringer avatar/chip or `Claim` button
- three-dot menu

### Shared right-rail module

Secondary column card:

- list of people with counts
- `You: 4 bringing`
- `Sarah: 2 bringing`
- `Unassigned: 3`

This supports coordination without cluttering the main list.

---

## Suggestions Tab

Suggestions stays visually lighter than the working tabs.

### Premium view

- card grid of suggestions
- each card:
  - icon
  - item label
  - reason
  - `Add to selected list`
  - `Add to Shared`

### Free view

- 3 visible teaser cards
- lock overlay
- supporter card

---

## Mobile composition

Single-column stack:

1. header
2. stat tiles as horizontal scroll or 2-up grid
3. tab strip
4. named-list strip as horizontal scroll inside `My lists`
5. selected-list header card
6. category cards
7. sticky bottom quick-add only if we later decide the per-category inputs are too heavy on mobile

The named-list strip must remain swipeable and not collapse into an unreadable dropdown by default.

---

## Visual direction

### Surfaces

- charcoal/black panels
- stronger separation between page background, card surface, and interactive pills
- cyan for primary shared/active accents
- pink for privacy
- green only for completion/success

### Hierarchy

- named-list strip should feel like the page's second navigation layer
- selected-list header should feel heavier than category headers
- item-level privacy should be visible, but not dominate the row

### Motion

- tab switch: subtle slide/fade
- selecting a different list: crossfade content with quick horizontal drift
- visibility chip change: soft glow pulse
- add-item success: row slides into category with a short cyan flash

---

## What this mockup intentionally does not include

- fake AI suggestions logic
- generic reusable list-builder patterns outside Packing
- new route structure
- multi-shared-list management
- drag-and-drop implementation detail

---

## Open questions for critique

1. Should the named-list strip use pills or compact cards on desktop?
2. Is the visibility banner necessary all the time, or only on first exposure / after changes?
3. Does item-level visibility need a stronger inline label than a chip?
4. Should public personal-list items ever be mirrored into a separate “visible to group” summary, or only live inside their parent list?

---

## Critique prompts owed

→ Before locking this, run `/design-critique` to pressure-test the mockup. Paste the description / screenshot / sketch of the Packing named-lists page into the skill prompt.

→ This introduces a new pattern. Run `/design-system` with `DESIGN_SYSTEM.md` + the named-list strip and list/item visibility pattern to confirm fit and catch inconsistencies.

→ Mockup locked. Before any JSX is written, run `/design-handoff` with the locked mockup to generate implementation-ready specs.
