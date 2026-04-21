CREATE TABLE "expense_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expense_id" uuid NOT NULL,
	"blob_url" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "settlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" uuid NOT NULL,
	"from_user_id" uuid NOT NULL,
	"to_user_id" uuid NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"settled_at" timestamp with time zone NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "supporter_entitlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"source" text NOT NULL,
	"external_id" text,
	"amount_cents" integer,
	"currency" text,
	"purchased_at" timestamp with time zone NOT NULL,
	"refunded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "preplan_budgets" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "preplan_budgets" CASCADE;--> statement-breakpoint
ALTER TABLE "trips" RENAME COLUMN "status" TO "lifecycle";--> statement-breakpoint
UPDATE "trips"
SET "lifecycle" = 'active'
WHERE "lifecycle" IN ('planning', 'in_progress');--> statement-breakpoint
ALTER TABLE "trips" ALTER COLUMN "lifecycle" SET DEFAULT 'active';--> statement-breakpoint
DROP INDEX "trips_status_idx";--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "budget_cents" integer;--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "budget_notes" text;--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "unsettled_balance_reminder_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "expense_receipts" ADD CONSTRAINT "expense_receipts_expense_id_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_receipts" ADD CONSTRAINT "expense_receipts_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supporter_entitlements" ADD CONSTRAINT "supporter_entitlements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "expense_receipts_expense_id_idx" ON "expense_receipts" USING btree ("expense_id");--> statement-breakpoint
CREATE INDEX "settlements_trip_id_idx" ON "settlements" USING btree ("trip_id");--> statement-breakpoint
CREATE INDEX "settlements_pair_idx" ON "settlements" USING btree ("from_user_id","to_user_id");--> statement-breakpoint
CREATE INDEX "supporter_entitlements_user_id_idx" ON "supporter_entitlements" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "supporter_entitlements_source_external_unique" ON "supporter_entitlements" USING btree ("source","external_id") WHERE "supporter_entitlements"."external_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "trips_lifecycle_idx" ON "trips" USING btree ("lifecycle");--> statement-breakpoint
ALTER TABLE "expense_splits" DROP COLUMN "settled_at";--> statement-breakpoint
ALTER TABLE "trip_members" DROP COLUMN "permissions";