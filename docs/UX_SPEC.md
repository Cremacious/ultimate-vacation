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

Premium prompts come in two forms -- **inline lock cards** as the default, and **moment cards** elevated at high-intent contextual triggers. Never modal takeovers, never persistent banners, never scarcity tactics.

### Inline lock card (default state)

Appears wherever a premium feature would normally live, replacing the feature's entry point.

- Cyan-tinted card background (noticeable, not alarming)
- Small lock icon in the top-left (cyan)
- Feature name in bold
- 1-sentence value line: e.g., *"Scan receipts to auto-fill expenses. $5 one-time."*
- Right side: *Unlock* pill button (cyan with yellow shadow)
- Optional tiny footer: *"Premium is a one-time $5 unlock. No subscriptions."*

Example placements:

- Expenses: lock card in place of the *Scan receipt* button
- Currency converter tool: lock card replacing tool UI, with a preview faded behind
- Offline mode: lock card in Settings next to a disabled toggle preview
- Smart suggestions: lock card in the Tools hub's *Useful right now* row

### Moment card (elevated high-intent state)

Appears inline within the relevant phase at specific contextual triggers -- never as a modal.

- Larger, full-width card
- Warm pastel background tinted with the trip's color
- Context-aware headline: *"Offline mode would be real useful right now."*
- Explanation: *"You're offline, 30 minutes from the airport. For $5 you can access your itinerary and vault without wifi from now on."*
- Primary action: *Unlock for $5* (large button)
- Secondary action: *Not now* (small text link)

Example triggers:

- User opens app offline and isn't premium: moment card on trip overview
- User taps a currency field in an international expense entry
- User has logged 5+ expenses without using receipt scan
- User about to archive a trip: *"Save this as a template"* moment card

### Ad-free / prompt-free zones

Premium prompts never appear during:

- Travel day focus mode
- Vacation day quick actions
- Brand-new trip onboarding overview
- Settlement actions

### Tone rules

- Always reference the one-time $5 nature explicitly. Never say *"upgrade to unlock"* without the pricing
- Acknowledge free is legitimate: *"You can absolutely wing this."*
- Reference the specific moment when using moment cards: *"You just tried to..."* / *"You're about to..."*
- Forbidden: scarcity language, *"limited time"*, *"unlock now before..."*
- The free tier must remain fully useful on its own -- prompts only offer extra

### Purchase flow

- Tapping an *Unlock* button opens a slide-up sheet on mobile / modal on desktop
- Sheet contents: benefits list, large *Buy for $5* button, Apple/Google Pay (future native app), Stripe (web)
- Post-purchase: trip ball does a celebration burst; toast confirms *"Premium unlocked. No ads, ever."*

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
- **Upsell hint**: small *"Remove ads for $5"* text link on the right side of the banner, opens the Premium sheet on tap

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
- Visible *"Remove ads for $5"* hint turns every ad into a conversion opportunity
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
