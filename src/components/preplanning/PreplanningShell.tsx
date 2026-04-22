"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Trash, PencilSimple, Plus, Link as LinkIcon } from "@phosphor-icons/react";

import type { ChecklistItem, Lodging, TripFlight, TripTransport } from "@/lib/preplanning/queries";
import type {
  ChecklistFormState,
  FlightFormState,
  LodgingFormState,
  TransportFormState,
  TripNotesFormState,
} from "@/app/app/trips/[tripId]/preplanning/actions";

// ── Types ────────────────────────────────────────────────────────────────────

type NotesMeta = {
  updatedAt: string | null; // ISO
  updatedByName: string | null;
};

export interface PreplanningShellProps {
  tripId: string;
  flights: TripFlight[];
  transports: TripTransport[];
  lodgings: Lodging[];
  tripNotes: string;
  notesMeta: NotesMeta;
  createFlightAction: (prev: FlightFormState, fd: FormData) => Promise<FlightFormState>;
  updateFlightAction: (prev: FlightFormState, fd: FormData) => Promise<FlightFormState>;
  deleteFlightAction: (fd: FormData) => Promise<void>;
  createTransportAction: (prev: TransportFormState, fd: FormData) => Promise<TransportFormState>;
  updateTransportAction: (prev: TransportFormState, fd: FormData) => Promise<TransportFormState>;
  deleteTransportAction: (fd: FormData) => Promise<void>;
  createStayAction: (prev: LodgingFormState, fd: FormData) => Promise<LodgingFormState>;
  updateStayAction: (prev: LodgingFormState, fd: FormData) => Promise<LodgingFormState>;
  deleteStayAction: (fd: FormData) => Promise<void>;
  updateNotesAction: (prev: TripNotesFormState, fd: FormData) => Promise<TripNotesFormState>;
  initialChecklist: ChecklistItem[];
  updateChecklistAction: (items: ChecklistItem[]) => Promise<ChecklistFormState>;
}

// ── Shared form constants ────────────────────────────────────────────────────

const INPUT_CLASS =
  "w-full rounded-xl px-3 py-2 text-sm bg-[#15162A] border border-[#2A2B45] text-white placeholder:text-white/30 focus:outline-none focus:border-[#00E5FF] transition-colors";
const LABEL_CLASS = "text-[11px] font-black uppercase tracking-wide text-white/40 mb-1";

// ── Flights section ──────────────────────────────────────────────────────────

type FlightFieldValues = Partial<Omit<TripFlight, "id" | "addedById">>;

function FlightFormFields({ initial }: { initial?: FlightFieldValues }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Airline</span>
        <input
          type="text"
          name="airline"
          maxLength={60}
          defaultValue={initial?.airline ?? ""}
          placeholder="Delta"
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Flight #</span>
        <input
          type="text"
          name="flightNumber"
          maxLength={12}
          defaultValue={initial?.flightNumber ?? ""}
          placeholder="DL 447"
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>From</span>
        <input
          type="text"
          name="fromAirport"
          maxLength={10}
          defaultValue={initial?.fromAirport ?? ""}
          placeholder="JFK"
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>To</span>
        <input
          type="text"
          name="toAirport"
          maxLength={10}
          defaultValue={initial?.toAirport ?? ""}
          placeholder="CUN"
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Departure date</span>
        <input
          type="date"
          name="departureDate"
          defaultValue={initial?.departureDate ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Departure time</span>
        <input
          type="time"
          name="departureTime"
          defaultValue={toTimeInputValue(initial?.departureTime ?? null)}
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Confirmation #</span>
        <input
          type="text"
          name="confirmationCode"
          maxLength={20}
          defaultValue={initial?.confirmationCode ?? ""}
          placeholder="XK8R2T"
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Booking URL</span>
        <input
          type="url"
          name="bookingUrl"
          maxLength={500}
          defaultValue={initial?.bookingUrl ?? ""}
          placeholder="https://…"
          className={INPUT_CLASS}
        />
      </label>

      <label className="sm:col-span-2 flex flex-col">
        <span className={LABEL_CLASS}>Notes</span>
        <textarea
          name="notes"
          rows={2}
          maxLength={500}
          defaultValue={initial?.notes ?? ""}
          placeholder="Arrival time, seat info, terminal, anything the group should know…"
          className={INPUT_CLASS}
        />
      </label>
    </div>
  );
}

