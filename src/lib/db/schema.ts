import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * TripWave spine schema — 14 tables (post migration 0001 / 2026-04-21).
 *
 * Canonical order:
 *   Auth       : users, sessions, accounts, verifications
 *   Trip       : trips, trip_members, invites
 *   Pay        : expenses, expense_splits, settlements
 *   Supporter  : supporter_entitlements
 *   Receipts   : expense_receipts
 *   Plan       : itinerary_events
 *   System     : notifications
 *
 * Conventions:
 *   - Primary keys: uuid, default gen_random_uuid() (requires pgcrypto; Neon has it by default).
 *   - Timestamps: timestamptz; created_at required, updated_at where mutable.
 *   - Soft delete: deleted_at timestamptz on tables where row recovery matters.
 *   - Money: integer cents, never floats. Currency stored ISO 4217.
 *   - Timezones: UTC in DB; trip has primary_timezone IANA string.
 *   - Enums: text + application-level validation (easier to evolve than pg_enum).
 *   - accounts + verifications exist to satisfy Better Auth requirements.
 *   - Trip state: only `trips.lifecycle` (active | vaulted | dreaming) is stored.
 *     The 8-state runtime enum is computed via src/lib/trip/state.ts → computeState().
 *   - Settlement: per-pair via `settlements` ledger; `expense_splits.settled_at` removed.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Auth tables (Better Auth compatible)
// ─────────────────────────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    // Supporter (premium) tier — see NAMING.md
    supporterEntitledAt: timestamp("supporter_entitled_at", { withTimezone: true }),
    supporterSource: text("supporter_source"), // stripe_web | apple | google | beta_grant | founder | null
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("users_email_unique").on(sql`lower(${t.email})`)]
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("sessions_token_unique").on(t.token),
    index("sessions_user_id_idx").on(t.userId),
  ]
);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    // Email/password auth: password lives here per Better Auth convention.
    password: text("password"),
    // OAuth fields — nullable for email/password; populated later when OAuth ships.
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("accounts_provider_account_unique").on(t.providerId, t.accountId),
    index("accounts_user_id_idx").on(t.userId),
  ]
);

export const verifications = pgTable(
  "verifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(), // e.g. email, phone
    value: text("value").notNull(), // token / code hash
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("verifications_identifier_idx").on(t.identifier)]
);

// ─────────────────────────────────────────────────────────────────────────────
// Trip domain
// ─────────────────────────────────────────────────────────────────────────────

export const trips = pgTable(
  "trips",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(), // URL-safe unique slug per owner/trip; used by invite links downstream
    tripType: text("trip_type").notNull().default("real"), // real | dream
    startDate: date("start_date"),
    endDate: date("end_date"),
    ballColor: text("ball_color").notNull().default("#7C5CFF"),
    primaryTimezone: text("primary_timezone"), // IANA string; null until destination set
    displayCurrency: text("display_currency").notNull().default("USD"), // ISO 4217
    // User-durable lifecycle: active | vaulted | dreaming.
    // The detailed 8-state enum (Draft/Planning/Ready/TravelDay/InProgress/Stale/Vaulted/Dreaming)
    // is computed via src/lib/trip/state.ts → computeState(trip, now). Never stored.
    lifecycle: text("lifecycle").notNull().default("active"),
    // Budget — inline field (Basics hub collapsed to trip-level per 2026-04-21 launch-scope grill).
    budgetCents: integer("budget_cents"),
    budgetNotes: text("budget_notes"),
    // Retention: set by daily cron when T+14d unsettled-balance reminder has fired for this trip.
    // Null = not yet sent. Never reset — reminder fires once per trip.
    unsettledBalanceReminderSentAt: timestamp("unsettled_balance_reminder_sent_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("trips_slug_unique").on(t.slug),
    index("trips_owner_id_idx").on(t.ownerId),
    index("trips_lifecycle_idx").on(t.lifecycle),
  ]
);

export const tripMembers = pgTable(
  "trip_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Role-only permission model at launch (per 2026-04-21 architecture grill Q4).
    // Values: organizer | trusted | member. Per-user capability overrides deferred post-launch.
    role: text("role").notNull().default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("trip_members_trip_user_unique").on(t.tripId, t.userId),
    index("trip_members_user_id_idx").on(t.userId),
  ]
);

export const invites = pgTable(
  "invites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    code: text("code").notNull(), // short, URL-safe, unguessable (nanoid in app layer)
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    requiresApproval: boolean("requires_approval").notNull().default(false),
    expiresAt: timestamp("expires_at", { withTimezone: true }), // null = no expiry
    maxUses: integer("max_uses"), // null = unlimited
    usedCount: integer("used_count").notNull().default(0),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("invites_code_unique").on(t.code),
    index("invites_trip_id_idx").on(t.tripId),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// Pay arena (the moat)
// ─────────────────────────────────────────────────────────────────────────────

export const expenses = pgTable(
  "expenses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    payerId: uuid("payer_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    // All amounts in trip's display_currency (post-conversion).
    amountCents: integer("amount_cents").notNull(),
    // Original-currency capture (nullable when paid in display currency).
    originalAmountCents: integer("original_amount_cents"),
    originalCurrency: text("original_currency"), // ISO 4217
    fxRate: numeric("fx_rate", { precision: 12, scale: 6 }), // rate used at logging time
    description: text("description").notNull(),
    category: text("category").notNull().default("general"),
    paidAt: timestamp("paid_at", { withTimezone: true }).notNull().defaultNow(),
    excludeFromReport: boolean("exclude_from_report").notNull().default(false),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    index("expenses_trip_id_idx").on(t.tripId),
    index("expenses_payer_id_idx").on(t.payerId),
    index("expenses_paid_at_idx").on(t.paidAt),
  ]
);

