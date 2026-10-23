"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { askTutorAction } from "@/lib/ai/actions";
import type { TutorMessage } from "@/lib/ai/tutor";

/**
 * The AI tutor entry point (section 6.8): "Explain this", "Get feedback",
 * "Help with this question". Only rendered by callers when isAiEnabled()
 * is true server-side — this component doesn't re-check that itself.
 */
export function TutorPanel({
  triggerLabel,
  context,
  initialPrompt,
  photoPath,
  triggerClassName,
}: {
  triggerLabel: string;
  context: string;
  initialPrompt: string;
  photoPath?: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");

  async function send(text: string) {
    const next: TutorMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    setError(null);

    const result = await askTutorAction(context, next, photoPath);

    setLoading(false);
    if (result.ok) {
      setMessages([...next, { role: "assistant", content: result.reply }]);
    } else {
      setError(result.error);
    }
  }

  function handleOpen() {
    setOpen(true);
    if (!started) {
      setStarted(true);
      send(initialPrompt);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={
          triggerClassName ??
          "inline-flex items-center gap-1.5 rounded-full bg-pink/20 px-3 py-1.5 text-sm font-semibold text-pink-strong"
        }
      >
        <Sparkles size={14} aria-hidden /> {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 md:items-center">
          <div className="flex max-h-[80vh] w-full max-w-sm flex-col rounded-3xl bg-surface p-5 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold text-muted">
                <Sparkles size={14} aria-hidden /> AI tutor
              </h2>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted">
                Close
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {/* The very first message is the auto-sent initial prompt
                  (e.g. "Explain this mistake") — not shown, since the
                  opening AI reply covers it. */}
              {messages.slice(1).map((m, i) =>
                m.role === "assistant" ? (
                  <p key={i} className="rounded-2xl bg-bg p-3 text-sm leading-relaxed text-text">
                    {m.content}
                  </p>
                ) : (
                  <p key={i} className="ml-auto max-w-[85%] rounded-2xl bg-pink/25 p-3 text-sm text-text">
                    {m.content}
                  </p>
                ),
              )}
              {loading && <p className="text-sm text-muted">Thinking…</p>}
              {error && <p className="text-sm text-wrong">{error}</p>}
            </div>

            <p className="mt-3 text-xs text-muted">
              Any mark or grade mentioned is an estimate, not a guarantee.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!input.trim()) return;
                send(input);
                setInput("");
              }}
              className="mt-2 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a follow-up…"
                disabled={loading}
                className="flex-1 rounded-full border border-black/10 bg-bg px-4 py-2 text-sm text-text outline-none focus:border-pink-strong"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-full bg-pink px-4 py-2 text-sm font-semibold text-pink-strong disabled:opacity-60"
              >
                Ask
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
