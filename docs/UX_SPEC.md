# UX Specification

This doc captures feature-level UI/UX design decisions as they are locked. It is the living reference for how each feature should look and behave.

Decisions are added via structured grill-me sessions and reflect shared understanding between product owner and design. Every entry here is considered accepted unless superseded by a later entry.

---

## 1. Trip Ball -- Interaction Behavior

**Status:** locked (2026-04-17)

When a user clicks or taps the trip ball from anywhere inside the trip workspace, a **modal opens** showing a breakdown of the trip's health and progress.

### Modal contents (top to bottom)

- Large ball visual at top showing current fill %
- **Next best action** card, prominent and colorful, tappable -- routes to the relevant phase and closes the modal
- **Progress breakdown** by preplanning category (Group, Transportation, Accommodations, Budget, Destination info, Documents, Trip character, Pre-departure logistics) -- each row shows completed vs not
- **Blockers** list, if any exist
- **Ball color picker** -- 4 to 5 color swatches for personalizing the trip ball (this is a meaningful personalization moment)

### Why this behavior

- Keeps users in context of whatever phase they were already viewing
- Teaches the mental model that preplanning completion fills the ball
- Consistent behavior across desktop and mobile (no responsive divergence)
- No dedicated route needed, no new page to design
- Surfaces the primary next action naturally

---

## 2. Dashboard (`/app`) -- Layout

**Status:** locked (2026-04-17)

The dashboard is a hybrid: trip list + unified action center + "Next up" hero. It serves the emotional pull of seeing your trips **and** the practical need of surfacing actionable items across trips.

### Layout (top to bottom)

1. **Next up hero** -- dark background strip
   - Shows the soonest upcoming trip
   - Contains the ball, trip name, countdown, fill %
   - Tapping the hero routes to that trip's **current recommended phase** (not its overview) so the user picks up exactly where they should work
2. **Your trips** section
   - Compact trip cards, one per row
   - Each card shows ball, name, countdown, fill %, with a left-accent bar in the ball color
   - "New trip" button in the top-right corner (disabled with a friendly tooltip if free user has 1 active + 3 saved slots used)
3. **Needs your attention** section
   - Pulls actionable items from across all trips
   - Item categories (with brand color dot on each item):
     - Polls awaiting your vote (yellow)
     - Expenses you owe or are owed (green)
     - Approaching travel days (pink)
     - Blockers (pink)

### Zero-trip empty state

- Big illustrated dashed-circle ball
- Headline: *"Every great trip starts with a name."*
- Primary CTA: "Create your first trip"

---

## 3. Trip Creation Flow

**Status:** locked (2026-04-17)

A **4-step full-screen flow** with playful animations and wipe transitions between steps. Feels like an app moment, not a form.

### Step 1 -- Name

- Prompt: *"Let's name your trip!"*
- Empty **dashed-outline ball** hovers in upper-center of screen
- Big Fredoka-font input field below the ball
- As the user types, the ball **gently pulses** as if listening
- On submit: the ball does a small shake (like a nod of approval)
- Transition: wipe-left to step 2

### Step 2 -- Dates

- Prompt: *"When are you going?"*
- Date range picker
- Sassy/funny copy makes the optionality clear: *"Not sure yet? No pressure -- you can add these later."*
- Skip button is prominent and equally weighted
- Transition: wipe-left to step 3

### Step 3 -- Pick a Color

- Prompt: *"Give your trip a color."*
- Row of 4 to 5 big color swatches (brand cyan, yellow, pink, green, plus a neutral)
- Tapping a swatch fills the still-visible ball with that color for instant visual payoff
- Copy hints personalization: *"You can change this later."*
- Transition: wipe-left to step 4

### Step 4 -- Reveal

- Full-screen moment
- Ball animates to center at full hero size, color settling in
- Text reads: *"Meet [Trip Name]. Let's plan it."*
- Single CTA button: "Let's go" -- drops user into the trip overview

### Transition behavior

- All inter-step transitions use a horizontal wipe (<300ms)
- No per-step numbering or progress bar -- the flow should feel like a fun ritual, not a process
- Back button available in the top-left to re-edit previous steps (subtle)

---

## 4. Preplanning Wizard -- Navigation Shape

**Status:** locked (2026-04-17)

Preplanning uses a **section picker hub** as its navigation shape. The user picks which of the 8 sections to work on, in any order, and returns to the hub after each.

### Hub layout

- Top: the trip ball at current fill %, small, with label *"X% planned"*
- Below: a grid or vertical list of 8 section cards
- Each card shows:
  - Colored icon using phase color language (cyan for core planning sections, yellow for packing-adjacent, etc.)
  - Section name
  - Progress bar showing "X of Y fields"
  - Status badge: *Empty*, *In progress*, *Complete*, or *Not applicable*
- Tapping a section card opens that section's focused editor page
- Bottom: "Mark trip as ready to advance" CTA -- appears only once the ball reaches 90%

### The 8 sections (in hub order)

1. Group composition
2. Transportation
3. Accommodations
4. Budget
5. Destination info
6. Documents and logistics
7. Trip character (type, vibe, wishlist, must-dos)
8. Pre-departure logistics

### Not applicable handling

Sections can be marked *Not applicable* for this trip (e.g., no visa needed for a domestic trip). Not-applicable sections are excluded from the ball fill denominator so they do not penalize trip progress.

### Why a hub instead of linear wizard

- Preplanning data rarely comes in a natural order -- people know their dates before their flights, their group before their budget
- Linear wizards get abandoned when users hit a question they cannot answer
- The hub shows progress at a glance, which is motivating
- Each section as a focused editor keeps per-screen cognitive load low
- Fits the ball mental model -- each section fills a piece of the ball
- Mobile and desktop use the same layout, no responsive divergence

---

## 5. Preplanning Section Editor -- Single Section Anatomy

**Status:** locked (2026-04-17)

When a user taps a section card from the preplanning hub, they land on a **single long scrollable form** for that section. All fields live on one page. Conditional fields appear or hide based on primary choices.

### Editor page anatomy

- **Top**: back arrow routing to the hub, section name in Fredoka, small contextual ball showing overall trip fill %
- **Sub-header**: quick status -- e.g., *"3 of 7 fields done"* -- plus a *"Mark section not applicable"* text toggle
- **Body**: form fields grouped with subtle dividers rather than collapsible accordions
  - Example in Transportation: *"Getting there"* divider, then *"Getting around"*, then *"Transfers"*
- **Conditional fields**: animate in/out with a subtle fade-slide (<200ms) when primary choices change (e.g., selecting "Flying" reveals flight-specific fields)
- **Sticky footer**: two buttons
  - Primary: *"Save and return to hub"*
  - Secondary: *"Save and continue to [next incomplete section name]"*
- **Dynamic lists** (travelers, lodging stays, rental cars): inline add and remove. Tap + to append a new row. Tap trash to remove

### Not-applicable state

Every section has a *Mark not applicable* toggle at the top. When enabled:

- Body content fades out or grays
- Section appears as *Not applicable* at the hub
- Fields are excluded from the ball fill denominator

### Autosave

All fields autosave as the user types. No unsaved-changes warnings. No explicit save button beyond the footer navigation buttons.

### Why a single scrolling form

- User picked the section deliberately from the hub -- wizarding them again inside is redundant
- Focused mode: once inside, the user is committed to that section. Let them fill anything in any order
- Single scroll is easy to skim, fill partially, or skip
- Conditional fields keep the form clean without hiding work behind accordions
- One page, one commit moment, one consistent pattern across all 8 sections

---

## 6. Itinerary -- Primary View Structure

**Status:** locked (2026-04-17)

The itinerary uses a **day-by-day vertical scroll** layout as its primary view. Each day of the trip is a distinct section with event cards stacked chronologically beneath. Users scroll through the entire trip top to bottom.

### Page structure

- **Top sticky day jumper**: horizontal scrollable strip of day pills (*"Day 1 Mon"*, *"Day 2 Tue"*, etc.)
  - Tapping a pill scrolls the body to that day
  - Current day is highlighted
  - Sticks at the top during scroll
- **Body**: each day is a section containing
  - Large colored header card -- shows day number, date, and weather icon (weather integration later)
  - Event cards stacked beneath, sorted by time
  - Empty day placeholder: pale card with *"Nothing planned for Day 3 yet"* and a subtle inline add button
  - *"+ Add to this day"* button pinned at the bottom of each day block
- **Quick-add control**
  - Mobile: floating + FAB in bottom-right
  - Desktop: persistent + button in the page header
  - Asks *"Which day?"* when the target is not obvious

### Desktop enhancement

Desktop gets an optional fold-out right-side panel with a compact week-view calendar for fast navigation. Collapsed by default. Not available on mobile.

### Why day-by-day vertical scroll

- Trips are mentally organized by days, not hours -- *"What are we doing Tuesday?"* is the natural question
- Calendar grids kill legibility for event details (cannot read restaurant names in small cells)
- Flat lists lose the emotional structure of a trip
- Horizontal timelines are unusual and mobile-unfriendly
- Tabbed days hide trip flow -- users lose sense of the overall trip
- Vertical scroll scales gracefully from 3-day weekends to 14-day epics
- Works identically on desktop and mobile

### Alternate views

A calendar-grid view and a flat-list view are possible **alternate view toggles** to be designed later. They are not the primary.

---

## 7. Itinerary -- Item Card Anatomy

**Status:** locked (2026-04-17)

All itinerary items share a uniform card shape. Visual differentiation between types comes from a **colored left stripe + matching header icon**.

### Item categories and colors

