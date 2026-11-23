import type { Lesson } from './types'
import { instrumentsLesson } from './unit1-instruments'

/**
 * UNIT 1 — Pitch, the keyboard and the staff.
 * Pedagogy: "sound before symbol" — learners hear and touch pitch on the keyboard
 * before reading it on the staff. Each lesson: 3–4 short theory cards, then
 * 9–12 exercises mixing ear, keyboard and reading.
 */

const l1: Lesson = {
  id: 'u1-l1',
  title: { en: 'High and low sounds', es: 'Sonidos agudos y graves' },
  goal: {
    en: 'Hear the difference between high and low pitch and find your way around the keyboard.',
    es: 'Distinguir sonidos agudos y graves y orientarte en el teclado.',
  },
  cards: [
    {
      title: { en: 'Every sound has a pitch', es: 'Cada sonido tiene una altura' },
      body: {
        en: 'Music is organized sound. The first thing we notice in a musical sound is its **pitch**: how **high** or **low** it is. A bird singing is high; a thunder rumble is low.\n\nListen to both and notice the difference.',
        es: 'La música es sonido organizado. Lo primero que notamos en un sonido musical es su **altura**: qué tan **agudo** (alto) o **grave** (bajo) es. El canto de un pájaro es agudo; un trueno es grave.\n\nEscucha ambos y nota la diferencia.',
      },
      demo: {
        type: 'sounds',
        buttons: [
          { label: { en: 'Low sound', es: 'Sonido grave' }, notes: ['E2', 'G2', 'A2'], instrument: 'role:bass' },
          { label: { en: 'High sound', es: 'Sonido agudo' }, notes: ['E5', 'G5', 'A5'], instrument: 'role:lead' },
        ],
      },
      genre: {
        classical: {
          en: 'An orchestra spreads its instruments from low (double bass, tuba) to high (flute, violin). Composers use that whole range to paint color.',
          es: 'Una orquesta reparte sus instrumentos de grave (contrabajo, tuba) a agudo (flauta, violín). Los compositores usan todo ese registro para pintar colores.',
        },
        pop: {
          en: "In a pop song, the bass and kick drum live down low while the vocal hook sits higher, right where your ear pays the most attention.",
          es: 'En una canción pop, el bajo y el bombo viven en lo grave, mientras que el gancho vocal está más arriba, justo donde tu oído presta más atención.',
        },
        rock: {
          en: 'Rock is built on contrast: a heavy, low riff on bass and guitar, and a screaming high solo on top.',
          es: 'El rock se construye con contraste: un riff pesado y grave en bajo y guitarra, y un solo agudo que grita por encima.',
        },
      },
    },
    {
      title: { en: 'Left is low, right is high', es: 'Izquierda grave, derecha aguda' },
      body: {
        en: 'The piano is the perfect map of pitch. Moving to the **right** the sounds get **higher**; moving to the **left** they get **lower**.\n\nTry it: play a key on the left and then one on the right.',
        es: 'El piano es el mapa perfecto de la altura. Si avanzas hacia la **derecha**, los sonidos son más **agudos**; hacia la **izquierda**, más **graves**.\n\nPruébalo: toca una tecla a la izquierda y luego una a la derecha.',
      },
      demo: { type: 'piano', from: 'C3', to: 'B5' },
    },
    {
      title: { en: 'The black-key pattern', es: 'El patrón de las teclas negras' },
      body: {
        en: 'Look at the black keys: they come in **groups of 2** and **groups of 3**, again and again. This pattern is your compass — it lets you find any note without counting from the start.\n\nThe highlighted keys show one group of 2 and one group of 3.',
        es: 'Observa las teclas negras: aparecen en **grupos de 2** y **grupos de 3**, una y otra vez. Este patrón es tu brújula: te permite encontrar cualquier nota sin contar desde el principio.\n\nLas teclas resaltadas muestran un grupo de 2 y un grupo de 3.',
      },
      demo: { type: 'piano', from: 'C4', to: 'B4', highlight: ['C#4', 'D#4', 'F#4', 'G#4', 'A#4'] },
    },
    {
      title: { en: 'It repeats!', es: '¡Se repite!' },
      body: {
        en: 'A full piano has **88 keys**, but don\'t panic: it is the same group of **12 keys** (7 white + 5 black) repeated over and over, each time higher. Learn one group and you know the whole piano.',
        es: 'Un piano completo tiene **88 teclas**, pero tranquilo: es el mismo grupo de **12 teclas** (7 blancas + 5 negras) repetido una y otra vez, cada vez más agudo. Aprende un grupo y conocerás todo el piano.',
      },
      demo: { type: 'piano', from: 'C3', to: 'B5' },
    },
  ],
  exercises: [
    { type: 'ear-compare', a: 'C3', b: 'C5', ask: 'higher' },
    {
      type: 'choice',
      prompt: { en: 'On the piano, as you move to the right, sounds get…', es: 'En el piano, al moverte hacia la derecha, los sonidos se vuelven…' },
      options: [
        { en: 'Higher', es: 'Más agudos' },
        { en: 'Lower', es: 'Más graves' },
        { en: 'Louder', es: 'Más fuertes' },
      ],
      answer: 0,
      explain: {
        en: 'Right = higher pitch. Loudness (volume) is a different property: it depends on how hard you press.',
        es: 'Derecha = más agudo. El volumen es otra propiedad distinta: depende de la fuerza con que presionas.',
      },
    },
    { type: 'ear-compare', a: 'G4', b: 'D4', ask: 'lower' },
    {
      type: 'choice',
      prompt: { en: 'The black keys are grouped in…', es: 'Las teclas negras se agrupan en…' },
      options: [
        { en: 'Groups of 2 and 3', es: 'Grupos de 2 y de 3' },
        { en: 'Groups of 4', es: 'Grupos de 4' },
        { en: 'There is no pattern', es: 'No hay ningún patrón' },
      ],
      answer: 0,
      demo: { type: 'piano', from: 'C4', to: 'B5' },
    },
    {
      type: 'play-note',
      show: 'custom',
      prompt: { en: 'Tap any black key that belongs to a group of **2**.', es: 'Toca cualquier tecla negra que pertenezca a un grupo de **2**.' },
      target: 'C#4',
      accept: ['C#', 'D#'],
      anyOctave: true,
      range: ['C4', 'B5'],
    },
    {
      type: 'play-note',
      show: 'custom',
      prompt: { en: 'Now tap any black key in a group of **3**.', es: 'Ahora toca cualquier tecla negra de un grupo de **3**.' },
      target: 'F#4',
      accept: ['F#', 'G#', 'A#'],
      anyOctave: true,
      range: ['C4', 'B5'],
    },
    { type: 'ear-compare', a: 'E4', b: 'F4', ask: 'higher' },
    {
      type: 'choice',
      prompt: { en: 'How many different keys are in the group that repeats along the piano?', es: '¿Cuántas teclas distintas hay en el grupo que se repite a lo largo del piano?' },
      options: [
        { en: '12 (7 white + 5 black)', es: '12 (7 blancas + 5 negras)' },
        { en: '88', es: '88' },
        { en: '10 (5 white + 5 black)', es: '10 (5 blancas + 5 negras)' },
      ],
      answer: 0,
    },
    { type: 'ear-compare', a: 'A3', b: 'B3', ask: 'lower' },
    {
      type: 'play-note',
      show: 'custom',
      prompt: { en: 'Tap the **lowest** key on this keyboard.', es: 'Toca la tecla **más grave** de este teclado.' },
      target: 'C4',
      range: ['C4', 'B5'],
      explain: { en: 'The lowest key is always the one furthest to the left.', es: 'La tecla más grave siempre es la que está más a la izquierda.' },
    },
  ],
}