function AddFlightForm({
  createAction,
  onDone,
}: {
  createAction: PreplanningShellProps["createFlightAction"];
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(createAction, {} as FlightFormState);

  if (state.ok) {
    queueMicrotask(onDone);
  }

  return (
    <form action={formAction} className="rounded-2xl border border-[#2A2B45] p-4 bg-[#15162A]/40">
      <FlightFormFields />
      {state.error && (
        <p role="alert" className="mt-3 text-sm font-semibold" style={{ color: "#FF3DA7" }}>
          {state.error}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="font-bold rounded-full px-4 py-2 text-sm hover:brightness-110 transition disabled:opacity-50"
          style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
        >
          {pending ? "Adding…" : "Add flight"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-sm font-semibold text-white/50 hover:text-white/80 transition-colors px-3 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function FlightCard({
  flight,
  updateAction,
  deleteAction,
}: {
  flight: TripFlight;
  updateAction: PreplanningShellProps["updateFlightAction"];
  deleteAction: PreplanningShellProps["deleteFlightAction"];
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateAction, {} as FlightFormState);
  const [isDeleting, startDelete] = useTransition();

  if (state.ok && editing) {
    queueMicrotask(() => setEditing(false));
  }

  if (editing) {
    return (
      <form action={formAction} className="rounded-2xl border border-[#2A2B45] p-4 bg-[#15162A]/40">
        <input type="hidden" name="id" value={flight.id} />
        <FlightFormFields initial={flight} />
        {state.error && (
          <p role="alert" className="mt-3 text-sm font-semibold" style={{ color: "#FF3DA7" }}>
            {state.error}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="submit"
            disabled={pending}
            className="font-bold rounded-full px-4 py-2 text-sm hover:brightness-110 transition disabled:opacity-50"
            style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-sm font-semibold text-white/50 hover:text-white/80 transition-colors px-3 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  const header = formatFlightHeader(flight);
  const meta = formatFlightMeta(flight);

  return (
    <article className="rounded-2xl border border-[#2A2B45] p-4 bg-[#15162A]/40 flex flex-col gap-2">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-white truncate">{header}</h3>
          {meta && <p className="text-xs text-white/55 mt-0.5">{meta}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            aria-label="Edit flight"
            onClick={() => setEditing(true)}
            className="p-1.5 rounded-md text-white/45 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <PencilSimple size={14} weight="bold" />
          </button>
          <form
            action={(fd) => startDelete(async () => await deleteAction(fd))}
            className="inline-flex"
          >
            <input type="hidden" name="id" value={flight.id} />
            <button
              type="submit"
              aria-label="Delete flight"
              disabled={isDeleting}
              className="p-1.5 rounded-md text-white/45 hover:text-[#FF3DA7] hover:bg-white/[0.06] transition-colors disabled:opacity-40"
            >
              <Trash size={14} weight="bold" />
            </button>
          </form>
        </div>
      </header>

      {(flight.confirmationCode || flight.bookingUrl) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {flight.confirmationCode && (
            <span className="rounded-full px-2.5 py-1 bg-white/[0.05] text-white/70 font-semibold">
              Conf: {flight.confirmationCode}
            </span>
          )}
          {flight.bookingUrl && (
            <a
              href={flight.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 bg-white/[0.05] text-[#00E5FF] font-semibold hover:brightness-110"
            >
              <LinkIcon size={10} weight="bold" />
              Booking
            </a>
          )}
        </div>
      )}

      {flight.notes && (
        <p className="text-sm text-white/60 whitespace-pre-wrap">{flight.notes}</p>
      )}
    </article>
  );
}

function FlightsSection({
  flights,
  createAction,
  updateAction,
  deleteAction,
}: {
  flights: TripFlight[];
  createAction: PreplanningShellProps["createFlightAction"];
  updateAction: PreplanningShellProps["updateFlightAction"];
  deleteAction: PreplanningShellProps["deleteFlightAction"];
}) {
  const [adding, setAdding] = useState(false);

  return (
    <section aria-label="Flights" className="flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <h2
          className="text-lg font-semibold text-white"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Flights
        </h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-full px-3 py-1.5 hover:brightness-110 transition"
            style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
          >
            <Plus size={12} weight="bold" />
            Add a flight
          </button>
        )}
      </header>

      {flights.length === 0 && !adding && (
        <div
          className="rounded-2xl border border-[#2A2B45] px-6 py-10 text-center"
          style={{ backgroundColor: "#15162A" }}
        >
          <p className="text-sm text-white/50">No flights yet.</p>
          <p className="text-xs text-white/30 mt-1">
            Add your confirmation codes so the group knows how everyone is getting there.
          </p>
        </div>
      )}

      {flights.map((flight) => (
        <FlightCard
          key={flight.id}
          flight={flight}
          updateAction={updateAction}
          deleteAction={deleteAction}
        />
      ))}

      {adding && <AddFlightForm createAction={createAction} onDone={() => setAdding(false)} />}
    </section>
  );
}

// ── Transport section ────────────────────────────────────────────────────────

const TRANSPORT_LABELS: Record<string, string> = {
  rental_car: "Rental car",
  train: "Train",
  bus: "Bus / Coach",
  shuttle: "Shuttle",
  ferry: "Ferry",
  other: "Transport",
};

type TransportFieldValues = Partial<Omit<TripTransport, "id" | "addedById">>;

function TransportFormFields({ initial }: { initial?: TransportFieldValues }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Type</span>
        <select
          name="type"
          defaultValue={initial?.type ?? "rental_car"}
          className={INPUT_CLASS}
        >
          <option value="rental_car">Rental car</option>
          <option value="train">Train</option>
          <option value="bus">Bus / Coach</option>
          <option value="shuttle">Shuttle</option>
          <option value="ferry">Ferry</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Provider</span>
        <input
          type="text"
          name="provider"
          maxLength={80}
          defaultValue={initial?.provider ?? ""}
          placeholder="Budget, Amtrak, FlixBus…"
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Pickup</span>
        <input
          type="text"
          name="pickupLocation"
          maxLength={100}
          defaultValue={initial?.pickupLocation ?? ""}
          placeholder="JFK Terminal 4"
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Drop-off</span>
        <input
          type="text"
          name="dropoffLocation"
          maxLength={100}
          defaultValue={initial?.dropoffLocation ?? ""}
          placeholder="Hotel lobby"
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Pickup date</span>
        <input
          type="date"
          name="pickupDate"
          defaultValue={initial?.pickupDate ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Pickup time</span>
        <input
          type="time"
          name="pickupTime"
          defaultValue={toTimeInputValue(initial?.pickupTime ?? null)}
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Confirmation #</span>
        <input
          type="text"
          name="confirmationCode"
          maxLength={20}
          defaultValue={initial?.confirmationCode ?? ""}
          placeholder="XK8R2T"
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Booking URL</span>
        <input
          type="url"
          name="bookingUrl"
          maxLength={500}
          defaultValue={initial?.bookingUrl ?? ""}
          placeholder="https://…"
          className={INPUT_CLASS}
        />
      </label>

      <label className="sm:col-span-2 flex flex-col">
        <span className={LABEL_CLASS}>Notes</span>
        <textarea
          name="notes"
          rows={2}
          maxLength={500}
          defaultValue={initial?.notes ?? ""}
          placeholder="Vehicle type, seats, driver info, anything the group should know…"
          className={INPUT_CLASS}
        />
      </label>
    </div>
  );
}

function AddTransportForm({
  createAction,
  onDone,
}: {
  createAction: PreplanningShellProps["createTransportAction"];
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(createAction, {} as TransportFormState);

  if (state.ok) {
    queueMicrotask(onDone);
  }

  return (
    <form action={formAction} className="rounded-2xl border border-[#2A2B45] p-4 bg-[#15162A]/40">
      <TransportFormFields />
      {state.error && (
        <p role="alert" className="mt-3 text-sm font-semibold" style={{ color: "#FF3DA7" }}>
          {state.error}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="font-bold rounded-full px-4 py-2 text-sm hover:brightness-110 transition disabled:opacity-50"
          style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
        >
          {pending ? "Adding…" : "Add transport"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-sm font-semibold text-white/50 hover:text-white/80 transition-colors px-3 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function TransportCard({
  transport,
  updateAction,
  deleteAction,
}: {
  transport: TripTransport;
  updateAction: PreplanningShellProps["updateTransportAction"];
  deleteAction: PreplanningShellProps["deleteTransportAction"];
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateAction, {} as TransportFormState);
  const [isDeleting, startDelete] = useTransition();

  if (state.ok && editing) {
    queueMicrotask(() => setEditing(false));
  }

  if (editing) {
    return (
      <form action={formAction} className="rounded-2xl border border-[#2A2B45] p-4 bg-[#15162A]/40">
        <input type="hidden" name="id" value={transport.id} />
        <TransportFormFields initial={transport} />
        {state.error && (
          <p role="alert" className="mt-3 text-sm font-semibold" style={{ color: "#FF3DA7" }}>
            {state.error}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="submit"
            disabled={pending}
            className="font-bold rounded-full px-4 py-2 text-sm hover:brightness-110 transition disabled:opacity-50"
            style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-sm font-semibold text-white/50 hover:text-white/80 transition-colors px-3 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  const header = formatTransportHeader(transport);
  const meta = formatTransportMeta(transport);

  return (
    <article className="rounded-2xl border border-[#2A2B45] p-4 bg-[#15162A]/40 flex flex-col gap-2">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-white truncate">{header}</h3>
          {meta && <p className="text-xs text-white/55 mt-0.5">{meta}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            aria-label="Edit transport"
            onClick={() => setEditing(true)}
            className="p-1.5 rounded-md text-white/45 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <PencilSimple size={14} weight="bold" />
          </button>
          <form
            action={(fd) => startDelete(async () => await deleteAction(fd))}
            className="inline-flex"
          >
            <input type="hidden" name="id" value={transport.id} />
            <button
              type="submit"
              aria-label="Delete transport"
              disabled={isDeleting}
              className="p-1.5 rounded-md text-white/45 hover:text-[#FF3DA7] hover:bg-white/[0.06] transition-colors disabled:opacity-40"
            >
              <Trash size={14} weight="bold" />
            </button>
          </form>
        </div>
      </header>

      {(transport.confirmationCode || transport.bookingUrl) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {transport.confirmationCode && (
            <span className="rounded-full px-2.5 py-1 bg-white/[0.05] text-white/70 font-semibold">
              Conf: {transport.confirmationCode}
            </span>
          )}
          {transport.bookingUrl && (
            <a
              href={transport.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 bg-white/[0.05] text-[#00E5FF] font-semibold hover:brightness-110"
            >
              <LinkIcon size={10} weight="bold" />
              Booking
            </a>
          )}
        </div>
      )}

      {transport.notes && (
        <p className="text-sm text-white/60 whitespace-pre-wrap">{transport.notes}</p>
      )}
    </article>
  );
}

function TransportSection({
  transports,
  createAction,
  updateAction,
  deleteAction,
}: {
  transports: TripTransport[];
  createAction: PreplanningShellProps["createTransportAction"];
  updateAction: PreplanningShellProps["updateTransportAction"];
  deleteAction: PreplanningShellProps["deleteTransportAction"];
}) {
  const [adding, setAdding] = useState(false);

  return (
    <section aria-label="Transport" className="flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <h2
          className="text-lg font-semibold text-white"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Transport
        </h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-full px-3 py-1.5 hover:brightness-110 transition"
            style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
          >
            <Plus size={12} weight="bold" />
            Add transport
          </button>
        )}
      </header>

      {transports.length === 0 && !adding && (
        <div
          className="rounded-2xl border border-[#2A2B45] px-6 py-10 text-center"
          style={{ backgroundColor: "#15162A" }}
        >
          <p className="text-sm text-white/50">No transport yet.</p>
          <p className="text-xs text-white/30 mt-1">
            Add rental cars, trains, shuttles — anything that needs a confirmation.
          </p>
        </div>
      )}

      {transports.map((transport) => (
        <TransportCard
          key={transport.id}
          transport={transport}
          updateAction={updateAction}
          deleteAction={deleteAction}
        />
      ))}

      {adding && (
        <AddTransportForm createAction={createAction} onDone={() => setAdding(false)} />
      )}
    </section>
  );
}

// ── Stays section ────────────────────────────────────────────────────────────

type LodgingFieldValues = Partial<Omit<Lodging, "id" | "addedById">>;

function LodgingFormFields({ initial }: { initial?: LodgingFieldValues }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <label className="sm:col-span-2 flex flex-col">
        <span className={LABEL_CLASS}>Name *</span>
        <input
          type="text"
          name="name"
          required
          maxLength={200}
          defaultValue={initial?.name ?? ""}
          placeholder="The Airbnb in Pearl District"
          className={INPUT_CLASS}
        />
      </label>

      <label className="sm:col-span-2 flex flex-col">
        <span className={LABEL_CLASS}>Address</span>
        <input
          type="text"
          name="address"
          maxLength={300}
          defaultValue={initial?.address ?? ""}
          placeholder="123 NW Everett St, Portland, OR"
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Check-in</span>
        <input
          type="date"
          name="checkInDate"
          defaultValue={initial?.checkInDate ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Check-out</span>
        <input
          type="date"
          name="checkOutDate"
          defaultValue={initial?.checkOutDate ?? ""}
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Confirmation #</span>
        <input
          type="text"
          name="confirmationNumber"
          maxLength={80}
          defaultValue={initial?.confirmationNumber ?? ""}
          placeholder="ABC-12345"
          className={INPUT_CLASS}
        />
      </label>

      <label className="flex flex-col">
        <span className={LABEL_CLASS}>Booking URL</span>
        <input
          type="url"
          name="bookingUrl"
          maxLength={500}
          defaultValue={initial?.bookingUrl ?? ""}
          placeholder="https://…"
          className={INPUT_CLASS}
        />
      </label>

      <label className="sm:col-span-2 flex flex-col">
        <span className={LABEL_CLASS}>Notes</span>
        <textarea
          name="notes"
          rows={2}
          maxLength={1000}
          defaultValue={initial?.notes ?? ""}
          placeholder="Parking info, door code, anything the group should know…"
          className={INPUT_CLASS}
        />
      </label>
    </div>
  );
}

function AddStayForm({
  createAction,
  onDone,
}: {
  createAction: PreplanningShellProps["createStayAction"];
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(createAction, {} as LodgingFormState);

  if (state.ok) {
    queueMicrotask(onDone);
  }

  return (
    <form action={formAction} className="rounded-2xl border border-[#2A2B45] p-4 bg-[#15162A]/40">
      <LodgingFormFields />
      {state.error && (
        <p role="alert" className="mt-3 text-sm font-semibold" style={{ color: "#FF3DA7" }}>
          {state.error}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="font-bold rounded-full px-4 py-2 text-sm hover:brightness-110 transition disabled:opacity-50"
          style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
        >
          {pending ? "Adding…" : "Add stay"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-sm font-semibold text-white/50 hover:text-white/80 transition-colors px-3 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function StayCard({
  stay,
  updateAction,
  deleteAction,
}: {
  stay: Lodging;
  updateAction: PreplanningShellProps["updateStayAction"];
  deleteAction: PreplanningShellProps["deleteStayAction"];
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateAction, {} as LodgingFormState);
  const [isDeleting, startDelete] = useTransition();

  if (state.ok && editing) {
    queueMicrotask(() => setEditing(false));
  }

  if (editing) {
    return (
      <form action={formAction} className="rounded-2xl border border-[#2A2B45] p-4 bg-[#15162A]/40">
        <input type="hidden" name="id" value={stay.id} />
        <LodgingFormFields initial={stay} />
        {state.error && (
          <p role="alert" className="mt-3 text-sm font-semibold" style={{ color: "#FF3DA7" }}>
            {state.error}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="submit"
            disabled={pending}
            className="font-bold rounded-full px-4 py-2 text-sm hover:brightness-110 transition disabled:opacity-50"
            style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-sm font-semibold text-white/50 hover:text-white/80 transition-colors px-3 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  const nights = computeNights(stay.checkInDate, stay.checkOutDate);

  return (
    <article className="rounded-2xl border border-[#2A2B45] p-4 bg-[#15162A]/40 flex flex-col gap-2">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-white truncate">{stay.name}</h3>
          {(stay.checkInDate || stay.checkOutDate) && (
            <p className="text-xs text-white/55 mt-0.5">
              {formatDateRange(stay.checkInDate, stay.checkOutDate)}
              {nights !== null && (
                <span className="text-white/35">
                  {" · "}
                  {nights} {nights === 1 ? "night" : "nights"}
                </span>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            aria-label="Edit stay"
            onClick={() => setEditing(true)}
            className="p-1.5 rounded-md text-white/45 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <PencilSimple size={14} weight="bold" />
          </button>
          <form
            action={(fd) => startDelete(async () => await deleteAction(fd))}
            className="inline-flex"
          >
            <input type="hidden" name="id" value={stay.id} />
            <button
              type="submit"
              aria-label="Delete stay"
              disabled={isDeleting}
              className="p-1.5 rounded-md text-white/45 hover:text-[#FF3DA7] hover:bg-white/[0.06] transition-colors disabled:opacity-40"
            >
              <Trash size={14} weight="bold" />
            </button>
          </form>
        </div>
      </header>

      {stay.address && <p className="text-sm text-white/70">{stay.address}</p>}

      {(stay.confirmationNumber || stay.bookingUrl) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {stay.confirmationNumber && (
            <span className="rounded-full px-2.5 py-1 bg-white/[0.05] text-white/70 font-semibold">
              Conf: {stay.confirmationNumber}
            </span>
          )}
          {stay.bookingUrl && (
            <a
              href={stay.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 bg-white/[0.05] text-[#00E5FF] font-semibold hover:brightness-110"
            >
              <LinkIcon size={10} weight="bold" />
              Booking
            </a>
          )}
        </div>
      )}

      {stay.notes && (
        <p className="text-sm text-white/60 whitespace-pre-wrap">{stay.notes}</p>
      )}
    </article>
  );
}

function StaysSection({
  lodgings,
  createAction,
  updateAction,
  deleteAction,
  id,
}: {
  lodgings: Lodging[];
  createAction: PreplanningShellProps["createStayAction"];
  updateAction: PreplanningShellProps["updateStayAction"];
  deleteAction: PreplanningShellProps["deleteStayAction"];
  id?: string;
}) {
  const [adding, setAdding] = useState(false);

  return (
    <section id={id} aria-label="Stays" className="flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <h2
          className="text-lg font-semibold text-white"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          Stays
        </h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-full px-3 py-1.5 hover:brightness-110 transition"
            style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
          >
            <Plus size={12} weight="bold" />
            Add a stay
          </button>
        )}
      </header>

      {lodgings.length === 0 && !adding && (
        <div
          className="rounded-2xl border border-[#2A2B45] px-6 py-10 text-center"
          style={{ backgroundColor: "#15162A" }}
        >
          <p className="text-sm text-white/50">No stays yet.</p>
          <p className="text-xs text-white/30 mt-1">
            Add your Airbnb, hotel, or wherever the group is crashing.
          </p>
        </div>
      )}

      {lodgings.map((stay) => (
        <StayCard
          key={stay.id}
          stay={stay}
          updateAction={updateAction}
          deleteAction={deleteAction}
        />
      ))}

      {adding && <AddStayForm createAction={createAction} onDone={() => setAdding(false)} />}
    </section>
  );
}

// ── Trip notes section ───────────────────────────────────────────────────────

function TripNotesSection({
  initialText,
  notesMeta,
  updateNotesAction,
  id,
}: {
  initialText: string;
  notesMeta: NotesMeta;
  updateNotesAction: PreplanningShellProps["updateNotesAction"];
  id?: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateNotesAction,
    {} as TripNotesFormState,
  );
  const [value, setValue] = useState(initialText);
  const dirty = value !== initialText;

  return (
    <section id={id} aria-label="Trip notes" className="flex flex-col gap-2">
      <h2
        className="text-lg font-semibold text-white"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Trip notes
      </h2>

      <form action={formAction} className="flex flex-col gap-2">
        <textarea
          name="notes"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={5000}
          rows={6}
          placeholder="Parking codes, Wi-Fi passwords, anything the group should know."
          className="rounded-2xl px-4 py-3 text-sm bg-[#15162A] border border-[#2A2B45] text-white placeholder:text-white/30 focus:outline-none focus:border-[#00E5FF] transition-colors resize-y min-h-[140px]"
        />

        {state.error && (
          <p role="alert" className="text-sm font-semibold" style={{ color: "#FF3DA7" }}>
            {state.error}
          </p>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-white/35">
            {notesMeta.updatedAt
              ? `Last edited${notesMeta.updatedByName ? ` by ${notesMeta.updatedByName}` : ""} · ${formatRelative(notesMeta.updatedAt)}`
              : "Not edited yet"}
          </p>
          <button
            type="submit"
            disabled={pending || !dirty}
            className="font-bold rounded-full px-4 py-2 text-sm hover:brightness-110 transition disabled:opacity-40"
            style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </section>
  );
}

// ── Section anchor nav ────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: "travel", label: "Travel" },
  { id: "stays",  label: "Stays"  },
  { id: "prep",   label: "Prep"   },
  { id: "notes",  label: "Notes"  },
] as const;

function PreplanningNav() {
  const [active, setActive] = useState<string>("travel");

  useEffect(() => {
    const observers = NAV_SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.25 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <nav className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" aria-label="Preplanning sections">
      {NAV_SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            setActive(id);
          }}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
            active === id
              ? "bg-[#2A2B45] text-white border border-[#00E5FF]/40"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

// ── Checklist card (Before you leave) ────────────────────────────────────────

const MAX_CHECKLIST_ITEMS = 30;
const MAX_ITEM_TEXT = 200;

function ChecklistCard({
  initialItems,
  updateAction,
}: {
  initialItems: ChecklistItem[];
  updateAction: (items: ChecklistItem[]) => Promise<ChecklistFormState>;
}) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function persist(newItems: ChecklistItem[]) {
    startTransition(async () => {
      const result = await updateAction(newItems);
      if (result?.error) setError(result.error);
      else setError(null);
    });
  }

  function handleAdd() {
    const text = inputValue.trim().slice(0, MAX_ITEM_TEXT);
    if (!text) return;
    if (items.length >= MAX_CHECKLIST_ITEMS) {
      setError(`Max ${MAX_CHECKLIST_ITEMS} items.`);
      return;
    }
    const newItems = [...items, { id: crypto.randomUUID(), text, checked: false }];
    setItems(newItems);
    setInputValue("");
    persist(newItems);
  }

  function handleToggle(id: string) {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item,
    );
    setItems(newItems);
    persist(newItems);
  }

  function handleDelete(id: string) {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    persist(newItems);
  }

  const doneCount = items.filter((i) => i.checked).length;

  return (
    <div className="rounded-2xl border border-[#2A2B45] p-4" style={{ backgroundColor: "#15162A" }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-black uppercase tracking-widest text-white/30">
          Before you leave
        </span>
        {items.length > 0 && (
          <span className="text-[11px] text-white/30 font-medium">
            {doneCount}/{items.length} done
          </span>
        )}
      </div>

      {items.length > 0 && (
        <ul className="space-y-2 mb-4">
          {items.map((item) => (
            <li key={item.id} className="group flex items-center gap-3">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleToggle(item.id)}
                className="flex-shrink-0 w-4 h-4 rounded cursor-pointer accent-[#00E5FF]"
              />
              <span
                className={`flex-1 text-sm font-medium min-w-0 break-words transition-colors ${
                  item.checked ? "text-white/30 line-through" : "text-white"
                }`}
              >
                {item.text}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-white/30 hover:text-[#FF3DA7] flex-shrink-0"
                aria-label="Remove item"
              >
                <Trash size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {items.length === 0 && (
        <p className="text-xs text-white/30 mb-4 leading-relaxed">
          Things to sort before you leave — book parking, notify your bank, pack adapters, download offline maps.
        </p>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); handleAdd(); }
          }}
          maxLength={MAX_ITEM_TEXT}
          placeholder="Add a task…"
          disabled={items.length >= MAX_CHECKLIST_ITEMS}
          className={INPUT_CLASS}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim() || items.length >= MAX_CHECKLIST_ITEMS}
          className="flex-shrink-0 px-3 py-2 rounded-xl font-bold transition disabled:opacity-30 hover:brightness-110"
          style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
        >
          <Plus size={16} />
        </button>
      </div>

      {error && <p className="text-xs text-[#FF3DA7] mt-2 font-medium">{error}</p>}
      {isPending && <p className="text-xs text-white/30 mt-2">Saving…</p>}
    </div>
  );
}

// ── Prep section ──────────────────────────────────────────────────────────────

function PrepSection({
  id,
  initialChecklist,
  updateChecklistAction,
}: {
  id?: string;
  initialChecklist: ChecklistItem[];
  updateChecklistAction: (items: ChecklistItem[]) => Promise<ChecklistFormState>;
}) {
  return (
    <section id={id} aria-label="Prep" className="flex flex-col gap-3">
      <h2
        className="text-lg font-semibold text-white"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Prep
      </h2>
      <ChecklistCard
        initialItems={initialChecklist}
        updateAction={updateChecklistAction}
      />
    </section>
  );
}

// ── Top-level shell ──────────────────────────────────────────────────────────

export default function PreplanningShell({
  flights,
  transports,
  lodgings,
  tripNotes,
  notesMeta,
  initialChecklist,
  createFlightAction,
  updateFlightAction,
  deleteFlightAction,
  createTransportAction,
  updateTransportAction,
  deleteTransportAction,
  createStayAction,
  updateStayAction,
  deleteStayAction,
  updateNotesAction,
  updateChecklistAction,
}: PreplanningShellProps) {
  return (
    <div className="flex flex-col gap-8">
      <PreplanningNav />

      {/* Travel groups Flights + Transport under a single anchor for the future section rail. */}
      <section id="travel" aria-label="Travel" className="flex flex-col gap-3">
        <p className="text-[11px] font-black uppercase tracking-widest text-white/30">
          Travel
        </p>
        <div className="flex flex-col gap-8">
          <FlightsSection
            flights={flights}
            createAction={createFlightAction}
            updateAction={updateFlightAction}
            deleteAction={deleteFlightAction}
          />
          <TransportSection
            transports={transports}
            createAction={createTransportAction}
            updateAction={updateTransportAction}
            deleteAction={deleteTransportAction}
          />
        </div>
      </section>
      <StaysSection
        id="stays"
        lodgings={lodgings}
        createAction={createStayAction}
        updateAction={updateStayAction}
        deleteAction={deleteStayAction}
      />
      <PrepSection
        id="prep"
        initialChecklist={initialChecklist}
        updateChecklistAction={updateChecklistAction}
      />
      <TripNotesSection
        id="notes"
        initialText={tripNotes}
        notesMeta={notesMeta}
        updateNotesAction={updateNotesAction}
      />
    </div>
  );
}

// ── Formatters ───────────────────────────────────────────────────────────────

function formatDateRange(start: string | null, end: string | null): string {
  if (!start && !end) return "";
  const fmt = (d: string) => {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  };
  if (start && end) return `${fmt(start)} → ${fmt(end)}`;
  return fmt((start ?? end)!);
}

function computeNights(start: string | null, end: string | null): number | null {
  if (!start || !end) return null;
  const [ys, ms, ds] = start.split("-").map(Number);
  const [ye, me, de] = end.split("-").map(Number);
  const s = Date.UTC(ys, ms - 1, ds);
  const e = Date.UTC(ye, me - 1, de);
  const nights = Math.round((e - s) / 86_400_000);
  return nights > 0 ? nights : null;
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return "just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatFlightHeader(flight: TripFlight): string {
  const parts = [flight.airline, flight.flightNumber].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Flight";
}

function formatFlightMeta(flight: TripFlight): string | null {
  const routePart =
    flight.fromAirport || flight.toAirport
      ? `${flight.fromAirport ?? "??"} → ${flight.toAirport ?? "??"}`
      : null;
  const datePart = flight.departureDate ? formatShortDate(flight.departureDate) : null;
  const timePart = flight.departureTime ? formatTime(flight.departureTime) : null;
  const parts = [routePart, datePart, timePart].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

function formatShortDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function toTimeInputValue(t: string | null): string {
  if (!t) return "";
  return t.slice(0, 5); // "HH:MM:SS" → "HH:MM", "HH:MM" unchanged
}

function formatTransportHeader(t: TripTransport): string {
  const label = TRANSPORT_LABELS[t.type] ?? "Transport";
  return t.provider ? `${label} · ${t.provider}` : label;
}

function formatTransportMeta(t: TripTransport): string | null {
  const routePart =
    t.pickupLocation || t.dropoffLocation
      ? `${t.pickupLocation ?? "??"} → ${t.dropoffLocation ?? "??"}`
      : null;
  const datePart = t.pickupDate ? formatShortDate(t.pickupDate) : null;
  const timePart = t.pickupTime ? formatTime(t.pickupTime) : null;
  const parts = [routePart, datePart, timePart].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}
