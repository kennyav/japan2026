-- Allow itinerary item authors to remove their own ideas (item_responses cascade).
create policy "Creators can delete their items"
  on public.itinerary_items for delete
  to authenticated
  using (created_by = auth.uid());
