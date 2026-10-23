/** Leitner-style spaced repetition (section 6.1): 5 boxes, review intervals
 * roughly 1/2/4/8/16 days. "Not yet" always sends a card back to box 1. */
const BOX_INTERVAL_DAYS = [1, 2, 4, 8, 16];
export const MAX_BOX = BOX_INTERVAL_DAYS.length;

export function nextBox(currentBox: number, gotIt: boolean): number {
  if (!gotIt) return 1;
  return Math.min(currentBox + 1, MAX_BOX);
}

export function nextDueDate(box: number, from = new Date()): Date {
  const days = BOX_INTERVAL_DAYS[Math.min(Math.max(box, 1), MAX_BOX) - 1];
  const due = new Date(from);
  due.setDate(due.getDate() + days);
  return due;
}

/** YYYY-MM-DD in local time, matching the Postgres `date` column. */
export function toDateOnly(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
