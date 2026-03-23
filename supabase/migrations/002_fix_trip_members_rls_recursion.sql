-- trip_members policies queried trip_members again → infinite recursion.
-- Helpers run as SECURITY DEFINER and bypass RLS on the membership check.

create or replace function public.is_trip_member(_trip_id uuid, _user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.trip_members
    where trip_id = _trip_id and user_id = _user_id
  );
$$;

create or replace function public.is_trip_owner(_trip_id uuid, _user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.trip_members
    where trip_id = _trip_id
      and user_id = _user_id
      and role = 'owner'
  );
$$;

grant execute on function public.is_trip_member(uuid, uuid) to authenticated;
grant execute on function public.is_trip_owner(uuid, uuid) to authenticated;

drop policy if exists "Members can view trips" on public.trips;
drop policy if exists "Owners can update trips" on public.trips;

create policy "Members can view trips"
  on public.trips for select
  to authenticated
  using (public.is_trip_member(id, auth.uid()));

create policy "Owners can update trips"
  on public.trips for update
  to authenticated
  using (public.is_trip_owner(id, auth.uid()));

drop policy if exists "Members can view trip roster" on public.trip_members;
drop policy if exists "Owners can invite members" on public.trip_members;

create policy "Members can view trip roster"
  on public.trip_members for select
  to authenticated
  using (public.is_trip_member(trip_id, auth.uid()));

create policy "Owners can invite members"
  on public.trip_members for insert
  to authenticated
  with check (public.is_trip_owner(trip_id, auth.uid()));
