"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { QuestionResult } from "@/lib/quiz";

export async function submitQuizResults(
  subjectSlug: string,
  topicScope: string,
  results: QuestionResult[],
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const score = results.reduce((sum, r) => sum + r.marksAwarded, 0);
  const total = results.reduce((sum, r) => sum + r.marks, 0);

  await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    subject: subjectSlug,
    scope: topicScope,
    score,
    total,
  });

  await supabase.from("question_attempts").insert(
    results.map((r) => ({
      user_id: user.id,
      question_id: r.questionId,
      answer: r.answerGiven,
      marks_awarded: r.marksAwarded,
      correct: r.correct,
    })),
  );

  const wrong = results.filter((r) => !r.correct);
  if (wrong.length > 0) {
    await supabase.from("mistakes").insert(
      wrong.map((r) => ({
        user_id: user.id,
        source: "quiz" as const,
        question_id: r.questionId,
        her_answer: r.answerGiven,
      })),
    );
  }

  revalidatePath("/");
  revalidatePath("/mistakes");
}
