import * as Tone from 'tone'

let sampler: Tone.Sampler | null = null
let fallback: Tone.PolySynth | null = null
let loaded = false
let muted = false

export function setMuted(m: boolean) {
  muted = m
}

/** Lazily creates a real piano (Salamander Grand samples) with a soft synth fallback while it loads. */
async function ensure() {
  if (Tone.getContext().state !== 'running') await Tone.start()
  if (!sampler) {
    const reverb = new Tone.Reverb({ decay: 2.2, wet: 0.18 }).toDestination()
    fallback = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.4, sustain: 0.2, release: 1 },
      volume: -10,
    }).connect(reverb)
    sampler = new Tone.Sampler({
      urls: {
        A0: 'A0.mp3', C1: 'C1.mp3', 'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3', A1: 'A1.mp3',
        C2: 'C2.mp3', 'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3', A2: 'A2.mp3',
        C3: 'C3.mp3', 'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3', A3: 'A3.mp3',
        C4: 'C4.mp3', 'D#4': 'Ds4.mp3', 'F#4': 'Fs4.mp3', A4: 'A4.mp3',
        C5: 'C5.mp3', 'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3', A5: 'A5.mp3',
        C6: 'C6.mp3', 'D#6': 'Ds6.mp3', 'F#6': 'Fs6.mp3', A6: 'A6.mp3',
        C7: 'C7.mp3', 'D#7': 'Ds7.mp3', 'F#7': 'Fs7.mp3', A7: 'A7.mp3', C8: 'C8.mp3',
      },
      release: 1.2,
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
      onload: () => (loaded = true),
    }).connect(reverb)
  }
}

/** Warm up audio on first user gesture so the first note isn't delayed. */
export function warmUp() {
  ensure().catch(() => {})
}

export async function playNote(note: string, duration = 1.2, when = 0) {
  if (muted) return
  await ensure()
  const t = Tone.now() + when
  if (loaded) sampler!.triggerAttackRelease(note, duration, t)
  else fallback!.triggerAttackRelease(note, Math.min(duration, 0.8), t)
}

/** Plays notes one after another (melodic). */
export async function playSequence(notes: string[], gap = 0.7) {
  for (let i = 0; i < notes.length; i++) await playNote(notes[i], 1, i * gap)
}

/** Plays notes together (harmonic). */
export async function playChord(notes: string[], duration = 1.6) {
  for (const n of notes) await playNote(n, duration)
}

export async function playFeedback(ok: boolean) {
  if (muted) return
  await ensure()
  const t = Tone.now()
  const s = loaded ? sampler! : fallback!
  if (ok) {
    s.triggerAttackRelease('E5', 0.25, t, 0.5)
    s.triggerAttackRelease('A5', 0.5, t + 0.09, 0.5)
  } else {
    s.triggerAttackRelease('C3', 0.3, t, 0.35)
    s.triggerAttackRelease('F#3', 0.4, t + 0.02, 0.3)
  }
}
