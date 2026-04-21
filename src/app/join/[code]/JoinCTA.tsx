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
        style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
      >
        {pending ? "Joining…" : "Accept and join"}
      </button>
      {state.error && (
        <p role="alert" className="text-red-400 text-sm text-center mt-2">
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
        style={{ backgroundColor: "#00E5FF", color: "#0A0A12" }}
      >
        Create a free account
      </Link>
      <a
        href={`/login?redirectTo=${redirectTo}`}
        aria-label={`Sign in to join ${tripName}`}
        className="block w-full text-center py-3 mt-1 text-sm underline hover:text-white transition-colors"
        style={{ color: "rgba(255,255,255,0.5)", minHeight: "44px" }}
      >
        I already have an account
      </a>
    </div>
  );
}

function AlreadyMember({ tripId }: { tripId: string }) {
  return (
    <Link
      href={`/app/trips/${tripId}`}
      className="block w-full text-center py-3 text-sm font-semibold hover:brightness-110 transition"
      style={{ color: "#00E5FF" }}
    >
      You&apos;re already in — head to the trip →
    </Link>
  );
}
