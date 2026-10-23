"use client";

import { useMemo, useState } from "react";
import type { MultipleChoiceQuestion, NumericQuestion, OrderingQuestion, ShortAnswerQuestion } from "@/lib/content/types";

/** Per-question-type answer inputs, shared between the quiz runner and the
 * Mistakes bank's "Retry" action. */

export function MultipleChoiceInput({
  question,
  onCheck,
}: {
  question: MultipleChoiceQuestion;
  onCheck: (answer: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-2xl bg-surface p-5 font-medium text-text shadow-sm">{question.prompt}</p>
      {question.options.map((option, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onCheck(i)}
          className="rounded-xl bg-surface p-4 text-left text-text shadow-sm active:bg-pink/20"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function ShortAnswerInput({
  question,
  onCheck,
}: {
  question: ShortAnswerQuestion;
  onCheck: (answer: string) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-2xl bg-surface p-5 font-medium text-text shadow-sm">{question.prompt}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="rounded-xl border border-black/10 bg-bg px-4 py-3 text-base text-text outline-none focus:border-pink-strong"
      />
      <button
        type="button"
        disabled={!value.trim()}
        onClick={() => onCheck(value)}
        className="rounded-full bg-pink px-4 py-3 text-base font-semibold text-pink-strong disabled:opacity-60"
      >
        Check answer
      </button>
    </div>
  );
}

export function NumericInput({
  question,
  onCheck,
}: {
  question: NumericQuestion;
  onCheck: (answer: number) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-2xl bg-surface p-5 font-medium text-text shadow-sm">{question.prompt}</p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 rounded-xl border border-black/10 bg-bg px-4 py-3 text-base text-text outline-none focus:border-pink-strong"
        />
        {question.unit && <span className="text-sm text-muted">{question.unit}</span>}
      </div>
      <button
        type="button"
        disabled={value === ""}
        onClick={() => onCheck(Number(value))}
        className="rounded-full bg-pink px-4 py-3 text-base font-semibold text-pink-strong disabled:opacity-60"
      >
        Check answer
      </button>
    </div>
  );
}

export function OrderingInput({
  question,
  onCheck,
}: {
  question: OrderingQuestion;
  onCheck: (answer: string[]) => void;
}) {
  // Shuffled once per question via useMemo's cache — intentional randomness
  // for display order, not re-run on every render.
  // eslint-disable-next-line react-hooks/purity
  const shuffled = useMemo(() => [...question.items].sort(() => Math.random() - 0.5), [question.items]);
  const [picked, setPicked] = useState<string[]>([]);
  const remaining = shuffled.filter((item) => !picked.includes(item));

  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-2xl bg-surface p-5 font-medium text-text shadow-sm">{question.prompt}</p>

      <div className="flex min-h-12 flex-col gap-2 rounded-xl border border-dashed border-black/15 p-2">
        {picked.length === 0 && <p className="p-2 text-sm text-muted">Tap items below in order</p>}
        {picked.map((item, i) => (
          <div key={item} className="rounded-lg bg-pink/20 px-3 py-2 text-sm text-text">
            {i + 1}. {item}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {remaining.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPicked((p) => [...p, item])}
            className="rounded-xl bg-surface p-3 text-left text-sm text-text shadow-sm"
          >
            {item}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={picked.length !== question.items.length}
        onClick={() => onCheck(picked)}
        className="rounded-full bg-pink px-4 py-3 text-base font-semibold text-pink-strong disabled:opacity-60"
      >
        Check order
      </button>
    </div>
  );
}
