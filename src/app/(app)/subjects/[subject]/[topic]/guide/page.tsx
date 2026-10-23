import Link from "next/link";
import { notFound } from "next/navigation";
import { Layers, ListChecks } from "lucide-react";
import { resolveTopic } from "@/lib/content/resolve";
import { loadGuide } from "@/lib/content/load";
import { MarkdownGuide } from "@/components/markdown-guide";
import { BackLink } from "@/components/back-link";

export default async function GuidePage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}) {
  const { subject: subjectSlug, topic: topicSlug } = await params;
  const topic = resolveTopic(subjectSlug, topicSlug);
  if (!topic || !topic.hasContent) notFound();

  const guide = loadGuide(topic);
  if (!guide) notFound();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 pt-8 md:p-8">
      <BackLink href={`/subjects/${subjectSlug}/${topicSlug}`} label={topic.name} />
      <div>
        <p className="text-sm text-muted">{topic.paperName}</p>
        <h1 className="text-2xl font-bold text-text">{topic.name}</h1>
      </div>

      <MarkdownGuide markdown={guide} />

      <div className="mt-2 flex gap-3">
        <Link
          href={`/subjects/${subjectSlug}/${topicSlug}/flashcards`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-pink px-4 py-3 text-sm font-semibold text-pink-strong"
        >
          <Layers size={16} aria-hidden /> Flashcards
        </Link>
        <Link
          href={`/subjects/${subjectSlug}/${topicSlug}/quiz`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-yellow/40 px-4 py-3 text-sm font-semibold text-yellow-strong"
        >
          <ListChecks size={16} aria-hidden /> Quiz
        </Link>
      </div>
    </div>
  );
}
