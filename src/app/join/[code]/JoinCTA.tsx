"use client";

import Link from "next/link";
import { useActionState } from "react";

import { acceptInviteAction, type AcceptInviteFormState } from "./actions";

type JoinCTAProps =
  | { variant: "accept"; code: string; tripId: string }
  | { variant: "unauth"; code: string; tripName: string }
  | { variant: "already_member"; tripId: string };

const initialState: AcceptInviteFormState = {};

export default function JoinCTA(props: JoinCTAProps) {
  if (props.variant === "accept") return <AcceptForm code={props.code} />;
  if (props.variant === "unauth") return <UnauthLinks code={props.code} tripName={props.tripName} />;
  return <AlreadyMember tripId={props.tripId} />;
}

function AcceptForm({ code }: { code: string }) {
  const [state, formAction, pending] = useActionState(acceptInviteAction, initialState);
  return (
    <form action={formAction}>
      <input type="hidden" name="code" value={code} />
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="w-full font-bold rounded-full py-3 text-sm hover:brightness-110 transition disabled:opacity-50"
        style={{ backgroundColor: "#00A8CC", color: "#171717", fontFamily: "var(--font-fredoka)", boxShadow: "0 3px 0 #007a99" }}
      >
        {pending ? "Joining…" : "Count me in"}
      </button>
      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-[#FF2D8B]/30 bg-[#FF2D8B]/10 px-4 py-3 text-sm font-semibold text-[#FF2D8B] text-center mt-3"
        >
          {state.error}
        </p>
      )}
    </form>
  );
}

function UnauthLinks({ code, tripName }: { code: string; tripName: string }) {
  const redirectTo = encodeURIComponent(`/join/${code}`);
  return (
    <div>
      <Link
        href={`/signup?redirectTo=${redirectTo}`}
        className="block w-full text-center font-bold rounded-full py-3 text-sm hover:brightness-110 transition"
        style={{ backgroundColor: "#00A8CC", color: "#171717", fontFamily: "var(--font-fredoka)", boxShadow: "0 3px 0 #007a99" }}
      >
        Create a free account
      </Link>
      <a
        href={`/login?redirectTo=${redirectTo}`}
        aria-label={`Sign in to join ${tripName}`}
        className="block w-full text-center py-3 mt-1 text-sm text-white/80 underline hover:text-white transition-colors"
        style={{ minHeight: "44px" }}
      >
        Already have an account? Sign in
      </a>
    </div>
  );
}

function AlreadyMember({ tripId }: { tripId: string }) {
  return (
    <Link
      href={`/app/trips/${tripId}`}
      className="block w-full text-center py-3 text-sm font-semibold hover:brightness-110 transition"
      style={{ color: "#00A8CC", fontFamily: "var(--font-fredoka)" }}
    >
      You&apos;re already in. Head to the trip.
    </Link>
  );
}
