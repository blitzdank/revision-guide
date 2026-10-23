"use server";

import { createClient } from "@/lib/supabase/server";
import { nextBox, nextDueDate, toDateOnly } from "@/lib/srs";
import { revalidatePath } from "next/cache";

export async function recordReview(cardId: string, currentBox: number, gotIt: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const box = nextBox(currentBox, gotIt);
  const due = nextDueDate(box);

  await supabase.from("card_progress").upsert(
    {
      user_id: user.id,
      card_id: cardId,
      box,
      next_due: toDateOnly(due),
      last_seen: new Date().toISOString(),
    },
    { onConflict: "user_id,card_id" },
  );

  // "Due today" on Home reads this.
  revalidatePath("/");
}
