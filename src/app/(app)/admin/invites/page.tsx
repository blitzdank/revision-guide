import { createClient } from "@/lib/supabase/server";
import { CreateInviteForm } from "./create-invite-form";

export default async function AdminInvitesPage() {
  const supabase = await createClient();
  const { data: invites } = await supabase
    .from("invites")
    .select("code, grants_role, used_by, used_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 pt-8 md:p-8">
      <h1 className="text-2xl font-bold text-text">Invite codes</h1>
      <CreateInviteForm />

      <div className="flex flex-col divide-y divide-black/5 rounded-2xl bg-surface shadow-sm">
        {invites?.length ? (
          invites.map((invite) => (
            <div key={invite.code} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="font-mono font-semibold text-text">{invite.code}</p>
                <p className="text-xs text-muted">
                  {invite.grants_role} ·{" "}
                  {invite.used_at
                    ? `used ${new Date(invite.used_at).toLocaleDateString()}`
                    : "unused"}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  invite.used_by
                    ? "bg-muted/15 text-muted"
                    : "bg-correct/15 text-correct"
                }`}
              >
                {invite.used_by ? "Used" : "Available"}
              </span>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-muted">No invite codes yet.</p>
        )}
      </div>
    </div>
  );
}
