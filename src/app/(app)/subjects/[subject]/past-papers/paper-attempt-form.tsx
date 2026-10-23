"use client";

import { useActionState, useState } from "react";
import { logPaperAttempt, type QuestionMark } from "./actions";

const initialState = { error: null as string | null };

export function PaperAttemptForm({
  subjectSlug,
  paperLabel,
  onDone,
}: {
  subjectSlug: string;
  paperLabel: string;
  onDone: () => void;
}) {
  const boundAction = logPaperAttempt.bind(null, subjectSlug, paperLabel);
  const [state, formAction, pending] = useActionState(boundAction, initialState);
  const [rows, setRows] = useState<QuestionMark[]>([{ label: "Q1", awarded: 0, max: 1 }]);

  function updateRow(i: number, patch: Partial<QuestionMark>) {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }

  const succeeded = !pending && state.error === null && state !== initialState;
  if (succeeded) onDone();

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-2xl bg-surface p-5 shadow-sm">
      <input type="hidden" name="rows" value={JSON.stringify(rows)} />

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-text">Year</span>
        <input
          type="number"
          name="year"
          required
          placeholder="e.g. 2024"
          className="w-32 rounded-xl border border-black/10 bg-bg px-4 py-2 text-base text-text outline-none focus:border-pink-strong"
        />
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-text">Marks per question</span>
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={row.label}
              onChange={(e) => updateRow(i, { label: e.target.value })}
              className="w-16 rounded-lg border border-black/10 bg-bg px-2 py-1.5 text-sm text-text"
            />
            <input
              type="number"
              min={0}
              value={row.awarded}
              onChange={(e) => updateRow(i, { awarded: Number(e.target.value) })}
              className="w-16 rounded-lg border border-black/10 bg-bg px-2 py-1.5 text-sm text-text"
            />
            <span className="text-sm text-muted">/</span>
            <input
              type="number"
              min={0}
              value={row.max}
              onChange={(e) => updateRow(i, { max: Number(e.target.value) })}
              className="w-16 rounded-lg border border-black/10 bg-bg px-2 py-1.5 text-sm text-text"
            />
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
                className="text-sm text-muted underline"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setRows((r) => [...r, { label: `Q${r.length + 1}`, awarded: 0, max: 1 }])}
          className="self-start text-sm text-pink-strong underline"
        >
          + Add question
        </button>
      </div>

      {state.error && <p className="text-sm text-wrong">{state.error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onDone}
          className="flex-1 rounded-full border border-black/10 px-4 py-3 text-sm font-semibold text-text"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded-full bg-pink px-4 py-3 text-sm font-semibold text-pink-strong disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
