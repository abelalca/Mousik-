-- Unit 1 lesson catalog (generated with scripts/lesson-catalog.ts).
insert into public.lessons (id, position, exercise_count) values
  ('u1-l1', 1, 10),
  ('u1-inst', 2, 11),
  ('u1-l2', 3, 14),
  ('u1-l3', 4, 14),
  ('u1-l4', 5, 15),
  ('u1-l5', 6, 13)
on conflict (id) do update set position = excluded.position, exercise_count = excluded.exercise_count;
