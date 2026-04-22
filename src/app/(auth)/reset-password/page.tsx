"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { authClient } from "@/lib/auth-client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset token. Request a new link.");
      return;
    }
    setPending(true);
    const { error } = await authClient.resetPassword({ newPassword: password, token });
    setPending(false);
    if (error) {
      setError(error.message ?? "Something went wrong. Try requesting a new link.");
      return;
    }
    router.push("/login");
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">New password</label>
        <input
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-[#F8F8FA] text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">Confirm password</label>
        <input
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
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
        {pending ? "Saving…" : "Reset password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h1
        className="text-3xl font-semibold text-[#1A1A1A] mb-1"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Set a new password.
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        Make it something you&apos;ll actually remember this time.
      </p>

      <Suspense fallback={<div className="h-48" />}>
        <ResetPasswordForm />
      </Suspense>

      <p className="text-center text-sm text-gray-400 mt-6">
        <Link href="/login" className="font-bold text-[#1A1A1A] hover:text-[#00A8CC] transition-colors">
          Back to login
        </Link>
      </p>
    </div>
  );
}
