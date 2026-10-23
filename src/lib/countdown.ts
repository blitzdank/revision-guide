export type Countdown = {
  id: string;
  name: string;
  exam_at: string;
  all_day: boolean;
};

/** Whole calendar-day difference (local time), ignoring time-of-day. */
export function daysUntil(examAt: Date, now = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const examDay = new Date(examAt.getFullYear(), examAt.getMonth(), examAt.getDate());
  return Math.round((examDay.getTime() - today.getTime()) / 86_400_000);
}

export function isPast(countdown: Countdown, now = new Date()): boolean {
  const days = daysUntil(new Date(countdown.exam_at), now);
  if (days !== 0) return days < 0;
  // Same calendar day: an all-day countdown stays "today" all day; a timed
  // one is past once its time has gone.
  if (countdown.all_day) return false;
  return new Date(countdown.exam_at).getTime() <= now.getTime();
}

/** "3 days" / "Tomorrow" / "Today" / "2 hours" — section 6.6: days, and
 * hours on the final day. */
export function formatCountdown(countdown: Countdown, now = new Date()): string {
  const examAt = new Date(countdown.exam_at);
  const days = daysUntil(examAt, now);

  if (days > 1) return `${days} days`;
  if (days === 1) return "Tomorrow";
  if (days === 0) {
    if (countdown.all_day) return "Today";
    const msLeft = examAt.getTime() - now.getTime();
    if (msLeft <= 0) return "Today";
    const hours = Math.max(1, Math.round(msLeft / 3_600_000));
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }
  return "Done";
}

/** YYYY-MM-DD / HH:MM in local time, for pre-filling <input type="date/time">. */
export function toDateInputValue(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function toTimeInputValue(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
