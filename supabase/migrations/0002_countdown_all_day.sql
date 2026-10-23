-- Phase 2: exam countdowns. The time she enters is optional (section 6.6) —
-- all_day tracks whether exam_at's time-of-day is meaningful, so the
-- countdown can show "Today" instead of a misleading hour count when she
-- didn't give a time.
alter table public.countdowns add column all_day boolean not null default true;
