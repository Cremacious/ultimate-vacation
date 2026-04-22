-- Preplanning — Transport (booking records: rental cars, trains, buses, shuttles, ferries)
-- type column stores a validated slug; server actions enforce the allow-list.

CREATE TABLE IF NOT EXISTS "trip_transports" (
  "id"               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  "trip_id"          UUID        NOT NULL REFERENCES "trips"("id") ON DELETE CASCADE,
  "type"             TEXT        NOT NULL,
  "provider"         TEXT,
  "confirmation_code" TEXT,
  "pickup_location"  TEXT,
  "dropoff_location" TEXT,
  "pickup_date"      DATE,
  "pickup_time"      TIME,
  "booking_url"      TEXT,
  "notes"            TEXT,
  "added_by_id"      UUID        NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
  "created_at"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deleted_at"       TIMESTAMPTZ
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trip_transports_trip_id_idx" ON "trip_transports" ("trip_id");
