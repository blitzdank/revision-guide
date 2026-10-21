import { notFound } from "next/navigation";
import { getSubject } from "@/lib/subjects";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: slug } = await params;
  const subject = getSubject(slug);
  if (!subject) notFound();

  const Icon = subject.icon;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 pt-8 md:p-8">
      <div className="flex items-center gap-3">
        <Icon size={28} className="text-pink-strong" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold text-text">{subject.name}</h1>
          <p className="text-sm text-muted">
            {subject.board} · {subject.qualification}
            {subject.tier ? ` · ${subject.tier}` : ""}
          </p>
        </div>
      </div>

      <p className="rounded-2xl bg-surface p-5 text-sm text-muted shadow-sm">
        Topics, revision guides, flashcards and quizzes for {subject.name} are
        coming in a later phase. Check back once content for this subject has
        been built.
      </p>
    </div>
  );
}
