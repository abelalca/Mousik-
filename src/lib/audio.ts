import type * as ToneNS from 'tone'
import manifest from '../../public/samples/manifest.json'
import { INSTRUMENTS, fitGroup, fitNote, type InstrumentId } from './instruments'
import { midi } from './music'

export { fitGroup, fitNote, resolveInstrument } from './instruments'

/**
 * Multi-instrument audio engine.
 * - Sample-based instruments (self-hosted, CC-BY 3.0) load lazily the first time they are used.
 * - Pop synths and the drum kit are synthesized with Tone.js (no downloads).
 * - Notes outside an instrument's range are moved by octaves so they always sound natural.
 */

let muted = false
export function setMuted(m: boolean) {
  muted = m
}

interface Voice {
  play: (note: string | string[], dur: number, time: number, vel?: number) => void
  loaded: Promise<void>
}

const voices = new Map<InstrumentId, Voice>()
let master: ToneNS.Reverb | null = null
// Tone.js (~65 KB gzip) is loaded on the first sound, not before the first screen.
let Tone: typeof ToneNS
let toneLoading: Promise<typeof ToneNS> | null = null

async function ctx() {
  if (!Tone) Tone = await (toneLoading ??= import('tone'))
  if (Tone.getContext().state !== 'running') await Tone.start()
  if (!master) master = new Tone.Reverb({ decay: 2.4, wet: 0.2 }).toDestination()
  return master
}

const BASE = `${import.meta.env.BASE_URL}samples/`
const sampleUrls = manifest as Record<string, Record<string, string>>

function sampler(folder: string, out: ToneNS.ToneAudioNode, opts: Partial<ToneNS.SamplerOptions> = {}) {
  let resolve!: () => void
  const loaded = new Promise<void>((r) => (resolve = r))
  const s = new Tone.Sampler({ urls: sampleUrls[folder], baseUrl: `${BASE}${folder}/`, release: 1, onload: () => resolve(), ...opts }).connect(out)
  return { s, loaded }
}

function build(id: InstrumentId, out: ToneNS.ToneAudioNode): Voice {
  const ready = Promise.resolve()
  switch (id) {
    case 'guitar-distortion': {
      const dist = new Tone.Distortion(0.75)
      const tone = new Tone.Filter(3200, 'lowpass')
      const cab = new Tone.Filter(120, 'highpass')
      const vol = new Tone.Volume(-9)
      dist.chain(cab, tone, vol, out)
      const { s, loaded } = sampler('guitar-electric', dist, { release: 0.6 })
      return { loaded, play: (n, d, t, v = 0.9) => s.triggerAttackRelease(n, d, t, v) }
    }
    case 'guitar-electric': {
      const chorus = new Tone.Chorus(2.5, 2, 0.3).start()
      chorus.connect(out)
      const { s, loaded } = sampler('guitar-electric', chorus)
      return { loaded, play: (n, d, t, v = 0.8) => s.triggerAttackRelease(n, d, t, v) }
    }
    case 'epiano': {
      const trem = new Tone.Tremolo(4, 0.25).start().connect(out)
      const synth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 3.01,
        modulationIndex: 10,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.002, decay: 1.6, sustain: 0.15, release: 1.2 },
        modulation: { type: 'sine' },
        modulationEnvelope: { attack: 0.002, decay: 0.4, sustain: 0, release: 0.4 },
        volume: -14,
      }).connect(trem)
      return { loaded: ready, play: (n, d, t, v = 0.8) => synth.triggerAttackRelease(n, d, t, v) }
    }
    case 'synth-lead': {
      const delay = new Tone.FeedbackDelay('8n.', 0.22).connect(out)
      const synth = new Tone.PolySynth(Tone.MonoSynth, {
        oscillator: { type: 'sawtooth' },
        filter: { Q: 2, type: 'lowpass', rolloff: -24 },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.6, release: 0.3 },
        filterEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.4, baseFrequency: 500, octaves: 3.2 },
        volume: -17,
      }).connect(delay)
      return { loaded: ready, play: (n, d, t, v = 0.8) => synth.triggerAttackRelease(n, d, t, v) }
    }
    case 'synth-pad': {
      const chorus = new Tone.Chorus(0.6, 3.5, 0.6).start().connect(out)
      const filter = new Tone.Filter(1800, 'lowpass').connect(chorus)
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'fatsawtooth', count: 3, spread: 28 },
        envelope: { attack: 0.35, decay: 0.5, sustain: 0.8, release: 1.6 },
        volume: -22,
      }).connect(filter)
      return { loaded: ready, play: (n, d, t, v = 0.7) => synth.triggerAttackRelease(n, Math.max(d, 1), t, v) }
    }
    case 'drums': {
      const vol = new Tone.Volume(-6).connect(out)
      const kick = new Tone.MembraneSynth({ pitchDecay: 0.04, octaves: 6, envelope: { attack: 0.001, decay: 0.4, sustain: 0 } }).connect(vol)
      const snare = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.001, decay: 0.18, sustain: 0 }, volume: -8 }).connect(vol)
      const hat = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.06, release: 0.01 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5, volume: -24 }).connect(vol)
      hat.frequency.value = 250
      // pitch → drum piece: below C3 kick, C3–B3 snare, C4+ hi-hat
      return {
        loaded: ready,
        play: (n, _d, t, v = 0.9) => {
          for (const note of Array.isArray(n) ? n : [n]) {
            const m = midi(note)
            if (m < 48) kick.triggerAttackRelease('C1', '8n', t, v)
            else if (m < 60) snare.triggerAttackRelease('16n', t, v)
            else hat.triggerAttackRelease('32n', t, v * 0.7)
          }
        },
      }
    }
    default: {
      const inst = INSTRUMENTS[id]
      const { s, loaded } = sampler(inst.samples!, out, id === 'piano' ? { release: 1.2 } : { release: 0.8 })
      return { loaded, play: (n, d, t, v = 0.85) => s.triggerAttackRelease(n, d, t, v) }
    }
  }
}

