# Schema Draft

> **Status:** Draft — iterate during the Step-1 detail inventory sprint.
> **ORM:** Drizzle (locked 2026-04-20, see DECISIONS.md).
> **Target home in code:** `src/lib/db/schema.ts`.
> **Scope:** spine tables only. Later-phase tables (polls, notes, wishlist, vault, memory, dream mode sharing, scavenger hunt, shopping list, etc.) will be added when those features move into active work.

This draft is intentionally rough. Every Step-1 detail inventory will refine the column list for its page. Treat this file as a contract sketch, not final DDL. Column types are illustrative Postgres/Drizzle; `citext` for emails, `timestamptz` everywhere time-related, money stored as cents (`integer` or `bigint`) with currency column alongside.

---

## Conventions

- **Primary keys:** `id` is `uuid` (default `gen_random_uuid()`), not serial. Cleaner for distributed writes later, avoids enumeration attacks on invite codes.
- **Timestamps:** every table gets `created_at timestamptz not null default now()`. Mutable tables also get `updated_at timestamptz not null default now()` (trigger or application-level update).
- **Soft deletes:** not used at MVP. Hard delete everywhere. If a row needs to be recoverable, make an explicit decision per-table (e.g., trips may eventually want soft delete; expenses we keep hard delete with a ledger toast per the Expenses grill).
- **Money:** stored as `amount_cents integer` (or `bigint` for multi-currency safety) + `currency text` (ISO 4217). Never floats.
- **Timezones:** store UTC in DB. Trip has a `primary_timezone` column (IANA string). Each destination row can carry its own timezone for multi-location trips.
- **Nullability:** default to NOT NULL unless the field is genuinely optional (notes, confirmation_ref, etc.).
- **Enums:** use Postgres `text` + check constraint for small enums (role, status) rather than `pg_enum` — easier to evolve.

---

## Spine tables

### users

Account per person. Required for all app features. No anonymous access.

| column | type | notes |
|---|---|---|
| id | uuid PK | |
| email | citext unique not null | |
| name | text not null | display name |
| password_hash | text not null | managed by Better Auth |
| email_verified_at | timestamptz | null until verified; may defer verification to Later |
| premium_entitled_at | timestamptz | null = free tier; set once on Stripe purchase, permanent |
| premium_source | text | `stripe_web`, `apple`, `google`, `beta_grant`, `founder`, null |
| created_at / updated_at | timestamptz | |

Index: `email` unique.

### trips

A trip is a plan someone is organizing. One owner. Real or Dream.

| column | type | notes |
|---|---|---|
| id | uuid PK | |
| owner_id | uuid FK users | the paid organizer |
| name | text not null | |
| trip_type | text not null | `real` or `dream` |
| start_date | date | optional; dates can be fuzzy |
| end_date | date | optional |
| ball_color | text not null | hex or palette key |
| primary_timezone | text | IANA; null until destination info is set |
| display_currency | text | ISO 4217; set in Setup |
| status | text not null | `draft`, `planning`, `ready`, `in_progress`, `completed`. Auto-phase transitions are a separate Later-phase feature |
| created_at / updated_at | timestamptz | |

Index: `owner_id`.

### trip_members

Who's on a trip and what they can do. Owner gets a row too (role = `organizer`).

| column | type | notes |
|---|---|---|
| id | uuid PK | |
| trip_id | uuid FK trips on delete cascade | |
| user_id | uuid FK users | |
| role | text not null | `organizer`, `co_organizer`, `contributor`, `viewer` |
| joined_at | timestamptz not null | |
| permissions | jsonb not null default '{}' | per-user overrides on top of role preset; empty = preset-only |
| created_at / updated_at | timestamptz | |

Unique: `(trip_id, user_id)`. Index: `user_id`.

### invites

Shareable code/link for joining a trip.

