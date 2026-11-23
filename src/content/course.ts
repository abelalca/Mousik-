import type { Unit, Lesson } from './types'
import { unit1Lessons } from './unit1'

const lv = {
  f: { en: 'Fundamentals', es: 'Fundamentos' },
  i: { en: 'Intermediate', es: 'Intermedio' },
  a: { en: 'Advanced', es: 'Avanzado' },
  e: { en: 'Expert', es: 'Experto' },
}

export const course: Unit[] = [
  {
    id: 'u1',
    level: lv.f,
    title: { en: 'Pitch, keyboard & staff', es: 'Altura, teclado y pentagrama' },
    description: { en: 'Hear, find and read your first notes.', es: 'Escucha, encuentra y lee tus primeras notas.' },
    lessons: unit1Lessons,
  },
  {
    id: 'u2',
    level: lv.f,
    title: { en: 'Rhythm & meter', es: 'Ritmo y compás' },
    description: { en: 'Beat, note values, time signatures and tempo.', es: 'Pulso, figuras, compases y tempo.' },
    lessons: [],
    upcoming: [
      { en: 'Pulse, tempo and basic note values', es: 'Pulso, tempo y figuras básicas' },
      { en: 'Meter, bars and time signatures', es: 'Métrica, compases y cifras de compás' },
      { en: 'Eighth notes: counting "1 & 2 &"', es: 'Corcheas: contar "1 y 2 y"' },
      { en: 'Dots and ties', es: 'Puntillos y ligaduras' },
      { en: 'Sixteenths and syncopation', es: 'Semicorcheas y síncopa' },
      { en: 'Compound meter, triplets and swing', es: 'Compás compuesto, tresillos y swing' },
    ],
  },
  {
    id: 'u3',
    level: lv.i,
    title: { en: 'Intervals', es: 'Intervalos' },
    description: { en: 'Measure and recognize the distance between notes.', es: 'Mide y reconoce la distancia entre notas.' },
    lessons: [],
    upcoming: [
      { en: 'Steps, skips and leaps', es: 'Grados conjuntos, saltos y brincos' },
      { en: 'Seconds and thirds: major and minor', es: 'Segundas y terceras: mayores y menores' },
      { en: 'Perfect intervals', es: 'Intervalos justos' },
      { en: 'Sixths, sevenths and inversion', es: 'Sextas, séptimas e inversión' },
      { en: 'Tritone, consonance and dissonance', es: 'Tritono, consonancia y disonancia' },
    ],
  },
  {
    id: 'u4',
    level: lv.i,
    title: { en: 'Scales & keys', es: 'Escalas y tonalidades' },
    description: { en: 'Major, minor, pentatonic and the circle of fifths.', es: 'Mayor, menor, pentatónica y el círculo de quintas.' },
    lessons: [],
    upcoming: [
      { en: 'The major scale and scale degrees', es: 'La escala mayor y sus grados' },
      { en: 'Key signatures and the circle of fifths', es: 'Armaduras y círculo de quintas' },
      { en: 'Minor scales', es: 'Escalas menores' },
      { en: 'Pentatonic and blues scales', es: 'Escalas pentatónica y de blues' },
      { en: 'Modes as colors', es: 'Los modos como colores' },
      { en: 'Hearing keys and transposing', es: 'Oír tonalidades y transportar' },
    ],
  },
  {
    id: 'u5',
    level: lv.i,
    title: { en: 'Chords', es: 'Acordes' },
    description: { en: 'Triads, inversions, sevenths and power chords.', es: 'Tríadas, inversiones, séptimas y power chords.' },
    lessons: [],
    upcoming: [
      { en: 'Major and minor triads', es: 'Tríadas mayores y menores' },
      { en: 'Diminished, augmented and diatonic triads', es: 'Disminuidas, aumentadas y tríadas diatónicas' },
      { en: 'Triads in minor keys', es: 'Tríadas en tonalidades menores' },
      { en: 'Inversions and voicing', es: 'Inversiones y disposición' },
      { en: 'Seventh chords', es: 'Acordes de séptima' },
      { en: 'Power chords, sus and add9', es: 'Power chords, sus y add9' },
    ],
  },
  {
    id: 'u6',
    level: lv.a,
    title: { en: 'Harmony & progressions', es: 'Armonía y progresiones' },
    description: { en: 'Chord functions, cadences and the progressions of your genre.', es: 'Funciones, cadencias y las progresiones de tu género.' },
    lessons: [],
    upcoming: [
      { en: 'Tonic, predominant, dominant', es: 'Tónica, predominante, dominante' },
      { en: 'Cadences', es: 'Cadencias' },
      { en: 'Voice leading at the keyboard', es: 'Conducción de voces en el teclado' },
      { en: 'Progressions by genre', es: 'Progresiones por género' },
      { en: 'Secondary dominants and borrowed chords', es: 'Dominantes secundarias y acordes prestados' },
      { en: 'Harmonizing a melody', es: 'Armonizar una melodía' },
    ],
  },
  {
    id: 'u7',
    level: lv.a,
    title: { en: 'Melody & phrase', es: 'Melodía y frase' },
    description: { en: 'Motifs, contour, hooks, riffs and phrases.', es: 'Motivos, contorno, ganchos, riffs y frases.' },
    lessons: [],
    upcoming: [
      { en: 'Motifs and development', es: 'Motivos y desarrollo' },
      { en: 'Contour, range and climax', es: 'Contorno, registro y clímax' },
      { en: 'Chord tones and non-chord tones', es: 'Notas del acorde y notas extrañas' },
      { en: 'Phrases: question and answer', es: 'Frases: pregunta y respuesta' },
      { en: 'Hooks and riffs', es: 'Ganchos y riffs' },
    ],
  },
  {
    id: 'u8',
    level: lv.e,
    title: { en: 'Form & composition', es: 'Forma y composición' },
    description: { en: 'Structure, arranging — and your own piece.', es: 'Estructura, arreglo… y tu propia pieza.' },
    lessons: [],
    upcoming: [
      { en: 'Form: repetition, contrast, return', es: 'Forma: repetición, contraste, retorno' },
      { en: 'Genre forms', es: 'Formas de cada género' },
      { en: 'Texture and arranging', es: 'Textura y arreglo' },
      { en: 'Capstone I: plan your piece', es: 'Proyecto final I: planifica tu pieza' },
      { en: 'Capstone II: core sections', es: 'Proyecto final II: secciones principales' },
      { en: 'Capstone III: polish and share', es: 'Proyecto final III: pulir y compartir' },
    ],
  },
]

export const allLessons: Lesson[] = course.flatMap((u) => u.lessons)
export const findLesson = (id: string) => allLessons.find((l) => l.id === id)
export const unitOf = (id: string) => course.find((u) => u.lessons.some((l) => l.id === id))

/** A lesson is unlocked when every previous lesson has been completed. */
export function isUnlocked(id: string, completed: Record<string, unknown>) {
  const idx = allLessons.findIndex((l) => l.id === id)
  return allLessons.slice(0, idx).every((l) => completed[l.id])
}
