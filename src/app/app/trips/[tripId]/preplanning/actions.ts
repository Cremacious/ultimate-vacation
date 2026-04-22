"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { lodgings, tripFlights, tripTransports, trips } from "@/lib/db/schema";
import { isTripMember } from "@/lib/invites/permissions";
import type { ChecklistItem } from "@/lib/preplanning/queries";
import { isTripVaulted } from "@/lib/trips/queries";

// ── Shared helpers ───────────────────────────────────────────────────────────

const MAX_NAME = 200;
const MAX_ADDRESS = 300;
const MAX_CONF = 80;
const MAX_URL = 500;
const MAX_NOTES = 1000;
const MAX_TRIP_NOTES = 5000;

const MAX_AIRLINE = 60;
const MAX_FLIGHT_NUMBER = 12;
const MAX_AIRPORT = 10;
const MAX_FLIGHT_CONF = 20;
const MAX_FLIGHT_NOTES = 500;

const MAX_TRANSPORT_PROVIDER = 80;
const MAX_TRANSPORT_CONF = 20;
const MAX_TRANSPORT_LOCATION = 100;
const MAX_TRANSPORT_NOTES = 500;

const VALID_TRANSPORT_TYPES = [
  "rental_car",
  "train",
  "bus",
  "shuttle",
  "ferry",
  "other",
] as const;
type TransportType = (typeof VALID_TRANSPORT_TYPES)[number];

function normalize(raw: FormDataEntryValue | null, max: number): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

function validDateOrNull(raw: FormDataEntryValue | null): string | null {
  if (typeof raw !== "string" || !raw) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null;
}

function validTimeOrNull(raw: FormDataEntryValue | null): string | null {
  if (typeof raw !== "string" || !raw) return null;
  return /^\d{2}:\d{2}$/.test(raw) ? raw : null;
}

function validTransportType(raw: FormDataEntryValue | null): TransportType {
  if (
    typeof raw === "string" &&
    (VALID_TRANSPORT_TYPES as readonly string[]).includes(raw)
  ) {
    return raw as TransportType;
  }
  return "other";
}

// ── Transport ─────────────────────────────────────────────────────────────────

export type TransportFormState = { error?: string; ok?: boolean };

export async function createTransportAction(
  tripId: string,
  _prev: TransportFormState,
  formData: FormData,
): Promise<TransportFormState> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return { error: "You must be a trip member to add transport." };
  if (await isTripVaulted(tripId)) return { error: "This trip is settled." };

  const type = validTransportType(formData.get("type"));
  const provider = normalize(formData.get("provider"), MAX_TRANSPORT_PROVIDER);
  const confirmationCode = normalize(formData.get("confirmationCode"), MAX_TRANSPORT_CONF);
  const pickupLocation = normalize(formData.get("pickupLocation"), MAX_TRANSPORT_LOCATION);
  const dropoffLocation = normalize(formData.get("dropoffLocation"), MAX_TRANSPORT_LOCATION);
  const pickupDate = validDateOrNull(formData.get("pickupDate"));
  const pickupTime = validTimeOrNull(formData.get("pickupTime"));
  const bookingUrl = normalize(formData.get("bookingUrl"), MAX_URL);
  const notes = normalize(formData.get("notes"), MAX_TRANSPORT_NOTES);

  await db.insert(tripTransports).values({
    tripId,
    type,
    provider,
    confirmationCode,
    pickupLocation,
    dropoffLocation,
    pickupDate,
    pickupTime,
    bookingUrl,
    notes,
    addedById: user.id,
  });

  revalidatePath(`/app/trips/${tripId}/preplanning`);
  return { ok: true };
}

export async function updateTransportAction(
  tripId: string,
  _prev: TransportFormState,
  formData: FormData,
): Promise<TransportFormState> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return { error: "You must be a trip member to edit transport." };
  if (await isTripVaulted(tripId)) return { error: "This trip is settled." };

  const id = typeof formData.get("id") === "string" ? String(formData.get("id")) : "";
  if (!id) return { error: "Missing transport id." };

  const type = validTransportType(formData.get("type"));
  const provider = normalize(formData.get("provider"), MAX_TRANSPORT_PROVIDER);
  const confirmationCode = normalize(formData.get("confirmationCode"), MAX_TRANSPORT_CONF);
  const pickupLocation = normalize(formData.get("pickupLocation"), MAX_TRANSPORT_LOCATION);
  const dropoffLocation = normalize(formData.get("dropoffLocation"), MAX_TRANSPORT_LOCATION);
  const pickupDate = validDateOrNull(formData.get("pickupDate"));
  const pickupTime = validTimeOrNull(formData.get("pickupTime"));
  const bookingUrl = normalize(formData.get("bookingUrl"), MAX_URL);
  const notes = normalize(formData.get("notes"), MAX_TRANSPORT_NOTES);

  await db
    .update(tripTransports)
    .set({
      type,
      provider,
      confirmationCode,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      pickupTime,
      bookingUrl,
      notes,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(tripTransports.id, id),
        eq(tripTransports.tripId, tripId),
        isNull(tripTransports.deletedAt),
      )
    );

  revalidatePath(`/app/trips/${tripId}/preplanning`);
  return { ok: true };
}

