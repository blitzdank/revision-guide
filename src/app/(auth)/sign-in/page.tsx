"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "../actions";

const initialState = { error: null as string | null };

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

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
          autoComplete="current-password"
          className="rounded-xl border border-black/10 bg-bg px-4 py-3 text-base text-text outline-none focus:border-pink-strong"
        />
      </label>

      {state.error && <p className="text-sm text-wrong">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-pink px-4 py-3 text-base font-semibold text-pink-strong disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <div className="mt-2 flex items-center justify-between text-sm">
        <Link href="/forgot-password" className="text-muted underline">
          Forgot password
        </Link>
        <Link href="/sign-up" className="text-muted underline">
          Have an invite code?
        </Link>
      </div>
    </form>
  );
}
