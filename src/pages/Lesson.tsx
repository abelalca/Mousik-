import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { findLesson, isUnlocked } from '@/content/course'
import type { Exercise } from '@/content/types'
import { buildQuestion, type Question } from '@/exercises/build'
import { useT } from '@/lib/i18n'
import { useStore, liveStreak } from '@/store/useStore'
import { playChord, playFeedback, playSequence, warmUp } from '@/lib/audio'
import { midi } from '@/lib/music'
import { Mascot, type Mood } from '@/components/Mascot'
import { RichText, useRich } from '@/components/RichText'
import { Demo } from '@/components/Demo'
import { Piano, type KeyMark } from '@/components/Piano'
import { Bolt, Bulb, Check, Flame, Heart, Speaker, Star, X } from '@/components/Icons'

type Status = 'idle' | 'correct' | 'wrong'
interface Item {
  uid: number
  ex: Exercise
  retry: boolean
}

export default function LessonPage() {
  const { id = '' } = useParams()
  const lesson = findLesson(id)
  const nav = useNavigate()
  const { t, tl, locale } = useT()
  const { notation, genre } = useStore((s) => s.settings)
  const progress = useStore((s) => s.progress)
  const loseHeart = useStore((s) => s.loseHeart)
  const completeLesson = useStore((s) => s.completeLesson)

  const [phase, setPhase] = useState<'theory' | 'practice' | 'done'>('theory')
  const [card, setCard] = useState(0)
  const [queue, setQueue] = useState<Item[]>(() => lesson?.exercises.map((ex, i) => ({ uid: i, ex, retry: false })) ?? [])
  const [pos, setPos] = useState(0)
  const [solved, setSolved] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [firstTryWrong, setFirstTryWrong] = useState<Set<number>>(new Set())
  const [selected, setSelected] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [marks, setMarks] = useState<Record<number, KeyMark>>({})
  const [confirmQuit, setConfirmQuit] = useState(false)
  const [result, setResult] = useState<{ xp: number; accuracy: number } | null>(null)

  useEffect(() => warmUp(), [])

  const item = queue[pos]
  const q: Question | null = useMemo(
    () => (item ? buildQuestion(item.ex, locale, notation) : null),
    // rebuild only when the item changes (keeps shuffled options stable)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item?.uid, item?.retry, pos, locale, notation],
  )

  // Auto-play audio prompts when a listening exercise appears.
  useEffect(() => {
    if (phase === 'practice' && q?.audio) playAudio(q.audio)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, pos])

  if (!lesson) return <Navigate to="/" replace />
  if (!isUnlocked(lesson.id, progress.completed)) return <Navigate to="/" replace />

  const total = lesson.exercises.length
  const cardsN = lesson.cards.length
  const pct = phase === 'theory' ? (card / (cardsN + total)) * 100 : phase === 'practice' ? ((cardsN + solved) / (cardsN + total)) * 100 : 100

  function playAudio(a: { notes: string[]; mode?: 'seq' | 'chord' }) {
    if (a.mode === 'chord') playChord(a.notes)
    else playSequence(a.notes, 0.75)
  }

  function grade(ok: boolean) {
    setStatus(ok ? 'correct' : 'wrong')
    playFeedback(ok)
    if (ok) setSolved((s) => s + 1)
    else {
      setMistakes((m) => m + 1)
      if (!item.retry) setFirstTryWrong((s) => new Set(s).add(item.uid))
      loseHeart()
      // Duolingo-style: missed exercises come back at the end of the lesson.
      setQueue((qq) => [...qq, { ...item, retry: true }])
    }
  }

  function check() {
    if (!q || q.kind !== 'options' || selected === null) return
    grade(!!q.options.find((o) => o.key === selected)?.correct)
  }

  function onKey(_note: string, m: number) {
    if (!q || q.kind !== 'piano' || status !== 'idle') return
    const ok = q.isCorrect(m)
    const newMarks: Record<number, KeyMark> = { [m]: ok ? 'correct' : 'wrong' }
    if (!ok) newMarks[midi(q.target)] = 'hint'
    setMarks(newMarks)
    grade(ok)
  }

  function next() {
    const outOfHearts = useStore.getState().progress.hearts <= 0
    if (status === 'wrong' && outOfHearts) return
    setSelected(null)
    setStatus('idle')
    setMarks({})
    if (pos + 1 >= queue.length) finish()
    else setPos(pos + 1)
  }

  function finish() {
    const accuracy = Math.round(((total - firstTryWrong.size) / total) * 100)
    const xp = 10 + (firstTryWrong.size === 0 ? 5 : 0)
    completeLesson(lesson!.id, xp, accuracy)
    setResult({ xp, accuracy })
    setPhase('done')
  }

  const outOfHearts = progress.hearts <= 0 && status === 'wrong'
  const mood: Mood = status === 'correct' ? 'happy' : status === 'wrong' ? 'sad' : 'think'

  // ---------- RESULT ----------
  if (phase === 'done' && result) {
    const perfect = mistakes === 0
    return (
      <div className="min-h-full flex flex-col items-center justify-center px-6 py-10 text-center gap-6 max-w-md mx-auto">
        <Mascot mood="celebrate" size={170} />
        <div>
          <h1 className="text-4xl font-bold metal-text">{perfect ? t('perfect') : t('lessonComplete')}</h1>
          <p className="text-muted mt-2">{tl(lesson.title)}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 w-full">
          <ResultTile icon={<Bolt size={22} />} label={t('xpEarned')} value={`+${result.xp}`} tone="text-accent2" />
          <ResultTile icon={<Star size={22} />} label={t('accuracy')} value={`${result.accuracy}%`} tone="text-success" />
          <ResultTile icon={<Flame size={22} />} label={t('streak')} value={String(liveStreak(useStore.getState().progress))} tone="text-[#f59e0b]" />
        </div>
        <button className="btn-primary w-full mt-4" onClick={() => nav('/')}>
          {t('continue')}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-full flex flex-col max-w-2xl mx-auto">
      {/* header */}
      <div className="flex items-center gap-4 px-4 pt-5 pb-3">
        <button onClick={() => setConfirmQuit(true)} className="text-muted hover:text-ink" aria-label={t('quit')}>
          <X size={26} />
        </button>
        <div className="flex-1 h-3.5 rounded-full bg-raised overflow-hidden">
          <motion.div className="h-full rounded-full bar-bg" animate={{ width: `${Math.max(4, pct)}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
        </div>
        <span className="flex items-center gap-1 text-danger font-semibold">
          <Heart size={20} /> {progress.hearts}
        </span>
      </div>

      {/* body */}
      <div className="flex-1 px-4 pb-48">
        <AnimatePresence mode="wait">
          {phase === 'theory' ? (
            <motion.div key={`c${card}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
              <TheoryView lessonCard={lesson.cards[card]} genre={genre} />
            </motion.div>
          ) : (
            q && (
              <motion.div key={`q${pos}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <QuestionView q={q} retry={item.retry} selected={selected} status={status} onSelect={(k) => status === 'idle' && setSelected(k)} onKey={onKey} marks={marks} onPlay={playAudio} />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* footer */}
      <div className="fixed bottom-0 inset-x-0 z-20">
        <AnimatePresence>
          {status !== 'idle' && q && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className={`border-t ${status === 'correct' ? 'bg-success/10 border-success/30' : 'bg-danger/10 border-danger/30'} backdrop-blur-md`}
            >
              <div className="max-w-2xl mx-auto px-4 pt-4 flex gap-3 items-start">
                <div className="hidden sm:block -mt-2">
                  <Mascot mood={mood} size={64} />
                </div>
                <div className="flex-1">
                  <p className={`font-display text-2xl font-bold ${status === 'correct' ? 'text-success' : 'text-danger'}`}>
                    {status === 'correct' ? (pos % 3 === 2 ? t('correctAlt') : t('correct')) : t('wrong')}
                  </p>
                  {status === 'wrong' && (
                    <p className="text-sm mt-1">
                      <span className="text-muted">{t('answer')}: </span>
                      <RichInline text={q.correctLabel} />
                    </p>
                  )}
                  {q.explain && <RichText text={q.explain} className="text-sm text-muted mt-1" />}
                  {outOfHearts && <p className="text-sm text-danger font-semibold mt-2">{t('outOfHeartsBody')}</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className={`${status === 'idle' ? 'bg-bg/90 backdrop-blur border-t border-line' : status === 'correct' ? 'bg-success/10' : 'bg-danger/10'} safe-bottom`}>
          <div className="max-w-2xl mx-auto px-4 py-4">
            {phase === 'theory' ? (
              <button className="btn-primary w-full" onClick={() => (card + 1 < cardsN ? setCard(card + 1) : setPhase('practice'))}>
                {card + 1 < cardsN ? t('next') : t('gotIt')}
              </button>
            ) : status === 'idle' ? (
              q?.kind === 'options' ? (
                <button className="btn-primary w-full" disabled={selected === null} onClick={check}>
                  {t('check')}
                </button>
              ) : (
                <p className="text-center text-sm text-muted py-3.5">{t('tapToHear')}</p>
              )
            ) : outOfHearts ? (
              <button className="btn-primary w-full !bg-danger" onClick={() => nav('/')}>
                {t('backHome')}
              </button>
            ) : (
              <button className={`btn-primary w-full ${status === 'correct' ? '!bg-success' : '!bg-danger'} !text-white`} onClick={next}>
                {t('continue')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* quit dialog */}
      <AnimatePresence>
        {confirmQuit && (
          <motion.div className="fixed inset-0 z-40 bg-black/40 grid place-items-end sm:place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmQuit(false)}>
            <motion.div className="card w-full sm:max-w-sm p-6 text-center rounded-b-none sm:rounded-card" initial={{ y: 40 }} animate={{ y: 0 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center">
                <Mascot mood="sad" size={90} />
              </div>
              <h2 className="text-2xl font-bold mt-2">{t('quitTitle')}</h2>
              <p className="text-muted mt-1">{t('quitBody')}</p>
              <div className="flex flex-col gap-2 mt-5">
                <button className="btn-primary" onClick={() => setConfirmQuit(false)}>
                  {t('keepLearning')}
                </button>
                <button className="btn-ghost !text-danger" onClick={() => nav('/')}>
                  {t('quit')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function RichInline({ text }: { text: string }) {
  const { inline } = useRich()
  return <>{inline(text)}</>
}

function ResultTile({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <div className="card p-3 flex flex-col items-center gap-1">
      <span className={tone}>{icon}</span>
      <span className="text-2xl font-bold font-display">{value}</span>
      <span className="text-[11px] uppercase tracking-wide text-muted font-semibold">{label}</span>
    </div>
  )
}

function TheoryView({ lessonCard, genre }: { lessonCard: NonNullable<ReturnType<typeof findLesson>>['cards'][number]; genre: 'classical' | 'pop' | 'rock' }) {
  const { t, tl } = useT()
  const notation = useStore((s) => s.settings.notation)
  const { plain } = useRich()
  const extra = lessonCard.byNotation?.[notation]
  return (
    <div className="pt-2 space-y-5">
      <div className="flex items-end gap-3">
        <Mascot mood="idle" size={72} />
        <div className="pb-2">
          <span className="chip bg-accent/10 text-accent text-xs uppercase tracking-wider">{t('theory')}</span>
          <h1 className="text-3xl font-bold mt-1 leading-tight">{plain(tl(lessonCard.title))}</h1>
        </div>
      </div>
      <RichText text={tl(lessonCard.body)} className="text-[17px] text-ink/85" />
      {extra && (
        <div className="rounded-card bg-raised px-4 py-3 text-[15px] flex gap-3">
          <Bulb className="text-accent2 shrink-0 mt-0.5" />
          <RichText text={tl(extra)} />
        </div>
      )}
      {lessonCard.demo && <Demo demo={lessonCard.demo} />}
      {lessonCard.genre && (
        <div className="rounded-card border border-accent/25 bg-accent/5 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wider text-accent mb-1">♪ {t(genre)}</p>
          <RichText text={tl(lessonCard.genre[genre])} className="text-[15px]" />
        </div>
      )}
    </div>
  )
}

function QuestionView({
  q,
  retry,
  selected,
  status,
  onSelect,
  onKey,
  marks,
  onPlay,
}: {
  q: Question
  retry: boolean
  selected: string | null
  status: Status
  onSelect: (k: string) => void
  onKey: (note: string, m: number) => void
  marks: Record<number, KeyMark>
  onPlay: (a: { notes: string[]; mode?: 'seq' | 'chord' }) => void
}) {
  const { t, locale } = useT()
  const { inline } = useRich()
  return (
    <div className="pt-2 space-y-6">
      <div>
        {retry && <span className="chip bg-accent2/15 text-accent2 text-xs mb-2">{locale === 'es' ? 'Repaso de un error' : 'Previous mistake'}</span>}
        <h1 className="text-2xl sm:text-[28px] font-bold leading-snug">{inline(q.prompt)}</h1>
      </div>

      {q.audio && (
        <div className="flex justify-center">
          <button onClick={() => onPlay(q.audio!)} className="w-24 h-24 rounded-[28px] hero-bg text-white grid place-items-center shadow-lift active:scale-95 transition" aria-label={t('listen')}>
            <Speaker size={40} />
          </button>
        </div>
      )}

      {q.visual && q.kind === 'options' && <Demo demo={q.visual} />}
      {q.visual && q.kind === 'piano' && <Demo demo={q.visual} />}

      {q.kind === 'options' ? (
        <div className={`grid gap-3 ${q.options.length === 4 && q.options.every((o) => o.label.length < 14) ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {q.options.map((o) => {
            const state =
              status !== 'idle' && o.correct ? 'correct' : status === 'wrong' && selected === o.key ? 'wrong' : selected === o.key ? 'selected' : 'idle'
            return (
              <button key={o.key} className={`option ${o.label.length < 8 ? 'text-center text-xl font-display font-bold' : ''}`} data-state={state} onClick={() => onSelect(o.key)} disabled={status !== 'idle'}>
                <span className="flex items-center justify-between gap-2">
                  <span className="flex-1">{inline(o.label)}</span>
                  {state === 'correct' && <Check size={18} className="text-success" />}
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="pt-4">
          <Piano from={q.range[0]} to={q.range[1]} labels={q.labels ? true : false} marks={marks} onPress={onKey} disabled={status !== 'idle'} />
        </div>
      )}
    </div>
  )
}
