-- =============================================================================
-- "Your song": the piece each learner builds one creative step per lesson.
--
-- Stored as a small JSON document on the learner's own profile. It is creative
-- content (no right or wrong answers, no XP), so the learner may write it
-- directly — but only in a strict, size-limited shape validated below.
--
-- Note: the validator must not call other functions in the private schema; it
-- runs as the learner, who has no USAGE on that schema.
-- =============================================================================

create or replace function private.valid_song(s jsonb)
returns boolean language sql immutable set search_path = '' as $$
  select case when jsonb_typeof(s) <> 'object' then false else
       pg_column_size(s) <= 2048
       -- only known keys
       and (select coalesce(bool_and(k in ('v', 'register', 'motif', 'bass', 'updatedAt')), true)
              from jsonb_object_keys(s) as k)
       and (not s ? 'v'         or s->'v' = '1'::jsonb)
       and (not s ? 'register'  or s->>'register' in ('low', 'mid', 'high'))
       and (not s ? 'bass'      or (jsonb_typeof(s->'bass') = 'string' and s->>'bass' ~ '^[A-G][#b]?[0-8]$'))
       and (not s ? 'updatedAt' or jsonb_typeof(s->'updatedAt') = 'number')
       and (not s ? 'motif' or case when jsonb_typeof(s->'motif') <> 'array' then false else
              jsonb_array_length(s->'motif') <= 8
              and (select coalesce(bool_and(jsonb_typeof(e) = 'null'
                                       or (jsonb_typeof(e) = 'string' and (e #>> '{}') ~ '^[A-G][#b]?[0-8]$')), true)
                     from jsonb_array_elements(s->'motif') as e)
            end)
  end;
$$;

alter table public.profiles
  add column song jsonb not null default '{}'::jsonb check (private.valid_song(song));

-- Column-level privilege: the song joins the short list of learner-writable columns.
grant update (song) on public.profiles to authenticated;
