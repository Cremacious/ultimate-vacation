"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";

import type { CreateProposalState } from "./actions";

interface Props {
  action: (prev: CreateProposalState, formData: FormData) => Promise<CreateProposalState>;
}

export default function CreateProposalForm({ action }: Props) {
  const [state, formAction, isPending] = useActionState<CreateProposalState, FormData>(
    action,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="rounded-2xl border border-[#2A2B45] bg-[#15162A] p-5">
      <h2
        className="text-base font-semibold text-white mb-4"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        New proposal
      </h2>

      <div className="mb-3">
        <label className="block text-xs font-bold uppercase tracking-wide text-white/50 mb-1.5">
          Title
        </label>
        <input
          name="title"
          type="text"
          placeholder="Sunset boat tour on day 3"
          maxLength={200}
          required
          className="w-full rounded-xl border border-[#2A2B45] bg-[#0A0A12] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00E5FF] transition-colors"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-wide text-white/50 mb-1.5">
          Description{" "}
          <span className="text-white/20 normal-case font-normal">optional</span>
        </label>
        <textarea
          name="description"
          placeholder="Add any details, links, or context..."
          maxLength={500}
          rows={3}
          className="w-full rounded-xl border border-[#2A2B45] bg-[#0A0A12] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00E5FF] transition-colors resize-none"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-xs text-[#FF3DA7] mb-3">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[#00E5FF] text-[#0A0A12] text-sm font-bold py-2.5 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Adding…" : "Add proposal"}
      </button>
    </form>
  );
}
