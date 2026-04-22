import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import type { TripPulseData } from "@/lib/trips/pulse";

function formatCents(cents: number, currency: string): string {
  const dollars = Math.abs(cents) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: Math.abs(cents) % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(dollars);
}

function formatEventDate(eventDate: string): string {
  const [year, month, day] = eventDate.split("-").map(Number);
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const eventUtc = Date.UTC(year, month - 1, day);
  const diffDays = Math.round((eventUtc - todayUtc) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")}${ampm}`;
}

function PulseRow({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 py-2 text-sm text-white/60 hover:text-white/90 transition-colors"
    >
      <span className="leading-snug">{text}</span>
      <ArrowRight size={11} weight="bold" className="shrink-0 text-white/25" />
    </Link>
  );
}

interface Props {
  pulse: TripPulseData;
  base: string;
  displayCurrency: string;
}

export default function TripPulse({ pulse, base, displayCurrency }: Props) {
  const hasNextEvent = pulse.nextEvent !== null;
  const hasUnvotedPolls = pulse.unvotedPollsCount > 0;
  const hasBalance = Math.abs(pulse.netBalanceCents) >= 100;
  const hasProposals = pulse.proposalsCount > 0;

  if (!hasNextEvent && !hasUnvotedPolls && !hasBalance && !hasProposals) {
    return null;
  }

  // ── Next event label ───────────────────────────────────────────────────────
  let nextEventText = "";
  if (hasNextEvent && pulse.nextEvent) {
    const dateLabel = formatEventDate(pulse.nextEvent.eventDate);
    const timeLabel = pulse.nextEvent.startTime
      ? `, ${formatTime(pulse.nextEvent.startTime)}`
      : "";
    nextEventText = `${dateLabel} · ${pulse.nextEvent.title}${timeLabel}`;
  }

  // ── Polls label ───────────────────────────────────────────────────────────
  const pollsText =
    pulse.unvotedPollsCount === 1
      ? "1 open poll — your vote needed"
      : `${pulse.unvotedPollsCount} open polls — your vote needed`;

  // ── Balance label ─────────────────────────────────────────────────────────
  const balanceText =
    pulse.netBalanceCents < 0
      ? `You owe ${formatCents(pulse.netBalanceCents, displayCurrency)}`
      : `You're owed ${formatCents(pulse.netBalanceCents, displayCurrency)}`;

  // ── Proposals label ───────────────────────────────────────────────────────
  let proposalsText = "";
  if (hasProposals) {
    const { proposalsCount: count, topProposal: top } = pulse;
    if (count === 1 && top) {
      proposalsText =
        top.upvoteCount > 0
          ? `1 proposal: ${top.title} (${top.upvoteCount} upvote${top.upvoteCount === 1 ? "" : "s"})`
          : `1 proposal: ${top.title}`;
    } else if (top && top.upvoteCount > 0) {
      proposalsText = `${count} proposals · top: ${top.title} (${top.upvoteCount} upvote${top.upvoteCount === 1 ? "" : "s"})`;
    } else {
      proposalsText = `${count} proposal${count === 1 ? "" : "s"} — add your support`;
    }
  }

  return (
    <div
      className="mt-3 rounded-[20px] border p-5"
      style={{ backgroundColor: "#2e2e2e", borderColor: "#3a3a3a" }}
    >
      <div className="text-[10px] font-black uppercase tracking-[2px] text-white/35 mb-1">
        Right now
      </div>
      <div className="flex flex-col divide-y divide-white/[0.06]">
        {hasNextEvent && (
          <PulseRow href={`${base}/itinerary`} text={nextEventText} />
        )}
        {hasUnvotedPolls && (
          <PulseRow href={`${base}/polls`} text={pollsText} />
        )}
        {hasBalance && (
          <PulseRow href={`${base}/expenses`} text={balanceText} />
        )}
        {hasProposals && (
          <PulseRow href={`${base}/proposals`} text={proposalsText} />
        )}
      </div>
    </div>
  );
}
