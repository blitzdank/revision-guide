"use client";

import { useActionState, useState } from "react";
import { Flag } from "lucide-react";
import { fileReport } from "@/lib/reports";

const REASONS = [
  { value: "wrong_answer", label: "Wrong answer" },
  { value: "typo", label: "Typo" },
  { value: "not_on_spec", label: "Not on my spec" },
  { value: "confusing", label: "Confusing" },
] as const;

const initialState = { error: null as string | null, success: false };

/** Small flag icon + dialog, dropped onto any note section, flashcard or
 * question (section 6.7). `itemType`/`itemId` identify what's being
 * reported, e.g. ("question", "english/literature/macbeth#mb8"). */
export function ReportMistakeButton({
  itemType,
  itemId,
  className,
}: {
  itemType: "note" | "flashcard" | "question";
  itemId: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const boundAction = fileReport.bind(null, itemType, itemId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1 text-xs text-muted ${className ?? ""}`}
      >
        <Flag size={13} aria-hidden /> Report a mistake
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 md:items-center">
          <div className="w-full max-w-sm rounded-3xl bg-surface p-6 shadow-lg">
            {state.success ? (
              <div className="flex flex-col gap-4 text-center">
                <p className="font-medium text-text">Thanks — reported.</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-pink px-4 py-2 text-sm font-semibold text-pink-strong"
                >
                  Close
                </button>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-text">Report a mistake</h2>

                <div className="flex flex-col gap-2">
                  {REASONS.map((r) => (
                    <label key={r.value} className="flex items-center gap-2 text-sm text-text">
                      <input type="radio" name="reason" value={r.value} required />
                      {r.label}
                    </label>
                  ))}
                </div>

                <textarea
                  name="comment"
                  placeholder="Add a comment (optional)"
                  rows={3}
                  className="rounded-xl border border-black/10 bg-bg px-4 py-3 text-sm text-text outline-none focus:border-pink-strong"
                />

                {state.error && <p className="text-sm text-wrong">{state.error}</p>}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-full border border-black/10 px-4 py-3 text-sm font-semibold text-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pending}
                    className="flex-1 rounded-full bg-pink px-4 py-3 text-sm font-semibold text-pink-strong disabled:opacity-60"
                  >
                    {pending ? "Sending…" : "Send"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
