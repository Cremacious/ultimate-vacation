"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import {
  Airplane,
  Camera,
  Checks,
  CurrencyDollar,
  FileText,
  ForkKnife,
  Heart,
  House,
  Leaf,
  Link as LinkIcon,
  MapPin,
  Moon,
  Mountains,
  PencilSimple,
  Plus,
  Sparkle,
  Sun,
  Trash,
  Users,
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
  "w-full rounded-xl px-4 py-3 text-base bg-[#1D1E36] border border-[#2A2B45] text-white placeholder:text-white/80 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 transition-colors";
const LABEL_CLASS = "text-[13px] font-black uppercase tracking-wide text-white/80 mb-1.5";
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
  description: string;
  Icon: typeof Airplane;
  color: string;
};

type BudgetItem = {
  key: string;
  label: string;
  color: string;
  amount: string;
  autoLabel?: string;
  isAuto?: boolean;
};

type DestinationType = "city" | "beach" | "mountain" | "island" | "other";
type DestinationDraft = {
  id: string;
  name: string;
  country: string;
  type: DestinationType;
  color: string;
  arrivalDate: string;
  departureDate: string;
  mustDo: { id: string; text: string; done: boolean }[];
  notes: string;
};

type DocStatus = "confirmed" | "warning" | "missing";
type DocumentDraft = {
  id: string;
  title: string;
  holder: string;
  number: string;
  status: DocStatus;
  notes: string;
  accent: string;
};

type VibeOption = { key: string; label: string; color: string; Icon: typeof Sun };

const VIBE_TAGS: VibeOption[] = [
  { key: "adventure", label: "Adventure", color: "#FF2D8B", Icon: Mountains },
  { key: "foodie", label: "Foodie", color: "#FFD600", Icon: ForkKnife },
  { key: "romantic", label: "Romantic", color: "#FF5BA6", Icon: Heart },
  { key: "nature", label: "Nature", color: "#00C96B", Icon: Leaf },
  { key: "sightseeing", label: "Sightseeing", color: "#00A8CC", Icon: Camera },
  { key: "slow", label: "Slow Days", color: "#A855F7", Icon: Moon },
];

function MetricBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-[#2d2d2d] px-6 py-4 text-center">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-white/80">{label}</p>
      <p className="mt-1 text-[2.4rem] font-black leading-none" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] text-white/80">{children}</div>;
}

function DarkCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`${CARD_CLASS} ${className}`}>{children}</div>;
}

function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${INPUT_CLASS} ${props.className ?? ""}`} />;
}

function FieldTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${INPUT_CLASS} resize-none ${props.className ?? ""}`} />;
}

