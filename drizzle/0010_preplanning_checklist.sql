-- Preplanning — Before You Leave checklist (migration 0010)
-- Stored as a JSONB array of {id, text, checked} per trip.
-- Max 30 items, each text max 200 chars — enforced server-side in updateChecklistAction.
-- Null means no checklist has been started yet.

ALTER TABLE "trips" ADD COLUMN IF NOT EXISTS "preplan_checklist" JSONB;