const l2: Lesson = {
  id: 'u1-l2',
  title: { en: 'The names of the notes', es: 'El nombre de las notas' },
  goal: {
    en: 'Learn the 7 note names and find every white key using the black-key pattern.',
    es: 'Aprender los 7 nombres de las notas y encontrar cada tecla blanca con el patrón de las negras.',
  },
  cards: [
    {
      title: { en: 'Only 7 names', es: 'Solo 7 nombres' },
      body: {
        en: 'The white keys use just **7 names** that repeat: {n:C} {n:D} {n:E} {n:F} {n:G} {n:A} {n:B} … and then {n:C} again, one level higher.\n\nThere are two naming systems. English-speaking countries use **letters** (C D E F G A B). Spanish, Italian and French speakers use **solfège** (Do Re Mi Fa Sol La Si). They name the same notes — you can switch in Settings.',
        es: 'Las teclas blancas usan solo **7 nombres** que se repiten: {n:C} {n:D} {n:E} {n:F} {n:G} {n:A} {n:B} … y luego {n:C} otra vez, un nivel más agudo.\n\nExisten dos sistemas de nombres. En países de habla inglesa se usan **letras** (C D E F G A B). En español, italiano y francés se usa el **solfeo** (Do Re Mi Fa Sol La Si). Nombran las mismas notas: puedes cambiarlo en Ajustes.',
      },
      demo: { type: 'piano', from: 'C4', to: 'B4', labels: 'white' },
    },
    {
      title: { en: 'Find {n:C}: left of the two', es: 'Encuentra {n:C}: a la izquierda de las dos' },
      body: {
        en: '{n:C} is your home base. It is always the white key **just to the left of a group of 2 black keys**. Since the pattern repeats, there is a {n:C} in every group.',
        es: '{n:C} es tu punto de partida. Siempre es la tecla blanca **justo a la izquierda de un grupo de 2 teclas negras**. Como el patrón se repite, hay un {n:C} en cada grupo.',
      },
      demo: { type: 'piano', from: 'C3', to: 'B5', highlight: ['C3', 'C4', 'C5'] },
    },
    {
      title: { en: 'Around the group of 2', es: 'Alrededor del grupo de 2' },
      body: {
        en: 'Around the **two** black keys live three notes: {n:C} on the left, {n:D} in the middle (between the two black keys), and {n:E} on the right.',
        es: 'Alrededor de las **dos** teclas negras viven tres notas: {n:C} a la izquierda, {n:D} en medio (entre las dos negras) y {n:E} a la derecha.',
      },
      demo: { type: 'piano', from: 'C4', to: 'B4', highlight: ['C4', 'D4', 'E4'], labels: 'white' },
    },
    {
      title: { en: 'Around the group of 3', es: 'Alrededor del grupo de 3' },
      body: {
        en: 'Around the **three** black keys live four notes: {n:F} on the left, then {n:G}, {n:A}, and {n:B} on the right. Right after {n:B}, the next {n:C} begins.',
        es: 'Alrededor de las **tres** teclas negras viven cuatro notas: {n:F} a la izquierda, luego {n:G}, {n:A} y {n:B} a la derecha. Justo después de {n:B} empieza el siguiente {n:C}.',
      },
      demo: { type: 'piano', from: 'C4', to: 'C5', highlight: ['F4', 'G4', 'A4', 'B4'], labels: 'white' },
      genre: {
        classical: {
          en: 'Many classical pieces begin and end on {n:C} or another "home" note — you will learn why when we study keys.',
          es: 'Muchas piezas clásicas empiezan y terminan en {n:C} u otra nota "hogar"; aprenderás por qué cuando estudiemos las tonalidades.',
        },
        pop: {
          en: 'Countless pop songs are written in {n:C} or {n:G} because they sit comfortably on keyboards and guitars.',
          es: 'Infinidad de canciones pop están en {n:C} o {n:G} porque resultan cómodas en teclado y guitarra.',
        },
        rock: {
          en: 'Rock loves {n:E} and {n:A}: they are the lowest open strings on the guitar, which makes riffs on them sound huge.',
          es: 'El rock ama {n:E} y {n:A}: son las cuerdas al aire más graves de la guitarra, y los riffs sobre ellas suenan enormes.',
        },
      },
    },
  ],
  exercises: [
    { type: 'name-key', note: 'C4', range: ['C4', 'B4'] },
    { type: 'play-note', show: 'name', target: 'C4', anyOctave: true, range: ['C3', 'B4'] },
    {
      type: 'choice',
      prompt: { en: 'Which note comes right after {n:G}?', es: '¿Qué nota viene justo después de {n:G}?' },
      options: [{ en: '{n:A}', es: '{n:A}' }, { en: '{n:F}', es: '{n:F}' }, { en: '{n:B}', es: '{n:B}' }],
      answer: 0,
      explain: {
        en: 'The names follow a cycle: … {n:F} {n:G} {n:A} {n:B} {n:C} …',
        es: 'Los nombres siguen un ciclo: … {n:F} {n:G} {n:A} {n:B} {n:C} …',
      },
    },
    { type: 'name-key', note: 'D4', range: ['C4', 'B4'] },
    { type: 'play-note', show: 'name', target: 'E4', anyOctave: true, range: ['C4', 'B5'] },
    { type: 'name-key', note: 'F4', range: ['C4', 'B4'] },
    { type: 'identify-instrument', instrument: 'auto' },
    { type: 'play-note', show: 'name', target: 'G4', anyOctave: true, range: ['C4', 'B5'] },
    { type: 'name-key', note: 'A4', range: ['C4', 'B4'] },
    {
      type: 'choice',
      prompt: { en: 'Which note is just to the left of a group of **3** black keys?', es: '¿Qué nota está justo a la izquierda de un grupo de **3** teclas negras?' },
      options: [{ en: '{n:F}', es: '{n:F}' }, { en: '{n:C}', es: '{n:C}' }, { en: '{n:B}', es: '{n:B}' }],
      answer: 0,
    },
    { type: 'name-key', note: 'B4', range: ['C4', 'B4'] },
    { type: 'ear-compare', instruments: ['role:bass', 'role:lead'], a: 'D3', b: 'D5', ask: 'lower' },
    { type: 'play-note', show: 'name', target: 'D4', anyOctave: true, range: ['C4', 'B5'] },
    { type: 'play-note', show: 'name', target: 'A4', anyOctave: true, range: ['C4', 'B5'] },
  ],
}

