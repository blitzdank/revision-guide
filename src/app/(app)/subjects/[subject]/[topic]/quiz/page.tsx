import { notFound } from "next/navigation";
import { resolveTopic } from "@/lib/content/resolve";
import { loadQuestions, topicId } from "@/lib/content/load";
import { QuizRunner } from "./quiz-runner";
import { BackLink } from "@/components/back-link";

const DEFAULT_QUIZ_LENGTH = 10;

export default async function QuizPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}) {
  const { subject: subjectSlug, topic: topicSlug } = await params;
  const topic = resolveTopic(subjectSlug, topicSlug);
  if (!topic || !topic.hasContent) notFound();

  const all = loadQuestions(topic);
  if (all.length === 0) notFound();

  // A fresh shuffle each time this page renders is the point (new practice
  // order per attempt), so Math.random() here is intentional, not a bug.
  // eslint-disable-next-line react-hooks/purity
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  const questions = shuffled.slice(0, DEFAULT_QUIZ_LENGTH);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 pt-8 md:p-8">
      <BackLink href={`/subjects/${subjectSlug}/${topicSlug}`} label={topic.name} />
      <div>
        <p className="text-sm text-muted">{topic.paperName}</p>
        <h1 className="text-2xl font-bold text-text">{topic.name} quiz</h1>
      </div>
      <QuizRunner
        subjectSlug={subjectSlug}
        topicSlug={topicSlug}
        topicScope={topicId(topic)}
        questions={questions}
      />
    </div>
  );
}
