import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../../(auth)/actions";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function MePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("display_name, role")
        .eq("id", user.id)
        .single()
    : { data: null };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 pt-8 md:p-8">
      <h1 className="text-2xl font-bold text-text">Me</h1>

      <section className="rounded-2xl bg-surface p-5 shadow-sm">
        <p className="font-semibold text-text">{profile?.display_name ?? "You"}</p>
        <p className="text-sm text-muted">{user?.email}</p>
      </section>

      <section className="rounded-2xl bg-surface p-5 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-muted">Theme</p>
        <ThemeToggle />
      </section>

      {profile?.role === "admin" && (
        <Link
          href="/admin/invites"
          className="rounded-2xl bg-yellow/35 p-5 font-semibold text-yellow-strong shadow-sm"
        >
          Manage invite codes →
        </Link>
      )}

      <form action={signOut}>
        <button
          type="submit"
          className="w-full rounded-full border border-black/10 px-4 py-3 text-base font-semibold text-text"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
