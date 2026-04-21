"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  CurrencyDollar,
  UserPlus,
  X,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";

import {
  fetchNotificationsForUser,
  fetchUnreadCountAction,
  markAllReadAction,
  type SerializedNotification,
} from "@/lib/notifications/actions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

type NotificationDisplay = {
  message: React.ReactNode;
  plainText: string;
  href: string;
  color: string;
  Icon: PhosphorIcon;
};

function resolveNotification(n: SerializedNotification): NotificationDisplay {
  const p = n.payload as Record<string, unknown>;
  switch (n.type) {
    case "expense_added": {
      const payerName = String(p.payerName ?? "Someone");
      const description = String(p.description ?? "an expense");
      const share = formatCents(Number(p.shareAmountCents ?? 0));
      return {
        message: (
          <>
            <span className="font-semibold">{payerName}</span> logged {description} · your share{" "}
            {share}
          </>
        ),
        plainText: `${payerName} logged ${description}, your share ${share}`,
        href: n.tripId ? `/app/trips/${n.tripId}/expenses` : "/app",
        color: "#FFEB00",
        Icon: CurrencyDollar,
      };
    }
    case "invite_accepted": {
      const joinerName = String(p.joinerName ?? "Someone");
      const tripName = String(p.tripName ?? "your trip");
      return {
        message: (
          <>
            <span className="font-semibold">{joinerName}</span> joined {tripName}
          </>
        ),
        plainText: `${joinerName} joined ${tripName}`,
        href: n.tripId ? `/app/trips/${n.tripId}/settings/members` : "/app",
        color: "#00E5FF",
        Icon: UserPlus,
      };
    }
    default:
      return {
        message: "New notification",
        plainText: "New notification",
        href: n.tripId ? `/app/trips/${n.tripId}` : "/app",
        color: "#6C6E8A",
        Icon: Bell,
      };
  }
}

function groupNotifications(items: SerializedNotification[]) {
  const todayStart = (() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  })();
  const weekStart = todayStart - 6 * 24 * 60 * 60 * 1000;

  const today: SerializedNotification[] = [];
  const thisWeek: SerializedNotification[] = [];
  const earlier: SerializedNotification[] = [];

  for (const n of items) {
    const ts = new Date(n.createdAt).getTime();
    if (ts >= todayStart) today.push(n);
    else if (ts >= weekStart) thisWeek.push(n);
    else earlier.push(n);
  }

  if (today.length === 0) {
    return { today: [], thisWeek: [], earlier: [...thisWeek, ...earlier] };
  }
  return { today, thisWeek, earlier };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-l-2 border-transparent">
      <div className="w-8 h-8 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
      <div className="flex-1 space-y-2">
        <div className="h-3 rounded animate-pulse w-4/5" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
        <div className="h-2.5 rounded animate-pulse w-2/5" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
      </div>
    </div>
  );
}

function NotificationRow({
  notification,
  onNavigate,
}: {
  notification: SerializedNotification;
  onNavigate: () => void;
}) {
  const display = resolveNotification(notification);
  const isUnread = notification.readAt === null;

  return (
    <Link
      href={display.href}
      onClick={onNavigate}
      aria-label={`${display.plainText}, ${relativeTime(notification.createdAt)}`}
      className="flex items-start gap-3 px-4 py-3 min-h-[56px] transition-colors border-l-2"
      style={{
        borderLeftColor: isUnread ? "#FF3DA7" : "transparent",
        // hover handled inline to avoid Tailwind arbitrary-value collision
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.05)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "")}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: `${display.color}20` }}
      >
        <display.Icon size={14} weight="fill" style={{ color: display.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-white leading-snug line-clamp-2">{display.message}</p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
          {relativeTime(notification.createdAt)}
        </p>
      </div>

      {isUnread && (
        <span
          aria-hidden="true"
          className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
          style={{ backgroundColor: "#FF3DA7" }}
        />
      )}
    </Link>
  );
}

