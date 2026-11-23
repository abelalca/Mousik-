import type { Demo, Exercise } from '@/content/types'
import type { Genre, Locale } from '@/lib/types'
import { LETTERS, blackKeyName, isBlack, midi, noteName, parse, pitchClass, sample, shuffle, type Notation } from '@/lib/music'
import { GENRE_INSTRUMENTS, INSTRUMENTS, fitGroup, fitNote, resolveInstrument, type InstrumentId } from '@/lib/instruments'

export interface Option {
  key: string
  label: string
  correct: boolean
}

/** A sound to play: melodic sequence, chord, or the instrument's characteristic phrase. */
export interface Clip {
  notes: string[]
  mode: 'seq' | 'chord' | 'phrase'
  instrument: InstrumentId
}

interface Common {
  /** Raw text (may contain **bold** / {n:X} markup). */
  prompt: string
  explain?: string
  visual?: Demo
  /** Clips played one after another when the learner taps "listen" (and automatically on start). */
  audio?: Clip[]
  /** Instrument featured in this exercise (shown as a chip, used for piano/staff sound). */
  instrument: InstrumentId
  /** Don't reveal the instrument (when naming it is the exercise). */
  hideInstrument?: boolean
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

export interface BuildCtx {
  locale: Locale
  notation: Notation
  genre: Genre
  /** Varies the instrument rotation between exercises/lessons. */
  seed: number
}

const P = {
  nameNote: { en: 'Which note is this?', es: '¿Qué nota es esta?' },
  nameKey: { en: 'What is the name of the highlighted key?', es: '¿Cómo se llama la tecla resaltada?' },
  playName: { en: 'Play **{x}** on the piano', es: 'Toca **{x}** en el piano' },
  playStaff: { en: 'Play this note on the piano', es: 'Toca esta nota en el piano' },
  higher: { en: 'Which sound is **higher**?', es: '¿Qué sonido es más **agudo**?' },
  lower: { en: 'Which sound is **lower**?', es: '¿Qué sonido es más **grave**?' },
  higherInst: { en: 'Which instrument plays **higher**?', es: '¿Qué instrumento suena más **agudo**?' },
  lowerInst: { en: 'Which instrument plays **lower**?', es: '¿Qué instrumento suena más **grave**?' },
  first: { en: 'The first one', es: 'El primero' },
  second: { en: 'The second one', es: 'El segundo' },
  identify: { en: 'Which instrument is playing?', es: '¿Qué instrumento suena?' },
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

/** Instruments to choose from when naming what is heard: same family first (harder), then others. */
function instrumentDistractors(correct: InstrumentId, genre: Genre): InstrumentId[] {
  const pool = GENRE_INSTRUMENTS[genre].filter((i) => i !== correct)
  const fam = INSTRUMENTS[correct].family
  const same = shuffle(pool.filter((i) => INSTRUMENTS[i].family === fam)).slice(0, 1)
  const rest = shuffle(pool.filter((i) => !same.includes(i)))
  return [...same, ...rest].slice(0, 3)
}

export function buildQuestion(ex: Exercise, c: BuildCtx): Question {
  const { locale, notation, genre, seed } = c
  const L = (l: { en: string; es: string }) => l[locale]
  const explain = ex.explain ? L(ex.explain) : undefined
  const instName = (id: InstrumentId) => L(INSTRUMENTS[id].name)

  switch (ex.type) {
    case 'choice': {
      const instrument = resolveInstrument(ex.instrument, genre, seed, ex.audio?.notes ?? [])
      const options = shuffle(ex.options.map((o, i) => ({ key: String(i), label: L(o), correct: i === ex.answer })))
      return {
        kind: 'options',
        prompt: L(ex.prompt),
        options,
        correctLabel: L(ex.options[ex.answer]),
        explain,
        visual: ex.demo,
        instrument: ex.audio ? instrument : 'piano',
        audio: ex.audio ? [{ notes: fitGroup(ex.audio.notes, instrument), mode: ex.audio.mode ?? 'seq', instrument }] : undefined,
      }
    }
    case 'name-note': {
      // The written octave must be playable, so the sound matches the staff exactly.
      const instrument = resolveInstrument(ex.instrument, genre, seed, [ex.note], true, ex.clef)
      const correct = noteName(ex.note, notation)
      const ds = (ex.distractors ?? nameDistractors(ex.note)).map((d) => noteName(d, notation))
      const options = shuffle([correct, ...ds.filter((d) => d !== correct).slice(0, 3)]).map((label) => ({ key: label, label, correct: label === correct }))
      return {
        kind: 'options',
        prompt: L(P.nameNote),
        visual: { type: 'staff', clef: ex.clef, notes: [ex.note], playable: true, instrument },
        options,
        correctLabel: correct,
        explain,
        instrument,
      }
    }
    case 'name-key': {
      // Keyboard geography is theory: the piano is the reference here.
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
        visual: { type: 'piano', from: range[0], to: range[1], highlight: [ex.note], instrument: ex.instrument ?? 'piano' },
        options,
        correctLabel: correct,
        explain,
        instrument: 'piano',
      }
    }
    case 'play-note': {
      const exact = ex.show === 'staff'
      const instrument = resolveInstrument(ex.instrument, genre, seed, [ex.target], exact, exact ? ex.clef ?? 'treble' : undefined)
      const accept = new Set((ex.accept ?? [ex.target]).map((n) => (ex.anyOctave ? pitchClass(n) : midi(n))))
      const isCorrect = (m: number) => accept.has(ex.anyOctave ? ((m % 12) + 12) % 12 : m)
      const name = noteName(ex.target, notation)
      const prompt =
        ex.show === 'custom' && ex.prompt ? L(ex.prompt) : ex.show === 'staff' ? L(P.playStaff) : L(P.playName).replace('{x}', name)
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
        instrument,
      }
    }
    case 'ear-compare': {
      if (ex.instruments) {
        // Two different instruments: compare the pitches that actually sound after range fitting.
        const ia = resolveInstrument(ex.instruments[0], genre, seed)
        let ib = resolveInstrument(ex.instruments[1], genre, seed + 1)
        if (ib === ia) ib = resolveInstrument(ex.instruments[1], genre, seed + 2)
        const a = fitNote(ex.a, ia)
        const b = fitNote(ex.b, ib)
        const aWins = ex.ask === 'higher' ? midi(a) > midi(b) : midi(a) < midi(b)
        const la = `1 · ${instName(ia)}`
        const lb = `2 · ${instName(ib)}`
        return {
          kind: 'options',
          prompt: L(ex.ask === 'higher' ? P.higherInst : P.lowerInst),
          audio: [
            { notes: [a], mode: 'seq', instrument: ia },
            { notes: [b], mode: 'seq', instrument: ib },
          ],
          options: [
            { key: 'a', label: la, correct: aWins },
            { key: 'b', label: lb, correct: !aWins },
          ],
          correctLabel: aWins ? la : lb,
          explain,
          instrument: ia,
          hideInstrument: true,
        }
      }
      const instrument = resolveInstrument(ex.instrument, genre, seed, [ex.a, ex.b])
      const [a, b] = fitGroup([ex.a, ex.b], instrument)
      const aWins = ex.ask === 'higher' ? midi(a) > midi(b) : midi(a) < midi(b)
      return {
        kind: 'options',
        prompt: L(ex.ask === 'higher' ? P.higher : P.lower),
        audio: [{ notes: [a, b], mode: 'seq', instrument }],
        options: [
          { key: 'a', label: L(P.first), correct: aWins },
          { key: 'b', label: L(P.second), correct: !aWins },
        ],
        correctLabel: L(aWins ? P.first : P.second),
        explain,
        instrument,
      }
    }
    case 'identify-instrument': {
      const pool = GENRE_INSTRUMENTS[genre].filter((i) => i !== 'piano')
      const correct = ex.instrument === 'auto' ? pool[Math.abs(seed) % pool.length] : resolveInstrument(ex.instrument, genre, seed)
      const options = shuffle([correct, ...instrumentDistractors(correct, genre)]).map((id) => ({ key: id, label: instName(id), correct: id === correct }))
      return {
        kind: 'options',
        prompt: L(P.identify),
        audio: [{ notes: [], mode: 'phrase', instrument: correct }],
        options,
        correctLabel: instName(correct),
        explain: explain ?? `**${instName(correct)}** — ${L(INSTRUMENTS[correct].blurb)}`,
        instrument: correct,
        hideInstrument: true,
      }
    }
  }
}
