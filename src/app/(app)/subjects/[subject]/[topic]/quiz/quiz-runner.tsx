"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import type {
  QuizQuestion,
  ExtendedQuestion,
  MultipleChoiceQuestion,
  NumericQuestion,
  OrderingQuestion,
  ShortAnswerQuestion,
} from "@/lib/content/types";
import { scoreExtended, scoreQuestion, type QuestionResult } from "@/lib/quiz";
import { submitQuizResults } from "./actions";

export function QuizRunner({
  subjectSlug,
  topicSlug,
  topicScope,
  questions,
}: {
  subjectSlug: string;
  topicSlug: string;
  topicScope: string;
  questions: QuizQuestion[];
}) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [, startTransition] = useTransition();

  const question = questions[index];

  function handleResult(result: QuestionResult) {
    const next = [...results, result];
    setResults(next);
    if (index === questions.length - 1) {
      startTransition(() => {
        submitQuizResults(subjectSlug, topicScope, next);
      });
      setSubmitted(true);
    }
  }

  if (submitted) {
    return <QuizResults subjectSlug={subjectSlug} topicSlug={topicSlug} results={results} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        Question {index + 1} of {questions.length} · {question.marks} mark{question.marks === 1 ? "" : "s"}
      </p>
      <QuestionCard
        key={question.id}
        question={question}
        onNext={() => setIndex((i) => i + 1)}
        onAnswered={handleResult}
      />
    </div>
  );
}

function QuestionCard({
  question,
  onNext,
  onAnswered,
}: {
  question: QuizQuestion;
  onNext: () => void;
  onAnswered: (result: QuestionResult) => void;
}) {
  const [result, setResult] = useState<QuestionResult | null>(null);

  function check(answer: Parameters<typeof scoreQuestion>[1]) {
    const r = scoreQuestion(question, answer);
    setResult(r);
    onAnswered(r);
  }

  if (result) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-surface p-5 shadow-sm">
          <p className="mb-3 font-medium text-text">{question.prompt}</p>
          <p className={`mb-2 font-semibold ${result.correct ? "text-correct" : "text-wrong"}`}>
            {result.correct ? "Correct" : "Not quite"} · {result.marksAwarded}/{result.marks} marks
          </p>
          {"explanation" in question && <p className="text-sm text-muted">{question.explanation}</p>}
          {"workedSolution" in question && (
            <p className="text-sm text-muted">{(question as NumericQuestion).workedSolution}</p>
          )}
          {question.type === "ordering" && (
            <p className="text-sm text-muted">Correct order: {question.items.join(" → ")}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onNext}
          className="rounded-full bg-pink px-4 py-3 text-base font-semibold text-pink-strong"
        >
          Next
        </button>
      </div>
    );
  }

  switch (question.type) {
    case "multiple_choice":
      return <MultipleChoiceInput question={question} onCheck={check} />;
    case "short_answer":
      return <ShortAnswerInput question={question} onCheck={check} />;
    case "numeric":
      return <NumericInput question={question} onCheck={check} />;
    case "ordering":
      return <OrderingInput question={question} onCheck={check} />;
    case "extended":
      return <ExtendedInput question={question} onAnswered={onAnswered} setResult={setResult} />;
  }
}

function MultipleChoiceInput({
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

function ShortAnswerInput({
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

function NumericInput({
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

function OrderingInput({
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

function ExtendedInput({
  question,
  onAnswered,
  setResult,
}: {
  question: ExtendedQuestion;
  onAnswered: (result: QuestionResult) => void;
  setResult: (r: QuestionResult) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [mark, setMark] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-2xl bg-surface p-5 font-medium text-text shadow-sm">{question.prompt}</p>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={8}
        placeholder="Write your answer here..."
        className="rounded-xl border border-black/10 bg-bg px-4 py-3 text-base text-text outline-none focus:border-pink-strong"
      />

      {!revealed ? (
        <button
          type="button"
          disabled={!answer.trim()}
          onClick={() => setRevealed(true)}
          className="rounded-full bg-pink px-4 py-3 text-base font-semibold text-pink-strong disabled:opacity-60"
        >
          I&apos;m done — show me what a good answer covers
        </button>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl bg-surface p-5 shadow-sm">
          <div>
            <p className="mb-2 text-sm font-semibold text-muted">A strong answer would cover:</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-text">
              {question.indicativeContent.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-muted">Mark bands:</p>
            <div className="flex flex-col gap-2">
              {question.levelDescriptors.map((level) => (
                <div key={level.level} className="rounded-lg bg-bg p-3 text-sm">
                  <span className="font-semibold text-text">
                    Level {level.level} ({level.marksRange} marks):
                  </span>{" "}
                  <span className="text-muted">{level.description}</span>
                </div>
              ))}
            </div>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text">
              Your mark (out of {question.marks})
            </span>
            <input
              type="number"
              min={0}
              max={question.marks}
              value={mark}
              onChange={(e) => setMark(e.target.value)}
              className="rounded-xl border border-black/10 bg-bg px-4 py-3 text-base text-text outline-none focus:border-pink-strong"
            />
          </label>
          <button
            type="button"
            disabled={mark === ""}
            onClick={() => {
              const marksAwarded = Math.max(0, Math.min(question.marks, Number(mark)));
              const result = scoreExtended(question, marksAwarded, answer);
              setResult(result);
              onAnswered(result);
            }}
            className="rounded-full bg-pink px-4 py-3 text-base font-semibold text-pink-strong disabled:opacity-60"
          >
            Save my mark
          </button>
        </div>
      )}
    </div>
  );
}

function QuizResults({
  subjectSlug,
  topicSlug,
  results,
}: {
  subjectSlug: string;
  topicSlug: string;
  results: QuestionResult[];
}) {
  const score = results.reduce((s, r) => s + r.marksAwarded, 0);
  const total = results.reduce((s, r) => s + r.marks, 0);
  const wrongCount = results.filter((r) => !r.correct).length;

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface p-8 text-center shadow-sm">
      <p className="text-sm text-muted">Quiz complete</p>
      <p className="text-3xl font-bold text-text">
        {score}/{total}
      </p>
      {wrongCount > 0 ? (
        <p className="text-sm text-muted">
          {wrongCount} question{wrongCount === 1 ? "" : "s"} went to your mistakes bank.
        </p>
      ) : (
        <p className="text-sm text-correct">Perfect score — nothing went to the mistakes bank.</p>
      )}
      <div className="flex gap-3">
        <Link
          href={`/subjects/${subjectSlug}/${topicSlug}`}
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-text"
        >
          Back to topic
        </Link>
        <Link
          href="/mistakes"
          className="rounded-full bg-pink px-4 py-2 text-sm font-semibold text-pink-strong"
        >
          Mistakes bank
        </Link>
      </div>
    </div>
  );
}
