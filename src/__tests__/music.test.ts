import { describe, expect, it } from 'vitest'
import { blackKeyName, fromMidi, isBlack, midi, noteName, parse, pitchClass } from '@/lib/music'

describe('music theory helpers', () => {
  it('parses scientific pitch notation', () => {
    expect(parse('F#3')).toEqual({ letter: 'F', acc: 1, octave: 3 })
    expect(parse('Bb5')).toEqual({ letter: 'B', acc: -1, octave: 5 })
    expect(() => parse('H2')).toThrow()
  })
  it('converts to and from MIDI', () => {
    expect(midi('C4')).toBe(60)
    expect(midi('A4')).toBe(69)
    expect(midi('Cb4')).toBe(59)
    expect(fromMidi(61)).toBe('C#4')
    expect(pitchClass('Db2')).toBe(pitchClass('C#5'))
  })
  it('knows the black keys', () => {
    expect([60, 61, 62, 63, 64, 65, 66].map(isBlack)).toEqual([false, true, false, true, false, false, true])
  })
  it('names notes in both notations', () => {
    expect(noteName('F#4', 'letters')).toBe('F♯')
    expect(noteName('F#4', 'solfege')).toBe('Fa♯')
    expect(noteName('Bb', 'solfege')).toBe('Si♭')
    expect(noteName('C4', 'letters', true)).toBe('C4')
    expect(blackKeyName(61, 'solfege')).toBe('Do♯ / Re♭')
  })
})
