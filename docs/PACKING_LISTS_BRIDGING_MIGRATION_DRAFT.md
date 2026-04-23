# Packing Lists Bridging Migration Draft

> Last drafted: 2026-04-23
>
> Purpose: draft the bridge from the current transitional Packing schema to the new `packing_lists + packing_items.list_id` model.
>
> Scope: migration sequencing and SQL shape only. This is a draft, not yet an applied migration.

---

## Goal

Bridge from the current state:

- `packing_items`
- `scope`
- `owner_user_id`
- `is_private`
- `category_key`
- `assignee_user_id`

to the new long-term shape:

- `packing_lists`
- `packing_items.list_id`
- list-level visibility
- item-level visibility override

without breaking the current live Packing page in the middle of rollout.

---

## Migration strategy

This should be treated as a **bridge migration**, not a destructive rewrite.

Recommended approach:

1. add new table
2. add new columns
3. seed default rows
4. backfill item references
5. keep old columns temporarily
6. cut reads and writes over in later app slices
7. only then remove redundant fields

That keeps the app operable while the query/action/UI layers catch up.

---

## Proposed migration name

Recommended next migration:

- `0012_packing_lists_bridge.sql`

---

## Proposed schema additions

### New table: `packing_lists`

```sql
CREATE TABLE "packing_lists" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "trip_id" uuid NOT NULL,
  "owner_user_id" uuid NOT NULL,
  "name" text NOT NULL,
  "list_type" text NOT NULL,
  "visibility" text NOT NULL,
  "sort_order" integer,
  "created_by_id" uuid NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "deleted_at" timestamp with time zone
);
```

Foreign keys:

- `trip_id -> trips.id`
- `owner_user_id -> users.id`
- `created_by_id -> users.id`

### New columns on `packing_items`

```sql
ALTER TABLE "packing_items" ADD COLUMN "list_id" uuid;
ALTER TABLE "packing_items" ADD COLUMN "visibility_override" text;
```

Keep existing columns for now:

- `scope`
- `is_private`
- `category_key`
- `owner_user_id`
- `assignee_user_id`

---

## Seeding strategy

### Shared list seeding

Seed one canonical shared list per trip that already has group-scope rows.

Recommended seeded values:

- `name = 'Shared'`
- `list_type = 'shared'`
- `visibility = 'public'`
- `owner_user_id = trip.owner_id`
- `created_by_id = trip.owner_id`
- `sort_order = 0`

### Personal list seeding

Seed one default personal list per distinct `(trip_id, owner_user_id)` pair found in current personal-scope rows.

Recommended seeded values:

- `name = 'My stuff'`
- `list_type = 'personal'`
- `visibility = 'private'`
- `owner_user_id = packing_items.owner_user_id`
- `created_by_id = packing_items.owner_user_id`
- `sort_order = 0`

Why `My stuff`:

- neutral
- low-commitment
- can be renamed immediately later

---

## Backfill rules

### `packing_items.list_id`

Assign each existing item to a seeded list:

- `scope = 'group'` -> trip's seeded `Shared` list
- `scope = 'my'` -> owner's seeded `My stuff` list

### `packing_items.visibility_override`

Translate current item privacy carefully:

- for seeded shared items:
  - `visibility_override = null`
  - because the shared list itself is public
- for seeded personal items where current `is_private = true`:
  - `visibility_override = null`
  - because the seeded personal list defaults to private
- for seeded personal items where current `is_private = false`:
  - `visibility_override = 'public'`
  - because they must remain visible after moving into a default-private personal list

This avoids accidentally hiding items that are public today.

---

## Recommended SQL draft shape

### 1. Create `packing_lists`

```sql
CREATE TABLE "packing_lists" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "trip_id" uuid NOT NULL,
  "owner_user_id" uuid NOT NULL,
  "name" text NOT NULL,
  "list_type" text NOT NULL,
  "visibility" text NOT NULL,
  "sort_order" integer,
  "created_by_id" uuid NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "deleted_at" timestamp with time zone
);
```

### 2. Add FKs + indexes

```sql
ALTER TABLE "packing_lists"
  ADD CONSTRAINT "packing_lists_trip_id_trips_id_fk"
  FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id")
  ON DELETE cascade ON UPDATE no action;

ALTER TABLE "packing_lists"
  ADD CONSTRAINT "packing_lists_owner_user_id_users_id_fk"
  FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id")
  ON DELETE restrict ON UPDATE no action;

ALTER TABLE "packing_lists"
  ADD CONSTRAINT "packing_lists_created_by_id_users_id_fk"
  FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id")
  ON DELETE restrict ON UPDATE no action;

CREATE INDEX "packing_lists_trip_owner_deleted_idx"
  ON "packing_lists" USING btree ("trip_id", "owner_user_id", "deleted_at");

CREATE INDEX "packing_lists_trip_type_deleted_idx"
  ON "packing_lists" USING btree ("trip_id", "list_type", "deleted_at");
```

