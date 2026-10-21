"use client";

import { useActionState } from "react";
import { resetPassword } from "../(auth)/actions";

const initialState = { error: null as string | null };

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(
    resetPassword,
    initialState,
  );

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-sm rounded-3xl bg-surface p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-text">Choose a new password</h1>
        <p className="mb-6 text-sm text-muted">
          You&apos;ll stay signed in with your new password.
        </p>

        <form action={formAction} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text">New password</span>
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
            {pending ? "Saving…" : "Save password"}
          </button>
        </form>
      </div>
    </div>
  );
}
