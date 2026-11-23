import type { CharacterId } from '@/components/characters'
import type { InstrumentId } from '@/lib/instruments'
import type { ByGenre, L } from '@/lib/types'
import type { SongEvent } from '@/lib/song'
import { course } from './course'

/**
 * Mo's band. Each musician presents one unit (gives its tips) and joins the band when the
 * learner finishes that unit, adding a new layer to the learner's song.
 */
export type BandRole = 'leader' | 'percussion' | 'soloist' | 'accompanist' | 'bassist' | 'second-voice'

export interface BandMember {
  id: CharacterId
  role: BandRole
  roleName: L
  /** Unit whose completion brings this musician into the band (null = always there). */
  joinsUnit: string | null
  /** Instrument per genre (null = not in the sound catalog yet; `instrumentName` is shown). */
  instrument: ByGenre<InstrumentId | null>
  instrumentName?: Partial<ByGenre<L>>
  /** What this musician adds to the song. */
  adds: L
  /** What the musician's name means (every name is a term from the score). */
  nameMeaning: L
}

export const BAND: BandMember[] = [
  {
    id: 'mo',
    nameMeaning: { en: 'comes from “motif”: the seed of every song.', es: 'viene de “motivo”: la semilla de toda canción.' },
    role: 'leader',
    roleName: { en: 'Band leader', es: 'Líder de la banda' },
    joinsUnit: null,
    instrument: { classical: 'piano', pop: 'epiano', rock: 'organ' },
    adds: { en: 'Your melody and the low note under it.', es: 'Tu melodía y la nota grave que la sostiene.' },
  },
  {
    id: 'hamster',
    nameMeaning: { en: 'is the speed of the beat.', es: 'es la velocidad del pulso.' },
    role: 'percussion',
    roleName: { en: 'Percussion', es: 'Percusión' },
    joinsUnit: 'u2',
    instrument: { classical: null, pop: 'drums', rock: 'drums' },
    instrumentName: { classical: { en: 'Timpani and cymbals', es: 'Timbales y platillos' } },
    adds: { en: 'The groove: the rhythm everything rests on.', es: 'El groove: el ritmo sobre el que descansa todo.' },
  },
  {
    id: 'squirrel',
    nameMeaning: { en: '(trill) is a fast ornament between two neighbouring notes.', es: 'es un adorno rápido entre dos notas vecinas.' },
    role: 'soloist',
    roleName: { en: 'Soloist', es: 'Solista' },
    joinsUnit: 'u3',
    instrument: { classical: 'violin', pop: 'synth-lead', rock: 'guitar-distortion' },
    adds: { en: 'Answers your motif and stretches it into a phrase.', es: 'Responde a tu motivo y lo alarga en una frase.' },
  },
  {
    id: 'capybara',
    nameMeaning: { en: '(𝄐) means “pause and hold”.', es: '(𝄐) significa “detente y sostén”.' },
    role: 'accompanist',
    roleName: { en: 'Accompanist', es: 'Acompañante' },
    joinsUnit: 'u5',
    instrument: { classical: 'harp', pop: 'guitar-acoustic', rock: 'guitar-electric' },
    adds: { en: 'The chords that colour your melody.', es: 'Los acordes que dan color a tu melodía.' },
  },
  {
    id: 'beaver',
    nameMeaning: { en: 'means “bass” in Italian.', es: 'significa “bajo” en italiano.' },
    role: 'bassist',
    roleName: { en: 'Bassist', es: 'Bajista' },
    joinsUnit: 'u6',
    instrument: { classical: 'cello', pop: 'bass-electric', rock: 'bass-electric' },
    adds: { en: 'The bass line that holds the harmony up.', es: 'La línea de bajo que sostiene la armonía.' },
  },
  {
    id: 'chinchilla',
    nameMeaning: { en: 'means “sweetly, softly”.', es: 'significa “dulce, suave”.' },
    role: 'second-voice',
    roleName: { en: 'Second voice', es: 'Segunda voz' },
    joinsUnit: 'u7',
    instrument: { classical: 'flute', pop: 'synth-pad', rock: 'organ' },
    adds: { en: 'A countermelody that dances around yours.', es: 'Una contramelodía que baila alrededor de la tuya.' },
  },
]

export const member = (id: CharacterId) => BAND.find((m) => m.id === id)!

/** Who presents each unit (gives its tips). Unit 4 levels up the soloist; Unit 8 is the whole band with Mo. */
const PRESENTER: Record<string, CharacterId> = { u1: 'mo', u2: 'hamster', u3: 'squirrel', u4: 'squirrel', u5: 'capybara', u6: 'beaver', u7: 'chinchilla', u8: 'mo' }
export const unitPresenter = (unitId: string): CharacterId => PRESENTER[unitId] ?? 'mo'

/** A unit is finished when it has lessons and all of them are completed. */
export function unitDone(unitId: string, completed: Record<string, unknown>) {
  const u = course.find((x) => x.id === unitId)
  return !!u && u.lessons.length > 0 && u.lessons.every((l) => completed[l.id])
}

/** A unit is reached when every earlier unit is finished (its presenter can be met). */
export function unitReached(unitId: string, completed: Record<string, unknown>) {
  const i = course.findIndex((u) => u.id === unitId)
  return i >= 0 && course.slice(0, i).every((u) => unitDone(u.id, completed))
}

export const isInBand = (m: BandMember, completed: Record<string, unknown>) => !m.joinsUnit || unitDone(m.joinsUnit, completed)

/** Musicians who join the band when this unit is finished. */
export const joinsAfter = (unitId: string) => BAND.filter((m) => m.joinsUnit === unitId)

export const unitNumber = (unitId: string) => course.findIndex((u) => u.id === unitId) + 1

/** Which musician plays each part of the song (one layer per musician). */
export const PART_PLAYER: Record<SongEvent['part'], CharacterId> = { melody: 'mo', bass: 'mo' }
