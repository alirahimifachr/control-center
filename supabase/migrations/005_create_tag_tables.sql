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
