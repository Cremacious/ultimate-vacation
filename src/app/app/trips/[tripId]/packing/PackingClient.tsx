"use client";

import { useActionState } from "react";
import { Trash } from "@phosphor-icons/react";

import type { PackingItem } from "@/lib/packing/queries";
import type { PackingFormState } from "./actions";

interface Props {
  items: PackingItem[];
  addAction: (_prev: PackingFormState, formData: FormData) => Promise<PackingFormState>;
  toggleAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}

export default function PackingClient({ items, addAction, toggleAction, deleteAction }: Props) {
  const [addState, formAction, pending] = useActionState(addAction, {});

  const packed = items.filter((i) => i.isPacked).length;
  const total = items.length;

  return (
    <div className="space-y-5">
      {/* Add form */}
      <form action={formAction} className="flex gap-2">
        <input
          type="text"
          name="text"
          placeholder="Add an item…"
          required
          maxLength={200}
          className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium bg-[#15162A] border border-[#2A2B45] text-white placeholder:text-white/30 focus:outline-none focus:border-[#00E5FF] transition-colors"
        />
        <button
          type="submit"
          disabled={pending}
          className="font-bold rounded-full px-5 py-2.5 text-sm hover:brightness-110 transition disabled:opacity-50 flex-shrink-0"
          style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
        >
          {pending ? "Adding…" : "Add"}
        </button>
      </form>

      {addState.error && (
        <p role="alert" className="text-sm font-semibold" style={{ color: "#FF3DA7" }}>
          {addState.error}
        </p>
      )}

      {/* Summary */}
      {total > 0 && (
        <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
          {packed} of {total} packed
        </p>
      )}

      {/* List */}
      {total === 0 ? (
        <div
          className="rounded-2xl border border-[#2A2B45] px-6 py-14 text-center"
          style={{ backgroundColor: "#15162A" }}
        >
          <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
            Nothing here yet. Add the first thing to pack.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-[#2A2B45] px-4 py-3"
              style={{ backgroundColor: "#15162A" }}
            >
              {/* Toggle button */}
              <form action={toggleAction}>
                <input type="hidden" name="itemId" value={item.id} />
                <button
                  type="submit"
                  aria-label={item.isPacked ? `Unpack ${item.text}` : `Pack ${item.text}`}
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    borderColor: item.isPacked ? "#00E5FF" : "rgba(255,255,255,0.2)",
                    backgroundColor: item.isPacked ? "#00E5FF" : "transparent",
                  }}
                >
                  {item.isPacked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                      <path
                        d="M1 4l2.5 2.5L9 1"
                        stroke="#0A0A12"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </form>

              {/* Item text */}
              <span
                className="flex-1 text-sm font-medium"
                style={{
                  color: item.isPacked ? "rgba(255,255,255,0.3)" : "white",
                  textDecoration: item.isPacked ? "line-through" : "none",
                }}
              >
                {item.text}
              </span>

              {/* Delete button */}
              <form action={deleteAction}>
                <input type="hidden" name="itemId" value={item.id} />
                <button
                  type="submit"
                  aria-label={`Remove ${item.text}`}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/5"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  <Trash size={14} />
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
