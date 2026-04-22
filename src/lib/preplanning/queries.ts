import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { lodgings, tripFlights, tripTransports } from "@/lib/db/schema";

// ── Checklist ─────────────────────────────────────────────────────────────────

export type ChecklistItem = {
  id: string;
  text: string;
  checked: boolean;
};

// ── Stays ────────────────────────────────────────────────────────────────────

export type Lodging = {
  id: string;
  name: string;
  address: string | null;
  checkInDate: string | null;
  checkOutDate: string | null;
  confirmationNumber: string | null;
  bookingUrl: string | null;
  notes: string | null;
  addedById: string;
};

export async function listLodgings(tripId: string): Promise<Lodging[]> {
  const rows = await db
    .select({
      id: lodgings.id,
      name: lodgings.name,
      address: lodgings.address,
      checkInDate: lodgings.checkInDate,
      checkOutDate: lodgings.checkOutDate,
      confirmationNumber: lodgings.confirmationNumber,
      bookingUrl: lodgings.bookingUrl,
      notes: lodgings.notes,
      addedById: lodgings.addedById,
    })
    .from(lodgings)
    .where(and(eq(lodgings.tripId, tripId), isNull(lodgings.deletedAt)))
    .orderBy(asc(lodgings.createdAt));

  return rows.map((r) => ({
    ...r,
    checkInDate: r.checkInDate ? String(r.checkInDate) : null,
    checkOutDate: r.checkOutDate ? String(r.checkOutDate) : null,
  }));
}

// ── Flights ──────────────────────────────────────────────────────────────────

export type TripFlight = {
  id: string;
  airline: string | null;
  flightNumber: string | null;
  confirmationCode: string | null;
  fromAirport: string | null;
  toAirport: string | null;
  departureDate: string | null;
  departureTime: string | null;
  bookingUrl: string | null;
  notes: string | null;
  addedById: string;
};

export async function listFlights(tripId: string): Promise<TripFlight[]> {
  const rows = await db
    .select({
      id: tripFlights.id,
      airline: tripFlights.airline,
      flightNumber: tripFlights.flightNumber,
      confirmationCode: tripFlights.confirmationCode,
      fromAirport: tripFlights.fromAirport,
      toAirport: tripFlights.toAirport,
      departureDate: tripFlights.departureDate,
      departureTime: tripFlights.departureTime,
      bookingUrl: tripFlights.bookingUrl,
      notes: tripFlights.notes,
      addedById: tripFlights.addedById,
    })
    .from(tripFlights)
    .where(and(eq(tripFlights.tripId, tripId), isNull(tripFlights.deletedAt)))
    .orderBy(asc(tripFlights.departureDate), asc(tripFlights.createdAt));

  return rows.map((r) => ({
    ...r,
    departureDate: r.departureDate ? String(r.departureDate) : null,
    departureTime: r.departureTime ? String(r.departureTime) : null,
  }));
}

// ── Transport ─────────────────────────────────────────────────────────────────

export type TripTransport = {
  id: string;
  type: string;
  provider: string | null;
  confirmationCode: string | null;
  pickupLocation: string | null;
  dropoffLocation: string | null;
  pickupDate: string | null;
  pickupTime: string | null;
  bookingUrl: string | null;
  notes: string | null;
  addedById: string;
};

export async function listTransports(tripId: string): Promise<TripTransport[]> {
  const rows = await db
    .select({
      id: tripTransports.id,
      type: tripTransports.type,
      provider: tripTransports.provider,
      confirmationCode: tripTransports.confirmationCode,
      pickupLocation: tripTransports.pickupLocation,
      dropoffLocation: tripTransports.dropoffLocation,
      pickupDate: tripTransports.pickupDate,
      pickupTime: tripTransports.pickupTime,
      bookingUrl: tripTransports.bookingUrl,
      notes: tripTransports.notes,
      addedById: tripTransports.addedById,
    })
    .from(tripTransports)
    .where(and(eq(tripTransports.tripId, tripId), isNull(tripTransports.deletedAt)))
    .orderBy(asc(tripTransports.pickupDate), asc(tripTransports.createdAt));

  return rows.map((r) => ({
    ...r,
    pickupDate: r.pickupDate ? String(r.pickupDate) : null,
    pickupTime: r.pickupTime ? String(r.pickupTime) : null,
  }));
}
