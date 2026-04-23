# Packing Lists Schema Proposal

> Last drafted: 2026-04-23
>
> Purpose: define the recommended **post-Phase-1 Packing schema direction** now that named personal lists are part of the confirmed product contract.
>
> Scope: schema, query shape, action surface, migration sequencing, and visibility rules. No JSX decisions in this doc.

---

## Goal

Move Packing from the current transitional `packing_items`-only model to a model that supports:

- `My lists`
- `Shared`
- `Suggestions`
- user-created named personal lists
- list-level visibility
- item-level privacy overrides
- grouped categories
- move-between-lists
- move-to-shared semantics
- bringer assignment for shared items

This proposal replaces the earlier assumption that Packing could stay centered on a single expanded `packing_items` table.

---

## Contract summary

Confirmed contract direction:

1. Packing keeps the three top tabs.
2. The first tab is now **`My lists`**, not one monolithic `My list`.
3. Users can create and name multiple personal lists.
4. Each personal list has a **visibility setting**:
   - `private`
   - `public`
5. Each item can override that default visibility.
6. `Shared` remains a distinct trip-level coordination surface.

Source of truth:

- [DECISIONS.md](/C:/Code/personal/ultimate-vacation/docs/DECISIONS.md)
- [UX_SPEC.md](/C:/Code/personal/ultimate-vacation/docs/UX_SPEC.md)

---

## Why the current schema is no longer enough

Current `packing_items` can model:

- ownership
- scope
- item privacy
- categories
- assignee

It cannot cleanly model:

- multiple named personal lists per user
- list-level visibility defaults
- stable list ordering
- moving items between named lists without overloading category or scope
- future list-specific category ordering

That means named lists are not just a UI feature. They are a schema concern.

---

## Recommended schema strategy

Add a dedicated **`packing_lists`** table and keep **`packing_items`** as the item table.

### Core principle

- **Lists are containers**
- **Items belong to exactly one container**
- **Shared is still a first-class surface**, not just a visibility flag on a personal list

---

## Proposed tables

### `packing_lists`

Recommended columns:

- `id uuid primary key`
- `trip_id uuid not null references trips(id)`
- `owner_user_id uuid not null references users(id)`
- `name text not null`
- `list_type text not null`
- `visibility text not null`
- `sort_order integer`
- `created_by_id uuid not null references users(id)`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `deleted_at timestamptz`

### Meaning

- `list_type`:
  - `personal`
  - `shared`
- `visibility`:
  - `private`
  - `public`

### Rules

- Personal lists are user-owned.
- Shared lists are trip-visible coordination containers.
- At minimum, there should be one canonical shared list seeded for each trip.
- A user may have multiple personal lists.

---

### `packing_items`

Recommended long-term columns:

- `id uuid primary key`
- `trip_id uuid not null references trips(id)`
- `list_id uuid not null references packing_lists(id)`
- `owner_user_id uuid not null references users(id)`
- `text text not null`
- `is_packed boolean not null default false`
- `visibility_override text`
- `category_key text not null default 'other'`
- `quantity integer`
- `assignee_user_id uuid references users(id)`
- `sort_order integer`
- `added_by_id uuid not null references users(id)`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `deleted_at timestamptz`

### Meaning

- `visibility_override`:
  - `null` = inherit list visibility
  - `private` = private to owner even if list is public
  - `public` = visible even if list is private

### Why nullable override is better here

- Keeps the list default authoritative
- Avoids duplicating visibility on every row
- Makes “hide this one gift item” easy without redefining the whole list

---

## Recommended semantics

### Personal lists

- Can be created, named, renamed, reordered, and deleted by the owner
- May be public or private
- Can contain both public and private items via override

### Shared

- Remains its own top-level tab
- Uses one or more `packing_lists` rows with `list_type = 'shared'`
- Shared items can have bringer assignment and claim/unassign actions

### Ownership

- `owner_user_id` on a personal list is the list owner
- `owner_user_id` on an item is the semantic owner of that item
- `added_by_id` remains audit/provenance

---

## Visibility rules

### Effective visibility

For any item:

1. If `visibility_override` is set, use it.
2. Otherwise inherit from the parent list.

### Practical outcomes

- Private list + no override = private item
- Public list + no override = public item
- Public list + `private` override = visible only to owner
- Private list + `public` override = visible to trip members