function PreplanningRail({ sections, active, onSelect }: { sections: SectionMeta[]; active: SectionId; onSelect: (id: SectionId) => void; }) {
  return (
    <aside className="hidden min-h-[calc(100vh-68px-92px)] w-[274px] shrink-0 border-r border-white/6 bg-[#242424] px-4 py-4 md:block">
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
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: color }}>
                <Icon size={18} weight="fill" color="#ffffff" />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[15px] font-black text-white">{label}</span>
                <span className="mt-1 block truncate text-[12px] font-black text-white/80">{subtitle}</span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function PreplanningTabs({ sections, active, onSelect }: { sections: SectionMeta[]; active: SectionId; onSelect: (id: SectionId) => void; }) {
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
              border: `1px solid ${isActive ? `${color}66` : "rgba(255,255,255,0.08)"}`,
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
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="mt-1.5 text-sm text-white/80">{body}</p>
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
        <button type="button" onClick={onDone} className="px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:text-white">Cancel</button>
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
          <button type="button" onClick={() => setEditing(false)} className="px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:text-white">Cancel</button>
        </div>
      </form>
    );
  }

  const header = formatFlightHeader(flight);
  const meta = formatFlightMeta(flight);

  return (
    <article className={`${CARD_CLASS} flex flex-col gap-2 p-5`}>
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0"><h3 className="truncate text-lg font-semibold text-white">{header}</h3>{meta && <p className="mt-0.5 text-sm text-white/80">{meta}</p>}</div>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" aria-label="Edit flight" onClick={() => setEditing(true)} className="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"><PencilSimple size={14} weight="bold" /></button>
          <form action={(fd) => startDelete(async () => await deleteAction(fd))} className="inline-flex"><input type="hidden" name="id" value={flight.id} /><button type="submit" aria-label="Delete flight" disabled={isDeleting} className="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/[0.08] hover:text-[#FF3DA7] disabled:opacity-40"><Trash size={14} weight="bold" /></button></form>
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
      <div className="mt-4 flex items-center gap-2"><button type="submit" disabled={pending} className="rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-110 disabled:opacity-50" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}>{pending ? "Adding…" : "Add transport"}</button><button type="button" onClick={onDone} className="px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:text-white">Cancel</button></div>
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
        <div className="mt-4 flex items-center gap-2"><button type="submit" disabled={pending} className="rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-110 disabled:opacity-50" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}>{pending ? "Saving…" : "Save"}</button><button type="button" onClick={() => setEditing(false)} className="px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:text-white">Cancel</button></div>
      </form>
    );
  }

  const header = formatTransportHeader(transport);
  const meta = formatTransportMeta(transport);

  return (
    <article className={`${CARD_CLASS} flex flex-col gap-2 p-5`}>
      <header className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-lg font-semibold text-white">{header}</h3>{meta && <p className="mt-0.5 text-sm text-white/80">{meta}</p>}</div><div className="flex shrink-0 items-center gap-1"><button type="button" aria-label="Edit transport" onClick={() => setEditing(true)} className="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"><PencilSimple size={14} weight="bold" /></button><form action={(fd) => startDelete(async () => await deleteAction(fd))} className="inline-flex"><input type="hidden" name="id" value={transport.id} /><button type="submit" aria-label="Delete transport" disabled={isDeleting} className="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/[0.08] hover:text-[#FF3DA7] disabled:opacity-40"><Trash size={14} weight="bold" /></button></form></div></header>
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
      <div className="mt-4 flex items-center gap-2"><button type="submit" disabled={pending} className="rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-110 disabled:opacity-50" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}>{pending ? "Adding…" : "Add stay"}</button><button type="button" onClick={onDone} className="px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:text-white">Cancel</button></div>
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
        <div className="mt-4 flex items-center gap-2"><button type="submit" disabled={pending} className="rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-110 disabled:opacity-50" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}>{pending ? "Saving…" : "Save"}</button><button type="button" onClick={() => setEditing(false)} className="px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:text-white">Cancel</button></div>
      </form>
    );
  }

  const nights = computeNights(stay.checkInDate, stay.checkOutDate);

  return (
    <article className={`${CARD_CLASS} flex flex-col gap-2 p-5`}>
      <header className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-lg font-semibold text-white">{stay.name}</h3>{(stay.checkInDate || stay.checkOutDate) && <p className="mt-0.5 text-sm text-white/80">{formatDateRange(stay.checkInDate, stay.checkOutDate)}{nights !== null && <span className="text-white/80">{" · "}{nights} {nights === 1 ? "night" : "nights"}</span>}</p>}</div><div className="flex shrink-0 items-center gap-1"><button type="button" aria-label="Edit stay" onClick={() => setEditing(true)} className="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"><PencilSimple size={14} weight="bold" /></button><form action={(fd) => startDelete(async () => await deleteAction(fd))} className="inline-flex"><input type="hidden" name="id" value={stay.id} /><button type="submit" aria-label="Delete stay" disabled={isDeleting} className="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/[0.08] hover:text-[#FF3DA7] disabled:opacity-40"><Trash size={14} weight="bold" /></button></form></div></header>
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

function GroupSection() {
  const travelers = [
    { name: "Chris M.", role: "Organizer", color: "#FF2D8B" },
    { name: "Sarah M.", role: "Traveler", color: "#FFD600" },
    { name: "Tom K.", role: "Traveler", color: "#00A8CC" },
    { name: "Lisa R.", role: "Traveler", color: "#00C96B" },
  ];

  return (
    <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
      {travelers.map((t, i) => (
        <DarkCard key={i} className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 text-white" style={{ backgroundColor: t.color }}>
            {t.name[0]}
          </div>
          <div>
            <div className="text-sm font-bold text-white">{t.name}</div>
            <div className="text-[11px] font-semibold text-white/80">{t.role}</div>
          </div>
        </DarkCard>
      ))}
      <DarkCard className="p-4 sm:col-span-2">
        <button type="button" className="flex items-center gap-2 font-black text-sm transition-opacity hover:opacity-80 mx-auto text-[#00A8CC]">
          <Plus size={18} weight="fill" />
          Invite a traveler
        </button>
      </DarkCard>
    </div>
  );
}

function BudgetSection({ flights, transports, lodgings }: { flights: TripFlight[]; transports: TripTransport[]; lodgings: Lodging[]; }) {
  const linkedLodging = lodgings.length * 450;
  const linkedTransport = transports.length * 180;
  const linkedFlights = flights.length * 320;
  const [targetBudget, setTargetBudget] = useState("5000");
  const [items, setItems] = useState<BudgetItem[]>([
    { key: "flights", label: "Flights", color: "#FF2D8B", amount: String(linkedFlights || 1200), isAuto: linkedFlights > 0, autoLabel: "from flights" },
    { key: "lodging", label: "Lodging", color: "#A855F7", amount: String(linkedLodging || 2000), isAuto: linkedLodging > 0, autoLabel: "from lodging" },
    { key: "car", label: "Car Rental", color: "#FF8C00", amount: String(linkedTransport || 180), isAuto: linkedTransport > 0, autoLabel: "from transport" },
    { key: "food", label: "Food & Dining", color: "#FFD600", amount: "600" },
    { key: "activities", label: "Activities", color: "#00A8CC", amount: "400" },
    { key: "shopping", label: "Shopping", color: "#FF2D8B", amount: "300" },
    { key: "misc", label: "Misc / Other", color: "#9CA3AF", amount: "200" },
  ]);

  function updateAmount(key: string, value: string) {
    setItems((prev) => prev.map((it) => it.key === key ? { ...it, amount: value } : it));
  }

  const target = Number(targetBudget) || 0;
  const autoTotal = items.filter((it) => it.isAuto).reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
  const manualTotal = items.filter((it) => !it.isAuto).reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
  const grandTotal = autoTotal + manualTotal;
  const remaining = target - grandTotal;

  return (
    <>
      <style>{`.bb{display:grid;grid-template-columns:1fr;gap:10px}.bc{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(min-width:768px){.bb{grid-template-columns:1fr 1fr 1fr}.bb-hero{grid-column:1 / 3}.bb-stats{grid-column:3;grid-row:1}.bb-cats{grid-column:1 / 4}.bc{grid-template-columns:repeat(4,1fr)}}`}</style>
      <div className="bb">
        <DarkCard className="bb-hero p-4 md:p-5">
          <CardLabel>Total Trip Budget</CardLabel>
          <div className="flex items-end gap-3 mb-4">
            <div className="font-semibold leading-none" style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(38px, 5vw, 54px)", color: "#00C96B" }}>
              {target > 0 ? `$${target.toLocaleString()}` : "—"}
            </div>
            {target > 0 && grandTotal > 0 && <div className="text-[13px] font-black mb-1.5 text-white/80">{remaining < 0 ? `$${Math.abs(remaining).toLocaleString()} over budget` : `$${remaining.toLocaleString()} remaining`}</div>}
          </div>
          <div className="relative mb-5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-white/80 pointer-events-none">$</span>
            <FieldInput type="number" min="0" placeholder="Set your total budget" value={targetBudget} onChange={(e) => setTargetBudget(e.target.value)} className="pl-6" />
          </div>
          {target > 0 && (
            <div className="h-3 rounded-full overflow-hidden flex" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="h-full rounded-l-full" style={{ width: `${Math.min((autoTotal / target) * 100, 100)}%`, backgroundColor: "#00C96B" }} />
              <div className="h-full" style={{ width: `${Math.min((manualTotal / target) * 100, 100)}%`, backgroundColor: "#00A8CC" }} />
            </div>
          )}
        </DarkCard>
        <DarkCard className="bb-stats p-4 md:p-5 flex flex-col justify-center gap-0">
          <CardLabel>Summary</CardLabel>
          {[
            { label: "Auto-linked", value: autoTotal, color: "#00C96B" },
            { label: "Manual est.", value: manualTotal, color: "#00A8CC" },
            { label: "Grand total", value: grandTotal, color: "#fff" },
            { label: remaining < 0 ? "Over budget" : "Remaining", value: Math.abs(remaining), color: remaining < 0 ? "#FF2D8B" : "#fff" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-b-0"><span className="text-[11px] font-black uppercase tracking-widest text-white/80">{item.label}</span><span className="font-semibold" style={{ fontFamily: "var(--font-fredoka)", fontSize: "22px", color: item.color }}>${item.value.toLocaleString()}</span></div>
          ))}
        </DarkCard>
        <DarkCard className="bb-cats p-4 md:p-5">
          <CardLabel>Categories</CardLabel>
          <div className="bc">
            {items.map((item) => (
              <div key={item.key} className="rounded-[18px] bg-[#1e1e1e] p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-black text-white">{item.label}</span>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                </div>
                <FieldInput type="number" value={item.amount} onChange={(e) => updateAmount(item.key, e.target.value)} className="mt-3" />
                <p className="mt-2 text-xs font-semibold text-white/80">{item.isAuto ? item.autoLabel : "manual estimate"}</p>
              </div>
            ))}
          </div>
        </DarkCard>
      </div>
    </>
  );
}

function DocumentsSection({ initialText, notesMeta, updateNotesAction }: { initialText: string; notesMeta: NotesMeta; updateNotesAction: PreplanningShellProps["updateNotesAction"]; }) {
  const [docs] = useState<DocumentDraft[]>([
    { id: "1", title: "US Passport", holder: "Chris M.", number: "B12345678", status: "confirmed", notes: "Valid and ready.", accent: "#00A8CC" },
    { id: "2", title: "Travel Insurance", holder: "All travelers", number: "TI-2025-JP", status: "confirmed", notes: "Medical and cancellation covered.", accent: "#00C96B" },
    { id: "3", title: "Flight Confirmation", holder: "All travelers", number: "XK92MN", status: "warning", notes: "Check in 24h before departure.", accent: "#FF8C00" },
    { id: "4", title: "Visa / Entry", holder: "All travelers", number: "", status: "missing", notes: "Confirm entry requirements before locking plans.", accent: "#FF2D8B" },
  ]);
  const confirmedCount = docs.filter((d) => d.status === "confirmed").length;

  return (
    <div className="space-y-[10px]">
      <DarkCard className="p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/80 mb-1">Document Status</div>
          <div className="h-2 rounded-full overflow-hidden bg-[#3a3a3a]"><div className="h-full rounded-full bg-[#00C96B]" style={{ width: `${(confirmedCount / docs.length) * 100}%` }} /></div>
        </div>
        <div className="flex-shrink-0 text-right"><div className="font-semibold leading-none text-[#00C96B]" style={{ fontFamily: "var(--font-fredoka)", fontSize: "22px" }}>{confirmedCount}<span className="text-white/80" style={{ fontSize: "16px" }}>/{docs.length}</span></div><div className="text-[9px] font-black uppercase tracking-widest text-white/80 mt-0.5">in order</div></div>
      </DarkCard>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
        {docs.map((doc) => (
          <DarkCard key={doc.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-black text-white">{doc.title}</div>
                <div className="mt-1 text-xs font-semibold text-white/80">{doc.holder}</div>
              </div>
              <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: doc.accent }}>{doc.status}</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-white/80">{doc.number || "No number yet"}</p>
            <p className="mt-2 text-sm text-white/80">{doc.notes}</p>
          </DarkCard>
        ))}
      </div>
      <TripNotesSection initialText={initialText} notesMeta={notesMeta} updateNotesAction={updateNotesAction} />
    </div>
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
        <textarea name="notes" value={value} onChange={(e) => setValue(e.target.value)} maxLength={5000} rows={7} placeholder="Parking codes, Wi-Fi passwords, anything the group should know." className="min-h-[160px] resize-y rounded-2xl border border-[#2A2B45] bg-[#1D1E36] px-4 py-3 text-base text-white placeholder:text-white/80 transition-colors focus:border-[#00E5FF] focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/20" />
        {state.error && <p role="alert" className="text-sm font-semibold text-[#FF3DA7]">{state.error}</p>}
        <div className="flex items-center justify-between gap-3"><p className="text-sm text-white/80">{notesMeta.updatedAt ? `Last edited${notesMeta.updatedByName ? ` by ${notesMeta.updatedByName}` : ""} · ${formatRelative(notesMeta.updatedAt)}` : "Not edited yet"}</p><button type="submit" disabled={pending || !dirty} className="rounded-full px-4 py-2 text-sm font-bold transition hover:brightness-110 disabled:opacity-40" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}>{pending ? "Saving…" : "Save"}</button></div>
      </form>
    </section>
  );
}

