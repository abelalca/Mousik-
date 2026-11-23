-- =============================================================================
-- Mousik core schema
--
-- Security model
--   * Row Level Security on every table, deny by default.
--   * Learners can READ only their own rows.
--   * Learners can WRITE only harmless profile fields (name, settings, onboarded).
--   * XP, streaks and lesson progress are written ONLY by SECURITY DEFINER
--     functions that validate the request (server-authoritative progress).
--   * The anon role (not signed in) gets no access to any table.
-- =============================================================================

-- ---------- defence in depth: no implicit grants for anon / public ----------
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public revoke execute on functions from public, anon;

-- Private schema for helpers that must never be callable through the API.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- -----------------------------------------------------------------------------
-- Lesson catalog: what the server knows about each lesson (filled by migrations).
-- -----------------------------------------------------------------------------
create table public.lessons (
  id             text primary key check (id ~ '^u[0-9]+-[a-z0-9-]+$'),
  position       integer not null unique check (position > 0),
  exercise_count integer not null check (exercise_count between 1 and 100),
  -- Fastest plausible completion; faster submissions are rejected as automated.
  min_seconds    integer not null default 30 check (min_seconds >= 0),
  xp_base        integer not null default 10 check (xp_base between 0 and 100),
  xp_perfect     integer not null default 5 check (xp_perfect between 0 and 100)
);
alter table public.lessons enable row level security;
revoke all on public.lessons from anon, authenticated;
grant select on public.lessons to authenticated;
create policy "Signed-in users can read the lesson catalog"
  on public.lessons for select to authenticated using (true);

-- -----------------------------------------------------------------------------
-- Profiles: one row per user, created automatically on sign-up.
-- -----------------------------------------------------------------------------
create or replace function private.valid_settings(s jsonb)
returns boolean language sql immutable set search_path = '' as $$
  select jsonb_typeof(s) = 'object'
     and pg_column_size(s) <= 2048
     -- only known keys
     and (select coalesce(bool_and(k in ('locale', 'notation', 'genre', 'sound', 'dailyGoal')), true)
            from jsonb_object_keys(s) as k)
     and (not s ? 'locale'    or s->>'locale'   in ('en', 'es'))
     and (not s ? 'notation'  or s->>'notation' in ('letters', 'solfege'))
     and (not s ? 'genre'     or s->>'genre'    in ('classical', 'pop', 'rock'))
     and (not s ? 'sound'     or jsonb_typeof(s->'sound') = 'boolean')
     and (not s ? 'dailyGoal' or (jsonb_typeof(s->'dailyGoal') = 'number'
                                  and (s->>'dailyGoal')::numeric in (10, 20, 30, 50)));
$$;

create table public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  display_name     text check (display_name is null or char_length(display_name) between 1 and 30),
  settings         jsonb not null default '{}'::jsonb check (private.valid_settings(settings)),
  onboarded        boolean not null default false,
  -- server-managed (not writable by users)
  xp               integer not null default 0 check (xp >= 0),
  streak           integer not null default 0 check (streak >= 0),
  last_active_date date,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
-- Column-level privilege: users may only change these three columns.
grant update (display_name, settings, onboarded) on public.profiles to authenticated;

create policy "Users read their own profile"
  on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Users update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create or replace function private.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;
create trigger profiles_touch before update on public.profiles
  for each row execute function private.touch_updated_at();

-- Create the profile when an auth user is created.
create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function private.handle_new_user();

-- -----------------------------------------------------------------------------
-- Lesson attempts: issued by start_lesson(), closed by complete_lesson().
-- -----------------------------------------------------------------------------
create table public.lesson_attempts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  lesson_id    text not null references public.lessons (id),
  started_at   timestamptz not null default now(),
  completed_at timestamptz
);
create index lesson_attempts_user_started on public.lesson_attempts (user_id, started_at desc);
alter table public.lesson_attempts enable row level security;
revoke all on public.lesson_attempts from anon, authenticated;
grant select on public.lesson_attempts to authenticated;
create policy "Users read their own attempts"
  on public.lesson_attempts for select to authenticated using ((select auth.uid()) = user_id);

