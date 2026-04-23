# Packing Phase 1 Schema Proposal

> Last drafted: 2026-04-23
>
> Purpose: define the exact **Phase 1 data-model and action contract** needed before richer Packing features are implemented.
>
> Scope: schema, query shape, action surface, and migration sequencing only. No JSX decisions in this doc.

> Revision note (2026-04-23): **Superseded for long-term Packing direction.**
> The Packing contract now includes named personal lists under `My lists`.
> This document still explains the already-landed first schema slice, but it is no longer the recommended long-term model.
> See [PACKING_LISTS_SCHEMA_PROPOSAL.md](/C:/Code/personal/ultimate-vacation/docs/PACKING_LISTS_SCHEMA_PROPOSAL.md) for the current recommended direction.

---

## Goal

Move Packing from the current flat shared checklist model to a data model that can support the richer documented feature set:

- `My list`
- `Group list`
- privacy on personal items
- categories
- move-to-group semantics
- assigned bringer for shared items
- inline edit
- future ordering and suggestions support

This doc is intentionally conservative:

- it avoids arbitrary named lists, because those are **not clearly documented**
- it proposes the **smallest schema expansion** that unlocks the documented Packing behavior
- it keeps future extensions open without over-modeling now

---

## Current state in code

Current schema:

- one table: `packing_items`
- current fields:
  - `id`
  - `trip_id`
  - `text`
  - `is_packed`
  - `added_by_id`
  - `created_at`
  - `deleted_at`

Current migration source:

- [0004_packing_items.sql](/C:/Code/personal/ultimate-vacation/drizzle/0004_packing_items.sql)

Current schema definition:

- [schema.ts](/C:/Code/personal/ultimate-vacation/src/lib/db/schema.ts:458)

What this supports well:

- flat shared checklist
- add item
- toggle packed
- delete item

What it cannot support cleanly:

- personal vs shared tabs
- private items
- categories
- assigned bringer
- move-to-group
- inline edit quantity
- ordering

---

## Recommended product assumptions for Phase 1

These assumptions are now confirmed:

1. Packing should align with the richer documented UX spec, not remain a permanently flat shared checklist.
2. Packing should **not** introduce arbitrary named lists like `Main Bag` or `Carry-On` unless docs are later updated.
3. Packing should model:
   - personal items owned by a user
   - shared group items visible to trip members
4. Suggestions do **not** require schema in Phase 1.

Contract-resolution source:

- [DECISIONS.md](/C:/Code/personal/ultimate-vacation/docs/DECISIONS.md)

If those assumptions change later, this proposal should be revised before migration work starts.

---

## Proposed schema strategy

Use a **single expanded `packing_items` table**, not a new `packing_lists` table, for Phase 1.

Why:

- the documented spec is tab-based, not named-list-based
- categories can be modeled directly on items
- this keeps migration smaller and reduces join complexity
- it matches the actual feature contract better than a generic multi-list system

### Proposed new columns on `packing_items`

- `owner_user_id uuid not null references users(id)`
- `scope text not null default 'my'`
- `is_private boolean not null default true`
- `category_key text not null default 'other'`
- `quantity integer`
- `assignee_user_id uuid references users(id)`
- `sort_order integer`
- `updated_at timestamptz not null default now()`

### Existing columns to keep

- `id`
- `trip_id`
- `text`
- `is_packed`
- `added_by_id`
- `created_at`
- `deleted_at`

---

## Column-by-column rationale

### `owner_user_id`

Purpose:

- identifies which user owns a personal item
- drives `My list`
- allows personal visibility rules

Why not reuse `added_by_id`:

- the creator and the owner are not guaranteed to stay the same forever
- `added_by_id` should remain audit-ish provenance
- `owner_user_id` is the semantic source of truth for visibility and tab placement

Initial backfill:

- set `owner_user_id = added_by_id` for all existing rows

---

### `scope`

Allowed values:

- `my`
- `group`

Purpose:

- separates the documented `My list` from `Group list`
- supports move-to-group semantics without copying data

Why text instead of enum for now:

- current schema conventions already use text in several places
- simpler additive migration
- can be tightened later with app validation or DB constraint if desired

Notes:

- `scope = 'my'` means owner-only item
- `scope = 'group'` means shared trip-level item

---

### `is_private`

Purpose:

- supports the documented private-item toggle for personal items

Rules:

- valid primarily for `scope = 'my'`
- for `scope = 'group'`, this should effectively be false

Default:

- `true` for new personal items, matching the richer spec

Backfill decision:

- existing flat shared checklist rows should backfill as `scope = 'group'` and `is_private = false`

---

### `category_key`

Purpose:

- supports category grouping in `My list` and `Group list`

Initial allowed app-level values:

- `clothing`
- `toiletries`
- `electronics`
- `documents`
- `other`

Future-compatible:

- can later support custom user-defined categories without changing the item schema

Phase 1 recommendation:

- keep category as a string on the item
- do **not** introduce a categories table yet

Backfill:

- set all existing rows to `other`

---

### `quantity`

Purpose:

- supports the documented inline edit with quantity

Type:

- nullable integer

Why nullable:

- most items do not need quantity
- simpler than introducing `1` as noisy default everywhere