function DestinationsSection() {
  const [dest, setDest] = useState<DestinationDraft>({ id: "d1", name: "Tokyo", country: "Japan", type: "city", color: "#FF2D8B", arrivalDate: "2025-04-02", departureDate: "2025-04-07", mustDo: [{ id: "a", text: "Shibuya Crossing at night", done: true }, { id: "b", text: "teamLab Planets", done: false }, { id: "c", text: "Tsukiji breakfast", done: false }], notes: "Keep first two days light for jet lag." });
  const days = computeNights(dest.arrivalDate, dest.departureDate) ?? 0;
  const doneCount = dest.mustDo.filter((m) => m.done).length;

  return (
    <>
      <style>{`.destb{display:grid;grid-template-columns:1fr;gap:10px}@media(min-width:768px){.destb{grid-template-columns:1fr 1fr 1fr}.destb-info{grid-column:1 / 3}.destb-dates{grid-column:3;grid-row:1}.destb-mustdo{grid-column:1 / 4}.destb-notes{grid-column:1 / 4}}`}</style>
      <div className="destb">
        <DarkCard className="destb-info p-4 md:p-5">
          <CardLabel>Destination</CardLabel>
          <div className="font-semibold leading-none mb-1 truncate" style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(24px, 3vw, 36px)", color: dest.color }}>{dest.name}</div>
          <div className="text-[11px] font-bold text-white/80 mb-4">{dest.country}</div>
          <div className="grid grid-cols-2 gap-2 mb-3"><FieldInput value={dest.name} onChange={(e) => setDest({ ...dest, name: e.target.value })} /><FieldInput value={dest.country} onChange={(e) => setDest({ ...dest, country: e.target.value })} /></div>
          <div className="flex gap-2">{["#FF2D8B", "#00A8CC", "#FFD600", "#00C96B", "#A855F7"].map((c) => <button key={c} type="button" onClick={() => setDest({ ...dest, color: c })} className="w-6 h-6 rounded-full" style={{ backgroundColor: c, outline: dest.color === c ? `2px solid ${c}` : "none", outlineOffset: 2 }} />)}</div>
        </DarkCard>
        <DarkCard className="destb-dates p-4 md:p-5">
          <CardLabel>Dates</CardLabel>
          <div className="space-y-3"><FieldInput type="date" value={dest.arrivalDate} onChange={(e) => setDest({ ...dest, arrivalDate: e.target.value })} className="text-white/80 text-xs" /><div className="flex justify-center"><div className="rounded-full px-4 py-1 font-black text-[13px]" style={{ backgroundColor: `${dest.color}22`, color: "#fff", border: `1px solid ${dest.color}55` }}>{days} day{days === 1 ? "" : "s"}</div></div><FieldInput type="date" value={dest.departureDate} onChange={(e) => setDest({ ...dest, departureDate: e.target.value })} className="text-white/80 text-xs" /></div>
        </DarkCard>
        <DarkCard className="destb-mustdo p-4 md:p-5">
          <div className="flex items-center justify-between mb-1"><CardLabel>Must-Do</CardLabel><span className="text-[11px] font-black text-white/80">{doneCount} / {dest.mustDo.length} done</span></div>
          <div className="h-1.5 rounded-full overflow-hidden mt-2 mb-4 bg-[#3a3a3a]"><div className="h-full rounded-full" style={{ width: `${(doneCount / dest.mustDo.length) * 100}%`, backgroundColor: dest.color }} /></div>
          <div className="flex flex-col gap-2.5">{dest.mustDo.map((item) => <div key={item.id} className="flex items-center gap-3"><button type="button" onClick={() => setDest({ ...dest, mustDo: dest.mustDo.map((m) => m.id === item.id ? { ...m, done: !m.done } : m) })} className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ backgroundColor: item.done ? dest.color : "transparent", borderColor: item.done ? dest.color : "rgba(255,255,255,0.5)" }}>{item.done && <Checks size={10} weight="bold" color="#fff" />}</button><input type="text" value={item.text} onChange={(e) => setDest({ ...dest, mustDo: dest.mustDo.map((m) => m.id === item.id ? { ...m, text: e.target.value } : m) })} className="flex-1 bg-transparent text-sm font-semibold text-white outline-none border-b border-white/10 focus:border-white/80" /></div>)}</div>
        </DarkCard>
        <DarkCard className="destb-notes p-4 md:p-5"><CardLabel>Notes</CardLabel><FieldTextarea rows={4} value={dest.notes} onChange={(e) => setDest({ ...dest, notes: e.target.value })} /></DarkCard>
      </div>
    </>
  );
}

