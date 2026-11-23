# Mousik Curriculum

The source document for all Mousik lesson content. It defines how the app teaches music theory and composition, from absolute zero to composing a complete short piece on the piano, in three genre tracks: classical, pop and rock.

- **Audience:** complete beginners (no notation, no instrument) through to learners who can write, harmonize and arrange a multi-section piece.
- **Reference instrument:** piano (on-screen keyboard, sampled piano audio; optional MIDI keyboard input).
- **Genre model:** one shared theory core, with genre-specific examples, exercises, tips and capstone. The learner picks a genre at onboarding and can switch later; progress in the shared core is kept.
- **Languages:** English and Spanish. Note names switch between letter names (C D E F G A B) and fixed-do names (Do Re Mi Fa Sol La Si). See [Naming conventions](#03-naming-conventions).

---

## Contents

0. [Overview and design decisions](#0-overview-and-design-decisions)
1. [Pedagogical principles](#1-pedagogical-principles)
2. [Lesson anatomy and exercise types](#2-lesson-anatomy-and-exercise-types)
3. [The learning path (Units 1–8)](#3-the-learning-path)
4. [Capstone project specifications](#4-capstone-project-specifications)
5. [Spaced review and mastery rules](#5-spaced-review-and-mastery-rules)
6. [References](#6-references)

---

## 0. Overview and design decisions

### 0.1 Path at a glance

| Unit | Title | Stage | Lessons | Rough equivalent* |
|---|---|---|---|---|
| 1 | Pitch, the Keyboard and the Staff | Fundamentals | 5 | ABRSM/Trinity Gr. 1 (pitch) |
| 2 | Rhythm and Meter | Fundamentals | 6 | Gr. 1–3 (rhythm), Gr. 5 (compound and irregular, partial) |
| 3 | Intervals | Elementary | 5 | Gr. 2–5 (intervals) |
| 4 | Scales and Keys | Elementary | 6 | Gr. 1–5 (keys), plus pentatonic, blues and modes |
| 5 | Chords | Intermediate | 6 | Gr. 3–5 (triads, chords), plus popular chord types |
| 6 | Harmony and Progressions | Intermediate–Advanced | 6 | Gr. 5–6 (cadences, harmonization), plus pop and rock schemas |
| 7 | Melody and Phrase Writing | Advanced | 5 | Trinity melody writing; ABRSM Gr. 6–7 melody composition (simplified) |
| 8 | Form and Composition (Capstone) | Expert | 6 | Song forms and small classical forms; original piece |

*These comparisons are approximate and show coverage only. Mousik is not exam preparation. It covers the core of graded rudiments (about Grade 1–5) and the composition parts of the higher grades. It leaves out formal SATB part-writing exams, figured-bass realization and counterpoint, and adds popular-music harmony and form, which the graded syllabi do not teach.

Total: **45 lessons**, plus 8 unit checkpoints. Each lesson takes about 5–8 minutes.

### 0.2 Notable design decisions

1. **Unit order (intervals before scales) is kept, with a specific teaching method.** musictheory.net and ABRSM teach major scales and keys before naming interval quality, because the usual method compares an interval to the major scale of its lower note. Mousik keeps intervals in Unit 3 and teaches them in a way that needs no scale knowledge: **letter distance** gives the number (3rd, 5th, ...) and **half-step count** on the keyboard gives the quality. This builds on u1-l5, gets interval ear training going early (Kodály starts with small intervals such as sol–mi), and gives Unit 4 the tools to build any scale from intervals. Unit 4 then adds the major-scale method as a second check for interval quality.
2. **Sound before symbol in every lesson.** Every new concept is first heard and played on the piano, then named, then notated (Kodály: prepare, present, practice; Gordon: aural/oral before symbolic association).
3. **Creation from Unit 2.** Gordon's inference stage (creativity and improvisation) and Trinity's practice of rhythmic composition at Grade 1 both support starting composition early. A constrained `compose` exercise appears in Unit 2 (rhythm), Unit 4 (pentatonic improvisation), Unit 7 (phrases) and Unit 8 (the full piece).
4. **Genre shapes emphasis, not the core.** All learners learn the same concepts (period, cadence, power chord, 12-bar blues). Genre changes the examples, which items appear most often, the tips, and the capstone. Rock learners still learn cadences; classical learners still meet the pentatonic scale.
5. **Original audio examples.** Practice audio uses public-domain repertoire (classical) or original phrases written in the style of the genre (pop, rock). Copyrighted songs are named only as optional "listen to" references, which the content team must license-check and localize per language.
6. **Scale degrees use numbers, not movable-do.** Spanish note names are fixed-do (Do = C always), so movable-do syllables would conflict with the note-name selector. Scale degrees are written as numbers with a caret (1̂ 2̂ 3̂ …, spoken "degree 1"), and chords as Roman numerals.
7. **Piano-first realization of popular idioms.** Power chords, riffs, bends (approximated by grace notes) and comping are all taught as piano voicings, so the learner can play every example they study.

### 0.3 Naming conventions

| Concept | EN display | ES display | Notes |
|---|---|---|---|
| Note names (selector) | C D E F G A B | Do Re Mi Fa Sol La Si | Fixed mapping. Applies to cards, buttons, feedback and chord symbols. |
| Accidentals | C♯, D♭ | Do♯, Re♭ (spoken "Do sostenido", "Re bemol") | |
| Octave numbers | Scientific: C4 = middle C | Shown as Do4 = middle C | Spanish pedagogy often calls middle C "Do3". The app uses one convention in both languages (C4/Do4) and explains this once in u1-l4. Octave numbers appear only where needed. |
| Chord symbols | C, Cm, C7, Cmaj7, Cdim, C5, Csus4 | Do, Dom, Do7, Domaj7, Dodim, Do5, Dosus4 | Quality suffixes are the same in both languages. |
| Roman numerals | I ii iii IV V vi vii° | Same | Upper case = major, lower case = minor, ° = diminished, + = augmented. |
| Scale degrees | 1̂ … 7̂, with ♭3̂ etc. | Same | Degree names (tonic, dominant…) are localized (tónica, dominante…). |
| Durations | US names (quarter note) with UK names (crotchet) in a tooltip | negra, blanca, redonda, corchea, semicorchea | |

---

## 1. Pedagogical principles

Each principle is stated with how it shows up in the app.

| # | Principle | Source | How it shows up in lessons and exercises |
|---|---|---|---|
| P1 | **Sound before symbol.** Experience a sound by ear and by playing it, then name it, then read and write it. | Kodály prepare, present, practice; Gordon MLT | Card 1 of every lesson is an audio or play-along "hook" with no terms. Exercises within a lesson go from ear and keyboard (`pitch-compare`, `interval-ear`, `melody-echo`) to labeling (`interval-name`) to notation (`note-place`, `rhythm-dictation`). A symbol is never shown before its sound has been heard. |
| P2 | **Prepare, present, practice across lessons.** Introduce one new element at a time, while still practicing the previous one and quietly preparing the next. | Kodály sequencing | Each lesson has one main new concept. About 20–30% of each lesson's exercises are review items from earlier lessons (practice). One or two "preview" items let the learner hear the next lesson's concept without naming it (prepare). |
| P3 | **Skill learning sequence (discrimination, then inference).** | Gordon MLT: aural/oral, verbal association, partial synthesis, symbolic association, composite synthesis, then generalization, creativity/improvisation, theoretical understanding | Within each unit, exercises go in this order: recognize, label, read and write, combine, transfer to new material, create. Each lesson's exercise list is ordered the same way, and each unit ends with a creative task. |
| P4 | **Scaffold, then fade.** | Scaffolding (Wood, Bruner, Ross); worked-example effect | Early items show hints: highlighted keys, colored staff lines, a visible counting grid, interval reference-song cues. Within a lesson, and later in spaced review, the hints are taken away. The mastery level of an item records whether it was answered without hints. |
| P5 | **Spaced repetition.** Review is timed to the predicted point of forgetting. | Ebbinghaus; Settles & Meeder 2016 (half-life regression) | Every exercise item has a memory half-life. Practice sessions pull the items with the lowest recall probability. See Section 5. |
| P6 | **Interleave confusable categories.** | Wong, Chen & Lim 2021; Pavlik et al. 2013; Carter & Grahn 2016 | Ear-training and naming items are mixed in practice, not blocked (m3 vs M3, P4 vs P5, major vs minor chord, HC vs PAC). New categories start blocked inside the lesson (introduce A, then B), then mix. Reference-song scaffolds are faded out because interleaving helps most when such aids are absent. |
| P7 | **Retrieval over re-reading.** | Testing effect | Cards are short (no more than about 60 words plus media). Learning happens in exercises. Every card is followed within one or two items by an exercise that tests it. |
| P8 | **Immediate, specific feedback.** | Formative assessment | Wrong answers play both the learner's answer and the correct one, with a one-line explanation ("You played E–G: 3 half steps = minor 3rd. A major 3rd is 4."). Missed items are asked again at the end of the lesson. |
| P9 | **Learn concepts in real musical contexts and genres.** | Situated learning; motivation research; OMT's pop-music chapters | Examples, backing tracks and capstones use the learner's genre. Concepts are always shown inside a short musical excerpt, never only as isolated theory. |
| P10 | **Creativity under constraints.** | Gordon (inference: creativity); Trinity (composition from Grade 1) | `compose` tasks always have clear constraints (number of bars, notes allowed, must end on 1̂) and automatic checks, plus a free-play playback, so there is something to do without a blank-page problem. |
| P11 | **Small steps, short sessions, daily habit.** | Microlearning; Duolingo model | Lessons take 5–8 minutes. There is a daily goal and a streak. A practice session is a 3-minute review set. |
| P12 | **Mastery before moving on (soft gating).** | Mastery learning (Bloom) | A unit checkpoint (score of 80% or more) unlocks the next unit. Learners can "test out" of a unit. Lessons inside a unit unlock one after another. |

---

## 2. Lesson anatomy and exercise types

### 2.1 Lesson anatomy

Each lesson has **2–4 theory cards** followed by **8–12 exercises**.

```
[Card 1: Hook — sound/play first, no terminology]  (P1)
[Card 2: Name it — term + symbol + one-line rule]
[Card 3: (optional) How it works / rule of thumb / genre example]
[Card 4: (optional) Genre tip — "In pop..." / "In rock..." / "In classical..."]
[Exercises 1–3: recognition (ear/keyboard), heavy hints]
[Exercises 4–7: labeling & reading/writing, hints fading]
[Exercises 8–10: combination/transfer + 2–3 interleaved review items]
[Exercise 11–12 (optional): mini-create or "challenge" item, no hints]
[Re-queue of missed items until each answered correctly once]
[Summary card: what you learned + "listen for it" suggestion in your genre]
```

Rules for content authors:

- **One new concept per lesson.** If a lesson needs two, the second must be a direct application of the first, as in u5-l2.
- **Cards** are no more than about 60 words each, have at least one interactive media element (playable audio, keyboard or staff), and contain no unexplained term.
- **Exercise mix per lesson:** about 70% new concept, about 30% review (interleaved), at most 1–2 preview items.
- **Genre-specific content.** Each lesson has a shared core and a `genre` block (`classical | pop | rock`). The genre block replaces the examples, the tip card, the backing tracks and the challenge item. Core items are tagged `core`; genre items are tagged by genre.
- **Pass criterion.** A lesson is complete when every item has been answered correctly at least once. First-try accuracy sets the lesson's initial strength (Section 5).
- **Audio.** Every example is playable at normal speed and at 70% speed. Ear items can be replayed up to 3 times; replays reduce the mastery credit slightly.

### 2.2 Exercise types

`Unit` is where each type is first introduced. Later units reuse it with harder parameters. `Modes` are the parameter variants.

| ID | Name | What the learner does | Input | Modes / parameters | Intro |
|---|---|---|---|---|---|
| `concept-check` | Concept check | Answer a multiple-choice or true/false question about a card | Tap | text / image / audio options | u1-l1 |
| `pitch-compare` | Higher or lower? | Hear two notes (or two short patterns) and choose higher, lower or same | Tap | interval size shrinks from octave to half step | u1-l1 |
| `key-find` | Find the key | Tap a described key on the keyboard ("the white key left of the 2 black keys") | Keyboard | by description / by name / by staff note | u1-l1 |
| `play-on-piano` | Play it | Play a named note, a short sequence or a chord on the keyboard | Keyboard (on-screen or MIDI) | single note / sequence / chord / timed | u1-l2 |
| `note-read` | Read the note | See a note on the staff and choose or type its name | Tap | clef: treble / bass / grand; ledger lines; accidentals | u1-l3 |
| `note-place` | Write the note | Place a named note on the staff | Staff editor | same as `note-read` | u1-l3 |
| `staff-to-key` | Staff to keyboard | See a note on the staff and play it at the right octave | Keyboard | single / sequence | u1-l3 |
| `step-identify` | Half or whole step? | Identify H or W (or neither) on keyboard, staff or by ear | Tap | visual / aural | u1-l5 |
| `enharmonic-match` | Same key, two names | Match enharmonic spellings (C♯ = D♭) | Tap / drag | | u1-l5 |
| `rhythm-tap` | Echo the rhythm | Hear a rhythm and tap it back | Tap pad (latency-calibrated) | with metronome / without; 1–4 bars | u2-l1 |
| `rhythm-read` | Read and tap | Tap a notated rhythm in time | Tap pad | count-in; swing; tolerance in ms | u2-l1 |
| `meter-identify` | Find the meter | Hear an excerpt (or see one) and choose the meter (2, 3, 4, 6/8…) | Tap | aural / visual | u2-l2 |
| `bar-complete` | Fill the bar | Drag note and rest values to complete measures | Drag | | u2-l2 |
| `rhythm-dictation` | Rhythm dictation | Hear a rhythm and build it from note-value tiles | Drag | 1–4 bars | u2-l3 |
| `compose` | Compose | Create music in the editor under constraints, with automatic checks and playback | Editor (piano roll and staff) | `rhythm` (u2) · `improvise` over a backing (u4) · `motif` (u7) · `phrase` (u7) · `section` / `piece` (u8) | u2-l4 |
| `interval-name` | Name the interval | Name an interval shown on the staff or keyboard (number, then quality) | Tap | number only (u3-l1) / full quality (u3-l2+) | u3-l1 |
| `interval-ear` | Hear the interval | Identify an interval by ear | Tap | melodic up / down / harmonic; with or without reference-song cue | u3-l1 |
| `interval-build` | Build the interval | Play or write the note at a given interval above or below | Keyboard / staff | | u3-l2 |
| `melody-echo` | Play it back | Hear a short melody (3–8 notes) and play it back on the keyboard | Keyboard | starting note given / not given | u3-l1 |
| `scale-build` | Build the scale | Play or write a scale from a given tonic | Keyboard / staff | major / minor forms / pentatonic / blues / modes | u4-l1 |
| `key-signature` | Key signatures | Name the key from its signature, or write the signature for a key | Tap / staff | major / minor; circle-of-fifths wheel | u4-l2 |
| `scale-identify` | Which scale? | Hear or see a scale or excerpt and name its type | Tap | | u4-l3 |
| `melody-dictation` | Melody dictation | Hear a melody and notate it (pitch, then rhythm) | Staff / piano-roll editor | pentatonic, 3–5 notes (u4) up to 2–4 bars diatonic (u7) | u4-l4 |
| `scale-degree-ear` | Which degree? | After a key is established (cadence or loop), name the degree of a target note | Tap | degrees 1, 3, 5, then all 7, then chromatic | u4-l6 |
| `transpose` | Transpose | Play or write a given melody or progression in another key | Keyboard / staff | | u4-l6 |
| `chord-build` | Build the chord | Play or write a chord from a symbol or Roman numeral | Keyboard / staff | triad / 7th / inversion / power / sus | u5-l1 |
| `chord-name` | Name the chord | Name a chord shown on the staff or keyboard (symbol, Roman numeral, inversion) | Tap | | u5-l1 |
| `chord-ear` | Hear the chord | Identify chord quality (or inversion) by ear | Tap | maj / min → +dim / aug → 7ths → power / sus | u5-l1 |
| `roman-numeral` | Analyze in key | Label chords in a key with Roman numerals | Tap / type | | u5-l2 |
| `error-spot` | Spot the mistake | Find the wrong note, chord, voice-leading error or rhythm in an excerpt | Tap on score | | u5-l4 |
| `progression-complete` | Complete the progression | Choose or play the missing chord(s) in a progression | Tap / keyboard | by function / by genre schema | u6-l1 |
| `cadence-ear` | Hear the cadence | Identify a cadence type by ear | Tap | PAC / IAC / HC / plagal / deceptive / ♭VII–I | u6-l2 |
| `analysis` | Analyze the excerpt | Label cadences, chords, phrases or sections on a short score | Tap on score | | u6-l2 |
| `voice-lead` | Connect the chords | Move each voice to the next chord with the smoothest motion | Keyboard / staff | 3-voice (right hand) + bass | u6-l3 |
| `progression-ear` | Hear the progression | Identify a 3–4 chord progression or bass line by ear | Tap | genre schemas | u6-l4 |
| `harmonize` | Harmonize | Choose chords for a given melody (one per bar or half bar) | Tap / drag | | u6-l6 |
| `form-identify` | Map the form | Listen and label sections (A/B, verse/chorus, 12-bar choruses) on a timeline | Drag labels | | u8-l1 |

**Automatic checks in `compose`.** These are rule-based checks shown as a checklist. They give feedback without judging taste. Examples: fits the bar count; every bar is full; ends on 1̂ / tonic chord; uses the motif at least twice; strong-beat notes are chord tones (at least 70%); range within an octave and a 6th; a cadence at the end of each phrase; at most one note out of the scale (unless allowed). Checks that are not met are shown as suggestions, never as failures, except for the rules that define the task (bar count, ending note).

---

## 3. The learning path

Format for each lesson:

- **Objectives** — what the learner can do afterward (observable).
- **Key concepts** — the terms and rules the cards introduce.
- **Exercises** — exercise types used, in order.
- **Genre adaptation** — how examples, tips and emphasis differ for classical (C), pop (P) and rock (R).

Each unit ends with a **checkpoint** (`uN-check`): 15–20 mixed items drawn from the whole unit (no new content), passed at 80% or more. It unlocks the next unit and can be used to test out.

---

### Unit 1 — Pitch, the Keyboard and the Staff

**Goal:** find, name, read and write any note (including sharps and flats) on the keyboard and on the grand staff, and recognize half and whole steps.
**Genre adaptation level:** light. The content is fully shared; only the hook audio and listening tips change.

#### u1-l1 · High and low sounds and the piano keyboard
- **Objectives:** tell which of two sounds is higher; know that the keyboard goes from low (left) to high (right); find groups of 2 and 3 black keys anywhere on the keyboard.
- **Key concepts:** pitch (high/low); keyboard layout; white keys; black keys in groups of 2 and 3; repeating pattern (octave idea, not yet named formally).
- **Exercises:** `pitch-compare` (wide intervals, narrowing), `key-find` (left/right, highest/lowest), `key-find` (groups of 2 and 3 black keys), `concept-check`.
- **Genre adaptation:** C: hook is a low cello-like line answered by a high flute-like line on piano (Saint-Saëns style). P: hook contrasts a low bass synth and a high vocal-style line. R: hook contrasts a low riff and a high lead line. All genres: "Listen for: which instrument plays highest in your next song?"

#### u1-l2 · Note names and finding C
- **Objectives:** name the white keys using the selected naming system (C–B or Do–Si); find every C (Do) as the white key just left of the group of 2 black keys; know that names repeat every 7 white keys.
- **Key concepts:** musical alphabet A–G / Do–Si; C as anchor; octave (same name, higher or lower); F as the anchor left of the 3-black-key group.
- **Exercises:** `key-find` (all Cs), `play-on-piano` (named white keys), `concept-check` (what comes after G / Sol?), `pitch-compare` (same note at different octaves), `key-find` (F, then any white key).
- **Genre adaptation:** C: "Middle-ish C is where many classical pieces begin." Example: C–D–E–F–G five-finger melody. P: many pop songs fit on a few white keys; the hook shows a 3-note chorus melody. R: the hook shows a riff on E and G and introduces "E is the home note of many rock riffs" (because of guitar tuning).

#### u1-l3 · The staff and the treble clef
- **Objectives:** read and write notes on the treble staff (lines E G B D F, spaces F A C E); connect each staff position to a key on the keyboard (from C4 to G5); understand that higher on the staff means higher pitch.
- **Key concepts:** staff (5 lines, 4 spaces); treble (G) clef curling around the G line; line notes and space notes; step (line to next space) vs skip (line to next line); ledger line for middle C (preview).
- **Exercises:** `concept-check`, `note-read` (lines, then spaces, then mixed), `note-place`, `staff-to-key`, `pitch-compare` (visual: which note is higher on the staff?).
- **Genre adaptation:** C: piano right-hand melodies and violin and flute parts are written in treble clef. P: vocal melodies and lead sheets are written in treble clef. R: guitar music is written in treble clef (sounding an octave lower). Tip: "lead melodies live here". Mnemonics are localized (EN "Every Good Boy Does Fine"; ES spells out Mi–Sol–Si–Re–Fa, since the English acrostic does not work in Spanish).

#### u1-l4 · Bass clef, the grand staff and middle C
- **Objectives:** read and write notes in bass clef (lines G B D F A, spaces A C E G); read the grand staff; locate middle C (C4) on both staves and on the keyboard; understand the octave numbers used in the app.
- **Key concepts:** bass (F) clef with dots around the F line; grand staff (treble + bass, joined by a brace); middle C on a ledger line between the staves; left hand plays low and right hand plays high; scientific octave numbers (C4) with a note on the Spanish convention.
- **Exercises:** `note-read` (bass), `note-place` (bass), `note-read` (grand staff, including ledger lines around C4), `staff-to-key` (both hands), `concept-check` (which clef suits a bass line?).
- **Genre adaptation:** C: left-hand accompaniment of a minuet in bass clef. P: the bass line of a pop loop in bass clef. R: a bass-guitar root-note line in bass clef doubled by the piano's left hand.

#### u1-l5 · Sharps, flats, half steps and whole steps
- **Objectives:** name black keys as sharps or flats; identify half steps (H) and whole steps (W) on the keyboard, on the staff and by ear; know the natural half steps E–F and B–C; recognize enharmonic equivalents.
- **Key concepts:** sharp ♯ (one half step up), flat ♭ (one half step down), natural ♮; accidentals last until the end of the bar; half step = adjacent keys; whole step = two half steps; E♯ = F and C♭ = B; enharmonic.
- **Exercises:** `key-find` (C♯, B♭…), `enharmonic-match`, `step-identify` (keyboard), `step-identify` (staff), `step-identify` (by ear: half step vs whole step), `note-read` (with accidentals).
- **Genre adaptation:** C: chromatic neighbor notes in a short Classical-style phrase. P: the half step as "tension" (a half-step slide into the hook note). R: the half-step "chug" riff (E–F) used in heavy rock; the blues slide from ♭3 to 3 (preview of the blue note).

**u1-check:** note reading on the grand staff, keyboard finding, accidentals, H/W by sight and by ear.

---

### Unit 2 — Rhythm and Meter

**Goal:** feel the beat, read and tap rhythms down to sixteenth notes, understand simple and compound meters including swing, and compose a short rhythm.
**Note:** notes in rhythm exercises use one pitch (or a drum sound) so that rhythm is learned without pitch-reading load.

#### u2-l1 · Pulse, tempo and the basic note values
- **Objectives:** tap steadily with a pulse; read and tap whole, half and quarter notes and their rests; relate tempo to BPM.
- **Key concepts:** beat/pulse; tempo (BPM); whole (4 beats), half (2), quarter (1); rests of the same values; note anatomy (head, stem).
- **Exercises:** `rhythm-tap` (pulse only), `concept-check`, `rhythm-read` (quarters/halves/wholes), `rhythm-tap` (echo), `rhythm-read` (with rests).
- **Genre adaptation:** C: Italian tempo terms (Largo, Andante, Allegro) mapped to BPM ranges. P: ballad about 70 BPM vs dance-pop about 120–128 BPM; four-on-the-floor kick. R: the rock drum beat (kick on 1 and 3, snare on 2 and 4); tapping with a drum loop.

#### u2-l2 · Meter, bars and time signatures
- **Objectives:** group beats into bars; read 2/4, 3/4 and 4/4; feel strong and weak beats; identify meter by ear; recognize a pickup (anacrusis).
- **Key concepts:** bar/measure; bar line; double bar; time signature (top = beats per bar, bottom = beat unit); downbeat; strong and weak beats; pickup.
- **Exercises:** `meter-identify` (aural: 3 vs 4), `concept-check`, `bar-complete`, `rhythm-read` (3/4), `meter-identify` (visual).
- **Genre adaptation:** C: minuet and waltz (3/4) vs march (2/4). P: 4/4 dominates; backbeat accents on 2 and 4 (clap track). R: 4/4 with a heavy snare backbeat; occasional 3/4 rock ballad as a contrast item.

#### u2-l3 · Eighth notes and counting "1 & 2 &"
- **Objectives:** read, count and tap eighth notes and eighth rests; take simple rhythm dictation.
- **Key concepts:** eighth note (half a beat); beams; flags; eighth rest; counting syllables "1 & 2 &" (ES: "1 y 2 y").
- **Exercises:** `rhythm-tap`, `rhythm-read`, `rhythm-dictation` (1 bar), `bar-complete`, review `meter-identify`.
- **Genre adaptation:** C: running eighths in an Alberti-bass accompaniment. P: eighth-note piano comping and hi-hat. R: driving eighth-note "pumping" root notes under power chords (heard as a rock bass line).

#### u2-l4 · Dots and ties
- **Objectives:** read and tap dotted half, dotted quarter + eighth, and tied notes; compose a 2-bar rhythm.
- **Key concepts:** dot adds half the value; tie joins two notes into one sound (including across a bar line); dotted quarter–eighth pattern; 3+3+2 grouping of eighths.
- **Exercises:** `rhythm-read`, `rhythm-dictation`, `bar-complete`, `rhythm-tap`, `compose` (mode `rhythm`: 2 bars, 4/4, must include one dotted note).
- **Genre adaptation:** C: dotted rhythms in marches and anthems. P: the 3+3+2 ("tresillo") groove behind many pop and dance songs. R: tied anticipations in riffs (a chord struck on "& of 4" and tied over the bar line).

#### u2-l5 · Sixteenth notes and syncopation
- **Objectives:** read and tap sixteenth-note patterns ("1 e & a"); recognize and perform syncopation (accents off the beat).
- **Key concepts:** sixteenth note and rest; common beat patterns (4 sixteenths; eighth + 2 sixteenths; 2 sixteenths + eighth); syncopation; anticipation ("push").
- **Exercises:** `rhythm-tap`, `rhythm-read`, `rhythm-dictation` (2 bars), `bar-complete` (syncopated patterns with ties), `compose` (`rhythm`: 2 bars that include a syncopation).
- **Genre adaptation:** C: sixteenth-note scale runs in a Classical allegro; syncopation in Baroque dance styles. P: sixteenth hi-hats; syncopated vocal hooks that anticipate the downbeat. R: the "gallop" (eighth + two sixteenths) and syncopated riff accents.

#### u2-l6 · Compound meter, triplets and swing
- **Objectives:** distinguish simple from compound meter by ear; read 6/8 and 12/8; read triplets; perform and recognize swing and shuffle feel.
- **Key concepts:** compound meter (dotted-quarter beat divided in 3); 6/8, 9/8, 12/8; triplet; swing/shuffle (eighths played long–short, notated as straight eighths plus "swing" marking).
- **Exercises:** `meter-identify` (simple vs compound), `rhythm-read` (6/8), `rhythm-tap` (triplets), `rhythm-tap` (swing vs straight), `compose` (`rhythm`: 2 bars of 6/8 or shuffle).
- **Genre adaptation:** C: siciliano and gigue in 6/8; barcarolle. P: 6/8 and 12/8 soul ballads. R: the 12/8 slow blues and the shuffle (preview of 12-bar blues in u6-l4).

**u2-check:** reading and tapping in 2/4, 3/4, 4/4 and 6/8, plus dictation, meter by ear and swing vs straight.

---

### Unit 3 — Intervals

**Goal:** measure, name, build and hear all intervals within an octave.
**Method (see 0.2 #1):** number = letter distance counted inclusively; quality = half-step count (table below). The major-scale method is added in u4-l1.

| Half steps | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Interval | P1 | m2 | M2 | m3 | M3 | P4 | A4/d5 (tritone) | P5 | m6 | M6 | m7 | M7 | P8 |

**Ear scaffold:** optional reference-song cues per interval, shown as hints and faded out (P4, P6). The content team chooses public-domain or widely known songs per locale (examples: P4 "Here Comes the Bride"; P5 "Twinkle Twinkle"; M2 "Happy Birthday"; P8 "Over the Rainbow"; m3 "Greensleeves"; for ES, "La Cucaracha" for P4).

#### u3-l1 · Interval size: steps, skips and leaps
- **Objectives:** find the number of an interval (2nd–8ve) by counting letters; tell step, skip and leap apart by eye and by ear; tell melodic from harmonic intervals; play back 3-note melodies.
- **Key concepts:** interval; number (inclusive counting); unison, 2nd … octave; step (2nd), skip (3rd), leap (4th or more); melodic vs harmonic; line–line and space–space intervals are odd numbers.
- **Exercises:** `interval-name` (number only, staff), `interval-ear` (step / skip / leap), `melody-echo` (3 notes), `concept-check`, `interval-name` (keyboard).
- **Genre adaptation:** C: conjunct (stepwise) melody as the norm (folk tunes and minuets). P: verse melodies move mostly by step; choruses often open with a leap. R: riffs built from 4th and 5th leaps; vocal melodies mostly stepwise.

#### u3-l2 · Seconds and thirds: major and minor
- **Objectives:** name and build m2, M2, m3 and M3 using half-step counts; hear the difference between major and minor 3rds.
- **Key concepts:** quality; minor (m) vs major (M); m2 = 1, M2 = 2, m3 = 3, M3 = 4 half steps; same number, different quality (E–G vs E–G♯).
- **Exercises:** `interval-build`, `interval-name` (full quality), `interval-ear` (M3 vs m3, blocked then interleaved), `interval-ear` (m2 vs M2), `melody-echo`.
- **Genre adaptation:** C: parallel 3rds in duets (sweet sound). P: backing vocals in 3rds above the lead. R: the minor 3rd as the "blue" sound; the m3-to-M3 "bend" imitated by a grace note.

#### u3-l3 · Perfect intervals: unison, 4th, 5th, octave
- **Objectives:** name, build and hear P1, P4, P5 and P8; know why they are called "perfect"; play a harmonic 5th (power-chord sound).
- **Key concepts:** perfect quality; P4 = 5, P5 = 7, P8 = 12 half steps; open and hollow sound; the exception pairs B–F and F–B (not perfect: preview of the tritone).
- **Exercises:** `interval-ear` (P4 vs P5, interleaved with M3/m3), `interval-build`, `interval-name`, `play-on-piano` (harmonic 5ths on different roots), `melody-echo`.
- **Genre adaptation:** C: horn calls and open-5th drones. P: octave leaps in hooks; root–5th bass patterns. R: P5 and P4 as power-chord sounds; parallel-5ths riffs (the classical rule against them does not apply in rock; that contrast comes in u6-l3).

#### u3-l4 · Sixths, sevenths and interval inversion
- **Objectives:** name, build and hear m6, M6, m7 and M7; invert an interval and predict its new number and quality.
- **Key concepts:** m6 = 8, M6 = 9, m7 = 10, M7 = 11 half steps; inversion (bottom note goes up an octave); the numbers add up to 9; M ↔ m, P stays P, A ↔ d.
- **Exercises:** `interval-build`, `interval-name`, `interval-ear` (6ths, then mixed with 3rds), `concept-check` (inversion), `interval-ear` (m7 vs M7).
- **Genre adaptation:** C: parallel 6ths; the m7 inside the dominant 7th (preview). P: big M6 opening leaps in ballads; the dreamy M7 sound. R: the m7 (♭7) heard in blues and Mixolydian riffs.

#### u3-l5 · Augmented, diminished, the tritone, and consonance vs dissonance
- **Objectives:** name augmented and diminished intervals; identify the tritone; tell enharmonic intervals apart (A4 vs d5); classify intervals as consonant or dissonant and hear tension and release.
- **Key concepts:** augmented (one half step larger than M or P), diminished (one half step smaller than m or P); tritone = 6 half steps; enharmonic intervals; perfect consonances (P1, P5, P8), imperfect consonances (3rds, 6ths), dissonances (2nds, 7ths, tritone; P4 depends on context); resolution.
- **Exercises:** `interval-name` (A/d spellings), `interval-ear` (tritone vs P4/P5), `concept-check` (consonant/dissonant), `interval-ear` (mixed, no cues), `melody-echo` (5 notes).
- **Genre adaptation:** C: the tritone inside V7 resolving inward or outward (preview of u6). P: suspended tension (4th) resolving to the 3rd. R: the tritone as the heavy-metal "devil's interval"; ♭5 as the blues "blue note" (preview of u4-l4).

**u3-check:** name, build and hear all simple intervals, including inversions and the tritone.

---

### Unit 4 — Scales and Keys

**Goal:** build and recognize major, minor, pentatonic, blues and modal scales; read all key signatures; establish a key by ear and transpose.

#### u4-l1 · The major scale and scale degrees
- **Objectives:** build a major scale on any note with W W H W W W H; name scale degrees by number and name; use the major scale to check interval quality.
- **Key concepts:** scale; major scale formula; tonic; degrees 1̂–7̂; degree names (tonic, supertonic, mediant, subdominant, dominant, submediant, leading tone); the major-scale method for intervals (a note above the tonic that is in the scale gives M or P).
- **Exercises:** `scale-build` (C, G, F, D), `play-on-piano` (scale up and down), `concept-check` (degree names), `interval-name` (major-scale method), `scale-identify` (major vs "wrong" scale by ear).
- **Genre adaptation:** C: scale passages in melodies (the descending scale of "Joy to the World"); classical fingering tip (thumb under). P: choosing a key to fit the singer's range. R: on piano, E and A major feel "guitar-friendly" keys; rock learners practice those keys as well.

#### u4-l2 · Key signatures and the circle of fifths
- **Objectives:** name any major key from its signature and write any signature (up to 7 sharps or flats); use the circle of fifths; know the order of sharps and flats.
- **Key concepts:** key signature; order of sharps F C G D A E B (ES: Fa Do Sol Re La Mi Si), and flats in reverse; tricks: the last sharp is a half step below the tonic, and the second-to-last flat names the key; circle of fifths (clockwise up a P5 = one more sharp); enharmonic keys (F♯/G♭, C♯/D♭, B/C♭).
- **Exercises:** `key-signature` (name the key), `key-signature` (write it), `concept-check` (circle wheel), `scale-build` (from a signature), `note-read` (in key: apply the signature).
- **Genre adaptation:** C: flat keys (E♭, B♭) common in wind and orchestral music; signatures matter for reading. P: any key is fine; songs are often transposed for vocal range. R: sharp keys (E, A, D, G) are common in guitar-based rock.

#### u4-l3 · Minor scales: natural, harmonic, melodic; relative and parallel
- **Objectives:** build natural, harmonic and melodic minor scales; find the relative minor of a major key (degree 6̂, or a m3 down) and the parallel minor; hear major vs minor.
- **Key concepts:** natural minor (W H W W H W W); harmonic minor (raised 7̂, the leading tone, with an augmented 2nd between ♭6̂ and 7̂); melodic minor (raised 6̂ and 7̂ ascending, natural descending, in classical usage); relative keys share a signature; parallel keys share a tonic.
- **Exercises:** `scale-build` (three forms), `scale-identify` (major vs natural minor vs harmonic minor by ear), `key-signature` (minor keys), `concept-check` (relative vs parallel), `melody-echo` (minor).
- **Genre adaptation:** C: harmonic minor (leading tone, used for V) and melodic minor in melodies. P: natural minor (Aeolian) as "the minor sound"; the vi chord as the relative minor (preview). R: natural minor and minor pentatonic are the norm; harmonic minor as the "neoclassical metal" flavor.

#### u4-l4 · Pentatonic and blues scales
- **Objectives:** build major pentatonic (1̂ 2̂ 3̂ 5̂ 6̂), minor pentatonic (1̂ ♭3̂ 4̂ 5̂ ♭7̂) and the blues scale (minor pentatonic + ♭5̂); play the black-key pentatonic; improvise over a backing track; take first melody dictations.
- **Key concepts:** pentatonic (5 notes, no half steps); relative pentatonics (C major pent = A minor pent); blues scale and blue notes (♭3̂, ♭5̂, ♭7̂); "no wrong notes" improvisation.
- **Exercises:** `scale-build`, `scale-identify`, `melody-dictation` (3–5 pentatonic notes), `compose` (mode `improvise`: 4 bars over a genre backing, restricted to the scale; checks: ends on tonic, uses at least 4 different notes), `melody-echo`.
- **Genre adaptation:** C: pentatonic themes in folk-influenced repertoire (Dvořák, Debussy's black-key textures). P: pentatonic vocal hooks and R&B-style runs over a I–V–vi–IV backing. R: the core vocabulary; the minor-pentatonic "box" on piano; blues scale over a 12-bar shuffle backing; ♭3̂ grace-note "bend" to 3̂.

#### u4-l5 · Modes as colors: Dorian, Mixolydian and friends
- **Objectives:** describe each mode as a major or minor scale with one changed "color note"; build and hear Dorian, Mixolydian, Lydian and Phrygian; recognize Ionian = major and Aeolian = natural minor.
- **Key concepts:** mode; parallel (color-note) approach: Dorian = natural minor with ♮6̂; Mixolydian = major with ♭7̂; Lydian = major with ♯4̂; Phrygian = natural minor with ♭2̂; parent-scale view (D Dorian uses C major's notes) as a secondary approach; Locrian is mentioned only.
- **Exercises:** `scale-build` (modes from a tonic), `scale-identify` (aural: major vs Mixolydian; minor vs Dorian), `concept-check` (color note), `compose` (`improvise` in a mode over a drone/vamp), `scale-identify` (visual).
- **Genre adaptation:** C: church modes in Renaissance and folk tunes ("Scarborough Fair", Dorian); Phrygian in Spanish-flavored classical music; Lydian in film and impressionist music. P: Mixolydian ♭VII flavor; Dorian minor vamps in funk and pop. R: Mixolydian as the "classic rock" major (I–♭VII–IV vamps); Dorian minor jams; Phrygian in metal.

#### u4-l6 · Hearing keys: tonic, scale degrees and transposition
- **Objectives:** find the tonic of a passage by ear; identify scale degrees by ear after a key-establishing cadence; transpose a melody to another key.
- **Key concepts:** tonal center; stability of 1̂, 3̂ and 5̂ vs the tendency of 7̂→1̂ and 4̂→3̂; transposition (move every note by the same interval; apply the new key signature).
- **Exercises:** `scale-degree-ear` (1̂/3̂/5̂, then all), `concept-check`, `transpose` (melody, keyboard), `transpose` (staff), `melody-dictation` (diatonic, 4–6 notes).
- **Genre adaptation:** C: preview of modulation (a piece moving to the dominant key). P: the final-chorus key change ("truck-driver" lift up a half or whole step). R: transposing riffs (rock bands tune down; on piano that means changing key).

**u4-check:** scales (all types), key signatures, relative and parallel keys, modes by color note, scale-degree ear and transposition.

---

### Unit 5 — Chords

**Goal:** build, name, voice and hear triads, seventh chords and popular chord types, and label diatonic chords with Roman numerals in major and minor keys.

#### u5-l1 · Triads: major and minor
- **Objectives:** build major and minor triads on any root by stacking 3rds; name them with chord symbols; hear major vs minor triads.
- **Key concepts:** chord; triad; root, 3rd, 5th; major = M3 + m3; minor = m3 + M3; chord symbols (C, Cm / Do, Dom); arpeggio.
- **Exercises:** `chord-build`, `chord-name`, `chord-ear` (major vs minor), `play-on-piano` (arpeggiate), `interval-ear` review.
- **Genre adaptation:** C: arpeggiated triads in themes (the opening of "Eine kleine Nachtmusik"). P: "four chords can carry a whole song" (preview of the loop). R: major triads vs power chords (preview); playing a full triad in the right hand over a root in the left.

#### u5-l2 · Diminished, augmented and the diatonic triads of a major key
- **Objectives:** build and hear diminished and augmented triads; build the seven triads of a major key and label them with Roman numerals.
- **Key concepts:** diminished = m3 + m3 (°); augmented = M3 + M3 (+); diatonic chords; I ii iii IV V vi vii° pattern (major, minor, minor, major, major, minor, diminished); Roman numeral case.
- **Exercises:** `chord-build` (dim/aug), `chord-ear` (4 qualities), `roman-numeral`, `chord-build` (from a numeral in key), `concept-check`.
- **Genre adaptation:** C: vii° as a substitute for V. P: the Nashville number system (1, 4, 5, 6m) as the pop equivalent of Roman numerals. R: I, IV and V as the rock "three-chord" core; the ♭VII preview ("not in the key, but everywhere in rock").

#### u5-l3 · Diatonic triads in minor keys
- **Objectives:** build the diatonic triads in natural and harmonic minor; choose v vs V and VII vs vii°.
- **Key concepts:** i ii° III iv v VI VII (natural minor); raised 7̂ gives V and vii° (harmonic minor); III+ mentioned as a rare chord.
- **Exercises:** `roman-numeral` (minor), `chord-build`, `chord-ear` (v vs V in context), `concept-check`, review `scale-build` (harmonic minor).
- **Genre adaptation:** C: always V (major) at cadences in minor. P: minor-key songs often keep v or avoid it (i–VI–III–VII loops). R: Aeolian rock uses VI and VII freely (i–VI–VII); V with the leading tone is the "metal/neoclassical" color.

#### u5-l4 · Inversions and voicing at the piano
- **Objectives:** build and recognize root position, 1st and 2nd inversion; read slash chords and figured-bass shorthand; voice chords comfortably (left-hand root, right-hand triad) and move between chords with minimal hand motion.
- **Key concepts:** bass note vs root; root position (5/3), 1st inversion (6, or 6/3), 2nd inversion (6/4); slash chords (C/E); close vs open voicing; doubling the root.
- **Exercises:** `chord-build` (inversions), `chord-name` (inversion), `chord-ear` (root vs 1st inversion), `play-on-piano` (I–IV–V–I using inversions), `error-spot` (wrongly named inversion).
- **Genre adaptation:** C: figured-bass numbers and the cadential 6/4 (preview). P: slash chords for smooth bass lines (C – G/B – Am). R: the right-hand triad over a moving left-hand bass (D/F♯ walk-downs).

#### u5-l5 · Seventh chords
- **Objectives:** build, name and hear major 7, dominant 7, minor 7, half-diminished and diminished 7 chords; find V7 in any key.
- **Key concepts:** 7th chord = triad + 7th; Cmaj7 (M7), C7 (dominant: major triad + m7), Cm7, Cm7♭5 (ø7), Cdim7 (°7); V7 and its tritone; diatonic 7ths (Imaj7 ii7 iii7 IVmaj7 V7 vi7 viiø7).
- **Exercises:** `chord-build`, `chord-name`, `chord-ear` (maj7 vs dom7 vs m7), `roman-numeral` (with 7ths), `error-spot`.
- **Genre adaptation:** C: V7 and viiø7/vii°7 as dominants. P: maj7 and m7 as "soft" color chords (neo-soul, ballads); ii7–V7 movement. R: the dominant 7 as the blues chord (I7, IV7, V7 all dominant); the "Hendrix chord" (7♯9) as an optional challenge item.

#### u5-l6 · Power chords, sus chords, add9 and other colors
- **Objectives:** build and hear power chords (5), sus2, sus4 and add9; know when each replaces a triad; voice them on the piano.
- **Key concepts:** power chord = root + 5th (+ octave), neither major nor minor; sus2 / sus4 (the 3rd replaced); add9; the sus4 → major resolution; chord-symbol spelling (C5, Csus4, Cadd9).
- **Exercises:** `chord-build`, `chord-ear` (sus4 vs major; power vs major), `play-on-piano` (power-chord riff in octaves), `chord-name`, `compose` (choose colors for a given 4-chord loop; checks: at least one sus and one add9).
- **Genre adaptation:** C: the suspension (4–3) as the classical source of "sus" (it comes back in u7-l3). P: add9 and sus2 as the shimmer of modern pop piano. R: power chords as the main harmony, built in the left hand with octaves; palm-mute "chug" imitated with staccato eighths.

**u5-check:** build, name and hear all chord types, Roman numerals in major and minor, and inversions.

---

### Unit 6 — Harmony and Progressions

**Goal:** understand why chords follow each other (function), end phrases with cadences, connect chords smoothly, use genre progression schemas and chromatic colors, and harmonize a melody.

#### u6-l1 · Harmonic function: tonic, predominant, dominant
- **Objectives:** sort diatonic chords into tonic (T), predominant (PD) and dominant (D) functions; build T–PD–D–T progressions; complete progressions using functional logic.
- **Key concepts:** T (I, vi, iii), PD (IV, ii), D (V, V7, vii°); the phrase model T–PD–D–T; tendency tones (7̂→1̂, 4̂→3̂); harmonic rhythm.
- **Exercises:** `concept-check`, `progression-complete` (choose PD or D), `chord-ear` in context (which chord sounds like "home"?), `roman-numeral`, `play-on-piano` (I–IV–V7–I in 3 keys).
- **Genre adaptation:** C: functional harmony is the core grammar; I–ii6–V7–I. P: function is looser; loops can start on any chord and tonic is sometimes ambiguous (preview of u6-l4). R: I–IV–V as the three-chord grammar; the ♭VII often takes the dominant role.

#### u6-l2 · Cadences
- **Objectives:** identify and write authentic (perfect and imperfect), half, plagal and deceptive cadences by ear and on the score; know which cadences close a phrase and which leave it open.
- **Key concepts:** PAC (V–I, both chords in root position, 1̂ in the top voice); IAC; HC (ends on V); plagal (IV–I); deceptive (V–vi); popular cadences: ♭VII–I, IV–I, and V–IV–I in blues; open vs closed phrase endings.
- **Exercises:** `cadence-ear` (PAC vs HC first, then all), `analysis` (label the cadence on a 4-bar excerpt), `progression-complete` (make it a PAC / HC), `play-on-piano`, `error-spot`.
- **Genre adaptation:** C: PAC and HC drive phrase structure; the cadential 6/4 (I6/4–V–I). P: plagal and "IV–V–(no I)" endings; avoiding the final cadence to keep a loop going; deceptive surprises before the last chorus. R: ♭VII–I and the double plagal ♭VII–IV–I as rock "cadences"; the blues turnaround (V–IV–I–V).

#### u6-l3 · Voice leading at the keyboard
- **Objectives:** connect chords smoothly (keep common tones, move other voices by step); resolve the leading tone and the chordal 7th; spot parallel 5ths and octaves in classical-style writing; know where genre norms differ.
- **Key concepts:** voices (soprano, alto, tenor, bass, simplified to bass + 3 right-hand voices); common tones; contrary motion; the leading tone resolves up; the 7th resolves down; parallel perfect 5ths and 8ves (avoided in classical style; idiomatic in rock power chords); spacing.
- **Exercises:** `voice-lead` (I–IV–V–I), `error-spot` (parallels, unresolved leading tone), `play-on-piano`, `voice-lead` (genre loop), `concept-check`.
- **Genre adaptation:** C: strict keyboard-style rules (bass + 3 voices; no parallels; resolve tendency tones). Optional link to ABRSM-style SATB as an extension. P: "closest voicing" comping, with right-hand chords that barely move over a loop. R: parallel power chords are idiomatic; voice leading matters for keyboard parts and vocal harmonies, not for the riff.

#### u6-l4 · Progression schemas by genre
- **Objectives:** recognize by ear, play and use the core schemas of the learner's genre, and know the most important schemas of the other two genres.
- **Key concepts (shared):** schema = a progression pattern used so often it is recognized by ear; loop vs goal-directed progression; rotation (the same loop starting on another chord).
- **Schemas by genre** (all learners meet all of these; the learner's genre gets most of the practice):
  - **Classical:** I–IV–V–I; I–vi–ii–V–I; descending-fifths sequence (I–IV–vii°–iii–vi–ii–V–I); Pachelbel (I–V–vi–iii–IV–I–IV–V); cadential 6/4.
  - **Pop:** "singer/songwriter" or axis family I–V–vi–IV and rotations vi–IV–I–V, IV–I–V–vi; doo-wop I–vi–IV–V; "hopscotch" IV–V–vi–I; ii–V–I in neo-soul.
  - **Rock:** 12-bar blues (I7 I7 I7 I7 | IV7 IV7 I7 I7 | V7 IV7 I7 V7 turnaround); I–♭VII–IV–I; double plagal ♭VII–IV–I; Aeolian i–♭VI–♭VII–i; the Andalusian cadence i–♭VII–♭VI–V.
- **Exercises:** `progression-ear` (identify the schema), `progression-complete`, `play-on-piano` (loop with a backing track), `transpose` (schema to a new key), `compose` (pick and order 4 chords into a loop; checks: tonic appears, loop repeats cleanly).
- **Genre adaptation:** C: the challenge item realizes I–vi–ii–V–I with correct voice leading. P: the challenge rotates I–V–vi–IV into the vi–IV–I–V "minor feel" and compares them. R: the challenge plays a full 12-bar blues with a boogie left hand.

#### u6-l5 · Chromatic color: secondary dominants and borrowed chords
- **Objectives:** build and use V/V and V/vi; borrow iv, ♭VI, ♭VII and ♭III from the parallel minor; hear the "outside the key" color.
- **Key concepts:** secondary dominant (V of a chord other than I; a temporary leading tone); tonicization; modal mixture / borrowed chords; minor plagal (IV–iv–I); chromatic mediant (I–♭VI).
- **Exercises:** `chord-build` (V/V in several keys), `roman-numeral` (secondary and borrowed), `progression-ear` (IV–I vs iv–I), `progression-complete` (insert V/V before V), `error-spot`.
- **Genre adaptation:** C: V/V before a half cadence; iv and ♭VI in Romantic-era major keys. P: the IV–iv–I "nostalgia" move; III (V/vi) leading to vi. R: ♭III, ♭VI and ♭VII as main chords rather than colors (I–♭III–IV; I–♭VI–♭VII–I "epic" cadence).

#### u6-l6 · Harmonizing a melody and changing key
- **Objectives:** choose chords for a melody (strong-beat notes as chord tones); set a harmonic rhythm; modulate to a closely related key with a pivot chord, or by a direct key change.
- **Key concepts:** harmonization process (find the cadence points first, then strong-beat notes, then functional order); harmonic rhythm (1 or 2 chords per bar); closely related keys (V, relative minor/major); pivot chord; direct modulation; key change as an energy lift.
- **Exercises:** `harmonize` (2 bars, then 4 bars), `analysis` (find the pivot chord), `progression-complete` (modulate to V), `cadence-ear` review, `compose` (`phrase`: harmonize a given 4-bar melody, then add a bass line).
- **Genre adaptation:** C: modulation to V (major keys) or III (minor keys), as needed for binary form; pivot via ii/vi. P: harmonizing a hook with a loop (the same melody over two different loops); the final-chorus lift. R: riff-based harmony (the riff implies the chord); a whole-step key change for the final chorus or guitar solo; the parallel-mode switch (major verse, minor chorus).

**u6-check:** function, cadence ear, voice-leading errors, schemas of the learner's genre, secondary and borrowed chords, harmonization.

---

### Unit 7 — Melody and Phrase Writing

**Goal:** write memorable, well-shaped melodies that fit a chord progression and form complete phrases. From here on most items are `compose` tasks with automatic checks plus self-review.

#### u7-l1 · Motifs and how to develop them
- **Objectives:** define a motif (a short, recognizable rhythm + pitch idea); develop a motif by repetition, sequence, inversion, rhythmic augmentation/diminution and fragmentation; write a motif and two variants.
- **Key concepts:** motif; repetition; sequence (repetition at another pitch level); inversion; augmentation/diminution; fragmentation; "unity with variety".
- **Exercises:** `analysis` (find the motif and its variants), `melody-echo`, `concept-check` (which technique?), `compose` (mode `motif`: 1-bar motif + sequence + inversion), `melody-dictation` (2 bars built from one motif).
- **Genre adaptation:** C: Beethoven's Fifth (short-short-short-long) and sequence in Baroque and Classical themes. P: the hook as a motif repeated with small changes for each lyric line. R: the riff as a motif; repetition with a changed ending (turnaround variation).

#### u7-l2 · Contour, range and climax
- **Objectives:** describe and design melodic contour (arch, wave, rising, falling); place one climax; balance steps and leaps (a leap followed by a step in the opposite direction); keep the range singable or playable.
- **Key concepts:** contour; range and tessitura; climax (single high point, often about two-thirds of the way through); gap-fill (leap then step back); conjunct vs disjunct motion; repeated-note "recitation".
- **Exercises:** `concept-check` (pick the contour), `error-spot` (unbalanced leaps, two climaxes), `melody-echo`, `compose` (`motif` → 2-bar melody with a given contour; checks: one highest note, leaps of a 6th or more followed by a step back), `melody-dictation`.
- **Genre adaptation:** C: arch-shaped, balanced phrases; range about a 10th. P: verse low and narrow, chorus higher and wider (contrast creates lift); range about an octave and a 3rd for singers. R: riffs low and repetitive; vocal climaxes high and sustained; solos climb to a peak.

#### u7-l3 · Melody over harmony: chord tones and non-chord tones
- **Objectives:** put chord tones on strong beats; use passing tones, neighbor tones, appoggiaturas, suspensions and anticipations deliberately; check a melody against its chords.
- **Key concepts:** chord tone vs non-chord tone (NCT); passing tone (P), neighbor (N), appoggiatura (leap to a dissonance, resolved by step), suspension (4–3, 9–8, 7–6), anticipation; guide tones (3rds and 7ths); "avoid notes" (the 4th over a major chord on a strong beat).
- **Exercises:** `analysis` (label the NCTs), `error-spot` (a clash on a strong beat), `compose` (write 2 bars over a given progression; check: at least 70% chord tones on strong beats), `harmonize` review, `melody-dictation` (with passing tones).
- **Genre adaptation:** C: suspensions and appoggiaturas as expressive devices; correct preparation and resolution. P: anticipations (the melody arrives on the "& of 4" before the chord); sus color in the melody. R: blue notes (♭3̂ over a major I chord) as a deliberate clash; pentatonic melodies over major chords.

#### u7-l4 · Phrases: period, sentence, question and answer
- **Objectives:** build 4- and 8-bar phrases that end with a cadence; write a parallel period (antecedent ending on HC → consequent ending on PAC); write a sentence (basic idea + repetition + continuation → cadence); use call and response.
- **Key concepts:** phrase; hypermeter (4- and 8-bar units); antecedent and consequent; parallel vs contrasting period; sentence (presentation 2+2, continuation 4 with fragmentation and faster harmonic rhythm); call and response; open vs closed endings.
- **Exercises:** `form-identify` (period vs sentence, shortened version), `analysis` (label basic idea / continuation / cadence), `cadence-ear` review, `compose` (mode `phrase`: an 8-bar period over a given progression; checks: bar 4 ends on V, bar 8 ends on I with 1̂, bars 1–2 return in bars 5–6), `compose` (call 2 bars → write the 2-bar response).
- **Genre adaptation:** C: period and sentence are the main focus (the forms used in the capstone). P: verse lines as question and answer; 4-bar lines grouped into 8- or 16-bar sections; the chorus as a closed phrase. R: call (vocal) and response (riff or guitar fill); the AAB lyric phrase of the 12-bar blues (line, repeat, answer).

#### u7-l5 · Hooks and riffs
- **Objectives:** write a hook or riff that is memorable and fits its section; use repetition, rhythmic identity, register contrast and placement; fit words to rhythm (prosody basics, optional lyrics).
- **Key concepts:** hook (the most memorable melodic and lyrical idea, usually in the chorus, often carrying the title); riff (a repeated instrumental figure, usually 1–2 bars, often in the low register); ostinato; prosody (stressed syllables on strong beats; the shape of the melody matches the meaning of the words); the hook in a different rhythm and register from the verse.
- **Exercises:** `analysis` (find the hook and riff in an original example), `rhythm-tap` (riff rhythm), `compose` (mode `motif` → hook or riff, 2 bars; checks per genre), `compose` (fit a given lyric line: stressed syllables on beats 1 and 3), `melody-dictation` (riff).
- **Genre adaptation:** C: the "memorable theme" and ostinato bass (Pachelbel ground, Alberti patterns); hook thinking applied to a minuet theme. P: the main focus: chorus hook on the downbeat, title on the hook, post-chorus instrumental hook; prosody exercises. R: the main focus: riff-first writing from the minor pentatonic or blues scale, with rests and syncopation; doubled in octaves (left hand + right hand).

**u7-check:** write an 8-bar phrase in the learner's genre that meets all automatic checks (graded on the checklist), plus NCT analysis and contour/cadence items.

---

### Unit 8 — Form and Composition (Capstone)

**Goal:** understand large-scale form in the learner's genre, arrange for piano, and compose, polish and share a complete short piece.
Lessons u8-l4 to u8-l6 are the guided capstone. The detailed specification for each genre is in Section 4.

#### u8-l1 · Form: repetition, contrast, return
- **Objectives:** hear and label sections with letters; recognize repetition, varied repetition, contrast and return; recognize 8- and 16-bar section lengths.
- **Key concepts:** section; letters (A, A′, B); strophic form; binary (AB) vs ternary (ABA); proportion; transitions; intro/outro (coda).
- **Exercises:** `form-identify` (short examples), `concept-check`, `analysis` (bar numbers of each section), `form-identify` (genre-length example), `melody-echo` (recall the A theme when it returns).
- **Genre adaptation:** C: minuet, folk-song and short character-piece examples. P: verse/chorus labeling on an original song. R: 12-bar choruses and riff-defined sections.

#### u8-l2 · Genre forms
- **Objectives:** describe the standard forms of the learner's genre and identify them by ear; know the other genres' main forms.
- **Key concepts by genre:**
  - **Classical:** simple binary ||: A :||: B :||; rounded binary ||: A :||: B A′ :|| (the B section often stays on V; A′ is the return, ending with a PAC in the tonic); ternary A–B–A (B in a contrasting key or mode); outlook only: rondo (ABACA) and sonata form.
  - **Pop:** verse–chorus (V–C–V–C–Bridge–C); verse–pre-chorus–chorus; AABA (32-bar song form); intro, post-chorus, outro; section functions (the verse tells, the pre-chorus builds, the chorus releases, the bridge contrasts).
  - **Rock:** 12-bar blues form (repeated choruses, AAB lyric); verse–chorus built on riffs; intro riff, guitar-solo section over verse chords, breakdown, outro riff.
- **Exercises:** `form-identify`, `analysis`, `concept-check` (which section's function?), `progression-ear` (identify the section by its progression), `compose` (drag section blocks into a form map with lengths; checks: genre norms).
- **Genre adaptation:** the key concepts above are the adaptation. The learner's genre gets 70% of the items; the other two get 15% each, as "know your neighbors" items.

#### u8-l3 · Texture and arranging for piano
- **Objectives:** turn a lead sheet (melody + chords) into a piano arrangement; choose left-hand patterns; use register, dynamics, articulation and texture to shape energy across sections.
- **Key concepts:** texture (melody + accompaniment, homophonic, unison); left-hand patterns; register; dynamics (pp–ff, crescendo); articulation (legato, staccato, accent); energy curve over the form.
- **Left-hand patterns by genre:** C: Alberti bass, waltz bass ("oom-pah-pah"), broken chords, block chords in cadences. P: sustained chords + root octaves, syncopated eighth-note comping, arpeggiated ballad pattern. R: driving eighth-note power chords or octaves, riff doubled in octaves, boogie-woogie left hand for blues.
- **Exercises:** `play-on-piano` (each pattern), `rhythm-read` (pattern rhythms), `analysis` (which section is louder or denser, and why), `compose` (arrange a given 8-bar lead sheet in two different textures), `error-spot` (a pattern clashes with the chord).
- **Genre adaptation:** the patterns above, plus a genre tip card on dynamics: C uses terraced and graded dynamics; P builds layer by layer into the chorus; R uses loud/quiet contrast and stops ("breaks").

#### u8-l4 · Capstone I: plan and main idea
- **Objectives:** decide the form map, key, meter, tempo and chord plan; write the main idea (classical theme, pop chorus hook, or rock main riff).
- **Key concepts:** planning before writing; "start with the strongest idea"; constraints as creative tools.
- **Exercises:** `compose` (mode `section`, guided wizard: milestones M1–M2 in Section 4), `analysis` (self-check the main idea against the u7 checklist), `play-on-piano` (play your idea).
- **Genre adaptation:** see Section 4.

#### u8-l5 · Capstone II: write the core sections
- **Objectives:** write the contrasting section(s) and connect them with cadences and transitions.
- **Exercises:** `compose` (`section`, milestones M3–M4), `voice-lead` / `harmonize` checks on the learner's own material, `form-identify` (on your own piece).
- **Genre adaptation:** see Section 4.

#### u8-l6 · Capstone III: complete, arrange, polish, share
- **Objectives:** assemble the full piece; arrange it for piano; review it against the rubric; revise at least one weakness; export and share.
- **Exercises:** `compose` (`piece`, milestones M5–M6), rubric self-assessment, optional peer review, export (MIDI, MusicXML, audio render).
- **Genre adaptation:** see Section 4.

**Course completion:** the capstone is submitted, the automatic checks pass, and the self-assessment rubric is completed. A completion badge per genre is awarded. Learners can repeat the capstone in another genre (the shared core counts as already done).

---

## 4. Capstone project specifications

All capstones share these elements:

- **Tool:** the `compose` editor in `piece` mode, with tracks for the melody (right hand), accompaniment (left hand) and optional chord symbols and lyrics. It has playback at tempo, a metronome and a loop function.
- **Guided milestones:** each milestone unlocks the next, with automatic checks and a "suggest" button that offers 2–3 options built from schemas the learner has studied, never a full solution.
- **Deliverables:** the score (in-app plus MusicXML), MIDI, a rendered audio file, and a short "composer's note": 3 prompts answered in 1–2 sentences each (form, key choices, favorite moment).
- **Assessment:** automatic checks (pass/fail gates) plus a rubric (self-assessment, optional peer or teacher review). To pass: all gates are met and the rubric average is at least 2.5 out of 4.

### 4.1 Classical: "Minuet in Rounded Binary Form"

**Product:** a piano minuet in 3/4, rounded binary form, 24–32 bars (without repeats), in a major key of up to 2 sharps or flats (minor key optional). It has a melody in the right hand and an Alberti, waltz-bass or block-chord accompaniment.

**Form:** ||: A (8 bars: a parallel period or sentence, modulating to V or ending on a HC) :||: B (4–8 bars: contrast, usually dominant prolongation or a sequence, ending on V) A′ (8 bars: return of the opening idea, ending with a PAC in the tonic) :||

| Milestone | Task | Automatic checks |
|---|---|---|
| M1 Plan | Choose key, tempo (Allegretto–Moderato), form lengths | Key within scope; form map is valid rounded binary |
| M2 Theme | Write the 4-bar basic idea + continuation as an 8-bar period or sentence, with a chord plan | Bar 4 = HC (period) or presentation 2+2 (sentence); bar 8 = PAC in the tonic, or a PAC in V if modulating; at least 70% strong-beat chord tones |
| M3 Contrast (B) | Write the B section using sequence or a dominant pedal; it may use V/V or a borrowed iv | Ends on V (HC); contains a sequence or fragmentation of the motif; no new key beyond V or vi |
| M4 Return (A′) | Restate the A theme with an altered ending so it closes in the tonic | Bars 1–2 of A recur; final cadence is a PAC on 1̂ |
| M5 Arrange | Add the left hand (Alberti or waltz bass), dynamics and articulation | No parallel 5ths or octaves between the outer voices (warning list); range within the keyboard's playable span; dynamics marked in each section |
| M6 Polish and share | Self-review with the rubric; revise; export | All gates pass |

### 4.2 Pop: "Original Pop Song (Piano Arrangement)"

**Product:** a pop song for piano (lyrics optional, but a title is required), at 70–128 BPM in 4/4. Form: Intro – Verse 1 – Pre-chorus – Chorus – Verse 2 – Pre-chorus – Chorus – Bridge – Final Chorus – Outro, about 64–96 bars. The melody is in the right hand (playing the vocal line) and the left hand plays chords and bass.

| Milestone | Task | Automatic checks |
|---|---|---|
| M1 Plan | Choose key, tempo, mood, form map and chord loop(s): a chorus loop from the schema library (e.g., I–V–vi–IV or a rotation) and a different verse loop or harmonic rhythm | Form contains V, C and B; at least 2 distinct progressions |
| M2 Chorus hook | Write the 8-bar chorus melody with the hook (title on a strong beat) | The hook motif occurs at least twice in the chorus; chorus range is higher than the planned verse range (checked after M3); at least 70% strong-beat chord tones |
| M3 Verse and pre-chorus | Write the verse (lower, narrower, more rhythmic speech) and the pre-chorus (rising, builds tension, may end on V or IV) | Verse mean pitch is lower than the chorus mean pitch; pre-chorus has a rising contour or ends on a non-tonic chord |
| M4 Bridge | Write the bridge with new chords (start on vi or IV, or a borrowed iv/♭VI), returning to the chorus | Bridge progression differs from verse and chorus; ends on a chord that leads into the chorus |
| M5 Arrange | Intro (hook or chorus chords), comping patterns per section, energy curve (sparse verse, fuller chorus), optional final-chorus key lift | Texture density in the chorus is greater than in the verse; the outro ends on I or deliberately on IV/vi (flagged as an intentional choice) |
| M6 Polish and share | Rubric self-review; optional lyrics with prosody check (stressed syllables on strong beats); export | All gates pass |

### 4.3 Rock: "Riff-Based Rock Song (Piano/Keys Arrangement)"

**Product:** a rock song for piano at 90–160 BPM in 4/4 (12/8 shuffle allowed), in a key or mode built on the minor pentatonic or blues scale, Mixolydian or Aeolian. Form: Intro riff – Verse – Chorus – Verse – Chorus – Solo (over the 12-bar blues or verse chords) – Chorus – Outro riff, about 64–96 bars. **Alternative track:** a 12-bar-blues-form piece with 4–6 choruses (head, variations, solo, head).

| Milestone | Task | Automatic checks |
|---|---|---|
| M1 Plan | Choose tonic, mode or scale, tempo, feel (straight or shuffle), form map | Form contains a riff intro, at least 2 choruses and a solo section |
| M2 Main riff | Write a 1–2 bar riff in the low register (doubled in octaves) | Uses at least 4 notes, mostly from the chosen pentatonic, blues or modal scale; contains a rest or syncopation; loops cleanly |
| M3 Verse and chorus | Verse over the riff or a power-chord progression; chorus with a contrasting progression (e.g., I–♭VII–IV, or ♭VI–♭VII–i) and a vocal-style melody | Chorus progression differs from the verse; the chorus melody has a hook motif repeated at least twice; ♭VII or another modal chord is used at least once (warning if not) |
| M4 Solo section | Write an 8- or 12-bar solo using the blues or pentatonic scale, building to a climax | Single climax in the last third; uses at least one blue note or bend figure; ends on a chord tone |
| M5 Arrange | Left-hand power chords or octave eighths, riff doublings, stops/breaks, dynamics (quiet verse, loud chorus), outro riff | Loud/quiet contrast between sections; the outro restates the main riff |
| M6 Polish and share | Rubric self-review; export | All gates pass |

### 4.4 Assessment rubric (all genres)

Each criterion is scored 1–4. Genre descriptors replace the generic text where shown.

| Criterion | 1 Emerging | 2 Developing | 3 Proficient | 4 Expert |
|---|---|---|---|---|
| **Form and proportion** | Sections unclear | Sections present, lengths uneven | Clear genre form; sections have distinct functions | Form serves the piece's arc (C: convincing return; P: verse → chorus lift; R: riff frames the song) |
| **Harmony** | Chords often clash with the melody | Diatonic and functional, but static | Clear cadences and progressions fitting the genre (C: PAC/HC placement; P: loops chosen per section; R: modal or blues progressions) | Purposeful color (secondary dominants, borrowed chords, key lift) placed at structural moments |
| **Melody and motif** | Wandering, no recognizable idea | Main idea present but rarely reused | Motif/hook/riff developed through repetition and variation; good contour and climax | Memorable; development creates unity and surprise |
| **Rhythm and groove** | Rhythms do not fit the meter | Correct but monotonous | Rhythm supports the genre feel (C: dance meter; P: syncopated hook; R: driving riff) | Rhythmic identity is a defining feature |
| **Texture and arrangement** | One texture throughout | Some variation | Texture and dynamics change by section | Arrangement shapes an energy curve across the whole piece |
| **Craft and notation** | Many errors (wrong bar fills, parallels in classical style, wrong spelling) | Some errors | Few minor errors | Clean, readable, idiomatic score |

**Gates (automatic, must pass):** all milestone checks above; total length within range; piece ends with a closing gesture (tonic chord or a flagged intentional alternative); no empty bars.

---

## 5. Spaced review and mastery rules

### 5.1 What is tracked

- **Item:** the smallest skill-fact unit that can be reviewed, keyed by `exerciseType:parameters`. Examples: `note-read:treble:G4`, `note-read:bass:ledger-low`, `interval-ear:m3:asc`, `chord-ear:dom7`, `key-signature:Eb-major`, `cadence-ear:HC`, `rhythm-read:dotted-quarter-eighth`. Each item belongs to one lesson (the one that introduced it) and has a genre tag (`core | classical | pop | rock`).
- **Per-item memory state:** half-life `h` (days), last-seen timestamp, attempts, correct streak, hint level last used, and response latency.
- **Recall probability** (half-life regression model, after Settles and Meeder 2016): `p = 2^(−Δ / h)`, where Δ = days since the item was last seen. **Item strength = p.**

### 5.2 Half-life updates (default rule-based model)

Start with this rule-based version. Once enough review logs exist, replace it with a trained HLR model (features: exercise type, item difficulty, history, latency).

| Event | Update |
|---|---|
| First correct answer in a lesson | `h = 1.0 d` (or `0.5 d` if a hint was used) |
| Correct answer, no hint, fast (latency below the item's median) | `h ← h × 2.5` |
| Correct answer, no hint, slow | `h ← h × 1.8` |
| Correct answer with a hint, or after replaying audio 3 times | `h ← h × 1.2` |
| Incorrect answer | `h ← max(0.25 d, h × 0.4)`, and the item is re-queued in the same session |
| Perceptual items (`*-ear`, `rhythm-*`, `melody-*`) | Growth multipliers × 0.85 (these skills decay faster and benefit more from spacing) |
| Cap | `h ≤ 180 d` |

### 5.3 When items come back

- **Due:** an item is due when `p < 0.6`. Practice sessions take due items first, lowest `p` first.
- **Practice session (about 10–15 items, about 3 minutes):** about 60% due items; about 25% interleaved confusable partners of those items (for example, if `interval-ear:m3` is due, add `interval-ear:M3`; a confusion matrix built from the learner's own errors decides the partners); about 15% recent-lesson items with low `h`. No more than 3 items of the same exercise type in a row.
- **Inside new lessons:** 20–30% of the exercises are review items taken from the last 1–3 lessons and from any due items in the same unit (P2, P6).
- **Unit checkpoints and the capstone** count as reviews of every item they include.
- **Confusable sets (initial seed):** m3/M3; m6/M6; P4/P5/tritone; m7/M7; maj/min triad; maj7/dom7; HC/PAC/IAC; plagal/♭VII–I; root position/1st inversion; Dorian/Aeolian; Mixolydian/Ionian; enharmonic note pairs; 6/8 vs 3/4; swing vs straight.

### 5.4 Lesson strength and visual decay

- **Lesson strength** = mean `p` of the lesson's items (weighted by item importance; core items have weight 1.0, preview items 0.5).
- **Display:** 4 bars. 4 bars when strength is 0.85 or more; 3 bars from 0.70; 2 bars from 0.50; 1 bar below 0.50. A lesson with 2 bars or fewer shows a "cracked" icon and is suggested in the daily plan.
- **Unit strength** = mean lesson strength. A unit below 0.6 triggers a "unit refresh" suggestion (a 10-item review mixed from the whole unit).

### 5.5 Mastery levels

| Level | Requirement |
|---|---|
| 0 Locked / 1 Learned | The lesson is completed (every item correct at least once) |
| 2 Practiced | Every item has `h` of 3 days or more |
| 3 Solid | Every item has `h` of 10 days or more, the last attempt had no hint, and the item was answered correctly in at least 2 separate sessions |
| 4 Mastered | Every item has `h` of 21 days or more, the last 3 attempts were correct, and at least one of them was in a timed "challenge" variant |
| 5 Fluent (optional) | Mastered, plus a transfer item passed: the same concept in an unfamiliar key, clef, register or genre (P3, generalization) |

- **Leech handling.** An item that is wrong 4 or more times in its last 8 attempts is marked a "leech". It gets a remedial micro-card (re-teaching with a different scaffold) and a return to the hinted version, and its partners in its confusable set are practiced next to it.
- **Testing out.** Passing a unit checkpoint at 90% or more without having done its lessons sets `h = 3 d` for each item tested (level 2), so the items still enter spaced review.
- **Switching genre.** Core items keep their state. Items from the new genre start at level 1 (`h = 1 d`) for completed lessons and are mixed into practice gradually (no more than 3 per session).

---

## 6. References

**Graded syllabi and curricula**
- ABRSM theory grades: overview and comparison with Trinity (key-signature, clef and meter progression by grade): [mymusictheory.com, ABRSM vs Trinity syllabus comparison](https://mymusictheory.com/exam-boards/abrsm-v-trinity-syllabus-comparison/); grade 6–8 harmonization and composition content: [mymusictheory.com, ABRSM Grade 7 figured bass](https://www.mymusictheory.com/learn-music-theory/for-students/grade-7/figured-bass-grade-7-abrsm).
- Trinity College London, *Theory of Music* grades (melody writing, harmonic concepts, form; composition from Grade 1): [trinitycollege.com, Theory of Music](https://www.trinitycollege.com/site/?id=1058).
- The Royal Conservatory (RCM), *Theory Syllabus, 2016 Edition* (Levels 5–8 rudiments; Level 9+ harmony; "half/whole step" terminology): [RCM Theory Syllabus 2016 Highlights (PDF)](https://admin.rcmusic.com/sites/default/files/files/RCM-Theory-Syllabus-2016-Highlights.pdf).
- musictheory.net lesson sequence (notation → rhythm → steps and accidentals → scales and key signatures → intervals → chords → diatonic harmony and progressions): [musictheory.net/lessons](https://www.musictheory.net/lessons).
- Gotham, M. et al., *Open Music Theory* (2nd ed.), phrase-level form (sentence, period, after Caplin), song forms, pop schemas, modal schemas: [Form part](https://viva.pressbooks.pub/openmusictheory/part/form/); [Four-chord schemas](https://viva.pressbooks.pub/openmusictheory/chapter/4-chord-schemas/); [Modal schemas](https://viva.pressbooks.pub/openmusictheory/chapter/modal-schemas/); [Phrase archetypes](https://viva.pressbooks.pub/openmusictheory/chapter/phrase-archetypes-unique-forms/).
- Caplin, W. E. (1998). *Classical Form: A Theory of Formal Functions for the Instrumental Music of Haydn, Mozart, and Beethoven.* Oxford University Press.
- Berklee Online songwriting curricula (verse/pre-chorus/chorus forms, bridges, hooks, prosody; Pat Pattison): [Songwriting Tools and Techniques](https://online.berklee.edu/courses/songwriting-tools-and-techniques); [Songwriting: Writing Hit Songs](https://online.berklee.edu/courses/songwriting-writing-hit-songs); [Pattison on prosody, *Sound on Sound*](https://www.soundonsound.com/techniques/pat-pattison-writing-better-lyrics).

**Popular-music harmony and form**
- Temperley, D. (2011). "The Cadential IV in Rock." *Music Theory Online* 17(1): [mtosmt.org](https://mtosmt.org/issues/mto.11.17.1/mto.11.17.1.temperley.html); and "Scalar Shift in Popular Music," *MTO* 17(4): [mtosmt.org](https://mtosmt.org/issues/mto.11.17.4/mto.11.17.4.temperley.html).
- Richards, M. (2017). "Tonal Ambiguity in Popular Music's Axis Progressions." *Music Theory Online* 23(3).
- *Open Music Theory* (1st ed.), plagal and double-plagal progressions in pop and rock: [LibreTexts](https://human.libretexts.org/Bookshelves/Music/Music_Theory/Open_Music_Theory_1e_(Wharton_and_Shaffer_Eds)/08%3A_Pop/8.01%3A_Pop_Rock_Music/8.1.09%3A_Harmony_-_Plagal_Progressions).
- Carter, P. (2025). "Beyond Strophic: Prolonged Refrains, Choruses, and Bridges in the Blues, 1923–1966." *Music Theory Online* 31(1): [mtosmt.org](https://www.mtosmt.org/issues/mto.25.31.1/mto.25.31.1.carter.php).

**Pedagogy and learning science**
- Kodály approach, "sound before symbol" and prepare, present, practice: [Wichita State University, *A Kodály Sequence* (PDF)](https://wichita.edu/academics/fine_arts/music/kodaly/documents/G_2009_Wichita_A_KODALY_SEQUENCE_FINAL.pdf).
- Gordon, E. E. *Learning Sequences in Music: A Contemporary Music Learning Theory* (GIA). Summary of the skill learning sequence: [Wikipedia, Gordon music learning theory](https://en.wikipedia.org/wiki/Gordon_music_learning_theory).
- Settles, B. & Meeder, B. (2016). "A Trainable Spaced Repetition Model for Language Learning." *ACL 2016*, 1848–1858: [aclanthology.org/P16-1174](https://aclanthology.org/P16-1174).
- Wong, S. S. H., Chen, S. & Lim, S. W. H. (2021). "Learning melodic musical intervals: To block or to interleave?" *Psychology of Music*: [SMU repository](https://ink.library.smu.edu.sg/soss_research/4316).
- Pavlik, P. et al. (2013). "Modeling and optimizing forgetting and spacing effects during musical interval training." *EDM 2013*: [Memphis Digital Commons](https://digitalcommons.memphis.edu/facpubs/8219).
- Carter, C. E. & Grahn, J. A. (2016). "Optimizing Music Learning: Exploring How Blocked and Interleaved Practice Schedules Affect Advanced Performance." *Frontiers in Psychology* 7:1251: [frontiersin.org](https://www.frontiersin.org/articles/10.3389/fpsyg.2016.01251/full).
- Wood, D., Bruner, J. S. & Ross, G. (1976). "The role of tutoring in problem solving." *Journal of Child Psychology and Psychiatry* 17(2) (scaffolding).
- Bloom, B. S. (1968). "Learning for Mastery." *Evaluation Comment* 1(2).
