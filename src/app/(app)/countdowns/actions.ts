"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error: string | null };

function parseExamAt(formData: FormData): { examAt: string; allDay: boolean } {
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "").trim();

  if (!date) throw new Error("A date is required.");

  if (time) {
    // Combine as local time, then convert to an absolute instant.
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const local = new Date(year, month - 1, day, hour, minute);
    return { examAt: local.toISOString(), allDay: false };
  }

  const [year, month, day] = date.split("-").map(Number);
  const local = new Date(year, month - 1, day);
  return { examAt: local.toISOString(), allDay: true };
}

export async function createCountdown(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Give it a name." };

  let examAt: string, allDay: boolean;
  try {
    ({ examAt, allDay } = parseExamAt(formData));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Invalid date." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("countdowns")
    .insert({ user_id: user.id, name, exam_at: examAt, all_day: allDay });

  if (error) return { error: error.message };

  revalidatePath("/countdowns");
  revalidatePath("/");
  return { error: null };
}

export async function updateCountdown(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return { error: "Give it a name." };

  let examAt: string, allDay: boolean;
  try {
    ({ examAt, allDay } = parseExamAt(formData));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Invalid date." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("countdowns")
    .update({ name, exam_at: examAt, all_day: allDay })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/countdowns");
  revalidatePath("/");
  return { error: null };
}

export async function deleteCountdown(id: string) {
  const supabase = await createClient();
  await supabase.from("countdowns").delete().eq("id", id);
  revalidatePath("/countdowns");
  revalidatePath("/");
}
