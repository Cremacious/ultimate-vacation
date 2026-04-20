"use client";

import { useActionState, useMemo } from "react";

import { createInviteAction, type CreateInviteFormState } from "./actions";

type ActiveInvite = {
  id: string;
  code: string;
  expiresAt: Date | null;
  maxUses: number | null;
  usedCount: number;
};

const initialState: CreateInviteFormState = {};

export default function InviteClient({
  tripId,
  existing,
}: {
  tripId: string;
  existing: ActiveInvite[];
}) {
  const [state, formAction, pending] = useActionState(createInviteAction, initialState);

  const baseUrl = typeof window === "undefined" ? "" : window.location.origin;
  const newLink = useMemo(
    () => (state.createdCode ? `${baseUrl}/join/${state.createdCode}` : null),
    [state.createdCode, baseUrl]
  );

  return (
    <>
      <form action={formAction} className="mb-8">
        <input type="hidden" name="tripId" value={tripId} />
        <button
          type="submit"
          disabled={pending}
          className="bg-[#00A8CC] text-white font-bold px-6 py-3 rounded-full hover:bg-[#0096b8] transition-colors disabled:opacity-60"
          style={{ boxShadow: "0 3px 0 #007a99" }}
        >
          {pending ? "Creating…" : "Create invite link"}
        </button>
        {state.error && (
          <p role="alert" className="mt-3 text-sm font-semibold text-[#D9304F]">
            {state.error}
          </p>
        )}
        {newLink && (
          <div className="mt-4 rounded-xl bg-[#1e2a2e] border border-[#00A8CC]/40 px-4 py-3">
            <p className="text-xs font-bold text-[#00A8CC] uppercase tracking-wide mb-1">
              New invite link
            </p>
            <code className="text-sm text-white break-all">{newLink}</code>
          </div>
        )}
      </form>

      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400 mb-3">
        Active invites
      </h2>
      {existing.length === 0 ? (
        <p className="text-sm text-gray-500">No active invites yet.</p>
      ) : (
        <ul className="space-y-2">
          {existing.map((inv) => (
            <li
              key={inv.id}
              className="rounded-xl bg-[#2a2a2a] border border-[#3a3a3a] px-4 py-3"
            >
              <code className="text-sm text-white break-all">
                {baseUrl}/join/{inv.code}
              </code>
              <p className="text-xs text-gray-500 mt-1">
                Uses: {inv.usedCount}
                {inv.maxUses !== null && ` / ${inv.maxUses}`}
                {inv.expiresAt && ` · expires ${new Date(inv.expiresAt).toLocaleDateString()}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
