"use client";

import { useActionState, useEffect } from "react";
import { createCountdown, updateCountdown } from "./actions";
import { toDateInputValue, toTimeInputValue, type Countdown } from "@/lib/countdown";

const initialState = { error: null as string | null };

export function CountdownForm({
  countdown,
  onSaved,
  onCancel,
}: {
  /** Omit to create a new countdown; pass one to edit it. */
  countdown?: Countdown;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const action = countdown ? updateCountdown : createCountdown;
  const [state, formAction, pending] = useActionState(action, initialState);

  // useActionState resets its own `pending` flag once the action settles;
  // closing here (rather than inside the action) keeps the dialog open if
  // the action returned an error instead of succeeding.
  const succeeded = !pending && state.error === null && state !== initialState;
  useEffect(() => {
    if (succeeded) onSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [succeeded]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {countdown && <input type="hidden" name="id" value={countdown.id} />}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-text">Name</span>
        <input
          type="text"
          name="name"
          required
          placeholder="e.g. Maths mocks"
          defaultValue={countdown?.name}
          className="rounded-xl border border-black/10 bg-bg px-4 py-3 text-base text-text outline-none focus:border-pink-strong"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-sm font-medium text-text">Date</span>
          <input
            type="date"
            name="date"
            required
            defaultValue={countdown ? toDateInputValue(countdown.exam_at) : undefined}
            className="rounded-xl border border-black/10 bg-bg px-4 py-3 text-base text-text outline-none focus:border-pink-strong"
          />
        </label>

        <label className="flex flex-1 flex-col gap-1">
          <span className="text-sm font-medium text-text">Time (optional)</span>
          <input
            type="time"
            name="time"
            defaultValue={
              countdown && !countdown.all_day ? toTimeInputValue(countdown.exam_at) : undefined
            }
            className="rounded-xl border border-black/10 bg-bg px-4 py-3 text-base text-text outline-none focus:border-pink-strong"
          />
        </label>
      </div>

      {state.error && <p className="text-sm text-wrong">{state.error}</p>}

      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-full border border-black/10 px-4 py-3 text-base font-semibold text-text"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded-full bg-pink px-4 py-3 text-base font-semibold text-pink-strong disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
