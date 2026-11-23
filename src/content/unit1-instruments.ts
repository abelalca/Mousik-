import type { Exercise, Lesson, TheoryCard } from './types'

/**
 * "The instruments of your genre" — placed right after "High and low sounds" because
 * register (high/low) is the first thing that distinguishes instruments.
 * Each genre gets its own cards and exercises; the instruments then reappear
 * across every later lesson's exercises (spaced exposure).
 */

const mapCard: TheoryCard = {
  title: { en: 'The piano: your map', es: 'El piano: tu mapa' },
  body: {
    en: 'In Mousik, the **piano** is your map: we use it to **see** and **explain** theory, because every note is laid out in order in front of you.\n\nBut in the exercises you will **hear the instruments of your genre**. When you tap a key, it may sound like a cello or a guitar — the note is the same, only the **timbre** (the "color" of the sound) changes.',
    es: 'En Mousik, el **piano** es tu mapa: lo usamos para **ver** y **explicar** la teoría, porque todas las notas están ordenadas frente a ti.\n\nPero en los ejercicios vas a **escuchar los instrumentos de tu género**. Cuando toques una tecla, puede sonar como un chelo o una guitarra: la nota es la misma, solo cambia el **timbre** (el "color" del sonido).',
  },
  demo: {
    type: 'sounds',
    buttons: [
      { label: { en: '{n:A} on piano', es: '{n:A} en piano' }, notes: ['A3'], instrument: 'piano' },
      { label: { en: 'Same {n:A}', es: 'El mismo {n:A}' }, notes: ['A3'], instrument: 'auto' },
      { label: { en: 'Same {n:A} again', es: 'Otra vez {n:A}' }, notes: ['A3'], instrument: 'auto' },
    ],
  },
}

const classical: { cards: TheoryCard[]; exercises: Exercise[] } = {
  cards: [
    {
      title: { en: 'The orchestra: one big family', es: 'La orquesta: una gran familia' },
      body: {
        en: 'An orchestra groups its instruments into **families**, according to **how they produce sound**: strings that are bowed, tubes you blow into (woodwinds and brass), plus instruments like the harp and the piano.\n\nListen to one member of each family.',
        es: 'Una orquesta agrupa sus instrumentos en **familias**, según **cómo producen el sonido**: cuerdas que se frotan con un arco, tubos en los que se sopla (maderas y metales), y otros como el arpa y el piano.\n\nEscucha a un miembro de cada familia.',
      },
      demo: {
        type: 'sounds',
        buttons: [
          { label: { en: 'Strings', es: 'Cuerdas' }, notes: [], mode: 'phrase', instrument: 'violin' },
          { label: { en: 'Woodwinds', es: 'Maderas' }, notes: [], mode: 'phrase', instrument: 'clarinet' },
          { label: { en: 'Brass', es: 'Metales' }, notes: [], mode: 'phrase', instrument: 'trumpet' },
        ],
      },
    },
    {
      title: { en: 'Bowed strings', es: 'Cuerda frotada' },
      body: {
        en: 'A bow rubs the strings and makes them vibrate. The rule of the family: **the bigger the instrument, the lower it sounds**, because its strings are longer.\n\nTap each card to hear it.',
        es: 'Un arco frota las cuerdas y las hace vibrar. La regla de la familia: **cuanto más grande es el instrumento, más grave suena**, porque sus cuerdas son más largas.\n\nToca cada tarjeta para escucharlo.',
      },
      demo: { type: 'instruments', ids: ['violin', 'cello', 'contrabass'] },
    },
    {
      title: { en: 'Woodwinds', es: 'Viento madera' },
      body: {
        en: 'The sound is a column of air vibrating inside a tube. Same rule: **a longer tube sounds lower**. The flute is short and high; the bassoon\'s tube is so long it has to be folded in two!',
        es: 'El sonido es una columna de aire que vibra dentro de un tubo. Misma regla: **un tubo más largo suena más grave**. La flauta es corta y aguda; ¡el tubo del fagot es tan largo que va doblado en dos!',
      },
      demo: { type: 'instruments', ids: ['flute', 'clarinet', 'bassoon'] },
    },
    {
      title: { en: 'Brass, harp and piano', es: 'Metales, arpa y piano' },
      body: {
        en: 'In **brass** instruments the player\'s lips buzz into a metal mouthpiece. The **harp** is plucked with the fingers, and the **piano** — strings struck by hammers — can play all the parts at once.',
        es: 'En los **metales**, los labios del músico vibran en una boquilla de metal. El **arpa** se pulsa con los dedos, y el **piano** (cuerdas golpeadas por martillos) puede tocar todas las partes a la vez.',
      },
      demo: { type: 'instruments', ids: ['trumpet', 'french-horn', 'harp', 'piano'] },
    },
    mapCard,
  ],
  exercises: [
    { type: 'identify-instrument', instrument: 'violin' },
    { type: 'ear-compare', instruments: ['contrabass', 'flute'], a: 'C2', b: 'C6', ask: 'lower' },
    {
      type: 'choice',
      prompt: { en: 'Which family does the cello belong to?', es: '¿A qué familia pertenece el violonchelo?' },
      options: [
        { en: 'Bowed strings', es: 'Cuerda frotada' },
        { en: 'Woodwinds', es: 'Viento madera' },
        { en: 'Brass', es: 'Viento metal' },
      ],
      answer: 0,
    },
    { type: 'identify-instrument', instrument: 'cello' },
    {
      type: 'choice',
      prompt: { en: 'Within the same family, the bigger instrument usually sounds…', es: 'Dentro de una misma familia, el instrumento más grande suele sonar…' },
      options: [
        { en: 'Lower', es: 'Más grave' },
        { en: 'Higher', es: 'Más agudo' },
        { en: 'The same', es: 'Igual' },
      ],
      answer: 0,
      explain: { en: 'Longer strings and tubes vibrate more slowly: lower pitch.', es: 'Las cuerdas y tubos más largos vibran más despacio: sonido más grave.' },
    },
    { type: 'identify-instrument', instrument: 'flute' },
    { type: 'ear-compare', instruments: ['violin', 'cello'], a: 'G5', b: 'G2', ask: 'higher' },
    { type: 'identify-instrument', instrument: 'trumpet' },
    {
      type: 'choice',
      prompt: { en: 'Which instrument is the bass of the woodwinds?', es: '¿Qué instrumento es el bajo de las maderas?' },
      options: [
        { en: 'Bassoon', es: 'Fagot' },
        { en: 'Flute', es: 'Flauta' },
        { en: 'Clarinet', es: 'Clarinete' },
      ],
      answer: 0,
    },
    { type: 'identify-instrument', instrument: 'harp' },
    { type: 'identify-instrument', instrument: 'french-horn' },
  ],
}

