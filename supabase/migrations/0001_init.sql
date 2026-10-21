-- Revision Guide: initial schema (Phase 1 — Foundations)
-- Run this once in the Supabase SQL Editor (see SETUP.md). Safe to re-run
-- individual statements is NOT guaranteed; if you need to change something,
-- add a new 000N_*.sql migration instead of editing this file.

-- ---------------------------------------------------------------------------
-- profiles: one row per signed-in user, created automatically on sign up.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- Returns true if the current user is an admin. Used by policies below.
-- Plain SQL (not security definer): it only ever reads the caller's own
-- profiles row, which "profiles: read own" above already permits.
create function public.is_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- invites: invite-only sign up. One row per code. A trigger (below) checks
-- the code, creates the profile and marks the code used, all atomically with
-- the auth.users insert — so a bad or reused code aborts sign up entirely.
-- ---------------------------------------------------------------------------
create table public.invites (
  code text primary key,
  created_by uuid references auth.users (id),
  grants_role text not null default 'student' check (grants_role in ('student', 'admin')),
  used_by uuid references auth.users (id),
  used_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.invites enable row level security;

create policy "invites: admin reads all" on public.invites
  for select using (public.is_admin());

create policy "invites: admin creates" on public.invites
  for insert with check (public.is_admin());

create policy "invites: admin updates" on public.invites
  for update using (public.is_admin());

-- Creates the profile row and consumes the invite code when a new auth user
-- is inserted. raw_user_meta_data.invite_code is set by the sign-up form.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text := new.raw_user_meta_data ->> 'invite_code';
  v_invite public.invites;
begin
  if v_code is null or v_code = '' then
    raise exception 'An invite code is required to sign up.';
  end if;

  select * into v_invite from public.invites where code = v_code for update;

  if v_invite is null then
    raise exception 'That invite code was not recognised.';
  end if;

  if v_invite.used_by is not null then
    raise exception 'That invite code has already been used.';
  end if;

  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    v_invite.grants_role
  );

  update public.invites set used_by = new.id, used_at = now() where code = v_code;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Per-user study data. Every table is private to its owner (row level
-- security), enforced at the database, not just in the app.
-- ---------------------------------------------------------------------------
create table public.card_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  card_id text not null,
  box smallint not null default 1 check (box between 1 and 5),
  next_due date not null default current_date,
  last_seen timestamptz,
  unique (user_id, card_id)
);

create table public.user_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject text not null,
  topic text not null,
  front text not null,
  back text not null,
  created_at timestamptz not null default now()
);

create table public.user_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject text not null,
  topic text not null,
  body text not null,
  updated_at timestamptz not null default now()
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject text not null,
  scope text not null, -- topic, paper, or "subject" for a whole-subject mix
  score int not null,
  total int not null,
  taken_at timestamptz not null default now()
);

create table public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null,
  answer text,
  marks_awarded numeric,
  correct boolean,
  attempted_at timestamptz not null default now()
);

create table public.mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source text not null check (source in ('quiz', 'real_paper')),
  question_id text,
  paper_ref text,
  her_answer text,
  photo_path text,
  times_right smallint not null default 0,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now()
);

create table public.paper_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject text not null,
  year int not null,
  paper text not null,
  question_marks jsonb not null default '{}'::jsonb,
  total int not null default 0,
  max_total int not null default 0,
  created_at timestamptz not null default now()
);

create table public.countdowns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  exam_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.ai_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  message_count int not null default 0,
  primary key (user_id, date)
);

alter table public.card_progress enable row level security;
alter table public.user_cards enable row level security;
alter table public.user_notes enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.question_attempts enable row level security;
alter table public.mistakes enable row level security;
alter table public.paper_attempts enable row level security;
alter table public.countdowns enable row level security;
alter table public.ai_usage enable row level security;

create policy "card_progress: own rows" on public.card_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_cards: own rows" on public.user_cards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_notes: own rows" on public.user_notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "quiz_attempts: own rows" on public.quiz_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "question_attempts: own rows" on public.question_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "mistakes: own rows" on public.mistakes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "paper_attempts: own rows" on public.paper_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "countdowns: own rows" on public.countdowns
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "ai_usage: own rows" on public.ai_usage
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- reports: "Report a mistake" (section 6.7). Students can file and read
-- their own; only admins can see the full list and update status.
-- ---------------------------------------------------------------------------
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_type text not null, -- 'note' | 'flashcard' | 'question'
  item_id text not null,
  reason text not null check (reason in ('wrong_answer', 'typo', 'not_on_spec', 'confusing')),
  comment text,
  status text not null default 'open' check (status in ('open', 'fixed', 'dismissed')),
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "reports: insert own" on public.reports
  for insert with check (auth.uid() = user_id);

create policy "reports: read own or admin" on public.reports
  for select using (auth.uid() = user_id or public.is_admin());

create policy "reports: admin updates" on public.reports
  for update using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: photos attached to real-paper mistakes (section 6.4). Each file
-- is stored under a path starting with the owner's user id, e.g.
-- "<user_id>/2026-10-21-q5.jpg", which the policies below check.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('mistake-photos', 'mistake-photos', false)
on conflict (id) do nothing;

create policy "mistake-photos: owner read" on storage.objects
  for select using (
    bucket_id = 'mistake-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "mistake-photos: owner write" on storage.objects
  for insert with check (
    bucket_id = 'mistake-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "mistake-photos: owner delete" on storage.objects
  for delete using (
    bucket_id = 'mistake-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