- **Activity** -- hike, meal out, museum, beach time -- yellow (#FFD600)
- **Reservation** -- hotel check-in, restaurant booking, tour -- cyan (#00A8CC)
- **Transport** -- flight, train, rental pickup, transfer -- pink (#FF2D8B)
- **Note / Free time** -- "chill morning", "meetup at 5pm" -- gray (#9CA3AF)
- **Expense-linked item** -- any category, plus a small green coin icon badge

### Card anatomy (uniform across categories)

- **Left stripe**: 4px colored bar matching the category
- **Header row**: small filled icon in category color + title in bold
- **Time**: subtle gray text below the title (e.g., *"6:30 PM"*, *"All day"*, *"2h"*)
- **Location** (optional): italic gray with a tiny pin icon
- **Note** (optional): smaller gray text below location
- **Right side of card**: avatars of travelers tagged to this item (e.g., "adults only" for this dinner)
- **Expense badge** (optional): small green coin icon if an expense is linked
- **Tap behavior**: opens edit modal on mobile, expanded inline view on desktop

### Why a stripe + icon instead of per-category layouts

- Users should scan a day and instantly see the shape of it ("2 meals booked, 1 flight, 3 activities")
- Left stripe is consistent with dashboard trip cards, repeating a known pattern
- Fully distinct layouts per category would fragment the visual rhythm of a day
- Background tints would compete with day headers and feel busy
- Icon-only differentiation reads slower than a stripe

---

## 8. Packing -- Personal vs Shared Visibility

**Status:** locked (2026-04-17)

Packing uses **three tabs** at the top of the phase to separate personal, group, and suggested content.

### Tab structure

- **My list** (default tab)
  - Grouped by user-defined categories (Clothing, Toiletries, Electronics, etc.) with custom groups supported
  - Each item: checkbox + label + optional quantity + three-dot menu
    - Menu actions: Edit, Move to group list, Delete, Make private / Share with group
  - New items default to **private** (personal only)
  - Quick-add input pinned at the bottom of each category
  - Count badge on tab shows total items

- **Group list**
  - Flat list grouped by category
  - Each item: checkbox + label + avatar of the assigned bringer + three-dot menu
    - Menu actions: Edit, Unassign, Remove
  - Items can be assigned to a specific traveler (the person responsible for bringing it)
  - Prominent "Add item" button at the top
  - Count badge on tab

- **Suggestions**
  - **Premium users**: list of smart-suggested items based on destination, duration, vibe, and group composition
    - Each suggestion card: icon + item name + reason (*"Because your trip is to Tokyo in April"*)
    - Tap to add to My list or Group list
  - **Free users**: 3 sample suggestions visible with a lock overlay and a friendly upgrade card
  - Badge on tab: count for premium, small lock icon for free

### Privacy defaults

- Personal items are private by default
- Making an item private prevents it from appearing to other travelers anywhere
- Privacy toggle lives in each item's three-dot menu

### Empty states per tab

Each tab has its own empty-state messaging:
- My list: *"No items yet. Start with the essentials."*
- Group list: *"Nothing shared yet. First aid kit? Beach umbrella? Group snacks?"*
- Suggestions (free): upgrade prompt framed as value, not pressure

### Why tabs instead of one scrolling view

- Packing is deeply personal -- users want their own view first, without group items leaking in
- Group list is a separate conversation from personal packing and deserves its own focus
- Suggestions need their own context so the premium upgrade prompt can live cleanly in the free-user view
- Tabs scale identically across mobile and desktop

---

## 9. Travel Day -- Mode Behavior

**Status:** locked (2026-04-17)

Travel Day combines **auto-route-on-open** with a dedicated **focus mode** that activates during the actual travel day. Outside of travel-day windows, Travel Day behaves as a normal planning phase.

### Behavior over time

- **T-minus weeks to days (planning window)**
  - Travel Day is a normal phase in the sidebar
  - Card-based editor: user builds the checklist (passport, arrive 2 hours before, group meetup at hotel lobby, etc.)
  - No focus mode, no invasive UI

- **T-minus 24 hours**
  - Travel Day tab in the sidebar gets a pink pulse dot to draw attention
  - Opening the trip still lands on wherever the user last was

- **T-minus 6 hours (morning of the travel day)**
  - Opening the trip **auto-routes** to the Travel Day page
  - **Focus mode activates automatically**
  - Sidebar collapses to a narrow icon strip (still clickable for navigation)
  - Top bar replaced with a minimal status strip: *"Depart at 6:00 PM · Leave home by 3:30 PM · 2 items pending"*
  - Main view shifts from card editor to **execution mode**: a single vertical checklist with giant tap targets, sorted by time, with the current "up next" item enlarged and highlighted
  - Other phases dim in the sidebar (still accessible, just de-prioritized)

- **During travel segments (at airport, on plane, at transfer)**
  - Checklist shows a live "you are here" marker
  - Completed items collapse upward
  - Upcoming items expand downward

- **Post-arrival**
  - Focus mode exits automatically
  - Normal workspace returns
  - Travel Day page remains navigable for records

### Focus mode design principles

- Big, calm, uncluttered -- airports are overstimulating, the app should feel like a deep breath
- High-contrast text
- Only one primary task visible at a time
- Swipe-to-complete with satisfying haptic
- Minimal color -- just the trip ball softly pulsing in the corner and the next-item highlight in the trip's accent color

### Manual control

- Users can exit focus mode at any time via a subtle *"Exit focus mode"* link
- Users can manually activate focus mode from the Travel Day page even outside its auto-trigger window (power users)

### Why hybrid auto-route plus focus mode

- Pure planning-phase treatment would under-serve the day that matters most
- Pure focus mode would be too invasive during planning weeks before travel
- A soft banner alone doesn't reorder the UI as the docs require
- Full app takeover would lock users out of useful info like itinerary or reservations
- The combination is calm when planning, focused when executing

---

## 10. Vacation Day -- Daily Coordination Shape

**Status:** locked (2026-04-17)

Vacation Day is a single-page "Today" feed with a warm morning briefing, today's events, a group activity strip, quick actions, and a peek-tomorrow link at the bottom.

### Page structure (top to bottom)

- **Morning briefing card**
  - Large and warm, color-themed to the trip's ball color
  - Updates once per day at local sunrise
  - Greeting by time of day: *"Morning! Day 4 in Tokyo."*
  - Mini-summary: *"3 events today · 2 reservations · weather 68° and cloudy"*
  - First thing on the agenda highlighted: *"Up next: breakfast at hotel · 8:00 AM"*
  - Dismissible per day -- collapses to a small bar if user dismisses

- **Today's events**
  - Itinerary-style cards for today only, sorted by time
  - Same card anatomy as the itinerary phase (left stripe, icon, time, location)
  - Completed events dim and collapse upward
  - Currently-active event has a subtle live indicator (dot or glow)

- **"What changed today" strip**
  - Small horizontal scroll of activity chips
  - Examples: *"Sarah added dinner suggestion"*, *"Mom paid $80 for taxi"*, *"Poll started: tonight's bar"*
  - Each chip taps through to its source

- **Quick actions row** -- always visible
  - Add event (to today or upcoming)
  - Log expense (quick mode: what, how much, paid by whom, split how)
  - Start poll (quick mode: question, options)

- **Peek tomorrow link**
  - Small link at the bottom: *"Tomorrow: Day 5, hike at Shinjuku Gyoen"*
  - Tap expands tomorrow inline or routes to itinerary

### Auto-activation rules

- During in-progress trip days, opening the trip auto-routes to Vacation Day
- No focus mode -- vacation should feel flexible, not locked-down
- Users can navigate to other phases anytime without friction

### Why a single "Today" feed

- During trips, users are distracted, jetlagged, in the middle of meals -- a linear scroll beats complex grids or swipeable decks
- The morning briefing is a warm daily ritual that makes the app feel like a smart travel buddy
- Widget grids fragment attention and feel like a dashboard tool
- Swipe cards hide context ("wait, what's tomorrow?")
- Reusing the itinerary wastes the opportunity to make vacation day feel distinct

---

## 11. Expenses -- Primary View

**Status:** locked (2026-04-17)

Expenses uses a **balances-first** layout. The primary question users ask is *"Do I owe anyone? Does anyone owe me?"* -- that answer dominates the page.

### Page structure (top to bottom)

- **Balances hero card** -- dark background strip, matches the dashboard hero style
  - Big text showing the user's personal net: *"You're owed $58"* or *"You owe $124"*
  - Per-person breakdown beneath the headline
    - *"Sarah owes you $18"* with *Mark settled* button
    - *"You owe Mom $42"* with *Mark paid* button and hint (*"Pay Mom via Venmo"*)
  - Celebration state when balance is 0: subtle *"All settled!"* treatment

- **Trip total strip** -- thin strip below the hero
  - *"Trip total: $2,340 · Your share: $585 · Budget: 82% used"*
  - Tap expands the budget view with category breakdown

- **Ledger**
  - Flat list of all expenses, newest first
  - Filter chip row above: *All · Yours · By category · By day*
  - Each row: category-colored icon, description, amount, payer avatar, split indicator, tap to view/edit

- **Bottom action row / FAB**
  - Primary: *Add expense*
  - Secondary: *Scan receipt* (premium -- free users see a cyan lock icon and upgrade card on tap)

### Add expense flow (summary)

Quick entry fields: amount, description, category, paid by (defaults to current user), split type.

Supported split types:
- Even across the whole group
- Even across selected travelers
- Custom amounts
- Single person (not split)

Full add-expense interaction spec deferred to a later question.

### Premium surfaces on this page

- *Scan receipt* button always visible, with lock icon for free users
- Currency conversion appears inline in the add-expense flow with a premium hint next to the currency field

### Why balances-first

- Answers the #1 user question immediately
- Visible debt acts as social pressure to settle outside the app
- Ledger-only treats expenses like a bank statement and misses the group coordination angle
- Tabs would force users to hunt for the info they care about most
- Day-grouped and category-grouped views are secondary concerns that live behind filter chips

---

## 12. Polls -- Page Layout

**Status:** locked (2026-04-17)

The Polls phase uses **big voteable cards for active polls** stacked on top of a compact row list of closed polls.

### Page structure

- **Top header strip**
  - Title *Polls* in Fredoka
  - Primary button *Start a poll* (cyan)
  - Filter chip: *All · Pre-trip · On-trip*

- **Active polls section** -- large cards with full voting UI inline
  - Card shows: question, optional context blurb
  - 2 to 6 options as big tappable pills
    - Each pill: option name, current vote count as a subtle bar, avatars of voters
    - User's selection has a cyan check mark and filled background
  - Expiration countdown: *"Closes in 4 hours"* or *"Closes when everyone has voted"*
  - Small *Close now* action (organizer only) in the corner
  - Status chip after voting: *"Your vote: [option]"*

- **Closed polls section** -- compact row list
  - Each row: truncated question, winner, date closed, voter avatars
  - *Convert to itinerary item* action pill (yellow) appears if not yet converted
  - Converted polls show a green checkmark with the itinerary day

- **Empty state**
  - Illustration: paper ballot with the trip ball peeking behind it
  - Copy: *"No polls yet. What should the group decide?"*
  - *Start a poll* CTA

### Start-a-poll flow

- Mobile: slide-up sheet. Desktop: modal
- Fields: question, up to 6 options, expiration time
  - Default expiration: 24 hours for on-trip polls, 3 days for pre-trip polls
- *Quick vote* toggle: shorter expiration, bigger option font, minimal chrome -- for in-trip snap decisions
- Submit triggers a group notification

### Convert-to-itinerary action

- Appears on a poll card once the winner is decided
- Also appears as a row action on closed polls
- Opens an itinerary item modal pre-filled from the winning option
- User just picks day and time

### Why active-as-cards plus closed-as-rows

- Active polls deserve visual weight -- the whole interaction is one-tap voting inline
- Closed polls are reference material -- winner, date, status at a glance
- Tabs would hide active polls behind a click
- A chronological feed would mix live and dead polls confusingly

---

## 13. Wishlist -- Layout and Promotion Mechanics

**Status:** locked (2026-04-17)

Wishlist uses a **hot-section-plus-full-list** layout with explicit *Like* and *Add to itinerary* actions on every idea card.

### Page structure

- **Header strip**
  - Title *Wishlist* in Fredoka
  - Primary button: *Add idea*
  - Filter chip row: *All · Mine · Liked by me*

- **"The group is into" section** -- only shown when at least one idea has 2+ likes
  - 2 to 3 large cards displayed horizontally (scrollable on mobile)
  - Each card: idea title, adder avatar, like count, *Add to itinerary* pill

- **All ideas section** -- vertical list of compact idea cards
  - Card contents:
    - Idea title
    - Metadata line: who added it, when, optional type chip (food / activity / place)
    - Optional note, image, or link preview
    - Like button (heart icon with count), tap toggles
    - *Add to itinerary* pill button (only for users with permission)
    - Three-dot menu: Edit, Delete (your own), Report (someone else's)
  - Sortable by *Likes · Newest · Oldest*

- **Empty state**
  - Illustration: wishing-star with the trip ball
  - Copy: *"What would make this trip unforgettable?"*
  - Quick-add example chips: *A place · A restaurant · An activity* -- taps pre-fill the add form

### Add idea flow

- Slide-up sheet on mobile, modal on desktop
- One free-text field (title) required
- Optional: note, link (auto-previews), photo upload, type tag
- One-tap submit

### Promotion behavior

- Tap *Add to itinerary* opens the itinerary item modal pre-filled from the idea
- After saving, the idea is **removed from the wishlist** with a subtle toast: *"Added to itinerary · Undo"*
- Undo restores the idea to the wishlist and removes the new itinerary item

### Restricted mode

When the organizer disables participant adds:

- *Add idea* button is hidden for restricted users
- A small explanatory line replaces it: *"Only the organizer can add ideas to this wishlist."*

### Why hot-section plus explicit promotion

- Wishlists die when they become noise -- surfacing most-liked ideas shortcuts the group to "what we actually want to do"
- Explicit *Add to itinerary* button on every card keeps the promote moment one tap away
- Pinterest-style pinboards assume image-rich content; many wishlist items are just text
- Categories add friction to a feature that should feel loose and brainstormy

---

## 14. Notes -- Structure and Interaction

**Status:** locked (2026-04-17)

Notes use a **social-feed layout** with reactions, replies, and optional event-link chips.

### Page structure

- **Header strip**
  - Title *Notes* in Fredoka
  - Primary button *Add note*
  - Filter chips: *All · Mine · Event-linked · Pre-trip · On-trip · Post-trip*
    - Pre/On/Post auto-scope by note timestamp relative to trip dates

- **Feed** -- vertical list of note cards, newest first
  - Card contents:
    - Author row: avatar + name + relative timestamp
    - Body text
    - Optional photo or link preview
    - *Attached to:* chip if linked to an itinerary event -- tap jumps to the event
    - Reactions row with emoji toggles and counts
    - Reply thread preview (count and latest reply snippet)
  - Tap the note to expand into a detail view with full replies

### Add note flow

- Slide-up sheet on mobile, modal on desktop
- Free-text body field (required)
- Optional: attach to event, add photo, add link
- Post button

### Attached-to-event behavior

- Notes linked to an event also appear beneath the event card when expanded
- From within an event detail view, users can add a note directly -- it posts to the Notes feed with the link auto-created

### Reactions and replies

- Tap any emoji to toggle your reaction
- Replies are one level deep, no nested threading
- Thread view opens inline on tap

### Empty state

- Illustration: notepad with the trip ball as the dot of an *"i"*
- Copy: *"Post reminders, tips, and thoughts. Your group can reply and react."*
- *Add your first note* CTA

### Why a social feed

- Notes are inherently communication, not filing -- social feed matches that mental model
- Two-tab splits (all / linked) lose the chronology that makes notes feel alive
- Categories over-organize and force decisions about which bucket a note belongs to
- Bulletin boards look chaotic at volume
- Minimal lists underserve the social moment

---

## 15. Vault -- Document Storage Layout

**Status:** locked (2026-04-17)

Vault uses **category sections plus search-first** navigation with a pinned *"Needed today"* strip during in-progress trips. Speed of retrieval is the primary UX concern -- users may be at a border counter or rental car desk.

### Page structure

- **Top sticky bar**
  - Large search input: *"Search passports, flights, hotels..."*
  - Filter chip row: *All · Mine · Group · By type*

- **"Needed today" strip** -- shown only during in-progress trips when date-relevant docs exist
  - One or two large pink-accent cards
  - Example card: *"Boarding pass for flight NH212 · 3:25 PM today"*
  - Tap opens the document full-screen

- **Category sections** -- collapsible
  - *Passports & IDs*
  - *Flights & transport*
  - *Lodging*
  - *Insurance & health*
  - *Reservations* (restaurants, tours)
  - *Other*
  - Grid of thumbnails per section (2-column mobile, 4-column desktop)
  - Each thumbnail: preview image (PDF page 1 / image / doc-type icon for booking refs) + doc title + associated traveler avatar + date added

- **Upload control**
  - Mobile: floating + FAB
  - Desktop: top-right primary button
  - Upload options: *Take photo · From library · Scan doc (premium) · Paste booking reference · Add manually*

### Empty state

- Illustration: vault door slightly ajar with a small ball peeking out
- Copy: *"Tickets, passports, confirmations. One calm place."*
- *Add your first doc* CTA

### Doc detail view

Opens full-screen on tap. Contents:

- Pinch-zoomable preview
- Title, category, added-by avatar + name, date
- Action buttons: *Download · Share (expiring link) · Mark as expired · Edit details · Delete*
- *Jump to event* chip if the doc is attached to an itinerary item

### Upload flow

- Auto-type detection where possible (OCR hints the category)
- Required after upload: type (if not detected), title
- Optional: attach to traveler, attach to event

### Premium surfacing

- *Scan doc* action uses OCR to auto-extract details -- premium only
- Free users upload and manually title

### Why categories plus search plus "Needed today"

- At a border or check-in desk, users want to tap a known category and get the doc, not browse
- Search is the escape hatch for large vaults and for urgent moments
- *Needed today* automates the "right doc at the right time" behavior
- Flat grids do not scale, list views lose visual scannability, traveler-scoping over-organizes mixed group trips

---

## 16. Tools Hub -- Layout and Surfacing

**Status:** locked (2026-04-17)

The Tools hub uses **phase-aware smart surfacing at the top** combined with the **full categorized library below**. The hub adapts to the trip's current phase and state.

### Page structure

- **Header**
  - Title *Tools* in Fredoka
  - Subtitle: *"Everything you need before, during, and after."*
  - Small search input, right-aligned, not dominant

- **"Useful right now" section** -- conditional, phase-aware
  - 3 to 5 tool cards
  - Horizontally scrollable row on mobile, tile row on desktop
  - Each card is larger than the library version with a 1-sentence hint (*"Check Tokyo's weather the week of your trip"*)
  - Premium tools shown to free users appear with a lock icon and a preview-state *Try it* label
  - The section is dynamic and adapts to the trip state

- **Categorized library** -- the full catalog
  - Sections: *Planning · Destination · On the trip · Accessibility*
  - Each section: grid of tool cards (2-column mobile, 3-column desktop)
  - Each card: colored dot (category color), tool name, optional 1-line description, PRO badge when premium

- **No-destination banner**
  - If the trip has no destination set yet, a banner at the top reads: *"Set your destination to unlock smart tool suggestions"*
  - The library remains fully visible below

### "Useful right now" logic examples

- **Preplanning**: Weather, Jetlag Advisor, Doc Checklist, Packing Calculator
- **Packing**: Weather, Packing Calculator, Voltage & Plugs, Smart Suggestions (premium preview)
- **Travel day**: Voltage, Unit Converter, Emergency Contacts
- **Vacation day**: Phrasebook, Tipping Guide, Bill Splitter, Currency Converter
- **Wrap-up**: Unit Converter, Statistics tool

### Individual tool page pattern

- Back arrow to *Tools* in the header
- Tool name in Fredoka
- Short description of what the tool does
- Main tool UI (varies per tool)
- Premium tools on free tier: inline paywall card describing the tool value with an *Unlock* button

### Why smart surfacing plus full library

- The full tools library is broad and mostly dormant -- users should not have to hunt when the app knows the phase
- Pure categorized grid makes users do discovery work themselves
- Alphabetical lists are discovery-hostile
- Search-first is overkill for casual users
- Frequency-based ordering requires historical data that does not exist early on

---

## 17. Memory / Wrap-up -- Post-Trip Experience

**Status:** locked (2026-04-17)

Memory uses a **two-section stacked layout** -- a warm emotional recap on top, practical "loose ends" below. The two vibes stay visually separated so the celebration does not feel like a status dashboard.

### Top section: "Your trip in review"

Theme: warm, nostalgic, celebratory. Uses the trip's color and a softly pulsing filled ball. All content auto-generates from trip data.

- **Hero card** -- full-bleed
  - Trip ball at full fill with a nostalgic glow
  - Trip name in Fredoka
  - Dates subtitle and location
  - One-line celebration (auto-generated from stats)

- **Stats strip** -- grid of 4 to 6 stat tiles with colored icons
  - Examples: *12 events · $2,340 spent · 37 notes · 6 polls closed · 3 flights · 89 photos*

- **Highlights carousel** -- 3 to 5 auto-generated slides
  - Most-reacted note
  - Most-voted poll winner
  - Biggest expense day
  - First and last itinerary events
  - Photos (if added)
  - Each slide is a large visual card; swipe or scroll to browse

- **Post-trip poll card** (if generated)
  - *"What was your favorite moment?"*
  - Options auto-suggested from highlighted events
  - Results visible once everyone votes

- **Scavenger hunt / bucket list** (when wishlist items were marked bucket)
  - Shows completed items with celebration badges

- **Share recap CTA**
  - Primary button: *"Share trip recap"*
  - Generates a public read-only recap page
  - Free users see a *"TripWave"* watermark in the footer; premium users see none

### Bottom section: "Loose ends"

Theme: calm, clear, actionable. Reuses the standard app visual language.

- **Unsettled expenses card** (if any)
  - Personal net message and tap-through to the Expenses phase
- **Unresolved polls card** (if any)
- **Pending wishlist items** card
  - *"5 ideas didn't make it this trip -- want to save them for next time?"*
  - Secondary CTA: *"Save to trip templates"* (premium)
- **Archive action**
  - Moves the trip to the archive, hiding it from the active dashboard
  - Non-destructive; archived trips remain accessible from `/app/archive`

### Trip ball states during Memory

- On entering Memory: ball enters *nostalgic fade* state (soft pulse, reduced saturation)
- On archive: ball enters *dimmed* state, no animation

### Empty-shell state

If a trip is marked complete with effectively no activity, show: *"Short trip, huh? Enjoy the memories anyway."*

### Why two stacked sections instead of tabs or slideshow

- Completion is emotional -- the app should celebrate before asking for paperwork
- Tabs hide the celebration behind a click
- Auto-advancing slideshows force users through an intro before they can handle their to-dos
- Splitting the feature across phases would dilute the purpose of Memory
- Two-section layout lets users linger in the recap and see loose ends without context-switching

---

## 18. Invite Flow -- Organizer's Side

**Status:** locked (2026-04-17)

The organizer's invite screen combines **share options plus invited-list dashboard** on a single page. Handles initial sharing, follow-up, and permission management all in one place.

### Page structure

- **Header**
  - Back arrow to the trip overview
  - Title *Invite your crew* in Fredoka
  - Subtitle: *"Only people with the link or code can join."*

- **Share card** (top) -- pastel cyan background with trip name echoed
  - **Invite link** in a monospace text box with *Copy* button
  - **Invite code** (human-readable, e.g., `SUSHI-2025`) with *Copy* button
  - **QR code** -- centered, large enough to scan
  - **Share action row**: *Text message · Email · WhatsApp · Copy link · More...*
  - Note: *"Link and code are the same thing -- one to paste, one to type."*

- **Permission preset strip**
  - Subtle row: *"New joiners get the [Standard] preset"*
  - Presets available: *Standard · View-only · Trusted (can edit anything)*
  - Tap to change default for anyone joining via this link

- **Invited list** -- *Who's in*
  - *Joined* sub-list: avatars + names + permission badges + three-dot menu (Change permissions, Remove from trip)
  - *Invited but not joined* sub-list: placeholder avatars + optional name + *Resend* + *Revoke*
  - Totals line: *"3 of 5 have joined"*

- **Footer**
  - Secondary action: *Regenerate invite link / code*
  - Note: *"Regenerate if someone who shouldn't have it got the link."*

### Copy tone

- Warm and slightly sassy: *"One link. Zero group chats."*
- No alarming security language -- the short explanatory note is enough

### Why a hybrid one-page layout

- Single-link modal cannot handle the "who joined?" follow-up
- Link-plus-code-plus-QR modals ignore post-invite status
- Contact-based flows require Apple/Google contacts permissions and SMS/email sending infrastructure -- too much early plumbing
- List-only dashboards separate sharing from status
- One page covers the entire lifecycle: share now, see who joined, invite more, manage pending

---

## 19. Invitee Join Flow -- Landing Experience

**Status:** locked (2026-04-17)

Invitees tapping a TripWave invite link land on a **branded Join page themed to the trip** before any authentication. The page honors the emotional moment before asking for an account.

### Landing page structure

- **Background**
  - Pastel tinted to the trip's ball color (subtle, not full saturation)
  - Decorative brand-color circles matching auth-page treatment

- **Hero block** (center)
  - Trip ball at current fill % with wave-pulse animation
  - Playful invite line: *"[Organizer name] invited you to"*
  - Trip name in large Fredoka
  - Dates subtitle (if set): e.g., *"April 1 -- April 14, 2025"*
  - Destination subtitle (if set): e.g., *"Tokyo, Japan"*
  - Traveler avatars row: *"You + 3 others"*

- **Action buttons**
  - Primary: *Sign up and join* (cyan pill, shadow for tactility)
  - Secondary: *Already have an account? Log in* (text link)

- **Footer micro-text**
  - *"TripWave -- plan the trip, not the group chat."*
  - Tiny TripWave logo mark linking to the marketing site

### Preview-only fields on the landing page

Only these fields are visible before auth:
- Trip name, trip ball, dates, destination, traveler count, organizer name

Itinerary, expenses, and internal planning details are **not** visible until the user joins.

### Post-auth join moment

After signup or login completes:
- Brief confirmation splash: *"Welcome to [Trip Name]"* with one ball pulse
- Routes to the trip overview (established layout, not brand-new onboarding)
- First-session banner at top: *"You're in! Add your dietary needs, mobility, and emergency contact in your traveler profile."* -- tap opens profile editor
- Banner disappears permanently once dismissed or completed

### Invalid or revoked links

- Page still loads with branding
- Shows: *"This invite has expired."*
- Primary action: *"Contact the trip organizer for a new invite"*
- No generic error page

### Why a branded themed landing

- The invite is an emotional nudge -- first screen should honor that moment
- Cold login strips the warmth and makes the invite feel like a SaaS funnel
- A long marketing interstitial is the wrong moment (invitees want to join, not learn)
- Auth-first loses context before context is given
- Anonymous preview violates the account-required access rule

---

## 20. Mobile Phase Navigation

**Status:** locked (2026-04-17)

On mobile, the trip workspace uses a **horizontal scrollable pill bar** pinned below the top nav. Every phase is reachable in one tap. Desktop retains the left sidebar unchanged.

### Pill bar anatomy

- Positioned directly below the 54px top nav, approximately 44px tall, sticky during scroll
- Horizontal scroll with momentum; snaps to pill centers
- Active phase auto-scrolls into view so the user always sees where they are
- Subtle gradient fade on the right edge when there is more to scroll

### Pill design

- Rounded shape, 28 to 32px tall
- Colored circle icon on the left (reusing the same colored-circle-icon pattern as the desktop sidebar)
- Phase name text (may truncate -- e.g., *"Travel Day"* becomes *"Travel"*)
- **Active state**: bright colored background (phase color), white icon, white text, subtle bottom glow
- **Inactive state**: pale gray background, colored icon, gray text

### Phases included (in order)

**Main:** Overview · Setup · Preplanning · Itinerary · Packing · Travel Day · Vacation Day · Expenses

**Extras:** Polls · Wishlist · Notes · Tools · Vault · Memory

**Settings:** Members · Settings

### Optional enhancement

Quick-jump dots above the pill bar (like carousel dots) representing phase groups (Core / Extras / Settings) -- tap a dot snaps the pill bar to that group.

### Mobile shell stack (top to bottom)

1. Top bar (54px): logo mark, trip switcher pill with small ball and name, notification, avatar
2. Phase pill bar (44px): current phase highlighted
3. Main content area
4. Bottom: FAB (when relevant per phase) or ad banner (free tier)

### Desktop behavior

- Left sidebar phase nav remains primary
- Pill bar does not appear on desktop

### Accessibility

- Pill bar is keyboard-accessible (arrow keys to move, Enter to activate)
- Screen reader labels each pill with phase name and *"Phase X of Y"*

### Why a horizontal pill bar

- Every phase is one tap away -- no buried menus
- Colored pills teach the phase-color language by repetition
- Auto-scroll keeps users oriented
- Bottom tab bars force picking four "winners" that do not match every trip state
- Hamburger menus hide the map of the trip
- Dropdowns and multi-step sheets add friction to every phase change

---

## 21. Permissions -- Organizer Member Management

**Status:** locked (2026-04-17)

The member management page uses a **preset-with-override hybrid** -- per-user preset dropdowns that expand into individual toggles on demand. Power and simplicity in one page.

### Page structure

- **Header**
  - Back arrow to trip settings
  - Title *Members* in Fredoka
  - Subtitle: *"Who's in this trip and what they can do."*
  - Secondary button: *Invite more*

- **Member list** -- vertical list of cards
  - Each card contains:
    - Left: avatar, name, role badge
    - Right: preset dropdown (*Organizer · Trusted · Standard · View-only · Custom*)
    - Below the preset: *Customize* text link that expands the inline toggle panel
  - When customized, preset shows as *Custom*
  - Organizer role cannot be demoted -- only transferred via a separate action

### Preset definitions

Visible when the user taps a *What does [preset] mean?* hint:

- **Organizer**: full control, trip owner
- **Trusted**: can do everything except transfer ownership
- **Standard** (default): can add itinerary items, add expenses, vote, post notes, add to wishlist
- **View-only**: can view everything but cannot edit, add, or vote
- **Custom**: any individual toggle combination

### Inline customize panel

Toggles grouped into sections:

- **Itinerary**: add items, edit items, delete items
- **Expenses**: add expenses
- **Polls**: start polls, vote on polls
- **Social**: post notes, add to wishlist, view group packing list
- **Administrative**: invite others

Each toggle has a short description below it. Panel includes *Save* and *Reset to preset* actions.

### Member card menu (three-dot)

- *Transfer ownership to [name]* -- triggers a confirmation modal
- *Remove from trip* -- triggers a confirmation modal explaining the action. Removed members lose access, but their contributions (itinerary items, expenses, notes) remain with an anonymized grayed-out avatar

### Empty state

If only the organizer is in the trip, show their card plus a banner: *"Only you here! Invite your crew to start collaborating."*  with an *Invite more* CTA.

### Why preset-plus-override

- Presets cover the 80% case with one tap (*"my sister is trusted, my nephew is view-only"*)
- Customize preserves fine-grained control for unusual setups
- Matrix tables feel cold and spreadsheet-y
- Dedicated pages per user are too heavy for simple cases
- Preset-only is too rigid for mixed-trust groups
- Feature-scoped controls spread the mental model across every phase

---

## 22. Premium Upgrade Prompts -- Style and Placement

**Status:** locked (2026-04-17)

Premium prompts come in two forms -- **inline support cards** as the default, and **moment cards** elevated at high-intent contextual triggers. Premium is framed throughout as a **warm thank-you for supporting the app**, not a value-extraction purchase.

### Brand framing

Every premium surface follows the same tone:

- TripWave is built by one person
- Ads exist because servers cost money, not because they are good UX
- Premium is how users *say thanks*; in return they get no ads plus some fun bonus features
- The sassy-warm vibe: *"Sorry about the ads. Running apps like this costs money and I'm one person."*
- Never "unlock powerful tools" -- always "support the app and get a thank-you"

### Inline support card (default state)

Appears wherever a premium bonus feature would normally live, replacing the feature's entry point.

- Cyan-tinted card background (warm, not alarming)
- Small ♥ icon in the top-left (cyan)
- Feature name in bold
- 1-sentence framing: e.g., *"Receipt scanning is a bonus thank-you for premium supporters. $7.99 once."*
- Right side: *Support + unlock* pill button (cyan with yellow shadow)
- Optional tiny footer: *"$7.99 once. No subscriptions. No corporate anything."*

Example placements:

- Expenses: support card in place of the *Scan receipt* button
- Currency converter tool: support card replacing tool UI, with a preview faded behind
- Offline mode: support card in Settings next to a disabled toggle preview
- Smart suggestions: support card in the Tools hub's *Useful right now* row
- Dream Mode (at the 1-dream cap): support card at creation time

### Moment card (elevated high-intent state)

Appears inline within the relevant phase at specific contextual triggers -- never as a modal.

- Larger, full-width card
- Warm pastel background tinted with the trip's color
- Context-aware honest headline: *"Sorry about the ads, and about this one."*
- Explanation that names the solo-dev reality: *"You're offline, 30 minutes from the airport. For $7.99 you can read your itinerary and vault without wifi, forever. You also help the app stay alive. I'm one person running this, and I'd appreciate it."*
- Primary action: *Support the app -- $7.99* (large button)
- Secondary action: *Maybe later* (small text link)

Example triggers:

- User opens app offline and isn't premium: moment card on trip overview
- User taps a currency field in an international expense entry
- User has logged 5+ expenses without using receipt scan
- User about to archive a trip: *"Save this as a template"* moment card (framed as a bonus gift)

### Ad-free / prompt-free zones

Premium prompts never appear during:

- Travel day focus mode
- Vacation day quick actions
- Brand-new trip onboarding overview
- Settlement actions

### Tone rules

- Always frame premium as **support + thank-you gift**, never as feature unlock
- Always acknowledge the ads openly: *"Sorry about the ads."* is acceptable opener copy
- Always reference the one-time $7.99 nature explicitly
- Always name the solo-dev reality: *"I'm one person."*
- The ♥ glyph is the brand signature on premium surfaces
- The free tier must remain fully useful -- the app genuinely works free
- Forbidden: *"Unlock powerful tools"*, *"Upgrade to premium"*, *"You'll love what you get"*, *"Save the trip"*, any scarcity-language, any implied-deficiency language

### Purchase flow

- Tapping a *Support* button opens a slide-up sheet on mobile / modal on desktop
- Sheet has two sections:
  - **Headline**: *"Sorry about the ads."*
  - **Body**: *"They exist because servers, databases, and one developer's rent all cost money. Premium is how you say thanks -- no more ads, plus some bonus features as a gift. $7.99, once, forever. No subscriptions, no guilt, no corporate anything. Just me and you. ♥"*
  - **Bonus reveal**: *"As a thank-you: [list of bonuses]."*
- Primary button: *Support TripWave -- $7.99*
- Payment: Apple/Google Pay (native app), Stripe (web)
- Post-purchase: trip ball does a celebration burst; toast confirms *"You're a supporter now. Thank you ♥"*

### Why the supporter framing

- Emotional purchases (affection, gratitude, support) convert better than rational feature-comparison purchases
- Reframes ads from "intrusive" to "understandable" -- users stop resenting them once they know the why
- Differentiates TripWave from corporate-software pricing language in a saturated market
- Matches the solo-dev reality -- honest, disarming, warm
- Plays to a specific user psychology: people who would never pay a corporation $7.99 will happily pay a creator they like

### Why inline plus moment cards

- Inline cards respect in-progress work and never interrupt
- Moment cards capture genuine high-intent conversion windows
- Modal takeovers are punishing and the docs explicitly forbid them
- Auto-redirects disrupt flow
- Persistent banners erode trust and feel tacky

---

## 23. Ad Placement -- Free Tier

**Status:** locked (2026-04-17)

The free tier shows ads via two formats -- a **persistent bottom banner** (Cozi-style) plus **native card ads** injected into long content feeds. Premium users see no ads ever.

### Bottom banner anatomy

- **Size**: 50px tall on mobile, 60px on desktop, full width
- **Position**: fixed at bottom of the viewport, below FABs but above scrollable content
- **Content**: AdMob adaptive banner (mobile app), Google AdSense responsive unit (web)
- **Background**: white or very light gray with a 1px top border
- **Ad label**: tiny *"Ad"* text in the top-left corner with an info icon
- **Close button**: tiny X in the top-right to dismiss for the session
- **Upsell hint**: small *"Remove ads for $7.99"* text link on the right side of the banner, opens the Premium sheet on tap

### Native card ads (in long feeds)

- Inserted at roughly positions 4, 12, and 20 in long scrollable lists
- Feeds where they appear:
  - Itinerary (all days combined)
  - Notes feed
  - Expenses ledger (below the balances hero, inside the ledger)
  - Polls list (between active and closed polls)
- Styled to match the feed card anatomy but clearly labeled *"Ad"* with a small gray corner badge
- Tap opens the ad per standard AdMob / AdSense behavior
- Never inserted into: Members list, Vault, Settings

### Ad-suppression zones

Banner and native cards are hidden entirely during:

- Travel day focus mode
- Vacation day morning briefing card view
- Expense entry modal
- 4-step trip creation flow
- Invite join landing page
- Memory hero recap section (ads appear only in loose-ends below)
- Trip ball modal
- During the first minute of a brand-new user's session

### Performance rules

- Banner lazy-loads after first content paint (no LCP impact)
- Native cards only render when scrolled into view
- On slow connections or ad-block detection: banner area collapses silently, no placeholder

### Why a hybrid banner plus native cards

- Banner delivers baseline impressions at scale
- Native cards catch eyes in longer feeds where the banner gets banner-blindness
- Suppression rules protect the moments that matter most
- Visible *"Remove ads for $7.99"* hint turns every ad into a conversion opportunity
- Premium users see neither format

---

## 24. Trip Overview -- Established Trip State

**Status:** locked (2026-04-17)

For the majority of a trip's life (post-creation through post-completion), the overview uses a **single flexible layout with state-aware content**. Same regions adapt by trip state (Planning / Ready / In-progress / Completed) rather than each state getting its own page design.

### Page structure (top to bottom)

- **Trip hero strip** -- full-width, background tinted with the trip's ball color at low saturation
  - Large trip ball on the left
  - Trip name (Fredoka, big)
  - Destination subtitle
  - Date range
  - Countdown chip: *"42 days away"* / *"Tomorrow"* / *"Day 4 of 14"* / *"Came back 3 days ago"*
  - Ball state reflects current phase (pulsing, glowing, nostalgic, etc.)

- **Stats row** -- once data exists to show
  - 3 to 4 compact stat tiles: Planned %, Days away / Day X of Y, Travelers count, Total spent or Budget used
  - Colored accents matching phase associations

- **Primary next action card** -- always present, adapts to state
  - Planning: *"Next: add your flight info"* routes to the relevant preplanning section
  - Ready: *"Travel day is tomorrow. Review your checklist"* routes to Travel Day
  - In-progress (rare, since Vacation Day auto-routes): *"Today: 3 events starting with breakfast"* routes to Vacation Day
  - Completed: *"Settle up with Mom and Sarah"* or *"Revisit your trip"* routes to Expenses or Memory
  - All-clear fallback: *"You're all set. Anything else?"* with quick-action chips

- **Blockers card** -- conditional, only when blockers exist
  - Pink-accented list of unresolved risks: passport expiring, no travel day plan, missing hotel confirmation, etc.
  - Each item taps to the fix location

- **Recent activity feed** -- compact
  - Horizontal scrollable chips showing the last 5 to 10 group actions
  - Examples: *"Sarah joined"*, *"Mom added dinner idea"*, *"Poll closed: Torikizoku wins"*, *"Chris logged $80 for taxi"*
  - Each chip taps to the source

- **Quick jump grid** -- optional lower priority
  - 6 small tiles linking to the phases most useful in the current state:
    - Planning: Preplanning, Itinerary, Packing, Wishlist, Members, Settings
    - Ready: Travel Day, Packing, Itinerary, Vault, Members, Settings
    - In-progress: Vacation Day, Expenses, Vault, Notes, Members, Settings
    - Completed: Memory, Expenses, Notes, Vault, Members, Settings

- **Bottom CTA** -- conditional
  - Planning at ball 90%+: *"Mark trip as ready to advance"*
  - Trip ended but not archived: *"Close this trip and open Memory"*
  - In-progress: no bottom CTA

### Transition from brand-new to established

- Brand-new onboarding overview shows while `trip.hasAnyPreplanningData === false`
- On the first field filled (or any trip data added), the overview re-renders into this established layout
- No dismiss flag, no animation required

### Ball states on overview

- Planning: pulsing wave-pulse
- Ready: glowing with subtle shadow bloom
- In-progress: slower softer pulse, vacation glow
- Completed: nostalgic fade, reduced saturation

### Responsive behavior

- Desktop: wider hero, 4-tile stats row, recent activity and quick-jump grid can be side-by-side
- Mobile: single column vertical stack, everything scrolls
- No layout divergence beyond standard responsive rules

### Why one flexible layout

- Fully state-specific layouts would be a maintenance nightmare (4+ distinct page designs for one route)
- Widget-grid dashboards feel corporate and allow messy personalization
- Minimal link pages underserve the trip's home
- Feed-based layouts bury the primary next action

---

**Status:** locked (2026-04-17)

When a user lands on a trip overview for a **brand new trip** (draft status, no preplanning data yet), the page uses a **dedicated onboarding layout** -- not a zeroed-out version of the established-trip layout.

### Onboarding overview contents

- **Huge dashed-outline ball** centered (user's chosen color tints the dashes faintly)
- Warm, playful greeting copy: *"Say hi to [Trip Name]. It's brand new and very excited."*
- **ONE primary action card** -- full brand color, high visual weight
  - Label: "Start preplanning"
  - Small ball icon that rolls toward the preplanning icon on hover / tap
  - Routes to the preplanning wizard
- **ONE secondary action card** -- smaller, quieter, clearly de-emphasized
  - Label: "Invite your crew"
  - Routes to the invite flow
- No stats row -- zeros are depressing
- No quick-action buttons for itinerary, expenses, packing, etc. -- those don't matter yet

### Transformation rule

The onboarding overview layout is shown **only** while the trip has no preplanning data. The moment the user completes any preplanning field (or any other trip data is added), the overview transforms into the state-rich "established trip" layout.

The transformation is immediate on next render. There is no dismiss button or hidden "welcome" flag.

---

## 25. Notifications and Alerts -- Surfacing Pattern

**Status:** locked (2026-04-17)

Notifications use a **combination of in-app surfaces** with push notifications added once the native app ships. **No email or SMS notifications** will be sent from TripWave except the password reset email. No phone, text, or email setup is required to use the app.

### Tier 1: Bell icon in top nav

- Already present in the TopNav with a pink dot for unread state
- Tap opens a panel -- sheet on mobile, dropdown on desktop
- Lists all in-app notifications grouped by *Today*, *This week*, *Earlier*
- Each notification: colored category dot, short text, relative timestamp, tap-through action
- *Mark all read* action at the top
- Notifications persist until dismissed or until their triggering event resolves (e.g., a settled expense clears the corresponding "you owe Mom" entry)
- Pink unread dot on the bell badge; count number shown on desktop only

### Tier 2: Real-time toasts

- Appear when the user is actively in the app and a group event happens
- Slide in from bottom-right on desktop, bottom-center above the ad banner on mobile
- Dismissible with a 5-second auto-hide
- Examples: *"Sarah joined your trip"*, *"Mom paid the taxi expense"*, *"Poll closed: Torikizoku wins"*
- Toast tap routes to the relevant location
- Toasts are mirrored into the bell panel automatically

### Tier 3: Dashboard action center

- *Needs your attention* section on the dashboard (specced earlier)
- Pulls from the same notifications pool but shows only actionable items
- Informational notifications (someone joined, someone added a wishlist idea) live only in the bell panel, not here

### Tier 4: Push notifications (native app only)

- Added when the native iOS / Android app ships -- not in the web MVP
- Opt-in only, requested after meaningful first trip activity
- Used for high-value reminders: travel day tomorrow, poll closing in 1 hour, unresolved settlement 7 days post-trip

### What TripWave explicitly does NOT send

- No outbound email notifications (except password reset)
- No SMS
- No phone verification
- No email verification loop on signup -- email is used only for login identity and password reset
- No daily or weekly digest emails

### Notification categories and colors

- **Travel urgency** (travel day, flight tomorrow): pink
- **Social** (someone joined, new poll, new wishlist idea): cyan
- **Financial** (expense logged, settlement needed): green
- **Activity** (reactions to your note, votes on your idea): yellow
- **System** (premium, security): charcoal

### Never-notify rules

- User's own actions never trigger a notification
- Archived trips never generate notifications
- Trips where the user is View-only and has no action to take are silent

### Notification preferences

- In-app notifications: always on, not user-configurable
- Push notifications (future): opt-in at OS level, per-trip mute in Settings
- Email notifications: not offered; only password reset uses email

### Why in-app-only plus future push

- Reduces external dependency scope for the MVP -- no email deliverability tuning, no SMS provider contract
- Users do not need to hand over a phone number to collaborate
- Push is the right long-term channel for travel-day urgency when the user is not in the app
- Email becomes noise for most users; only password reset justifies the infrastructure

---

## 26. Trip Switcher -- Top Nav Dropdown

**Status:** locked (2026-04-17)

Inside any trip workspace, tapping the trip-name pill in the top nav opens a **dropdown menu** listing the user's other trips. The industry-standard workspace switcher pattern.

### Dropdown anatomy

- Aligned below and right-aligned to the trip-name pill
- **Current trip row** (top, grayed out for context): small ball + name + *(current)* label
- **Other trips section**
  - Each row: small colored ball at current fill %, trip name, subtitle with countdown or date range
  - Tap routes to that trip's overview (or its recommended phase, per dashboard hero logic)
- **Footer links**
  - *All trips* routes to `/app` dashboard
  - *New trip* with a + icon opens the trip creation flow

### Desktop behavior

- Hover the pill subtly highlights it
- Dropdown appears on tap or click, dismisses on outside click or Escape

### Mobile behavior

- Tap opens the same dropdown but can expand to full-width sheet if the dropdown would overflow narrow screens
- Dismisses on tap outside or swipe down

### Why a dropdown

- Most users have 1 to 3 active trips -- dropdowns fit that scale
- Modals and sheets are overkill for a nav interaction
- Side drawers conflict with the desktop sidebar
- Forcing a return to the dashboard doubles the taps for every switch
- Command palettes are power-user-only and fragment the mobile and desktop experience

---

## 27. Empty States -- Unified Skeleton with Per-Feature Playful Variations

**Status:** locked (2026-04-17)

All empty states across TripWave share a **unified skeleton** (consistent layout) with **per-feature illustrations and copy** (distinct personality). Users learn the pattern after seeing two or three features while each feature keeps its own warmth.

### Shared skeleton

- Centered vertical layout
- **Illustration**: 96 to 120px, circular composition where possible, ball-as-motif reused
- **Headline**: Fredoka, short and playful (max 8 words)
- **Description**: 1 or 2 sentences in Nunito gray explaining what belongs here and why it matters (max 25 words)
- **Primary CTA button**: brand cyan pill, one clear action
- **Secondary action** (optional): small text link
- **Collaborative indicator** (when relevant): tiny chip above or below the CTA reading *For everyone* or *Just you*

### Illustration rules

- Line art or flat shapes only, brand colors only
- No photos, no 3D, no dependence on user data
- Static initially -- gentle float or pulse can be added later
- Circular composition whenever possible, ball-as-motif preferred

### Tone rules

- Playful without being cutesy
- Warm, never scolding -- phrasing like *"you haven't done X"* is forbidden
- Headline max 8 words; description max 25 words
- CTA must spell out the first action -- never make users guess
- Empty state is a feature, not a failure -- never imply something is wrong

### Per-feature empty-state copy catalogue

- **Dashboard (zero trips)**
  - Illustration: dashed ball with small colored dots orbiting
  - Headline: *"Every great trip starts with a name."*
  - Description: *"Create your first trip and we'll help you plan it from first idea to last receipt."*
  - CTA: *Create your first trip*

- **Itinerary (no events)**
  - Illustration: empty day card with the ball peeking out
  - Headline: *"Let's fill these days."*
  - Description: *"Add flights, dinners, activities. Anyone in your group can chip in."*
  - CTA: *Add your first event*
  - Chip: *For everyone*

- **Packing, My list**
  - Illustration: open suitcase with a small ball tucked inside
  - Headline: *"No items yet. Start with the essentials."*
  - Description: *"Add what you're bringing. Share what matters with the group."*
  - CTA: *Add an item*
  - Chip: *Just you*

- **Packing, Group list**
  - Illustration: suitcase with colored dots representing group members
  - Headline: *"Nothing shared yet."*
  - Description: *"First aid kit? Beach umbrella? Group snacks? Add it here and claim it."*
  - CTA: *Add a group item*
  - Chip: *For everyone*

- **Wishlist**
  - Illustration: wishing star beside the ball
  - Headline: *"What would make this trip unforgettable?"*
  - Description: *"Drop ideas here. The group can react, and the best ones become real plans."*
  - CTA: *Add the first idea*
  - Chip: *For everyone*

- **Polls**
  - Illustration: paper ballot with the ball peeking from behind
  - Headline: *"No polls yet. What should the group decide?"*
  - Description: *"Tough call on where to eat? Let the group vote."*
  - CTA: *Start a poll*
  - Chip: *For everyone*

- **Notes**
  - Illustration: notepad with the ball as the dot of an *"i"*
  - Headline: *"Post reminders, tips, and thoughts."*
  - Description: *"Your group can reply and react. Tie a note to an event if it helps."*
  - CTA: *Add your first note*
  - Chip: *For everyone*

- **Vault**
  - Illustration: vault door slightly ajar with a ball peeking out
  - Headline: *"Tickets, passports, confirmations."*
  - Description: *"One calm place for all the stressful paperwork."*
  - CTA: *Add your first doc*
  - Chip: *Visibility varies per doc*

- **Expenses**
  - Illustration: coin with a small ball stamped on it
  - Headline: *"Log the first expense."*
  - Description: *"Track what everyone spends, split fairly, settle later. Starts from day zero."*
  - CTA: *Log an expense*
  - Chip: *For everyone*

- **Travel Day (during planning, empty)**
  - Illustration: paper airplane with the ball as the nose
  - Headline: *"Pick your travel days."*
  - Description: *"Add the days when you're actually moving -- we'll build checklists for them."*
  - CTA: *Mark a travel day*

- **Vacation Day (before trip starts)**
  - Illustration: sun icon with the ball
  - Headline: *"Your trip hasn't started yet."*
  - Description: *"Once you're on the road, this page becomes your daily briefing."*
  - CTA: *See the itinerary*

- **Tools (destination not set)**
  - Small banner, not a full empty state: *"Set your destination to unlock smart tool suggestions."*

- **Memory (trip not completed)**
  - Full empty state: *"Memory opens when the trip ends. We'll summarize it automatically."*
  - Ball shown in normal state (not nostalgic fade)
  - CTA (if trip is today or in the past): *Close this trip and open Memory*

---

## 28. Traveler Profile -- Account-Level Defaults with Per-Trip Overrides

**Status:** locked (2026-04-17)

Traveler profile data is captured at **two levels**: account-level defaults and per-trip overrides. Users fill once at the account level; the info auto-pre-fills every new trip's profile. Users can override specific fields per trip when a particular trip needs different info.

### Account-level profile (`/app/account/profile`)

Fields:
- Displayed name
- Avatar
- Email (read-only after signup)
- Dietary restrictions (checklist + free-text "other")
- Allergies (free-text chips)
- Mobility or accessibility needs (free text)
- Medical considerations (free text)
- Default emergency contact (name, phone, relationship)
- Passport expiry date (optional; feeds blocker detection)
- Default home currency
- Preferred units (metric / imperial)

### Per-trip profile

Same fields as account-level, scoped to a specific trip. Accessible from:
- The post-join banner on first entry into a trip
- `/app/trips/[tripId]/settings/members` → *Edit my profile*

### Per-trip editor layout

- Header: back arrow, title *"Your profile for [Trip Name]"* in Fredoka, subtitle *"Only visible to you and the organizer."*
- Single long scrollable form (same pattern as preplanning section editors)
- Sections grouped: *Basics · Health and diet · Accessibility · Emergency contact · Travel docs*
- Each field shows its account-level default as gray pre-fill
- Overridden fields show a small label: *Synced from account* or *Overridden for this trip*
- *Reset to account defaults* link at the top
- Autosave on low-risk fields; explicit save on emergency contact for safety

### Privacy defaults

- All profile fields default to **visible only to self and the organizer**
- Users can opt-in to share specific fields with the whole group (dietary restrictions are a common share)
- Emergency contact requires explicit opt-in per trip
- Avatars, display names, and trip-relevant reactions are always group-visible

### Account page placement

- `/app/account` shows a profile summary card
- Tap routes to `/app/account/profile` for the full editor
- Changes to account-level defaults do not retroactively overwrite existing per-trip overrides

### Why a hybrid

- 80% of users have info that does not change trip-to-trip; one-time entry is enough
- Some info genuinely varies per trip (emergency contact, dietary needs for a health-focused trip)
- Single-profile-only would miss edge cases
- Per-trip-only would frustrate repeat users with redundant data entry
- Two-tier model keeps defaults effortless while preserving flexibility

---

## 29. Trip Settings -- Page Structure

**Status:** locked (2026-04-17)

Trip settings uses **sub-route pages with secondary navigation** on desktop, and a **card list of categories** on mobile. Each settings category is a focused sub-route deep-linkable on its own.

### Categories (each a sub-route)

1. **Trip info** (`/settings`)
   - Trip name, destination, dates, description
   - Trip color (ball color picker)
   - Country / region, time zone
2. **Members** (`/settings/members`) -- specced separately
3. **Invites** (`/settings/invites`)
   - Invite link, human-readable code, QR
   - Permission preset for new joiners
   - Regenerate link
4. **Preferences** (`/settings/preferences`)
   - Default currency for this trip
   - Preferred units (inherits from account, overridable)
   - Ball animation toggle
   - Show-ads toggle (locked for free users, shown as an upsell)
5. **Advanced** (`/settings/advanced`) -- premium-gated actions
   - Trip duplication
   - Trip export
   - Save as trip template
6. **Danger zone** (`/settings/danger`)
   - Archive trip (reversible)
   - Delete trip (permanent, requires typing the trip name)
   - Leave trip (non-organizers)

### Mobile navigation

- Tapping *Settings* in the phase pill bar lands on a main card list of categories
- Each category card: icon, name, brief subtitle, chevron
- Standard back-stack navigation for deep links

### Desktop navigation

- Secondary sidebar (80 to 200px wide) appears on the settings route, listing categories
- The top-level phase sidebar dims but remains accessible
- Breadcrumb at top: *Trip · Settings · Members*

### Danger zone styling

- Pink-bordered section
- Each destructive action has its own confirmation flow
- Delete-trip uses a full modal requiring the trip name typed exactly; outside-click cannot dismiss

### Why sub-routes

- Each setting concern gets a focused page
- Deep-linking to a specific category is trivial
- Clean back-button behavior
- Scales gracefully as more settings are added without cluttering tab bars or creating long scrolls

---

## 30. Landing Page (`/`) -- Fun and Interactive on Neon-on-Dark

**Status:** locked (2026-04-17)

The landing page uses the **neon-on-dark brand direction** with three layers of delightful interactivity: an interactive hero ball that responds to touch, scroll-driven ball storytelling through the page, and one small easter egg for playful visitors.

### Layer 1: Interactive hero ball (visible to everyone)

- Hero ball sits on the right side of the viewport, glowing neon cyan against the near-black background
- **Hover (desktop) / tap (mobile)**: ball gently wobbles and emits an extra ripple. Glow intensifies ~25%
- **Drag (desktop) / long-press (mobile)**: ball rolls softly toward the cursor with a spring animation, showing the rolling animation from the design system
- **Release**: ball returns to its anchor point with a small settle-boing
- **Hold >2 seconds**: ball fills from 0% to 100% in real time with the wave-fill animation, then releases back to 0. Visitor can replay as often as they like

### Layer 2: Scroll-driven ball storytelling (rewards curious scroll)

As the visitor scrolls through the page, the hero ball shrinks and docks into the top-left corner, following them down the page like a little mascot.

- **Hero section**: full-size ball, glowing, all neon rainbow circles orbiting lazily in the background
- **"17 group chats" section**: docked corner ball reacts with a subtle shake at each stat reveal
- **Features grid**: small balls orbit each feature card in the card's phase color (cyan for itinerary, yellow for packing, green for expenses, pink for travel day)
- **Ball states showcase**: 4 balls fill in sequence as the visitor scrolls past
- **Dream Mode teaser**: a second sparkle-ball (neon purple) appears alongside the main docked ball -- *"dreams too"*
- **CTA section**: docked ball rolls back to center, doubles in size, and sits confidently under the *"Plan the trip. Not the group chat."* headline
- **Memory section**: ball takes on the nostalgic-fade treatment briefly

### Layer 3: Easter eggs (rewards playful visitors)

- **Triple-tap the hero ball**: ball gets sunglasses (🕶) for 3 seconds, then winks. Gentle bubble-pop sound if sound is enabled. Session counter tracks it (just for fun, not exposed)
- **Double-click the slogan "Get everyone on the same wave"**: text briefly does a wave motion, letters bob like they're floating on water
- **Scroll to the bottom and back up 3 times**: ball emits a small burst of rainbow confetti balls that fade out

### Visual treatment

- **Background**: base dark `#0A0A12` throughout with subtle animated radial gradients in neon colors that slowly drift (ocean-surface feel)
- **Body text**: pure white (`#FFFFFF`) at all times -- no gray-muted text anywhere on the landing page
- **Display headlines**: Fredoka font, pure white, one word per headline accented in a neon color
- **Neon accents**: rainbow used across the page with intention -- cyan for ball, yellow for stats impact, pink for the chaos moments, green for settlement/expense references, purple for Dream Mode teaser
- **Glow**: primary CTAs have subtle `box-shadow: 0 0 32px [neon]60` glows. Hero ball glows at all times. Feature cards glow subtly on hover only

### Motion rules (ocean, not electronic)

- All animations use ease-out curves (soft, water-dissipating)
- Wobble durations: 400-600ms (slow, organic)
- Ripple frequency on hover: 1.5s between ripples
- Scroll-driven animations throttled to 60fps, GPU transforms only
- `prefers-reduced-motion`: disables drag, wobble, confetti, and scroll-driven animations. Ball becomes a static glow with a very subtle 3.6s fade pulse only

### What to explicitly NOT do

- No parallax ocean gradient through the whole page (performance / distraction)
- No autoplay video of real trip footage (heavy, compresses poorly, off-brand)
- No popup on landing (*"Sign up for newsletter!"*) -- kills conversion
- No live user count or fake "social proof" numbers
- No countdown timer or scarcity messaging (violates brand rules)
- No pricing visible on the landing page (per the MONETIZATION.md discoverability rule)

### Page sections (order, top to bottom)

1. **Hero** -- interactive ball, slogan, tagline, signup CTA
2. **Chaos hook** -- "17 group chats. 4 spreadsheets. 3 people who still don't know the plan." stacked with neon color per line
3. **One wave** -- slogan reinforcement: *"Get everyone on the same wave."* with a calm ripple animation behind it
4. **Features grid** -- 4 category cards with orbiting mini-balls (preplanning, travel day, itinerary, expenses)
5. **Ball showcase** -- 4 filling balls to illustrate progression
6. **Dream Mode teaser** -- sparkle ball and a taste of the social share
7. **Memory teaser** -- nostalgic ball, the recap concept
8. **CTA** -- signup button, warm final pitch, solo-dev ♥ note

### Solo-dev time cost

- Layer 1 (interactive ball): 6-10 hours (drag math is the tricky part)
- Layer 2 (scroll story): 4-8 hours using CSS `scroll-timeline`
- Layer 3 (easter eggs): 1-2 hours
- Visual refresh to neon-on-dark: 4-6 hours of CSS token updates
- Total: ~15-25 hours for a landing page that doesn't look like anything else in the category

---

## 31. Signup Page (`/signup`) -- Fun First Commit Moment

**Status:** locked (2026-04-17)

Signup is the user's commit moment. The page introduces the ball as a character, delivers the solo-dev supporter framing warmly, and celebrates successful submission with a small fun moment. Single-step form -- no multi-step signup wizards.

### Page layout

- Base dark background (`#0A0A12`) with subtle neon orbital circles in the background (calm ambient, not busy)
- Centered column, ~400px max width
- Above the card: TripWave wordmark with small animated ripple logo

### Ball greeting (above the form)

- An empty dashed-outline ball in neon cyan hovers above the signup card
- Glows softly, does the slow wave-pulse
- Speech-bubble caption beside it: *"Hey! Let's get you set up."*
- Ball reacts to form focus:
  - Name field focus: gentle wobble
  - Email field focus: straightens up, attentive
  - Password field focus: subtle rotation away (privacy vibes)
  - Submit press (loading): slow spin
  - Success: celebration burst
  - Error: small sad-shake

### Solo-dev warm note (above first input)

Small italicized text in neon cyan:

> *"Built by one person. Promise I'm not a corporation trying to harvest your emails. ♥ -- Chris"*

### Form fields

- **Name**: placeholder *"What should we call you?"*
- **Email**: placeholder *"you@email.com"*
- **Password**: placeholder *"Something strong, please."*
- All inputs: dark elevated background, neon-cyan focus ring with glow
- Error states: neon pink text below the offending field

### Primary CTA

- Button label: *"Let's go"*
- Neon cyan background, bold white text
- Subtle glow at rest, intensifies on hover

### Post-submit celebration

- Ball emits a tiny rainbow confetti burst (~1 second)
- Ball fills from dashed to 100% briefly, then settles to a "ready" state
- Welcome toast slides in: *"Welcome aboard. Let's plan a trip. ♥"*
- After ~1.5s, smooth fade transition to `/app`

### Below the form

- *"Already have an account? Log in."* link
- Micro-footer: *"Your data is yours. We don't sell it, ever."*

### Tone rules

- Warm, slightly sassy, solo-dev honest
- First-person voice from the dev where appropriate
- No corporate language (*"Register"*, *"Create Account"*, *"Sign up to get started"*)

### What this page explicitly does NOT do

- No multi-step signup (single page, single submit)
- No "Continue with Google/Apple" social auth in v1 (OAuth scope too high for solo dev -- v1.5 consideration)
- No visible ReCaptcha (invisible only if needed)
- No newsletter opt-in checkbox (we do not send promotional emails)
- No required email verification blocking step (handled silently in background)
- No aggressive password-strength meter that blocks submission -- gentle warning only

### Accessibility

- Ball animations respect `prefers-reduced-motion`
- Form fields have proper labels and ARIA attributes
- Error messages announced by screen readers
- Tab order: Name → Email → Password → Submit → Login link

---

## 32. Login Page (`/login`) -- Minimal Warm Return

**Status:** locked (2026-04-17)

Login is a quieter moment than signup. Returning users want in quickly -- not to be sold to. The page applies the neon-on-dark treatment with restrained personality, matching the signup page's pattern so users learn the visual language once and recognize it everywhere.

### Page layout

- Base dark background (`#0A0A12`) with the same calm neon orbital ambient circles used on signup
- Centered column, ~400px max width
- TripWave wordmark with small animated ripple logo above the card

### Ball above the form

- Empty dashed-outline ball in neon cyan
- Glows softly, slow wave-pulse
- NOT interactive to form state (login has no "name" field to listen to, so no wobble-on-type behavior)
- Responds to hover (wobble) and triple-tap (sunglasses easter egg) -- consistent with landing and signup

### Copy

- **Headline**: *"Welcome back."* -- Fredoka font, pure white
- **Subtitle**: *"Your trips are waiting."*
- **Form fields**: Email, Password
- **Submit button**: *"Log in"* in neon cyan with subtle glow
- **Below the form**:
  - *"Forgot password?"* link
  - *"New here? Sign up free."* link
  - Small solo-dev footer: *"Still just me. Still free forever. ♥"*

### Error handling

- **Wrong password**: ball does the sad-shake, error text in neon pink: *"Not quite. Try again."* (warm, not scolding)
- Focus returns to the password field on error
- All errors are inline -- no blocking dismiss-required dialogs

### Success behavior

- On successful login: ball does the smallest celebration -- one quick brighter wave-pulse
- Smooth fade transition to `/app`

### What this page explicitly does NOT include

- No "Remember me" checkbox -- users are remembered by default unless they explicitly log out
- No "Login with Google / Apple" in v1 (deferred with signup social auth)
- No visible captcha UI
- No magic link / passwordless login (violates the email-only-for-password-reset scope rule)
- No countdown teaser or pre-auth trip preview (privacy concerns on shared devices)
- No rotating "welcome back" messages (login is not a moment for surprises)

### Consistency with signup

Login deliberately mirrors signup's visual pattern -- same ball placement, same wordmark, same solo-dev footer, same easter egg. Users learn the pattern once on signup and recognize it on login.

---

## 33. Dashboard (`/app`) -- Fun Treatment on Neon-on-Dark

**Status:** locked (2026-04-17)

The dashboard's structural layout (Next-up hero + trip list + action center) is already locked in section 2. This section adds the neon-on-dark treatment and three layers of fun that reward the returning user: a time-of-day greeting, a living trip-cards treatment, and a rotating stats flex card.

### Time-of-day greeting (top of page)

- Above the Next-up hero
- Fredoka font, neon cyan, medium size
- Format by local time (browser locale, no server round-trip):
  - **5am-11am**: *"Good morning, Chris."* / *"Rise and plan, Chris."* / *"Morning! Still dreaming?"*
  - **11am-5pm**: *"Good afternoon, Chris."* / *"Lunch-hour scroll, Chris?"*
  - **5pm-11pm**: *"Evening, Chris."* / *"Planning tonight?"*
  - **11pm-5am**: *"Still up, Chris?"* / *"Night owl planning. Respect."*
- Only one variant per page load
- Subtitle beneath in white: *"3 trips in the works"* or *"Your next adventure: 42 days"*

### Next-up hero (neon-on-dark treatment)

- Dark elevated card (`#15162A`)
- Outer glow in the trip's ball color (soft box-shadow, ~24px spread)
- Ball on the left wave-pulses and emits one gentle ripple every few seconds
- Countdown text in the trip's phase color
- Entire card is tap-target, routes to the trip's recommended phase

### Trip cards (living)

- Each card's ball gently wave-pulses on its own staggered rhythm -- not synced, more natural
- Left accent stripe in the trip's ball color with a soft inner glow
- Card background: elevated dark (`#15162A`)
- Hover / tap-preview: card lifts 2px with shadow expansion
- Countdown text flips to neon pink when the trip is within 7 days of start (urgency cue)

### Stats flex card (between trip list and action center)

- Small card, two-line format
- Big number in Fredoka with a neon color matching the stat's meaning
- Daily-refresh rotation of examples:
  - *"47 days of adventure planned"* (neon cyan)
  - *"12 travelers across your trips"* (neon pink)
  - *"$2,340 tracked across trips"* (neon green)
  - *"3 dream trips in your head"* (neon purple)
- Tone is warm reflection, not pressure
- Small "×" dismiss available for users who find it noisy -- dismissal persists for the session only

### Action center (neon treatment)

- Already specced structurally -- apply neon styling here
- Each item uses its category neon color as a small dot indicator:
  - Polls yellow (`#FFEB00`)
  - Expenses green (`#39FF6B`)
  - Travel pink (`#FF3DA7`)
  - Blockers pink
  - Social cyan (`#00E5FF`)
- New items shimmer briefly when they arrive during the session
- Tap routes to the source

### Ambient background motion

- Very subtle radial gradient in the background that slowly drifts over minutes (not seconds)
- Invisible unless the user is looking closely -- adds ambient "aliveness" without distracting
- Disabled under `prefers-reduced-motion`

### Easter egg

- Tap the greeting text (*"Good morning, Chris."*) three times
- Greeting cycles through localized joke variants: *"Bonjour, Chris."* → *"Aloha, Chris."* → *"Top of the morning, Chris."*
- Settles back to default after ~60 seconds
- Small, silly, rewards curiosity -- not a persistent setting

### What this page explicitly does NOT include

- No achievement badges or gamified planning milestones
- No overlay tutorial tips for new users
- No user-configurable dashboard widgets
- No TripWave-originated trip suggestions ("here are some destinations!") -- not a travel-content platform
- No fake social proof ("1,247 trips planned today!")
- No tile to "connect calendars" or OAuth integrations in v1

---

## 34. Trip Creation -- Fun Treatment on Neon-on-Dark

**Status:** locked (2026-04-17)

Trip creation's 4-step structure is already locked in section 3. This section adds the neon-on-dark treatment, a new Step 0 for trip type (Real vs Dream), and the fun-dial calibration: calm elegance with conversational warmth and reactive ball moments. Not exuberant -- users create many trips over time and peak-moment UX should feel proportional to repeat usage.

### Step 0 -- Trip type (new)

- Base dark background
- Two big side-by-side cards
  - Left: **Real Trip** with a normal cyan ball preview and a small airplane emoji ✈
  - Right: **Dream Trip** with a sparkle ball preview and a star emoji ✨
- Hover / tap: selected ball enlarges and glows
- Prompt: *"Let's start. Real trip or a dream?"* (Fredoka, white)
- Secondary: *"You can switch between modes later in trip settings."*
- Auto-advance on selection (no explicit next button)

### Step 1 -- Name

- Dashed empty ball in upper-center, glowing soft cyan
- Prompt: *"Let's name your trip!"* (Fredoka, white)
- Big input with neon-cyan focus ring
- Typing cadence: ball pulses once every ~3 characters typed
- On submit: ball does a small nod-forward animation
- Wipe to Step 2

### Step 2 -- Dates

- Ball moves to center-left, smaller than Step 1
- Prompt: *"When's the adventure?"* (Fredoka, white)
- Date range picker with neon-cyan highlights on dark elevated background
- No-pressure subtitle: *"Not sure yet? No pressure. You can add these later."*
- *Skip for now* text link equally weighted with submit
- Wipe to Step 3

### Step 3 -- Pick a color

- Ball centered, dashed outline
- Prompt: *"Give your trip a color."*
- Row of 5 glowing swatches: neon cyan, yellow, pink, green, orange (plus purple if Dream)
- Swatches enlarge and intensify glow on hover
- Tap a swatch: ball fills with that color in a 2-second rising-liquid animation
- Subtitle: *"You can change this later."*
- 1.5s dwell on fill so user enjoys the moment, then wipe to Step 4

### Step 4 -- Reveal

- Base dark with chosen color's soft radial gradient at edges
- Ball at full hero size, 100% filled, glowing intensely in chosen color
- Greeting: *"Meet [Trip Name]."* (Fredoka, white)
- Subtitle: *"Let's plan it."*
- CTA: **"Let's go"** in neon cyan with glow
- On submit: one big celebratory wave-pulse, fade to the trip overview

### Cross-step micro-interactions

- Each wipe transition uses horizontal slide with soft easing (300ms)
- Background color subtly shifts hue per step (~5% saturation change) for each step's mood
- Ball is always present but changes size and position -- a mascot following the user through
- Error states (empty name, invalid date): ball does a small sad-shake, error text in neon pink below the field

### Conversational copy examples

- Step 0: *"Let's start. Real trip or a dream?"*
- Step 1: *"Let's name your trip!"* → on submit brief toast: *"Nice one."*
- Step 2: *"When's the adventure?"*
- Step 3: *"Give your trip a color."*
- Step 4: *"Meet [Trip Name]."*

### What this flow explicitly does NOT do

- No progress bar or step indicator (ritual, not a process)
- No prominent back button (subtle back in top-left for re-edits, not emphasized)
- No skip-entire-flow shortcut
- No full fireworks / confetti parade on reveal (peak-moment UX stays proportional)

### Solo-dev time estimate

~10-15 hours incremental on top of existing scaffold.

---

## 35. Preplanning Hub -- Fun Treatment on Neon-on-Dark

**Status:** locked (2026-04-17)

Preplanning hub's structural layout (8 section cards, section picker) is already locked in section 4. This section defines the fun treatment on neon-on-dark: a ball-centric top with real-time fill, conversational section headlines, and warm completion moments. No gamification badges.

### Top: the ball, big and filling

- Base dark background
- Large trip ball at the top of the hub, ~180px
- Ball fills in real time using the trip's chosen neon color with glow
- Beneath the ball: *"[X]% planned"* in Fredoka white, phase-color accent on the number
- Small tagline: *"Each section fills a little more of your ball."*
- Tapping the ball opens the trip ball modal (existing behavior)

### Section cards

- 8 cards in a grid (2-column mobile, 4-column desktop)
- Each card is an elevated dark surface with a glowing neon icon
- **Card states**:
  - **Empty**: dim icon, subtle border, empty progress bar. Copy: *"Haven't touched this one yet."*
  - **In progress**: fully lit neon icon, progress bar (e.g., 4/9 fields), subtle glowing border. Copy: *"4 of 9 filled."*
  - **Complete**: bright icon with green checkmark overlay, soft green aura on card, full progress bar. Copy: *"All done. ♥"*
  - **Not applicable**: desaturated icon, subtle diagonal stripe pattern. Copy: *"Nothing for me to worry about here. ♥"*

### Conversational section headlines

Each section card shows a warm conversational headline with the formal name smaller below:

| Formal name | Card headline |
|---|---|
| Group composition | *"Who's coming with you?"* |
| Transportation | *"How are you getting there?"* |
| Accommodations | *"Where are you staying?"* |
| Budget | *"What's the budget looking like?"* |
| Destination info | *"What should we know about the place?"* |
| Documents and logistics | *"Any paperwork to sort?"* |
| Trip character | *"What kind of trip is this?"* |
| Pre-departure logistics | *"What about before you leave?"* |

### Completion feedback

On return to the hub after finishing a section:

- Just-completed card pulses green glow for ~2 seconds
- Ball at top fills with upward-wave animation to its new percentage
- One toast slides in: *"Group composition done. ♥"*

### Ready-to-go CTA

- Appears only when ball hits 90%
- Centered below the grid
- Primary button: *"Mark this trip as ready to go"* in neon cyan with glow
- Subtitle: *"You can still change anything later."*

### Completion state (100%)

- Single warm line below the ball: *"Look at you. Ready to roll."*
- Ball glows at full intensity
- All 8 cards show their complete state

### Easter egg

- **Double-tap the ball at the top**: ball briefly becomes translucent showing a cross-section with colored slices per section. Peek-under-the-hood moment. Fades back after 2 seconds

### Micro-interactions

- Hover / tap-preview on a card: 2px lift with shadow expansion
- Completion animation max 2 seconds end-to-end
- Ball fill uses wave-fill ease-out curve (not linear)
- Empty section icons shimmer subtly after the user has been on the hub for >30 seconds -- gentle nudge, never scolding

### Warm empty-state copy rotation

- *"Haven't touched this one yet."*
- *"When you're ready, this one's here."*
- *"Skip me if not relevant."*

### What this page explicitly does NOT do

- No achievement badges (*"Budget Boss!"*, *"Trip Master!"*)
- No sound effects on completion
- No scolding empty states
- No "recommended next section" arrow forcing order
- No time estimates (*"Takes 5 minutes"*)
- No confetti cannon on 100%
- No formal progress language (*"0 / 8 complete"* style) at the top -- the ball does that visually

---

## 36. Itinerary Page -- Fun Treatment on Neon-on-Dark

**Status:** locked (2026-04-17)

Itinerary structural layout (day-by-day vertical scroll, sticky day jumper, item cards with category left-stripes) is locked in sections 6 and 7. This section adds the neon-on-dark treatment with day-personality theming and a live "you are here" marker for in-progress trips.

### Sticky day jumper

- Horizontal strip of day pills on dark-elevated background
- Each pill: *"Day 1 Mon"*, *"Day 2 Tue"*, etc.
- Active pill: filled with the day's personality color + glow
- Today pill during in-progress trip: neon-orange border with live pulse animation
- Tap pill smooth-scrolls to that day
- Current visible day's pill auto-highlights as user scrolls

### Day header cards (personality-colored)

Each day's content determines its header color:

- Day with flights or travel-day event: **neon pink** (`#FF3DA7`)
- Day with restaurant reservations dominant: **neon yellow** (`#FFEB00`)
- Day with outdoor activities dominant: **neon cyan** (`#00E5FF`)
- Day with expense-heavy content: **neon green** (`#39FF6B`)
- Day with notes only / low content: neutral elevated dark (no color)
- Multi-category day: subtle left-to-right gradient of involved colors

Day header content:
- Big Fredoka text: *"Day 3 · Tuesday"*
- Date subtitle: *"April 10, 2025"*
- Weather icon + temp (when weather integration exists later)
- Tap day header to collapse the day's events

### Event cards

- Apply neon-on-dark treatment to the card anatomy already specced in section 7
- Left stripe in category color: activity yellow, reservation cyan, transport pink, note gray, expense-linked with green coin badge
- Card background: elevated dark (`#15162A`)
- Title in pure white Fredoka
- Time and location in white (secondary weight, still pure white)
- Tagged-traveler avatars on the right
- Tap opens edit modal (mobile) or expanded inline (desktop)

### Live "you are here" marker (in-progress trips only)

- Horizontal neon-orange line in the current day's section
- Sits above the next upcoming event
- Moves down as time passes
- Label: *"You are here -- next up in 45 min"*
- Absent on pre-trip or post-trip views

### Between-day separators

- Thin dashed neon-cyan line between days
- Breaks up the infinite-list feel
- Small sleeping-moon icon at midnight transitions

### Empty day placeholder

- Faded illustration of a hammock with the ball chilling
- Copy: *"Nothing on this day yet. That's fine. Some days need space."*
- Subtle *"+ Add something"* link

### Quick-add control

- Mobile: neon-cyan glowing FAB bottom-right
- Desktop: + button in top-right of page header
- Tap opens slide-up sheet to add an event
- Default target day: today during in-progress trips, otherwise the next empty day

### Micro-interactions

- Hover / tap-preview on event card: 2px lift + shadow expansion
- Completed past events during in-progress trip: card fades to 60% opacity with corner checkmark
- Day headers sticky-briefly at the top as user scrolls past
- Day jumper auto-scrolls to keep current day centered

### Easter egg

- **Triple-tap any day header**: that day's events do a bubble-up animation in sequence (each event pops up 200ms after the previous). The day "comes to life."

### What this page explicitly does NOT do

- No Gantt chart or timeline visualization in v1 (alternate calendar view deferred)
- No weather photo backgrounds until weather integration exists
- No drag-to-reorder between days in v1 (deferred, mobile complexity)
- No analytics pie charts
- No countdown-to-next-event alerts (handled by notifications)
- No auto-inserted suggestion cards between events

---

## 37. Packing Page -- Fun Treatment on Neon-on-Dark

**Status:** locked (2026-04-17)

Packing structure (3 tabs: My / Group / Suggestions) is already locked in section 8. This section adds the neon-on-dark treatment and two layers of fun: satisfying check animations and staged reveal (checked items collapse into a "Packed" section, shrinking the working list as you pack).

### Tab strip (neon treatment)

- Three tabs: **My list** (default) / **Group list** / **Suggestions**
- Active tab: neon cyan bottom border with glow, pure white text
- Inactive tabs: white text at reduced weight, no underline
- Count badges next to each tab label in small neon-cyan pills
- Suggestions tab for free users shows a small neon-purple lock icon

### Category groups (My list)

- Collapsible groups: Clothing, Toiletries, Electronics, Documents, Other
- Group header: Fredoka white with small neon-cyan icon, tap collapses/expands
- Items:
  - Custom neon-cyan checkbox on the left
  - Item name in white (strike-through when checked, but NOT grayed)
  - Optional quantity chip on the right
  - Three-dot menu for edit / move / delete / make private

### Satisfying check animation

When a user checks an item:

- Checkbox fills with neon cyan and emits a soft glow burst (~20px radius, fades over 600ms)
- Small particle burst: 6-8 tiny neon-cyan dots fly outward and fade
- Item name gets strike-through
- Haptic tap on mobile (if device supports)
- Sound: off by default; optional setting for a subtle "pop"

### Staged reveal (shrinking list)

- Checked items collapse upward with a 300ms animation
- They move into a collapsed **"Packed (X items)"** section at the bottom of that category group
- Tap *Packed* to expand and see checked items
- Uncheck restores to the active list
- The working list shrinks as the user packs -- visual lightening

### Quick-add input per category

- Persistent input pinned at the bottom of each category group
- Placeholder: *"Add to [Category]..."*
- Enter submits; focus is kept for chained adds
- Neon-cyan focus ring

### Group list tab

- Flat list of shared items grouped by category
- Each item: assigned-bringer avatar on the right
- Unassigned items show a neon-yellow *Claim* button
- Claim: assigns the current user with a subtle ball-bounce animation
- Same check-off behavior as My list

### Suggestions tab

- Premium: grid of suggestion cards with icon + item name + reason, each with *Add to my list* and *Add to group* buttons
- Free: 3 sample cards visible under a full-tab lock overlay with a cyan support card explaining the premium bonus

### Empty states

- My list empty: ball-in-a-suitcase illustration, *"No items yet. Start with the essentials."*
- Group list empty: suitcase with colored dots, *"Nothing shared yet. First aid kit? Beach umbrella? Group snacks?"*
- Suggestions empty (premium): *"Smart suggestions will appear as you add trip details."*

### Micro-interactions

- Tapping category header with >5 items pulses the count badge briefly
- Long-press item: opens three-dot menu directly (mobile shortcut)
- Drag item between categories: snaps to target with a soft bounce
- Category reaches 100%: header briefly glows green with *"All packed. ♥"* for 2 seconds

### Easter egg

- **Check all items in a category**: that category's icon does a celebratory spin and the trip ball in the app nav wave-pulses once in sympathy. Small cross-component nod

### What this page explicitly does NOT do

- No weight-per-item tracking in v1
- No weather-aware packing suggestions outside the Suggestions tab
- No "critical items" highlighting
- No pack-streak gamification or daily goals
- No imported checklists from other users' trips in v1

---

## 38. Travel Day -- Fun Treatment on Neon-on-Dark (Focus Mode)

**Status:** locked (2026-04-17)

Travel Day's structural behavior (auto-route + focus mode on the day of, normal planning phase otherwise) is already locked in section 9. This section specifies the calm-neon-plus-encouraging-companion treatment for focus mode, plus the neon-on-dark styling for the planning-phase view.

### Planning phase (far from trip)

Standard neon-on-dark treatment like other phases:

- Editor layout for building the travel-day checklist
- Ordered task groups (pre-departure, at home, at airport, in the air, at arrival)
- Each task: time, description, responsible traveler
- Add / edit / reorder freely
- Neon pink phase color for Travel Day in the sidebar

### T-minus 24 hours (attention state)

- Tab in sidebar gets a neon-pink pulse dot
- Trip opens to the user's last-visited phase normally

### Focus mode (day of)

Layout stripped down:

- Sidebar collapses to narrow icon strip (still accessible, de-emphasized)
- Top nav becomes a minimal status strip in white Fredoka: *"Depart at 6:00 PM · Leave home by 3:30 PM · 2 items pending"*
- Trip switcher, notification bell, and avatar menu hidden -- essentials only
- Base dark background with NO ambient gradient drift (too busy for focus)
- Trip ball small in top-left, wave-pulsing slowly

### Main view: single-task-at-a-time

- Current up-next task dominates the screen in a BIG card
- Task title in massive Fredoka white (larger than anywhere else in the app)
- Small subtitle: time / location / responsible traveler
- Two giant tap targets:
  - **Done** -- neon green, ~72px tall, massive tap surface
  - **Skip** -- smaller, dark-elevated, for not-applicable tasks
- Above: horizontal scroll of completed tasks at fading opacity
- Below: small preview card of the next task

### Encouraging-companion touches

- Ball glows brighter for a beat when a task is completed, then settles back
- Rotating warm nudge copy above the current task:
  - *"One more. You got this."*
  - *"Take a breath. Next up."*
  - *"Almost at the gate."*
  - *"Halfway through your checklist."*
- Never scolds, never urgency-drama

### Segment transitions

- When a user finishes a major segment (pre-departure → at airport, at airport → in the air)
- Full-screen overlay fades in for ~2 seconds
- Copy: *"Pre-departure done. On to the airport. ♥"*
- Ball does one celebratory wave-pulse
- Fades back to single-task view for the next segment

### Swipe-to-complete

- Mobile gesture: swipe right on a task to mark done
- Haptic on successful swipe
- Calm neon-green trail fades

### "Leave in X minutes" chip

- If a task has a time and the user is approaching / past it
- Small neon-orange chip above the task: *"Leave in 12 min."*
- Turns neon pink when overdue: *"Should have left 5 min ago."* (warm, not alarmist)
- Non-blocking, informational

### Exit focus mode

- Small *Exit focus mode* text link in the top-right corner
- Exiting returns the normal workspace
- User can re-enter focus mode manually from Travel Day any time

### Post-arrival

- Focus mode exits automatically after the last segment completes
- Warm landing screen: ball wave-pulses big, copy *"You made it. ♥"*
- CTA: *Open Vacation Day* routes to today's events
- Standard workspace returns after this moment

### What focus mode explicitly does NOT do

- No ads visible (already specced as ad-suppression zone)
- No premium upsells
- No push notifications firing during focus mode (queued for after)
- No gamification or point scoring
- No multi-column mobile layouts -- single column only
- No sound effects
- No rapid animations -- all transitions ≤500ms, mostly calm fades

---

## 39. Vacation Day Page -- Fun Treatment on Neon-on-Dark

**Status:** locked (2026-04-17)

Vacation Day structure (morning briefing + today's events + activity strip + quick actions + peek tomorrow) is already locked in section 10. This section adds the neon-on-dark treatment and the live "up next" pinned pill for right-now utility. Warm-scroll + live-moment hybrid.

### Live "up next" pill (top, pinned)

- Appears only when the next event is within 2 hours
- Background: trip color at low saturation (warm glow, not overwhelming)
- Content: *"Up next: Breakfast at hotel · 8:00 AM · in 47 min"*
- Gently pulses (slow wet-neon shimmer) as the time approaches
- Tap scrolls to the event's card
- Dismissible per-event via a small × (swipe-away on mobile)

### Morning briefing card (neon treatment)

- Large card, dark elevated background
- Soft gradient in the trip's ball color at the top edge
- Greeting in Fredoka white by local time of day: *"Morning! Day 4 in Tokyo."*
- Summary line in white secondary: *"3 events today · 2 reservations · weather 68° and cloudy"*
- *Up next: breakfast at hotel · 8:00 AM* highlighted
- Collapses to a small bar if dismissed; reappears next morning at local sunrise

### Today's events (the river)

- Itinerary-style cards for today, time-sorted
- Apply neon-on-dark treatment with stronger category-stripe glow
- **Completed events**: 60% opacity with a subtle checkmark ripple (reuses packing check animation)
- **Currently-active event**: brighter glow around card border, small pulse
- Flow down like a river through the day

### Activity strip ("What changed today")

- Horizontal scroll of small chips
- Each chip: avatar + short action text + timestamp, with a category dot (social cyan, expenses green, polls yellow)
- Examples: *"Sarah added dinner suggestion · 10min ago"*, *"Mom paid $80 for taxi · 2hr ago"*
- Tap jumps to the source

### Quick actions row (always visible)

- Three buttons with liquid ripple on tap:
  - **Add event** (neon cyan) -- quick-add to today
  - **Log expense** (neon green) -- quick expense entry
  - **Start poll** (neon yellow) -- quick vote
- Pinned at bottom on mobile (above the ad banner), in page header on desktop

### Peek tomorrow link

- Small neon-purple text link at page bottom
- Text: *"Tomorrow: Day 5, hike at Shinjuku Gyoen"*
- Tap expands tomorrow's events inline or opens itinerary at tomorrow's day

### Ambient touches

- Background has the standard very-subtle gradient drift
- Trip ball in top-left corner does wave-pulse at a slightly slower 4s rhythm (vacation-glow state instead of 3.6s)
- Overall page tone is a touch warmer than other phases (slight color-temperature shift)

### Morning briefing auto-refresh

- At local sunrise, a subtle swipe-down-from-top transition reveals the next day's briefing
- Previous briefing archives to a small *"Yesterday"* link in the footer
- Overnight cross-timezone check-ins do not re-refresh the briefing mid-flight

### Micro-interactions

- Scroll past a completed event: card fades further (tells user "this is done")
- Long-press event: opens edit modal (same as itinerary)
- Swipe-right on a quick action button: triggers action immediately without a modal (fast logging)
- Tap trip ball in top-left: opens trip ball modal (consistent with other pages)

### Easter egg

- **Triple-tap the greeting** (*"Morning!"* / *"Afternoon!"* / *"Evening!"*): greeting cycles through destination-localized variants. In Tokyo: *"Ohayou, Chris!"* → *"Konnichiwa, Chris!"* → *"Konbanwa, Chris!"* Uses the trip's destination data to pick the language

### What this page explicitly does NOT do

- No map or route view in v1
- No weather forecast beyond current-day note
- No transit / live-routing integration in v1
- No auto-generated photo gallery (Memory does that)
- No sponsored / affiliate inline content during the trip (ads suppressed during briefing view per spec)
- No mid-trip recap / statistics (saved for Memory)

---

## 40. Expenses Page -- Fun Treatment on Neon-on-Dark

**Status:** locked (2026-04-17)

Expenses' structural layout (balances-first + trip total + ledger + add FAB) is already locked in section 11. This section adds the neon-on-dark treatment, a warm language reframe in the balances hero, a precise tone in the ledger, and a subtle celebration when balances settle. Money between friends should feel chill, not accusatory.

### Balances hero card (warm reframe language)

- Dark elevated card at the top
- Trip's ball color as soft outer glow
- Headline in Fredoka white showing personal net:
  - You are owed: *"Sarah's got you for $18"*
  - You owe: *"You've got Mom for $42"*
  - All settled: *"You and everyone are even. ♥"*
- Per-person rows:
  - Avatar + name
  - Amount in neon green (owed to you) or neon pink (you owe)
  - *Mark settled* button (if owed to you) or *Mark paid* button (if you owe)
  - Small hint if a handle is saved: *"Pay Mom via Venmo"* / *"Ask Sarah for $18"*

### Subtle settlement celebration

When a single settlement clears:
- Row slides up and out
- Soft neon-green ripple fades across
- Toast: *"Settled with Mom. ♥"*
- Trip ball in nav does one slow wave-pulse in sympathy

When the whole trip's balances hit zero:
- Hero transitions to "all settled" state with soft green aura
- Headline: *"You and everyone are even. ♥"*
- Gentle sprinkling of green dots rises from the bottom of the card and fades (subtle, not fireworks)

### Trip total strip

- Thin strip below the hero
- *"Trip total: $2,340 · Your share: $585 · Budget: 82% used"*
- Tap expands to budget breakdown with a horizontal bar chart per category in category colors

### Ledger (precise language)

- Full expense list, newest first
- Filter chips: *All · Yours · By category · By day*
- Each row: category-colored icon + description in white + amount in bold white + payer avatar + split chip (*"even 4-way"*, *"only Chris & Sarah"*, etc.)
- Language is precise and factual in the ledger: *"Chris paid $48 for dinner at Tsukiji · April 10 · split evenly 4-way"*
- Tap opens expense detail / edit

### Add expense FAB

- Mobile: neon-green glowing FAB bottom-right
- Desktop: green *Add expense* button in page header
- Slide-up sheet with amount, description, category, who paid, split type
- Currency converter field visible (premium lock for free users with neon-purple lock icon)
- Scan receipt button visible with premium support-card for free users

### Scan receipt (premium)

- On tap (premium user): camera opens on mobile, file picker on desktop
- Loading overlay uses calm liquid shimmer: *"Reading your receipt..."*
- Fields auto-fill from OCR; user reviews and submits
- Free users see a cyan support card: *"Scan receipts to auto-fill. Premium thank-you bonus. $7.99."*

### Empty state

- Illustration: ball stamped onto a coin
- Headline: *"Log the first expense. Day zero counts."*
- Subtitle: *"TripWave tracks from the first deposit to the final taxi. Fairly split, kindly settled."*
- CTA: *Add first expense*

### Language rules

- **Hero**: warm casual language (*"You've got Mom for $42"*, *"Sarah's got you for $18"*)
- **Ledger**: precise factual language
- **Errors**: non-blaming (*"Split doesn't add up. Let's fix that."*)
- **Forbidden in prose**: *"debt"*, *"collect"*, *"due"* (they may appear in structured amounts / timestamps but not in conversational copy)

### Micro-interactions

- *Mark paid / Mark settled* button briefly fills with neon green, row slides up
- Fast-scroll ledger: rows fade-in with subtle staggered liquid animation as they enter viewport
- Filter chip tap: chip fills with accent color, ledger cross-fades
- Long-press ledger row: inline edit actions (edit / delete / change split)

### Easter eggs

- **Tap the "all settled" green-dot celebration rapidly**: extra dots cascade. Rewards appreciation of the moment
- **Double-tap a ledger row's category icon**: icon does a small wiggle dance. Pure-fun, no informational value

### What this page explicitly does NOT do

- No financial-health scoring or credit-score simulations
- No Stripe / Venmo / Cash App direct integration in v1 (link-outs only with hints)
- No recurring expenses in v1 (trips are finite)
- No "budget over!" alarm / shame states
- No auto-categorization ML -- user picks category at entry
- No cross-trip lifetime spending total

---

## 41. Dream Mode -- Public Shareable Trip Planning (Slim Version)

**Status:** locked (2026-04-17)

Dream Mode is a **slim, shareable variant of a regular trip** designed for aspirational play. It is not a full separate product -- most of its content is just a regular trip workspace flagged as a dream, with three real differentiators: public shareability, social reactions from viewers, and a distinct visual identity that signals *"this is for fun."*

### What makes a dream actually different from a regular trip

After honest review, only three things differentiate a dream from a regular trip:

1. **Public shareable** -- regular trips contain private data (confirmations, emergency contacts, real expenses) and cannot be made public. Dreams have nothing real in them and are safe to share
2. **Social engagement from non-members** -- viewers of a dream can react and comment without being a trip member. Regular trips lock interaction to invited members
3. **Distinct visual framing** -- the sparkle-ball variant and *"This is a dream"* chip give users psychological permission to play without feeling like they are procrastinating on real planning

Everything else (fantasy activities, celebrity placeholder guests, mood boards, vibe themes) is achievable via regular trip features without a separate mode.

### How a dream is created

- At trip creation, step 1 asks: *Real trip* or *Dream trip?*
- Remaining 4-step flow (Name → Dates → Color → Reveal) is identical to a real trip
- Dream reveal moment includes a sparkle animation for visual distinction

### Dream trip limits

- **Free users**: 1 active dream at a time
- **Premium supporters**: unlimited dreams (framed as a supporter thank-you bonus)
- Dream slots do NOT count against the 4 free real-trip slots

### Visual differentiators

- **Dream-ball**: shimmer / gradient / sparkle variant of the trip ball. Never hits 100% complete; pulses and glows perpetually
- **Color picker**: pastels and gradient presets available for dreams but not regular trips
- **"This is a dream" chip**: persistent small label in cyan italic at the top of every dream page

### Dream workspace

Reuses the standard trip workspace shell (overview, preplanning, itinerary, wishlist, etc.) exactly as regular trips do, with these specific changes:

- Overview hero shows *"Dream of [name]"* and sparkle accents
- Budget warnings suppressed (fantasy budgets are fine)
- Memory phase hidden (dreams never end)
- Travel Day and Vacation Day phases hidden (dreams have no live execution)

### Share and social

- Every dream has a **public read-only share link**
- Non-authenticated viewers see the full dream
- Viewers see a warm signup nudge: *"Sign up free to react and plan your own."*
- Reactions and comments require an account per the account-required rule
- Reactions: emoji toggles (❤️ 🌴 🥂 ✨ 😍 🤩) per dream item
- Comments: short text replies, one level deep
- Native share sheet integration on mobile (WhatsApp, iMessage, Instagram DM)

### "Save to my dreams" action

- Any authenticated viewer can tap *Save to my dreams* on another user's public dream
- Creates a new dream in their own account, pre-populated from the source
- Sends a warm in-app notification to the original dreamer: *"[Name] saved your dream!"*
- Never gamified, never persistent, never repeated

### Premium supporter bonuses inside Dream Mode

Premium is framed as supporting the app; Dream Mode bonuses are the thank-you gifts:

- **Unlimited dreams** (free users hit the 1-dream cap at creation and see an inline support card)
- **Private dreams** toggle (free dreams are always public; premium unlocks the option to keep one private)
- **Extra dream-ball visual effects** (premium gets more sparkle styles, pastel gradients)

What is NOT a premium bonus:
- **Vibe themes** -- all basic themes ship free. Premium does not gate themes. The solo-dev / supporter framing makes it feel petty to gate aesthetic cosmetics
- **Reality Check** -- removed from scope. Users can use Find-flights / Find-hotels tools manually if they want real prices. Not worth building a dedicated paid feature for a 2-minute UX shortcut

### Guardrails

- Dreams never appear in the dashboard *Next up* hero (reserved for real upcoming trips)
- Dreams never trigger notifications (no travel-day pulse, no countdown, no anniversary)
- Dream ball colors cannot exactly match real trip ball colors -- the picker enforces visual distinction
- Every dream page shows the *"This is a dream"* chip
- Dream workspace celebrity invitees (if added as regular trip placeholder guests) are flavor data only, never actual trip members

### Why slim Dream Mode earns its place

- Viral acquisition: public share links are naturally viral (*"omg wouldn't this be so fun?"* texted to a best friend)
- Low dev cost: reuses existing trip workspace with small differentiators, no separate product to maintain
- Retention: provides a fun low-commitment reason to open the app during quiet months between real trips (partial retention lever; anniversary nudges and Memory artifacts do the heavier retention lifting)
- Supporter conversion: unlimited dreams and bonus sparkle effects are small, warm, gift-worthy perks for paying supporters -- exactly matching the "thank-you" premium framing

---