export async function deleteTransportAction(
  tripId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return;
  if (await isTripVaulted(tripId)) return;

  const id = typeof formData.get("id") === "string" ? String(formData.get("id")) : "";
  if (!id) return;

  await db
    .update(tripTransports)
    .set({ deletedAt: new Date() })
    .where(and(eq(tripTransports.id, id), eq(tripTransports.tripId, tripId)));

  revalidatePath(`/app/trips/${tripId}/preplanning`);
}

// ── Flights ──────────────────────────────────────────────────────────────────

export type FlightFormState = { error?: string; ok?: boolean };

export async function createFlightAction(
  tripId: string,
  _prev: FlightFormState,
  formData: FormData,
): Promise<FlightFormState> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return { error: "You must be a trip member to add a flight." };
  if (await isTripVaulted(tripId)) return { error: "This trip is settled." };

  const airline = normalize(formData.get("airline"), MAX_AIRLINE);
  const flightNumber = normalize(formData.get("flightNumber"), MAX_FLIGHT_NUMBER);
  const confirmationCode = normalize(formData.get("confirmationCode"), MAX_FLIGHT_CONF);

  if (!airline && !flightNumber && !confirmationCode) {
    return { error: "Enter at least an airline, flight number, or confirmation code." };
  }

  const fromAirport = normalize(formData.get("fromAirport"), MAX_AIRPORT);
  const toAirport = normalize(formData.get("toAirport"), MAX_AIRPORT);
  const departureDate = validDateOrNull(formData.get("departureDate"));
  const departureTime = validTimeOrNull(formData.get("departureTime"));
  const bookingUrl = normalize(formData.get("bookingUrl"), MAX_URL);
  const notes = normalize(formData.get("notes"), MAX_FLIGHT_NOTES);

  await db.insert(tripFlights).values({
    tripId,
    airline,
    flightNumber,
    confirmationCode,
    fromAirport,
    toAirport,
    departureDate,
    departureTime,
    bookingUrl,
    notes,
    addedById: user.id,
  });

  revalidatePath(`/app/trips/${tripId}/preplanning`);
  return { ok: true };
}

export async function updateFlightAction(
  tripId: string,
  _prev: FlightFormState,
  formData: FormData,
): Promise<FlightFormState> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return { error: "You must be a trip member to edit a flight." };
  if (await isTripVaulted(tripId)) return { error: "This trip is settled." };

  const id = typeof formData.get("id") === "string" ? String(formData.get("id")) : "";
  if (!id) return { error: "Missing flight id." };

  const airline = normalize(formData.get("airline"), MAX_AIRLINE);
  const flightNumber = normalize(formData.get("flightNumber"), MAX_FLIGHT_NUMBER);
  const confirmationCode = normalize(formData.get("confirmationCode"), MAX_FLIGHT_CONF);

  if (!airline && !flightNumber && !confirmationCode) {
    return { error: "Enter at least an airline, flight number, or confirmation code." };
  }

  const fromAirport = normalize(formData.get("fromAirport"), MAX_AIRPORT);
  const toAirport = normalize(formData.get("toAirport"), MAX_AIRPORT);
  const departureDate = validDateOrNull(formData.get("departureDate"));
  const departureTime = validTimeOrNull(formData.get("departureTime"));
  const bookingUrl = normalize(formData.get("bookingUrl"), MAX_URL);
  const notes = normalize(formData.get("notes"), MAX_FLIGHT_NOTES);

  await db
    .update(tripFlights)
    .set({
      airline,
      flightNumber,
      confirmationCode,
      fromAirport,
      toAirport,
      departureDate,
      departureTime,
      bookingUrl,
      notes,
      updatedAt: new Date(),
    })
    .where(
      and(eq(tripFlights.id, id), eq(tripFlights.tripId, tripId), isNull(tripFlights.deletedAt))
    );

  revalidatePath(`/app/trips/${tripId}/preplanning`);
  return { ok: true };
}

export async function deleteFlightAction(
  tripId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return;
  if (await isTripVaulted(tripId)) return;

  const id = typeof formData.get("id") === "string" ? String(formData.get("id")) : "";
  if (!id) return;

  await db
    .update(tripFlights)
    .set({ deletedAt: new Date() })
    .where(and(eq(tripFlights.id, id), eq(tripFlights.tripId, tripId)));

  revalidatePath(`/app/trips/${tripId}/preplanning`);
}

// ── Stays ────────────────────────────────────────────────────────────────────

export type LodgingFormState = { error?: string; ok?: boolean };

