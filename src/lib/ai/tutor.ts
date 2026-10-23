import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { toDateOnly } from "@/lib/srs";

/** Off by default — only turns on once ANTHROPIC_API_KEY is set in the
 * hosting environment (section 6.8). Every AI entry point in the UI checks
 * this before even rendering its button. */
export function isAiEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function getModel(): string {
  return process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";
}

function getDailyLimit(): number {
  return Number(process.env.AI_DAILY_MESSAGE_LIMIT) || 30;
}

const MAX_RESPONSE_TOKENS = 500;

const SYSTEM_PROMPT = `You are a patient, encouraging study tutor built into a GCSE revision app, helping a 15-year-old student in England revise for her exams (summer 2027).

Rules you must always follow:
- Only help with revision and school-study topics, for her subjects (English, History, Maths, Combined Science, Religious Studies, Food, Graphics). If she asks about anything else, kindly and briefly steer the conversation back to her revision — don't lecture her about it.
- Teach, don't just answer: give a hint first. Only give the full explanation if she asks for it directly, or says the hint didn't help.
- Keep your tone age-appropriate, kind, warm and concise — a few short paragraphs at most, never an essay.
- Never claim certainty about what grade or mark she'd get for a piece of work. Always clearly label any mark or grade you mention as an estimate, not a fact.`;

export type TutorMessage = { role: "user" | "assistant"; content: string };

/** Returns {allowed:false} once she's hit AI_DAILY_MESSAGE_LIMIT for today,
 * otherwise records this message and allows it (section 6.8 cost controls). */
async function checkAndConsumeUsage(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = await createClient();
  const today = toDateOnly(new Date());
  const limit = getDailyLimit();

  const { data: existing } = await supabase
    .from("ai_usage")
    .select("message_count")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  const current = existing?.message_count ?? 0;
  if (current >= limit) return { allowed: false, remaining: 0 };

  await supabase
    .from("ai_usage")
    .upsert({ user_id: userId, date: today, message_count: current + 1 }, { onConflict: "user_id,date" });

  return { allowed: true, remaining: limit - current - 1 };
}

type AskTutorResult =
  | { ok: true; reply: string; remaining: number }
  | { ok: false; error: string };

/**
 * `context` is prepended as a system-level fact sheet (the question, mark
 * scheme points, her answer, spec context) so advice is specific to her
 * board and tier, per section 6.8. `imageBase64`/`imageMediaType` optionally
 * attach a photo (real-paper "Help with this question", section 6.4/6.8).
 */
export async function askTutor({
  userId,
  context,
  messages,
  imageBase64,
  imageMediaType,
}: {
  userId: string;
  context: string;
  messages: TutorMessage[];
  imageBase64?: string;
  imageMediaType?: "image/jpeg" | "image/png" | "image/webp";
}): Promise<AskTutorResult> {
  if (!isAiEnabled()) return { ok: false, error: "The AI tutor isn't turned on." };

  const usage = await checkAndConsumeUsage(userId);
  if (!usage.allowed) {
    return { ok: false, error: "You've reached today's limit for AI help — try again tomorrow." };
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m, i) => {
    const isLastUserMessage = i === messages.length - 1 && m.role === "user";
    if (isLastUserMessage && imageBase64 && imageMediaType) {
      return {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: imageMediaType, data: imageBase64 } },
          { type: "text", text: m.content },
        ],
      };
    }
    return { role: m.role, content: m.content };
  });

  try {
    const response = await client.messages.create({
      model: getModel(),
      max_tokens: MAX_RESPONSE_TOKENS,
      system: `${SYSTEM_PROMPT}\n\nContext for this conversation:\n${context}`,
      messages: anthropicMessages,
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return { ok: true, reply: text || "Sorry, I couldn't come up with a reply — try asking again.", remaining: usage.remaining };
  } catch {
    return { ok: false, error: "Something went wrong reaching the AI tutor. Try again in a moment." };
  }
}
