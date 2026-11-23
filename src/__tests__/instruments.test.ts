import { describe, expect, it } from 'vitest'
import { GENRE_INSTRUMENTS, INSTRUMENTS, fitGroup, fitNote, resolveInstrument } from '@/lib/instruments'
import { midi } from '@/lib/music'

describe('instrument ranges', () => {
  it('moves single notes into range by octaves', () => {
    expect(fitNote('C6', 'contrabass')).toBe('C3')
    expect(fitNote('C2', 'flute')).toBe('C4')
    expect(fitNote('E4', 'violin')).toBe('E4')
    expect(fitNote('C5', 'drums')).toBe('C5') // drum mapping must not be shifted
  })
  it('moves groups together, keeping which note is higher', () => {
    const [a, b] = fitGroup(['C3', 'C5'], 'violin')
    expect(midi(b) - midi(a)).toBe(24)
    const [lo, hi] = INSTRUMENTS.violin.range.map(midi)
    expect(midi(a)).toBeGreaterThanOrEqual(lo)
    expect(midi(b)).toBeLessThanOrEqual(hi)
  })
})

describe('resolveInstrument', () => {
  it('never picks the piano or drums for auto practice', () => {
    for (const genre of ['classical', 'pop', 'rock'] as const)
      for (let seed = 0; seed < 20; seed++) expect(['piano', 'drums']).not.toContain(resolveInstrument('auto', genre, seed))
  })
  it('prefers instruments that read the clef in reading exercises', () => {
    for (let seed = 0; seed < 20; seed++) {
      const id = resolveInstrument('auto', 'classical', seed, ['F3'], true, 'bass')
      expect(['bass', 'grand']).toContain(INSTRUMENTS[id].clef)
    }
  })
  it('resolves roles per genre', () => {
    expect(resolveInstrument('role:bass', 'rock')).toBe('bass-electric')
    expect(resolveInstrument('role:lead', 'pop')).toBe('synth-lead')
  })
  it('only uses instruments that belong to the genre', () => {
    for (const genre of ['classical', 'pop', 'rock'] as const)
      for (let seed = 0; seed < 20; seed++) expect(GENRE_INSTRUMENTS[genre]).toContain(resolveInstrument('auto', genre, seed))
  })
})