### 3. Add new item columns

```sql
ALTER TABLE "packing_items" ADD COLUMN "list_id" uuid;
ALTER TABLE "packing_items" ADD COLUMN "visibility_override" text;
```

### 4. Seed shared lists

```sql
INSERT INTO "packing_lists" (
  "trip_id",
  "owner_user_id",
  "name",
  "list_type",
  "visibility",
  "sort_order",
  "created_by_id"
)
SELECT DISTINCT
  p."trip_id",
  t."owner_id",
  'Shared',
  'shared',
  'public',
  0,
  t."owner_id"
FROM "packing_items" p
JOIN "trips" t ON t."id" = p."trip_id"
WHERE p."deleted_at" IS NULL
  AND p."scope" = 'group';
```

### 5. Seed personal lists

```sql
INSERT INTO "packing_lists" (
  "trip_id",
  "owner_user_id",
  "name",
  "list_type",
  "visibility",
  "sort_order",
  "created_by_id"
)
SELECT DISTINCT
  p."trip_id",
  p."owner_user_id",
  'My stuff',
  'personal',
  'private',
  0,
  p."owner_user_id"
FROM "packing_items" p
WHERE p."deleted_at" IS NULL
  AND p."scope" = 'my';
```

### 6. Backfill `list_id`

Shared rows:

```sql
UPDATE "packing_items" p
SET "list_id" = l."id"
FROM "packing_lists" l
WHERE p."trip_id" = l."trip_id"
  AND p."scope" = 'group'
  AND l."list_type" = 'shared'
  AND l."deleted_at" IS NULL;
```

Personal rows:

```sql
UPDATE "packing_items" p
SET "list_id" = l."id"
FROM "packing_lists" l
WHERE p."trip_id" = l."trip_id"
  AND p."owner_user_id" = l."owner_user_id"
  AND p."scope" = 'my'
  AND l."list_type" = 'personal'
  AND l."deleted_at" IS NULL;
```

### 7. Backfill `visibility_override`

```sql
UPDATE "packing_items"
SET "visibility_override" = 'public'
WHERE "scope" = 'my'
  AND "is_private" = false
  AND "deleted_at" IS NULL;
```

### 8. Add FK for `list_id`

```sql
ALTER TABLE "packing_items"
  ADD CONSTRAINT "packing_items_list_id_packing_lists_id_fk"
  FOREIGN KEY ("list_id") REFERENCES "public"."packing_lists"("id")
  ON DELETE restrict ON UPDATE no action;
```

### 9. Only if backfill is complete, set `list_id` NOT NULL

```sql
ALTER TABLE "packing_items" ALTER COLUMN "list_id" SET NOT NULL;
```

Recommended guard before this step:

- count rows where `list_id IS NULL`
- only proceed if zero

---

## What should stay temporarily

Do **not** remove these yet in the bridge migration:

- `scope`
- `is_private`

Reason:

- current app code still reads from the transitional model
- these fields are useful fallback signals during rollout
- removing them too early raises the chance of a broken intermediate deploy

Recommended cleanup:

- after query layer and write actions are fully cut over

---

## Follow-up application slices after the bridge

1. update `schema.ts` to add `packing_lists` and new item fields
2. update queries to load `myLists`
3. update actions to write `list_id`
4. update UI for named lists and visibility
5. remove or deprecate redundant old columns later

---

## Risks

### Risk 1: duplicate seed rows

Use either `NOT EXISTS` guards or a unique index strategy before repeated local migrations are attempted.

### Risk 2: shared owner semantics

Using `trip.owner_id` for seeded shared-list ownership is fine as a bridge, but shared ownership is product semantics, not literal authorship.

### Risk 3: visibility semantics drift

If the product later decides that public items inside private lists should surface elsewhere, this migration still works, but the read layer will need extra logic.

---

## Recommended next step

1. Critique the named-lists mockup
2. Run `/design-system` on the named-list and visibility pattern
3. If the visual contract holds, convert this draft into the real `0012_packing_lists_bridge.sql`
4. Update `schema.ts` in the same slice
