import type { ByGenre, L } from '@/lib/types'
import type { Notation } from '@/lib/music'
import type { InstrumentId, InstrumentRef } from '@/lib/instruments'

export type Clef = 'treble' | 'bass' | 'grand'

/** Interactive illustration attached to a theory card or exercise. */
export type Demo =
  /** instrument = the sound the keys make (theory defaults to piano). */
  | { type: 'piano'; from: string; to: string; highlight?: string[]; labels?: boolean | 'white'; instrument?: InstrumentRef }
  | { type: 'staff'; clef: Clef; notes: string[]; labels?: boolean; playable?: boolean; instrument?: InstrumentRef }
  /** Buttons that play notes. mode 'phrase' plays the instrument's characteristic phrase (notes ignored). */
  | { type: 'sounds'; buttons: { label: L; notes: string[]; mode?: 'seq' | 'chord' | 'phrase'; instrument?: InstrumentRef }[] }
  /** Tappable instrument cards: name, family, register, clef and role in the learner's genre. */
  | { type: 'instruments'; ids: InstrumentId[] }

/**
 * Text in L strings supports tiny markup:
 *  **bold**   and   {n:C#}  → note name rendered with the learner's notation (C♯ / Do♯)
 */
export interface TheoryCard {
  title: L
  body: L
  demo?: Demo
  /** Extra paragraph that depends on the learner's notation (e.g. mnemonics). */
  byNotation?: Partial<Record<Notation, L>>
  /** A short "in your genre" tip. */
  genre?: ByGenre<L>
}

interface Base {
  explain?: L
  /** Sound used for audio prompts / piano input. Defaults to 'auto' (rotates through the genre's instruments). */
  instrument?: InstrumentRef
}

export type Exercise =
  | (Base & {
      type: 'choice'
      prompt: L
      options: L[]
      answer: number
      demo?: Demo
      audio?: { notes: string[]; mode?: 'seq' | 'chord' | 'phrase' }
    })
  /** Read a note on the staff and pick its name. */
  | (Base & { type: 'name-note'; clef: Clef; note: string; distractors?: string[] })
  /** A key is highlighted on the piano; pick its name. */
  | (Base & { type: 'name-key'; note: string; range?: [string, string]; distractors?: string[] })
  /**
   * Tap the right key on the piano.
   * show: 'name' (prompt shows the note name), 'staff' (note shown on staff), 'custom' (prompt text)
   * anyOctave: accept the pitch class in any octave.
   */
  | (Base & {
      type: 'play-note'
      target: string
      accept?: string[]
      show: 'name' | 'staff' | 'custom'
      prompt?: L
      clef?: Clef
      anyOctave?: boolean
      range?: [string, string]
      labels?: boolean
    })
  /**
   * Hear two notes and decide which is higher / lower.
   * With `instruments`, each note is played by a different instrument and the options name them.
   */
  | (Base & { type: 'ear-compare'; a: string; b: string; ask: 'higher' | 'lower'; instruments?: [InstrumentRef, InstrumentRef] })
  /** Hear a phrase and name the instrument. 'auto' rotates through the genre's instruments. */
  | (Base & { type: 'identify-instrument'; instrument: InstrumentRef })

export interface Lesson {
  id: string
  title: L
  goal: L
  cards: TheoryCard[]
  exercises: Exercise[]
  /** Genre-specific content that replaces cards/exercises (e.g. "the instruments of your genre"). */
  variants?: ByGenre<{ cards: TheoryCard[]; exercises: Exercise[] }>
}

export interface Unit {
  id: string
  title: L
  description: L
  level: L
  lessons: Lesson[]
  /** Titles of lessons not yet written (shown as "coming soon"). */
  upcoming?: L[]
}
