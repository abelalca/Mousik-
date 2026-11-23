-- Tests for the learner's song (pgTAP). Run: npx supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(11);

insert into auth.users (id, email, aud, role)
values ('11111111-1111-1111-1111-111111111111', 'ana@example.com', 'authenticated', 'authenticated'),
       ('22222222-2222-2222-2222-222222222222', 'bob@example.com', 'authenticated', 'authenticated');

select is((select song from public.profiles where id = '11111111-1111-1111-1111-111111111111'), '{}'::jsonb,
          'new profiles start with an empty song');

-- ---------- act as Ana ----------
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

select lives_ok($$ update public.profiles
                   set song = '{"v":1,"register":"high","motif":["C4","E4",null,"Bb4"],"bass":"F2","updatedAt":1764000000000}'
                   where id = auth.uid() $$, 'Ana can save a valid song');
select is((select song->>'register' from public.profiles where id = auth.uid()), 'high', 'the song is stored');

select throws_ok($$ update public.profiles set song = '{"register":"sideways"}' where id = auth.uid() $$,
                 '23514', null, 'unknown registers are rejected');
select throws_ok($$ update public.profiles set song = '{"motif":["<script>"]}' where id = auth.uid() $$,
                 '23514', null, 'motif entries must be notes');
select throws_ok($$ update public.profiles set song = '{"bass":"H9"}' where id = auth.uid() $$,
                 '23514', null, 'the bass must be a note');
select throws_ok($$ update public.profiles set song = '{"isAdmin":true}' where id = auth.uid() $$,
                 '23514', null, 'unknown song keys are rejected');
select throws_ok($$ update public.profiles set song = '{"motif":["C4","C4","C4","C4","C4","C4","C4","C4","C4"]}' where id = auth.uid() $$,
                 '23514', null, 'motifs longer than 8 notes are rejected');
select throws_ok($$ update public.profiles set song = '[1,2,3]' where id = auth.uid() $$,
                 '23514', null, 'the song must be an object');

-- Bob's song cannot be changed by Ana (RLS hides his row).
update public.profiles set song = '{"register":"low"}' where id = '22222222-2222-2222-2222-222222222222';
reset role;
select is((select song from public.profiles where id = '22222222-2222-2222-2222-222222222222'), '{}'::jsonb,
          'Ana cannot change Bob''s song');

-- ---------- anonymous visitors ----------
set local role anon;
select throws_ok('select song from public.profiles', '42501', null, 'anon cannot read songs');
reset role;

select * from finish();
rollback;