function VibeSection() {
  const [selectedVibes, setSelectedVibes] = useState<string[]>(["adventure", "foodie"]);
  const [mantra, setMantra] = useState("See a lot, eat well, keep one calm day in reserve.");
  const [notes, setNotes] = useState("Not a sprint. Keep one fancy meal, one scenic day, one deliberately lazy morning.");
  function toggleVibe(key: string) { setSelectedVibes((prev) => prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key]); }
  return (
    <>
      <style>{`.vb{display:grid;grid-template-columns:1fr;gap:10px}@media(min-width:768px){.vb{grid-template-columns:1fr 1fr 1fr}.vb-tags{grid-column:1 / 4}.vb-mantra{grid-column:1 / 3}.vb-notes{grid-column:3}}`}</style>
      <div className="vb">
        <DarkCard className="vb-tags p-4 md:p-5"><CardLabel>Trip Vibes</CardLabel><div className="flex flex-wrap gap-2">{VIBE_TAGS.map(({ key, label, Icon, color }) => { const active = selectedVibes.includes(key); return <button key={key} type="button" onClick={() => toggleVibe(key)} className="flex items-center gap-1.5 rounded-full font-black border text-sm transition-all px-[14px] py-[6px]" style={{ backgroundColor: active ? color : "rgba(255,255,255,0.05)", borderColor: active ? color : "rgba(255,255,255,0.15)", color: "#fff", boxShadow: active ? `0 0 14px ${color}50` : "none" }}><Icon size={13} weight="fill" />{label}</button>; })}</div></DarkCard>
        <DarkCard className="vb-mantra p-4 md:p-5"><CardLabel>Trip Mantra</CardLabel><FieldTextarea rows={5} value={mantra} onChange={(e) => setMantra(e.target.value)} /></DarkCard>
        <DarkCard className="vb-notes p-4 md:p-5"><CardLabel>Notes</CardLabel><FieldTextarea rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} /></DarkCard>
      </div>
    </>
  );
}

