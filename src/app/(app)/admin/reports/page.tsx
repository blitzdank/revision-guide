import { createClient } from "@/lib/supabase/server";
import { describeReportedItem } from "@/lib/content/resolve";
import { BackLink } from "@/components/back-link";
import { ReportRow } from "./report-row";

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from("reports")
    .select("id, item_type, item_id, reason, comment, created_at")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 pt-8 md:p-8">
      <BackLink href="/me" label="Me" />
      <h1 className="text-2xl font-bold text-text">Reports</h1>

      <div className="flex flex-col gap-3">
        {reports?.length ? (
          reports.map((report) => {
            const described = describeReportedItem(report.item_type, report.item_id);
            return (
              <ReportRow
                key={report.id}
                id={report.id}
                subjectName={described?.subjectName ?? "Unknown"}
                topicName={described?.topicName ?? report.item_id}
                detail={described?.detail ?? `${report.item_type}: ${report.item_id}`}
                reason={report.reason}
                comment={report.comment}
                createdAt={report.created_at}
              />
            );
          })
        ) : (
          <p className="rounded-2xl bg-surface p-5 text-sm text-muted shadow-sm">
            No open reports.
          </p>
        )}
      </div>
    </div>
  );
}