### Shared lists

- Shared lists should always behave as trip-visible
- `visibility` for shared lists can either be fixed to `public` in app code or constrained in DB later

---

## Migration strategy from current state

Current live data already has:

- `packing_items`
- `scope`
- `owner_user_id`
- `is_private`

Recommended migration path:

1. Create `packing_lists`
2. Seed one default shared list per trip
3. Seed one default personal list per `(trip_id, owner_user_id)` pair seen in current personal-scope rows
4. Add `packing_items.list_id`
5. Backfill each current row into the appropriate seeded list:
   - `scope = 'group'` → trip's default shared list
   - `scope = 'my'` → owner's default personal list
6. Translate current item privacy into `visibility_override`
7. Keep old `scope` temporarily during rollout if needed
8. Remove or deprecate redundant columns only after read/write paths are fully migrated

---

## Suggested initial seeded lists

Per trip:

- one `Shared` list

Per user per trip, only when needed:

- one default personal list, recommended name:
  - `My stuff`

Why seed minimally:

- preserves current behavior
- avoids creating visual clutter for users who never use multiple lists
- lets users create `Carry-on`, `Checked bag`, `Gift bag`, etc. only when they want them

---

## Recommended indexes

### `packing_lists`

- `(trip_id, owner_user_id, deleted_at)`
- `(trip_id, list_type, deleted_at)`
- `(trip_id, sort_order, deleted_at)`

### `packing_items`

- `(list_id, category_key, deleted_at)`
- `(trip_id, owner_user_id, deleted_at)`
- `(trip_id, assignee_user_id, deleted_at)`
- `(list_id, sort_order, deleted_at)`

---

## Recommended query contract

The Packing route should eventually load:

```ts
type PackingPageData = {
  myLists: Array<{
    id: string;
    name: string;
    visibility: "private" | "public";
    categories: Array<{
      key: string;
      label: string;
      items: PackingItemView[];
    }>;
    uncheckedCount: number;
  }>;
  shared: {
    lists: Array<{
      id: string;
      name: string;
      categories: Array<{
        key: string;
        label: string;
        items: SharedPackingItemView[];
      }>;
    }>;
    uncheckedCount: number;
  };
  suggestions: {
    state: "free_locked" | "premium_ready" | "empty";
  };
};
```

The client should not infer list structure from a flat item array once lists exist.

---

## Recommended action surface

### List actions

- `createPackingListAction`
- `renamePackingListAction`
- `deletePackingListAction`
- `setPackingListVisibilityAction`
- `reorderPackingListsAction`

### Item actions

- `addPackingItemToListAction`
- `editPackingItemAction`
- `deletePackingItemAction`
- `togglePackingItemAction`
- `setPackingItemVisibilityAction`
- `movePackingItemToListAction`
- `movePackingItemToSharedAction`
- `claimSharedPackingItemAction`
- `unassignSharedPackingItemAction`
- `setPackingItemCategoryAction`
- `reorderPackingItemsAction`

---

## What is explicitly deferred

- Suggestions storage and generation
- Travel Day repack integration details
- Multi-user editing conflict resolution beyond current last-write-wins behavior
- Generic reusable list-builder abstractions elsewhere in the app

---

## Risks

### Risk 1: list visibility plus item override can get conceptually messy

UI copy and controls must make inheritance obvious. This is a design problem as much as a data problem.

### Risk 2: current shipped schema may need an intermediate migration

Because the first schema slice already landed, we should treat the next migration as a bridge, not a rewrite.

### Risk 3: shared may eventually want multiple shared lists too

This proposal allows that, but we should not assume it in the first implementation slice.

---

## Recommended next step

1. Use this doc as the new schema source of truth
2. Draft the bridging migration from current `packing_items` to `packing_lists + packing_items.list_id`
3. Update the packing handoff checklist
4. Then prepare Step 2 mockups for list management and run `/design-critique` before UI implementation

---

## Status checklist

- [x] Named-lists contract confirmed
- [x] Prior single-table plan marked as superseded for long-term direction
- [x] New `packing_lists` schema proposal drafted
- [ ] Bridging migration drafted
- [ ] `schema.ts` updated to include `packing_lists`
- [ ] Query layer updated for `myLists`
- [ ] Action layer updated for list management