function GroupSection({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: SerializedNotification[];
  onNavigate: () => void;
}) {
  if (items.length === 0) return null;
  return (
    <section aria-label={label}>
      <p
        className="px-4 pt-3 pb-1.5 text-xs font-bold uppercase tracking-wide"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        {label}
      </p>
      {items.map((n) => (
        <NotificationRow key={n.id} notification={n} onNavigate={onNavigate} />
      ))}
    </section>
  );
}

// ─── NotificationBell ─────────────────────────────────────────────────────────

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [items, setItems] = useState<SerializedNotification[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch unread count on mount
  useEffect(() => {
    fetchUnreadCountAction()
      .then(setUnreadCount)
      .catch(() => setUnreadCount(0));
  }, []);

  // Close panel on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Focus panel on open
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  // Click-outside + Escape
  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      const target = e.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function loadNotifications() {
    setLoadState("loading");
    try {
      const data = await fetchNotificationsForUser();
      setItems(data);
      setLoadState("done");
    } catch {
      setLoadState("error");
    }
  }

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next && loadState === "idle") {
      loadNotifications();
    }
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllReadAction();
      setItems((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })));
      setUnreadCount(0);
    });
  }

  function handleNavigate() {
    setOpen(false);
  }

  const hasUnread = unreadCount === null || unreadCount > 0;
  const groups = groupNotifications(items);

  return (
    <div className="relative">
      {/* Bell trigger */}
      <button
        ref={triggerRef}
        onClick={handleToggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
        className="relative w-9 h-9 rounded-full bg-[#2a2a2a] hover:bg-[#333333] flex items-center justify-center transition-colors"
      >
        <Bell size={18} weight="bold" className="text-white" />
        {hasUnread && (
          <span
            aria-hidden="true"
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: "#FF3DA7" }}
          />
        )}
      </button>

      {/* Notification panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Notifications"
          tabIndex={-1}
          className="
            fixed sm:absolute
            left-0 right-0 sm:left-auto sm:right-0
            top-[56px] sm:top-full sm:mt-2
            w-full sm:w-96
            rounded-b-2xl sm:rounded-2xl
            border border-[#2A2B45]
            flex flex-col
            max-h-[calc(100dvh-56px)] sm:max-h-[480px]
            focus:outline-none
          "
          style={{
            backgroundColor: "#15162A",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            zIndex: 100,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
            style={{ borderColor: "#2A2B45" }}
          >
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            <div className="flex items-center gap-3">
              {unreadCount !== null && unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={isPending}
                  aria-label="Mark all notifications as read"
                  className="text-xs font-semibold transition-opacity disabled:opacity-50"
                  style={{ color: "#00E5FF" }}
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => { setOpen(false); triggerRef.current?.focus(); }}
                aria-label="Close notifications"
                className="sm:hidden transition-colors"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {loadState === "loading" && (
              <div role="status" aria-label="Loading notifications">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
            )}

            {loadState === "error" && (
              <div className="p-6 text-center">
                <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Couldn&apos;t load notifications.
                </p>
                <button
                  onClick={loadNotifications}
                  className="text-xs font-semibold"
                  style={{ color: "#00E5FF" }}
                >
                  Tap to retry
                </button>
              </div>
            )}

            {loadState === "done" && items.length === 0 && (
              <div className="flex flex-col items-center py-10 px-6 text-center gap-3">
                <Bell size={36} style={{ color: "rgba(255,255,255,0.15)" }} />
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Nothing here yet</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Add a shared expense — your group will see it here.
                  </p>
                </div>
              </div>
            )}

            {loadState === "done" && items.length > 0 && (
              <>
                <GroupSection label="Today" items={groups.today} onNavigate={handleNavigate} />
                <GroupSection label="This Week" items={groups.thisWeek} onNavigate={handleNavigate} />
                <GroupSection label="Earlier" items={groups.earlier} onNavigate={handleNavigate} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
