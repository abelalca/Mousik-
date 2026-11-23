import type { ByGenre, Genre, L } from './types'
import { fromMidi, midi } from './music'

export type InstrumentId =
  | 'piano'
  | 'violin'
  | 'cello'
  | 'contrabass'
  | 'flute'
  | 'clarinet'
  | 'bassoon'
  | 'trumpet'
  | 'french-horn'
  | 'harp'
  | 'epiano'
  | 'synth-lead'
  | 'synth-pad'
  | 'guitar-acoustic'
  | 'guitar-electric'
  | 'guitar-distortion'
  | 'bass-electric'
  | 'organ'
  | 'drums'

export type Family = 'keys' | 'strings' | 'plucked' | 'woodwinds' | 'brass' | 'synth' | 'percussion'

/** Musical job an instrument does in a band/ensemble. Content can ask for "role:bass" etc. */
export type Role = 'bass' | 'lead' | 'chords'

/** How content refers to an instrument: a concrete id, a role resolved per genre, or "auto" (rotation). */
export type InstrumentRef = InstrumentId | `role:${Role}` | 'auto'

export interface Instrument {
  id: InstrumentId
  name: L
  family: Family
  /** Sounding range used for playback (notes outside are moved by octaves). */
  range: [string, string]
  clef: 'treble' | 'bass' | 'grand' | 'none'
  /** Folder in /public/samples, if sample based. */
  samples?: string
  /** One-line description (register + how the sound is produced). */
  blurb: L
}

export const FAMILY_NAME: Record<Family, L> = {
  keys: { en: 'Keyboards', es: 'Teclados' },
  strings: { en: 'Bowed strings', es: 'Cuerda frotada' },
  plucked: { en: 'Plucked strings', es: 'Cuerda pulsada' },
  woodwinds: { en: 'Woodwinds', es: 'Viento madera' },
  brass: { en: 'Brass', es: 'Viento metal' },
  synth: { en: 'Synthesizers', es: 'Sintetizadores' },
  percussion: { en: 'Percussion', es: 'Percusión' },
}

const I = (
  id: InstrumentId,
  en: string,
  es: string,
  family: Family,
  range: [string, string],
  clef: Instrument['clef'],
  blurb: L,
  samples?: string,
): Instrument => ({ id, name: { en, es }, family, range, clef, blurb, samples })

