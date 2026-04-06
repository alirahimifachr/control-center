-- Tags table
create table public.tags (
  id int8 generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

alter table public.tags enable row level security;

create policy "Users manage own tags"
  on public.tags for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Card-Tag junction table
create table public.card_tags (
  card_id int8 not null references public.cards(id) on delete cascade,
  tag_id int8 not null references public.tags(id) on delete cascade,
  primary key (card_id, tag_id)
);

alter table public.card_tags enable row level security;

create policy "Users manage own card_tags"
  on public.card_tags for all
  using (
    exists (select 1 from public.cards where id = card_id and user_id = (select auth.uid()))
  )
  with check (
    exists (select 1 from public.cards where id = card_id and user_id = (select auth.uid()))
  );

-- Drop legacy jsonb tags column from cards
alter table public.cards drop column tags;

-- Helper: get tags for a card as a jsonb array
create or replace function public.get_card_tags(p_card_id int8)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(
    jsonb_agg(jsonb_build_object(
      'id', t.id,
      'user_id', t.user_id,
      'name', t.name,
      'created_at', t.created_at
    ) order by t.name),
    '[]'::jsonb
  )
  from public.card_tags ct
  join public.tags t on t.id = ct.tag_id
  where ct.card_id = p_card_id;
$$;

-- Update get_study_cards to include tags
create or replace function public.get_study_cards(p_deck_id int8)
returns table (
  id int8,
  deck_id int8,
  user_id uuid,
  box int,
  front text,
  back text,
  created_at timestamptz,
  tags jsonb
)
language sql
stable
security invoker
set search_path = ''
as $$
  select c.id, c.deck_id, c.user_id, c.box, c.front, c.back, c.created_at,
         public.get_card_tags(c.id) as tags
  from (
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
    )
  ) c;
$$;

-- Update get_box_cards to include tags
create or replace function public.get_box_cards(p_deck_id int8, p_box int)
returns table (
  id int8,
  deck_id int8,
  user_id uuid,
  box int,
  front text,
  back text,
  created_at timestamptz,
  tags jsonb
)
language sql
stable
security invoker
set search_path = ''
as $$
  select c.id, c.deck_id, c.user_id, c.box, c.front, c.back, c.created_at,
         public.get_card_tags(c.id) as tags
  from public.cards c
  where c.deck_id = p_deck_id and c.box = p_box
  order by random();
$$;

-- Get all cards for a deck with tags
create or replace function public.get_cards(p_deck_id int8)
returns table (
  id int8,
  deck_id int8,
  user_id uuid,
  box int,
  front text,
  back text,
  created_at timestamptz,
  tags jsonb
)
language sql
stable
security invoker
set search_path = ''
as $$
  select c.id, c.deck_id, c.user_id, c.box, c.front, c.back, c.created_at,
         public.get_card_tags(c.id) as tags
  from public.cards c
  where c.deck_id = p_deck_id
  order by c.created_at desc;
$$;

-- Get a single card with tags
create or replace function public.get_card(p_card_id int8)
returns table (
  id int8,
  deck_id int8,
  user_id uuid,
  box int,
  front text,
  back text,
  created_at timestamptz,
  tags jsonb
)
language sql
stable
security invoker
set search_path = ''
as $$
  select c.id, c.deck_id, c.user_id, c.box, c.front, c.back, c.created_at,
         public.get_card_tags(c.id) as tags
  from public.cards c
  where c.id = p_card_id;
$$;
