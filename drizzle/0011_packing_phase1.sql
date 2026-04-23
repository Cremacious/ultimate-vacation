-- Packing Phase 1 foundation (migration 0011)
-- Expands the original shared checklist schema so Packing can grow into:
-- - My list
-- - Group list
-- - privacy on personal items
-- - categories
-- - group-item assignee / bringer state
--
-- Existing live rows backfill as shared group items to preserve current behavior.

ALTER TABLE "packing_items" ADD COLUMN IF NOT EXISTS "owner_user_id" uuid;
--> statement-breakpoint
ALTER TABLE "packing_items" ADD COLUMN IF NOT EXISTS "scope" text;
--> statement-breakpoint
ALTER TABLE "packing_items" ADD COLUMN IF NOT EXISTS "is_private" boolean;
--> statement-breakpoint
ALTER TABLE "packing_items" ADD COLUMN IF NOT EXISTS "category_key" text;
--> statement-breakpoint
ALTER TABLE "packing_items" ADD COLUMN IF NOT EXISTS "quantity" integer;
--> statement-breakpoint
ALTER TABLE "packing_items" ADD COLUMN IF NOT EXISTS "assignee_user_id" uuid;
--> statement-breakpoint
ALTER TABLE "packing_items" ADD COLUMN IF NOT EXISTS "sort_order" integer;
--> statement-breakpoint
ALTER TABLE "packing_items" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone;
--> statement-breakpoint

UPDATE "packing_items"
SET
  "owner_user_id" = COALESCE("owner_user_id", "added_by_id"),
  "scope" = COALESCE("scope", 'group'),
  "is_private" = COALESCE("is_private", false),
  "category_key" = COALESCE("category_key", 'other'),
  "updated_at" = COALESCE("updated_at", "created_at")
WHERE
  "owner_user_id" IS NULL
  OR "scope" IS NULL
  OR "is_private" IS NULL
  OR "category_key" IS NULL
  OR "updated_at" IS NULL;
--> statement-breakpoint

ALTER TABLE "packing_items" ALTER COLUMN "scope" SET DEFAULT 'my';
--> statement-breakpoint
ALTER TABLE "packing_items" ALTER COLUMN "is_private" SET DEFAULT true;
--> statement-breakpoint
ALTER TABLE "packing_items" ALTER COLUMN "category_key" SET DEFAULT 'other';
--> statement-breakpoint
ALTER TABLE "packing_items" ALTER COLUMN "updated_at" SET DEFAULT now();
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'packing_items_owner_user_id_users_id_fk'
  ) THEN
    ALTER TABLE "packing_items"
      ADD CONSTRAINT "packing_items_owner_user_id_users_id_fk"
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
    WHERE conname = 'packing_items_assignee_user_id_users_id_fk'
  ) THEN
    ALTER TABLE "packing_items"
      ADD CONSTRAINT "packing_items_assignee_user_id_users_id_fk"
      FOREIGN KEY ("assignee_user_id") REFERENCES "public"."users"("id")
      ON DELETE set null ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint

ALTER TABLE "packing_items" ALTER COLUMN "owner_user_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "packing_items" ALTER COLUMN "scope" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "packing_items" ALTER COLUMN "is_private" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "packing_items" ALTER COLUMN "category_key" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "packing_items" ALTER COLUMN "updated_at" SET NOT NULL;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "packing_items_trip_owner_scope_deleted_idx"
  ON "packing_items" USING btree ("trip_id", "owner_user_id", "scope", "deleted_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "packing_items_trip_scope_category_deleted_idx"
  ON "packing_items" USING btree ("trip_id", "scope", "category_key", "deleted_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "packing_items_trip_assignee_deleted_idx"
  ON "packing_items" USING btree ("trip_id", "assignee_user_id", "deleted_at");
