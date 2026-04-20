"use client";

import { useState } from "react";
import {
  PencilSimple, CalendarBlank, MapPin, Globe, Star,
  Lock, LockOpen, Users, CheckCircle, Warning, Trash,
  Vault, Moon, FloppyDisk,
} from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

type ApprovalMode = "open" | "vote" | "gated";
type TripVibe = "adventure" | "beach" | "city" | "family" | "food" | "relaxation";

const APPROVAL_OPTIONS: { key: ApprovalMode; label: string; desc: string; Icon: PhosphorIcon; color: string }[] = [
  { key: "open",   label: "Open",     desc: "Anyone can add, edit, or remove items",              Icon: LockOpen,     color: "#00C96B" },
  { key: "vote",   label: "Vote",     desc: "Changes require majority support before landing",    Icon: Users,        color: "#00A8CC" },
  { key: "gated",  label: "Gated",    desc: "All changes require organizer approval",              Icon: Lock,         color: "#A855F7" },
];

const VIBE_OPTIONS: { key: TripVibe; label: string; emoji: string }[] = [
  { key: "adventure",  label: "Adventure",  emoji: "🏔️" },
  { key: "beach",      label: "Beach",      emoji: "🏖️" },
  { key: "city",       label: "City",       emoji: "🌆" },
  { key: "family",     label: "Family",     emoji: "👨‍👩‍👧‍👦" },
  { key: "food",       label: "Food",       emoji: "🍜" },
  { key: "relaxation", label: "Relaxation", emoji: "🧘" },
];