| column | type | notes |
|---|---|---|
| id | uuid PK | |
| trip_id | uuid FK trips on delete cascade | |
| code | text unique not null | short, URL-safe, non-sequential |
| created_by | uuid FK users | |
| requires_approval | boolean not null default false | gated invite toggle |
| expires_at | timestamptz | null = no expiry |
| max_uses | integer | null = unlimited |
| used_count | integer not null default 0 | |
| revoked_at | timestamptz | null = active |
| created_at | timestamptz | |

Index: `code` unique; `trip_id`.

### preplanning_lodging

**Reference implementation for the multi-entry preplanning pattern.** Every future preplanning section (flights, transportation, group composition, etc.) clones this shape.

| column | type | notes |
|---|---|---|
| id | uuid PK | |
| trip_id | uuid FK trips on delete cascade | |
| position | integer not null | user-ordered list; compute at insert time |
| property_name | text not null | |
| property_type | text not null | `hotel`, `airbnb`, `hostel`, `rental`, `other` |
| city | text | |
| full_address | text | |
| check_in_at | timestamptz | |
| check_out_at | timestamptz | |
| confirmation_ref | text | |
| contact_number | text | |
| notes | text | |
| room_type | text | |
| bed_type | text | |
| num_rooms | integer | |
| floor_unit | text | |
| amenities | jsonb not null default '[]' | multi-select tags |
| cancellation_deadline | timestamptz | |
| cancellation_notes | text | |
| loyalty_ref | text | |
| nightly_rate_cents | integer | nullable |
| total_cost_cents | integer | nullable; auto-linked to expenses table (see below) |
| expense_id | uuid FK expenses | set when total_cost_cents is entered and an expense row is auto-created |
| created_by | uuid FK users | |
| created_at / updated_at | timestamptz | |

Index: `trip_id`; `expense_id`.

**Expense-link behavior:** When a user enters `total_cost_cents`, the app creates a corresponding expense row (category `accommodation`, payer defaulting to the current user, description "Lodging: {property_name}") and stores its id in `expense_id`. Editing the lodging cost updates the linked expense. Deleting the lodging prompts whether to also delete the linked expense.

### itinerary_events

Day-by-day events: activities, meals, reservations, flights, notes.

| column | type | notes |
|---|---|---|
| id | uuid PK | |
| trip_id | uuid FK trips on delete cascade | |
| event_date | date not null | local date in the trip's primary timezone |
| start_time | time | null = all-day |
| end_time | time | |
| title | text not null | |
| category | text | `activity`, `meal`, `reservation`, `flight`, `transport`, `note`, `other` |
| location | text | free-text for now; lat/lon deferred |
| notes | text | |
| created_by | uuid FK users | |
| created_at / updated_at | timestamptz | |

Index: `(trip_id, event_date)`.

### expenses

Full ledger from day zero. Pre-trip expenses live here alongside in-trip ones (Expenses grill: no pre-trip/in-trip UI distinction).

| column | type | notes |
|---|---|---|
| id | uuid PK | |
| trip_id | uuid FK trips on delete cascade | |
| payer_id | uuid FK users | who paid |
| amount_cents | integer not null | always in trip's display_currency |
| original_amount_cents | integer | nullable; set if paid in foreign currency |
| original_currency | text | ISO 4217 if original_amount_cents is set |
| fx_rate | numeric(12,6) | rate used at logging time |
| description | text not null | |
| category | text not null | auto-detected or user-picked |
| paid_at | timestamptz not null | |
| exclude_from_report | boolean not null default false | |
| created_by | uuid FK users | logger (may differ from payer) |
| created_at / updated_at | timestamptz | |

Index: `trip_id`; `payer_id`; `paid_at`.

### expense_splits

Per-participant share of an expense.

| column | type | notes |
|---|---|---|
| id | uuid PK | |
| expense_id | uuid FK expenses on delete cascade | |
| user_id | uuid FK users | |
| amount_cents | integer not null | participant's share |
| settled_at | timestamptz | null = open; per Expenses grill's soft-settlement decision, settlement is per-pair |
| created_at | timestamptz | |

Unique: `(expense_id, user_id)`. Index: `user_id`.

