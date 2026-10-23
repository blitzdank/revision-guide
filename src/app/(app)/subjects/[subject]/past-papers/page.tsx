import { notFound } from "next/navigation";
import { getSubject } from "@/lib/subjects";
import { loadAllPastPapers } from "@/lib/content/load";
import { createClient } from "@/lib/supabase/server";
import { PastPapersManager } from "./past-papers-manager";
import { BackLink } from "@/components/back-link";

export default async function PastPapersPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: subjectSlug } = await params;
  const subject = getSubject(subjectSlug);
  if (!subject) notFound();

  const groups = loadAllPastPapers(subjectSlug, subject.strands);
  if (groups.length === 0) notFound();

  const papers = groups.flatMap((g) =>
    g.spec.papers.map((p) => ({
      strandName: g.strandName,
      label: g.strandName ? `${g.strandName} — ${p.name}` : p.name,
      specUrl: g.spec.specUrl,
    })),
  );

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let attempts: { id: string; year: number; paper: string; total: number; max_total: number }[] = [];
  if (user) {
    const { data } = await supabase
      .from("paper_attempts")
      .select("id, year, paper, total, max_total")
      .eq("user_id", user.id)
      .eq("subject", subjectSlug)
      .order("created_at", { ascending: false });
    attempts = data ?? [];
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 pt-8 md:p-8">
      <BackLink href={`/subjects/${subjectSlug}`} label={subject.name} />
      <div>
        <p className="text-sm text-muted">{subject.name}</p>
        <h1 className="text-2xl font-bold text-text">Past papers</h1>
      </div>
      <PastPapersManager subjectSlug={subjectSlug} papers={papers} attempts={attempts} />
    </div>
  );
}
