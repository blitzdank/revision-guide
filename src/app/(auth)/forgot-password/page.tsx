"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "../actions";

const initialState = { error: null as string | null, sent: false };

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  if (state.sent) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-text">
          If that email has an account, a reset link is on its way. Check your
          inbox (and spam folder).
        </p>
        <Link href="/sign-in" className="text-center text-sm text-muted underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        Enter your email and we&apos;ll send a link to reset your password.
      </p>

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

      {state.error && <p className="text-sm text-wrong">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-pink px-4 py-3 text-base font-semibold text-pink-strong disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>

      <Link href="/sign-in" className="mt-2 text-center text-sm text-muted underline">
        Back to sign in
      </Link>
    </form>
  );
}
