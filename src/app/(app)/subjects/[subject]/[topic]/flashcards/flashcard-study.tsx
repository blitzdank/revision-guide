"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { recordReview } from "./actions";
import type { StudyCard } from "@/lib/flashcards";
import { ReportMistakeButton } from "@/components/report-mistake-button";
import { MathText } from "@/components/math-text";

const SWIPE_THRESHOLD = 60;

export function FlashcardStudy({
  subjectSlug,
  topicSlug,
  initialDeck,
}: {
  subjectSlug: string;
  topicSlug: string;
  initialDeck: StudyCard[];
}) {
  const [queue, setQueue] = useState(initialDeck);
  const [reviewed, setReviewed] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  const total = initialDeck.length;
  const current = queue[0];

  function choose(gotIt: boolean) {
    if (!current) return;
    startTransition(() => {
      recordReview(current.cardId, current.box, gotIt);
    });
    setQueue((q) => q.slice(1));
    setReviewed((n) => n + 1);
    setFlipped(false);
  }

  if (total === 0) {
    return (
      <EmptyState
        subjectSlug={subjectSlug}
        topicSlug={topicSlug}
        message="Nothing due right now — nice work staying on top of it."
      />
    );
  }

  if (!current) {
    return (
      <EmptyState
        subjectSlug={subjectSlug}
        topicSlug={topicSlug}
        message={`Done! You reviewed ${reviewed} card${reviewed === 1 ? "" : "s"}.`}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-muted">{queue.length} left</p>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX;
          setTouchStartX(null);
          if (Math.abs(dx) > SWIPE_THRESHOLD) {
            choose(dx > 0);
          } else {
            setFlipped((f) => !f);
          }
        }}
        className="flex min-h-56 w-full max-w-sm items-center justify-center rounded-3xl bg-surface p-8 text-center shadow-sm"
      >
        <p className="text-lg font-medium text-text">
          <MathText text={flipped ? current.back : current.front} />
        </p>
      </button>

      {!current.isUserCard && (
        <ReportMistakeButton itemType="flashcard" itemId={current.cardId} />
      )}

      <p className="text-xs text-muted">Tap to flip · swipe right for Got it, left for Not yet</p>

      <div className="flex w-full max-w-sm gap-3">
        <button
          type="button"
          onClick={() => choose(false)}
          className="flex-1 rounded-full border border-black/10 px-4 py-3 text-base font-semibold text-text"
        >
          Not yet
        </button>
        <button
          type="button"
          onClick={() => choose(true)}
          className="flex-1 rounded-full bg-pink px-4 py-3 text-base font-semibold text-pink-strong"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function EmptyState({
  subjectSlug,
  topicSlug,
  message,
}: {
  subjectSlug: string;
  topicSlug: string;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface p-8 text-center shadow-sm">
      <p className="font-medium text-text">{message}</p>
      <Link
        href={`/subjects/${subjectSlug}/${topicSlug}`}
        className="rounded-full bg-pink px-4 py-2 text-sm font-semibold text-pink-strong"
      >
        Back to topic
      </Link>
    </div>
  );
}
