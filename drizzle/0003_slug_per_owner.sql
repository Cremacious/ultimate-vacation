-- Change trips slug uniqueness from global to per-owner.
-- Two different users can now have trips with the same name/slug.
-- The slug already contains a random hex suffix so same-owner collisions are
-- astronomically unlikely; this constraint matches the documented intent.
DROP INDEX IF EXISTS "trips_slug_unique";
--> statement-breakpoint
CREATE UNIQUE INDEX "trips_slug_owner_unique" ON "trips" ("owner_id","slug");
