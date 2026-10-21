import Link from "next/link";
import type { Subject } from "@/lib/subjects";
import { CONFIDENCE_DOT_CLASS, CONFIDENCE_LABEL, type ConfidenceLevel } from "@/lib/confidence";

/**
 * A subject tile for the Home and Subjects screens. Progress/confidence is a
 * placeholder until Phase 3 wires up real flashcard and quiz data.
 */
export function SubjectCard({
  subject,
  confidence = "not_started",
}: {
  subject: Subject;
  confidence?: ConfidenceLevel;
}) {
  const Icon = subject.icon;
  const tintBg = subject.tint === "pink" ? "bg-pink/25" : "bg-yellow/35";
  const tintText = subject.tint === "pink" ? "text-pink-strong" : "text-yellow-strong";

  return (
    <Link
      href={`/subjects/${subject.slug}`}
      className="flex items-center gap-4 rounded-2xl bg-surface p-4 shadow-sm transition-transform active:scale-[0.99]"
    >
      <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${tintBg} ${tintText}`}>
        <Icon size={24} aria-hidden />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-text">{subject.name}</span>
        <span className="block truncate text-sm text-muted">
          {subject.board}
          {subject.tier ? ` · ${subject.tier}` : ""}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted">
        <span className={`size-2 rounded-full ${CONFIDENCE_DOT_CLASS[confidence]}`} aria-hidden />
        {CONFIDENCE_LABEL[confidence]}
      </span>
    </Link>
  );
}
