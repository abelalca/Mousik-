import type { ByGenre, L } from '@/lib/types'
import type { Notation } from '@/lib/music'

export type Clef = 'treble' | 'bass' | 'grand'

/** Interactive illustration attached to a theory card or exercise. */
export type Demo =
  | { type: 'piano'; from: string; to: string; highlight?: string[]; labels?: boolean | 'white' }
  | { type: 'staff'; clef: Clef; notes: string[]; labels?: boolean; playable?: boolean }
  | { type: 'sounds'; buttons: { label: L; notes: string[]; mode?: 'seq' | 'chord' }[] }

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
}

export type Exercise =
  | (Base & {
      type: 'choice'
      prompt: L
      options: L[]
      answer: number
      demo?: Demo
      audio?: { notes: string[]; mode?: 'seq' | 'chord' }
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
  /** Hear two notes and decide which is higher / lower. */
  | (Base & { type: 'ear-compare'; a: string; b: string; ask: 'higher' | 'lower' })

export interface Lesson {
  id: string
  title: L
  goal: L
  cards: TheoryCard[]
  exercises: Exercise[]
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