export const INSTRUMENTS: Record<InstrumentId, Instrument> = {
  piano: I('piano', 'Piano', 'Piano', 'keys', ['A1', 'C7'], 'grand', {
    en: 'Hammers strike strings. Covers almost every register — the map of all music.',
    es: 'Martillos golpean cuerdas. Abarca casi todos los registros: el mapa de toda la música.',
  }, 'piano'),
  violin: I('violin', 'Violin', 'Violín', 'strings', ['G3', 'C7'], 'treble', {
    en: 'The smallest and highest bowed string. Sings melodies with great expression.',
    es: 'La cuerda frotada más pequeña y aguda. Canta melodías con mucha expresión.',
  }, 'violin'),
  cello: I('cello', 'Cello', 'Violonchelo', 'strings', ['C2', 'C5'], 'bass', {
    en: 'Played sitting down. A warm, deep voice, close to the human voice.',
    es: 'Se toca sentado. Una voz cálida y profunda, cercana a la voz humana.',
  }, 'cello'),
  contrabass: I('contrabass', 'Double bass', 'Contrabajo', 'strings', ['E1', 'G3'], 'bass', {
    en: 'The biggest and lowest of the strings: the foundation of the orchestra.',
    es: 'La más grande y grave de las cuerdas: el cimiento de la orquesta.',
  }, 'contrabass'),
  flute: I('flute', 'Flute', 'Flauta', 'woodwinds', ['C4', 'C7'], 'treble', {
    en: 'You blow across a hole. Bright, airy and high.',
    es: 'Se sopla sobre un orificio. Sonido brillante, aéreo y agudo.',
  }, 'flute'),
  clarinet: I('clarinet', 'Clarinet', 'Clarinete', 'woodwinds', ['D3', 'C6'], 'treble', {
    en: 'A single reed vibrates. Dark and round low, sweet high.',
    es: 'Vibra una sola caña. Oscuro y redondo en el grave, dulce en el agudo.',
  }, 'clarinet'),
  bassoon: I('bassoon', 'Bassoon', 'Fagot', 'woodwinds', ['A1', 'C5'], 'bass', {
    en: 'A double reed and a long folded tube: the bass of the woodwinds.',
    es: 'Doble caña y un tubo largo doblado: el bajo de las maderas.',
  }, 'bassoon'),
  trumpet: I('trumpet', 'Trumpet', 'Trompeta', 'brass', ['F#3', 'C6'], 'treble', {
    en: 'Lips buzz into a metal mouthpiece. Brilliant and heroic.',
    es: 'Los labios vibran en una boquilla de metal. Brillante y heroica.',
  }, 'trumpet'),
  'french-horn': I('french-horn', 'French horn', 'Trompa', 'brass', ['B1', 'F5'], 'treble', {
    en: 'A long coiled tube with a big bell. Noble, warm and round.',
    es: 'Un tubo largo enrollado con una gran campana. Noble, cálida y redonda.',
  }, 'french-horn'),
  harp: I('harp', 'Harp', 'Arpa', 'plucked', ['C2', 'C7'], 'grand', {
    en: 'Strings plucked with the fingers. Shimmering arpeggios and glissandos.',
    es: 'Cuerdas pulsadas con los dedos. Arpegios y glissandos brillantes.',
  }, 'harp'),
  epiano: I('epiano', 'Electric piano', 'Piano eléctrico', 'keys', ['C2', 'C6'], 'grand', {
    en: 'A bell-like, soft keyboard sound, full of warmth. Loved in pop and soul.',
    es: 'Un sonido de teclado suave y como de campana, muy cálido. Adorado en el pop y el soul.',
  }),
  'synth-lead': I('synth-lead', 'Synth lead', 'Sintetizador solista', 'synth', ['C3', 'C7'], 'treble', {
    en: 'An electronic voice designed to cut through: perfect for hooks and riffs.',
    es: 'Una voz electrónica diseñada para destacar: perfecta para ganchos y riffs.',
  }),
  'synth-pad': I('synth-pad', 'Synth pad', 'Pad de sintetizador', 'synth', ['C2', 'C6'], 'grand', {
    en: 'A soft, sustained cloud of sound that fills the background with harmony.',
    es: 'Una nube de sonido suave y sostenida que llena el fondo de armonía.',
  }),
  'guitar-acoustic': I('guitar-acoustic', 'Acoustic guitar', 'Guitarra acústica', 'plucked', ['E2', 'D5'], 'treble', {
    en: 'Steel strings and a wooden body. Strummed chords that drive a song.',
    es: 'Cuerdas de acero y caja de madera. Acordes rasgueados que impulsan una canción.',
  }, 'guitar-acoustic'),
  'guitar-electric': I('guitar-electric', 'Clean electric guitar', 'Guitarra eléctrica limpia', 'plucked', ['E2', 'C6'], 'treble', {
    en: 'An electric guitar without distortion: clear, bright and articulate.',
    es: 'Una guitarra eléctrica sin distorsión: clara, brillante y definida.',
  }, 'guitar-electric'),
  'guitar-distortion': I('guitar-distortion', 'Distorted guitar', 'Guitarra distorsionada', 'plucked', ['E2', 'C6'], 'treble', {
    en: 'The sound of rock: the amplifier is pushed until the tone turns gritty and powerful.',
    es: 'El sonido del rock: el amplificador se fuerza hasta que el tono se vuelve áspero y poderoso.',
  }, 'guitar-electric'),
  'bass-electric': I('bass-electric', 'Electric bass', 'Bajo eléctrico', 'plucked', ['E1', 'G4'], 'bass', {
    en: 'Four thick strings, an octave below the guitar. Glues rhythm and harmony together.',
    es: 'Cuatro cuerdas gruesas, una octava por debajo de la guitarra. Une el ritmo y la armonía.',
  }, 'bass-electric'),
  organ: I('organ', 'Organ', 'Órgano', 'keys', ['C2', 'C6'], 'grand', {
    en: 'Air through pipes or tonewheels: notes sustain as long as you hold the key.',
    es: 'Aire por tubos o ruedas fónicas: las notas duran mientras mantienes la tecla.',
  }, 'organ'),
  drums: I('drums', 'Drum kit', 'Batería', 'percussion', ['C1', 'C1'], 'none', {
    en: 'Kick, snare and cymbals: they keep the beat. No pitches — pure rhythm.',
    es: 'Bombo, caja y platillos: marcan el pulso. Sin alturas definidas: puro ritmo.',
  }),
}

