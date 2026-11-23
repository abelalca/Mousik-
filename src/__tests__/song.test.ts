import { describe, expect, it } from 'vitest'
import { emptySong, hasAnything, sanitizeSong, songEvents, soundingMotif, withSlot } from '@/lib/song'
import { allLessons } from '@/content/course'

describe('song model', () => {
  it('fills slots without mutating the previous song', () => {
    const a = emptySong()
    const b = withSlot(withSlot(a, { kind: 'motif-note', index: 1 }, 'E4'), { kind: 'register', }, 'high')
    expect(a.motif).toEqual([null, null, null, null])
    expect(b.motif).toEqual([null, 'E4', null, null])
    expect(b.register).toBe('high')
    expect(b.updatedAt).toBeGreaterThan(0)
    expect(hasAnything(a)).toBe(false)
    expect(hasAnything(b)).toBe(true)
  })

  it('applies the register to the sounding melody', () => {
    const s = { ...emptySong(), register: 'low' as const, motif: ['C4', 'E4', null, 'G4'] }
    expect(soundingMotif(s)).toEqual(['C3', 'E3', null, 'G3'])
  })

  it('plays the motif twice with the bass held under each pass, skipping missing notes', () => {
    const s = { ...emptySong(), motif: ['C4', null, 'G4', 'C5'], bass: 'C3' }
    const ev = songEvents(s, 'classical')
    expect(ev.filter((e) => e.part === 'melody')).toHaveLength(6)
    expect(ev.filter((e) => e.part === 'bass').map((e) => e.beat)).toEqual([0, 4])
    expect(ev.every((e) => e.instrument === 'piano')).toBe(true)
    expect(songEvents(s, 'rock')[0].instrument).toBe('organ')
  })

  it('cleans malformed data from storage or the server', () => {
    expect(sanitizeSong(null)).toEqual(emptySong())
    const s = sanitizeSong({ register: 'sideways', motif: ['C4', '<b>', 3, 'Bb4', 'C4', 'C4'], bass: 'H2', updatedAt: 5, extra: 1 })
    expect(s.register).toBeUndefined()
    expect(s.bass).toBeUndefined()
    expect(s.motif).toEqual(['C4', null, null, 'Bb4'])
    expect(s.updatedAt).toBe(5)
    expect('extra' in s).toBe(false)
  })

  it('every unit 1 lesson ends with a creative step', () => {
    const u1 = allLessons.filter((l) => l.id.startsWith('u1-'))
    expect(u1.every((l) => l.create)).toBe(true)
  })
})
