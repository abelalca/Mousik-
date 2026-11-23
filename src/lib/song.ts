import type { Genre } from './types'
import type { InstrumentId } from './instruments'
import { fitGroup } from './instruments'
import { fromMidi, midi } from './music'

/**
 * "Your song": the piece the learner builds one small creative step at a time.
 * Every lesson ends with a choice (no wrong answers) that fills one part of the song.
 * Unit 1 builds a 4-note motif, its register and the bass note Mo holds underneath.
 * Later units add rhythm, chords, bass line, chorus and form (and band members play them).
 */

export type Register = 'low' | 'mid' | 'high'

export interface Song {
  v: 1
  register?: Register
  /** Melody notes written around octave 4; `null` = not created yet. */
  motif: (string | null)[]
  /** Low note Mo holds under the melody (left hand). */
  bass?: string
  /** ms timestamp of the last change (used to pick the newest copy between devices). */
  updatedAt: number
}

export const MOTIF_LENGTH = 4
export const REGISTERS: Register[] = ['low', 'mid', 'high']
const REGISTER_SHIFT: Record<Register, number> = { low: -12, mid: 0, high: 12 }

/** Same rule as private.valid_song() in the database. */
export const NOTE_RE = /^[A-G][#b]?[0-8]$/

export const emptySong = (): Song => ({ v: 1, motif: Array(MOTIF_LENGTH).fill(null), updatedAt: 0 })

/** One creative step: which part of the song a lesson's choice fills. */
export type SongSlot = { kind: 'register' } | { kind: 'motif-note'; index: number } | { kind: 'bass-note' }

export const slotKey = (s: SongSlot) => (s.kind === 'motif-note' ? `motif-${s.index}` : s.kind)

/** Current value of a slot (undefined = not created yet). */
export function slotValue(song: Song, slot: SongSlot): string | undefined {
  if (slot.kind === 'register') return song.register
  if (slot.kind === 'bass-note') return song.bass
  return song.motif[slot.index] ?? undefined
}

/** Returns a new song with the slot set to `value` (a register name or a note). */
export function withSlot(song: Song, slot: SongSlot, value: string): Song {
  const next: Song = { ...song, motif: [...song.motif], updatedAt: Date.now() }
  while (next.motif.length < MOTIF_LENGTH) next.motif.push(null)
  if (slot.kind === 'register') next.register = value as Register
  else if (slot.kind === 'bass-note') next.bass = value
  else next.motif[slot.index] = value
  return next
}

export const hasAnything = (s: Song) => !!s.register || !!s.bass || s.motif.some(Boolean)

/** Cleans a song coming from storage or the server; anything malformed is dropped. */
export function sanitizeSong(raw: unknown): Song {
  const s = emptySong()
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return s
  const r = raw as Record<string, unknown>
  if (typeof r.register === 'string' && (REGISTERS as string[]).includes(r.register)) s.register = r.register as Register
  if (typeof r.bass === 'string' && NOTE_RE.test(r.bass)) s.bass = r.bass
  if (Array.isArray(r.motif))
    s.motif = Array.from({ length: MOTIF_LENGTH }, (_, i) => {
      const n = r.motif && (r.motif as unknown[])[i]
      return typeof n === 'string' && NOTE_RE.test(n) ? n : null
    })
  if (typeof r.updatedAt === 'number' && Number.isFinite(r.updatedAt)) s.updatedAt = r.updatedAt
  return s
}

// ---------- playback ----------

/** Mo's instrument in each genre (he leads the band from the keyboard). */
export const MO_INSTRUMENT: Record<Genre, InstrumentId> = { classical: 'piano', pop: 'epiano', rock: 'organ' }

/** A sound on the song timeline. `beat` and `len` are in beats. `part` names the layer (for muting). */
export interface SongEvent {
  part: 'melody' | 'bass'
  instrument: InstrumentId
  notes: string | string[]
  beat: number
  len: number
}

export const SONG_BPM = 92

/** Melody notes as they sound (register applied). Missing notes stay `null` (rests). */
export function soundingMotif(song: Song): (string | null)[] {
  const shift = REGISTER_SHIFT[song.register ?? 'mid']
  return song.motif.map((n) => (n ? (shift ? fromMidi(midi(n) + shift) : n) : null))
}

/**
 * The song as a list of events. The motif is played twice; the bass note is held under each pass.
 * Notes are moved together into the instrument's range so the contour is kept.
 */
export function songEvents(song: Song, genre: Genre, opts: { repeats?: number } = {}): SongEvent[] {
  const instrument = MO_INSTRUMENT[genre]
  const repeats = opts.repeats ?? 2
  const melody = soundingMotif(song)
  const present = melody.filter((n): n is string => !!n)
  const fitted = present.length ? fitGroup(present, instrument) : []
  let k = 0
  const notes = melody.map((n) => (n ? fitted[k++] : null))
  const events: SongEvent[] = []
  for (let r = 0; r < repeats; r++) {
    const start = r * MOTIF_LENGTH
    notes.forEach((n, i) => n && events.push({ part: 'melody', instrument, notes: n, beat: start + i, len: i === MOTIF_LENGTH - 1 ? 1.8 : 0.95 }))
    if (song.bass) events.push({ part: 'bass', instrument, notes: song.bass, beat: start, len: MOTIF_LENGTH })
  }
  return events
}

export const songLengthBeats = (events: SongEvent[]) => events.reduce((m, e) => Math.max(m, e.beat + e.len), 0)
