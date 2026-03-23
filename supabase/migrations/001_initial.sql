-- Group travel planner: profiles, trips, members, itinerary, per-user responses.
-- Run in Supabase SQL Editor or via `supabase db push` after linking a project.

-- -----------------------------------------------------------------------------
-- Profiles (synced from auth; Google fills raw_user_meta_data)
-- -----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are readable by signed-in users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can insert their profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Trips & membership
-- -----------------------------------------------------------------------------
create type public.trip_member_role as enum ('owner', 'member');

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  destination text,
  start_date date,
  end_date date,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now()
);

create table public.trip_members (
  trip_id uuid not null references public.trips (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.trip_member_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);

create or replace function public.add_trip_owner_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.trip_members (trip_id, user_id, role)
  values (new.id, new.created_by, 'owner');
  return new;
end;
$$;

create trigger on_trip_created_add_owner
  after insert on public.trips
  for each row execute function public.add_trip_owner_member();

alter table public.trips enable row level security;
alter table public.trip_members enable row level security;

-- Membership checks must not query trip_members inside RLS on trip_members (infinite recursion).
-- SECURITY DEFINER helpers read trip_members with owner privileges (no RLS re-entry).
create or replace function public.is_trip_member(_trip_id uuid, _user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.trip_members
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
    select 1 from public.trip_members
    where trip_id = _trip_id
      and user_id = _user_id
      and role = 'owner'
  );
$$;

grant execute on function public.is_trip_member(uuid, uuid) to authenticated;
grant execute on function public.is_trip_owner(uuid, uuid) to authenticated;

create policy "Members can view trips"
  on public.trips for select
  to authenticated
  using (
    created_by = auth.uid()
    or public.is_trip_member(id, auth.uid())
  );

create policy "Users can create trips"
  on public.trips for insert
  to authenticated
  with check (auth.uid() = created_by);

create policy "Owners can update trips"
  on public.trips for update
  to authenticated
  using (public.is_trip_owner(id, auth.uid()));

create policy "Members can view trip roster"
  on public.trip_members for select
  to authenticated
  using (public.is_trip_member(trip_id, auth.uid()));

create policy "Owners can invite members"
  on public.trip_members for insert
  to authenticated
  with check (public.is_trip_owner(trip_id, auth.uid()));

-- -----------------------------------------------------------------------------
-- Itinerary & responses (interested | booked | not_interested)
-- -----------------------------------------------------------------------------
create type public.itinerary_item_type as enum (
  'activity',
  'hotel',
  'transport',
  'meal',
  'other'
);

create type public.item_response_status as enum (
  'interested',
  'booked',
  'not_interested'
);

create table public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  type public.itinerary_item_type not null default 'activity',
  title text not null,
  description text,
  location text,
  starts_at timestamptz,
  ends_at timestamptz,
  link text,
  sort_order int not null default 0,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table public.item_responses (
  item_id uuid not null references public.itinerary_items (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  status public.item_response_status not null,
  updated_at timestamptz not null default now(),
  primary key (item_id, user_id)
);

alter table public.itinerary_items enable row level security;
alter table public.item_responses enable row level security;

create policy "Members can view itinerary"
  on public.itinerary_items for select
  to authenticated
  using (
    exists (
      select 1 from public.trip_members m
      where m.trip_id = itinerary_items.trip_id and m.user_id = auth.uid()
    )
  );

create policy "Members can add itinerary items"
  on public.itinerary_items for insert
  to authenticated
  with check (
    exists (
      select 1 from public.trip_members m
      where m.trip_id = itinerary_items.trip_id and m.user_id = auth.uid()
    )
  );

create policy "Creators can update their items"
  on public.itinerary_items for update
  to authenticated
  using (created_by = auth.uid());

create policy "Members can view responses"
  on public.item_responses for select
  to authenticated
  using (
    exists (
      select 1
      from public.itinerary_items i
      join public.trip_members m on m.trip_id = i.trip_id
      where i.id = item_responses.item_id and m.user_id = auth.uid()
    )
  );

create policy "Members can upsert own responses"
  on public.item_responses for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.itinerary_items i
      join public.trip_members m on m.trip_id = i.trip_id
      where i.id = item_responses.item_id and m.user_id = auth.uid()
    )
  );

create policy "Members can update own responses"
  on public.item_responses for update
  to authenticated
  using (auth.uid() = user_id);

create index itinerary_items_trip_id_idx on public.itinerary_items (trip_id);
create index item_responses_item_id_idx on public.item_responses (item_id);

-- App access for JWT-authenticated users (needed when applying schema via SQL only)
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.trips to authenticated;
grant select, insert, update, delete on public.trip_members to authenticated;
grant select, insert, update, delete on public.itinerary_items to authenticated;
grant select, insert, update, delete on public.item_responses to authenticated;
grant select, insert, update on public.profiles to authenticated;

create or replace function public.add_trip_member_by_email(p_trip_id uuid, p_email text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target uuid;
  v_me uuid := auth.uid();
  v_norm text := lower(trim(p_email));
begin
  if v_me is null then
    return jsonb_build_object('ok', false, 'error', 'not_authenticated');
  end if;

  if v_norm = '' then
    return jsonb_build_object('ok', false, 'error', 'empty_email');
  end if;

  if not public.is_trip_owner(p_trip_id, v_me) then
    return jsonb_build_object('ok', false, 'error', 'not_owner');
  end if;

  select id into v_target
  from auth.users
  where lower(trim(email::text)) = v_norm;

  if v_target is null then
    return jsonb_build_object('ok', false, 'error', 'user_not_found');
  end if;

  if exists (
    select 1 from public.trip_members
    where trip_id = p_trip_id and user_id = v_target
  ) then
    return jsonb_build_object('ok', false, 'error', 'already_member');
  end if;

  insert into public.trip_members (trip_id, user_id, role)
  values (p_trip_id, v_target, 'member');

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.add_trip_member_by_email(uuid, text) to authenticated;
