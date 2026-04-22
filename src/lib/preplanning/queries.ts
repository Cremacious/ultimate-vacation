import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { lodgings, tripFlights } from "@/lib/db/schema";

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