const l3: Lesson = {
  id: 'u1-l3',
  title: { en: 'The staff and treble clef', es: 'El pentagrama y la clave de sol' },
  goal: {
    en: 'Read notes on the lines and spaces of the treble clef.',
    es: 'Leer notas en las líneas y espacios de la clave de sol.',
  },
  cards: [
    {
      title: { en: 'Five lines, four spaces', es: 'Cinco líneas, cuatro espacios' },
      body: {
        en: 'Music is written on the **staff**: 5 horizontal lines with 4 spaces between them. We always count them **from the bottom up**.\n\nNotes sit either **on a line** (the line crosses through the note) or **in a space** (between two lines). The **higher** a note is on the staff, the **higher** it sounds.',
        es: 'La música se escribe en el **pentagrama**: 5 líneas horizontales con 4 espacios entre ellas. Siempre se cuentan **de abajo hacia arriba**.\n\nLas notas se colocan **en una línea** (la línea atraviesa la nota) o **en un espacio** (entre dos líneas). Cuanto **más arriba** está una nota en el pentagrama, **más aguda** suena.',
      },
      demo: { type: 'staff', clef: 'treble', notes: ['E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5'], playable: true },
    },
    {
      title: { en: 'The treble clef (G clef)', es: 'La clave de sol' },
      body: {
        en: 'A staff alone doesn\'t tell us which note is which. The **clef** at the beginning does. The **treble clef** is also called **G clef**: its spiral curls around the **2nd line**, and tells us that line is {n:G} (the {n:G} just above middle {n:C}).\n\nIt\'s used for higher sounds: the right hand on piano, voice, violin, flute, guitar.',
        es: 'Un pentagrama solo no nos dice qué nota es cuál. Eso lo hace la **clave** al principio. La **clave de sol** enrolla su espiral alrededor de la **2.ª línea** y nos dice que esa línea es {n:G} (el {n:G} justo encima del {n:C} central).\n\nSe usa para sonidos agudos: la mano derecha del piano, la voz, el violín, la flauta, la guitarra.',
      },
      demo: { type: 'staff', clef: 'treble', notes: ['G4'], labels: true, playable: true },
    },
    {
      title: { en: 'The notes on the lines', es: 'Las notas de las líneas' },
      body: {
        en: 'From bottom to top, the 5 lines of the treble clef are: {n:E} {n:G} {n:B} {n:D} {n:F}.',
        es: 'De abajo hacia arriba, las 5 líneas de la clave de sol son: {n:E} {n:G} {n:B} {n:D} {n:F}.',
      },
      byNotation: {
        letters: {
          en: 'Memory trick: **E**very **G**ood **B**oy **D**oes **F**ine.',
          es: 'Truco para recordar: **E**very **G**ood **B**oy **D**oes **F**ine ("Todo buen niño se porta bien").',
        },
        solfege: {
          en: 'Memory trick: they skip one note each time — Mi (Fa) Sol (La) Si (Do) Re (Mi) Fa.',
          es: 'Truco: van saltando una nota cada vez: Mi (Fa) Sol (La) Si (Do) Re (Mi) Fa. Dilo en voz alta: "Mi-Sol-Si-Re-Fa".',
        },
      },
      demo: { type: 'staff', clef: 'treble', notes: ['E4', 'G4', 'B4', 'D5', 'F5'], labels: true, playable: true },
    },
    {
      title: { en: 'The notes in the spaces', es: 'Las notas de los espacios' },
      body: {
        en: 'The 4 spaces, from bottom to top, are: {n:F} {n:A} {n:C} {n:E}.\n\nLines and spaces alternate, so walking up the staff line-space-line-space is simply walking up the alphabet: {n:E} {n:F} {n:G} {n:A} {n:B}…',
        es: 'Los 4 espacios, de abajo hacia arriba, son: {n:F} {n:A} {n:C} {n:E}.\n\nLíneas y espacios se alternan, así que subir línea-espacio-línea-espacio es simplemente subir por las notas: {n:E} {n:F} {n:G} {n:A} {n:B}…',
      },
      byNotation: {
        letters: { en: 'Memory trick: the spaces spell **FACE**.', es: 'Truco: los espacios forman la palabra **FACE** ("cara" en inglés).' },
        solfege: { en: 'Memory trick: Fa-La-Do-Mi — again, skipping one note each time.', es: 'Truco: Fa-La-Do-Mi; de nuevo, saltando una nota cada vez.' },
      },
      demo: { type: 'staff', clef: 'treble', notes: ['F4', 'A4', 'C5', 'E5'], labels: true, playable: true },
      genre: {
        classical: {
          en: 'Reading the staff fluently is essential in classical music: everything — from a sonata to a symphony — is written this way.',
          es: 'Leer con fluidez el pentagrama es esencial en la música clásica: todo, desde una sonata hasta una sinfonía, se escribe así.',
        },
        pop: {
          en: 'Most pop melodies for voice fit in the treble clef. Being able to write yours down means you can share it with any musician.',
          es: 'La mayoría de las melodías vocales pop caben en la clave de sol. Saber escribir la tuya te permite compartirla con cualquier músico.',
        },
        rock: {
          en: 'Guitar music is written in treble clef (sounding an octave lower). Many rock players also use tab, but the staff shows rhythm and pitch at a glance.',
          es: 'La música para guitarra se escribe en clave de sol (y suena una octava más grave). Muchos rockeros usan tablatura, pero el pentagrama muestra ritmo y altura de un vistazo.',
        },
      },
    },
  ],
  exercises: [
    {
      type: 'choice',
      prompt: { en: 'How many lines does a staff have?', es: '¿Cuántas líneas tiene un pentagrama?' },
      options: [{ en: '5', es: '5' }, { en: '4', es: '4' }, { en: '7', es: '7' }],
      answer: 0,
      explain: { en: '5 lines and 4 spaces — "penta" means five.', es: '5 líneas y 4 espacios: "penta" significa cinco.' },
    },
    { type: 'name-note', clef: 'treble', note: 'G4' },
    { type: 'name-note', clef: 'treble', note: 'E4' },
    { type: 'name-note', clef: 'treble', note: 'B4' },
    { type: 'name-note', clef: 'treble', note: 'F4' },
    { type: 'name-note', clef: 'treble', note: 'A4' },
    {
      type: 'choice',
      prompt: { en: 'Which of these notes sounds higher?', es: '¿Cuál de estas notas suena más aguda?' },
      demo: { type: 'staff', clef: 'treble', notes: ['D5', 'F4'] },
      options: [{ en: 'The first one', es: 'La primera' }, { en: 'The second one', es: 'La segunda' }],
      answer: 0,
      explain: { en: 'Higher on the staff = higher sound.', es: 'Más arriba en el pentagrama = sonido más agudo.' },
    },
    { type: 'name-note', clef: 'treble', note: 'C5' },
    { type: 'identify-instrument', instrument: 'auto' },
    { type: 'name-note', clef: 'treble', note: 'D5' },
    { type: 'play-note', show: 'staff', clef: 'treble', target: 'G4', range: ['C4', 'B5'] },
    { type: 'name-note', clef: 'treble', note: 'E5' },
    { type: 'play-note', show: 'staff', clef: 'treble', target: 'C5', range: ['C4', 'B5'] },
    { type: 'name-note', clef: 'treble', note: 'F5' },
  ],
}

