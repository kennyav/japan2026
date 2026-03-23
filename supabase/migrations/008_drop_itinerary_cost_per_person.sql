-- Per-person cost is derived from total_cost and trip / response counts in the app.
alter table public.itinerary_items
  drop column if exists cost_per_person;
