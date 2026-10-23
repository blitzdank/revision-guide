import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Layers, ListChecks } from "lucide-react";
import { getSubject } from "@/lib/subjects";
import { resolveTopic } from "@/lib/content/resolve";
import { BackLink } from "@/components/back-link";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}) {
  const { subject: subjectSlug, topic: topicSlug } = await params;
  const subject = getSubject(subjectSlug);
  if (!subject) notFound();

  const topic = resolveTopic(subjectSlug, topicSlug);
  if (!topic) notFound();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 pt-8 md:p-8">
      <BackLink href={`/subjects/${subjectSlug}`} label={subject.name} />
      <div>
        <p className="text-sm text-muted">
          {subject.name}
          {topic.strandName ? ` · ${topic.strandName}` : ""} · {topic.paperName}
        </p>
        <h1 className="text-2xl font-bold text-text">{topic.name}</h1>
        <p className="text-xs text-muted">{topic.specRef}</p>
      </div>

      {!topic.hasContent ? (
        <p className="rounded-2xl bg-surface p-5 text-sm text-muted shadow-sm">
          The guide, flashcards and quiz for this topic haven&apos;t been
          written yet. Check back once this part of the subject has been
          built.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <TopicLink
            href={`/subjects/${subjectSlug}/${topicSlug}/guide`}
            icon={BookOpen}
            label="Revision guide"
          />
          <TopicLink
            href={`/subjects/${subjectSlug}/${topicSlug}/flashcards`}
            icon={Layers}
            label="Flashcards"
          />
          <TopicLink
            href={`/subjects/${subjectSlug}/${topicSlug}/quiz`}
            icon={ListChecks}
            label="Quiz"
          />
        </div>
      )}
    </div>
  );
}

function TopicLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof BookOpen;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl bg-surface p-4 font-semibold text-text shadow-sm"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-pink/25 text-pink-strong">
        <Icon size={20} aria-hidden />
      </span>
      {label}
    </Link>
  );
}
