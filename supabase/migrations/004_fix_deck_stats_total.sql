create or replace view public.deck_stats
with (security_invoker = on)
as
select
  deck_id,
  sum(cnt)::int as total,
  jsonb_object_agg(box, cnt) as box_counts
from (
  select deck_id, box, count(*)::int as cnt
  from public.cards
  group by deck_id, box
) sub
group by deck_id;