const pop: { cards: TheoryCard[]; exercises: Exercise[] } = {
  cards: [
    {
      title: { en: 'The pop band', es: 'La banda pop' },
      body: {
        en: 'A pop song is built in layers, and each instrument has a job:\n**Rhythm** (drums and bass) makes you move, **harmony** (keyboards and guitar) gives the mood, and the **melody** (voice and synth hooks) is what you remember.\n\nListen to one instrument from each layer.',
        es: 'Una canción pop se construye por capas, y cada instrumento tiene un trabajo:\nEl **ritmo** (batería y bajo) te hace moverte, la **armonía** (teclados y guitarra) da el ambiente, y la **melodía** (voz y ganchos de sintetizador) es lo que recuerdas.\n\nEscucha un instrumento de cada capa.',
      },
      demo: {
        type: 'sounds',
        buttons: [
          { label: { en: 'Rhythm', es: 'Ritmo' }, notes: [], mode: 'phrase', instrument: 'drums' },
          { label: { en: 'Harmony', es: 'Armonía' }, notes: [], mode: 'phrase', instrument: 'epiano' },
          { label: { en: 'Melody', es: 'Melodía' }, notes: [], mode: 'phrase', instrument: 'synth-lead' },
        ],
      },
    },
    {
      title: { en: 'The rhythm section', es: 'La base rítmica' },
      body: {
        en: 'The **drums** don\'t play notes: they play rhythm. The **bass** plays low notes and locks in with the kick drum — together they create the **groove**.',
        es: 'La **batería** no toca notas: toca ritmo. El **bajo** toca notas graves y se engancha con el bombo; juntos crean el **groove**.',
      },
      demo: { type: 'instruments', ids: ['drums', 'bass-electric'] },
    },
    {
      title: { en: 'Harmony: keys and guitar', es: 'La armonía: teclados y guitarra' },
      body: {
        en: 'Chords give a song its emotion. In pop they are usually played on **piano**, **electric piano** or **acoustic guitar**, while a **synth pad** fills the background like a soft cloud.',
        es: 'Los acordes dan la emoción a una canción. En el pop suelen tocarse en **piano**, **piano eléctrico** o **guitarra acústica**, mientras un **pad de sintetizador** llena el fondo como una nube suave.',
      },
      demo: { type: 'instruments', ids: ['piano', 'epiano', 'guitar-acoustic', 'synth-pad'] },
    },
    {
      title: { en: 'Melody and hooks', es: 'Melodía y ganchos' },
      body: {
        en: 'The **voice** is the star of pop — you\'ll write melodies for it later in the course. Between sung lines, a **synth lead** often plays an instrumental **hook**: a short, catchy idea that sticks in your head.',
        es: 'La **voz** es la protagonista del pop; más adelante escribirás melodías para ella. Entre las frases cantadas, un **sintetizador solista** suele tocar un **gancho** instrumental: una idea corta y pegadiza que se queda en la cabeza.',
      },
      demo: { type: 'instruments', ids: ['synth-lead'] },
    },
    mapCard,
  ],
  exercises: [
    { type: 'identify-instrument', instrument: 'drums' },
    {
      type: 'choice',
      prompt: { en: 'Which two instruments form the rhythm section?', es: '¿Qué dos instrumentos forman la base rítmica?' },
      options: [
        { en: 'Drums and bass', es: 'Batería y bajo' },
        { en: 'Piano and synth pad', es: 'Piano y pad' },
        { en: 'Guitar and synth lead', es: 'Guitarra y sintetizador solista' },
      ],
      answer: 0,
    },
    { type: 'identify-instrument', instrument: 'bass-electric' },
    { type: 'ear-compare', instruments: ['bass-electric', 'synth-lead'], a: 'C2', b: 'C5', ask: 'lower' },
    { type: 'identify-instrument', instrument: 'epiano' },
    {
      type: 'choice',
      prompt: { en: 'Which of these instruments does **not** play defined pitches (notes)?', es: '¿Cuál de estos instrumentos **no** toca alturas definidas (notas)?' },
      options: [
        { en: 'Drums', es: 'Batería' },
        { en: 'Bass', es: 'Bajo' },
        { en: 'Electric piano', es: 'Piano eléctrico' },
      ],
      answer: 0,
    },
    { type: 'identify-instrument', instrument: 'synth-pad' },
    { type: 'identify-instrument', instrument: 'guitar-acoustic' },
    {
      type: 'choice',
      prompt: { en: 'A synth pad is mainly used to…', es: 'Un pad de sintetizador sirve sobre todo para…' },
      options: [
        { en: 'Fill the background with harmony', es: 'Rellenar el fondo con armonía' },
        { en: 'Keep the beat', es: 'Marcar el pulso' },
        { en: 'Play the bass line', es: 'Tocar la línea de bajo' },
      ],
      answer: 0,
    },
    { type: 'identify-instrument', instrument: 'synth-lead' },
    { type: 'ear-compare', instruments: ['guitar-acoustic', 'bass-electric'], a: 'E4', b: 'E2', ask: 'higher' },
  ],
}

