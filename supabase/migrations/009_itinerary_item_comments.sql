-- Threaded discussion per itinerary idea (main trip page modal).
create table public.itinerary_item_comments (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.itinerary_items (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  constraint itinerary_item_comments_body_trimmed check (length(trim(body)) > 0),
  constraint itinerary_item_comments_body_len check (length(body) <= 4000)
);

create index itinerary_item_comments_item_id_created_idx
  on public.itinerary_item_comments (item_id, created_at desc);

alter table public.itinerary_item_comments enable row level security;

create policy "Trip members can view item comments"
  on public.itinerary_item_comments for select
  to authenticated
  using (
    exists (
      select 1
      from public.itinerary_items i
      join public.trip_members m on m.trip_id = i.trip_id
      where i.id = itinerary_item_comments.item_id
        and m.user_id = auth.uid()
    )
  );

create policy "Trip members can add item comments"
  on public.itinerary_item_comments for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.itinerary_items i
      join public.trip_members m on m.trip_id = i.trip_id
      where i.id = itinerary_item_comments.item_id
        and m.user_id = auth.uid()
    )
  );

create policy "Users can delete own item comments"
  on public.itinerary_item_comments for delete
  to authenticated
  using (user_id = auth.uid());

grant select, insert, delete on public.itinerary_item_comments to authenticated;
