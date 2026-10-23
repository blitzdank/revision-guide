"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function setReportStatus(reportId: string, status: "fixed" | "dismissed") {
  const supabase = await createClient();
  await supabase.from("reports").update({ status }).eq("id", reportId);
  revalidatePath("/admin/reports");
}
