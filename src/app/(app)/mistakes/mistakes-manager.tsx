"use client";

import { useMemo, useState } from "react";
import { MistakeCard } from "./mistake-card";
import type { MistakeView } from "@/lib/mistakes";

export function MistakesManager({
  mistakes,
  aiEnabled,
}: {
  mistakes: MistakeView[];
  aiEnabled: boolean;
}) {
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");

  const subjects = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of mistakes) if (m.subjectSlug) map.set(m.subjectSlug, m.subjectName);
    return [...map.entries()];
  }, [mistakes]);

  const topics = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of mistakes) {
      if (m.topicSlug && (subjectFilter === "all" || m.subjectSlug === subjectFilter)) {
        map.set(m.topicSlug, m.topicName ?? m.topicSlug);
      }
    }
    return [...map.entries()];
  }, [mistakes, subjectFilter]);

  const filtered = mistakes.filter((m) => {
    if (subjectFilter !== "all" && m.subjectSlug !== subjectFilter) return false;
    if (topicFilter !== "all" && m.topicSlug !== topicFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      {subjects.length > 1 && (
        <div className="flex gap-2">
          <select
            value={subjectFilter}
            onChange={(e) => {
              setSubjectFilter(e.target.value);
              setTopicFilter("all");
            }}
            className="rounded-xl border border-black/10 bg-surface px-3 py-2 text-sm text-text"
          >
            <option value="all">All subjects</option>
            {subjects.map(([slug, name]) => (
              <option key={slug} value={slug}>
                {name}
              </option>
            ))}
          </select>
          {topics.length > 1 && (
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="rounded-xl border border-black/10 bg-surface px-3 py-2 text-sm text-text"
            >
              <option value="all">All topics</option>
              {topics.map(([slug, name]) => (
                <option key={slug} value={slug}>
                  {name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-surface p-5 text-sm text-muted shadow-sm">
          {mistakes.length === 0
            ? "Nothing here yet. Wrong quiz answers and real-paper questions you drop marks on land here automatically."
            : "No mistakes match this filter."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((mistake) => (
            <MistakeCard key={mistake.id} mistake={mistake} aiEnabled={aiEnabled} />
          ))}
        </div>
      )}
    </div>
  );
}
