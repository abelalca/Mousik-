-- =============================================================================
-- Online-only app: hearts and today's XP live on the server.
--
-- * hearts / hearts_updated_at are server-managed columns on profiles: the
--   learner can read them (table SELECT grant) but has no UPDATE privilege on
--   them (column grants only cover display_name, settings, onboarded, song).
-- * Refill rule (same as the old client code): max 5, +1 every 30 minutes,
--   counted from hearts_updated_at; the clock starts when the first heart of a
--   full set is lost.
-- * get_status() applies the refill and returns hearts + today's XP.
-- * lose_heart() applies the refill, then removes one heart (never below 0).
-- =============================================================================

alter table public.profiles
  add column hearts smallint not null default 5 check (hearts between 0 and 5),
  add column hearts_updated_at timestamptz not null default now();

-- Applies the time-based refill to the caller's row (locked) and returns it.
-- Private: only reachable through the SECURITY DEFINER functions below.
create or replace function private.refill_hearts(p_uid uuid)
returns public.profiles language plpgsql security definer set search_path = '' as $$
declare
  v_profile public.profiles;
  v_gained integer;
begin
  select * into v_profile from public.profiles where id = p_uid for update;
  if not found then raise exception 'unknown_profile'; end if;
  if v_profile.hearts < 5 then
    v_gained := floor(extract(epoch from (now() - v_profile.hearts_updated_at)) / 1800)::integer;
    if v_gained > 0 then
      update public.profiles
         set hearts = least(5, v_profile.hearts + v_gained),
             hearts_updated_at = v_profile.hearts_updated_at + make_interval(secs => v_gained * 1800)
       where id = p_uid
      returning * into v_profile;
    end if;
  end if;
  return v_profile;
end $$;

-- Hearts (after refill) and XP earned today in the learner's time zone.
create or replace function public.get_status(p_timezone text default 'UTC')
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_profile public.profiles;
  v_tz text;
  v_today_xp integer;
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;
  v_profile := private.refill_hearts(v_uid);

  v_tz := case when exists (select 1 from pg_catalog.pg_timezone_names where name = p_timezone)
               then p_timezone else 'UTC' end;
  select coalesce(sum(e.xp), 0)::integer into v_today_xp
    from public.xp_events e
   where e.user_id = v_uid
     and (e.created_at at time zone v_tz)::date = (now() at time zone v_tz)::date;

  return jsonb_build_object(
    'hearts', v_profile.hearts,
    'hearts_updated_at', v_profile.hearts_updated_at,
    'today_xp', v_today_xp
  );
end $$;

-- A wrong answer costs one heart.
create or replace function public.lose_heart()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_profile public.profiles;
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;
  v_profile := private.refill_hearts(v_uid);
  if v_profile.hearts > 0 then
    update public.profiles
       set hearts = v_profile.hearts - 1,
           -- the refill clock starts when a full set is first broken
           hearts_updated_at = case when v_profile.hearts = 5 then now() else v_profile.hearts_updated_at end
     where id = v_uid
    returning * into v_profile;
  end if;
  return jsonb_build_object('hearts', v_profile.hearts, 'hearts_updated_at', v_profile.hearts_updated_at);
end $$;

revoke execute on function private.refill_hearts(uuid) from public, anon, authenticated;
revoke execute on function public.get_status(text) from public, anon;
revoke execute on function public.lose_heart() from public, anon;
grant execute on function public.get_status(text) to authenticated;
grant execute on function public.lose_heart() to authenticated;
