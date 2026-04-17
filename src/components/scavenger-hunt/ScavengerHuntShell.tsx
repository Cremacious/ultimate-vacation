"use client";

import { useState } from "react";
import {
  Camera,
  MapPin,
  Question,
  QrCode,
  TextT,
  Lock,
  CheckCircle,
  Trophy,
  Star,
  Clock,
  Lightbulb,
  Plus,
  ArrowRight,
} from "@phosphor-icons/react";

type ChallengeType = "photo" | "location" | "trivia" | "qr" | "text";
type ChallengeStatus = "locked" | "available" | "completed";
type TabView = "challenges" | "leaderboard";

interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  points: number;
  status: ChallengeStatus;
  completedBy?: string;
  completedAt?: string;
  hasHint: boolean;
  hintText?: string;
  timeLimit?: string;
  order: number;
}

interface Participant {
  name: string;
  initials: string;
  color: string;
  points: number;
  completed: number;
  rank: number;
  isMe: boolean;
}

const TYPE_META: Record<ChallengeType, { label: string; Icon: React.ComponentType<{ size?: number; weight?: string; style?: React.CSSProperties }>; color: string; bg: string }> = {
  photo:    { label: "Photo",    Icon: Camera,   color: "#FF2D8B", bg: "rgba(255,45,139,0.12)" },
  location: { label: "Location", Icon: MapPin,   color: "#00A8CC", bg: "rgba(0,168,204,0.12)" },
  trivia:   { label: "Trivia",   Icon: Question, color: "#FFD600", bg: "rgba(255,214,0,0.12)" },
  qr:       { label: "QR Scan",  Icon: QrCode,   color: "#A855F7", bg: "rgba(168,85,247,0.12)" },
  text:     { label: "Text",     Icon: TextT,    color: "#00C96B", bg: "rgba(0,201,107,0.12)" },
};

const ACTION_LABEL: Record<ChallengeType, string> = {
  photo:    "Upload Photo",
  location: "Check In",
  trivia:   "Answer",
  qr:       "Scan QR",
  text:     "Submit",
};

function darken(hex: string): string {
  const map: Record<string, string> = {
    "#FF2D8B": "#C0006A",
    "#00A8CC": "#007A99",
    "#FFD600": "#C0A000",
    "#A855F7": "#7C3AED",
    "#00C96B": "#009950",
    "#FF8C00": "#C06A00",
  };
  return map[hex] ?? "#333333";
}

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: "1", type: "photo", title: "Torii Gate Selfie",
    description: "Take a photo at the iconic orange torii gates at Fushimi Inari. At least one gate must be visible in the shot.",
    points: 100, status: "completed", completedBy: "You", completedAt: "9:14 AM", hasHint: false, order: 1,
  },
  {
    id: "2", type: "location", title: "Shibuya Crossing",
    description: "Check in at Shibuya Crossing during peak hour (7–9 AM or 5–7 PM) for the full sensory experience.",
    points: 150, status: "completed", completedBy: "Sarah", completedAt: "8:52 AM",
    hasHint: true, hintText: "Look for the famous pedestrian scramble intersection just outside Shibuya Station's Hachiko exit.",
    order: 2,
  },
  {
    id: "3", type: "trivia", title: "Konbini Knowledge",
    description: "What is the name of the triangular rice snack wrapped in seaweed sold at Japanese convenience stores?",
    points: 75, status: "available",
    hasHint: true, hintText: "It starts with the letter O and is a staple of konbini culture everywhere in Japan.",
    order: 3,
  },
  {
    id: "4", type: "photo", title: "Vending Machine Haul",
    description: "Buy something from a Japanese vending machine and photograph your purchase. Bonus points for the weirdest item.",
    points: 100, status: "available", hasHint: false, order: 4,
  },
  {
    id: "5", type: "location", title: "Senso-ji Temple",
    description: "Check in at the entrance of Senso-ji in Asakusa. The giant red lantern gate counts as arriving.",
    points: 125, status: "available", hasHint: false, timeLimit: "Before 12:00 PM", order: 5,
  },
  {
    id: "6", type: "text", title: "Noodle Off",
    description: "Order ramen somewhere and describe it in exactly 10 words. Points for accuracy and creativity.",
    points: 80, status: "locked", hasHint: false, order: 6,
  },
  {
    id: "7", type: "qr", title: "Secret Meetup",
    description: "Find the QR code hidden at the hotel lobby and scan it for your next clue.",
    points: 200, status: "locked",
    hasHint: true, hintText: "Check near the front desk — it's not behind the counter.",
    order: 7,
  },
  {
    id: "8", type: "photo", title: "Cherry Blossom Picnic",
    description: "Photograph a picnic under cherry blossom trees — yours or a stranger's (ask first).",
    points: 125, status: "locked", hasHint: false, order: 8,
  },
  {
    id: "9", type: "trivia", title: "Train System Master",
    description: "What is the name of Tokyo's busiest train station by passenger count?",
    points: 75, status: "locked", hasHint: false, order: 9,
  },
  {
    id: "10", type: "location", title: "TeamLab Check-in",
    description: "Check in at the entrance of teamLab Planets. The digital water walk is worth it.",
    points: 150, status: "locked", hasHint: false, timeLimit: "Before 8:00 PM", order: 10,
  },
];

