/**
 * Sanity-checks every exercise in the course: each question must have exactly one correct
 * option with unique labels, and every "play-note" target must be reachable on its keyboard.
 * Run: npx tsx scripts/validate-content.ts
 */
import { allLessons } from '../src/content/course'
import { buildQuestion } from '../src/exercises/build'
import { midi } from '../src/lib/music'

let problems = 0
for (const lesson of allLessons)
  for (const [i, ex] of lesson.exercises.entries())
    for (const locale of ['en', 'es'] as const)
      for (const notation of ['letters', 'solfege'] as const)
        for (let run = 0; run < 20; run++) {
          const q = buildQuestion(ex, locale, notation)
          const where = `${lesson.id} #${i} (${ex.type}, ${locale}/${notation})`
          if (q.kind === 'options') {
            const correct = q.options.filter((o) => o.correct).length
            const labels = new Set(q.options.map((o) => o.label))
            if (correct !== 1) (problems++, console.log(`✗ ${where}: ${correct} correct options`))
            if (labels.size !== q.options.length) (problems++, console.log(`✗ ${where}: duplicate labels ${q.options.map((o) => o.label)}`))
            if (q.options.length < 2) (problems++, console.log(`✗ ${where}: too few options`))
          } else {
            const [lo, hi] = q.range.map(midi)
            let reachable = false
            for (let m = lo; m <= hi; m++) if (q.isCorrect(m)) reachable = true
            if (!reachable) (problems++, console.log(`✗ ${where}: no correct key in range`))
          }
          if (problems > 30) process.exit(1)
        }
console.log(problems ? `${problems} problems` : `✓ ${allLessons.length} lessons, ${allLessons.reduce((n, l) => n + l.exercises.length, 0)} exercises OK`)
process.exit(problems ? 1 : 0)