const MAX_CHECKLIST_ITEMS = 30;
const MAX_ITEM_TEXT = 200;
function ChecklistCard({ initialItems, updateAction }: { initialItems: ChecklistItem[]; updateAction: (items: ChecklistItem[]) => Promise<ChecklistFormState>; }) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  function persist(newItems: ChecklistItem[]) { startTransition(async () => { const result = await updateAction(newItems); if (result?.error) setError(result.error); else setError(null); }); }
  function handleAdd() { const text = inputValue.trim().slice(0, MAX_ITEM_TEXT); if (!text) return; if (items.length >= MAX_CHECKLIST_ITEMS) { setError(`Max ${MAX_CHECKLIST_ITEMS} items.`); return; } const newItems = [...items, { id: crypto.randomUUID(), text, checked: false }]; setItems(newItems); setInputValue(""); persist(newItems); }
  function handleToggle(id: string) { const newItems = items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)); setItems(newItems); persist(newItems); }
  function handleDelete(id: string) { const newItems = items.filter((item) => item.id !== id); setItems(newItems); persist(newItems); }
  const doneCount = items.filter((i) => i.checked).length;
  return (
    <div className={`${CARD_CLASS} p-5`}>
      <div className="mb-4 flex items-center justify-between"><span className="text-[13px] font-black uppercase tracking-widest text-white/80">Before you leave</span>{items.length > 0 && <span className="text-sm font-medium text-white/80">{doneCount}/{items.length} done</span>}</div>
      {items.length > 0 && <ul className="mb-4 space-y-2">{items.map((item) => <li key={item.id} className="group flex items-center gap-3"><input type="checkbox" checked={item.checked} onChange={() => handleToggle(item.id)} className="h-4 w-4 flex-shrink-0 cursor-pointer rounded accent-[#00E5FF]" /><span className={`min-w-0 flex-1 break-words text-sm font-medium transition-colors ${item.checked ? "text-white/80 line-through" : "text-white"}`}>{item.text}</span><button type="button" onClick={() => handleDelete(item.id)} className="flex-shrink-0 text-white/80 opacity-0 transition-opacity hover:text-[#FF3DA7] group-hover:opacity-100 focus:opacity-100" aria-label="Remove item"><Trash size={14} /></button></li>)}</ul>}
      {items.length === 0 && <p className="mb-4 text-sm leading-relaxed text-white/80">Nothing pre-planned yet. Add the stuff that will absolutely bite you if you forget it.</p>}
      <div className="flex gap-2"><input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }} maxLength={MAX_ITEM_TEXT} placeholder="Add a task…" disabled={items.length >= MAX_CHECKLIST_ITEMS} className={INPUT_CLASS + " flex-1"} /><button type="button" onClick={handleAdd} disabled={!inputValue.trim() || items.length >= MAX_CHECKLIST_ITEMS} className="flex-shrink-0 rounded-xl px-3 py-2 font-bold transition hover:brightness-110 disabled:opacity-30" style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}><Plus size={16} /></button></div>
      {error && <p className="mt-2 text-xs font-medium text-[#FF3DA7]">{error}</p>}
      {isPending && <p className="mt-2 text-sm text-white/80">Saving…</p>}
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
  const primaryFlight = props.flights[0] ?? null;
  const hasTransport = props.transports.length > 0;
  const routeFromCode = primaryFlight?.fromAirport ?? "SRQ";
  const routeToCode = primaryFlight?.toAirport ?? "JFK";
  const routeFromLabel = airportLabel(primaryFlight?.fromAirport) ?? "Sarasota, FL";
  const routeToLabel = airportLabel(primaryFlight?.toAirport) ?? "New York, NY";
  const departDate = primaryFlight?.departureDate ? formatShortDate(primaryFlight.departureDate) : "Apr 1";
  const departTime = primaryFlight?.departureTime ? formatTime(primaryFlight.departureTime) : "7:15 AM";
  const arriveDate = primaryFlight?.departureDate ? formatShortDate(primaryFlight.departureDate) : "Apr 1";
  const arriveTime = primaryFlight?.departureTime ? plusHours(primaryFlight.departureTime, 3, 15) : "10:30 AM";
  const flightNumber = primaryFlight?.flightNumber ?? "AA2847";
  const confirmation = primaryFlight?.confirmationCode ?? "XK92MN";
  const notes = primaryFlight?.notes ?? "Seat preferences, meal requests, layover notes...";
  const airline = primaryFlight?.airline ?? "American Airlines";
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.8fr_0.9fr]">
        <section className="rounded-[26px] border border-white/[0.06] bg-[#2e2e2e] p-6"><p className="text-center text-xs font-black uppercase tracking-[0.28em] text-white/80">Route</p><div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center"><div><p className="text-6xl font-semibold leading-none text-white" style={{ fontFamily: "var(--font-fredoka)" }}>{routeFromCode}</p><p className="mt-2 text-[1.05rem] font-bold text-white/80">{routeFromLabel}</p></div><div className="flex items-center justify-center text-white/80 text-4xl">→</div><div className="text-left lg:text-right"><p className="text-6xl font-semibold leading-none text-white" style={{ fontFamily: "var(--font-fredoka)" }}>{routeToCode}</p><p className="mt-2 text-[1.05rem] font-bold text-white/80">{routeToLabel}</p></div></div></section>
        <section className="rounded-[26px] border border-white/[0.06] bg-[#2e2e2e] p-6"><p className="text-center text-xs font-black uppercase tracking-[0.28em] text-white/80">Flight #</p><p className="mt-7 text-center text-5xl font-semibold leading-none text-[#11c3ef]" style={{ fontFamily: "var(--font-fredoka)" }}>{flightNumber}</p><div className="mt-8 rounded-[18px] bg-[#1e1e1e] px-4 py-5 text-center"><p className="text-[1.85rem] font-black text-white">{flightNumber}</p><p className="mt-2 text-sm font-semibold text-white/80">{airline}</p></div></section>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <section className="rounded-[26px] border border-white/[0.06] bg-[#2e2e2e] p-6 xl:col-span-2"><p className="text-center text-xs font-black uppercase tracking-[0.28em] text-white/80">Depart → Arrive</p><div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-end"><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-[18px] bg-[#1e1e1e] px-4 py-4"><p className="text-xs font-black uppercase tracking-[0.24em] text-white/80">Depart date</p><p className="mt-2 text-[1.15rem] font-black text-white">{departDate}</p></div><div className="rounded-[18px] bg-[#1e1e1e] px-4 py-4"><p className="text-xs font-black uppercase tracking-[0.24em] text-white/80">Depart time</p><p className="mt-2 text-[1.15rem] font-black text-white">{departTime}</p></div></div><div className="pb-2 text-center text-sm font-black uppercase tracking-[0.22em] text-white/80">Direct</div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-[18px] bg-[#1e1e1e] px-4 py-4"><p className="text-xs font-black uppercase tracking-[0.24em] text-white/80">Arrive date</p><p className="mt-2 text-[1.15rem] font-black text-white">{arriveDate}</p></div><div className="rounded-[18px] bg-[#1e1e1e] px-4 py-4"><p className="text-xs font-black uppercase tracking-[0.24em] text-white/80">Arrive time</p><p className="mt-2 text-[1.15rem] font-black text-white">{arriveTime}</p></div></div></div></section>
        <section className="rounded-[26px] border border-white/[0.06] bg-[#2e2e2e] p-6"><p className="text-center text-xs font-black uppercase tracking-[0.28em] text-white/80">Transport status</p><div className="mt-6 space-y-3 rounded-[18px] bg-[#1e1e1e] px-4 py-5"><p className="text-lg font-black text-white">{hasTransport ? `${props.transports.length} transport item${props.transports.length === 1 ? "" : "s"} logged` : "No driving details yet"}</p><p className="text-sm font-semibold text-white/80">{hasTransport ? "Cars, trains, shuttles, and pickups are attached below." : "Add cars, trains, shuttles, or ferries once those details are locked."}</p></div></section>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <section className="rounded-[26px] border border-white/[0.06] bg-[#2e2e2e] p-6"><p className="text-center text-xs font-black uppercase tracking-[0.28em] text-white/80">Seat class</p><div className="mt-6 flex flex-wrap gap-3"><span className="rounded-full bg-[#ff2d8b] px-5 py-2.5 text-lg font-black text-white">Economy</span><span className="rounded-full bg-[#3a3a3a] px-5 py-2.5 text-lg font-black text-white/80">Premium</span><span className="rounded-full bg-[#3a3a3a] px-5 py-2.5 text-lg font-black text-white/80">Business</span><span className="rounded-full bg-[#3a3a3a] px-5 py-2.5 text-lg font-black text-white/80">First</span></div></section>
        <section className="rounded-[26px] border border-white/[0.06] bg-[#2e2e2e] p-6"><p className="text-center text-xs font-black uppercase tracking-[0.28em] text-white/80">Confirmation</p><p className="mt-6 text-center text-5xl font-semibold leading-none text-[#ffd400]" style={{ fontFamily: "var(--font-fredoka)" }}>{confirmation}</p><div className="mt-8 rounded-[18px] bg-[#1e1e1e] px-4 py-5 text-center"><p className="text-[1.7rem] font-black tracking-[0.18em] text-white">{confirmation}</p></div></section>
        <section className="rounded-[26px] border border-white/[0.06] bg-[#2e2e2e] p-6"><p className="text-center text-xs font-black uppercase tracking-[0.28em] text-white/80">Notes</p><div className="mt-6 min-h-[176px] rounded-[18px] bg-[#1e1e1e] px-4 py-4"><p className="text-lg font-semibold leading-relaxed text-white/80">{notes}</p></div></section>
      </div>
      <div className="grid gap-5 xl:grid-cols-2"><FlightsSection flights={props.flights} createAction={props.createFlightAction} updateAction={props.updateFlightAction} deleteAction={props.deleteFlightAction} /><TransportSection transports={props.transports} createAction={props.createTransportAction} updateAction={props.updateTransportAction} deleteAction={props.deleteTransportAction} /></div>
    </div>
  );
}

