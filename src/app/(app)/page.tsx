import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SUBJECTS } from "@/lib/subjects";
import { SubjectCard } from "@/components/subject-card";
import { formatCountdown, isPast, type Countdown } from "@/lib/countdown";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = "";
  let nearestCountdown: Countdown | null = null;
  if (user) {
    const [{ data: profile }, { data: countdowns }] = await Promise.all([
      supabase.from("profiles").select("display_name").eq("id", user.id).single(),
      supabase
        .from("countdowns")
        .select("id, name, exam_at, all_day")
        .order("exam_at", { ascending: true }),
    ]);
    displayName = profile?.display_name ?? "";
    nearestCountdown = ((countdowns as Countdown[] | null) ?? []).find((c) => !isPast(c)) ?? null;
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 pt-8 md:p-8">
      <h1 className="text-2xl font-bold text-text">
        {displayName ? `Hey, ${displayName}` : "Hey"}
      </h1>

      <Link href="/countdowns" className="rounded-2xl bg-surface p-5 shadow-sm">
        <p className="text-sm text-muted">Next exam</p>
        {nearestCountdown ? (
          <p className="mt-1 flex items-baseline justify-between gap-3">
            <span className="truncate font-semibold text-text">{nearestCountdown.name}</span>
            <span className="shrink-0 font-semibold text-pink-strong">
              {formatCountdown(nearestCountdown)}
            </span>
          </p>
        ) : (
          <p className="mt-1 font-semibold text-text">No countdowns yet — tap to add one</p>
        )}
      </Link>

      <div className="grid grid-cols-2 gap-4">
        <section className="rounded-2xl bg-yellow/40 p-5">
          <p className="text-sm text-yellow-strong">Due today</p>
          <p className="mt-1 text-2xl font-bold text-text">0</p>
        </section>
        <section className="rounded-2xl bg-pink/25 p-5">
          <p className="text-sm text-pink-strong">Mistakes bank</p>
          <p className="mt-1 text-2xl font-bold text-text">0</p>
        </section>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted">Subjects</h2>
        <div className="flex flex-col gap-3">
          {SUBJECTS.map((subject) => (
            <SubjectCard key={subject.slug} subject={subject} />
          ))}
        </div>
      </section>
    </div>
  );
}
