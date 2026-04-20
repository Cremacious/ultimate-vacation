"use client";

import { useActionState } from "react";

import { acceptInviteAction, type AcceptInviteFormState } from "./actions";

const initialState: AcceptInviteFormState = {};

export default function JoinClient({ code }: { code: string }) {
  const [state, formAction, pending] = useActionState(acceptInviteAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="code" value={code} />
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-[#00A8CC] text-white font-bold py-3.5 rounded-full hover:bg-[#0096b8] transition-colors disabled:opacity-60"
        style={{ boxShadow: "0 3px 0 #007a99" }}
      >
        {pending ? "Joining…" : "Accept and join"}
      </button>
      {state.error && (
        <p role="alert" className="text-sm font-semibold text-[#D9304F]">
          {state.error}
        </p>
      )}
    </form>
  );
}
