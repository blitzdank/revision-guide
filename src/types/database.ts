/**
 * Hand-written types for the tables used so far (see
 * supabase/migrations/0001_init.sql). Extend this as later phases add
 * tables — or regenerate from the live project with the Supabase CLI
 * (`supabase gen types typescript`) once SETUP.md's project is linked.
 */
export type Profile = {
  id: string;
  display_name: string | null;
  role: "student" | "admin";
  theme: "light" | "dark" | "system";
  created_at: string;
};

export type Invite = {
  code: string;
  created_by: string | null;
  grants_role: "student" | "admin";
  used_by: string | null;
  used_at: string | null;
  created_at: string;
};