const l4: Lesson = {
  id: 'u1-l4',
  title: { en: 'Bass clef and middle C', es: 'Clave de fa y el Do central' },
  goal: {
    en: 'Read the bass clef and understand the grand staff used by pianists.',
    es: 'Leer la clave de fa y entender el sistema doble que usan los pianistas.',
  },
  cards: [
    {
      title: { en: 'The bass clef (F clef)', es: 'La clave de fa' },
      body: {
        en: 'Low sounds would need many extra lines in treble clef, so we use the **bass clef**. Its two dots surround the **4th line**, and that line is {n:F} (the {n:F} just below middle {n:C}).\n\nIt\'s used for low sounds: the left hand on piano, bass guitar, cello, tuba.',
        es: 'Los sonidos graves necesitarían muchas líneas extra en clave de sol, por eso usamos la **clave de fa**. Sus dos puntos rodean la **4.ª línea**, y esa línea es {n:F} (el {n:F} justo debajo del {n:C} central).\n\nSe usa para sonidos graves: la mano izquierda del piano, el bajo eléctrico, el chelo, la tuba.',
      },
      demo: { type: 'staff', clef: 'bass', notes: ['F3'], labels: true, playable: true },
    },
    {
      title: { en: 'Lines and spaces in bass clef', es: 'Líneas y espacios en clave de fa' },
      body: {
        en: 'Lines (bottom to top): {n:G} {n:B} {n:D} {n:F} {n:A}.\nSpaces (bottom to top): {n:A} {n:C} {n:E} {n:G}.\n\nCareful! The notes are not in the same places as in treble clef. Always look at the clef before reading.',
        es: 'Líneas (de abajo arriba): {n:G} {n:B} {n:D} {n:F} {n:A}.\nEspacios (de abajo arriba): {n:A} {n:C} {n:E} {n:G}.\n\n¡Ojo! Las notas no están en el mismo lugar que en clave de sol. Mira siempre la clave antes de leer.',
      },
      byNotation: {
        letters: {
          en: 'Memory tricks: lines — **G**ood **B**oys **D**o **F**ine **A**lways; spaces — **A**ll **C**ows **E**at **G**rass.',
          es: 'Trucos: líneas — **G**ood **B**oys **D**o **F**ine **A**lways; espacios — **A**ll **C**ows **E**at **G**rass.',
        },
        solfege: {
          en: 'Memory trick: lines Sol-Si-Re-Fa-La, spaces La-Do-Mi-Sol (always skipping one note).',
          es: 'Truco: líneas Sol-Si-Re-Fa-La, espacios La-Do-Mi-Sol (siempre saltando una nota).',
        },
      },
      demo: { type: 'staff', clef: 'bass', notes: ['G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'A3'], labels: true, playable: true },
    },
    {
      title: { en: 'Middle {n:C} and the grand staff', es: 'El {n:C} central y el gran pentagrama' },
      body: {
        en: 'Piano music uses both clefs at once, joined by a brace: the **grand staff**. Treble on top (usually right hand), bass below (usually left hand).\n\nBetween them sits **middle {n:C}**, the {n:C} closest to the center of the piano. It\'s written on a small extra line called a **ledger line**: just below the treble staff, or just above the bass staff. Same note, same key!',
        es: 'La música de piano usa ambas claves a la vez, unidas por una llave: el **gran pentagrama** (o sistema). Clave de sol arriba (normalmente mano derecha) y clave de fa abajo (normalmente mano izquierda).\n\nEntre ambas está el **{n:C} central**, el {n:C} más cercano al centro del piano. Se escribe en una pequeña línea extra llamada **línea adicional**: justo debajo del pentagrama de sol o justo encima del de fa. ¡Misma nota, misma tecla!',
      },
      demo: { type: 'staff', clef: 'grand', notes: ['C4'], labels: true, playable: true },
      genre: {
        classical: {
          en: 'Nearly all piano repertoire — Bach, Mozart, Chopin — is written on the grand staff.',
          es: 'Casi todo el repertorio de piano (Bach, Mozart, Chopin) está escrito en gran pentagrama.',
        },
        pop: {
          en: 'In pop, the left hand often plays the bass notes of chords (bass clef) while the right hand plays chords or melody (treble clef).',
          es: 'En el pop, la mano izquierda suele tocar las notas graves de los acordes (clave de fa) y la derecha los acordes o la melodía (clave de sol).',
        },
        rock: {
          en: 'Bass guitar parts are written in bass clef. Knowing it lets you write the low end that drives a rock band.',
          es: 'Las partes de bajo eléctrico se escriben en clave de fa. Conocerla te permite escribir la base grave que impulsa a una banda de rock.',
        },
      },
    },
  ],
  exercises: [
    { type: 'name-note', clef: 'bass', note: 'F3' },
    { type: 'name-note', clef: 'bass', note: 'G2' },
    { type: 'name-note', clef: 'bass', note: 'A3' },
    { type: 'name-note', clef: 'bass', note: 'C3' },
    {
      type: 'choice',
      prompt: { en: 'The bass clef tells us that its 4th line is…', es: 'La clave de fa nos indica que su 4.ª línea es…' },
      options: [{ en: '{n:F}', es: '{n:F}' }, { en: '{n:G}', es: '{n:G}' }, { en: '{n:C}', es: '{n:C}' }],
      answer: 0,
    },
    { type: 'name-note', clef: 'bass', note: 'D3' },
    { type: 'ear-compare', instruments: ['role:lead', 'role:bass'], a: 'A4', b: 'A2', ask: 'lower' },
    { type: 'name-note', clef: 'bass', note: 'E3' },
    { type: 'name-note', clef: 'grand', note: 'C4' },
    {
      type: 'play-note',
      show: 'custom',
      prompt: { en: 'Tap **middle {n:C}**.', es: 'Toca el **{n:C} central**.' },
      target: 'C4',
      range: ['C3', 'B4'],
      explain: { en: 'Middle {n:C} is the {n:C} nearest the center of the piano.', es: 'El {n:C} central es el {n:C} más cercano al centro del piano.' },
    },
    {
      type: 'choice',
      prompt: { en: 'On the grand staff, the bass clef is usually played by…', es: 'En el gran pentagrama, la clave de fa la toca normalmente…' },
      options: [{ en: 'The left hand', es: 'La mano izquierda' }, { en: 'The right hand', es: 'La mano derecha' }],
      answer: 0,
    },
    { type: 'play-note', show: 'staff', clef: 'bass', target: 'G3', range: ['C3', 'B4'] },
    { type: 'identify-instrument', instrument: 'role:bass' },
    { type: 'name-note', clef: 'bass', note: 'B2' },
    { type: 'play-note', show: 'staff', clef: 'grand', target: 'E4', range: ['C3', 'B4'] },
  ],
}

const l5: Lesson = {
  id: 'u1-l5',
  title: { en: 'Sharps, flats and steps', es: 'Sostenidos, bemoles y tonos' },
  goal: {
    en: 'Name the black keys and measure distances in half steps and whole steps.',
    es: 'Nombrar las teclas negras y medir distancias en semitonos y tonos.',
  },
  cards: [
    {
      title: { en: 'The half step', es: 'El semitono' },
      body: {
        en: 'The smallest distance on the piano is the **half step** (also called semitone): from one key to the very next key, black or white, with nothing in between.\n\nListen: {n:E}→{n:F} and {n:B}→{n:C} are half steps between two **white** keys — there\'s no black key between them!',
        es: 'La distancia más pequeña en el piano es el **semitono**: de una tecla a la siguiente, negra o blanca, sin nada en medio.\n\nEscucha: {n:E}→{n:F} y {n:B}→{n:C} son semitonos entre dos teclas **blancas**: ¡no hay tecla negra entre ellas!',
      },
      demo: {
        type: 'sounds',
        buttons: [
          { label: { en: '{n:E} → {n:F}', es: '{n:E} → {n:F}' }, notes: ['E4', 'F4'], mode: 'seq' },
          { label: { en: '{n:B} → {n:C}', es: '{n:B} → {n:C}' }, notes: ['B4', 'C5'], mode: 'seq' },
        ],
      },
    },
    {
      title: { en: 'The whole step', es: 'El tono' },
      body: {
        en: 'Two half steps make a **whole step** (whole tone). From {n:C} to {n:D} there is a black key in between, so it\'s a whole step.\n\nCompare how they sound: the whole step feels like a bigger "stride".',
        es: 'Dos semitonos forman un **tono**. De {n:C} a {n:D} hay una tecla negra en medio, así que es un tono.\n\nCompara cómo suenan: el tono se siente como un "paso" más amplio.',
      },
      demo: {
        type: 'sounds',
        buttons: [
          { label: { en: 'Half step', es: 'Semitono' }, notes: ['C4', 'C#4'], mode: 'seq' },
          { label: { en: 'Whole step', es: 'Tono' }, notes: ['C4', 'D4'], mode: 'seq' },
        ],
      },
    },
    {
      title: { en: 'Sharp ♯ and flat ♭', es: 'Sostenido ♯ y bemol ♭' },
      body: {
        en: 'A **sharp (♯)** raises a note by a half step. A **flat (♭)** lowers it by a half step.\n\nSo the black key between {n:C} and {n:D} can be called **{n:C#}** (C raised) or **{n:Db}** (D lowered). Two names, one sound: they are **enharmonic**. Which name we use depends on the musical context — you\'ll see why with scales.',
        es: 'Un **sostenido (♯)** sube una nota un semitono. Un **bemol (♭)** la baja un semitono.\n\nAsí, la tecla negra entre {n:C} y {n:D} puede llamarse **{n:C#}** ({n:C} subido) o **{n:Db}** ({n:D} bajado). Dos nombres, un mismo sonido: son **enarmónicos**. El nombre depende del contexto musical; verás por qué con las escalas.',
      },
      demo: { type: 'piano', from: 'C4', to: 'B4', highlight: ['C#4'], labels: true },
    },
    {
      title: { en: 'Accidentals on the staff', es: 'Alteraciones en el pentagrama' },
      body: {
        en: 'On the staff, the ♯ or ♭ is written **before** the note, on the same line or space. These signs are called **accidentals**.',
        es: 'En el pentagrama, el ♯ o ♭ se escribe **antes** de la nota, en la misma línea o espacio. Estos signos se llaman **alteraciones**.',
      },
      demo: { type: 'staff', clef: 'treble', notes: ['F#4', 'Bb4', 'C#5'], labels: true, playable: true },
      genre: {
        classical: {
          en: 'Classical composers use accidentals to color melodies and to move between keys (modulation) — a key tool you\'ll master later.',
          es: 'Los compositores clásicos usan alteraciones para colorear melodías y moverse entre tonalidades (modulación), una herramienta que dominarás más adelante.',
        },
        pop: {
          en: 'The half step creates tension that wants to resolve — pop melodies often lean on it right before the chorus lands.',
          es: 'El semitono crea una tensión que pide resolverse; las melodías pop suelen apoyarse en él justo antes de que llegue el estribillo.',
        },
        rock: {
          en: 'Half steps sound dark and menacing in a riff: think of the slow, heavy half-step bends and creeping lines of hard rock and metal.',
          es: 'Los semitonos suenan oscuros y amenazantes en un riff: piensa en las líneas pesadas que avanzan "arrastrándose" en el hard rock y el metal.',
        },
      },
    },
  ],
  exercises: [
    {
      type: 'choice',
      prompt: { en: 'A sharp (♯)…', es: 'Un sostenido (♯)…' },
      options: [
        { en: 'Raises a note a half step', es: 'Sube una nota un semitono' },
        { en: 'Lowers a note a half step', es: 'Baja una nota un semitono' },
        { en: 'Raises a note a whole step', es: 'Sube una nota un tono' },
      ],
      answer: 0,
    },
    { type: 'play-note', show: 'name', target: 'C#4', anyOctave: true, range: ['C4', 'B4'], labels: false },
    {
      type: 'choice',
      prompt: { en: 'From {n:E} to {n:F} is a…', es: 'De {n:E} a {n:F} hay un…' },
      demo: { type: 'piano', from: 'C4', to: 'B4', highlight: ['E4', 'F4'] },
      options: [{ en: 'Half step', es: 'Semitono' }, { en: 'Whole step', es: 'Tono' }],
      answer: 0,
      explain: { en: 'No black key between {n:E} and {n:F}: they are neighbors.', es: 'No hay tecla negra entre {n:E} y {n:F}: son vecinas.' },
    },
    { type: 'name-key', note: 'F#4', range: ['C4', 'B4'] },
    {
      type: 'choice',
      prompt: { en: 'From {n:F} to {n:G} is a…', es: 'De {n:F} a {n:G} hay un…' },
      demo: { type: 'piano', from: 'C4', to: 'B4', highlight: ['F4', 'G4'] },
      options: [{ en: 'Half step', es: 'Semitono' }, { en: 'Whole step', es: 'Tono' }],
      answer: 1,
    },
    {
      type: 'choice',
      prompt: { en: 'Listen. Is it a half step or a whole step?', es: 'Escucha. ¿Es un semitono o un tono?' },
      audio: { notes: ['G4', 'A4'], mode: 'seq' },
      options: [{ en: 'Half step', es: 'Semitono' }, { en: 'Whole step', es: 'Tono' }],
      answer: 1,
    },
    { type: 'play-note', show: 'name', target: 'Bb4', anyOctave: true, range: ['C4', 'B4'], labels: false },
    { type: 'name-note', clef: 'treble', note: 'F#4' },
    { type: 'identify-instrument', instrument: 'auto' },
    {
      type: 'choice',
      prompt: { en: 'Which is another name for {n:D#}?', es: '¿Cuál es otro nombre para {n:D#}?' },
      options: [{ en: '{n:Eb}', es: '{n:Eb}' }, { en: '{n:Db}', es: '{n:Db}' }, { en: '{n:E}', es: '{n:E}' }],
      answer: 0,
      explain: {
        en: 'The black key between {n:D} and {n:E} is {n:D} raised or {n:E} lowered.',
        es: 'La tecla negra entre {n:D} y {n:E} es {n:D} subido o {n:E} bajado.',
      },
    },
    {
      type: 'choice',
      prompt: { en: 'Listen. Is it a half step or a whole step?', es: 'Escucha. ¿Es un semitono o un tono?' },
      audio: { notes: ['B3', 'C4'], mode: 'seq' },
      options: [{ en: 'Half step', es: 'Semitono' }, { en: 'Whole step', es: 'Tono' }],
      answer: 0,
    },
    { type: 'name-note', clef: 'treble', note: 'Bb4' },
    {
      type: 'play-note',
      show: 'custom',
      prompt: { en: 'Tap the note a **whole step above** {n:E}.', es: 'Toca la nota que está **un tono por encima** de {n:E}.' },
      target: 'F#4',
      anyOctave: true,
      range: ['C4', 'B4'],
      explain: { en: '{n:E} → {n:F} is a half step, {n:F} → {n:F#} another: {n:F#}.', es: '{n:E} → {n:F} es un semitono, {n:F} → {n:F#} otro: {n:F#}.' },
    },
  ],
}

export const unit1Lessons: Lesson[] = [l1, instrumentsLesson, l2, l3, l4, l5]
