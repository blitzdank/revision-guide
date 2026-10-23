import "server-only";
import { createClient } from "@/lib/supabase/server";
import { loadFlashcards, topicId, type TopicRef } from "@/lib/content/load";
import { toDateOnly } from "@/lib/srs";

export type StudyCard = {
  cardId: string;
  front: string;
  back: string;
  box: number;
  /** Her own cards can't be "reported" the way built-in content can. */
  isUserCard: boolean;
};
type ProgressRow = { box: number; nextDue: string };

/** A card with no progress row has never been studied, so it's due now. */
export function isDue(progress: ProgressRow | undefined, today = toDateOnly(new Date())): boolean {
  if (!progress) return true;
  return progress.nextDue <= today;
}

async function getProgressMap(userId: string): Promise<Map<string, ProgressRow>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("card_progress")
    .select("card_id, box, next_due")
    .eq("user_id", userId);

  const map = new Map<string, ProgressRow>();
  for (const row of data ?? []) {
    map.set(row.card_id, { box: row.box, nextDue: row.next_due });
  }
  return map;
}

function builtInDeck(ref: TopicRef): StudyCard[] {
  return loadFlashcards(ref).map((c) => ({
    cardId: `${topicId(ref)}#${c.id}`,
    front: c.front,
    back: c.back,
    box: 1,
    isUserCard: false,
  }));
}

async function userDeck(ref: TopicRef, userId: string): Promise<StudyCard[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_cards")
    .select("id, front, back")
    .eq("user_id", userId)
    .eq("subject", ref.subject)
    .eq("topic", topicId(ref));

  return (data ?? []).map((c) => ({
    cardId: `user:${c.id}`,
    front: c.front,
    back: c.back,
    box: 1,
    isUserCard: true,
  }));
}

/** The full deck for one topic, each card's box filled in from progress,
 * for the study screen's "X left" counter — includes cards not yet due. */
export async function getTopicDeck(ref: TopicRef, userId: string): Promise<StudyCard[]> {
  const [builtIn, user, progress] = await Promise.all([
    Promise.resolve(builtInDeck(ref)),
    userDeck(ref, userId),
    getProgressMap(userId),
  ]);
  return [...builtIn, ...user].map((c) => ({ ...c, box: progress.get(c.cardId)?.box ?? 1 }));
}

/** Just the due subset — the study queue for a topic's flashcard screen. */
export async function getDueCardsForTopic(ref: TopicRef, userId: string): Promise<StudyCard[]> {
  const deck = await getTopicDeck(ref, userId);
  const progress = await getProgressMap(userId);
  return deck.filter((c) => isDue(progress.get(c.cardId)));
}
