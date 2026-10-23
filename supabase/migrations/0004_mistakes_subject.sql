-- Phase 4: the Mistakes bank filters by subject and topic (section 4),
-- which needs a structured subject on every row, not just a free-text
-- source/paper_ref. Topic is derived from question_id for quiz mistakes
-- (it's namespaced "subject/strand/topic#id") — real-paper mistakes don't
-- have a single topic, so there's no separate topic column.
alter table public.mistakes add column subject text;
