-- Trip INSERT uses .select() after insert; SELECT policy must allow the creator
-- to read the row (not only is_trip_member, which can be flaky with RETURNING timing).
-- Also grant table DML to authenticated (SQL migrations often omit Supabase dashboard defaults).

grant usage on schema public to authenticated;

grant select, insert, update, delete on public.trips to authenticated;
grant select, insert, update, delete on public.trip_members to authenticated;
grant select, insert, update, delete on public.itinerary_items to authenticated;
grant select, insert, update, delete on public.item_responses to authenticated;
grant select, insert, update on public.profiles to authenticated;

drop policy if exists "Members can view trips" on public.trips;

create policy "Members can view trips"
  on public.trips for select
  to authenticated
  using (
    created_by = auth.uid()
    or public.is_trip_member(id, auth.uid())
  );