const rock: { cards: TheoryCard[]; exercises: Exercise[] } = {
  cards: [
    {
      title: { en: 'The power trio', es: 'El power trío' },
      body: {
        en: 'The heart of a rock band fits on a small stage: **electric guitar**, **bass** and **drums**. This lineup is called a **power trio** — three instruments, a huge sound.\n\nListen to each one.',
        es: 'El corazón de una banda de rock cabe en un escenario pequeño: **guitarra eléctrica**, **bajo** y **batería**. Esta formación se llama **power trío**: tres instrumentos, un sonido enorme.\n\nEscucha a cada uno.',
      },
      demo: {
        type: 'sounds',
        buttons: [
          { label: { en: 'Guitar', es: 'Guitarra' }, notes: [], mode: 'phrase', instrument: 'guitar-distortion' },
          { label: { en: 'Bass', es: 'Bajo' }, notes: [], mode: 'phrase', instrument: 'bass-electric' },
          { label: { en: 'Drums', es: 'Batería' }, notes: [], mode: 'phrase', instrument: 'drums' },
        ],
      },
    },
    {
      title: { en: 'Clean vs distorted', es: 'Limpia o distorsionada' },
      body: {
        en: 'It\'s the **same guitar**. The difference is the amplifier: pushed hard, it **distorts** the sound and makes it gritty, thick and powerful — the signature sound of rock. Without distortion, the guitar sounds **clean**: clear and bright.',
        es: 'Es la **misma guitarra**. La diferencia está en el amplificador: si se fuerza, **distorsiona** el sonido y lo vuelve áspero, grueso y poderoso, el sello del rock. Sin distorsión, la guitarra suena **limpia**: clara y brillante.',
      },
      demo: { type: 'instruments', ids: ['guitar-electric', 'guitar-distortion'] },
    },
    {
      title: { en: 'The engine room', es: 'La sala de máquinas' },
      body: {
        en: 'The **bass** plays an octave below the guitar and usually follows the riff, giving it weight. The **drums** don\'t play notes: they provide the power and the beat.',
        es: 'El **bajo** suena una octava por debajo de la guitarra y suele seguir el riff, dándole peso. La **batería** no toca notas: aporta la potencia y el pulso.',
      },
      demo: { type: 'instruments', ids: ['bass-electric', 'drums'] },
    },
    {
      title: { en: 'Keyboards in rock', es: 'Teclados en el rock' },
      body: {
        en: 'Classic rock often adds a growling **organ** or a pounding **piano** to thicken the chords.',
        es: 'El rock clásico suele añadir un **órgano** rugiente o un **piano** martilleado para engrosar los acordes.',
      },
      demo: { type: 'instruments', ids: ['organ', 'piano'] },
    },
    mapCard,
  ],
  exercises: [
    { type: 'identify-instrument', instrument: 'guitar-distortion' },
    {
      type: 'choice',
      prompt: { en: 'What makes the guitar sound gritty and powerful?', es: '¿Qué hace que la guitarra suene áspera y poderosa?' },
      options: [
        { en: 'Amplifier distortion', es: 'La distorsión del amplificador' },
        { en: 'Playing higher notes', es: 'Tocar notas más agudas' },
        { en: 'Nylon strings', es: 'Usar cuerdas de nailon' },
      ],
      answer: 0,
    },
    { type: 'identify-instrument', instrument: 'drums' },
    { type: 'ear-compare', instruments: ['bass-electric', 'guitar-distortion'], a: 'E2', b: 'E4', ask: 'lower' },
    { type: 'identify-instrument', instrument: 'guitar-electric' },
    {
      type: 'choice',
      prompt: { en: 'Which three instruments make a power trio?', es: '¿Qué tres instrumentos forman un power trío?' },
      options: [
        { en: 'Guitar, bass and drums', es: 'Guitarra, bajo y batería' },
        { en: 'Guitar, organ and piano', es: 'Guitarra, órgano y piano' },
        { en: 'Bass, piano and drums', es: 'Bajo, piano y batería' },
      ],
      answer: 0,
    },
    { type: 'identify-instrument', instrument: 'organ' },
    { type: 'identify-instrument', instrument: 'bass-electric' },
    {
      type: 'choice',
      prompt: { en: 'Which instrument sounds an octave below the guitar?', es: '¿Qué instrumento suena una octava por debajo de la guitarra?' },
      options: [
        { en: 'Electric bass', es: 'Bajo eléctrico' },
        { en: 'Organ', es: 'Órgano' },
        { en: 'Drums', es: 'Batería' },
      ],
      answer: 0,
    },
    { type: 'identify-instrument', instrument: 'piano' },
    { type: 'ear-compare', instruments: ['organ', 'bass-electric'], a: 'C5', b: 'C2', ask: 'higher' },
  ],
}

export const instrumentsLesson: Lesson = {
  id: 'u1-inst',
  title: { en: 'The instruments of your genre', es: 'Los instrumentos de tu género' },
  goal: {
    en: 'Meet the instruments of your style and learn to recognize them by ear.',
    es: 'Conocer los instrumentos de tu estilo y aprender a reconocerlos de oído.',
  },
  cards: classical.cards,
  exercises: classical.exercises,
  variants: { classical, pop, rock },
}
