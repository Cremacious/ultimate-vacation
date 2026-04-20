"use client";

import { useState } from "react";
import {
  Copy, QrCode, Check, X, CaretDown, CaretUp,
  Crown, ShieldStar, User, Link as LinkIcon, Plus,
  UserMinus, Users, Clock,
} from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

type Role = "organizer" | "admin" | "participant";
type MemberStatus = "active" | "pending";

interface Permission { key: string; label: string; color: string; }
interface Member {
  id: string; name: string; initials: string; color: string;
  role: Role; status: MemberStatus; joinedDaysAgo?: number;
  permissions: Record<string, boolean>;
}

const PERMISSIONS: Permission[] = [
  { key: "addItinerary", label: "Add to itinerary",  color: "#00A8CC" },
  { key: "createPolls",  label: "Create polls",      color: "#A855F7" },
  { key: "inviteOthers", label: "Invite others",     color: "#FF2D8B" },
  { key: "viewPacking",  label: "View group packing",color: "#FFD600" },
  { key: "logExpenses",  label: "Log expenses",      color: "#00C96B" },
];

const ROLE_META: Record<Role, { label: string; color: string; bg: string; Icon: PhosphorIcon }> = {
  organizer:   { label: "Organizer",   color: "#FFD600", bg: "rgba(255,214,0,0.15)",   Icon: Crown      },
  admin:       { label: "Admin",       color: "#A855F7", bg: "rgba(168,85,247,0.15)",  Icon: ShieldStar },
  participant: { label: "Participant", color: "#9CA3AF", bg: "rgba(156,163,175,0.12)", Icon: User       },
};

const MOCK_MEMBERS: Member[] = [
  { id: "1", name: "Nick",  initials: "N", color: "#FF2D8B", role: "organizer",   status: "active",  joinedDaysAgo: 12, permissions: { addItinerary: true,  createPolls: true,  inviteOthers: true,  viewPacking: true, logExpenses: true  } },
  { id: "2", name: "Sarah", initials: "S", color: "#FFD600", role: "admin",       status: "active",  joinedDaysAgo: 11, permissions: { addItinerary: true,  createPolls: true,  inviteOthers: true,  viewPacking: true, logExpenses: true  } },
  { id: "3", name: "Emma",  initials: "E", color: "#00A8CC", role: "participant", status: "active",  joinedDaysAgo: 9,  permissions: { addItinerary: true,  createPolls: true,  inviteOthers: false, viewPacking: true, logExpenses: true  } },
  { id: "4", name: "Mike",  initials: "M", color: "#00C96B", role: "participant", status: "active",  joinedDaysAgo: 7,  permissions: { addItinerary: true,  createPolls: false, inviteOthers: false, viewPacking: true, logExpenses: true  } },
  { id: "5", name: "Tom",   initials: "T", color: "#A855F7", role: "participant", status: "pending",                    permissions: { addItinerary: true,  createPolls: true,  inviteOthers: true,  viewPacking: true, logExpenses: true  } },
];

const INVITE_LINK = "tripwave.app/join/jp25-xk9m3";

