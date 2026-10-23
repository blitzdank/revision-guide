"use client";

import { useState, useTransition } from "react";
import type { QuizQuestion } from "@/lib/content/types";
import { scoreQuestion } from "@/lib/quiz";
import {
  MultipleChoiceInput,
  ShortAnswerInput,
  NumericInput,
  OrderingInput,
} from "@/components/quiz-inputs";
import { markMistakeCorrect } from "./actions";
import type { MistakeView } from "@/lib/mistakes";

export function MistakeCard({ mistake }: { mistake: MistakeView }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [retryCorrect, setRetryCorrect] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);
  const [, startTransition] = useTransition();

  function markCorrect() {
    startTransition(() => {
      markMistakeCorrect(mistake.id);
    });
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-surface p-4 text-sm text-correct shadow-sm">
        Nice — counted.{" "}
        {mistake.timesRight + 1 >= 2 ? "Off the list." : "Get it right once more on another day to clear it."}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-sm">
      <div>
        <p className="text-xs text-muted">
          {mistake.subjectName}
          {mistake.topicName ? ` · ${mistake.topicName}` : ""} ·{" "}
          {mistake.source === "quiz" ? "Quiz" : "Real paper"}
        </p>
        <p className="font-medium text-text">{mistake.label}</p>
      </div>

      {mistake.herAnswer && (
        <p className="text-sm text-muted">
          Your answer: <span className="text-wrong">{mistake.herAnswer}</span>
        </p>
      )}

      {showAnswer && mistake.correctAnswer && (
        <p className="text-sm text-text">
          Correct answer: <span className="text-correct">{mistake.correctAnswer}</span>
        </p>
      )}
      {showAnswer && mistake.explanation && <p className="text-sm text-muted">{mistake.explanation}</p>}

      {retrying && mistake.question && (
        <RetryInput
          question={mistake.question}
          onResult={(correct) => {
            setRetryCorrect(correct);
            setShowAnswer(true);
            if (correct) markCorrect();
          }}
        />
      )}
      {retryCorrect === false && (
        <p className="text-sm text-wrong">Not quite — have another look at the explanation above.</p>
      )}

      {!retrying && (
        <div className="flex gap-2">
          {mistake.question && (
            <button
              type="button"
              onClick={() => setRetrying(true)}
              className="flex-1 rounded-full bg-pink px-3 py-2 text-sm font-semibold text-pink-strong"
            >
              Retry
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setShowAnswer(true);
              markCorrect();
            }}
            className="flex-1 rounded-full border border-black/10 px-3 py-2 text-sm font-semibold text-text"
          >
            Mark as understood
          </button>
        </div>
      )}
    </div>
  );
}

function RetryInput({
  question,
  onResult,
}: {
  question: QuizQuestion;
  onResult: (correct: boolean) => void;
}) {
  function check(answer: Parameters<typeof scoreQuestion>[1]) {
    if (question.type === "extended") return;
    const result = scoreQuestion(question, answer);
    onResult(result.correct);
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
      return null;
  }
}
