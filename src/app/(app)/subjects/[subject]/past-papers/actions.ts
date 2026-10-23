"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type QuestionMark = { label: string; awarded: number; max: number };

type ActionState = { error: string | null };

export async function logPaperAttempt(
  subjectSlug: string,
  paperLabel: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const year = Number(formData.get("year"));
  const rowsJson = String(formData.get("rows") ?? "[]");
  if (!year) return { error: "Enter a year." };

  let rows: QuestionMark[];
  try {
    rows = JSON.parse(rowsJson);
  } catch {
    return { error: "Something went wrong reading your marks." };
  }
  if (rows.length === 0) return { error: "Add at least one question." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const total = rows.reduce((s, r) => s + r.awarded, 0);
  const maxTotal = rows.reduce((s, r) => s + r.max, 0);
  const questionMarks = Object.fromEntries(rows.map((r) => [r.label, { awarded: r.awarded, max: r.max }]));

  const { error } = await supabase.from("paper_attempts").insert({
    user_id: user.id,
    subject: subjectSlug,
    year,
    paper: paperLabel,
    question_marks: questionMarks,
    total,
    max_total: maxTotal,
  });
  if (error) return { error: error.message };

  const dropped = rows.filter((r) => r.awarded < r.max);
  if (dropped.length > 0) {
    await supabase.from("mistakes").insert(
      dropped.map((r) => ({
        user_id: user.id,
        source: "real_paper" as const,
        paper_ref: `${paperLabel} ${year} — ${r.label}`,
      })),
    );
  }

  revalidatePath(`/subjects/${subjectSlug}/past-papers`);
  revalidatePath("/mistakes");
  return { error: null };
}
