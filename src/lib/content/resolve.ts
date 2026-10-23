import "server-only";
import { getSubject } from "@/lib/subjects";
import { loadSpec, loadQuestions, loadFlashcards, topicHasContent, type TopicRef } from "./load";
import type { QuizQuestion, SpecTopic, Flashcard } from "./types";

export type ResolvedTopic = TopicRef & {
  name: string;
  specRef: string;
  paperName: string;
  strandName?: string;
  hasContent: boolean;
};

/** Finds which strand (if any) and paper a topic slug belongs to, by
 * searching the subject's spec file(s). Topic slugs only need to be unique
 * within a subject, not globally. */
export function resolveTopic(subjectSlug: string, topicSlug: string): ResolvedTopic | null {
  const subject = getSubject(subjectSlug);
  if (!subject) return null;

  const strandGroups = subject.strands?.length
    ? subject.strands.map((s) => ({ strand: s.slug, strandName: s.name }))
    : [{ strand: undefined, strandName: undefined }];

  for (const { strand, strandName } of strandGroups) {
    const spec = loadSpec(subjectSlug, strand);
    if (!spec) continue;
    for (const paper of spec.papers) {
      const topic: SpecTopic | undefined = paper.topics.find((t) => t.slug === topicSlug);
      if (topic) {
        const ref: TopicRef = { subject: subjectSlug, strand, topic: topicSlug };
        return {
          ...ref,
          name: topic.name,
          specRef: topic.specRef,
          paperName: paper.name,
          strandName,
          hasContent: topicHasContent(ref),
        };
      }
    }
  }
  return null;
}

/** Splits a namespaced content id like "english/literature/macbeth#mb8"
 * (see topicId in load.ts) back into its topic and short id. */
function splitContentId(fullId: string): { ref: TopicRef; shortId: string } | null {
  const [topicPath, shortId] = fullId.split("#");
  if (!topicPath || !shortId) return null;
  const parts = topicPath.split("/");
  if (parts.length === 2) return { ref: { subject: parts[0], topic: parts[1] }, shortId };
  if (parts.length === 3) return { ref: { subject: parts[0], strand: parts[1], topic: parts[2] }, shortId };
  return null;
}

/** Human-readable context for an admin reports listing — never shows her
 * answers or progress, just what the reported item actually is. */
export function describeReportedItem(
  itemType: string,
  itemId: string,
): { subjectName: string; topicName: string; detail: string } | null {
  if (itemType === "note") {
    const split = splitTopicPath(itemId);
    if (!split) return null;
    const topic = resolveTopic(split.subject, split.topic);
    const subject = getSubject(split.subject);
    if (!topic || !subject) return null;
    return { subjectName: subject.name, topicName: topic.name, detail: "Revision guide" };
  }
  if (itemType === "flashcard") {
    const resolved = resolveFlashcardByFullId(itemId);
    if (!resolved) return null;
    const subject = getSubject(resolved.topic.subject);
    return {
      subjectName: subject?.name ?? resolved.topic.subject,
      topicName: resolved.topic.name,
      detail: `Flashcard: "${resolved.card.front}"`,
    };
  }
  if (itemType === "question") {
    const resolved = resolveQuestionByFullId(itemId);
    if (!resolved) return null;
    const subject = getSubject(resolved.topic.subject);
    return {
      subjectName: subject?.name ?? resolved.topic.subject,
      topicName: resolved.topic.name,
      detail: `Question: "${resolved.question.prompt}"`,
    };
  }
  return null;
}

function splitTopicPath(topicPath: string): TopicRef | null {
  const parts = topicPath.split("/");
  if (parts.length === 2) return { subject: parts[0], topic: parts[1] };
  if (parts.length === 3) return { subject: parts[0], strand: parts[1], topic: parts[2] };
  return null;
}

/** Resolves a mistake/report's namespaced question_id back to the real
 * question and its topic, for display (correct answer, explanation, etc). */
export function resolveQuestionByFullId(
  fullId: string,
): { question: QuizQuestion; topic: ResolvedTopic } | null {
  const split = splitContentId(fullId);
  if (!split) return null;
  const topic = resolveTopic(split.ref.subject, split.ref.topic);
  if (!topic) return null;
  const question = loadQuestions(split.ref).find((q) => q.id === split.shortId);
  if (!question) return null;
  return { question, topic };
}

/** Same as above, for a namespaced flashcard id (user:<uuid> ids — her own
 * cards — aren't content-file-backed, so this returns null for those). */
export function resolveFlashcardByFullId(
  fullId: string,
): { card: Flashcard; topic: ResolvedTopic } | null {
  const split = splitContentId(fullId);
  if (!split) return null;
  const topic = resolveTopic(split.ref.subject, split.ref.topic);
  if (!topic) return null;
  const card = loadFlashcards(split.ref).find((c) => c.id === split.shortId);
  if (!card) return null;
  return { card, topic };
}
