"use server";

import { createClient } from "@/lib/supabase/server";
import { askTutor, type TutorMessage } from "./tutor";

export async function askTutorAction(
  context: string,
  messages: TutorMessage[],
  photoPath?: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Not signed in." };

  let imageBase64: string | undefined;
  let imageMediaType: "image/jpeg" | "image/png" | "image/webp" | undefined;

  if (photoPath) {
    const { data } = await supabase.storage.from("mistake-photos").download(photoPath);
    if (data) {
      const buffer = Buffer.from(await data.arrayBuffer());
      imageBase64 = buffer.toString("base64");
      imageMediaType = data.type.includes("png")
        ? "image/png"
        : data.type.includes("webp")
          ? "image/webp"
          : "image/jpeg";
    }
  }

  return askTutor({ userId: user.id, context, messages, imageBase64, imageMediaType });
}