async function voice(id: InstrumentId): Promise<Voice> {
  const out = await ctx()
  let v = voices.get(id)
  if (!v) {
    v = build(id, out)
    voices.set(id, v)
  }
  // Wait for samples (max 6 s) so a listening exercise never plays the wrong timbre.
  await Promise.race([v.loaded, new Promise((r) => setTimeout(r, 6000))])
  return v
}

/** Start downloading instruments ahead of time (e.g. when a lesson opens). */
export function preload(ids: InstrumentId[]) {
  ctx()
    .then(() => ids.forEach((id) => voice(id)))
    .catch(() => {})
}
export const warmUp = () => preload(['piano'])

// ---------- playback ----------

export async function playNote(note: string, duration = 1.2, when = 0, id: InstrumentId = 'piano') {
  if (muted) return
  const v = await voice(id)
  v.play(fitNote(note, id), duration, Tone.now() + when)
}

/** Plays notes one after another (melodic). Notes are moved together into the instrument's range. */
export async function playSequence(notes: string[], gap = 0.7, id: InstrumentId = 'piano') {
  if (muted) return
  const v = await voice(id)
  const t = Tone.now() + 0.02
  fitGroup(notes, id).forEach((n, i) => v.play(n, Math.max(gap * 1.4, 0.8), t + i * gap))
}

/** Plays notes together (harmonic). */
export async function playChord(notes: string[], duration = 1.6, id: InstrumentId = 'piano') {
  if (muted) return
  const v = await voice(id)
  v.play(fitGroup(notes, id), duration, Tone.now() + 0.02)
}