export default function PreplanningShell({ flights, transports, lodgings, tripNotes, notesMeta, initialChecklist, createFlightAction, updateFlightAction, deleteFlightAction, createTransportAction, updateTransportAction, deleteTransportAction, createStayAction, updateStayAction, deleteStayAction, updateNotesAction, updateChecklistAction }: PreplanningShellProps) {
  const [active, setActive] = useState<SectionId>("travel");
  const travelCount = flights.length + transports.length;
  const staysCount = lodgings.length;
  const prepDone = initialChecklist.filter((i) => i.checked).length;
  const prepTotal = initialChecklist.length;
  const sections = useMemo<SectionMeta[]>(() => [
    { id: "group", label: "Group", subtitle: "4 travelers added", description: "Who is coming, roles, and how the crew is shaping up.", Icon: Users, color: "#14bfe8" },
    { id: "travel", label: "Travel", subtitle: travelCount === 0 ? "0 flights entered" : `${travelCount} items entered`, description: "How you are getting there, timing, and all booked transport.", Icon: Airplane, color: "#ff2d8b" },
    { id: "lodging", label: "Lodging", subtitle: staysCount === 0 ? "0 stays added" : `${staysCount} stays added`, description: "Where everyone is staying, dates, confirmation codes, and notes.", Icon: House, color: "#a855f7" },
    { id: "budget", label: "Budget", subtitle: "Budget set · 8 categories", description: "Costs, rough targets, and where the money is likely to disappear.", Icon: CurrencyDollar, color: "#00c96b" },
    { id: "destinations", label: "Destinations", subtitle: "3 stops · 12 days planned", description: "Stops, route shape, and the things nobody wants to miss.", Icon: MapPin, color: "#ffd600" },
    { id: "documents", label: "Documents", subtitle: "6 of 8 confirmed", description: "Important docs, confirmations, and shared notes for the trip.", Icon: FileText, color: "#00a8cc" },
    { id: "vibe", label: "Trip Vibe", subtitle: "2 vibes · Balanced pace", description: "What kind of trip this is supposed to feel like before reality interferes.", Icon: Sparkle, color: "#ff2d8b" },
    { id: "departure", label: "Pre-Departure", subtitle: prepTotal === 0 ? "0 tasks done" : `${prepDone} of ${prepTotal} tasks done`, description: "Final checks before leaving, so nothing idiotic gets forgotten.", Icon: Checks, color: "#00c96b" },
  ], [prepDone, prepTotal, staysCount, travelCount]);
  const activeSection = sections.find((section) => section.id === active) ?? sections[0];
  const sectionsDone = Number(staysCount > 0) + Number(travelCount > 0);
  const inProgress = Math.max(0, sections.length - sectionsDone);
  const overall = Math.round((((travelCount > 0 ? 1 : 0) + (staysCount > 0 ? 1 : 0) + (prepTotal > 0 ? prepDone / Math.max(prepTotal, 1) : 0)) / 3) * 100);

  return (
    <div className="bg-[#4b4b4b]">
      <PreplanningTabs sections={sections} active={active} onSelect={setActive} />
      <div className="border-b border-white/6 bg-[#1f1f1f] px-5 py-5 md:px-8"><h2 className="text-[2rem] font-semibold leading-none text-white" style={{ fontFamily: "var(--font-fredoka)" }}>{activeSection.label}</h2><p className="mt-2 max-w-2xl text-sm text-white/80">{activeSection.description}</p></div>
      <div className="grid grid-cols-1 md:grid-cols-[274px_minmax(0,1fr)]">
        <PreplanningRail sections={sections} active={active} onSelect={setActive} />
        <div className="min-h-[calc(100vh-68px-92px)] min-w-0 bg-[#4b4b4b]"><div className="space-y-5 px-5 py-5 md:px-8 md:py-6"><div className="grid gap-4 lg:grid-cols-3"><MetricBox label="Sections Done" value={String(sectionsDone)} color="#00d26a" /><MetricBox label="In Progress" value={String(inProgress)} color="#ff980f" /><MetricBox label="Overall" value={`${overall}%`} color="#14bfe8" /></div><div className="min-h-[520px] bg-transparent">{active === "group" && <GroupSection />}{active === "travel" && <TravelSection flights={flights} transports={transports} createFlightAction={createFlightAction} updateFlightAction={updateFlightAction} deleteFlightAction={deleteFlightAction} createTransportAction={createTransportAction} updateTransportAction={updateTransportAction} deleteTransportAction={deleteTransportAction} />}{active === "lodging" && <StaysSection lodgings={lodgings} createAction={createStayAction} updateAction={updateStayAction} deleteAction={deleteStayAction} />}{active === "budget" && <BudgetSection flights={flights} transports={transports} lodgings={lodgings} />}{active === "destinations" && <DestinationsSection />}{active === "documents" && <DocumentsSection initialText={tripNotes} notesMeta={notesMeta} updateNotesAction={updateNotesAction} />}{active === "vibe" && <VibeSection />}{active === "departure" && <DepartureSection initialChecklist={initialChecklist} updateChecklistAction={updateChecklistAction} />}</div></div></div>
      </div>
    </div>
  );
}

