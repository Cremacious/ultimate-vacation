"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export default function SignOutButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={className ?? "w-full text-sm font-bold text-gray-400 hover:text-[#FF2D8B] transition-colors py-3 disabled:opacity-60"}
    >
      {pending ? "Signing out…" : (children ?? "Sign out")}
    </button>
  );
}
