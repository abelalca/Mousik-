/**
 * Prints SQL rows for the server-side lesson catalog (public.lessons) from the course content.
 * Use it when adding lessons: put the output in a NEW migration (never edit applied ones).
 * Run: npx tsx --tsconfig tsconfig.json scripts/lesson-catalog.ts
 */
import { allLessons } from '../src/content/course'

const rows = allLessons.map((l, i) => {
  const counts = [l.exercises.length, ...Object.values(l.variants ?? {}).map((v) => v.exercises.length)]
  return `  ('${l.id}', ${i + 1}, ${Math.max(...counts)})`
})
console.log(`insert into public.lessons (id, position, exercise_count) values\n${rows.join(',\n')}\non conflict (id) do update set position = excluded.position, exercise_count = excluded.exercise_count;`)
