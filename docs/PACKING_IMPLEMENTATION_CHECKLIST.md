# Packing Implementation Checklist

> Last audited: 2026-04-23
>
> Purpose: handoff-safe checklist for bringing the Packing page from the current live implementation to the richer documented feature set, without losing track of what is already real, what is missing, and what is blocked by schema or product-contract conflicts.

---

## Why this doc exists

Packing currently has a **real, working implementation** in code, but that implementation only covers a **flat shared checklist**.

The docs describe two different versions of Packing:

- **Audited current-state contract**: shared group checklist utility surface
- **Richer UX spec**: My lists / Shared / Suggestions, privacy, list visibility, item-level visibility overrides, categories, move-to-shared, bringer assignment, inline edit, and more

This doc keeps both truths visible so future work can proceed cleanly.

---

## Current state

### What is real in code today

- One trip-level packing checklist
- Real server-backed add item
- Real server-backed toggle packed
- Real server-backed delete item
- Real counts and progress
- Real route: `/app/trips/[tripId]/packing`
- Restored old visual composition for the page shell and module layout

### Files currently implementing Packing

- [page.tsx](/C:/Code/personal/ultimate-vacation/src/app/app/trips/[tripId]/packing/page.tsx)
- [PackingClient.tsx](/C:/Code/personal/ultimate-vacation/src/app/app/trips/[tripId]/packing/PackingClient.tsx)
- [actions.ts](/C:/Code/personal/ultimate-vacation/src/app/app/trips/[tripId]/packing/actions.ts)
- [queries.ts](/C:/Code/personal/ultimate-vacation/src/lib/packing/queries.ts)
- [schema.ts](/C:/Code/personal/ultimate-vacation/src/lib/db/schema.ts)

### What the current schema supports

Current `packing_items` now includes the Phase 1 foundation fields:

- `tripId`
- `text`
- `isPacked`
- `addedById`
- `ownerUserId`
- `scope`
- `isPrivate`
- `categoryKey`
- `quantity`
- `assigneeUserId`
- `sortOrder`
- `createdAt`
- `updatedAt`
- `deletedAt`

Current schema still does **not** fully support:

- category ordering independent of items
- suggestions
- named personal lists
- list-level visibility
- richer Packing behavior without query/action/UI follow-up work

---

## Source-of-truth doc split

### Audited current-state docs

These describe Packing as a narrower, currently-shipped utility surface:

- [SURFACE_BLUEPRINT.md](/C:/Code/personal/ultimate-vacation/docs/SURFACE_BLUEPRINT.md)
- [BACKLOG.md](/C:/Code/personal/ultimate-vacation/docs/BACKLOG.md)

Summary:

- Packing contract = **shared group packing list**
- Deferred = per-member sections

### Richer UX/spec docs

These describe a larger feature set:

- [UX_SPEC.md](/C:/Code/personal/ultimate-vacation/docs/UX_SPEC.md)
- [DECISIONS.md](/C:/Code/personal/ultimate-vacation/docs/DECISIONS.md)
- [ARCHITECTURE.md](/C:/Code/personal/ultimate-vacation/docs/ARCHITECTURE.md)

Summary:

- 3 tabs: **My lists / Shared / Suggestions**
- privacy controls
- list-level visibility
- item-level visibility overrides
- move-to-group
- group bringer assignment
- categories
- drag ordering
- inline edit
- server-persisted check state

### Resolution

Resolved 2026-04-23:

- Packing should **not** remain permanently defined as a plain shared checklist
- The **richer UX-spec direction is the canonical contract**
- Implementation should proceed in phased slices
- Named personal lists are now **in scope** under `My lists`
- Packing now needs **list-level visibility** and **item-level privacy overrides**

---

## What is missing

## 1. Contract decisions now locked

- [x] Resolve the Packing contract conflict between audited surface docs and richer UX spec
- [x] Decide that named personal lists are part of the Packing contract

Notes:

