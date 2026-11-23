/**
 * Sanity-checks every exercise in the course: each question must have exactly one correct
 * option with unique labels, and every "play-note" target must be reachable on its keyboard.
 * Run: npx tsx scripts/validate-content.ts
 */
import { allLessons } from '../src/content/course'
import { buildQuestion } from '../src/exercises/build'
import { midi } from '../src/lib/music'
import { INSTRUMENTS } from '../src/lib/instruments'
import { MOTIF_LENGTH, NOTE_RE, slotKey } from '../src/lib/song'
import manifest from '../public/samples/manifest.json'
import { readFileSync, readdirSync } from 'node:fs'

let problems = 0
// every sample-based instrument must have samples
for (const inst of Object.values(INSTRUMENTS))
  if (inst.samples && !(manifest as Record<string, object>)[inst.samples]) (problems++, console.log(`✗ no samples for ${inst.id}`))

// every lesson must exist in the server catalog (public.lessons) with enough exercises
const catalog = new Map<string, number>()
for (const f of readdirSync('supabase/migrations').sort())
  for (const m of readFileSync(`supabase/migrations/${f}`, 'utf8').matchAll(/\('(u\d+-[a-z0-9-]+)',\s*\d+,\s*(\d+)\)/g))
    catalog.set(m[1], Number(m[2]))
for (const l of allLessons) {
  const max = Math.max(l.exercises.length, ...Object.values(l.variants ?? {}).map((v) => v.exercises.length))
  if (!catalog.has(l.id)) (problems++, console.log(`✗ ${l.id} missing from the server lesson catalog (run scripts/lesson-catalog.ts and add a migration)`))
  else if (catalog.get(l.id)! < max) (problems++, console.log(`✗ ${l.id}: catalog allows ${catalog.get(l.id)} exercises but content has ${max}`))
}

// creative steps ("your song"): valid choices, and each part of the song is created by exactly one lesson
const slots = new Map<string, string>()
for (const l of allLessons) {
  const c = l.create
  if (!c) continue
  const key = slotKey(c.slot)
  if (slots.has(key)) (problems++, console.log(`✗ ${l.id}: song part "${key}" is already created in ${slots.get(key)}`))
  slots.set(key, l.id)
  if (c.slot.kind === 'motif-note' && (c.slot.index < 0 || c.slot.index >= MOTIF_LENGTH)) (problems++, console.log(`✗ ${l.id}: motif index ${c.slot.index} out of range`))
  if (c.slot.kind !== 'register') {
    const opts = c.options ?? []
    if (opts.length < 2) (problems++, console.log(`✗ ${l.id}: creative step needs at least 2 options`))
    if (new Set(opts).size !== opts.length) (problems++, console.log(`✗ ${l.id}: duplicate creative options`))
    for (const n of opts) if (!NOTE_RE.test(n)) (problems++, console.log(`✗ ${l.id}: "${n}" is not a valid note for the song`))
  }
}

let checked = 0
for (const genre of ['classical', 'pop', 'rock'] as const)
for (const lesson of allLessons)
  for (const [i, ex] of (lesson.variants?.[genre]?.exercises ?? lesson.exercises).entries())
    for (const locale of ['en', 'es'] as const)
      for (const notation of ['letters', 'solfege'] as const)
        for (let run = 0; run < 12; run++) {
          checked++
          const q = buildQuestion(ex, { locale, notation, genre, seed: run * 3 + i })
          const where = `${lesson.id} #${i} (${ex.type}, ${genre}, ${locale}/${notation})`
          if (q.audio?.some((c) => c.mode !== 'phrase' && c.notes.some((n) => {
            const [lo, hi] = INSTRUMENTS[c.instrument].range.map(midi)
            return c.instrument !== 'drums' && (midi(n) < lo || midi(n) > hi)
          }))) (problems++, console.log(`✗ ${where}: audio note outside ${q.audio.map((c) => c.instrument)} range`))
          if (q.visual?.type === 'staff' && q.visual.instrument) {
            const [lo, hi] = INSTRUMENTS[q.visual.instrument as keyof typeof INSTRUMENTS].range.map(midi)
            if (q.visual.notes.some((n) => midi(n) < lo || midi(n) > hi)) (problems++, console.log(`✗ ${where}: staff note not playable on ${q.visual.instrument}`))
          }
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
console.log(problems ? `${problems} problems` : `✓ ${allLessons.length} lessons, 3 genres, ${checked} generated questions, ${slots.size} song steps OK`)
process.exit(problems ? 1 : 0)
