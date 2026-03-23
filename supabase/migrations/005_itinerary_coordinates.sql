-- Optional map coordinates for itinerary pins (globe / future maps).
alter table public.itinerary_items
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;

comment on column public.itinerary_items.latitude is 'WGS84 latitude; null if not placed on map';
comment on column public.itinerary_items.longitude is 'WGS84 longitude; null if not placed on map';
