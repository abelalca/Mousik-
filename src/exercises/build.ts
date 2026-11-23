import type { Demo, Exercise } from '@/content/types'
import type { Locale } from '@/lib/types'
import { LETTERS, blackKeyName, isBlack, midi, noteName, parse, pitchClass, sample, shuffle, type Notation } from '@/lib/music'

export interface Option {
  key: string
  label: string
  correct: boolean
}

interface Common {
  /** Raw text (may contain **bold** / {n:X} markup). */
  prompt: string
  explain?: string
  visual?: Demo
  audio?: { notes: string[]; mode?: 'seq' | 'chord' }
}

export type Question =
  | (Common & { kind: 'options'; options: Option[]; correctLabel: string })
  | (Common & {
      kind: 'piano'
      range: [string, string]
      isCorrect: (m: number) => boolean
      target: string
      labels: boolean
      correctLabel: string
    })

const P = {
  nameNote: { en: 'Which note is this?', es: '¿Qué nota es esta?' },
  nameKey: { en: 'What is the name of the highlighted key?', es: '¿Cómo se llama la tecla resaltada?' },
  playName: { en: 'Play **{x}** on the piano', es: 'Toca **{x}** en el piano' },
  playStaff: { en: 'Play this note on the piano', es: 'Toca esta nota en el piano' },
  higher: { en: 'Which sound is **higher**?', es: '¿Qué sonido es más **agudo**?' },
  lower: { en: 'Which sound is **lower**?', es: '¿Qué sonido es más **grave**?' },
  first: { en: 'The first one', es: 'El primero' },
  second: { en: 'The second one', es: 'El segundo' },
}

function nameDistractors(note: string): string[] {
  const p = parse(note)
  const li = LETTERS.indexOf(p.letter)
  if (p.acc === 0) return sample(LETTERS.filter((l) => l !== p.letter), 3)
  // e.g. F# → F, G#, G   ·   Bb → B, Ab, A
  const sign = p.acc === 1 ? '#' : 'b'
  const step = p.acc === 1 ? 1 : 6
  const neighbor = LETTERS[(li + step) % 7]
  return [p.letter, neighbor + sign, neighbor].filter((n) => pitchClass(n) !== pitchClass(note))
}

export function buildQuestion(ex: Exercise, locale: Locale, notation: Notation): Question {
  const L = (l: { en: string; es: string }) => l[locale]
  const explain = ex.explain ? L(ex.explain) : undefined

  switch (ex.type) {
    case 'choice': {
      const options = shuffle(ex.options.map((o, i) => ({ key: String(i), label: L(o), correct: i === ex.answer })))
      return { kind: 'options', prompt: L(ex.prompt), options, correctLabel: L(ex.options[ex.answer]), explain, visual: ex.demo, audio: ex.audio }
    }
    case 'name-note': {
      const correct = noteName(ex.note, notation)
      const ds = (ex.distractors ?? nameDistractors(ex.note)).map((d) => noteName(d, notation))
      const options = shuffle([correct, ...ds.filter((d) => d !== correct).slice(0, 3)]).map((label) => ({ key: label, label, correct: label === correct }))
      return {
        kind: 'options',
        prompt: L(P.nameNote),
        visual: { type: 'staff', clef: ex.clef, notes: [ex.note], playable: true },
        options,
        correctLabel: correct,
        explain,
      }
    }
    case 'name-key': {
      const m = midi(ex.note)
      const range = ex.range ?? ['C4', 'B4']
      let correct: string
      let ds: string[]
      if (isBlack(m)) {
        correct = blackKeyName(m, notation)
        ds = sample([1, 3, 6, 8, 10].filter((pc) => pc !== m % 12), 3).map((pc) => blackKeyName(60 + pc, notation))
      } else {
        correct = noteName(ex.note, notation)
        ds = (ex.distractors ?? nameDistractors(ex.note)).map((d) => noteName(d, notation))
      }
      const options = shuffle([correct, ...ds.slice(0, 3)]).map((label) => ({ key: label, label, correct: label === correct }))
      return {
        kind: 'options',
        prompt: L(P.nameKey),
        visual: { type: 'piano', from: range[0], to: range[1], highlight: [ex.note] },
        options,
        correctLabel: correct,
        explain,
      }
    }
    case 'play-note': {
      const accept = new Set((ex.accept ?? [ex.target]).map((n) => (ex.anyOctave ? pitchClass(n) : midi(n))))
      const isCorrect = (m: number) => accept.has(ex.anyOctave ? ((m % 12) + 12) % 12 : m)
      const name = noteName(ex.target, notation)
      const prompt =
        ex.show === 'custom' && ex.prompt
          ? L(ex.prompt)
          : ex.show === 'staff'
            ? L(P.playStaff)
            : L(P.playName).replace('{x}', name)
      return {
        kind: 'piano',
        prompt,
        visual: ex.show === 'staff' ? { type: 'staff', clef: ex.clef ?? 'treble', notes: [ex.target], playable: false } : undefined,
        range: ex.range ?? ['C4', 'B5'],
        isCorrect,
        target: ex.target,
        labels: ex.labels ?? false,
        correctLabel: name,
        explain,
      }
    }
    case 'ear-compare': {
      const aWins = ex.ask === 'higher' ? midi(ex.a) > midi(ex.b) : midi(ex.a) < midi(ex.b)
      return {
        kind: 'options',
        prompt: L(ex.ask === 'higher' ? P.higher : P.lower),
        audio: { notes: [ex.a, ex.b], mode: 'seq' },
        options: [
          { key: 'a', label: L(P.first), correct: aWins },
          { key: 'b', label: L(P.second), correct: !aWins },
        ],
        correctLabel: L(aWins ? P.first : P.second),
        explain,
      }
    }
  }
}
