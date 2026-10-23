-- Phase 4: mistakes bank. "Items leave the bank after she gets them right
-- twice on separate days" (section 6.4) needs to know which calendar day
-- the last correct retry/mark-as-understood happened on, so two clicks in
-- the same session don't both count.
alter table public.mistakes add column last_correct_date date;