/** Instruments each genre uses (order = how they are introduced). */
export const GENRE_INSTRUMENTS: ByGenre<InstrumentId[]> = {
  classical: ['piano', 'violin', 'cello', 'contrabass', 'flute', 'clarinet', 'bassoon', 'trumpet', 'french-horn', 'harp'],
  pop: ['piano', 'epiano', 'synth-lead', 'synth-pad', 'guitar-acoustic', 'bass-electric', 'drums'],
  rock: ['guitar-distortion', 'guitar-electric', 'bass-electric', 'drums', 'organ', 'piano'],
}

export const ROLES: ByGenre<Record<Role, InstrumentId[]>> = {
  // The piano is the theory reference, so roles point to the genre's other instruments.
  classical: { bass: ['cello', 'contrabass', 'bassoon'], lead: ['violin', 'flute', 'clarinet', 'trumpet'], chords: ['harp', 'french-horn'] },
  pop: { bass: ['bass-electric'], lead: ['synth-lead'], chords: ['epiano', 'guitar-acoustic', 'synth-pad'] },
  rock: { bass: ['bass-electric'], lead: ['guitar-distortion'], chords: ['guitar-electric', 'organ'] },
}

/** What each instrument does in each genre (shown in the instrument cards). */
export const GENRE_ROLE_TEXT: ByGenre<Partial<Record<InstrumentId, L>>> = {
  classical: {
    piano: { en: 'Soloist in concertos, partner in chamber music.', es: 'Solista en conciertos y compañero en música de cámara.' },
    violin: { en: 'Leads the melody: the first violins are the "voice" of the orchestra.', es: 'Lleva la melodía: los primeros violines son la "voz" de la orquesta.' },
    cello: { en: 'Bass lines and singing countermelodies.', es: 'Líneas de bajo y contramelodías que cantan.' },
    contrabass: { en: 'Doubles the bass an octave lower: depth and weight.', es: 'Dobla el bajo una octava más grave: profundidad y peso.' },
    flute: { en: 'Decorates the top with light, agile lines.', es: 'Decora la parte aguda con líneas ligeras y ágiles.' },
    clarinet: { en: 'Smooth melodies and warm inner harmonies.', es: 'Melodías suaves y armonías interiores cálidas.' },
    bassoon: { en: 'Bass of the winds; can also be playful and comic.', es: 'Bajo de los vientos; también puede ser juguetón y cómico.' },
    trumpet: { en: 'Fanfares, climaxes and brilliance.', es: 'Fanfarrias, clímax y brillo.' },
    'french-horn': { en: 'Holds the harmony together and plays noble calls.', es: 'Sostiene la armonía y toca llamadas nobles.' },
    harp: { en: 'Arpeggios and magical color.', es: 'Arpegios y color mágico.' },
  },
  pop: {
    piano: { en: 'Ballads and chord accompaniment under the voice.', es: 'Baladas y acompañamiento de acordes bajo la voz.' },
    epiano: { en: 'Smooth, warm chords in verses.', es: 'Acordes suaves y cálidos en los versos.' },
    'synth-lead': { en: 'Instrumental hooks you can\'t stop humming.', es: 'Ganchos instrumentales que no puedes dejar de tararear.' },
    'synth-pad': { en: 'Background harmony that makes the chorus feel huge.', es: 'Armonía de fondo que hace que el estribillo se sienta enorme.' },
    'guitar-acoustic': { en: 'Strummed chords and rhythmic drive.', es: 'Acordes rasgueados e impulso rítmico.' },
    'bass-electric': { en: 'The groove: locks in with the kick drum.', es: 'El groove: se engancha con el bombo.' },
    drums: { en: 'The beat everyone dances to.', es: 'El pulso que todos bailan.' },
  },
  rock: {
    'guitar-distortion': { en: 'Riffs and power chords: the engine of rock.', es: 'Riffs y power chords: el motor del rock.' },
    'guitar-electric': { en: 'Clean arpeggios in verses and intros.', es: 'Arpegios limpios en versos e intros.' },
    'bass-electric': { en: 'Follows the riff down low and drives the band.', es: 'Sigue el riff en el grave e impulsa a la banda.' },
    drums: { en: 'Power and energy: the backbeat on 2 and 4.', es: 'Potencia y energía: el golpe fuerte en el 2 y el 4.' },
    organ: { en: 'Thick, growling chords in classic rock.', es: 'Acordes densos y rugientes en el rock clásico.' },
    piano: { en: 'Pounding chords in rock \'n\' roll and power ballads.', es: 'Acordes martillados en el rock and roll y las baladas.' },
  },
}