const MOCK_LEADERBOARD: Participant[] = [
  { name: "Emma",  initials: "E", color: "#00A8CC", points: 325, completed: 3, rank: 1, isMe: false },
  { name: "You",   initials: "N", color: "#FF2D8B", points: 275, completed: 2, rank: 2, isMe: true },
  { name: "Sarah", initials: "S", color: "#FFD600", points: 250, completed: 2, rank: 3, isMe: false },
  { name: "Mike",  initials: "M", color: "#00C96B", points: 175, completed: 1, rank: 4, isMe: false },
  { name: "Tom",   initials: "T", color: "#A855F7", points: 100, completed: 1, rank: 5, isMe: false },
];

const totalChallenges = MOCK_CHALLENGES.length;
const completedCount = MOCK_CHALLENGES.filter((c) => c.status === "completed").length;
const totalPts = MOCK_CHALLENGES.reduce((sum, c) => sum + c.points, 0);
const MY_POINTS = 275;
const MY_RANK = 2;

const RANK_COLOR: Record<number, string> = { 1: "#FFD600", 2: "#D1D5DB", 3: "#CD7F32" };

export default function ScavengerHuntShell() {
  const [tab, setTab] = useState<TabView>("challenges");
  const [hintOpen, setHintOpen] = useState<string | null>(null);

  return (
    <div style={{ backgroundColor: "#1e1e1e", minHeight: "100vh", color: "white" }}>
      <style>{`
        .sh-action-btn:hover  { transform: translateY(2px); }
        .sh-action-btn:active { transform: translateY(4px); box-shadow: none !important; }
        .sh-hint-btn:hover    { opacity: 0.8; }
        @media (max-width: 640px) {
          .sh-grid { grid-template-columns: 1fr !important; }
          .sh-stats { grid-template-columns: 1fr 1fr !important; }
          .sh-header { flex-direction: column; align-items: flex-start !important; gap: 12px; }
        }
      `}</style>

      {/* Page header */}
      <div style={{ backgroundColor: "#282828", borderBottom: "1px solid #3a3a3a", padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }} className="sh-header">
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-fredoka)", color: "white", lineHeight: 1 }}>
            Scavenger Hunt
          </h1>
          <p style={{ color: "#9CA3AF", marginTop: "6px", fontSize: "0.88rem" }}>
            Japan Spring 2025 Hunt &nbsp;·&nbsp; Individual mode &nbsp;·&nbsp; {totalChallenges} challenges &nbsp;·&nbsp; {totalPts} pts total
          </p>
        </div>
        <button
          className="sh-action-btn"
          style={{
            backgroundColor: "#FF8C00",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "10px 18px",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            boxShadow: "0 4px 0 #C06A00",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "transform 0.1s ease",
          }}
        >
          <Plus size={16} weight="bold" />
          Create Hunt
        </button>
      </div>

      <div style={{ padding: "24px 32px" }}>

        {/* Stats row */}
        <div className="sh-stats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div style={{ backgroundColor: "#2e2e2e", borderRadius: "12px", padding: "16px 20px", border: "1px solid #3a3a3a", textAlign: "center" }}>
            <div style={{ fontSize: "2.2rem", fontWeight: 700, fontFamily: "var(--font-fredoka)", color: "#00C96B", lineHeight: 1 }}>
              {completedCount}<span style={{ fontSize: "1.2rem", color: "#6B7280" }}>/{totalChallenges}</span>
            </div>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>YOUR PROGRESS</div>
          </div>
          <div style={{ backgroundColor: "#2e2e2e", borderRadius: "12px", padding: "16px 20px", border: "1px solid #3a3a3a", textAlign: "center" }}>
            <div style={{ fontSize: "2.2rem", fontWeight: 700, fontFamily: "var(--font-fredoka)", color: "#FF2D8B", lineHeight: 1 }}>{MY_POINTS}</div>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>YOUR POINTS</div>
          </div>
          <div style={{ backgroundColor: "#2e2e2e", borderRadius: "12px", padding: "16px 20px", border: "1px solid #3a3a3a", textAlign: "center" }}>
            <div style={{ fontSize: "2.2rem", fontWeight: 700, fontFamily: "var(--font-fredoka)", color: "#FFD600", lineHeight: 1 }}>
              #{MY_RANK}<span style={{ fontSize: "1rem", color: "#6B7280" }}> of {MOCK_LEADERBOARD.length}</span>
            </div>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>YOUR RANK</div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {(["challenges", "leaderboard"] as TabView[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
                backgroundColor: tab === t ? "#FF8C00" : "#2e2e2e",
                color: tab === t ? "white" : "#9CA3AF",
              }}
            >
              {t === "challenges" ? `Challenges (${totalChallenges})` : "Leaderboard"}
            </button>
          ))}
        </div>

        {/* ── Challenges tab ── */}
        {tab === "challenges" && (
          <>
            {/* Progress bar */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.82rem", color: "#9CA3AF", fontWeight: 500 }}>
                  {completedCount} of {totalChallenges} challenges completed
                </span>
                <span style={{ fontSize: "0.82rem", color: "#00C96B", fontWeight: 600 }}>
                  {Math.round((completedCount / totalChallenges) * 100)}%
                </span>
              </div>
              <div style={{ height: "6px", backgroundColor: "#3a3a3a", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(completedCount / totalChallenges) * 100}%`, backgroundColor: "#00C96B", borderRadius: "3px", transition: "width 0.4s ease" }} />
              </div>
            </div>

            {/* Challenges grid */}
            <div className="sh-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {MOCK_CHALLENGES.map((challenge) => {
                const meta = TYPE_META[challenge.type];
                const TypeIcon = meta.Icon;
                const isLocked = challenge.status === "locked";
                const isCompleted = challenge.status === "completed";

                return (
                  <div
                    key={challenge.id}
                    style={{
                      backgroundColor: "#2e2e2e",
                      borderRadius: "12px",
                      border: "1px solid #3a3a3a",
                      borderLeft: `3px solid ${isLocked ? "#3a3a3a" : isCompleted ? "#00C96B" : meta.color}`,
                      padding: "16px",
                      opacity: isLocked ? 0.55 : 1,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Completed tint */}
                    {isCompleted && (
                      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,201,107,0.04)", pointerEvents: "none" }} />
                    )}

                    {/* Top row: type badge + point/time badges */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", backgroundColor: isLocked ? "#333" : meta.bg, padding: "3px 8px", borderRadius: "6px" }}>
                        <TypeIcon size={12} weight="fill" style={{ color: isLocked ? "#6B7280" : meta.color }} />
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: isLocked ? "#6B7280" : meta.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          {meta.label}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {challenge.timeLimit && !isCompleted && (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(255,140,0,0.12)", padding: "3px 8px", borderRadius: "6px" }}>
                            <Clock size={11} weight="fill" style={{ color: "#FF8C00" }} />
                            <span style={{ fontSize: "0.63rem", fontWeight: 600, color: "#FF8C00" }}>{challenge.timeLimit}</span>
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: "3px", backgroundColor: "rgba(255,214,0,0.12)", padding: "3px 8px", borderRadius: "6px" }}>
                          <Star size={11} weight="fill" style={{ color: "#FFD600" }} />
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#FFD600" }}>{challenge.points}</span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: isLocked ? "#6B7280" : "white", marginBottom: "6px", lineHeight: 1.3 }}>
                      {isLocked && <Lock size={12} weight="fill" style={{ display: "inline", marginRight: "5px", verticalAlign: "middle" }} />}
                      {challenge.title}
                    </h3>

                    {/* Description */}
                    <p style={{ fontSize: "0.8rem", color: isLocked ? "#4B5563" : "#9CA3AF", lineHeight: 1.4, marginBottom: "12px", fontStyle: isLocked ? "italic" : "normal" }}>
                      {isLocked ? "Complete the previous challenge to unlock this one." : challenge.description}
                    </p>

                    {/* Bottom row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        {isCompleted && (
                          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <CheckCircle size={14} weight="fill" style={{ color: "#00C96B" }} />
                            <span style={{ fontSize: "0.75rem", color: "#00C96B", fontWeight: 600 }}>
                              {challenge.completedBy} · {challenge.completedAt}
                            </span>
                          </div>
                        )}
                        {!isCompleted && !isLocked && challenge.hasHint && (
                          <button
                            className="sh-hint-btn"
                            onClick={() => setHintOpen(hintOpen === challenge.id ? null : challenge.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", color: "#FFD600", fontSize: "0.75rem", fontWeight: 600, padding: 0, transition: "opacity 0.15s" }}
                          >
                            <Lightbulb size={13} weight="fill" />
                            Hint (-10 pts)
                          </button>
                        )}
                      </div>
                      {!isCompleted && !isLocked && (
                        <button
                          className="sh-action-btn"
                          style={{
                            backgroundColor: meta.color,
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "7px 12px",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            boxShadow: `0 3px 0 ${darken(meta.color)}`,
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            transition: "transform 0.1s ease",
                          }}
                        >
                          <TypeIcon size={12} weight="fill" />
                          {ACTION_LABEL[challenge.type]}
                          <ArrowRight size={11} weight="bold" />
                        </button>
                      )}
                    </div>

                    {/* Hint panel */}
                    {hintOpen === challenge.id && challenge.hintText && (
                      <div style={{ marginTop: "10px", padding: "10px 12px", backgroundColor: "rgba(255,214,0,0.07)", borderRadius: "8px", border: "1px solid rgba(255,214,0,0.2)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                          <Lightbulb size={12} weight="fill" style={{ color: "#FFD600" }} />
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#FFD600", textTransform: "uppercase", letterSpacing: "0.06em" }}>Hint</span>
                        </div>
                        <p style={{ fontSize: "0.78rem", color: "#D1D5DB", lineHeight: 1.4, margin: 0 }}>{challenge.hintText}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Leaderboard tab ── */}
        {tab === "leaderboard" && (
          <div style={{ maxWidth: "560px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {MOCK_LEADERBOARD.map((p) => {
                const rankColor = RANK_COLOR[p.rank] ?? "#6B7280";
                return (
                  <div
                    key={p.name}
                    style={{
                      backgroundColor: p.isMe ? "rgba(255,45,139,0.07)" : "#2e2e2e",
                      border: `1px solid ${p.isMe ? "rgba(255,45,139,0.25)" : "#3a3a3a"}`,
                      borderRadius: "12px",
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                    }}
                  >
                    {/* Rank */}
                    <div style={{ width: "28px", textAlign: "center", flexShrink: 0 }}>
                      {p.rank <= 3 ? (
                        <Trophy size={22} weight="fill" style={{ color: rankColor }} />
                      ) : (
                        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#6B7280" }}>#{p.rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: p.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "white" }}>{p.initials}</span>
                    </div>

                    {/* Name + completions */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: p.isMe ? "#FF2D8B" : "white", display: "flex", alignItems: "center", gap: "6px" }}>
                        {p.name}
                        {p.isMe && <span style={{ fontSize: "0.7rem", color: "#FF2D8B", fontWeight: 600 }}>(you)</span>}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "1px" }}>
                        {p.completed} of {totalChallenges} completed
                      </div>
                    </div>

                    {/* Points */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.3rem", fontWeight: 700, fontFamily: "var(--font-fredoka)", color: rankColor }}>{p.points}</div>
                      <div style={{ fontSize: "0.62rem", color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>pts</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
