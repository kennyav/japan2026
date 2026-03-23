-- Optional cost hints for itinerary ideas (1–4 $ = relative spend, optional amounts).
alter table public.itinerary_items
  add column if not exists price_level smallint,
  add column if not exists total_cost numeric(12, 2);

alter table public.itinerary_items
  add constraint itinerary_items_price_level_range
  check (
    price_level is null
    or (price_level >= 1 and price_level <= 4)
  );

comment on column public.itinerary_items.price_level is 'Relative cost 1–4 ($ to $$$$); null if unset';
comment on column public.itinerary_items.total_cost is 'Optional total estimated cost';
