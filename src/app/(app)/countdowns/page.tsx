import { createClient } from "@/lib/supabase/server";
import { isPast, type Countdown } from "@/lib/countdown";
import { CountdownsManager } from "./countdowns-manager";

export default async function CountdownsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("countdowns")
    .select("id, name, exam_at, all_day")
    .order("exam_at", { ascending: true });

  const countdowns = (data ?? []) as Countdown[];
  const upcoming = countdowns.filter((c) => !isPast(c));
  const done = countdowns.filter((c) => isPast(c)).reverse();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4 pt-8 md:p-8">
      <h1 className="text-2xl font-bold text-text">Exam countdowns</h1>
      <CountdownsManager upcoming={upcoming} done={done} />
    </div>
  );
}