- Privacy is clearly documented in the richer spec
- Named lists are now explicitly added by the 2026-04-23 contract decision
- The contract is now `My lists / Shared / Suggestions`, not single `My list / Group list / Suggestions`

---

## 2. Missing schema/data model

Phase 1 schema foundation has landed, but some data-model pieces are still incomplete.

- [ ] Add support for named personal lists
- [ ] Add support for list-level visibility
- [x] Add support for personal vs shared scope
- [x] Add support for item privacy
- [x] Add support for categories
- [ ] Add support for category ordering
- [x] Add support for item ordering within category
- [x] Add support for quantity
- [x] Add support for group-item assignee / bringer
- [x] Add support for richer list queries by current user

Recommended minimum shape if implementing the richer spec:

- `packing_lists`
- `packing_list_membership` or ownership/visibility fields sufficient for list ownership
- `packing_items.listId`
- `packing_items.ownerUserId`
- `packing_items.visibility` or equivalent item-level override
- `packing_items.category`
- `packing_items.sortOrder`
- `packing_items.quantity`
- `packing_items.assigneeUserId`

Open question:

- Exact visibility modeling: enum vs nullable override fields
- Whether public personal-list items should be visible only inside that list or also summarized elsewhere in the future

---

## 3. Missing query layer

Current read layer now returns a Packing page view model, but some downstream richness is still missing.

- [x] Replace flat Packing query with a Packing page view-model query
- [x] Return current user’s personal items separately from shared group items
- [x] Return categories and ordering
- [ ] Return assignee/bringer display info for shared items
- [x] Return counts for tab badges
- [ ] Return suggestion state if Suggestions tab ships

Likely target output shape:

- `myList.categories[]`
- `groupList.categories[]`
- `tabCounts`
- `permissions`
- `suggestions`

---

## 4. Missing server actions

Current actions only support add / toggle packed / delete.

- [ ] Edit item text
- [ ] Edit quantity
- [ ] Make private / unprivate
- [ ] Move item to group list
- [ ] Assign / claim group item
- [ ] Unassign group item
- [ ] Create category
- [ ] Rename category
- [ ] Delete category
- [ ] Reorder categories
- [ ] Reorder items

If Suggestions ships:

- [ ] Add suggestion to My list
- [ ] Add suggestion to Group list
- [ ] Undo add-from-suggestion

---

## 5. Missing JSX/UI structure

Current page now has a split `My lists` / `Shared` read layer, but it still lacks most of the richer per-item interactions.

### Missing top-level UI

- [ ] 3-tab strip: My lists / Shared / Suggestions
- [x] Per-tab count badges / lock treatment
- [x] Per-tab empty states

### Missing My lists UI

- [x] Category groups
- [x] Category headers
- [ ] Per-category quick-add
- [ ] Three-dot item menu
- [ ] Inline edit state
- [ ] Make private UI
- [ ] Move to Shared UI
- [ ] Packed subsection / staged reveal

### Missing Shared UI

- [x] Shared items grouped by category
- [ ] Assigned bringer avatar/state
- [ ] Claim action for unassigned items
- [ ] Unassign action
- [ ] Read-only vs editable check state depending on bringer

### Missing Suggestions UI

- [ ] Suggestion cards with reason text
- [ ] Add to My list action
- [ ] Add to Shared action
- [ ] Free-user lock state / premium preview

---

## 6. Missing lifecycle behavior

- [ ] Confirm whether packed state should reset automatically when trip becomes Stale, per richer spec
- [ ] Confirm whether Travel Day repack behavior depends on Packing categories/items, per UX spec extensions
- [ ] Confirm how privacy should behave in downstream Travel Day / multi-leg repack surfaces

---

## Recommended implementation order

Do this in order to avoid rework.

### Phase 0 - Contract lock

- [x] Decide whether to keep Packing narrow or expand to richer spec
- [x] Decide that `My lists` owns named personal lists and `Shared` remains separate

### Phase 1 - Data model

- [x] Design schema changes
- [x] Add migration
- [x] Update Drizzle schema
- [ ] Replace single-table long-term plan with `packing_lists` schema plan

