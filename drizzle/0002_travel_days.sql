CREATE TABLE "travel_days" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" uuid NOT NULL,
	"date" date NOT NULL,
	"label" text NOT NULL,
	"transport_mode" text DEFAULT 'flight' NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "travel_day_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"travel_day_id" uuid NOT NULL,
	"text" text NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "travel_days" ADD CONSTRAINT "travel_days_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "travel_days" ADD CONSTRAINT "travel_days_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "travel_day_tasks" ADD CONSTRAINT "travel_day_tasks_travel_day_id_travel_days_id_fk" FOREIGN KEY ("travel_day_id") REFERENCES "public"."travel_days"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "travel_day_tasks" ADD CONSTRAINT "travel_day_tasks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "travel_days_trip_date_unique" ON "travel_days" USING btree ("trip_id","date");--> statement-breakpoint
CREATE INDEX "travel_days_trip_id_idx" ON "travel_days" USING btree ("trip_id");--> statement-breakpoint
CREATE INDEX "travel_day_tasks_day_id_idx" ON "travel_day_tasks" USING btree ("travel_day_id");
