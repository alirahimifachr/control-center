-- Decks table
create table public.decks (
  id int8 generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  new_cards_per_session int not null default 10,
  review_cards_per_session int not null default 20,
  created_at timestamptz not null default now()
);

alter table public.decks enable row level security;

create policy "Users manage own decks"
  on public.decks for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Cards table
create table public.cards (
  id int8 generated always as identity primary key,
  deck_id int8 not null references public.decks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  box int not null default 0 check (box >= 0 and box <= 8),
  front text not null,
  back text not null,
  tags jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table public.cards enable row level security;

create policy "Users manage own cards"
  on public.cards for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create index cards_deck_id_box_idx on public.cards (deck_id, box);