/** Melodic (pitched, non-piano) instruments used for rotation in exercises. */
export const practiceInstruments = (genre: Genre) => GENRE_INSTRUMENTS[genre].filter((i) => i !== 'piano' && i !== 'drums')

// ---------- range helpers ----------

/** Moves a single note by octaves into the instrument's range. */
export function fitNote(note: string, id: InstrumentId): string {
  if (id === 'drums') return note
  const [lo, hi] = INSTRUMENTS[id].range.map(midi)
  let m = midi(note)
  while (m < lo) m += 12
  while (m > hi) m -= 12
  return m === midi(note) ? note : fromMidi(m)
}

/** Moves a group of notes by the same number of octaves so they all fit (keeps relative pitch). */
export function fitGroup(notes: string[], id: InstrumentId): string[] {
  if (id === 'drums') return notes
  const [lo, hi] = INSTRUMENTS[id].range.map(midi)
  const ms = notes.map(midi)
  const min = Math.min(...ms)
  const max = Math.max(...ms)
  for (const k of [0, 1, -1, 2, -2, 3, -3, 4, -4]) {
    if (min + 12 * k >= lo && max + 12 * k <= hi) return k === 0 ? notes : ms.map((m) => fromMidi(m + 12 * k))
  }
  return notes.map((n) => fitNote(n, id))
}

export const fitsExactly = (notes: string[], id: InstrumentId) => {
  const [lo, hi] = INSTRUMENTS[id].range.map(midi)
  return notes.every((n) => midi(n) >= lo && midi(n) <= hi)
}
export const fitsShifted = (notes: string[], id: InstrumentId) => {
  const [lo, hi] = INSTRUMENTS[id].range.map(midi)
  const ms = notes.map(midi)
  return Math.max(...ms) - Math.min(...ms) <= hi - lo
}

/**
 * Resolves an InstrumentRef for the learner's genre.
 *  - 'role:bass'  → the genre's bass instrument
 *  - 'auto'       → rotates through the genre's instruments (seeded), only picking ones that fit the notes
 *    (exact = the written octave must be playable, used when a staff is shown)
 */
export function resolveInstrument(
  ref: InstrumentRef | undefined,
  genre: Genre,
  seed = 0,
  notes: string[] = [],
  exact = false,
  /** Prefer instruments that read this clef (reading exercises). */
  clef?: 'treble' | 'bass' | 'grand',
): InstrumentId {
  if (!ref || ref === 'auto') {
    let pool = practiceInstruments(genre).filter((id) => !notes.length || (exact ? fitsExactly(notes, id) : fitsShifted(notes, id)))
    if (clef && clef !== 'grand') {
      const reading = pool.filter((id) => INSTRUMENTS[id].clef === clef || INSTRUMENTS[id].clef === 'grand')
      if (reading.length) pool = reading
    }
    return pool.length ? pool[Math.abs(seed) % pool.length] : 'piano'
  }
  if (ref.startsWith('role:')) {
    const list = ROLES[genre][ref.slice(5) as keyof (typeof ROLES)['pop']]
    return list[Math.abs(seed) % list.length]
  }
  return ref as InstrumentId
}

