import { SUBJECTS } from "@/lib/subjects";
import { SubjectCard } from "@/components/subject-card";

export default function SubjectsPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4 pt-8 md:p-8">
      <h1 className="text-2xl font-bold text-text">Subjects</h1>
      <div className="flex flex-col gap-3">
        {SUBJECTS.map((subject) => (
          <SubjectCard key={subject.slug} subject={subject} />
        ))}
      </div>
    </div>
  );
}
