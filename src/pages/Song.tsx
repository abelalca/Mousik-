import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { allLessons } from '@/content/course'
import type { CreateStep } from '@/content/types'
import { useT, type UiKey } from '@/lib/i18n'
import { noteName } from '@/lib/music'
import { hasAnything, slotKey, slotValue, type Register } from '@/lib/song'
import { useStore } from '@/store/useStore'
import { Mascot } from '@/components/Mascot'
import { Staff } from '@/components/Staff'
import { CreateStepView } from '@/components/CreateStep'
import { useSongPlayer } from '@/components/SongPlayer'
import { useRich } from '@/components/RichText'
import { Check, Lock, Note, Play, X } from '@/components/Icons'
import { CHARACTERS, Character, type CharacterId } from '@/components/characters'
import { BAND, PART_PLAYER, isInBand, unitNumber } from '@/content/band'
import { songEvents } from '@/lib/song'

const REG_LABEL: Record<Register, UiKey> = { low: 'regLow', mid: 'regMid', high: 'regHigh' }

/** "My song": everything the learner has created so far, and Mo playing it. */
export default function SongPage() {
  const { t, tl } = useT()
  const { plain } = useRich()
  const song = useStore((s) => s.song)
  const notation = useStore((s) => s.settings.notation)
  const completed = useStore((s) => s.progress.completed)
  const setSongSlot = useStore((s) => s.setSongSlot)
  const { play, playing } = useSongPlayer()
  const [editing, setEditing] = useState<CreateStep | null>(null)
  const genre = useStore((s) => s.settings.genre)
  // Layers: one per musician; tap to mute/unmute.
  const [muted, setMuted] = useState<Set<CharacterId>>(new Set())
  const withParts = new Set(songEvents(song, genre, { repeats: 1 }).map((e) => PART_PLAYER[e.part]))
  const toggle = (id: CharacterId) =>
    setMuted((m) => {
      const n = new Set(m)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  const steps = allLessons.filter((l) => l.create).map((l) => ({ lesson: l, step: l.create! }))
  const melody = song.motif.filter((n): n is string => !!n)

  const label = (step: CreateStep) =>
    step.slot.kind === 'register' ? t('slotRegister') : step.slot.kind === 'bass-note' ? t('slotBass') : `${t('slotNote')} ${step.slot.index + 1}`
  const display = (step: CreateStep) => {
    const v = slotValue(song, step.slot)
    if (!v) return null
    return step.slot.kind === 'register' ? t(REG_LABEL[v as Register]) : noteName(v, notation)
  }

  return (
    <div className="pt-6 space-y-6">
      <section className="hero-bg rounded-card p-5 text-white shadow-lift flex items-center gap-4">
        <div className="shrink-0 bg-white/15 rounded-card p-1">
          <Mascot mood={playing ? 'celebrate' : 'idle'} size={84} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-[.18em] opacity-80 font-semibold">{t('yourSong')}</p>
          <h1 className="text-2xl font-bold mt-1">{t('mySong')}</h1>
          <p className="text-sm opacity-85 mt-1">{t('songIntro')}</p>
        </div>
      </section>

      {hasAnything(song) ? (
        <section className="card p-4 space-y-3">
          {melody.length > 0 && <Staff clef="treble" notes={melody} labels />}
          <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={() => play(song, 2, muted)} disabled={playing}>
            <Play size={18} /> {playing ? t('playing') : t('listenSong')}
          </button>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted font-semibold">{t('layers')}</p>
            <p className="text-xs text-muted">{t('layersHint')}</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
              {BAND.map((m) => {
                const inBand = isInBand(m, completed)
                const on = inBand && withParts.has(m.id) && !muted.has(m.id)
                const color = CHARACTERS[m.id].color
                return (
                  <button
                    key={m.id}
                    disabled={!inBand || !withParts.has(m.id)}
                    onClick={() => toggle(m.id)}
                    className="rounded-card border-2 p-1.5 flex flex-col items-center gap-0.5 transition disabled:opacity-50"
                    style={{ borderColor: on ? color : 'rgb(var(--line))', background: on ? `color-mix(in srgb, ${color} 12%, transparent)` : undefined, color: 'rgb(var(--muted))' }}
                    aria-pressed={on}
                  >
                    <Character id={m.id} size={44} silhouette={!inBand} playing={on && playing} />
                    <span className="text-[11px] font-semibold text-ink">{CHARACTERS[m.id].name}</span>
                    <span className="text-[10px] text-muted">
                      {!inBand ? `${t('unit')} ${unitNumber(m.joinsUnit!)}` : muted.has(m.id) ? t('muted') : ''}
                    </span>
                    <span className="h-1 w-8 rounded-full" style={{ background: on ? color : 'transparent' }} />
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      ) : (
        <p className="card p-5 text-center text-muted">{t('songEmpty')}</p>
      )}

      <section className="space-y-2">
        {steps.map(({ lesson, step }) => {
          const value = display(step)
          const lessonDone = !!completed[lesson.id]
          return (
            <div key={slotKey(step.slot)} className="card p-3 flex items-center gap-3">
              <span className={`w-10 h-10 rounded-full grid place-items-center shrink-0 ${value ? 'bar-bg text-white' : 'bg-raised text-muted'}`}>
                {value ? <Check size={20} /> : lessonDone ? <Note size={18} /> : <Lock size={16} />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wide text-muted font-semibold">{label(step)}</p>
                <p className="font-display text-lg font-bold leading-tight">{value ?? <span className="text-muted font-sans text-sm font-normal">{t('songPending')}</span>}</p>
                <p className="text-xs text-muted truncate">
                  {t('createdIn')}: {plain(tl(lesson.title))}
                </p>
              </div>
              {/* Lessons finished before songs existed (or to change your mind): create it here. */}
              {lessonDone && (
                <button className={value ? 'btn-ghost !px-3 !py-2 text-sm' : 'btn-primary !px-3 !py-2 text-sm'} onClick={() => setEditing(step)}>
                  {value ? '✎' : t('createNow')}
                </button>
              )}
            </div>
          )
        })}
      </section>

      <p className="text-center text-sm text-muted pb-4">{t('songNextUnit')}</p>

      <AnimatePresence>
        {editing && (
          <motion.div className="fixed inset-0 z-40 bg-black/40 grid place-items-end sm:place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditing(null)}>
            <motion.div
              className="card w-full sm:max-w-lg p-5 rounded-b-none sm:rounded-card max-h-[92vh] overflow-y-auto relative"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="absolute top-3 right-3 text-muted hover:text-ink" onClick={() => setEditing(null)} aria-label={t('cancel')}>
                <X size={22} />
              </button>
              <CreateStepView
                step={editing}
                footer="inline"
                onSave={(v) => {
                  setSongSlot(editing.slot, v)
                  setEditing(null)
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
