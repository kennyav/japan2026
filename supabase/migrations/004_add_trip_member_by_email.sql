-- Owners can add members by Google account email (user must exist in auth.users).

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
