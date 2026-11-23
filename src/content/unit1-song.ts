import type { CreateStep } from './types'

/**
 * Unit 1 builds the seed of the learner's song: a 4-note motif, its register and Mo's bass note.
 * Each step uses what the lesson just taught (high/low, note names, staff, bass clef, sharps/flats).
 */
export const unit1Song: Record<string, CreateStep> = {
  'u1-l1': {
    slot: { kind: 'register' },
    prompt: { en: 'Where will your song live: low, middle or high?', es: '¿Dónde vivirá tu canción: en el grave, en el medio o en el agudo?' },
    tip: {
      en: 'Low sounds feel deep and calm; high sounds feel bright and light. Tap each one to hear it.',
      es: 'Los graves suenan profundos y tranquilos; los agudos, brillantes y ligeros. Toca cada uno para escucharlo.',
    },
  },
  'u1-inst': {
    slot: { kind: 'motif-note', index: 0 },
    prompt: { en: 'Pick the **first note** of your song.', es: 'Elige la **primera nota** de tu canción.' },
    tip: { en: 'Trust your ear: tap them and keep the one you like.', es: 'Confía en tu oído: tócalas y quédate con la que te guste.' },
    options: ['C4', 'E4', 'G4', 'A4'],
    show: 'name',
  },
  'u1-l2': {
    slot: { kind: 'motif-note', index: 1 },
    prompt: { en: 'Now the **second note**. You already know their names!', es: 'Ahora la **segunda nota**. ¡Ya sabes cómo se llaman!' },
    tip: {
      en: 'A neighbour note (one step away) sounds smooth; a far one sounds like a jump.',
      es: 'Una nota vecina (a un paso) suena suave; una lejana suena a salto.',
    },
    options: ['D4', 'E4', 'F4', 'G4'],
    show: 'name',
  },
  'u1-l3': {
    slot: { kind: 'motif-note', index: 2 },
    prompt: { en: 'Read the staff and choose the **third note**.', es: 'Lee el pentagrama y elige la **tercera nota**.' },
    tip: {
      en: 'Notes higher on the staff sound higher. Going up builds energy.',
      es: 'Las notas más arriba en el pentagrama suenan más agudas. Subir da energía.',
    },
    options: ['G4', 'A4', 'B4', 'C5'],
    show: 'staff',
  },
  'u1-l4': {
    slot: { kind: 'bass-note' },
    prompt: { en: 'Mo will hold a **low note** under your melody. Which one?', es: 'Mo sostendrá una **nota grave** bajo tu melodía. ¿Cuál?' },
    tip: {
      en: 'This note is written in bass clef. {n:C} feels stable; the others add colour.',
      es: 'Esta nota se escribe en clave de fa. {n:C} suena estable; las demás le dan color.',
    },
    options: ['C3', 'F2', 'G2', 'A2'],
    show: 'staff',
  },
  'u1-l5': {
    slot: { kind: 'motif-note', index: 3 },
    prompt: { en: 'How does your motif **end**?', es: '¿Cómo **termina** tu motivo?' },
    tip: {
      en: 'Ending on {n:C} sounds like coming home. {n:F#} or {n:Bb} leave it hanging, as if asking a question.',
      es: 'Terminar en {n:C} suena a llegar a casa. {n:F#} o {n:Bb} lo dejan en el aire, como una pregunta.',
    },
    options: ['C4', 'G4', 'F#4', 'Bb4'],
    show: 'name',
  },
}
