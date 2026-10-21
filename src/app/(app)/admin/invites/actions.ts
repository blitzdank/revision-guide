"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Avoids visually ambiguous characters (0/O, 1/I/L) since she'll be typing
// this code in by hand.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateCode(length = 8) {
  const bytes = randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return code;
}

type ActionState = { error: string | null };

export async function createInvite(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const grantsRole = formData.get("grantsRole") === "admin" ? "admin" : "student";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase.from("invites").insert({
    code: generateCode(),
    grants_role: grantsRole,
    created_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/invites");
  return { error: null };
}