export default function SettingsShell() {
  const [tripName, setTripName]         = useState("Japan Spring 2025");
  const [startDate, setStartDate]       = useState("2025-04-01");
  const [endDate, setEndDate]           = useState("2025-04-15");
  const [approvalMode, setApprovalMode] = useState<ApprovalMode>("open");
  const [isDreamTrip, setIsDreamTrip]   = useState(false);
  const [vibe, setVibe]                 = useState<TripVibe>("city");
  const [saved, setSaved]               = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ backgroundColor: "#404040", minHeight: "100vh", color: "white" }}>
      <style>{`
        .st-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        @media (min-width: 768px) {
          .st-grid { grid-template-columns: 2fr 1fr; }
          .st-left  { grid-column: 1; }
          .st-right { grid-column: 2; }
          .st-full  { grid-column: 1 / 3; }
        }
        .st-action-btn { transition: transform 0.08s ease, box-shadow 0.08s ease; }
        .st-action-btn:hover  { transform: translateY(2px); }
        .st-action-btn:active { transform: translateY(4px); box-shadow: none !important; }
        .st-toggle { transition: background-color 0.2s; }
        .st-toggle:hover { opacity: 0.8; }
        .st-input {
          background: #1e1e1e; border: 1px solid #3a3a3a; border-radius: 8px;
          color: white; font-size: 0.88rem; padding: 9px 12px; width: 100%;
          outline: none; transition: border-color 0.15s;
        }
        .st-input:focus { border-color: #00A8CC; }
        .st-approval:hover { border-color: #555 !important; }
      `}</style>

      {/* Header */}
      <div style={{ backgroundColor: "#282828", borderBottom: "1px solid #3a3a3a", padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-fredoka)", color: "white", lineHeight: 1 }}>Settings</h1>
          <p style={{ color: "#9CA3AF", marginTop: "6px", fontSize: "0.88rem" }}>Japan Spring 2025 &nbsp;·&nbsp; Planning phase</p>
        </div>
        <button
          className="st-action-btn"
          onClick={handleSave}
          style={{ backgroundColor: saved ? "#00C96B" : "#00A8CC", color: "white", border: "none", borderRadius: "10px", padding: "10px 18px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", boxShadow: saved ? "0 4px 0 #009950" : "0 4px 0 #007A99", display: "flex", alignItems: "center", gap: "6px", transition: "background-color 0.2s" }}
        >
          {saved ? <CheckCircle size={16} weight="fill" /> : <FloppyDisk size={16} weight="fill" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div style={{ padding: "16px 24px" }}>
        <div className="st-grid">

          {/* ── Left: Trip Identity ── */}
          <div className="st-left" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

            {/* Trip name + dates */}
            <div style={{ backgroundColor: "#2e2e2e", borderRadius: "14px", border: "1px solid #3a3a3a", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "rgba(0,168,204,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PencilSimple size={14} weight="fill" style={{ color: "#00A8CC" }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: "0.92rem" }}>Trip Identity</span>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>Trip Name</label>
                <input className="st-input" value={tripName} onChange={(e) => setTripName(e.target.value)} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>Start Date</label>
                  <div style={{ position: "relative" }}>
                    <CalendarBlank size={14} weight="fill" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", pointerEvents: "none" }} />
                    <input type="date" className="st-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ paddingLeft: "30px" }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>End Date</label>
                  <div style={{ position: "relative" }}>
                    <CalendarBlank size={14} weight="fill" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", pointerEvents: "none" }} />
                    <input type="date" className="st-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ paddingLeft: "30px" }} />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>Destinations</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {[{ city: "Tokyo", country: "Japan", color: "#FF2D8B" }, { city: "Kyoto", country: "Japan", color: "#FFD600" }, { city: "Osaka", country: "Japan", color: "#00C96B" }].map((d) => (
                    <div key={d.city} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#252525", borderRadius: "8px", padding: "8px 10px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: d.color, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.85rem", color: "white", flex: 1 }}>{d.city}, {d.country}</span>
                      <button style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Edit</button>
                    </div>
                  ))}
                  <button style={{ backgroundColor: "#252525", border: "1px dashed #3a3a3a", borderRadius: "8px", padding: "8px 10px", color: "#6B7280", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                    <MapPin size={13} weight="fill" /> Add destination
                  </button>
                </div>
              </div>
            </div>

            {/* Trip vibe */}
            <div style={{ backgroundColor: "#2e2e2e", borderRadius: "14px", border: "1px solid #3a3a3a", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "rgba(255,214,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Globe size={14} weight="fill" style={{ color: "#FFD600" }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: "0.92rem" }}>Trip Vibe</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                {VIBE_OPTIONS.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setVibe(v.key)}
                    style={{ padding: "10px 8px", borderRadius: "9px", border: `1px solid ${vibe === v.key ? "#FFD600" : "#3a3a3a"}`, backgroundColor: vibe === v.key ? "rgba(255,214,0,0.1)" : "#252525", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>{v.emoji}</span>
                    <span style={{ fontSize: "0.72rem", fontWeight: 600, color: vibe === v.key ? "#FFD600" : "#9CA3AF" }}>{v.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Approval mode */}
            <div style={{ backgroundColor: "#2e2e2e", borderRadius: "14px", border: "1px solid #3a3a3a", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Lock size={14} weight="fill" style={{ color: "#A855F7" }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: "0.92rem" }}>Approval Mode</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {APPROVAL_OPTIONS.map((opt) => {
                  const Icon = opt.Icon;
                  const selected = approvalMode === opt.key;
                  return (
                    <button
                      key={opt.key}
                      className="st-approval"
                      onClick={() => setApprovalMode(opt.key)}
                      style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "10px", border: `1px solid ${selected ? opt.color : "#3a3a3a"}`, backgroundColor: selected ? `${opt.color}12` : "#252525", cursor: "pointer", textAlign: "left", transition: "border-color 0.15s" }}
                    >
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: selected ? `${opt.color}20` : "#3a3a3a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={15} weight="fill" style={{ color: selected ? opt.color : "#6B7280" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.88rem", color: selected ? opt.color : "white" }}>{opt.label}</div>
                        <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "1px" }}>{opt.desc}</div>
                      </div>
                      {selected && <CheckCircle size={16} weight="fill" style={{ color: opt.color, flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right: quick toggles + danger ── */}
          <div className="st-right" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

            {/* Quick toggles */}
            <div style={{ backgroundColor: "#2e2e2e", borderRadius: "14px", border: "1px solid #3a3a3a", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "rgba(0,201,107,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Star size={14} weight="fill" style={{ color: "#00C96B" }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: "0.92rem" }}>Options</span>
              </div>

              {/* Dream Trip toggle */}
              <div style={{ padding: "12px 0", borderBottom: "1px solid #3a3a3a" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <Moon size={14} weight="fill" style={{ color: "#A855F7" }} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "white" }}>Dream Trip</span>
                  </div>
                  <button className="st-toggle" onClick={() => setIsDreamTrip((v) => !v)} style={{ width: "36px", height: "20px", borderRadius: "10px", border: "none", cursor: "pointer", backgroundColor: isDreamTrip ? "#A855F7" : "#3a3a3a", position: "relative" }}>
                    <div style={{ position: "absolute", top: "2px", left: isDreamTrip ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "left 0.15s" }} />
                  </button>
                </div>
                <p style={{ fontSize: "0.73rem", color: "#6B7280", margin: 0 }}>Mark as a someday trip — no dates required</p>
              </div>

              {/* Phase display */}
              <div style={{ padding: "12px 0", borderBottom: "1px solid #3a3a3a" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "white" }}>Current Phase</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", backgroundColor: "rgba(255,45,139,0.12)", padding: "3px 9px", borderRadius: "6px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#FF2D8B" }} />
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#FF2D8B" }}>Planning</span>
                  </div>
                </div>
                <p style={{ fontSize: "0.73rem", color: "#6B7280", margin: 0 }}>Transitions are automatic based on dates</p>
              </div>

              {/* Vault trip */}
              <div style={{ padding: "12px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px" }}>
                  <Vault size={14} weight="fill" style={{ color: "#9CA3AF" }} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "white" }}>Archive Trip</span>
                </div>
                <p style={{ fontSize: "0.73rem", color: "#6B7280", marginBottom: "8px" }}>Move to vault — read-only, still accessible</p>
                <button style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF", border: "1px solid #4a4a4a", borderRadius: "8px", padding: "7px 14px", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", width: "100%" }}>
                  Archive this trip
                </button>
              </div>
            </div>

            {/* Danger zone */}
            <div style={{ backgroundColor: "#2e2e2e", borderRadius: "14px", border: "1px solid rgba(239,68,68,0.3)", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Warning size={14} weight="fill" style={{ color: "#EF4444" }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: "0.92rem", color: "#EF4444" }}>Danger Zone</span>
              </div>

              <p style={{ fontSize: "0.78rem", color: "#9CA3AF", marginBottom: "12px" }}>
                Deleting a trip is permanent. All itinerary items, proposals, expenses, and data will be removed.
              </p>

              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "9px 14px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <Trash size={14} weight="fill" /> Delete trip
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  <p style={{ fontSize: "0.78rem", color: "#EF4444", fontWeight: 600, margin: 0 }}>Are you sure? This cannot be undone.</p>
                  <div style={{ display: "flex", gap: "7px" }}>
                    <button
                      style={{ flex: 1, backgroundColor: "#EF4444", color: "white", border: "none", borderRadius: "8px", padding: "8px", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      style={{ flex: 1, backgroundColor: "#3a3a3a", color: "#9CA3AF", border: "none", borderRadius: "8px", padding: "8px", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
