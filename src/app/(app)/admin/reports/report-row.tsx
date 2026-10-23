"use client";

import { useState } from "react";
import { setReportStatus } from "./actions";

const REASON_LABEL: Record<string, string> = {
  wrong_answer: "Wrong answer",
  typo: "Typo",
  not_on_spec: "Not on my spec",
  confusing: "Confusing",
};

export function ReportRow({
  id,
  subjectName,
  topicName,
  detail,
  reason,
  comment,
  createdAt,
}: {
  id: string;
  subjectName: string;
  topicName: string;
  detail: string;
  reason: string;
  comment: string | null;
  createdAt: string;
}) {
  const [handled, setHandled] = useState(false);

  if (handled) return null;

  return (
    <div className="rounded-2xl bg-surface p-4 shadow-sm">
      <p className="text-xs text-muted">
        {subjectName} · {topicName} · {new Date(createdAt).toLocaleDateString()}
      </p>
      <p className="font-medium text-text">{detail}</p>
      <p className="mt-1 text-sm text-pink-strong">{REASON_LABEL[reason] ?? reason}</p>
      {comment && <p className="mt-1 text-sm text-muted">&quot;{comment}&quot;</p>}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setReportStatus(id, "fixed");
            setHandled(true);
          }}
          className="rounded-full bg-pink px-3 py-1.5 text-sm font-semibold text-pink-strong"
        >
          Mark fixed
        </button>
        <button
          type="button"
          onClick={() => {
            setReportStatus(id, "dismissed");
            setHandled(true);
          }}
          className="rounded-full border border-black/10 px-3 py-1.5 text-sm font-semibold text-text"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
