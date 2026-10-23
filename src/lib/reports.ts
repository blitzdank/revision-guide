"use server";

import { createClient } from "@/lib/supabase/server";

type ActionState = { error: string | null; success: boolean };

const REASONS = ["wrong_answer", "typo", "not_on_spec", "confusing"] as const;

export async function fileReport(
  itemType: string,
  itemId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const reason = String(formData.get("reason") ?? "");
  const comment = String(formData.get("comment") ?? "").trim();

  if (!REASONS.includes(reason as (typeof REASONS)[number])) {
    return { error: "Pick a reason.", success: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in.", success: false };

  const { error } = await supabase.from("reports").insert({
    user_id: user.id,
    item_type: itemType,
    item_id: itemId,
    reason,
    comment: comment || null,
  });

  if (error) return { error: error.message, success: false };
  return { error: null, success: true };
}
