import { notFound } from "next/navigation";
import { resolveTopic } from "@/lib/content/resolve";
import { createClient } from "@/lib/supabase/server";
import { getDueCardsForTopic } from "@/lib/flashcards";
import { FlashcardStudy } from "./flashcard-study";
import { BackLink } from "@/components/back-link";

export default async function FlashcardsPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}) {
  const { subject: subjectSlug, topic: topicSlug } = await params;
  const topic = resolveTopic(subjectSlug, topicSlug);
  if (!topic || !topic.hasContent) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const deck = await getDueCardsForTopic(topic, user.id);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 pt-8 md:p-8">
      <BackLink href={`/subjects/${subjectSlug}/${topicSlug}`} label={topic.name} />
      <div>
        <p className="text-sm text-muted">{topic.paperName}</p>
        <h1 className="text-2xl font-bold text-text">{topic.name} flashcards</h1>
      </div>
      <FlashcardStudy subjectSlug={subjectSlug} topicSlug={topicSlug} initialDeck={deck} />
    </div>
  );
}
