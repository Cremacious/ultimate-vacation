-- Preplanning v1 — Stays + trip-level notes pad.
-- Member-level collaborative; vault-guarded at the action layer.
-- Flights and transport intentionally stay in itinerary_events.

ALTER TABLE "trips" ADD COLUMN "preplan_notes" text;--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "preplan_notes_updated_by" uuid;--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "preplan_notes_updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_preplan_notes_updated_by_users_id_fk" FOREIGN KEY ("preplan_notes_updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint

CREATE TABLE "lodgings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "trip_id" uuid NOT NULL,
  "name" text NOT NULL,
  "address" text,
  "check_in_date" date,
  "check_out_date" date,
  "confirmation_number" text,
  "booking_url" text,
  "notes" text,
  "added_by_id" uuid NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "deleted_at" timestamp with time zone
);--> statement-breakpoint

ALTER TABLE "lodgings" ADD CONSTRAINT "lodgings_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lodgings" ADD CONSTRAINT "lodgings_added_by_id_users_id_fk" FOREIGN KEY ("added_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lodgings_trip_id_idx" ON "lodgings" USING btree ("trip_id");
