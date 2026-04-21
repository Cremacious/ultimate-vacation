"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { authClient } from "@/lib/auth-client";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/app";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const { error } = await authClient.signUp.email({ email, password, name });
    if (error) {
      setError(error.message ?? "Sign up failed.");
      setPending(false);
      return;
    }
    // autoSignIn: true on the server means the session cookie is already set.
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">Name</label>
        <input
          type="text"
          required
          autoComplete="name"
          minLength={1}
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-[#F8F8FA] text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-[#00A8CC] transition-colors text-sm font-medium"
        />
      </div>

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

      <div>
        <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">Password</label>
        <input
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
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
        {pending ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}

export default function SignupPage() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h1
        className="text-3xl font-semibold text-[#1A1A1A] mb-1"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        Let&apos;s go.
      </h1>
      <p className="text-gray-400 text-sm mb-8">Free to start. No credit card needed.</p>

      <Suspense fallback={<div className="h-60" />}>
        <SignupForm />
      </Suspense>

      <p className="text-center text-sm text-gray-400 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#1A1A1A] hover:text-[#00A8CC] transition-colors">
          Log in
        </Link>
      </p>
    </div>
  );
}
