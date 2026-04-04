-- Promote a card to the next box (capped at 8)
create or replace function public.promote_card(p_card_id int8)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.cards
  set box = least(box + 1, 8)
  where id = p_card_id;

  if not found then
    raise exception 'Card not found';
  end if;
end;
$$;

-- Demote a card to the previous box (floored at 0)
create or replace function public.demote_card(p_card_id int8)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.cards
  set box = greatest(box - 1, 0)
  where id = p_card_id;

  if not found then
    raise exception 'Card not found';
  end if;
end;
$$;

-- Get study cards: new cards + review cards, respecting per-session limits
create or replace function public.get_study_cards(p_deck_id int8)
returns setof public.cards
language sql
stable
security invoker
set search_path = ''
as $$
  (
    select * from public.cards
    where deck_id = p_deck_id and box = 0
    order by random()
    limit (select new_cards_per_session from public.decks where id = p_deck_id)
  )
  union all
  (
    select * from public.cards
    where deck_id = p_deck_id and box between 1 and 7
    order by random()
    limit (select review_cards_per_session from public.decks where id = p_deck_id)
  );
$$;

-- Get all cards in a specific box for a deck
create or replace function public.get_box_cards(p_deck_id int8, p_box int)
returns setof public.cards
language sql
stable
security invoker
set search_path = ''
as $$
  select * from public.cards
  where deck_id = p_deck_id and box = p_box
  order by random();
$$;

-- Get all decks with stats for the current user
create or replace function public.get_decks_with_stats()
returns table (
  id int8,
  user_id uuid,
  name text,
  description text,
  new_cards_per_session int,
  review_cards_per_session int,
  created_at timestamptz,
  total int,
  box_counts jsonb
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    d.id,
    d.user_id,
    d.name,
    d.description,
    d.new_cards_per_session,
    d.review_cards_per_session,
    d.created_at,
    coalesce(s.total, 0) as total,
    coalesce(s.box_counts, '{}'::jsonb) as box_counts
  from public.decks d
  left join public.deck_stats s on s.deck_id = d.id
  where d.user_id = (select auth.uid())
  order by d.created_at desc;
$$;
