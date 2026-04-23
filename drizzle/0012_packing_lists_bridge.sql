-- Packing named-lists bridge (migration 0012)
-- Introduces packing_lists and links existing packing_items into seeded personal/shared lists.

CREATE TABLE IF NOT EXISTS "packing_lists" (
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
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'packing_lists_trip_id_trips_id_fk'
  ) THEN
    ALTER TABLE "packing_lists"
      ADD CONSTRAINT "packing_lists_trip_id_trips_id_fk"
      FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id")
      ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'packing_lists_owner_user_id_users_id_fk'
  ) THEN
    ALTER TABLE "packing_lists"
      ADD CONSTRAINT "packing_lists_owner_user_id_users_id_fk"
      FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id")
      ON DELETE restrict ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'packing_lists_created_by_id_users_id_fk'
  ) THEN
    ALTER TABLE "packing_lists"
      ADD CONSTRAINT "packing_lists_created_by_id_users_id_fk"
      FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id")
      ON DELETE restrict ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint

ALTER TABLE "packing_items" ADD COLUMN IF NOT EXISTS "list_id" uuid;
--> statement-breakpoint
ALTER TABLE "packing_items" ADD COLUMN IF NOT EXISTS "visibility_override" text;
--> statement-breakpoint

INSERT INTO "packing_lists" (
  "trip_id",
  "owner_user_id",
  "name",
  "list_type",
  "visibility",
  "sort_order",
  "created_by_id"
)
SELECT
  t."id",
  t."owner_id",
  'Shared',
  'shared',
  'public',
  0,
  t."owner_id"
FROM "trips" t
WHERE NOT EXISTS (
  SELECT 1
  FROM "packing_lists" l
  WHERE l."trip_id" = t."id"
    AND l."list_type" = 'shared'
    AND l."deleted_at" IS NULL
);
--> statement-breakpoint

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
  AND p."scope" = 'my'
  AND NOT EXISTS (
    SELECT 1
    FROM "packing_lists" l
    WHERE l."trip_id" = p."trip_id"
      AND l."owner_user_id" = p."owner_user_id"
      AND l."list_type" = 'personal'
      AND l."deleted_at" IS NULL
  );
--> statement-breakpoint

UPDATE "packing_items" p
SET "list_id" = l."id"
FROM "packing_lists" l
WHERE p."trip_id" = l."trip_id"
  AND p."scope" = 'group'
  AND l."list_type" = 'shared'
  AND l."deleted_at" IS NULL
  AND p."list_id" IS NULL;
--> statement-breakpoint

UPDATE "packing_items" p
SET "list_id" = l."id"
FROM "packing_lists" l
WHERE p."trip_id" = l."trip_id"
  AND p."owner_user_id" = l."owner_user_id"
  AND p."scope" = 'my'
  AND l."list_type" = 'personal'
  AND l."deleted_at" IS NULL
  AND p."list_id" IS NULL;
--> statement-breakpoint

UPDATE "packing_items"
SET "visibility_override" = 'public'
WHERE "scope" = 'my'
  AND "is_private" = false
  AND "deleted_at" IS NULL
  AND "visibility_override" IS NULL;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'packing_items_list_id_packing_lists_id_fk'
  ) THEN
    ALTER TABLE "packing_items"
      ADD CONSTRAINT "packing_items_list_id_packing_lists_id_fk"
      FOREIGN KEY ("list_id") REFERENCES "public"."packing_lists"("id")
      ON DELETE restrict ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "packing_lists_trip_owner_deleted_idx"
  ON "packing_lists" USING btree ("trip_id", "owner_user_id", "deleted_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "packing_lists_trip_type_deleted_idx"
  ON "packing_lists" USING btree ("trip_id", "list_type", "deleted_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "packing_lists_trip_sort_deleted_idx"
  ON "packing_lists" USING btree ("trip_id", "sort_order", "deleted_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "packing_items_list_id_deleted_idx"
  ON "packing_items" USING btree ("list_id", "deleted_at");
