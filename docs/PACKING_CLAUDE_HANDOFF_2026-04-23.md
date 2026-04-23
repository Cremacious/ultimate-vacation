# Packing Claude Handoff

> Created: 2026-04-23
>
> Purpose: give Claude Code a clean takeover point for the current Packing implementation without needing to reconstruct product intent from chat history.

---

## What is implemented right now

Packing is no longer just a flat shared checklist.

The current live implementation now supports:

- named personal packing lists under `My lists`
- create list
- add item to the selected list
- list-level visibility: `private` / `public`
- item-level visibility override: `private` / `public`
- `Move to shared` from a personal list
- shared-item `Claim` / `Unassign`
- member-aware bringer display in the shared list
- visibility of other members' **public personal lists** inside the `Shared` tab
- filtering so only **public** items from those public personal lists are visible to the group
- accessibility pass on the current page shell:
  - form labels added
  - tab / tabpanel semantics added
  - selected-state semantics added for personal-list chips
  - progressbars now expose value semantics
  - keyboard-visible delete affordance fixed
  - helper-text contrast improved

Important distinction:

- `Shared` items are still the true coordination surface
- public personal-list items are only a read-only visibility surface right now
- they are **not** treated as shared items and do **not** participate in claim/unassign

---

## Files touched in the latest slice

- [PackingClient.tsx](/C:/Code/personal/ultimate-vacation/src/app/app/trips/[tripId]/packing/PackingClient.tsx)
- [queries.ts](/C:/Code/personal/ultimate-vacation/src/lib/packing/queries.ts)
- [PACKING_IMPLEMENTATION_CHECKLIST.md](/C:/Code/personal/ultimate-vacation/docs/PACKING_IMPLEMENTATION_CHECKLIST.md)

Important supporting files for the broader Packing feature:

- [page.tsx](/C:/Code/personal/ultimate-vacation/src/app/app/trips/[tripId]/packing/page.tsx)
- [actions.ts](/C:/Code/personal/ultimate-vacation/src/app/app/trips/[tripId]/packing/actions.ts)
- [lists.ts](/C:/Code/personal/ultimate-vacation/src/lib/packing/lists.ts)
- [schema.ts](/C:/Code/personal/ultimate-vacation/src/lib/db/schema.ts)
- [PACKING_LISTS_SCHEMA_PROPOSAL.md](/C:/Code/personal/ultimate-vacation/docs/PACKING_LISTS_SCHEMA_PROPOSAL.md)
- [PACKING_IMPLEMENTATION_CHECKLIST.md](/C:/Code/personal/ultimate-vacation/docs/PACKING_IMPLEMENTATION_CHECKLIST.md)

---

## Current behavior contract

This is the behavior the current code is trying to preserve:

- `My lists` is the user’s personal workspace
- `Shared` is the group-facing coordination list
- if a personal list is marked `public`, trip members can see only the public subset of that list
- if an item moves to `Shared`, that is a cut, not a copy
- private items in public lists remain hidden from everyone else

This means `public` and `shared` are intentionally different concepts:

- `public` = visible to group, still belongs to that person’s personal list
- `shared` = now part of the group bringer workflow

---

## Remaining product / implementation gaps

Highest-signal gaps still left:

1. `Read-only vs editable shared state`
Shared rows are still broadly toggleable today. The richer contract likely wants stricter behavior based on who claimed the item or who created it.

2. `List management polish`
Rename list and delete list are still missing.

3. `Item editing`
Inline edit and quantity edit are still missing.

4. `Category management`
Categories exist as data and grouping, but category creation / rename / reorder flows do not.

5. `Suggestions`
The `Suggestions` tab is still not implemented.

6. `Mobile audit`
The accessibility pass is done, but a mobile interaction-density pass is still owed.

---

## Recommended next order

Recommended next implementation order:

1. tighten shared-row ownership rules
2. add rename/delete list
3. add inline edit / quantity edit
4. add category management
5. decide whether Suggestions is still launch-scope

If Claude wants the most product-critical next slice, do this first:

- make shared-row interaction rules explicit:
  - who can toggle packed
  - who can delete
  - whether only the assignee can mark done
  - whether unassigned items are group-editable

That gap is now more important than adding more UI sugar.

---

## Known implementation assumptions

These assumptions are currently baked into the code:

- new personal lists default to `private`
- public personal lists from the current user are **not** duplicated back into `Shared`
- only other members' public lists are surfaced in the `Shared` tab
- public personal lists are rendered read-only
- public items remain in their original personal list rather than being transformed into shared rows

If Claude changes any of those assumptions, update:

- [DECISIONS.md](/C:/Code/personal/ultimate-vacation/docs/DECISIONS.md)
- [UX_SPEC.md](/C:/Code/personal/ultimate-vacation/docs/UX_SPEC.md)
- [SURFACE_BLUEPRINT.md](/C:/Code/personal/ultimate-vacation/docs/SURFACE_BLUEPRINT.md)

---

## Verification status

Verified in this Codex session:

- `npm run build` passed after the public-list visibility slice
- `npm run build` passed after the accessibility fixes

Accessibility note:

- the `/accessibility-review` skill was not available as a callable skill in this session
- a direct fallback review was done instead, and the issues found were fixed in the current page implementation

---

## If Claude picks this up next

Start here:

1. Read [PACKING_IMPLEMENTATION_CHECKLIST.md](/C:/Code/personal/ultimate-vacation/docs/PACKING_IMPLEMENTATION_CHECKLIST.md)
2. Read [PACKING_LISTS_SCHEMA_PROPOSAL.md](/C:/Code/personal/ultimate-vacation/docs/PACKING_LISTS_SCHEMA_PROPOSAL.md)
3. Inspect:
   - [PackingClient.tsx](/C:/Code/personal/ultimate-vacation/src/app/app/trips/[tripId]/packing/PackingClient.tsx)
   - [queries.ts](/C:/Code/personal/ultimate-vacation/src/lib/packing/queries.ts)
   - [actions.ts](/C:/Code/personal/ultimate-vacation/src/app/app/trips/[tripId]/packing/actions.ts)
4. Preserve the distinction between `public` personal items and `shared` items
5. Then implement the stricter shared-row permission model before expanding more UI surface
