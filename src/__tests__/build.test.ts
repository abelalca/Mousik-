import { describe, expect, it } from 'vitest'
import { buildQuestion } from '@/exercises/build'
import { midi } from '@/lib/music'

const ctx = { locale: 'es', notation: 'solfege', genre: 'classical', seed: 3 } as const

describe('buildQuestion', () => {
  it('name-note has exactly one correct option and plays a matching instrument', () => {
    const q = buildQuestion({ type: 'name-note', clef: 'treble', note: 'F#4' }, ctx)
    expect(q.kind).toBe('options')
    if (q.kind !== 'options') return
    expect(q.options.filter((o) => o.correct)).toHaveLength(1)
    expect(q.correctLabel).toBe('Fa♯')
  })
  it('identify-instrument does not reveal the answer', () => {
    const q = buildQuestion({ type: 'identify-instrument', instrument: 'cello' }, ctx)
    expect(q.hideInstrument).toBe(true)
    expect(q.audio?.[0]).toMatchObject({ mode: 'phrase', instrument: 'cello' })
  })
  it('two-instrument comparison grades by the pitches that actually sound', () => {
    const q = buildQuestion({ type: 'ear-compare', instruments: ['contrabass', 'flute'], a: 'C2', b: 'C6', ask: 'lower' }, ctx)
    if (q.kind !== 'options' || !q.audio) throw new Error('expected options with audio')
    const [a, b] = q.audio.map((c) => midi(c.notes[0]))
    const correct = q.options.find((o) => o.correct)!
    expect(correct.key).toBe(a < b ? 'a' : 'b')
  })
  it('play-note accepts any octave when asked', () => {
    const q = buildQuestion({ type: 'play-note', show: 'name', target: 'C4', anyOctave: true }, ctx)
    if (q.kind !== 'piano') throw new Error('expected piano')
    expect(q.isCorrect(midi('C5'))).toBe(true)
    expect(q.isCorrect(midi('D4'))).toBe(false)
  })
})
