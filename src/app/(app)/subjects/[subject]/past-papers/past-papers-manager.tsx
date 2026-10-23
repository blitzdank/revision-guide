"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { PaperAttemptForm } from "./paper-attempt-form";

type Paper = { strandName?: string; label: string; specUrl: string };
type Attempt = { id: string; year: number; paper: string; total: number; max_total: number };

export function PastPapersManager({
  subjectSlug,
  papers,
  attempts,
}: {
  subjectSlug: string;
  papers: Paper[];
  attempts: Attempt[];
}) {
  const [openPaper, setOpenPaper] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {papers.map((paper) => (
          <div key={paper.label} className="rounded-2xl bg-surface p-4 shadow-sm">
            <p className="text-xs text-muted">{paper.strandName}</p>
            <p className="mb-3 font-semibold text-text">{paper.label}</p>
            <div className="flex flex-wrap gap-2">
              <a
                href={paper.specUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-sm text-text"
              >
                Find papers & mark schemes <ExternalLink size={14} aria-hidden />
              </a>
              <button
                type="button"
                onClick={() => setOpenPaper(openPaper === paper.label ? null : paper.label)}
                className="rounded-full bg-pink px-3 py-1.5 text-sm font-semibold text-pink-strong"
              >
                + Log attempt
              </button>
            </div>
            {openPaper === paper.label && (
              <div className="mt-3">
                <PaperAttemptForm
                  subjectSlug={subjectSlug}
                  paperLabel={paper.label}
                  onDone={() => setOpenPaper(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {attempts.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted">Your attempts</h2>
          <div className="flex flex-col gap-2">
            {attempts.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl bg-surface p-3.5 shadow-sm">
                <span className="text-sm text-text">
                  {a.paper} · {a.year}
                </span>
                <span className="text-sm font-semibold text-text">
                  {a.total}/{a.max_total}{" "}
                  <span className="text-muted">
                    ({a.max_total > 0 ? Math.round((a.total / a.max_total) * 100) : 0}%)
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
