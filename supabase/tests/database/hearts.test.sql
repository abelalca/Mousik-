-- Tests for server-managed hearts and today's XP (pgTAP). Run: npx supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(18);

insert into auth.users (id, email, aud, role)
values ('11111111-1111-1111-1111-111111111111', 'ana@example.com', 'authenticated', 'authenticated'),
       ('22222222-2222-2222-2222-222222222222', 'bob@example.com', 'authenticated', 'authenticated');

select is((select hearts::int from public.profiles where id = '11111111-1111-1111-1111-111111111111'), 5,
          'new profiles start with 5 hearts');

-- ---------- anonymous visitors ----------
set local role anon;
select throws_ok('select public.lose_heart()', '42501', null, 'anon cannot lose hearts');
select throws_ok('select public.get_status()', '42501', null, 'anon cannot read a status');
reset role;

-- ---------- act as Ana ----------
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

select throws_ok($$ update public.profiles set hearts = 5 where id = auth.uid() $$,
                 '42501', null, 'Ana cannot set her own hearts');
select throws_ok($$ update public.profiles set hearts_updated_at = now() - interval '1 day' where id = auth.uid() $$,
                 '42501', null, 'Ana cannot move her refill clock');
select throws_ok($$ select private.refill_hearts(auth.uid()) $$, '42501', null,
                 'the refill helper is not callable through the API');

select is((public.lose_heart()->>'hearts')::int, 4, 'a wrong answer costs one heart');
select is((public.get_status()->>'hearts')::int, 4, 'the status reports the server hearts');
select lives_ok($$ select public.lose_heart() from generate_series(1, 6) $$, 'losing more hearts than she has is harmless');
select is((select hearts::int from public.profiles where id = auth.uid()), 0, 'hearts never go below 0');
reset role;

-- Bob is unaffected
select is((select hearts::int from public.profiles where id = '22222222-2222-2222-2222-222222222222'), 5,
          'Ana''s mistakes do not touch Bob''s hearts');

-- ---------- refill over time ----------
update public.profiles set hearts_updated_at = now() - interval '65 minutes'
 where id = '11111111-1111-1111-1111-111111111111';
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select is((public.get_status()->>'hearts')::int, 2, 'one heart comes back every 30 minutes');
reset role;
select is((select hearts_updated_at from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
          now() - interval '5 minutes', 'the unused 5 minutes count towards the next heart');

update public.profiles set hearts_updated_at = now() - interval '10 hours'
 where id = '11111111-1111-1111-1111-111111111111';
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select is((public.get_status()->>'hearts')::int, 5, 'hearts refill up to 5, never more');
select is((public.lose_heart()->>'hearts')::int, 4, 'losing a heart from a full set works again');
reset role;
select is((select hearts_updated_at from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
          now(), 'breaking a full set restarts the refill clock');

-- ---------- today's XP ----------
insert into public.lesson_attempts (id, user_id, lesson_id, started_at, completed_at) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'u1-l1', now(), now()),
  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'u1-l1', now() - interval '3 days', now() - interval '3 days');
insert into public.xp_events (user_id, attempt_id, lesson_id, xp, accuracy, created_at) values
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', 'u1-l1', 15, 100, now()),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000002', 'u1-l1', 10, 80, now() - interval '3 days');

set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select is((public.get_status('America/Bogota')->>'today_xp')::int, 15, 'today''s XP counts only today''s events');
set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
select is((public.get_status('Not/AZone')->>'today_xp')::int, 0, 'Bob does not see Ana''s XP (and bad time zones fall back to UTC)');
reset role;

select * from finish();
rollback;
