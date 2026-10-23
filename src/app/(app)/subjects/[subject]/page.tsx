import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubject } from "@/lib/subjects";
import { listTopicsGrouped, loadAllPastPapers } from "@/lib/content/load";
import { BackLink } from "@/components/back-link";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: slug } = await params;
  const subject = getSubject(slug);
  if (!subject) notFound();

  const Icon = subject.icon;
  const groups = listTopicsGrouped(slug, subject.strands);
  const hasAnyContent = groups.some((g) => g.papers.some((p) => p.topics.some((t) => t.hasContent)));
  const hasPastPapers = loadAllPastPapers(slug, subject.strands).length > 0;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 pt-8 md:p-8">
      <BackLink href="/subjects" label="Subjects" />
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

      {hasPastPapers && (
        <Link
          href={`/subjects/${slug}/past-papers`}
          className="rounded-2xl bg-yellow/35 p-4 text-center font-semibold text-yellow-strong shadow-sm"
        >
          Past papers & tracker →
        </Link>
      )}

      {!hasAnyContent && (
        <p className="rounded-2xl bg-surface p-5 text-sm text-muted shadow-sm">
          Topics, revision guides, flashcards and quizzes for {subject.name}{" "}
          are coming in a later phase. Check back once content for this
          subject has been built.
        </p>
      )}

      {groups.map((group) => (
        <section key={group.strand ?? "default"} className="flex flex-col gap-4">
          {group.strandName && (
            <h2 className="text-lg font-bold text-text">{group.strandName}</h2>
          )}
          {group.papers.map((paper) => (
            <div key={paper.id}>
              <h3 className="mb-2 text-sm font-semibold text-muted">{paper.name}</h3>
              <div className="flex flex-col gap-2">
                {paper.topics.map((topic) =>
                  topic.hasContent ? (
                    <Link
                      key={topic.slug}
                      href={`/subjects/${slug}/${topic.slug}`}
                      className="flex items-center justify-between gap-3 rounded-xl bg-surface p-3.5 shadow-sm"
                    >
                      <span className="font-medium text-text">{topic.name}</span>
                      <span className="text-xs text-muted">{topic.specRef}</span>
                    </Link>
                  ) : (
                    <div
                      key={topic.slug}
                      className="flex items-center justify-between gap-3 rounded-xl bg-surface/50 p-3.5 opacity-60"
                    >
                      <span className="font-medium text-text">{topic.name}</span>
                      <span className="text-xs text-muted">Coming soon</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
