-- Preplanning — Flights (booking records, not schedule blocks)
-- Distinct from itinerary_events: these store confirmation codes and routing
-- info per booking; the itinerary stores time-based schedule entries.

CREATE TABLE IF NOT EXISTS "trip_flights" (
  "id"                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  "trip_id"           UUID          NOT NULL REFERENCES "trips"("id") ON DELETE CASCADE,
  "airline"           TEXT,
  "flight_number"     TEXT,
  "confirmation_code" TEXT,
  "from_airport"      TEXT,
  "to_airport"        TEXT,
  "departure_date"    DATE,
  "departure_time"    TIME,
  "booking_url"       TEXT,
  "notes"             TEXT,
  "added_by_id"       UUID          NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
  "created_at"        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updated_at"        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "deleted_at"        TIMESTAMPTZ
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trip_flights_trip_id_idx" ON "trip_flights" ("trip_id");
