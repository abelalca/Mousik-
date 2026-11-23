import { useState } from 'react'
import type { CreateStep } from '@/content/types'
import { playTimeline } from '@/lib/audio'
import { useT, type UiKey } from '@/lib/i18n'
import { noteName } from '@/lib/music'
import { REGISTERS, SONG_BPM, slotValue, songEvents, withSlot, type Register, type Song } from '@/lib/song'
import { useStore } from '@/store/useStore'
import { Mascot } from './Mascot'
import { RichText, useRich } from './RichText'
import { Staff } from './Staff'
import { Note, Speaker } from './Icons'

const REG_LABEL: Record<Register, UiKey> = { low: 'regLow', mid: 'regMid', high: 'regHigh' }
/** Used to preview registers before the learner has any notes. */
const DEMO_MOTIF = ['C4', 'E4', 'G4', 'C5']

/** Song with `value` placed in the step's slot, plus a demo melody if there is nothing to hear yet. */
function preview(song: Song, step: CreateStep, value: string): Song {
  let s = withSlot(song, step.slot, value)
  if (!s.motif.some(Boolean)) s = { ...s, motif: step.slot.kind === 'bass-note' ? s.motif : [...DEMO_MOTIF] }
  return s
}

/**
 * The creative step at the end of a lesson: pick one part of your song.
 * Tapping a choice plays the song with it; nothing is graded and no hearts are lost.
 */
export function CreateStepView({
  step,
  onSave,
  footer = 'fixed',
}: {
  step: CreateStep
  onSave: (value: string) => void
  footer?: 'fixed' | 'inline'
}) {
  const { t, tl } = useT()
  const { inline } = useRich()
  const song = useStore((s) => s.song)
  const { genre, notation } = useStore((s) => s.settings)
  const [selected, setSelected] = useState<string | undefined>(() => slotValue(song, step.slot))

  const options =
    step.slot.kind === 'register'
      ? REGISTERS.map((r) => ({ value: r, label: t(REG_LABEL[r]) }))
      : (step.options ?? []).map((n) => ({ value: n, label: noteName(n, notation) }))

  function choose(value: string) {
    setSelected(value)
    const s = preview(song, step, value)
    playTimeline(songEvents(s, genre, { repeats: 1 }), SONG_BPM)
  }

  // Staff: the melody so far with the candidate highlighted (or the low note in bass clef).
  let staff: { clef: 'treble' | 'bass'; notes: string[]; highlight?: number } | null = null
  if (step.show === 'staff') {
    if (step.slot.kind === 'bass-note') staff = { clef: 'bass', notes: [selected ?? step.options![0]], highlight: selected ? 0 : undefined }
    else if (step.slot.kind === 'motif-note') {
      const idx = step.slot.index
      const motif = song.motif.map((n, i) => (i === idx ? selected ?? null : n))
      const notes = motif.filter((n): n is string => !!n)
      staff = notes.length ? { clef: 'treble', notes, highlight: selected ? motif.slice(0, idx).filter(Boolean).length : undefined } : null
    }
  }

  const button = (
    <button className="btn-primary w-full" disabled={!selected} onClick={() => selected && onSave(selected)}>
      {t('addToSong')}
    </button>
  )

  return (
    <div className="pt-2 space-y-6">
      <div className="flex items-end gap-3">
        <Mascot mood={selected ? 'happy' : 'think'} size={72} />
        <div className="pb-2">
          <span className="chip bg-accent2/15 text-accent2 text-xs uppercase tracking-wider">
            <Note size={14} /> {t('yourSong')}
          </span>
          <h1 className="text-2xl sm:text-[28px] font-bold leading-snug mt-1">{inline(tl(step.prompt))}</h1>
        </div>
      </div>
      {step.tip && <RichText text={tl(step.tip)} className="text-[15px] text-muted" />}
      {staff && <Staff clef={staff.clef} notes={staff.notes} highlight={staff.highlight} />}
      <div className={`grid gap-3 ${options.length === 4 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
        {options.map((o) => (
          <button key={o.value} className="option text-center" data-state={selected === o.value ? 'selected' : 'idle'} onClick={() => choose(o.value)}>
            <span className="flex items-center justify-center gap-2 text-xl font-display font-bold">
              <Speaker size={18} className="opacity-60" /> {o.label}
            </span>
          </button>
        ))}
      </div>
      <p className="text-center text-sm text-muted">{t('noWrongAnswers')}</p>
      {footer === 'inline' ? (
        button
      ) : (
        <div className="fixed bottom-0 inset-x-0 z-20 bg-bg/90 backdrop-blur border-t border-line safe-bottom">
          <div className="max-w-2xl mx-auto px-4 py-4">{button}</div>
        </div>
      )}
    </div>
  )
}
