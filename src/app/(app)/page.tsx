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
  let mistakesCount = 0;
  if (user) {
    const [{ data: profile }, { data: countdowns }, { count }] = await Promise.all([
      supabase.from("profiles").select("display_name").eq("id", user.id).single(),
      supabase
        .from("countdowns")
        .select("id, name, exam_at, all_day")
        .order("exam_at", { ascending: true }),
      supabase
        .from("mistakes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "open"),
    ]);
    displayName = profile?.display_name ?? "";
    nearestCountdown = ((countdowns as Countdown[] | null) ?? []).find((c) => !isPast(c)) ?? null;
    mistakesCount = count ?? 0;
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

      <Link href="/mistakes" className="rounded-2xl bg-pink/25 p-5">
        <p className="text-sm text-pink-strong">Mistakes bank</p>
        <p className="mt-1 text-2xl font-bold text-text">{mistakesCount}</p>
      </Link>

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
