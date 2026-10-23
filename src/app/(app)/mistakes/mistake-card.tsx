"use client";

import { useRef, useState, useTransition } from "react";
import type { QuizQuestion } from "@/lib/content/types";
import { scoreQuestion } from "@/lib/quiz";
import {
  MultipleChoiceInput,
  ShortAnswerInput,
  NumericInput,
  OrderingInput,
} from "@/components/quiz-inputs";
import { TutorPanel } from "@/components/tutor-panel";
import { createClient } from "@/lib/supabase/client";
import { markMistakeCorrect, attachMistakePhoto } from "./actions";
import type { MistakeView } from "@/lib/mistakes";

export function MistakeCard({ mistake, aiEnabled }: { mistake: MistakeView; aiEnabled: boolean }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [retryCorrect, setRetryCorrect] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);
  const [photoPath, setPhotoPath] = useState(mistake.photoPath);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  function markCorrect() {
    startTransition(() => {
      markMistakeCorrect(mistake.id);
    });
    setDone(true);
  }

  async function handlePhotoChosen(file: File) {
    setUploading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return setUploading(false);

    const path = `${user.id}/${mistake.id}-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from("mistake-photos").upload(path, file);
    setUploading(false);
    if (!error) {
      setPhotoPath(path);
      attachMistakePhoto(mistake.id, path);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-surface p-4 text-sm text-correct shadow-sm">
        Nice — counted.{" "}
        {mistake.timesRight + 1 >= 2 ? "Off the list." : "Get it right once more on another day to clear it."}
      </div>
    );
  }

  const explainContext = `Subject: ${mistake.subjectName}${mistake.topicName ? ` — ${mistake.topicName}` : ""}
Source: ${mistake.source === "quiz" ? "Quiz question" : "Real past-paper question"}
Question: ${mistake.label}
${mistake.correctAnswer ? `Correct answer: ${mistake.correctAnswer}\n` : ""}${mistake.explanation ? `Explanation: ${mistake.explanation}\n` : ""}Her answer: ${mistake.herAnswer ?? "(see attached photo)"}`;

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

      {mistake.source === "real_paper" && (
        <div>
          {photoPath ? (
            <p className="text-xs text-correct">Photo attached</p>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoChosen(file);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-xs text-pink-strong underline disabled:opacity-60"
              >
                {uploading ? "Uploading…" : "Attach a photo of the question"}
              </button>
            </>
          )}
        </div>
      )}

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
        <div className="flex flex-wrap gap-2">
          {mistake.question && (
            <button
              type="button"
              onClick={() => setRetrying(true)}
              className="rounded-full bg-pink px-3 py-2 text-sm font-semibold text-pink-strong"
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
            className="rounded-full border border-black/10 px-3 py-2 text-sm font-semibold text-text"
          >
            Mark as understood
          </button>
          {aiEnabled && mistake.source === "quiz" && (
            <TutorPanel
              triggerLabel="Explain this"
              initialPrompt="Can you explain this mistake to me?"
              context={explainContext}
              triggerClassName="rounded-full bg-yellow/35 px-3 py-2 text-sm font-semibold text-yellow-strong"
            />
          )}
          {aiEnabled && mistake.source === "real_paper" && photoPath && (
            <TutorPanel
              triggerLabel="Help with this question"
              initialPrompt="Here's a photo of the question I got wrong. Can you help me understand it?"
              context={explainContext}
              photoPath={photoPath}
              triggerClassName="rounded-full bg-yellow/35 px-3 py-2 text-sm font-semibold text-yellow-strong"
            />
          )}
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