export default function MembersShell() {
  const [members, setMembers]         = useState<Member[]>(MOCK_MEMBERS);
  const [expandedId, setExpandedId]   = useState<string | null>(null);
  const [entryMode, setEntryMode]     = useState<"open" | "approval">("open");
  const [nonAdminInvite, setNonAdminInvite] = useState(true);
  const [copied, setCopied]           = useState(false);

  const activeMembers    = members.filter((m) => m.status === "active");
  const pendingMembers   = members.filter((m) => m.status === "pending");
  const organizerCount   = activeMembers.filter((m) => m.role === "organizer").length;
  const adminCount       = activeMembers.filter((m) => m.role === "admin").length;
  const participantCount = activeMembers.filter((m) => m.role === "participant").length;

  function toggleExpand(id: string) { setExpandedId(expandedId === id ? null : id); }

  function togglePermission(memberId: string, key: string) {
    setMembers((prev) => prev.map((m) =>
      m.id === memberId ? { ...m, permissions: { ...m.permissions, [key]: !m.permissions[key] } } : m
    ));
  }

  function handleApprove(memberId: string) {
    setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, status: "active", joinedDaysAgo: 0 } : m));
  }

  function handleDecline(memberId: string) {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

  function handleCopy() { setCopied(true); setTimeout(() => setCopied(false), 2000); }

  function handleRoleChange(memberId: string, role: Role) {
    setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, role } : m));
  }

  return (
    <div style={{ backgroundColor: "#404040", minHeight: "100vh", color: "white" }}>
      <style>{`
        .mb-member-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (max-width: 640px) { .mb-member-grid { grid-template-columns: 1fr; } }
        .mb-action-btn { transition: transform 0.08s ease, box-shadow 0.08s ease; }
        .mb-action-btn:hover  { transform: translateY(2px); }
        .mb-action-btn:active { transform: translateY(4px); box-shadow: none !important; }
        .mb-toggle { transition: background-color 0.2s, opacity 0.15s; }
        .mb-toggle:hover { opacity: 0.8; }
        .mb-card:hover { border-color: #555 !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ backgroundColor: "#282828", borderBottom: "1px solid #3a3a3a", padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-fredoka)", color: "white", lineHeight: 1 }}>Members</h1>
          <p style={{ color: "#9CA3AF", marginTop: "6px", fontSize: "0.88rem" }}>
            {activeMembers.length} members &nbsp;·&nbsp; Japan Spring 2025{pendingMembers.length > 0 ? ` · ${pendingMembers.length} pending` : ""}
          </p>
        </div>
        <button className="mb-action-btn" style={{ backgroundColor: "#FF2D8B", color: "white", border: "none", borderRadius: "10px", padding: "10px 18px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", boxShadow: "0 4px 0 #C0006A", display: "flex", alignItems: "center", gap: "6px" }}>
          <Plus size={16} weight="bold" /> Invite
        </button>
      </div>

      <div style={{ padding: "16px 24px" }}>

        {/* ── Invite + Pending combined card (TOP) ── */}
        <div style={{ backgroundColor: "#2e2e2e", borderRadius: "14px", border: "1px solid #3a3a3a", marginBottom: "10px", display: "flex", overflow: "hidden" }}>

          {/* Invite section */}
          <div style={{ flex: "1 1 0", padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "12px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "7px", backgroundColor: "rgba(0,168,204,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <LinkIcon size={13} weight="bold" style={{ color: "#00A8CC" }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "white" }}>Invite Link</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
              <div style={{ flex: 1, backgroundColor: "#1e1e1e", borderRadius: "8px", padding: "8px 12px", fontSize: "0.78rem", color: "#9CA3AF", fontFamily: "monospace", border: "1px solid #3a3a3a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {INVITE_LINK}
              </div>
              <button onClick={handleCopy} style={{ backgroundColor: copied ? "#00C96B" : "#00A8CC", color: "white", border: "none", borderRadius: "8px", padding: "8px 13px", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", flexShrink: 0, transition: "background-color 0.2s" }}>
                {copied ? <Check size={13} weight="bold" /> : <Copy size={13} weight="bold" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF", border: "none", borderRadius: "8px", padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0 }}>
                <QrCode size={15} weight="bold" />
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>Entry:</span>
                <div style={{ display: "flex", gap: "4px" }}>
                  {(["open", "approval"] as const).map((mode) => (
                    <button key={mode} onClick={() => setEntryMode(mode)} style={{ padding: "3px 10px", borderRadius: "5px", border: "none", cursor: "pointer", fontSize: "0.72rem", fontWeight: 600, backgroundColor: entryMode === mode ? "#00A8CC" : "#1e1e1e", color: entryMode === mode ? "white" : "#6B7280", transition: "background-color 0.2s" }}>
                      {mode === "open" ? "Open" : "Approval"}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>Anyone can share</span>
                <button className="mb-toggle" onClick={() => setNonAdminInvite((v) => !v)} style={{ width: "32px", height: "18px", borderRadius: "9px", border: "none", cursor: "pointer", backgroundColor: nonAdminInvite ? "#00A8CC" : "#3a3a3a", position: "relative" }}>
                  <div style={{ position: "absolute", top: "2px", left: nonAdminInvite ? "16px" : "2px", width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "white", transition: "left 0.15s" }} />
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: "1px", backgroundColor: "#3a3a3a", flexShrink: 0 }} />

          {/* Pending section */}
          <div style={{ flex: "0 0 280px", padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "12px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "7px", backgroundColor: pendingMembers.length > 0 ? "rgba(255,140,0,0.15)" : "#252525", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Clock size={13} weight="bold" style={{ color: pendingMembers.length > 0 ? "#FF8C00" : "#4B5563" }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "white" }}>
                Pending {pendingMembers.length > 0 && <span style={{ color: "#FF8C00" }}>({pendingMembers.length})</span>}
              </span>
            </div>
            {pendingMembers.length === 0 ? (
              <p style={{ fontSize: "0.8rem", color: "#4B5563", fontStyle: "italic", margin: 0 }}>No pending requests</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {pendingMembers.map((m) => (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "9px", backgroundColor: "#252525", borderRadius: "9px", padding: "8px 10px" }}>
                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: m.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "white" }}>{m.initials}</span>
                    </div>
                    <div style={{ flex: 1, fontSize: "0.83rem", fontWeight: 600, color: "white" }}>{m.name}</div>
                    <button onClick={() => handleApprove(m.id)} style={{ backgroundColor: "#00C96B", color: "white", border: "none", borderRadius: "6px", padding: "4px 10px", fontWeight: 700, fontSize: "0.72rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}>
                      <Check size={11} weight="bold" /> Accept
                    </button>
                    <button onClick={() => handleDecline(m.id)} style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF", border: "none", borderRadius: "6px", padding: "4px 7px", cursor: "pointer" }}>
                      <X size={12} weight="bold" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
          <div style={{ backgroundColor: "#2e2e2e", borderRadius: "12px", border: "1px solid #3a3a3a", padding: "16px 18px", textAlign: "center" }}>
            <div style={{ fontSize: "2.4rem", fontWeight: 700, fontFamily: "var(--font-fredoka)", color: "#00A8CC", lineHeight: 1 }}>{activeMembers.length}</div>
            <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>MEMBERS</div>
          </div>
          <div style={{ backgroundColor: "#2e2e2e", borderRadius: "12px", border: "1px solid #3a3a3a", padding: "16px 18px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {([["organizer", organizerCount, Crown, "#FFD600"], ["admin", adminCount, ShieldStar, "#A855F7"], ["participant", participantCount, Users, "#9CA3AF"]] as const).map(([label, count, Icon, color]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Icon size={12} weight="fill" style={{ color }} />
                    <span style={{ fontSize: "0.75rem", color: "#9CA3AF", textTransform: "capitalize" }}>{label}</span>
                  </div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ backgroundColor: "#2e2e2e", borderRadius: "12px", border: "1px solid #3a3a3a", padding: "16px 18px", textAlign: "center" }}>
            <div style={{ fontSize: "2.4rem", fontWeight: 700, fontFamily: "var(--font-fredoka)", color: pendingMembers.length > 0 ? "#FF8C00" : "#3a3a3a", lineHeight: 1 }}>{pendingMembers.length}</div>
            <div style={{ fontSize: "0.68rem", fontWeight: 600, color: pendingMembers.length > 0 ? "#FF8C00" : "#3a3a3a", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>PENDING</div>
          </div>
        </div>

        {/* ── Member grid ── */}
        <div className="mb-member-grid">
          {activeMembers.map((m) => {
            const roleMeta = ROLE_META[m.role];
            const RoleIcon = roleMeta.Icon;
            const isExpanded = expandedId === m.id;
            const isOrganizer = m.role === "organizer";
            return (
              <div key={m.id} className="mb-card" style={{ backgroundColor: "#2e2e2e", borderRadius: "14px", border: "1px solid #3a3a3a", overflow: "hidden", transition: "border-color 0.15s" }}>
                <div style={{ height: "4px", backgroundColor: roleMeta.color, opacity: 0.7 }} />
                <div style={{ padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: m.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "1rem", fontWeight: 700, color: "white" }}>{m.initials}</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "white" }}>{m.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "3px", backgroundColor: roleMeta.bg, padding: "2px 7px", borderRadius: "5px", width: "fit-content" }}>
                          <RoleIcon size={11} weight="fill" style={{ color: roleMeta.color }} />
                          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: roleMeta.color }}>{roleMeta.label}</span>
                        </div>
                      </div>
                    </div>
                    {!isOrganizer && (
                      <button style={{ backgroundColor: "#3a3a3a", color: "#6B7280", border: "none", borderRadius: "7px", padding: "5px 7px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <UserMinus size={13} weight="bold" />
                      </button>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
                    {PERMISSIONS.map((p) => (
                      <div key={p.key} title={p.label} style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: m.permissions[p.key] ? p.color : "#3a3a3a" }} />
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>
                      {m.joinedDaysAgo === 0 ? "Just joined" : `${m.joinedDaysAgo}d ago`}
                    </span>
                    {!isOrganizer && (
                      <button onClick={() => toggleExpand(m.id)} style={{ backgroundColor: "#3a3a3a", color: "#9CA3AF", border: "none", borderRadius: "7px", padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", fontWeight: 600 }}>
                        Edit {isExpanded ? <CaretUp size={10} weight="bold" /> : <CaretDown size={10} weight="bold" />}
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ borderTop: "1px solid #3a3a3a", padding: "14px 16px", backgroundColor: "#252525" }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "7px" }}>Role</div>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
                      {(["participant", "admin"] as Role[]).map((r) => {
                        const rm = ROLE_META[r];
                        const RI = rm.Icon;
                        return (
                          <button key={r} onClick={() => handleRoleChange(m.id, r)} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "6px", border: `1px solid ${m.role === r ? rm.color : "#3a3a3a"}`, backgroundColor: m.role === r ? rm.bg : "transparent", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, color: m.role === r ? rm.color : "#6B7280" }}>
                            <RI size={11} weight="fill" style={{ color: m.role === r ? rm.color : "#6B7280" }} />
                            {rm.label}
                          </button>
                        );
                      })}
                    </div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>Permissions</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                      {PERMISSIONS.map((p) => (
                        <div key={p.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: m.permissions[p.key] ? p.color : "#3a3a3a" }} />
                            <span style={{ fontSize: "0.8rem", color: "#D1D5DB" }}>{p.label}</span>
                          </div>
                          <button className="mb-toggle" onClick={() => togglePermission(m.id, p.key)} style={{ width: "34px", height: "19px", borderRadius: "10px", border: "none", cursor: "pointer", backgroundColor: m.permissions[p.key] ? p.color : "#3a3a3a", position: "relative", flexShrink: 0 }}>
                            <div style={{ position: "absolute", top: "2px", left: m.permissions[p.key] ? "17px" : "2px", width: "15px", height: "15px", borderRadius: "50%", backgroundColor: "white", transition: "left 0.15s" }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