/** [notes (string or chord), start beat, length in beats] */
type Ev = [string | string[], number, number]
const PHRASES: Partial<Record<InstrumentId, { bpm: number; ev: Ev[] }>> = {
  piano: { bpm: 96, ev: [[['C3', 'G3'], 0, 2], ['E4', 0, 1], ['G4', 1, 1], [['F3', 'C4'], 2, 2], ['A4', 2, 1], ['G4', 3, 1], [['G3', 'D4'], 4, 2], ['B4', 4, 1], ['D5', 5, 1], [['C3', 'C4', 'E4', 'G4', 'C5'], 6, 3]] },
  violin: { bpm: 80, ev: [['A4', 0, 1], ['C#5', 1, 1], ['E5', 2, 2.5], ['D5', 4.5, 0.5], ['C#5', 5, 1], ['B4', 6, 1], ['A4', 7, 2]] },
  cello: { bpm: 72, ev: [['G2', 0, 2], ['D3', 2, 1], ['B3', 3, 1], ['A3', 4, 2], ['G3', 6, 1], ['D3', 7, 2]] },
  contrabass: { bpm: 100, ev: [['E2', 0, 1], ['G2', 1, 1], ['A2', 2, 1], ['B2', 3, 1], ['C3', 4, 1], ['B2', 5, 1], ['A2', 6, 1], ['E2', 7, 1.5]] },
  flute: { bpm: 112, ev: [['D5', 0, 0.5], ['E5', 0.5, 0.5], ['F#5', 1, 0.5], ['A5', 1.5, 0.5], ['D6', 2, 1.5], ['B5', 3.5, 0.5], ['A5', 4, 1], ['F#5', 5, 1], ['D5', 6, 2]] },
  clarinet: { bpm: 92, ev: [['G3', 0, 1], ['B3', 1, 0.5], ['D4', 1.5, 0.5], ['G4', 2, 1.5], ['F4', 3.5, 0.5], ['E4', 4, 1], ['D4', 5, 1], ['G4', 6, 2]] },
  bassoon: { bpm: 120, ev: [['C3', 0, 0.5], ['C3', 1, 0.5], ['G2', 1.5, 0.5], ['C3', 2, 0.5], ['E3', 3, 0.5], ['G3', 4, 0.5], ['E3', 5, 0.5], ['C3', 6, 1.5]] },
  trumpet: { bpm: 108, ev: [['G4', 0, 0.75], ['G4', 0.75, 0.25], ['C5', 1, 1], ['E5', 2, 1], ['G5', 3, 2], ['E5', 5, 0.75], ['G5', 5.75, 0.25], ['C6', 6, 2]] },
  'french-horn': { bpm: 76, ev: [['C3', 0, 1], ['G3', 1, 1], ['C4', 2, 2], ['E4', 4, 1], ['D4', 5, 1], ['C4', 6, 2]] },
  harp: { bpm: 100, ev: [['C3', 0, 3], ['G3', 0.25, 3], ['C4', 0.5, 3], ['E4', 0.75, 3], ['G4', 1, 3], ['C5', 1.25, 3], ['E5', 1.5, 3], ['G5', 1.75, 3], ['C6', 2, 3]] },
  epiano: { bpm: 84, ev: [[['F3', 'A3', 'C4', 'E4'], 0, 2], [['E3', 'G3', 'B3', 'D4'], 2, 2], [['D3', 'F3', 'A3', 'C4'], 4, 2], [['C3', 'E3', 'G3', 'B3'], 6, 2.5]] },
  'synth-lead': { bpm: 118, ev: [['E5', 0, 0.5], ['G5', 0.5, 0.5], ['A5', 1, 1], ['G5', 2, 0.5], ['E5', 2.5, 0.5], ['D5', 3, 1], ['E5', 4, 0.5], ['G5', 4.5, 0.5], ['B5', 5, 0.5], ['A5', 5.5, 2]] },
  'synth-pad': { bpm: 90, ev: [[['C3', 'G3', 'E4', 'B4'], 0, 4], [['A2', 'E3', 'C4', 'G4'], 4, 4]] },
  'guitar-acoustic': { bpm: 100, ev: [[['G2', 'B2', 'D3', 'G3', 'B3', 'G4'], 0, 1.5], [['G2', 'B2', 'D3', 'G3', 'B3', 'G4'], 1.5, 0.5], [['G2', 'B2', 'D3', 'G3', 'B3', 'G4'], 2, 1], [['C3', 'E3', 'G3', 'C4', 'E4'], 3, 1.5], [['C3', 'E3', 'G3', 'C4', 'E4'], 4.5, 0.5], [['D3', 'A3', 'D4', 'F#4'], 5, 1], [['G2', 'B2', 'D3', 'G3', 'B3', 'G4'], 6, 2]] },
  'guitar-electric': { bpm: 96, ev: [['A2', 0, 1], ['E3', 0.5, 1], ['A3', 1, 1], ['C4', 1.5, 1], ['E4', 2, 1], ['C4', 2.5, 1], ['A3', 3, 1], ['E3', 3.5, 1], ['F2', 4, 1], ['C3', 4.5, 1], ['F3', 5, 1], ['A3', 5.5, 1], ['C4', 6, 2]] },
  'guitar-distortion': { bpm: 124, ev: [[['E2', 'B2', 'E3'], 0, 0.5], [['E2', 'B2', 'E3'], 0.5, 0.5], [['G2', 'D3', 'G3'], 1, 0.75], [['A2', 'E3', 'A3'], 2, 0.75], [['E2', 'B2', 'E3'], 3, 0.5], [['E2', 'B2', 'E3'], 3.5, 0.5], [['A#2', 'F3', 'A#3'], 4, 0.5], [['A2', 'E3', 'A3'], 4.5, 1.5]] },
  'bass-electric': { bpm: 110, ev: [['E2', 0, 0.5], ['E2', 0.75, 0.25], ['G2', 1, 0.5], ['A2', 1.5, 0.5], ['E2', 2, 0.5], ['D3', 2.5, 0.5], ['B2', 3, 1], ['E2', 4, 0.5], ['G2', 4.5, 0.5], ['A2', 5, 1]] },
  organ: { bpm: 100, ev: [[['C3', 'G3', 'C4', 'E4'], 0, 1.5], [['A#2', 'F3', 'A#3', 'D4'], 1.5, 0.5], [['F2', 'F3', 'A3', 'C4'], 2, 2], [['C3', 'G3', 'C4', 'E4'], 4, 3]] },
  drums: { bpm: 104, ev: [0, 1, 2, 3, 4, 5, 6, 7].flatMap((b): Ev[] => [['C5', b * 0.5, 0.25], ...(b % 4 === 0 ? [['C1', b * 0.5, 0.25] as Ev] : []), ...(b % 4 === 2 ? [['D3', b * 0.5, 0.25] as Ev] : [])]).concat([['C1', 3.5, 0.25], ['C5', 4, 0.25], ['C1', 4, 0.25]]) },
}

