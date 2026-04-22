"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { lodgings, tripFlights, trips } from "@/lib/db/schema";
import { isTripMember } from "@/lib/invites/permissions";
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
