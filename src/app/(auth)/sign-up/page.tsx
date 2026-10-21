"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "../actions";

const initialState = { error: null as string | null };

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-text">Invite code</span>
        <input
          type="text"
          name="inviteCode"
          required
          autoCapitalize="characters"
          className="rounded-xl border border-black/10 bg-bg px-4 py-3 text-base text-text outline-none focus:border-pink-strong"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-text">Your name</span>
        <input
          type="text"
          name="displayName"
          required
          autoComplete="name"
          className="rounded-xl border border-black/10 bg-bg px-4 py-3 text-base text-text outline-none focus:border-pink-strong"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-text">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="rounded-xl border border-black/10 bg-bg px-4 py-3 text-base text-text outline-none focus:border-pink-strong"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-text">Password</span>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="rounded-xl border border-black/10 bg-bg px-4 py-3 text-base text-text outline-none focus:border-pink-strong"
        />
      </label>

      {state.error && <p className="text-sm text-wrong">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-pink px-4 py-3 text-base font-semibold text-pink-strong disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>

      <Link href="/sign-in" className="mt-2 text-center text-sm text-muted underline">
        Already have an account? Sign in
      </Link>
    </form>
  );
}
