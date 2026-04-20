"use client";

import Link from "next/link";
import { useActionState } from "react";

import { createTripAction, type CreateTripFormState } from "./actions";

const initialState: CreateTripFormState = {};

export default function NewTripPage() {
  const [state, formAction, pending] = useActionState(createTripAction, initialState);

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="mb-8">
        <Link
          href="/app"
          className="text-sm font-semibold text-gray-400 hover:text-[#1A1A1A] transition-colors"
        >
          Back to trips
        </Link>
      </div>

      <h1
        className="text-4xl font-semibold text-[#1A1A1A] mb-2"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        New trip.
      </h1>
      <p className="text-gray-400 font-medium text-sm mb-8">
        Give it a name and we will handle the rest.
      </p>

      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-[#1A1A1A] mb-1.5">
            Trip name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={80}
            placeholder="e.g. Japan Spring 2025"
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-white text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-bold text-[#1A1A1A] mb-1.5">
              Start date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-white text-[#1A1A1A] focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-bold text-[#1A1A1A] mb-1.5">
              End date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-white text-[#1A1A1A] focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
            />
          </div>
        </div>

        {state.error && (
          <p
            role="alert"
            className="text-sm font-semibold text-[#D9304F] bg-[#FDECEF] rounded-xl px-4 py-3"
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-[#00A8CC] text-white font-bold py-3.5 rounded-full hover:bg-[#0096b8] transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ boxShadow: "0 3px 0 #007a99" }}
        >
          {pending ? "Creating…" : "Create trip"}
        </button>
      </form>
    </div>
  );
}