### Phase 2 - Read layer

- [x] Build Packing page query/view model
- [ ] Thread permissions and member info into the route

### Phase 3 - Mutations

- [ ] Add server actions for privacy, move, assign, edit, category management, ordering

### Phase 4 - JSX structure

- [ ] Build tabs
- [ ] Build My lists UI
- [ ] Build Shared UI
- [ ] Build Suggestions tab if still in scope

### Phase 5 - polish and verification

- [ ] Accessibility review
- [ ] Mobile behavior audit
- [ ] Packing-specific empty/error states
- [ ] Regression test current add/toggle/delete behavior

---

## Suggested task breakdown

These are good implementation slices for handoff.

### Slice A - Contract + schema proposal

- [x] Write proposed final Packing data model
- [x] Decide that named personal lists are included
- [ ] Decide whether Suggestions is launch-scope or later
- [ ] Write `packing_lists`-based schema proposal

### Slice B - Personal/shared split

- [x] Add personal vs group scope in schema
- [ ] Update query layer
- [ ] Add tab strip UI
- [ ] Render My lists and Shared separately

### Slice C - Privacy

- [x] Add `isPrivate`
- [ ] Add toggle action
- [ ] Add private-state UI and filtering rules

### Slice D - Categories

- [x] Add category model/field
- [ ] Group items by category
- [ ] Add per-category quick-add

### Slice E - Group responsibilities

- [x] Add assignee/bringer support
- [ ] Add Claim / Unassign actions
- [ ] Add bringer-aware UI

### Slice F - Item editing

- [ ] Add edit action
- [ ] Add inline edit UI
- [ ] Add quantity support if still wanted

### Slice G - Suggestions

- [ ] Confirm scope
- [ ] Build data source
- [ ] Build premium/free states

---

## What should not be done by accident

- [ ] Do not assume arbitrary named multiple lists are part of the spec
- [ ] Do not keep building on the old single-table packing plan as if named lists were still out of scope
- [ ] Do not implement mock features just because the old mockup shows them
- [ ] Do not conflate visual restoration with feature completion
- [ ] Do not add premium suggestion logic until product scope is confirmed
- [ ] Do not build JSX-first for features the schema cannot support

---

## Current progress snapshot

### Completed

- [x] Packing route exists
- [x] Real server-backed flat checklist exists
- [x] Add / toggle / delete exists
- [x] Visual shell restored toward old composition
- [x] Gap analysis completed
- [x] Handoff checklist doc created
- [x] Packing contract resolved toward richer UX spec
- [x] Phase 1 migration written
- [x] Drizzle schema updated for Packing Phase 1
- [x] Packing page query/view model added
- [x] Route split into `My lists` and `Shared` data
- [x] Read-layer tab UI added for current Packing data

### Not started

- [ ] Member-aware read layer
- [ ] Privacy logic
- [ ] Suggestions tab
- [ ] Categories
- [ ] Group bringer model
- [ ] Inline edit
- [ ] Suggestions

---

## Handoff note

If a future session picks this up, start here:

1. Read this file
2. Read the schema proposal:
   - [docs/PACKING_PHASE1_SCHEMA_PROPOSAL.md](/C:/Code/personal/ultimate-vacation/docs/PACKING_PHASE1_SCHEMA_PROPOSAL.md)
3. Re-read:
   - [docs/SURFACE_BLUEPRINT.md](/C:/Code/personal/ultimate-vacation/docs/SURFACE_BLUEPRINT.md)
   - [docs/BACKLOG.md](/C:/Code/personal/ultimate-vacation/docs/BACKLOG.md)
   - [docs/UX_SPEC.md](/C:/Code/personal/ultimate-vacation/docs/UX_SPEC.md)
   - [docs/DECISIONS.md](/C:/Code/personal/ultimate-vacation/docs/DECISIONS.md)
4. Verify the richer Packing contract and current implementation status still match
5. Then begin the query/view-model slice