/** Plays a short, characteristic phrase so the learner hears the instrument's personality. */
export async function playPhrase(id: InstrumentId) {
  if (muted) return
  const p = PHRASES[id] ?? PHRASES.piano!
  const v = await voice(id)
  const beat = 60 / p.bpm
  const t = Tone.now() + 0.05
  for (const [n, start, len] of p.ev) v.play(Array.isArray(n) ? fitGroup(n, id) : fitNote(n, id), len * beat * 1.1, t + start * beat)
}

export async function playFeedback(ok: boolean) {
  if (muted) return
  const v = await voice('piano')
  const t = Tone.now()
  if (ok) {
    v.play('E5', 0.25, t, 0.45)
    v.play('A5', 0.5, t + 0.09, 0.45)
  } else {
    v.play('C3', 0.3, t, 0.3)
    v.play('F#3', 0.4, t + 0.02, 0.25)
  }
}

const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000))

/** Plays clips one after another (e.g. "instrument 1, then instrument 2"). */
export async function playClips(clips: { notes: string[]; mode: 'seq' | 'chord' | 'phrase'; instrument: InstrumentId }[]) {
  for (const [i, c] of clips.entries()) {
    if (i > 0) await sleep(0.35)
    if (c.mode === 'phrase') {
      await playPhrase(c.instrument)
      await sleep(3)
    } else if (c.mode === 'chord') {
      await playChord(c.notes, 1.6, c.instrument)
      await sleep(1.6)
    } else {
      await playSequence(c.notes, 0.75, c.instrument)
      await sleep(c.notes.length * 0.75 + 0.4)
    }
  }
}

/** A sound placed on a timeline, in beats. */
export interface TimelineEvent {
  instrument: InstrumentId
  notes: string | string[]
  beat: number
  len: number
}

/**
 * Plays a multi-instrument timeline (e.g. the learner's song). All instruments are loaded first
 * so every part starts together. Resolves when the last note has finished.
 */
export async function playTimeline(events: TimelineEvent[], bpm: number) {
  if (muted || !events.length) return
  const ids = [...new Set(events.map((e) => e.instrument))]
  const vs = new Map(await Promise.all(ids.map(async (id) => [id, await voice(id)] as const)))
  const beat = 60 / bpm
  const t = Tone.now() + 0.08
  let end = 0
  for (const e of events) {
    const notes = Array.isArray(e.notes) ? fitGroup(e.notes, e.instrument) : fitNote(e.notes, e.instrument)
    vs.get(e.instrument)!.play(notes, e.len * beat, t + e.beat * beat)
    end = Math.max(end, (e.beat + e.len) * beat)
  }
  await sleep(end + 0.3)
}
