import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { course, isUnlocked } from '@/content/course'
import { useT } from '@/lib/i18n'
import { todayXp, useStore } from '@/store/useStore'
import { Mascot } from '@/components/Mascot'
import { Check, Lock, Star } from '@/components/Icons'
import { useRich } from '@/components/RichText'
import { Character } from '@/components/characters'
import { unitPresenter, unitReached } from '@/content/band'

const OFFSETS = [0, 52, 78, 52, 0, -52, -78, -52]

export default function Home() {
  const { t, tl } = useT()
  const { plain } = useRich()
  const nav = useNavigate()
  const { completed } = useStore((s) => s.progress)
  const progress = useStore((s) => s.progress)
  const { displayName, dailyGoal } = useStore((s) => s.settings)
  const [open, setOpen] = useState<string | null>(null)
  const today = todayXp(progress)
  const currentId = course.flatMap((u) => u.lessons).find((l) => !completed[l.id])?.id

  return (
    <div className="pt-6 space-y-10">
      {/* greeting + daily goal */}
      <section className="card p-5 flex items-center gap-4">
        <Mascot mood="idle" size={68} />
        <div className="flex-1 min-w-0">
          <p className="font-display text-xl font-bold truncate">
            {t('greeting')}
            {displayName ? `, ${displayName}` : ''}!
          </p>
          <div className="mt-2">
            <div className="flex justify-between text-xs font-semibold text-muted mb-1">
              <span>{t('dailyGoal')}</span>
              <span>
                {Math.min(today, dailyGoal)} / {dailyGoal} XP
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-raised overflow-hidden">
              <div className="h-full bar-bg rounded-full transition-all" style={{ width: `${Math.min(100, (today / dailyGoal) * 100)}%` }} />
            </div>
          </div>
        </div>
      </section>

      {course.map((unit, ui) => {
        const lessons = unit.lessons.map((l) => ({ id: l.id, title: tl(l.title), goal: tl(l.goal), ready: true }))
        const upcoming = (unit.upcoming ?? []).map((u, i) => ({ id: `${unit.id}-soon-${i}`, title: tl(u), goal: '', ready: false }))
        const nodes = [...lessons, ...upcoming]
        const done = unit.lessons.filter((l) => completed[l.id]).length
        return (
          <section key={unit.id}>
            <div className="hero-bg rounded-card p-5 text-white shadow-lift">
              <div className="flex items-center justify-between gap-3">
                {/* the musician who teaches this unit (a silhouette until you get there) */}
                <div className="shrink-0 rounded-card bg-white/15 p-1" style={{ color: 'rgb(255 255 255 / .45)' }}>
                  <Character id={unitPresenter(unit.id)} size={60} silhouette={!unitReached(unit.id, completed)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-[.18em] opacity-80 font-semibold">
                    {t('unit')} {ui + 1} · {tl(unit.level)}
                  </p>
                  <h2 className="text-2xl font-bold mt-1">{tl(unit.title)}</h2>
                  <p className="text-sm opacity-85 mt-1">{tl(unit.description)}</p>
                </div>
                {unit.lessons.length > 0 && (
                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-bold font-display">
                      {done}/{unit.lessons.length}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-8 pt-16 pb-8">
              {nodes.map((n, i) => {
                const isDone = !!completed[n.id]
                const unlocked = n.ready && isUnlocked(n.id, completed)
                const current = n.id === currentId
                return (
                  <div key={n.id} className={`relative ${open === n.id ? 'z-30' : 'z-0'}`} style={{ transform: `translateX(${OFFSETS[i % OFFSETS.length]}px)` }}>
                    {current && (
                      <motion.div
                        className="absolute -top-10 left-1/2 -translate-x-1/2 chip bg-surface border border-line text-accent shadow-soft whitespace-nowrap z-10"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.6 }}
                      >
                        {t('start')}
                      </motion.div>
                    )}
                    <button
                      onClick={() => setOpen(open === n.id ? null : n.id)}
                      className={`relative w-[72px] h-[72px] rounded-full grid place-items-center transition active:translate-y-[3px]
                        ${isDone ? 'bar-bg text-white shadow-[0_5px_0_rgb(0_0_0/0.25)]' : unlocked ? 'bg-accent text-accent-ink shadow-[0_5px_0_rgb(0_0_0/0.25)]' : 'bg-raised text-muted shadow-[0_5px_0_rgb(0_0_0/0.08)]'}
                        ${current ? 'ring-4 ring-accent/25 ring-offset-4 ring-offset-bg' : ''}`}
                      aria-label={n.title}
                    >
                      {isDone ? <Check size={30} /> : unlocked ? <Star size={30} /> : <Lock size={26} />}
                    </button>
                    <AnimatePresence>
                      {open === n.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="absolute z-20 top-[88px] left-1/2 -translate-x-1/2 w-72 card p-4 text-left"
                        >
                          <p className="font-display text-lg font-bold leading-tight">{plain(n.title)}</p>
                          {n.goal && <p className="text-sm text-muted mt-1">{n.goal}</p>}
                          {!n.ready ? (
                            <p className="chip bg-raised text-muted mt-3">{t('comingSoon')}</p>
                          ) : unlocked ? (
                            <button className="btn-primary w-full mt-3 py-3" onClick={() => nav(`/lesson/${n.id}`)}>
                              {isDone ? t('review') : t('start')}
                            </button>
                          ) : (
                            <p className="chip bg-raised text-muted mt-3">
                              <Lock size={14} /> {t('locked')}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