Validation:

- application layer should enforce positive integer if present

---

### `assignee_user_id`

Purpose:

- supports shared group items with a designated bringer
- supports claim / unassign logic

Rules:

- meaningful only for `scope = 'group'`
- nullable when group item is unclaimed

Move-to-group behavior:

- when a personal item is moved to group, set:
  - `scope = 'group'`
  - `assignee_user_id = mover`
  - `is_private = false`

---

### `sort_order`

Purpose:

- future support for item ordering within category

Phase 1 recommendation:

- add the column now if we expect ordering soon
- otherwise safe to defer to Phase 2

Recommendation:

- include it now, nullable

Reason:

- avoids another migration immediately after categories land

---

### `updated_at`

Purpose:

- supports edit flows and stable recency sorting
- helpful for future reorder and inline edit flows

Recommendation:

- add now

---

## What we are explicitly not adding in Phase 1

### No `packing_lists` table

Reason:

- docs do not clearly support arbitrary named lists
- tab-based UX does not need a list container table

### No `packing_categories` table

Reason:

- category string on item is enough for initial grouped rendering
- category management can be app-driven first

### No suggestions storage

Reason:

- suggestions can be computed or stubbed from trip context later
- no schema dependency yet

### No packed-history or reset-history table

Reason:

- current feature set does not need audit-level packing history

---

## Proposed DB constraints and indexes

### Constraints to enforce in application code first

- `scope` must be `my` or `group`
- `quantity` must be positive if present
- `is_private` should be false for `scope = 'group'`
- `assignee_user_id` should only be set for `scope = 'group'`

### Suggested indexes

Keep existing:

- `packing_items_trip_id_idx`

Add:

- index on `(trip_id, owner_user_id, scope, deleted_at)`
- index on `(trip_id, scope, category_key, deleted_at)`
- index on `(trip_id, assignee_user_id, deleted_at)`

Reason:

- supports `My list`
- supports `Group list`
- supports bringer lookups

---

## Proposed migration behavior

### Migration name

Recommended next migration:

- `0011_packing_phase1.sql`

### Backfill strategy

For all existing `packing_items` rows:

- `owner_user_id = added_by_id`
- `scope = 'group'`
- `is_private = false`
- `category_key = 'other'`
- `quantity = null`
- `assignee_user_id = null`
- `sort_order = null`
- `updated_at = created_at`

Why `scope = 'group'` for existing rows:

- current live feature is a shared checklist
- preserves current user-visible behavior after migration

---

## Proposed server action contract

Phase 1 should add these actions after the schema lands.

### Keep existing

- `addPackingItemAction`
- `togglePackingItemAction`
- `deletePackingItemAction`

### Add next

- `editPackingItemAction`
- `setPackingItemPrivacyAction`
- `movePackingItemToGroupAction`
- `claimGroupPackingItemAction`
- `unassignGroupPackingItemAction`
- `setPackingItemCategoryAction`

### Defer unless ordering ships immediately

- `reorderPackingItemsAction`
- `reorderPackingCategoriesAction`

---

## Proposed query contract

Replace the current flat query with a Packing page query that returns:

- `myItemsByCategory`
- `groupItemsByCategory`
- `counts`
- `memberMap`

### Example shape

```ts
type PackingPageData = {
  myList: {
    categories: Array<{
      key: string;
      label: string;
      items: PackingItemView[];
    }>;
    uncheckedCount: number;
  };
  groupList: {
    categories: Array<{
      key: string;
      label: string;
      items: GroupPackingItemView[];
    }>;
    uncheckedCount: number;
  };
};
```

### Why this matters

Do not make JSX compute product semantics from a flat row list if the feature model has already expanded. Put the semantics in the query layer once.

---

## Proposed permission rules for Phase 1

### My list

- owner can add/edit/delete/toggle
- other members cannot view
- organizer cannot override visibility

### Group list

- any member can view
- add/edit/delete rules should follow the trip’s current packing contract
- if bringer-only checking is adopted, only assignee can mark packed
- organizer can unassign as override

These rules should be finalized before action implementation begins.

---

## Risks

### Risk 1: doc conflict remains unresolved

If we migrate toward richer Packing without resolving the audited-surface-vs-UX-spec conflict, we risk building a feature set that the current roadmap does not actually want.

### Risk 2: custom categories may want a real table later

This proposal avoids that complexity intentionally. If future UX requires per-user named categories with reorder persistence independent of item presence, a `packing_categories` table may still be needed.

### Risk 3: named lists creep in later

If the product later wants `Main Bag`, `Carry-On`, and user-created named lists, this schema is not enough by itself. That would require a separate list container model.

This is okay because named lists are not currently the documented target.

---

## Recommended next step

1. Add member-aware shared-item read data for assignee/bringer UI
2. Add the first mutation slice:
   privacy, move-to-group, claim/unassign, and edit
3. Then expand the JSX into the richer per-item controls

---

## Status checklist

- [x] Current schema audited
- [x] Current migration history checked
- [x] Phase 1 schema proposal drafted
- [x] Contract direction confirmed
- [x] Migration written
- [x] Schema updated
- [x] Query layer updated
- [ ] Action layer updated
