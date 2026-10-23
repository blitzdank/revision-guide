import "server-only";
import { getSubject } from "@/lib/subjects";
import { loadSpec, topicHasContent, type TopicRef } from "./load";
import type { SpecTopic } from "./types";

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
