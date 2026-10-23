"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { QuizQuestion, ExtendedQuestion, NumericQuestion } from "@/lib/content/types";
import { scoreExtended, scoreQuestion, type QuestionResult } from "@/lib/quiz";
import { submitQuizResults } from "./actions";
import { ReportMistakeButton } from "@/components/report-mistake-button";
import {
  MultipleChoiceInput,
  ShortAnswerInput,
  NumericInput,
  OrderingInput,
} from "@/components/quiz-inputs";
import { TutorPanel } from "@/components/tutor-panel";

export function QuizRunner({
  subjectSlug,
  topicSlug,
  topicScope,
  questions,
  aiEnabled,
  specContext,
}: {
  subjectSlug: string;
  topicSlug: string;
  topicScope: string;
  questions: QuizQuestion[];
  aiEnabled: boolean;
  specContext: string;
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
        topicScope={topicScope}
        aiEnabled={aiEnabled}
        specContext={specContext}
        onNext={() => setIndex((i) => i + 1)}
        onAnswered={handleResult}
      />
    </div>
  );
}

function QuestionCard({
  question,
  topicScope,
  aiEnabled,
  specContext,
  onNext,
  onAnswered,
}: {
  question: QuizQuestion;
  topicScope: string;
  aiEnabled: boolean;
  specContext: string;
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
        <ReportMistakeButton
          itemType="question"
          itemId={`${topicScope}#${question.id}`}
          className="self-start"
        />
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
      return (
        <ExtendedInput
          question={question}
          aiEnabled={aiEnabled}
          specContext={specContext}
          onAnswered={onAnswered}
          setResult={setResult}
        />
      );
  }
}

function ExtendedInput({
  question,
  aiEnabled,
  specContext,
  onAnswered,
  setResult,
}: {
  question: ExtendedQuestion;
  aiEnabled: boolean;
  specContext: string;
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
          {aiEnabled && (
            <TutorPanel
              triggerLabel="Get feedback"
              initialPrompt="Give me feedback on my answer: a hint toward what's missing, and an estimated mark."
              context={`Subject context: ${specContext}\n\nQuestion (${question.marks} marks): ${question.prompt}\n\nWhat a strong answer covers:\n${question.indicativeContent.map((p) => `- ${p}`).join("\n")}\n\nMark bands:\n${question.levelDescriptors.map((l) => `Level ${l.level} (${l.marksRange}): ${l.description}`).join("\n")}\n\nHer answer:\n${answer}`}
            />
          )}

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