function formatDateRange(start: string | null, end: string | null): string { if (!start && !end) return ""; const fmt = (d: string) => { const [y, m, day] = d.split("-").map(Number); return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }); }; if (start && end) return `${fmt(start)} → ${fmt(end)}`; return fmt((start ?? end)!); }
function computeNights(start: string | null, end: string | null): number | null { if (!start || !end) return null; const [ys, ms, ds] = start.split("-").map(Number); const [ye, me, de] = end.split("-").map(Number); const s = Date.UTC(ys, ms - 1, ds); const e = Date.UTC(ye, me - 1, de); const nights = Math.round((e - s) / 86_400_000); return nights > 0 ? nights : null; }
function formatRelative(iso: string): string { const then = new Date(iso).getTime(); const now = Date.now(); const diff = Math.max(0, now - then); const minute = 60_000; const hour = 60 * minute; const day = 24 * hour; if (diff < minute) return "just now"; if (diff < hour) return `${Math.floor(diff / minute)}m ago`; if (diff < day) return `${Math.floor(diff / hour)}h ago`; if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`; return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" }); }
function formatFlightHeader(flight: TripFlight): string { const parts = [flight.airline, flight.flightNumber].filter(Boolean); return parts.length > 0 ? parts.join(" · ") : "Flight"; }
function formatFlightMeta(flight: TripFlight): string | null { const routePart = flight.fromAirport || flight.toAirport ? `${flight.fromAirport ?? "??"} → ${flight.toAirport ?? "??"}` : null; const datePart = flight.departureDate ? formatShortDate(flight.departureDate) : null; const timePart = flight.departureTime ? formatTime(flight.departureTime) : null; const parts = [routePart, datePart, timePart].filter(Boolean); return parts.length > 0 ? parts.join(" · ") : null; }
function airportLabel(code: string | null | undefined): string | null { if (!code) return null; const normalized = code.toUpperCase(); const known: Record<string, string> = { SRQ: "Sarasota, FL", JFK: "New York, NY", EWR: "Newark, NJ", LGA: "Queens, NY", MCO: "Orlando, FL", TPA: "Tampa, FL", ATL: "Atlanta, GA", LAX: "Los Angeles, CA", ORD: "Chicago, IL", BOS: "Boston, MA", PVD: "Providence, RI" }; return known[normalized] ?? normalized; }
function plusHours(timeStr: string, hours: number, minutes = 0): string { const [h, m] = timeStr.split(":").map(Number); const d = new Date(); d.setHours(h, m, 0, 0); d.setMinutes(d.getMinutes() + hours * 60 + minutes); return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }
function formatShortDate(dateStr: string): string { const [y, m, d] = dateStr.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }); }
function formatTime(timeStr: string): string { const [h, m] = timeStr.split(":").map(Number); const d = new Date(); d.setHours(h, m, 0, 0); return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }
function toTimeInputValue(t: string | null): string { if (!t) return ""; return t.slice(0, 5); }
function formatTransportHeader(t: TripTransport): string { const label = TRANSPORT_LABELS[t.type] ?? "Transport"; return t.provider ? `${label} · ${t.provider}` : label; }
function formatTransportMeta(t: TripTransport): string | null { const routePart = t.pickupLocation || t.dropoffLocation ? `${t.pickupLocation ?? "??"} → ${t.dropoffLocation ?? "??"}` : null; const datePart = t.pickupDate ? formatShortDate(t.pickupDate) : null; const timePart = t.pickupTime ? formatTime(t.pickupTime) : null; const parts = [routePart, datePart, timePart].filter(Boolean); return parts.length > 0 ? parts.join(" · ") : null; }
