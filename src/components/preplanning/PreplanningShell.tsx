"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import {
  Airplane,
  Checks,
  CurrencyDollar,
  House,
  MapPin,
  PencilSimple,
  Plus,
  Sparkle,
  Trash,
  Users,
  Link as LinkIcon,
  FileText,
} from "@phosphor-icons/react";

import type { ChecklistItem, Lodging, TripFlight, TripTransport } from "@/lib/preplanning/queries";
import type {
  ChecklistFormState,
  FlightFormState,
  LodgingFormState,
  TransportFormState,
  TripNotesFormState,
} from "@/app/app/trips/[tripId]/preplanning/actions";

type NotesMeta = {
  updatedAt: string | null;
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

const INPUT_CLASS =
  "w-full rounded-xl px-4 py-3 text-base bg-[#1D1E36] border border-[#2A2B45] text-white placeholder:text-white/40 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 transition-colors";
const LABEL_CLASS = "text-[13px] font-black uppercase tracking-wide text-white/60 mb-1.5";
const CARD_CLASS = "rounded-[26px] border border-white/[0.06] bg-[#2b2b2b]";

type SectionId =
  | "group"
  | "travel"
  | "lodging"
  | "budget"
  | "destinations"
  | "documents"
  | "vibe"
  | "departure";

type SectionMeta = {
  id: SectionId;
  label: string;
  subtitle: string;
  Icon: typeof Airplane;
  color: string;
};

function MetricBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-[#2d2d2d] px-6 py-4 text-center">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#6d6f75]">{label}</p>
      <p className="mt-1 text-[2.4rem] font-black leading-none" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function PreplanningRail({
  sections,
  active,
  onSelect,
}: {
  sections: SectionMeta[];
  active: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  return (
    <aside className="hidden w-[274px] shrink-0 border-r border-white/6 bg-[#242424] px-4 py-4 md:block">
      <div className="space-y-2.5">
        {sections.map(({ id, label, subtitle, Icon, color }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-current={isActive ? "page" : undefined}
              className="flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left transition-all"
              style={{
                backgroundColor: isActive ? `${color}14` : "transparent",
                border: isActive ? `1px solid ${color}66` : "1px solid transparent",
                boxShadow: isActive ? `inset 0 0 0 1px ${color}12` : "none",
              }}
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: color }}
              >
                <Icon size={18} weight="fill" color="#ffffff" />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[15px] font-black text-white">{label}</span>
                <span className="mt-1 block truncate text-[12px] font-black" style={{ color }}>
                  {subtitle}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function PreplanningTabs({
  sections,
  active,
  onSelect,
}: {
  sections: SectionMeta[];
  active: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 md:hidden" aria-label="Preplanning sections">
      {sections.map(({ id, label, Icon, color }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className="flex shrink-0 items-center gap-2 rounded-full px-3 py-2"
            style={{
              backgroundColor: isActive ? `${color}22` : "#2a2a2a",
              border: `1px solid ${isActive ? `${color}66` : "rgba(255,255,255,0.06)"}`,
            }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: color }}>
              <Icon size={14} weight="fill" color="#fff" />
            </span>
            <span className="text-sm font-black text-white">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function EmptyPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className={`${CARD_CLASS} px-6 py-10 text-center`}>
      <p className="text-base font-semibold text-white/80">{title}</p>
      <p className="mt-1.5 text-sm text-white/55">{body}</p>
    </div>
  );
}

type FlightFieldValues = Partial<Omit<TripFlight, "id" | "addedById">>;

function FlightFormFields({ initial }: { initial?: FlightFieldValues }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="flex flex-col"><span className={LABEL_CLASS}>Airline</span><input type="text" name="airline" maxLength={60} defaultValue={initial?.airline ?? ""} placeholder="Delta" className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Flight #</span><input type="text" name="flightNumber" maxLength={12} defaultValue={initial?.flightNumber ?? ""} placeholder="DL 447" className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>From</span><input type="text" name="fromAirport" maxLength={10} defaultValue={initial?.fromAirport ?? ""} placeholder="JFK" className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>To</span><input type="text" name="toAirport" maxLength={10} defaultValue={initial?.toAirport ?? ""} placeholder="CUN" className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Departure date</span><input type="date" name="departureDate" defaultValue={initial?.departureDate ?? ""} className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Departure time</span><input type="time" name="departureTime" defaultValue={toTimeInputValue(initial?.departureTime ?? null)} className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Confirmation #</span><input type="text" name="confirmationCode" maxLength={20} defaultValue={initial?.confirmationCode ?? ""} placeholder="XK8R2T" className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Booking URL</span><input type="url" name="bookingUrl" maxLength={500} defaultValue={initial?.bookingUrl ?? ""} placeholder="https://…" className={INPUT_CLASS} /></label>
      <label className="sm:col-span-2 flex flex-col"><span className={LABEL_CLASS}>Notes</span><textarea name="notes" rows={2} maxLength={500} defaultValue={initial?.notes ?? ""} placeholder="Arrival time, seat info, terminal, anything the group should know…" className={INPUT_CLASS} /></label>
    </div>
  );
}

function AddFlightForm({ createAction, onDone }: { createAction: PreplanningShellProps["createFlightAction"]; onDone: () => void; }) {
  const [state, formAction, pending] = useActionState(createAction, {} as FlightFormState);
  if (state.ok) queueMicrotask(onDone);
  return (
    <form action={formAction} className={`${CARD_CLASS} p-5`}>
      <FlightFormFields />
      {state.error && <p role="alert" className="mt-3 text-sm font-semibold text-[#FF3DA7]">{state.error}</p>}
      <div className="mt-4 flex items-center gap-2">
        <button type="submit" disabled={pending} className="rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-110 disabled:opacity-50" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}>{pending ? "Adding…" : "Add flight"}</button>
        <button type="button" onClick={onDone} className="px-3 py-2 text-sm font-semibold text-white/65 transition-colors hover:text-white/90">Cancel</button>
      </div>
    </form>
  );
}

function FlightCard({ flight, updateAction, deleteAction }: { flight: TripFlight; updateAction: PreplanningShellProps["updateFlightAction"]; deleteAction: PreplanningShellProps["deleteFlightAction"]; }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateAction, {} as FlightFormState);
  const [isDeleting, startDelete] = useTransition();
  if (state.ok && editing) queueMicrotask(() => setEditing(false));

  if (editing) {
    return (
      <form action={formAction} className={`${CARD_CLASS} p-5`}>
        <input type="hidden" name="id" value={flight.id} />
        <FlightFormFields initial={flight} />
        {state.error && <p role="alert" className="mt-3 text-sm font-semibold text-[#FF3DA7]">{state.error}</p>}
        <div className="mt-4 flex items-center gap-2">
          <button type="submit" disabled={pending} className="rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-110 disabled:opacity-50" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}>{pending ? "Saving…" : "Save"}</button>
          <button type="button" onClick={() => setEditing(false)} className="px-3 py-2 text-sm font-semibold text-white/65 transition-colors hover:text-white/90">Cancel</button>
        </div>
      </form>
    );
  }

  const header = formatFlightHeader(flight);
  const meta = formatFlightMeta(flight);

  return (
    <article className={`${CARD_CLASS} flex flex-col gap-2 p-5`}>
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0"><h3 className="truncate text-lg font-semibold text-white">{header}</h3>{meta && <p className="mt-0.5 text-sm text-white/70">{meta}</p>}</div>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" aria-label="Edit flight" onClick={() => setEditing(true)} className="rounded-md p-1.5 text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"><PencilSimple size={14} weight="bold" /></button>
          <form action={(fd) => startDelete(async () => await deleteAction(fd))} className="inline-flex"><input type="hidden" name="id" value={flight.id} /><button type="submit" aria-label="Delete flight" disabled={isDeleting} className="rounded-md p-1.5 text-white/60 transition-colors hover:bg-white/[0.08] hover:text-[#FF3DA7] disabled:opacity-40"><Trash size={14} weight="bold" /></button></form>
        </div>
      </header>
      {(flight.confirmationCode || flight.bookingUrl) && <div className="flex flex-wrap items-center gap-2 text-sm">{flight.confirmationCode && <span className="rounded-full bg-white/[0.08] px-3 py-1 font-semibold text-white">Conf: {flight.confirmationCode}</span>}{flight.bookingUrl && <a href={flight.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#00E5FF]/10 px-3 py-1 font-semibold text-[#00E5FF] hover:brightness-110"><LinkIcon size={10} weight="bold" />Booking</a>}</div>}
      {flight.notes && <p className="whitespace-pre-wrap text-sm text-white/80">{flight.notes}</p>}
    </article>
  );
}

function FlightsSection({ flights, createAction, updateAction, deleteAction }: { flights: TripFlight[]; createAction: PreplanningShellProps["createFlightAction"]; updateAction: PreplanningShellProps["updateFlightAction"]; deleteAction: PreplanningShellProps["deleteFlightAction"]; }) {
  const [adding, setAdding] = useState(false);
  return (
    <section className="flex flex-col gap-3" aria-label="Flights">
      <header className="flex items-center justify-between"><h2 className="text-xl font-semibold text-white" style={{ fontFamily: "var(--font-fredoka)" }}>Flights</h2>{!adding && <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-110" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}><Plus size={12} weight="bold" />Add a flight</button>}</header>
      {flights.length === 0 && !adding && <EmptyPanel title="No flights added yet." body="Drop in your flights and the whole group knows the drill." />}
      {flights.map((flight) => <FlightCard key={flight.id} flight={flight} updateAction={updateAction} deleteAction={deleteAction} />)}
      {adding && <AddFlightForm createAction={createAction} onDone={() => setAdding(false)} />}
    </section>
  );
}

const TRANSPORT_LABELS: Record<string, string> = { rental_car: "Rental car", train: "Train", bus: "Bus / Coach", shuttle: "Shuttle", ferry: "Ferry", other: "Transport" };
type TransportFieldValues = Partial<Omit<TripTransport, "id" | "addedById">>;

function TransportFormFields({ initial }: { initial?: TransportFieldValues }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="flex flex-col"><span className={LABEL_CLASS}>Type</span><select name="type" defaultValue={initial?.type ?? "rental_car"} className={INPUT_CLASS}><option value="rental_car">Rental car</option><option value="train">Train</option><option value="bus">Bus / Coach</option><option value="shuttle">Shuttle</option><option value="ferry">Ferry</option><option value="other">Other</option></select></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Provider</span><input type="text" name="provider" maxLength={80} defaultValue={initial?.provider ?? ""} placeholder="Budget, Amtrak, FlixBus…" className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Pickup</span><input type="text" name="pickupLocation" maxLength={100} defaultValue={initial?.pickupLocation ?? ""} placeholder="JFK Terminal 4" className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Drop-off</span><input type="text" name="dropoffLocation" maxLength={100} defaultValue={initial?.dropoffLocation ?? ""} placeholder="Hotel lobby" className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Pickup date</span><input type="date" name="pickupDate" defaultValue={initial?.pickupDate ?? ""} className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Pickup time</span><input type="time" name="pickupTime" defaultValue={toTimeInputValue(initial?.pickupTime ?? null)} className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Confirmation #</span><input type="text" name="confirmationCode" maxLength={20} defaultValue={initial?.confirmationCode ?? ""} placeholder="XK8R2T" className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Booking URL</span><input type="url" name="bookingUrl" maxLength={500} defaultValue={initial?.bookingUrl ?? ""} placeholder="https://…" className={INPUT_CLASS} /></label>
      <label className="sm:col-span-2 flex flex-col"><span className={LABEL_CLASS}>Notes</span><textarea name="notes" rows={2} maxLength={500} defaultValue={initial?.notes ?? ""} placeholder="Vehicle type, seats, driver info, anything the group should know…" className={INPUT_CLASS} /></label>
    </div>
  );
}

function AddTransportForm({ createAction, onDone }: { createAction: PreplanningShellProps["createTransportAction"]; onDone: () => void; }) {
  const [state, formAction, pending] = useActionState(createAction, {} as TransportFormState);
  if (state.ok) queueMicrotask(onDone);
  return (
    <form action={formAction} className={`${CARD_CLASS} p-5`}>
      <TransportFormFields />
      {state.error && <p role="alert" className="mt-3 text-sm font-semibold text-[#FF3DA7]">{state.error}</p>}
      <div className="mt-4 flex items-center gap-2"><button type="submit" disabled={pending} className="rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-110 disabled:opacity-50" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}>{pending ? "Adding…" : "Add transport"}</button><button type="button" onClick={onDone} className="px-3 py-2 text-sm font-semibold text-white/65 transition-colors hover:text-white/90">Cancel</button></div>
    </form>
  );
}

function TransportCard({ transport, updateAction, deleteAction }: { transport: TripTransport; updateAction: PreplanningShellProps["updateTransportAction"]; deleteAction: PreplanningShellProps["deleteTransportAction"]; }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateAction, {} as TransportFormState);
  const [isDeleting, startDelete] = useTransition();
  if (state.ok && editing) queueMicrotask(() => setEditing(false));

  if (editing) {
    return (
      <form action={formAction} className={`${CARD_CLASS} p-5`}>
        <input type="hidden" name="id" value={transport.id} />
        <TransportFormFields initial={transport} />
        {state.error && <p role="alert" className="mt-3 text-sm font-semibold text-[#FF3DA7]">{state.error}</p>}
        <div className="mt-4 flex items-center gap-2"><button type="submit" disabled={pending} className="rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-110 disabled:opacity-50" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}>{pending ? "Saving…" : "Save"}</button><button type="button" onClick={() => setEditing(false)} className="px-3 py-2 text-sm font-semibold text-white/65 transition-colors hover:text-white/90">Cancel</button></div>
      </form>
    );
  }

  const header = formatTransportHeader(transport);
  const meta = formatTransportMeta(transport);

  return (
    <article className={`${CARD_CLASS} flex flex-col gap-2 p-5`}>
      <header className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-lg font-semibold text-white">{header}</h3>{meta && <p className="mt-0.5 text-sm text-white/70">{meta}</p>}</div><div className="flex shrink-0 items-center gap-1"><button type="button" aria-label="Edit transport" onClick={() => setEditing(true)} className="rounded-md p-1.5 text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"><PencilSimple size={14} weight="bold" /></button><form action={(fd) => startDelete(async () => await deleteAction(fd))} className="inline-flex"><input type="hidden" name="id" value={transport.id} /><button type="submit" aria-label="Delete transport" disabled={isDeleting} className="rounded-md p-1.5 text-white/60 transition-colors hover:bg-white/[0.08] hover:text-[#FF3DA7] disabled:opacity-40"><Trash size={14} weight="bold" /></button></form></div></header>
      {(transport.confirmationCode || transport.bookingUrl) && <div className="flex flex-wrap items-center gap-2 text-sm">{transport.confirmationCode && <span className="rounded-full bg-white/[0.08] px-3 py-1 font-semibold text-white">Conf: {transport.confirmationCode}</span>}{transport.bookingUrl && <a href={transport.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#00E5FF]/10 px-3 py-1 font-semibold text-[#00E5FF] hover:brightness-110"><LinkIcon size={10} weight="bold" />Booking</a>}</div>}
      {transport.notes && <p className="whitespace-pre-wrap text-sm text-white/80">{transport.notes}</p>}
    </article>
  );
}

function TransportSection({ transports, createAction, updateAction, deleteAction }: { transports: TripTransport[]; createAction: PreplanningShellProps["createTransportAction"]; updateAction: PreplanningShellProps["updateTransportAction"]; deleteAction: PreplanningShellProps["deleteTransportAction"]; }) {
  const [adding, setAdding] = useState(false);
  return (
    <section className="flex flex-col gap-3" aria-label="Transport">
      <header className="flex items-center justify-between"><h2 className="text-xl font-semibold text-white" style={{ fontFamily: "var(--font-fredoka)" }}>Transport</h2>{!adding && <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-110" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}><Plus size={12} weight="bold" />Add transport</button>}</header>
      {transports.length === 0 && !adding && <EmptyPanel title="No transport booked yet." body="Rental cars, trains, shuttles, if it needs a confirmation number, it belongs here." />}
      {transports.map((transport) => <TransportCard key={transport.id} transport={transport} updateAction={updateAction} deleteAction={deleteAction} />)}
      {adding && <AddTransportForm createAction={createAction} onDone={() => setAdding(false)} />}
    </section>
  );
}

type LodgingFieldValues = Partial<Omit<Lodging, "id" | "addedById">>;

function LodgingFormFields({ initial }: { initial?: LodgingFieldValues }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="sm:col-span-2 flex flex-col"><span className={LABEL_CLASS}>Name *</span><input type="text" name="name" required maxLength={200} defaultValue={initial?.name ?? ""} placeholder="The Airbnb in Pearl District" className={INPUT_CLASS} /></label>
      <label className="sm:col-span-2 flex flex-col"><span className={LABEL_CLASS}>Address</span><input type="text" name="address" maxLength={300} defaultValue={initial?.address ?? ""} placeholder="123 NW Everett St, Portland, OR" className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Check-in</span><input type="date" name="checkInDate" defaultValue={initial?.checkInDate ?? ""} className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Check-out</span><input type="date" name="checkOutDate" defaultValue={initial?.checkOutDate ?? ""} className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Confirmation #</span><input type="text" name="confirmationNumber" maxLength={80} defaultValue={initial?.confirmationNumber ?? ""} placeholder="ABC-12345" className={INPUT_CLASS} /></label>
      <label className="flex flex-col"><span className={LABEL_CLASS}>Booking URL</span><input type="url" name="bookingUrl" maxLength={500} defaultValue={initial?.bookingUrl ?? ""} placeholder="https://…" className={INPUT_CLASS} /></label>
      <label className="sm:col-span-2 flex flex-col"><span className={LABEL_CLASS}>Notes</span><textarea name="notes" rows={2} maxLength={1000} defaultValue={initial?.notes ?? ""} placeholder="Parking info, door code, anything the group should know…" className={INPUT_CLASS} /></label>
    </div>
  );
}

function AddStayForm({ createAction, onDone }: { createAction: PreplanningShellProps["createStayAction"]; onDone: () => void; }) {
  const [state, formAction, pending] = useActionState(createAction, {} as LodgingFormState);
  if (state.ok) queueMicrotask(onDone);
  return (
    <form action={formAction} className={`${CARD_CLASS} p-5`}>
      <LodgingFormFields />
      {state.error && <p role="alert" className="mt-3 text-sm font-semibold text-[#FF3DA7]">{state.error}</p>}
      <div className="mt-4 flex items-center gap-2"><button type="submit" disabled={pending} className="rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-110 disabled:opacity-50" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}>{pending ? "Adding…" : "Add stay"}</button><button type="button" onClick={onDone} className="px-3 py-2 text-sm font-semibold text-white/65 transition-colors hover:text-white/90">Cancel</button></div>
    </form>
  );
}

function StayCard({ stay, updateAction, deleteAction }: { stay: Lodging; updateAction: PreplanningShellProps["updateStayAction"]; deleteAction: PreplanningShellProps["deleteStayAction"]; }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateAction, {} as LodgingFormState);
  const [isDeleting, startDelete] = useTransition();
  if (state.ok && editing) queueMicrotask(() => setEditing(false));

  if (editing) {
    return (
      <form action={formAction} className={`${CARD_CLASS} p-5`}>
        <input type="hidden" name="id" value={stay.id} />
        <LodgingFormFields initial={stay} />
        {state.error && <p role="alert" className="mt-3 text-sm font-semibold text-[#FF3DA7]">{state.error}</p>}
        <div className="mt-4 flex items-center gap-2"><button type="submit" disabled={pending} className="rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-110 disabled:opacity-50" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}>{pending ? "Saving…" : "Save"}</button><button type="button" onClick={() => setEditing(false)} className="px-3 py-2 text-sm font-semibold text-white/65 transition-colors hover:text-white/90">Cancel</button></div>
      </form>
    );
  }

  const nights = computeNights(stay.checkInDate, stay.checkOutDate);

  return (
    <article className={`${CARD_CLASS} flex flex-col gap-2 p-5`}>
      <header className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-lg font-semibold text-white">{stay.name}</h3>{(stay.checkInDate || stay.checkOutDate) && <p className="mt-0.5 text-sm text-white/70">{formatDateRange(stay.checkInDate, stay.checkOutDate)}{nights !== null && <span className="text-white/55">{" · "}{nights} {nights === 1 ? "night" : "nights"}</span>}</p>}</div><div className="flex shrink-0 items-center gap-1"><button type="button" aria-label="Edit stay" onClick={() => setEditing(true)} className="rounded-md p-1.5 text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"><PencilSimple size={14} weight="bold" /></button><form action={(fd) => startDelete(async () => await deleteAction(fd))} className="inline-flex"><input type="hidden" name="id" value={stay.id} /><button type="submit" aria-label="Delete stay" disabled={isDeleting} className="rounded-md p-1.5 text-white/60 transition-colors hover:bg-white/[0.08] hover:text-[#FF3DA7] disabled:opacity-40"><Trash size={14} weight="bold" /></button></form></div></header>
      {stay.address && <p className="text-sm text-white/80">{stay.address}</p>}
      {(stay.confirmationNumber || stay.bookingUrl) && <div className="flex flex-wrap items-center gap-2 text-sm">{stay.confirmationNumber && <span className="rounded-full bg-white/[0.08] px-3 py-1 font-semibold text-white">Conf: {stay.confirmationNumber}</span>}{stay.bookingUrl && <a href={stay.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#00E5FF]/10 px-3 py-1 font-semibold text-[#00E5FF] hover:brightness-110"><LinkIcon size={10} weight="bold" />Booking</a>}</div>}
      {stay.notes && <p className="whitespace-pre-wrap text-sm text-white/80">{stay.notes}</p>}
    </article>
  );
}

function StaysSection({ lodgings, createAction, updateAction, deleteAction }: { lodgings: Lodging[]; createAction: PreplanningShellProps["createStayAction"]; updateAction: PreplanningShellProps["updateStayAction"]; deleteAction: PreplanningShellProps["deleteStayAction"]; }) {
  const [adding, setAdding] = useState(false);
  return (
    <section className="flex flex-col gap-3" aria-label="Stays">
      <header className="flex items-center justify-between"><h2 className="text-xl font-semibold text-white" style={{ fontFamily: "var(--font-fredoka)" }}>Lodging</h2>{!adding && <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-110" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}><Plus size={12} weight="bold" />Add a stay</button>}</header>
      {lodgings.length === 0 && !adding && <EmptyPanel title="No stays yet." body="Airbnb, hotel, or whoever's couch the group is crashing on, it all lives here." />}
      {lodgings.map((stay) => <StayCard key={stay.id} stay={stay} updateAction={updateAction} deleteAction={deleteAction} />)}
      {adding && <AddStayForm createAction={createAction} onDone={() => setAdding(false)} />}
    </section>
  );
}

function TripNotesSection({ initialText, notesMeta, updateNotesAction }: { initialText: string; notesMeta: NotesMeta; updateNotesAction: PreplanningShellProps["updateNotesAction"]; }) {
  const [state, formAction, pending] = useActionState(updateNotesAction, {} as TripNotesFormState);
  const [value, setValue] = useState(initialText);
  const dirty = value !== initialText;

  return (
    <section className="flex flex-col gap-2" aria-label="Trip notes">
      <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-fredoka)" }}>Trip notes</h2>
      <form action={formAction} className={`${CARD_CLASS} flex flex-col gap-3 p-5`}>
        <textarea name="notes" value={value} onChange={(e) => setValue(e.target.value)} maxLength={5000} rows={7} placeholder="Parking codes, Wi-Fi passwords, anything the group should know." className="min-h-[160px] resize-y rounded-2xl border border-[#2A2B45] bg-[#1D1E36] px-4 py-3 text-base text-white placeholder:text-white/40 transition-colors focus:border-[#00E5FF] focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/20" />
        {state.error && <p role="alert" className="text-sm font-semibold text-[#FF3DA7]">{state.error}</p>}
        <div className="flex items-center justify-between gap-3"><p className="text-sm text-white/55">{notesMeta.updatedAt ? `Last edited${notesMeta.updatedByName ? ` by ${notesMeta.updatedByName}` : ""} · ${formatRelative(notesMeta.updatedAt)}` : "Not edited yet"}</p><button type="submit" disabled={pending || !dirty} className="rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-110 disabled:opacity-40" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}>{pending ? "Saving…" : "Save"}</button></div>
      </form>
    </section>
  );
}

const MAX_CHECKLIST_ITEMS = 30;
const MAX_ITEM_TEXT = 200;

function ChecklistCard({ initialItems, updateAction }: { initialItems: ChecklistItem[]; updateAction: (items: ChecklistItem[]) => Promise<ChecklistFormState>; }) {
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
    const newItems = items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item));
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
    <div className={`${CARD_CLASS} p-5`}>
      <div className="mb-4 flex items-center justify-between"><span className="text-[13px] font-black uppercase tracking-widest text-white/55">Before you leave</span>{items.length > 0 && <span className="text-sm font-medium text-white/55">{doneCount}/{items.length} done</span>}</div>
      {items.length > 0 && <ul className="mb-4 space-y-2">{items.map((item) => <li key={item.id} className="group flex items-center gap-3"><input type="checkbox" checked={item.checked} onChange={() => handleToggle(item.id)} className="h-4 w-4 flex-shrink-0 cursor-pointer rounded accent-[#00E5FF]" /><span className={`min-w-0 flex-1 break-words text-sm font-medium transition-colors ${item.checked ? "text-white/40 line-through" : "text-white"}`}>{item.text}</span><button type="button" onClick={() => handleDelete(item.id)} className="flex-shrink-0 text-white/30 opacity-0 transition-opacity hover:text-[#FF3DA7] group-hover:opacity-100 focus:opacity-100" aria-label="Remove item"><Trash size={14} /></button></li>)}</ul>}
      {items.length === 0 && <p className="mb-4 text-sm leading-relaxed text-white/55">Nothing pre-planned yet. Add the stuff that will absolutely bite you if you forget it.</p>}
      <div className="flex gap-2"><input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }} maxLength={MAX_ITEM_TEXT} placeholder="Add a task…" disabled={items.length >= MAX_CHECKLIST_ITEMS} className={INPUT_CLASS + " flex-1"} /><button type="button" onClick={handleAdd} disabled={!inputValue.trim() || items.length >= MAX_CHECKLIST_ITEMS} className="flex-shrink-0 rounded-xl px-3 py-2 font-bold transition hover:brightness-110 disabled:opacity-30" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}><Plus size={16} /></button></div>
      {error && <p className="mt-2 text-xs font-medium text-[#FF3DA7]">{error}</p>}
      {isPending && <p className="mt-2 text-sm text-white/50">Saving…</p>}
    </div>
  );
}

function DepartureSection({ initialChecklist, updateChecklistAction }: { initialChecklist: ChecklistItem[]; updateChecklistAction: (items: ChecklistItem[]) => Promise<ChecklistFormState>; }) {
  return (
    <section className="flex flex-col gap-3" aria-label="Pre-departure">
      <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-fredoka)" }}>Pre-Departure</h2>
      <ChecklistCard initialItems={initialChecklist} updateAction={updateChecklistAction} />
    </section>
  );
}

function TravelSection(props: Pick<PreplanningShellProps, "flights" | "transports" | "createFlightAction" | "updateFlightAction" | "deleteFlightAction" | "createTransportAction" | "updateTransportAction" | "deleteTransportAction">) {
  return (
    <div className="flex flex-col gap-8">
      <FlightsSection flights={props.flights} createAction={props.createFlightAction} updateAction={props.updateFlightAction} deleteAction={props.deleteFlightAction} />
      <TransportSection transports={props.transports} createAction={props.createTransportAction} updateAction={props.updateTransportAction} deleteAction={props.deleteTransportAction} />
    </div>
  );
}

function ComingSoonPanel({ title, accent, body }: { title: string; accent: string; body: string }) {
  return (
    <section className="flex flex-col gap-3" aria-label={title}>
      <div className={`${CARD_CLASS} p-6`}>
        <div className="mb-3 flex items-center gap-3"><div className="h-11 w-11 rounded-full" style={{ backgroundColor: accent }} /><div><h2 className="text-2xl font-semibold text-white" style={{ fontFamily: "var(--font-fredoka)" }}>{title}</h2><p className="text-sm font-black" style={{ color: accent }}>{body}</p></div></div>
        <p className="text-sm text-white/60">This section is being restored to the original preplanning layout next. For now, the shell matches the old structure and this panel holds the place correctly.</p>
      </div>
    </section>
  );
}

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
  const [active, setActive] = useState<SectionId>("travel");

  const travelCount = flights.length + transports.length;
  const staysCount = lodgings.length;
  const prepDone = initialChecklist.filter((i) => i.checked).length;
  const prepTotal = initialChecklist.length;

  const sections = useMemo<SectionMeta[]>(() => [
    { id: "group", label: "Group", subtitle: "4 travelers added", Icon: Users, color: "#14bfe8" },
    { id: "travel", label: "Travel", subtitle: travelCount === 0 ? "0 flights entered" : `${travelCount} flights entered`, Icon: Airplane, color: "#ff980f" },
    { id: "lodging", label: "Lodging", subtitle: staysCount === 0 ? "0 stays added" : `1 of ${Math.max(staysCount, 2)} stays confirmed`, Icon: House, color: "#ff980f" },
    { id: "budget", label: "Budget", subtitle: "Budget set · 8 categories", Icon: CurrencyDollar, color: "#ff980f" },
    { id: "destinations", label: "Destinations", subtitle: "3 stops · 12 days planned", Icon: MapPin, color: "#ff980f" },
    { id: "documents", label: "Documents", subtitle: "6 of 8 confirmed", Icon: FileText, color: "#ff980f" },
    { id: "vibe", label: "Trip Vibe", subtitle: "2 vibes · Balanced pace", Icon: Sparkle, color: "#ff980f" },
    { id: "departure", label: "Pre-Departure", subtitle: prepTotal === 0 ? "0 of 18 tasks done" : `${prepDone} of ${prepTotal} tasks done`, Icon: Checks, color: "#ff980f" },
  ], [prepDone, prepTotal, staysCount, travelCount]);

  const sectionsDone = Number(staysCount > 0) + Number(travelCount > 0);
  const inProgress = Math.max(0, sections.length - sectionsDone);
  const overall = Math.round(((travelCount > 0 ? 1 : 0) + (staysCount > 0 ? 1 : 0) + (prepTotal > 0 ? prepDone / Math.max(prepTotal, 1) : 0)) / 3 * 100);

  return (
    <div className="overflow-hidden rounded-[0px] border border-white/6 bg-[#4b4b4b] md:rounded-[24px]">
      <PreplanningTabs sections={sections} active={active} onSelect={setActive} />
      <div className="grid grid-cols-1 md:grid-cols-[274px_minmax(0,1fr)]">
        <PreplanningRail sections={sections} active={active} onSelect={setActive} />

        <div className="min-w-0 bg-[#4b4b4b]">
          <div className="border-b border-white/6 bg-[#1f1f1f] px-5 py-5 md:px-8">
            <h2 className="text-[2rem] font-semibold leading-none text-white" style={{ fontFamily: "var(--font-fredoka)" }}>Preplanning</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/72">How you&apos;re getting there, where you&apos;re staying, plus anything the group should know before you leave.</p>
          </div>

          <div className="space-y-5 px-5 py-5 md:px-8 md:py-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <MetricBox label="Sections Done" value={String(sectionsDone)} color="#00d26a" />
              <MetricBox label="In Progress" value={String(inProgress)} color="#ff980f" />
              <MetricBox label="Overall" value={`${overall}%`} color="#14bfe8" />
            </div>

            <div className="min-h-[520px] rounded-[0px] bg-transparent md:rounded-[20px]">
              {active === "group" && <ComingSoonPanel title="Group" accent="#14bfe8" body="4 travelers added" />}
              {active === "travel" && <TravelSection flights={flights} transports={transports} createFlightAction={createFlightAction} updateFlightAction={updateFlightAction} deleteFlightAction={deleteFlightAction} createTransportAction={createTransportAction} updateTransportAction={updateTransportAction} deleteTransportAction={deleteTransportAction} />}
              {active === "lodging" && <StaysSection lodgings={lodgings} createAction={createStayAction} updateAction={updateStayAction} deleteAction={deleteStayAction} />}
              {active === "budget" && <ComingSoonPanel title="Budget" accent="#ff980f" body="Budget set · 8 categories" />}
              {active === "destinations" && <ComingSoonPanel title="Destinations" accent="#ff980f" body="3 stops · 12 days planned" />}
              {active === "documents" && <TripNotesSection initialText={tripNotes} notesMeta={notesMeta} updateNotesAction={updateNotesAction} />}
              {active === "vibe" && <ComingSoonPanel title="Trip Vibe" accent="#ff980f" body="2 vibes · Balanced pace" />}
              {active === "departure" && <DepartureSection initialChecklist={initialChecklist} updateChecklistAction={updateChecklistAction} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDateRange(start: string | null, end: string | null): string {
  if (!start && !end) return "";
  const fmt = (d: string) => {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
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
  const routePart = flight.fromAirport || flight.toAirport ? `${flight.fromAirport ?? "??"} → ${flight.toAirport ?? "??"}` : null;
  const datePart = flight.departureDate ? formatShortDate(flight.departureDate) : null;
  const timePart = flight.departureTime ? formatTime(flight.departureTime) : null;
  const parts = [routePart, datePart, timePart].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

function formatShortDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function toTimeInputValue(t: string | null): string {
  if (!t) return "";
  return t.slice(0, 5);
}

function formatTransportHeader(t: TripTransport): string {
  const label = TRANSPORT_LABELS[t.type] ?? "Transport";
  return t.provider ? `${label} · ${t.provider}` : label;
}

function formatTransportMeta(t: TripTransport): string | null {
  const routePart = t.pickupLocation || t.dropoffLocation ? `${t.pickupLocation ?? "??"} → ${t.dropoffLocation ?? "??"}` : null;
  const datePart = t.pickupDate ? formatShortDate(t.pickupDate) : null;
  const timePart = t.pickupTime ? formatTime(t.pickupTime) : null;
  const parts = [routePart, datePart, timePart].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}
