# UI Restore — TripWave

Tracks the visual restoration of TripWave pages from the old `tripwave-ba87c90` repo's
layout/composition back into the current working repo.

**Rule**: Old repo = visual/JSX reference. Current repo = logic/data source of truth.

---

## Status Overview

| Page | Visual Status | Logic Status | Done? |
|------|--------------|--------------|-------|
| Packing | ✅ Close match | ✅ Real logic (PackingClient) | ✅ Complete |
| Expenses | ✅ Restored | ✅ Real logic | ✅ Complete |
| Vacation Days | ✅ Restored | ✅ Real logic | ✅ Complete |
| Itinerary | ✅ Already matched | ✅ Real logic | ✅ Complete |
| Travel Days | ✅ Restored | ✅ Real logic | ✅ Complete |

---

## Page-by-Page Detail

---

### Packing (`/app/trips/[id]/packing`)

**Old source:** `tripwave-ba87c90/src/components/packing/PackingShell.tsx`
**Current source:** `src/app/app/trips/[tripId]/packing/PackingClient.tsx`

**Assessment:** The current `PackingClient.tsx` already closely mirrors the old shell's layout:
- Dark header with progress counter ✅
- 3-stat row (items packed / categories done / private items) ✅
- 2fr/1fr bento grid ✅
- Left: list selector tabs + category sections with collapse/expand ✅
- Right: active list card + group packing card ✅

**Deviations from old (accepted):**
- No "Japan tips / Smart suggestions" premium card — was mock data, not restored
- Visibility toggle changed from single button → Private/Public segmented buttons (better UX, kept)
- Added "Shared" tab (new real feature, not in old mock)

**Logic reattached:** addAction, createListAction, toggleAction, deleteAction,
setListVisibilityAction, setItemVisibilityAction, moveToSharedAction, claimSharedItemAction,
unassignSharedItemAction.

**Follow-up:** None required.

---

### Expenses (`/app/trips/[id]/expenses`)

**Old source:** `tripwave-ba87c90/src/components/expenses/ExpenseShell.tsx`
**Current source:** `src/app/app/trips/[tripId]/expenses/ExpensesClient.tsx`

**Restoration work done:**
- Rebuilt `ExpensesClient.tsx` with old shell's full-page layout
- Sticky dark header with "Log expense" inline toggle + stats row (total spent / my share / my balance)
- Left column: 2-tab bar (Ledger + Balances) with real data
  - Ledger: real expenses grouped by `paidAt` date, category icons, payer, my share
  - Balances: per-member net summary + SettleUpClient integration
- Right sidebar: settlement snapshot card + summary card + category breakdown bar chart
- `page.tsx` updated to remove its own wrapper container; passes `tripName`
- `actions.ts` updated to forward `category` field from form
- Category picker added to AddExpenseForm (7 categories with icons/colors)

**Deviations from old (accepted):**
- No "Budget" tab — no per-category budget data in current schema
- No "Scan receipt / Premium" button in header — replaced with ReceiptAttach per expense row (real feature)
- Date grouping is dynamic from real `paidAt` dates vs. hardcoded groups in old shell
- Settlement uses real `SettleUpClient` + transfers (not mock "mark as paid" buttons)
- Right sidebar shows category breakdown instead of mock Budget snapshot

**Logic reattached:** createExpenseAction (now with category), ReceiptAttach, SettleUpClient.

---

### Vacation Days (`/app/trips/[id]/vacation-days`)

**Old source:** `tripwave-ba87c90/src/components/vacation-days/VacationDayShell.tsx`
**Current source:** `src/components/vacation-days/TodayView.tsx` + `src/app/app/trips/[tripId]/vacation-days/page.tsx`

**Restoration work done:**
- `vacation-days/page.tsx`: added `searchParams` for `?date=` param; selected date is now
  browseable across all trip days; events fetched server-side per selected date
- `TodayView.tsx`: replaced single-column with two-panel layout:
  - Left panel: scrollable day list for all trip dates, each a Link with ?date= href
  - Right panel: schedule for selected date + quick action links
- Shows for both active AND ended trips (historical review)
- Not-started trips: show countdown with day list preview

**Deviations from old (accepted):**
- No scavenger hunt tracking — no backend for this feature
- No quick votes / meetup chat — no backend for these features
- No per-day expense logger — users link to the expenses page instead
- No destination grouping in day list — no per-day destination data in current schema
- No "briefing notes" per day — no backend for this feature
- No "TomorrowPeek" section — replaced by day browsing (click next day)

**Logic reattached:** listEventsForDate from real DB, trip start/end date from real DB.

---

### Itinerary (`/app/trips/[id]/itinerary`)

**Old source:** `tripwave-ba87c90/src/components/itinerary/ItineraryShell.tsx`
**Current source:** `src/components/itinerary/ItineraryShell.tsx`

**Assessment:** Current shell (945 lines) already exceeds the old shell (795 lines) in completeness.
Both have identical layouts:
- Sticky dark header with Fredoka title + stats row (events / days / coverage%) + "Add event" button ✅
- Two-panel layout: left scrollable day list + right timeline with events ✅
- Mobile single-panel with toggle ✅
- AddEventForm with category pills, time, location, notes ✅
- EventCard with inline edit, delete ✅
- `canEdit` guard for edit/delete actions ✅

**Deviations from old (intentional improvements):**
- Old shell used mock TRIP_DAYS/MOCK_EVENTS; current uses real DB data ✅
- Current has `canEdit` permission gate; old allowed all edits ✅
- Accent color updated: `#00A8CC` → `#00E5FF` (brand direction)

**Logic reattached:** createEventAction, updateEventAction, deleteEventAction (already wired).

**Follow-up:** None required.

---

### Travel Days (`/app/trips/[id]/travel-days`)

**Old source:** `tripwave-ba87c90/src/components/travel-days/TravelDayShell.tsx`
**Current source:** `src/components/travel-days/TravelDayShell.tsx`

**Restoration work done:**
- Added sticky dark header (`#282828`) with Fredoka title + "Add travel day" button + "Generate" button
- Added 3-card stats row: travel days / total tasks / tasks done
- Changed from `max-w-2xl mx-auto` single-column → full-page dark layout with `#404040` bg

**Deviations from old (accepted):**
- No two-panel layout — old right panel had "Connected flights" (mock itinerary data),
  "Required items" (mock packing data), "Notes" field — none have real backend data in current schema
- Card-based inline layout retained (each travel day is an expandable card, not a left-list/right-detail split)
- Old had `viewMode` (planning/day-of) toggle per day — current doesn't track this (not in schema)

**Logic reattached:** createTravelDayAction, updateTravelDayLabelAction, deleteTravelDayAction,
createTaskAction, toggleTaskDoneAction, deleteTaskAction, generateFromTripAction (already wired).

---

## Shared Notes

- The old repo uses `MOCK_*` data throughout. None of that is restored.
- Dead shells in current repo that can be deleted:
  - `src/components/vacation-days/VacationDayShell.tsx` (uses MOCK_EVENTS, not used)
  - `src/components/expenses/ExpenseShell.tsx` (if it exists — dead code)
  - `src/components/packing/PackingShell.tsx` (if it exists — dead code)