export async function createLodgingAction(
  tripId: string,
  _prev: LodgingFormState,
  formData: FormData,
): Promise<LodgingFormState> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return { error: "You must be a trip member to add a stay." };
  if (await isTripVaulted(tripId)) return { error: "This trip is settled." };

  const name = normalize(formData.get("name"), MAX_NAME);
  if (!name) return { error: "A name is required." };

  const address = normalize(formData.get("address"), MAX_ADDRESS);
  const checkInDate = validDateOrNull(formData.get("checkInDate"));
  const checkOutDate = validDateOrNull(formData.get("checkOutDate"));
  const confirmationNumber = normalize(formData.get("confirmationNumber"), MAX_CONF);
  const bookingUrl = normalize(formData.get("bookingUrl"), MAX_URL);
  const notes = normalize(formData.get("notes"), MAX_NOTES);

  await db.insert(lodgings).values({
    tripId,
    name,
    address,
    checkInDate,
    checkOutDate,
    confirmationNumber,
    bookingUrl,
    notes,
    addedById: user.id,
  });

  revalidatePath(`/app/trips/${tripId}/preplanning`);
  return { ok: true };
}

export async function updateLodgingAction(
  tripId: string,
  _prev: LodgingFormState,
  formData: FormData,
): Promise<LodgingFormState> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return { error: "You must be a trip member to edit a stay." };
  if (await isTripVaulted(tripId)) return { error: "This trip is settled." };

  const id = typeof formData.get("id") === "string" ? String(formData.get("id")) : "";
  if (!id) return { error: "Missing stay id." };

  const name = normalize(formData.get("name"), MAX_NAME);
  if (!name) return { error: "A name is required." };

  const address = normalize(formData.get("address"), MAX_ADDRESS);
  const checkInDate = validDateOrNull(formData.get("checkInDate"));
  const checkOutDate = validDateOrNull(formData.get("checkOutDate"));
  const confirmationNumber = normalize(formData.get("confirmationNumber"), MAX_CONF);
  const bookingUrl = normalize(formData.get("bookingUrl"), MAX_URL);
  const notes = normalize(formData.get("notes"), MAX_NOTES);

  await db
    .update(lodgings)
    .set({
      name,
      address,
      checkInDate,
      checkOutDate,
      confirmationNumber,
      bookingUrl,
      notes,
      updatedAt: new Date(),
    })
    .where(and(eq(lodgings.id, id), eq(lodgings.tripId, tripId), isNull(lodgings.deletedAt)));

  revalidatePath(`/app/trips/${tripId}/preplanning`);
  return { ok: true };
}

export async function deleteLodgingAction(
  tripId: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return;
  if (await isTripVaulted(tripId)) return;

  const id = typeof formData.get("id") === "string" ? String(formData.get("id")) : "";
  if (!id) return;

  await db
    .update(lodgings)
    .set({ deletedAt: new Date() })
    .where(and(eq(lodgings.id, id), eq(lodgings.tripId, tripId)));

  revalidatePath(`/app/trips/${tripId}/preplanning`);
}

// ── Checklist (Before You Leave) ─────────────────────────────────────────────

const MAX_CHECKLIST_ITEMS = 30;
const MAX_CHECKLIST_TEXT = 200;

export type ChecklistFormState = { error?: string; ok?: boolean };

export async function updateChecklistAction(
  tripId: string,
  items: ChecklistItem[],
): Promise<ChecklistFormState> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return { error: "You must be a trip member to update the checklist." };
  if (await isTripVaulted(tripId)) return { error: "This trip is settled." };

  if (!Array.isArray(items)) return { error: "Invalid checklist data." };
  if (items.length > MAX_CHECKLIST_ITEMS) return { error: `Max ${MAX_CHECKLIST_ITEMS} items.` };

  const sanitized: ChecklistItem[] = items
    .map((item) => ({
      id: String(item.id ?? "").slice(0, 36),
      text: String(item.text ?? "").trim().slice(0, MAX_CHECKLIST_TEXT),
      checked: Boolean(item.checked),
    }))
    .filter((item) => item.id && item.text.length > 0);

  await db
    .update(trips)
    .set({ preplanChecklist: sanitized, updatedAt: new Date() })
    .where(eq(trips.id, tripId));

  revalidatePath(`/app/trips/${tripId}/preplanning`);
  return { ok: true };
}

// ── Trip notes (single pad per trip) ─────────────────────────────────────────

export type TripNotesFormState = { error?: string; ok?: boolean };

export async function updateTripNotesAction(
  tripId: string,
  _prev: TripNotesFormState,
  formData: FormData,
): Promise<TripNotesFormState> {
  const user = await requireUser();
  const member = await isTripMember(user.id, tripId);
  if (!member) return { error: "You must be a trip member to edit notes." };
  if (await isTripVaulted(tripId)) return { error: "This trip is settled." };

  // Empty string is a legitimate "clear the pad" action; only normalize length.
  const raw = formData.get("notes");
  const text = typeof raw === "string" ? raw.slice(0, MAX_TRIP_NOTES) : "";
  const valueToStore = text.trim() === "" ? null : text;

  await db
    .update(trips)
    .set({
      preplanNotes: valueToStore,
      preplanNotesUpdatedBy: user.id,
      preplanNotesUpdatedAt: new Date(),
    })
    .where(eq(trips.id, tripId));

  revalidatePath(`/app/trips/${tripId}/preplanning`);
  return { ok: true };
}
