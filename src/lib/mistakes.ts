import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getSubject } from "@/lib/subjects";
import { resolveQuestionByFullId } from "@/lib/content/resolve";
import { describeCorrectAnswer } from "@/lib/quiz";
import type { QuizQuestion } from "@/lib/content/types";

export type MistakeView = {
  id: string;
  source: "quiz" | "real_paper";
  subjectSlug: string | null;
  subjectName: string;
  topicSlug: string | null;
  topicName: string | null;
  label: string;
  herAnswer: string | null;
  correctAnswer: string | null;
  explanation: string | null;
  /** The full question, for the "Retry" input — null if it's since been
   * removed from the content files, or this is a real-paper mistake. */
  question: QuizQuestion | null;
  timesRight: number;
  createdAt: string;
};

type MistakeRow = {
  id: string;
  source: "quiz" | "real_paper";
  subject: string | null;
  question_id: string | null;
  paper_ref: string | null;
  her_answer: string | null;
  times_right: number;
  created_at: string;
};

function toView(row: MistakeRow): MistakeView {
  const subjectName = row.subject ? (getSubject(row.subject)?.name ?? row.subject) : "Unknown subject";

  if (row.source === "real_paper") {
    return {
      id: row.id,
      source: row.source,
      subjectSlug: row.subject,
      subjectName,
      topicSlug: null,
      topicName: null,
      label: row.paper_ref ?? "Real paper",
      herAnswer: null,
      correctAnswer: null,
      explanation: null,
      question: null,
      timesRight: row.times_right,
      createdAt: row.created_at,
    };
  }

  const resolved = row.question_id ? resolveQuestionByFullId(row.question_id) : null;
  return {
    id: row.id,
    source: row.source,
    subjectSlug: row.subject,
    subjectName,
    topicSlug: resolved?.topic.topic ?? null,
    topicName: resolved?.topic.name ?? null,
    label: resolved?.question.prompt ?? "Quiz question (content since removed)",
    herAnswer: row.her_answer,
    correctAnswer: resolved ? describeCorrectAnswer(resolved.question) : null,
    explanation: resolved && "explanation" in resolved.question ? resolved.question.explanation : null,
    question: resolved?.question ?? null,
    timesRight: row.times_right,
    createdAt: row.created_at,
  };
}

export async function getOpenMistakes(userId: string): Promise<MistakeView[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mistakes")
    .select("id, source, subject, question_id, paper_ref, her_answer, times_right, created_at")
    .eq("user_id", userId)
    .eq("status", "open")
    .order("created_at", { ascending: false });

  return (data ?? []).map(toView);
}
