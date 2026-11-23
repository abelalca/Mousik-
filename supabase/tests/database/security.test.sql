-- Security tests for the Mousik schema (pgTAP). Run: npx supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(32);

-- ---------- fixtures: two users ----------
insert into auth.users (id, email, aud, role)
values ('11111111-1111-1111-1111-111111111111', 'ana@example.com', 'authenticated', 'authenticated'),
       ('22222222-2222-2222-2222-222222222222', 'bob@example.com', 'authenticated', 'authenticated');

select is((select count(*)::int from public.profiles), 2, 'a profile is created for every new user');

-- every table has RLS enabled
select is(
  (select count(*)::int from pg_tables where schemaname = 'public' and not rowsecurity),
  0, 'RLS is enabled on every public table');

-- ---------- anonymous visitors see nothing ----------
set local role anon;
select throws_ok('select * from public.profiles', '42501', null, 'anon cannot read profiles');
select throws_ok('select * from public.lessons', '42501', null, 'anon cannot read the lesson catalog');
select throws_ok($$ select public.start_lesson('u1-l1') $$, '42501', null, 'anon cannot start lessons');
select throws_ok('select public.delete_my_account()', '42501', null, 'anon cannot delete accounts');
reset role;

-- ---------- act as Ana ----------
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

select is((select count(*)::int from public.profiles), 1, 'Ana sees only her own profile');
select is((select count(*)::int from public.lessons), 6, 'signed-in users can read the catalog');

-- allowed profile edits
select lives_ok($$ update public.profiles set display_name = 'Ana', onboarded = true,
                   settings = '{"genre":"rock","locale":"es","notation":"solfege","sound":true,"dailyGoal":20}'
                   where id = auth.uid() $$, 'Ana can update her name, settings and onboarding');
select throws_ok($$ update public.profiles set settings = '{"genre":"jazz"}' where id = auth.uid() $$,
                 '23514', null, 'invalid settings values are rejected');
select throws_ok($$ update public.profiles set settings = '{"isAdmin":true}' where id = auth.uid() $$,
                 '23514', null, 'unknown settings keys are rejected');
select throws_ok($$ update public.profiles set display_name = repeat('x', 31) where id = auth.uid() $$,
                 '23514', null, 'names longer than 30 characters are rejected');

-- forbidden writes
select throws_ok($$ update public.profiles set xp = 99999 where id = auth.uid() $$,
                 '42501', null, 'Ana cannot set her own XP');
select throws_ok($$ update public.profiles set streak = 365 where id = auth.uid() $$,
                 '42501', null, 'Ana cannot set her own streak');
select throws_ok($$ insert into public.lesson_progress (user_id, lesson_id, best_accuracy)
                   values (auth.uid(), 'u1-l5', 100) $$, '42501', null, 'Ana cannot write progress directly');
select throws_ok($$ insert into public.xp_events (user_id, attempt_id, lesson_id, xp, accuracy)
                   values (auth.uid(), gen_random_uuid(), 'u1-l1', 500, 100) $$, '42501', null,
                 'Ana cannot write XP events directly');
select throws_ok($$ insert into public.lessons (id, position, exercise_count) values ('u9-x', 99, 1) $$,
                 '42501', null, 'Ana cannot change the lesson catalog');

-- Bob's data is invisible and untouchable
select is_empty($$ select 1 from public.profiles where id = '22222222-2222-2222-2222-222222222222' $$,
                'Ana cannot read Bob''s profile');
update public.profiles set display_name = 'hacked' where id = '22222222-2222-2222-2222-222222222222';

-- unlock order
select throws_ok($$ select public.start_lesson('u1-l3') $$, 'P0001', 'lesson_locked',
                 'locked lessons cannot be started');
select throws_ok($$ select public.start_lesson('u9-nope') $$, 'P0001', 'unknown_lesson',
                 'unknown lessons are rejected');

-- start lesson 1 and try to finish instantly
create temp table t_attempt as select public.start_lesson('u1-l1') as id;
select isnt((select id from t_attempt), null, 'Ana can start the first lesson');
select throws_ok($$ select public.complete_lesson((select id from t_attempt), 10, 10) $$, 'P0001', 'too_fast',
                 'completing a lesson faster than humanly possible is rejected');
reset role;

-- simulate that 2 minutes have passed
update public.lesson_attempts set started_at = now() - interval '2 minutes';

set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select throws_ok($$ select public.complete_lesson((select id from t_attempt), 11, 10) $$, 'P0001', 'invalid_score',
                 'more correct answers than exercises is rejected');
select throws_ok($$ select public.complete_lesson((select id from t_attempt), 5, 50) $$, 'P0001', 'invalid_score',
                 'more exercises than the lesson has is rejected');
select is((public.complete_lesson((select id from t_attempt), 10, 10, 'America/Bogota')->>'xp')::int, 15,
          'a perfect lesson awards 10 + 5 XP');
select throws_ok($$ select public.complete_lesson((select id from t_attempt), 10, 10) $$, 'P0001',
                 'attempt_already_completed', 'an attempt cannot be submitted twice');
select is((select xp from public.profiles where id = auth.uid()), 15, 'profile XP updated by the server');
select is((select streak from public.profiles where id = auth.uid()), 1, 'streak starts at 1');
select lives_ok($$ select public.start_lesson('u1-inst') $$, 'the next lesson unlocks after completing the first');
reset role;

-- ---------- act as Bob ----------
set local role authenticated;
set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
select is((select display_name from public.profiles where id = auth.uid()), null,
          'Ana''s update attempt did not change Bob''s profile');
select throws_ok($$ select public.complete_lesson((select id from t_attempt), 10, 10) $$, 'P0001', 'unknown_attempt',
                 'Bob cannot submit Ana''s attempt');

-- account deletion removes everything
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select public.delete_my_account();
reset role;
select is((select count(*)::int from public.profiles where id = '11111111-1111-1111-1111-111111111111')
          + (select count(*)::int from public.lesson_progress where user_id = '11111111-1111-1111-1111-111111111111')
          + (select count(*)::int from public.xp_events where user_id = '11111111-1111-1111-1111-111111111111'),
          0, 'deleting an account removes all of the user''s data');

select * from finish();
rollback;
