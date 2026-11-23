/** Pitch helpers. Notes are written in scientific notation: "C4", "F#3", "Bb5". */
export type Notation = 'letters' | 'solfege'
export type Letter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'

export const LETTERS: Letter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const SOLFEGE: Record<Letter, string> = { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' }
const LETTER_PC: Record<Letter, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

export interface Pitch {
  letter: Letter
  acc: -1 | 0 | 1
  octave: number
}

export function parse(note: string): Pitch {
  const m = /^([A-Ga-g])(#|b)?(-?\d)?$/.exec(note.trim())
  if (!m) throw new Error(`Bad note: ${note}`)
  return {
    letter: m[1].toUpperCase() as Letter,
    acc: m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0,
    octave: m[3] !== undefined ? Number(m[3]) : 4,
  }
}

export const midi = (note: string) => {
  const p = parse(note)
  return (p.octave + 1) * 12 + LETTER_PC[p.letter] + p.acc
}
export const pitchClass = (note: string) => ((midi(note) % 12) + 12) % 12

const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
export function fromMidi(m: number): string {
  return SHARP_NAMES[m % 12] + (Math.floor(m / 12) - 1)
}
export const isBlack = (m: number) => [1, 3, 6, 8, 10].includes(((m % 12) + 12) % 12)

/** Display name of a note ignoring octave, e.g. "F♯" or "Fa♯". */
export function noteName(note: string, notation: Notation, withOctave = false): string {
  const p = parse(note)
  const base = notation === 'solfege' ? SOLFEGE[p.letter] : p.letter
  const acc = p.acc === 1 ? '♯' : p.acc === -1 ? '♭' : ''
  const oct = withOctave && /\d$/.test(note) ? String(p.octave) : ''
  return base + acc + oct
}

/** Name for a black key showing both spellings, e.g. "C♯ / D♭". */
export function blackKeyName(m: number, notation: Notation): string {
  const sharp = fromMidi(m).replace(/\d+$/, '')
  const flatLetter = LETTERS[(LETTERS.indexOf(sharp[0] as Letter) + 1) % 7]
  return `${noteName(sharp, notation)} / ${noteName(flatLetter + 'b', notation)}`
}

export function keyLabel(m: number, notation: Notation): string {
  return isBlack(m) ? blackKeyName(m, notation) : noteName(fromMidi(m).replace(/\d+$/, ''), notation)
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const sample = <T,>(arr: T[], n: number) => shuffle(arr).slice(0, n)
