"use client";

import Link from "next/link";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });
    setPending(false);
    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.");
      return;
    }
    setDone(true);
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h1
        className="text-3xl font-semibold text-[#1A1A1A] mb-1"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Forgot your password?
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        Happens to the best travelers. Enter your email and we&apos;ll send a reset link.
      </p>

      {done ? (
        <div className="rounded-2xl bg-[#00A8CC]/10 border border-[#00A8CC]/30 px-5 py-4 mb-6">
          <p className="text-sm font-semibold text-[#00A8CC]">Check your email</p>
          <p className="text-sm text-gray-500 mt-1">
            If an account exists for <span className="font-semibold text-[#1A1A1A]">{email}</span>,
            you&apos;ll receive a reset link shortly.
          </p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-[#F8F8FA] text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm font-semibold text-[#D9304F]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-[#00A8CC] text-white font-bold py-3.5 rounded-full hover:bg-[#0096b8] transition-colors disabled:opacity-60"
            style={{ boxShadow: "0 3px 0 #007a99" }}
          >
            {pending ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-gray-400 mt-6">
        <Link href="/login" className="font-bold text-[#1A1A1A] hover:text-[#00A8CC] transition-colors">
          Back to login
        </Link>
      </p>
    </div>
  );
}
