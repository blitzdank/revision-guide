"use client";

import { useActionState } from "react";
import { createInvite } from "./actions";

const initialState = { error: null as string | null };

export function CreateInviteForm() {
  const [state, formAction, pending] = useActionState(createInvite, initialState);

  return (
    <form action={formAction} className="flex items-center gap-3">
      <select
        name="grantsRole"
        defaultValue="student"
        className="rounded-xl border border-black/10 bg-bg px-3 py-2 text-sm text-text"
      >
        <option value="student">Student invite</option>
        <option value="admin">Admin invite</option>
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-pink px-4 py-2 text-sm font-semibold text-pink-strong disabled:opacity-60"
      >
        {pending ? "Generating…" : "New invite code"}
      </button>
      {state.error && <span className="text-sm text-wrong">{state.error}</span>}
    </form>
  );
}