export const expenseSplits = pgTable(
  "expense_splits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    expenseId: uuid("expense_id")
      .notNull()
      .references(() => expenses.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    // Participant's share in the expense's amount_cents currency (= trip display_currency).
    amountCents: integer("amount_cents").notNull(),
    // No settled_at — settlement is per-pair via the settlements ledger, not per-split.
    // Per 2026-04-21 architecture grill Q5. Balance formula in src/lib/trip/balance.ts.
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("expense_splits_expense_user_unique").on(t.expenseId, t.userId),
    index("expense_splits_user_id_idx").on(t.userId),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// Settlements (per-pair soft-settlement ledger)
// Balance = sum(splits owed by user) − sum(splits paid by user)
//         − sum(settlements from_user) + sum(settlements to_user).
// Append-only with soft-delete; edits = new settlement row.
// No unique(from, to) — multiple settlements between the same pair are legitimate.
// ─────────────────────────────────────────────────────────────────────────────

export const settlements = pgTable(
  "settlements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    fromUserId: uuid("from_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    toUserId: uuid("to_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull(), // ISO 4217; typically trip display_currency
    settledAt: timestamp("settled_at", { withTimezone: true }).notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    index("settlements_trip_id_idx").on(t.tripId),
    index("settlements_pair_idx").on(t.fromUserId, t.toUserId),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// Supporter entitlements (audit ledger)
// users.supporter_entitled_at is the hot-path read; this table is the cold-path
// source of truth for refunds and disputes. Per 2026-04-21 architecture grill Q7.
// Partial unique (source, external_id) where external_id IS NOT NULL allows
// null external_id for beta_grant / founder rows without collision.
// ─────────────────────────────────────────────────────────────────────────────

export const supporterEntitlements = pgTable(
  "supporter_entitlements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    source: text("source").notNull(), // stripe_web | apple | google | beta_grant | founder
    externalId: text("external_id"), // Stripe charge id, Apple transaction id, etc.
    amountCents: integer("amount_cents"),
    currency: text("currency"), // ISO 4217
    purchasedAt: timestamp("purchased_at", { withTimezone: true }).notNull(),
    refundedAt: timestamp("refunded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("supporter_entitlements_user_id_idx").on(t.userId),
    uniqueIndex("supporter_entitlements_source_external_unique")
      .on(t.source, t.externalId)
      .where(sql`${t.externalId} IS NOT NULL`),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// Expense receipts (functional attachments — Vercel Blob storage)
// Per 2026-04-21 architecture grill Q6. "No image hosting" stance refined:
// no user profile/trip photos; expense receipts are functional attachments.
// ─────────────────────────────────────────────────────────────────────────────

export const expenseReceipts = pgTable(
  "expense_receipts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    expenseId: uuid("expense_id")
      .notNull()
      .references(() => expenses.id, { onDelete: "cascade" }),
    blobUrl: text("blob_url").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    uploadedBy: uuid("uploaded_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [index("expense_receipts_expense_id_idx").on(t.expenseId)]
);

// ─────────────────────────────────────────────────────────────────────────────
// Plan arena
// ─────────────────────────────────────────────────────────────────────────────

export const itineraryEvents = pgTable(
  "itinerary_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    eventDate: date("event_date").notNull(), // local date in trip's primary_timezone
    startTime: time("start_time"), // null = all-day
    endTime: time("end_time"),
    title: text("title").notNull(),
    category: text("category").notNull().default("activity"), // activity | meal | reservation | flight | transport | note | other
    location: text("location"),
    notes: text("notes"),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [index("itinerary_events_trip_date_idx").on(t.tripId, t.eventDate)]
);

// Basics hub collapsed to trips.budget_cents + trips.budget_notes per 2026-04-21 launch-scope grill.
// preplan_budgets table removed in migration 0001. Full Basics hub returns post-launch month 2+.

// ─────────────────────────────────────────────────────────────────────────────
// Notifications (in-app bell only; intra-session awareness, not re-engagement.
// Re-engagement happens via transactional emails — see MONETIZATION.md.)
// ─────────────────────────────────────────────────────────────────────────────

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tripId: uuid("trip_id").references(() => trips.id, { onDelete: "cascade" }), // nullable: account-level notifications
    type: text("type").notNull(), // expense_added | invite_accepted | itinerary_event_added | ...
    payload: jsonb("payload").notNull().default(sql`'{}'::jsonb`),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("notifications_user_unread_idx").on(t.userId, t.readAt),
    index("notifications_trip_id_idx").on(t.tripId),
  ]
);
