"use client";

import { useState, useRef, useEffect } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toYMD(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatDisplay(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

interface DatePickerProps {
  name: string;
  defaultValue?: string | null;
  accentColor?: string;
  placeholder?: string;
}

export default function DatePicker({
  name,
  defaultValue,
  accentColor = "#00A8CC",
  placeholder = "Select a date",
}: DatePickerProps) {
  const today = new Date();
  const todayStr = toYMD(today);

  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() =>
    defaultValue ? parseInt(defaultValue.split("-")[0]) : today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(() =>
    defaultValue ? parseInt(defaultValue.split("-")[1]) - 1 : today.getMonth()
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Build 42-cell calendar grid
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { dateStr: string; isCurrentMonth: boolean }[] = [];

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({ dateStr: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ dateStr: `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`, isCurrentMonth: true });
  }
  for (let d = 1; cells.length < 42; d++) {
    const m = viewMonth === 11 ? 0 : viewMonth + 1;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    cells.push({ dateStr: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`, isCurrentMonth: false });
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }
  function selectDate(dateStr: string) {
    setValue(dateStr);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value} />

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full rounded-xl border bg-[#1E1E1E] px-4 py-3 text-left text-sm font-medium transition-colors focus:outline-none"
        style={{
          borderColor: open ? accentColor : `${accentColor}40`,
          color: value ? "#ffffff" : "rgba(255,255,255,0.3)",
          boxShadow: open ? `0 0 0 1px ${accentColor}30` : "none",
        }}
      >
        {value ? formatDisplay(value) : placeholder}
      </button>

      {/* Calendar popup */}
      {open && (
        <div
          className="absolute z-50 left-0 mt-2 w-[280px] rounded-2xl border border-[#3A3A3A] p-4 shadow-2xl"
          style={{ backgroundColor: "#1E1E1E", boxShadow: "0 16px 48px rgba(0,0,0,0.6)" }}
        >
          {/* Month / year navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-colors"
              style={{ boxShadow: "0 2px 0 rgba(0,0,0,0.4)" }}
            >
              <CaretLeft size={13} weight="bold" />
            </button>

            <span
              className="text-sm font-bold text-white"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {MONTHS[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-colors"
              style={{ boxShadow: "0 2px 0 rgba(0,0,0,0.4)" }}
            >
              <CaretRight size={13} weight="bold" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div
                key={d}
                className="text-center text-[10px] font-black uppercase tracking-widest py-1"
                style={{ color: accentColor, fontFamily: "var(--font-fredoka)", opacity: 0.7 }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map(({ dateStr, isCurrentMonth }) => {
              const isSelected = dateStr === value;
              const isToday = dateStr === todayStr;
              const day = parseInt(dateStr.split("-")[2]);

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => selectDate(dateStr)}
                  className="relative flex items-center justify-center h-9 w-9 mx-auto rounded-full text-xs font-semibold transition-all"
                  style={{
                    fontFamily: "var(--font-fredoka)",
                    fontSize: "0.8rem",
                    backgroundColor: isSelected ? accentColor : "transparent",
                    color: isSelected
                      ? "#171717"
                      : isCurrentMonth
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(255,255,255,0.18)",
                    outline: isToday && !isSelected ? `2px solid ${accentColor}` : "none",
                    outlineOffset: "-2px",
                    boxShadow: isSelected ? `0 2px 0 rgba(0,0,0,0.3)` : "none",
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)";
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Clear / Today shortcuts */}
          <div className="mt-3 pt-3 border-t border-[#3A3A3A] flex items-center justify-between">
            <button
              type="button"
              onClick={() => selectDate(todayStr)}
              className="text-xs font-bold transition-colors hover:opacity-100 opacity-60"
              style={{ color: accentColor, fontFamily: "var(--font-fredoka)" }}
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                onClick={() => { setValue(""); setOpen(false); }}
                className="text-xs font-bold text-white/40 hover:text-white/70 transition-colors"
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
