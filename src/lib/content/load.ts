import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Flashcard, QuizQuestion, SubjectSpec } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export type TopicRef = {
  subject: string;
  strand?: string;
  topic: string;
};

/** Stable id namespace for a topic's flashcards/questions — used as the
 * card_progress.card_id / mistakes.question_id prefix so ids stay unique
 * across the whole app. */
export function topicId(ref: TopicRef): string {
  return [ref.subject, ref.strand, ref.topic].filter(Boolean).join("/");
}

function topicDir(ref: TopicRef): string {
  return path.join(CONTENT_ROOT, ref.subject, ref.strand ?? "", ref.topic);
}

function readJson<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

export function loadSpec(subject: string, strand?: string): SubjectSpec | null {
  const file = path.join(CONTENT_ROOT, subject, strand ?? "", "spec.json");
  return readJson<SubjectSpec>(file);
}

export type PastPapersSpec = {
  specUrl: string;
  papers: { id: string; name: string; maxMarks: number }[];
};

/** past-papers.json is keyed by subject, then strand (when the subject has
 * strands) — e.g. { "english": { "language": {...}, "literature": {...} } }. */
export function loadPastPapers(subject: string, strand?: string): PastPapersSpec | null {
  const all = readJson<Record<string, unknown>>(path.join(CONTENT_ROOT, "past-papers.json"));
  if (!all) return null;
  const subjectEntry = all[subject];
  if (!subjectEntry) return null;
  if (strand) return (subjectEntry as Record<string, PastPapersSpec>)[strand] ?? null;
  return subjectEntry as PastPapersSpec;
}

/** All past-paper specs for a subject, one per strand (or a single entry
 * for a subject with no strands) — used to render the past-papers page. */
export function loadAllPastPapers(subject: string, strands?: { slug: string; name: string }[]) {
  const groups = strands && strands.length > 0 ? strands : [undefined];
  const withNulls = groups.map((s) => ({
    strand: s?.slug,
    strandName: s?.name,
    spec: loadPastPapers(subject, s?.slug),
  }));
  return withNulls.filter(
    (g): g is typeof withNulls[number] & { spec: PastPapersSpec } => g.spec !== null,
  );
}

export function topicHasContent(ref: TopicRef): boolean {
  return fs.existsSync(path.join(topicDir(ref), "guide.md"));
}

export function loadGuide(ref: TopicRef): string | null {
  const file = path.join(topicDir(ref), "guide.md");
  return fs.existsSync(file) ? fs.readFileSync(file, "utf-8") : null;
}

export function loadFlashcards(ref: TopicRef): Flashcard[] {
  return readJson<Flashcard[]>(path.join(topicDir(ref), "flashcards.json")) ?? [];
}

export function loadQuestions(ref: TopicRef): QuizQuestion[] {
  return readJson<QuizQuestion[]>(path.join(topicDir(ref), "questions.json")) ?? [];
}

export type GroupedTopic = {
  slug: string;
  name: string;
  specRef: string;
  hasContent: boolean;
};
export type GroupedPaper = { id: string; name: string; topics: GroupedTopic[] };
export type GroupedStrand = { strand?: string; strandName?: string; papers: GroupedPaper[] };

/** Every topic across a subject's spec(s), grouped by strand then paper, for
 * the subject overview page — includes topics with no content yet. */
export function listTopicsGrouped(
  subject: string,
  strands?: { slug: string; name: string }[],
): GroupedStrand[] {
  const groups = strands && strands.length > 0 ? strands : [undefined];

  return groups.map((s) => {
    const strand = s?.slug;
    const spec = loadSpec(subject, strand);
    const papers: GroupedPaper[] = (spec?.papers ?? []).map((paper) => ({
      id: paper.id,
      name: paper.name,
      topics: paper.topics.map((topic) => ({
        slug: topic.slug,
        name: topic.name,
        specRef: topic.specRef,
        hasContent: topicHasContent({ subject, strand, topic: topic.slug }),
      })),
    }));
    return { strand, strandName: s?.name, papers };
  });
}