### travel_day_tasks

Per-user task instance for the Travel Day checklist. Personal, not shared.

| column | type | notes |
|---|---|---|
| id | uuid PK | |
| trip_id | uuid FK trips on delete cascade | |
| user_id | uuid FK users | task owner |
| travel_date | date not null | |
| position | integer not null | ordering |
| task_text | text not null | |
| transport_mode | text | `flight`, `drive`, `train`, `cruise`, null |
| completed_at | timestamptz | null = not done |
| is_public | boolean not null default false | organizer-visible if true |
| source | text | `preset` or `custom` |
| created_at / updated_at | timestamptz | |

Index: `(trip_id, travel_date, user_id)`.

### premium_entitlements

Immutable record of the one-time purchase for audit and refund trail. `users.premium_entitled_at` is the fast lookup; this table stores the transaction.

| column | type | notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK users | |
| source | text not null | `stripe_web`, `apple`, `google`, `beta_grant`, `founder` |
| external_id | text | Stripe charge id, Apple transaction id, etc. |
| amount_cents | integer | |
| currency | text | |
| purchased_at | timestamptz not null | |
| refunded_at | timestamptz | |
| created_at | timestamptz | |

Unique: `(source, external_id)` when external_id is not null.

---

## Tables intentionally deferred

These are called out in ARCHITECTURE.md but are not spine-critical. Add them when the relevant feature moves into active work.

- `preplanning_flight`, `preplanning_transport`, `preplanning_group_member`, `preplanning_budget_category`, `preplanning_destination`, `preplanning_visa_health`, `preplanning_document`, `preplanning_logistics` — other preplanning sections. Clone the Lodging shape once per section; the exact column list comes from each section's Step-1 inventory.
- `packing_lists` + `packing_items` — Packing phase is Later per CORE_LOOP.
- `polls`, `poll_options`, `votes` — Later.
- `notes` — Later.
- `wishlist_items` / unified `proposals` — Later (BACKLOG.md Unified Proposal Layer).
- `confirmation_entries` — vault is Later.
- `currency_rate_snapshots`, `destination_references`, `destination_holidays`, `destination_seasonal_risks`, `phrasebook_entries` — tools domain, seed data Later.
- `meetup_broadcasts`, `medication_reminders`, `shopping_list_items`, `scavenger_hunt_items` — tools domain, Later.
- `trip_statistics`, `post_trip_polls` — Memory phase Later.
- `dream_reactions`, `dream_comments`, `dream_saves` — slim Dream Mode Later.
- `audit_trail` / event log — probably needed eventually but not before launch.

---

## Open schema questions

- **Permissions storage:** role preset on `trip_members` + `jsonb` overrides is the current sketch. Alternative: normalized `trip_member_permissions` table with one row per capability. JSONB is faster to iterate during MVP; normalize if querying starts to hurt.
- **Trip lifecycle transitions:** should the state machine live in application code (services layer) or as a Postgres trigger / check? Defer to application code for MVP.
- **Multi-currency on expense_splits:** splits inherit the expense's display currency (already converted). Revisit if we ever support per-split currency overrides — probably never.
- **Invite code format:** 6-char base32 (no ambiguous chars)? 8-char nanoid? Lean toward nanoid for URL-safety and collision headroom.
- **Trip delete cascade scope:** deleting a trip cascades to all its members, events, expenses, etc. Expenses with splits are nuked too — confirm this matches the danger-zone settings copy before wiring.

---

## Next actions

1. Install `drizzle-orm`, `drizzle-kit`, and `postgres` during the first implementation session after the Step-1 inventory sprint.
2. Translate this draft into `src/lib/db/schema.ts` — one exported `table` object per section above.
3. Generate initial migration with `drizzle-kit generate`, review manually, commit both the schema and the migration SQL.
4. Seed minimal reference data (a test user, a test trip) for local development.
5. Revise this draft after every Step-1 inventory lands — the inventory may surface fields not yet captured here.
