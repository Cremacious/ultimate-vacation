"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";

import type { CreatePollState } from "./actions";

interface Props {
  tripId: string;
  action: (prev: CreatePollState, formData: FormData) => Promise<CreatePollState>;
}

export default function CreatePollForm({ action }: Props) {
  const [state, formAction, isPending] = useActionState<CreatePollState, FormData>(
    action,
    {},
  );
  const [optionCount, setOptionCount] = useState(2);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setOptionCount(2);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="rounded-2xl border border-[#2A2B45] bg-[#15162A] p-5">
      <h2
        className="text-base font-semibold text-white mb-4"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        New poll
      </h2>

      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-wide text-white/50 mb-1.5">
          Question
        </label>
        <input
          name="question"
          type="text"
          placeholder="Where should we eat on night 1?"
          maxLength={300}
          required
          className="w-full rounded-xl border border-[#2A2B45] bg-[#0A0A12] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00E5FF] transition-colors"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-wide text-white/50 mb-1.5">
          Options
        </label>
        <div className="flex flex-col gap-2">
          {Array.from({ length: optionCount }, (_, i) => (
            <input
              key={i}
              name="option"
              type="text"
              placeholder={`Option ${i + 1}`}
              maxLength={100}
              required
              className="w-full rounded-xl border border-[#2A2B45] bg-[#0A0A12] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00E5FF] transition-colors"
            />
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          {optionCount < 6 && (
            <button
              type="button"
              onClick={() => setOptionCount((c) => Math.min(c + 1, 6))}
              className="text-xs text-[#00E5FF] hover:brightness-110 transition-all"
            >
              + Add option
            </button>
          )}
          {optionCount > 2 && (
            <button
              type="button"
              onClick={() => setOptionCount((c) => Math.max(c - 1, 2))}
              className="text-xs text-white/30 hover:text-white/60 transition-all"
            >
              − Remove last
            </button>
          )}
        </div>
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
        {isPending ? "Creating…" : "Create poll"}
      </button>
    </form>
  );
}