-- -----------------------------------------------------------------------------
-- Lesson progress (best result per lesson) and XP ledger (audit trail).
-- -----------------------------------------------------------------------------
create table public.lesson_progress (
  user_id            uuid not null references auth.users (id) on delete cascade,
  lesson_id          text not null references public.lessons (id),
  best_accuracy      smallint not null check (best_accuracy between 0 and 100),
  times_completed    integer not null default 1 check (times_completed > 0),
  first_completed_at timestamptz not null default now(),
  last_completed_at  timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
alter table public.lesson_progress enable row level security;
revoke all on public.lesson_progress from anon, authenticated;
grant select on public.lesson_progress to authenticated;
create policy "Users read their own progress"
  on public.lesson_progress for select to authenticated using ((select auth.uid()) = user_id);

create table public.xp_events (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  attempt_id uuid not null unique references public.lesson_attempts (id) on delete cascade,
  lesson_id  text not null references public.lessons (id),
  xp         integer not null check (xp >= 0),
  accuracy   smallint not null check (accuracy between 0 and 100),
  created_at timestamptz not null default now()
);
create index xp_events_user on public.xp_events (user_id, created_at desc);
alter table public.xp_events enable row level security;
revoke all on public.xp_events from anon, authenticated;
grant select on public.xp_events to authenticated;
create policy "Users read their own XP history"
  on public.xp_events for select to authenticated using ((select auth.uid()) = user_id);

-- =============================================================================
-- API functions (the only way to change progress)
-- Errors use SQLSTATE P0001 with a stable message the client can translate.
-- =============================================================================

-- Starts a lesson attempt. Enforces sign-in, unlock order and a rate limit.
create or replace function public.start_lesson(p_lesson_id text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_lesson public.lessons;
  v_attempt uuid;
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;

  select * into v_lesson from public.lessons where id = p_lesson_id;
  if not found then raise exception 'unknown_lesson'; end if;

  -- every earlier lesson must be completed
  if exists (
    select 1 from public.lessons l
    where l.position < v_lesson.position
      and not exists (select 1 from public.lesson_progress p where p.user_id = v_uid and p.lesson_id = l.id)
  ) then
    raise exception 'lesson_locked';
  end if;

  -- rate limit: 30 attempts per hour per user
  if (select count(*) from public.lesson_attempts
      where user_id = v_uid and started_at > now() - interval '1 hour') >= 30 then
    raise exception 'rate_limited';
  end if;

  insert into public.lesson_attempts (user_id, lesson_id) values (v_uid, p_lesson_id)
  returning id into v_attempt;
  return v_attempt;
end $$;

-- Completes an attempt: validates it, then awards XP and updates streak/progress.
create or replace function public.complete_lesson(
  p_attempt_id uuid,
  p_correct integer,   -- exercises answered right on the first try
  p_total integer,     -- exercises in the lesson as played
  p_timezone text default 'UTC'
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_attempt public.lesson_attempts;
  v_lesson public.lessons;
  v_profile public.profiles;
  v_tz text;
  v_today date;
  v_accuracy smallint;
  v_xp integer;
  v_streak integer;
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;

  select * into v_attempt from public.lesson_attempts
   where id = p_attempt_id and user_id = v_uid
   for update;
  if not found then raise exception 'unknown_attempt'; end if;
  if v_attempt.completed_at is not null then raise exception 'attempt_already_completed'; end if;
  -- attempts can be submitted later (offline), but not forever
  if v_attempt.started_at < now() - interval '7 days' then raise exception 'attempt_expired'; end if;

  select * into v_lesson from public.lessons where id = v_attempt.lesson_id;
  if p_total is null or p_total < 1 or p_total > v_lesson.exercise_count
     or p_correct is null or p_correct < 0 or p_correct > p_total then
    raise exception 'invalid_score';
  end if;
  if now() - v_attempt.started_at < make_interval(secs => v_lesson.min_seconds) then
    raise exception 'too_fast';
  end if;

  v_tz := case when exists (select 1 from pg_catalog.pg_timezone_names where name = p_timezone)
               then p_timezone else 'UTC' end;
  v_today := (now() at time zone v_tz)::date;
  v_accuracy := round(100.0 * p_correct / p_total);
  v_xp := v_lesson.xp_base + case when p_correct = p_total then v_lesson.xp_perfect else 0 end;

  update public.lesson_attempts set completed_at = now() where id = v_attempt.id;

  insert into public.lesson_progress as lp (user_id, lesson_id, best_accuracy)
  values (v_uid, v_lesson.id, v_accuracy)
  on conflict (user_id, lesson_id) do update
    set best_accuracy = greatest(lp.best_accuracy, excluded.best_accuracy),
        times_completed = lp.times_completed + 1,
        last_completed_at = now();

  insert into public.xp_events (user_id, attempt_id, lesson_id, xp, accuracy)
  values (v_uid, v_attempt.id, v_lesson.id, v_xp, v_accuracy);

  select * into v_profile from public.profiles where id = v_uid for update;
  v_streak := case
    when v_profile.last_active_date = v_today then greatest(v_profile.streak, 1)
    when v_profile.last_active_date = v_today - 1 then v_profile.streak + 1
    else 1 end;

  update public.profiles
     set xp = xp + v_xp, streak = v_streak, last_active_date = v_today
   where id = v_uid
  returning * into v_profile;

  return jsonb_build_object(
    'xp', v_xp, 'accuracy', v_accuracy,
    'total_xp', v_profile.xp, 'streak', v_profile.streak,
    'last_active_date', v_profile.last_active_date
  );
end $$;

-- Permanently deletes the caller's account and, by cascade, all their data.
-- (Required by the App Store: users must be able to delete their account in-app.)
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;
  delete from auth.users where id = v_uid;
end $$;

revoke execute on function public.start_lesson(text) from public, anon;
revoke execute on function public.complete_lesson(uuid, integer, integer, text) from public, anon;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.start_lesson(text) to authenticated;
grant execute on function public.complete_lesson(uuid, integer, integer, text) to authenticated;
grant execute on function public.delete_my_account() to authenticated;
