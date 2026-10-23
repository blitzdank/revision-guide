"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toDateOnly } from "@/lib/srs";

/** Counts a correct retry / "mark as understood" toward leaving the bank.
 * Only counts once per calendar day, so she can't double-click her way to
 * "right twice" in one sitting (section 6.4: "right twice on separate
 * days"). */
export async function markMistakeCorrect(mistakeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: mistake } = await supabase
    .from("mistakes")
    .select("times_right, last_correct_date")
    .eq("id", mistakeId)
    .eq("user_id", user.id)
    .single();
  if (!mistake) return;

  const today = toDateOnly(new Date());
  if (mistake.last_correct_date === today) return; // already counted today

  const timesRight = mistake.times_right + 1;
  await supabase
    .from("mistakes")
    .update({
      times_right: timesRight,
      last_correct_date: today,
      status: timesRight >= 2 ? "resolved" : "open",
    })
    .eq("id", mistakeId);

  revalidatePath("/mistakes");
  revalidatePath("/");
}
